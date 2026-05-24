import ApiResponse from '../common/apiResponse.js';
import AppError from '../common/Exception/app-error.js';
import crypto from 'crypto';
import { findAllByParticipantIdAndNotDeleted, Conversation } from '../repository/conversationRepository.js';
import { toParticipantResponse, ConversationDTO } from '../dto/response/index.js';
import { ConversationRequestDTO, DeleteConversationDTO, MemberDTO, UpdateConversationDTO } from '../dto/request/index.js';
import { uploadFile, getProfileById, getUserLogin } from '../client/index.js';
import { ChatMessage, findAllByConversationIdAndNotDeletedByUserOrderByCreatedDateAsc } from '../repository/messageRepository.js';
import { sendToUser } from '../configuration/websocket.js';
import { sendNotificationEvent } from '../configuration/kafka.js';

export const createConversation = async (req) => {
    let response;
    if (req.body.type === "PRIVATE") {
        response = await getOrCreatePrivateConversation(req);
    } else {
        response = await createGroupConversation(req);
    }
    return ApiResponse.success(response);
};

export const myConversations = async (req) => {
    try {
        const token = req.token;
        const user = await getUserLogin(req, token || null);
        const conversations = await findAllByParticipantIdAndNotDeleted(user.id);

        const conversationResponses = await Promise.all(
            conversations.map(conversation => toConversationResponse(conversation, user, req))
        );
        return ApiResponse.success(conversationResponses);
    } catch (error) {
        console.log(error);
        throw new AppError(error?.message || "FAILED_TO_FETCH_CONVERSATIONS", error?.code || 500);
    }
};

export const getConversationById = async (req) => {
    const user = await getUserLogin(req);
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) throw new AppError("Cuộc trò chuyện không tồn tại", 400);

    const isParticipant = conversation.participants.some(p => p.id === user.id);
    if (!isParticipant) throw new AppError("Bạn không có quyền truy cập cuộc trò chuyện này", 403);

    return ApiResponse.success(await toConversationResponse(conversation, user, req));
}

export const addMemberToGroup = async (req) => {
    const dto = new MemberDTO(req);
    dto.validate();
    const conversation = await Conversation.findById(dto.conversationId);
    if (!conversation) {
        throw new AppError("Cuộc trò chuyện không tồn tại", 400);
    }
    const user = await getUserLogin(req);
    checkIsGroup(conversation.type);
    checkPermission(conversation.group?.admin?.id, user.id);

    const currentMemberIds = new Set(conversation.participants.map(i => i.id));
    const newMembers = await Promise.all(
        dto.userIds
            .filter(id => !currentMemberIds.has(id))
            .map(id => getProfileById(id, req))
    );
    const lastMessage = `${user.fullName} đã thêm ${newMembers.map(m => m.fullName).join(', ')} vào nhóm.`;
    conversation.lastMessage = lastMessage;
    conversation.lastMessageDate = new Date();

    conversation.participants.push(
        ...newMembers.map(profile => toParticipantResponse(profile))
    );

    conversation.participants.forEach(async (participant) => {
        sendToUser(participant.id, {
            type: 'update_conversation',
            conversation: await toConversationResponse(conversation, participant, req),
            timestamp: new Date().toISOString()
        });
    });

    conversation.modifiedDate = new Date();
    await conversation.save();

    return ApiResponse.success(toConversationResponse(conversation, user, req));
};

export const leaveConversation = async (req) => {
    const dto = new MemberDTO(req);
    dto.validate();

    const conversation = await Conversation.findById(dto.conversationId);
    if (!conversation) throw new AppError("Cuộc trò chuyện không tồn tại", 400);

    const user = await getUserLogin(req);
    checkIsGroup(conversation.type);

    const userIds = Array.isArray(dto.userIds) ? dto.userIds : [];
    const removingAdmin = userIds.includes(conversation.group?.admin?.id);

    // Validate permissions
    if (dto.type === "KICK") {
        checkPermission(conversation.group?.admin?.id, user.id);
        if (removingAdmin) throw new AppError("Bạn không thể kick chính mình", 400);
    } else if (dto.type === "LEAVE") {
        if (!userIds.includes(user.id)) {
            throw new AppError("Bạn chỉ có thể rời nhóm cho chính mình", 403);
        }
    } else {
        throw new AppError("Loại hành động không hợp lệ", 400);
    }

    // Validate members exist in group
    const currentMemberIds = new Set(conversation.participants.map(i => i.id));
    if (userIds.some(id => !currentMemberIds.has(id))) {
        throw new AppError("Thành viên không tồn tại trong nhóm", 400);
    }

    // Get removed members info before filtering
    const removedMembers = conversation.participants.filter(p => userIds.includes(p.id));
    const removedNames = removedMembers.map(m => m.fullName).join(', ');

    // Remove members from conversation
    conversation.participants = conversation.participants.filter(
        p => !userIds.includes(p.id)
    );

    // If only 1 or 0 members left, delete the group
    if (conversation.participants.length <= 1) {
        // Notify all remaining participants before deletion
        const allParticipants = [...conversation.participants, ...removedMembers];
        allParticipants.forEach(participant => {
            sendToUser(participant.id, {
                type: 'delete_conversation',
                conversationId: conversation._id,
                timestamp: new Date().toISOString()
            });
        });

        await conversation.deleteOne();
        await ChatMessage.deleteMany({ conversationId: conversation._id });
        return ApiResponse.success("Nhóm đã bị xóa do không đủ thành viên");
    }

    // Assign new admin if current admin is removed
    if (removingAdmin && conversation.participants.length > 0) {
        const randomIndex = Math.floor(Math.random() * conversation.participants.length);
        conversation.group.admin = conversation.participants[randomIndex];
    }

    // Update last message
    const now = new Date();
    const timestamp = now.toISOString();

    if (dto.type === "KICK") {
        conversation.lastMessage = `${user.fullName} đã xóa ${removedNames} khỏi nhóm`;

        sendNotificationEvent(notificationPayload(conversation, removedMembers[0]?.id, `Bạn đã bị xóa khỏi nhóm ${conversation.group?.name || ''}`));
        conversation.participants.forEach(participant => {
            if (user.id !== participant.id) {
                sendNotificationEvent(notificationPayload(conversation, participant.id, `${removedNames} đã bị xóa khỏi nhóm ${conversation.group?.name || ''}`));
            }
        });
    } else {
        conversation.lastMessage = `${removedNames} đã rời khỏi nhóm`;
        conversation.participants.forEach(participant => {
            if (user.id !== participant.id) {
                sendNotificationEvent(notificationPayload(conversation, participant.id, `${removedNames} đã rời khỏi nhóm ${conversation.group?.name || ''}`));
            }
        });
    }

    conversation.lastMessageDate = now;
    conversation.modifiedDate = now;

    await conversation.save();

    // Prepare conversation responses for all participants
    const conversationResponses = await Promise.all(
        conversation.participants.map(participant =>
            toConversationResponse(conversation, participant, req)
        )
    );

    // Send update to remaining members
    conversation.participants.forEach((participant, index) => {
        sendToUser(participant.id, {
            type: 'update_conversation',
            conversation: conversationResponses[index],
            timestamp
        });
    });

    return ApiResponse.success(dto.type === "KICK"
        ? `Đã xóa ${removedNames} khỏi nhóm`
        : "Đã rời khỏi nhóm thành công");
};

export const updateConversation = async (req) => {
    const dto = new UpdateConversationDTO(req);
    dto.validate();

    const user = await getUserLogin(req);
    const conversation = await Conversation.findById(dto.conversationId);
    if (!conversation) throw new AppError("Cuộc trò chuyện không tồn tại", 400);

    checkIsGroup(conversation.type);
    checkPermission(conversation.group?.admin?.id, user.id);

    if (dto.groupName && dto.groupName.trim() && dto.groupName.trim() !== "null" && dto.groupName.trim() !== "undefined") {
        conversation.group.name = dto.groupName.trim();
    }

    if (dto.adminId && dto.adminId !== "null" && dto.adminId !== "undefined") {
        const profile = await getProfileById(dto.adminId, req);
        if (profile) conversation.group.admin = toParticipantResponse(profile);
    }

    if (dto.avatarGroup && typeof dto.avatarGroup !== "string") {
        conversation.group.avatarUrl = await uploadImage(dto.avatarGroup);
    }

    const now = new Date();
    conversation.lastMessage = `${user.fullName} đã cập nhật thông tin nhóm.`;
    conversation.lastMessageDate = now;
    const timestamp = now.toISOString();
    conversation.participants.forEach(async (participant) => {
        sendToUser(participant.id, {
            type: 'update_conversation',
            conversation: await toConversationResponse(conversation, participant, req),
            timestamp
        });
        if (participant.id !== user.id)
            sendNotificationEvent(notificationPayload(conversation, participant.id, "Nhóm " + (conversation.group?.name || "mới tạo") + " đã được cập nhật thông tin"));
    });
    conversation.modifiedDate = now;
    await conversation.save();

    return ApiResponse.success(toConversationResponse(conversation, user, req));
};

export const deleteConversation = async (req) => {
    const dto = new DeleteConversationDTO(req);
    dto.validate();
    const user = await getUserLogin(req);

    const conversation = await Conversation.findById(dto.conversationId);
    if (!conversation) throw new AppError("Cuộc trò chuyện không tồn tại", 400);

    return conversation.type === 'GROUP'
        ? await handleGroupDeletion(conversation, dto.type, user.id)
        : await handlePrivateDeletion(conversation, dto.type, user.id);
};

const handleGroupDeletion = async (conversation, type, currentUserId) => {
    switch (type) {
        case 'ALL':
            checkPermission(conversation.group?.admin?.id, currentUserId);

            conversation.participants.forEach(async (participant) => {
                sendToUser(participant.id, {
                    type: 'delete_conversation',
                    conversationId: conversation._id,
                    timestamp: new Date().toISOString()
                });
                if (participant.id !== currentUserId)
                    sendNotificationEvent(notificationPayload(conversation, participant.id, "Nhóm " + (conversation.group?.name || "mới tạo") + " đã bị xóa"));
            });

            await Promise.all([
                await Conversation.findByIdAndDelete(conversation._id),
                await ChatMessage.deleteMany({ conversationId: conversation._id })
            ]);



            break;
        case 'ONE':
            await handleSingleDeletion(conversation, currentUserId);
            break;
        default:
            throw new AppError("Kiểu xóa không hợp lệ", 400);
    }
    return ApiResponse.success("Xóa nhóm thành công", 200);
}

const handlePrivateDeletion = async (conversation, type, currentUserId) => {
    switch (type) {
        case 'ALL':
            conversation.participants.forEach(async (participant) => {
                sendToUser(participant.id, {
                    type: 'delete_conversation',
                    conversationId: conversation._id,
                    timestamp: new Date().toISOString()
                });
            });

            await Promise.all([
                Conversation.deleteOne({ _id: conversation._id }),
                ChatMessage.deleteMany({ conversationId: conversation._id })
            ]);

            const currentUser = conversation.participants.find(p => p.id === currentUserId);
            const friend = conversation.participants.find(p => p.id !== currentUserId);

            if (friend && currentUser)
                sendNotificationEvent(notificationPayload(conversation, friend.id, currentUser.fullName + " đã xóa cuộc trò chuyện"));

            return ApiResponse.success("Xóa cuộc trò chuyện thành công");
        case 'ONE':
            handleSingleDeletion(conversation, currentUserId);
            break;
        default:
            throw new AppError("Kiểu xóa không hợp lệ ", 400);
    }
}

const handleSingleDeletion = async (conversation, currentUserId) => {
    if (!conversation.deleteUserIds.some(id => id === currentUserId)) {
        conversation.deleteUserIds.push(currentUserId);
    }

    sendToUser(currentUserId, {
        type: 'delete_conversation',
        conversationId: conversation._id,
        timestamp: new Date().toISOString()
    });

    const userInConversation = conversation.participants.map(participants => participants.id);

    const allDeleted = userInConversation.every(id =>
        conversation.deleteUserIds.includes(id)
    );

    if (allDeleted) {
        await conversation.deleteOne();
        await ChatMessage.deleteMany({ conversationId: conversation._id });
        return ApiResponse.success("Cuộc trò chuyện đã bị xóa hoàn toàn.", 200);
    } else {
        const messages = await findAllByConversationIdAndNotDeletedByUserOrderByCreatedDateAsc(conversation._id, currentUserId);
        messages.forEach(async (message) => {
            if (!message.deleteUserIds.includes(currentUserId)) {
                message.deleteUserIds.push(currentUserId);
                await message.save();
            }
        });

        await conversation.save();
        return ApiResponse.success('Đã ẩn cuộc trò chuyện cho người dùng.', 200)
    }
}

const checkPermission = (adminId, userId) => {
    if (adminId !== userId) throw new AppError("Bạn không có quyền thao tác", 403);
};


const checkIsGroup = type => {
    if (type !== "GROUP") throw new AppError("Phải là nhóm", 400);
};

const createGroupConversation = async (req) => {
    const dto = new ConversationRequestDTO(req);
    dto.validate();
    const userLogin = await getUserLogin(req);
    const memberProfilesPromises = dto.memberIds.map(id => getProfileById(id, req));
    const memberProfiles = await Promise.all(memberProfilesPromises);
    memberProfiles.push(userLogin)
    const now = new Date();
    let conversation = new Conversation({
        type: "GROUP",
        participants: memberProfiles,
        group: {
            name: dto.groupName,
            avatarUrl: await uploadImage(dto.avatar),
            admin: toParticipantResponse(userLogin),
        },
        lastMessage: "Nhóm được tạo",
        lastMessageDate: now,
        createdDate: now,
        modifiedDate: now,
    });

    memberProfiles.forEach(async (profile) => {
        sendToUser(profile.id, {
            type: 'new_conversation',
            conversation: await toConversationResponse(conversation, profile, req),
            timestamp: now.toISOString()
        });
        if (profile.id !== userLogin.id)
            sendNotificationEvent(notificationPayload(conversation, profile.id, "Bạn đã được thêm vào nhóm " + (dto.groupName || "mới tạo")));
    });

    await conversation.save();
    return toConversationResponse(conversation, userLogin, req);
}

const uploadImage = async (file) => {
    if (!file) return '';
    return await uploadFile(file);
};

const getOrCreatePrivateConversation = async (req) => {
    const dto = new ConversationRequestDTO(req);
    dto.validate();

    const [userLogin, memberProfile] = await Promise.all([
        getUserLogin(req),
        getProfileById(dto.memberIds[0], req)
    ]);
    const memberHash = generateMemberHash([userLogin.id, memberProfile.id]);
    let conversation = await Conversation.findOne({ participantsHash: memberHash });
    const now = new Date();
    const timestamp = now.toISOString();

    if (conversation) {
        const wasDeleted = conversation.deleteUserIds.includes(userLogin.id);

        if (wasDeleted) {
            conversation.deleteUserIds = conversation.deleteUserIds.filter(id => id !== userLogin.id);
            conversation.modifiedDate = now;
            await conversation.save();
        }
        const conversationResponseForUser = await toConversationResponse(conversation, userLogin, req);
        sendToUser(userLogin.id, {
            type: 'new_conversation',
            conversation: conversationResponseForUser,
            timestamp
        });
        return conversationResponseForUser;
    }
    const participantInfos = [
        toParticipantResponse(userLogin),
        toParticipantResponse(memberProfile),
    ];
    conversation = new Conversation({
        type: "PRIVATE",
        participantsHash: memberHash,
        participants: participantInfos,
        createdDate: now,
        modifiedDate: now,
    });
    sendNotificationEvent(notificationPayload(conversation, dto.memberIds[0], userLogin?.fullName + " đã bắt đầu trò chuyện với bạn"));
    await conversation.save();

    const [conversationResponseForUser, conversationResponseForMember] = await Promise.all([
        toConversationResponse(conversation, userLogin, req),
        toConversationResponse(conversation, memberProfile, req)
    ]);

    sendToUser(userLogin.id, {
        type: 'new_conversation',
        conversation: conversationResponseForUser,
        timestamp
    });

    sendToUser(memberProfile.id, {
        type: 'new_conversation',
        conversation: conversationResponseForMember,
        timestamp
    });

    return conversationResponseForUser;
};

export const listenersliveStatus = async (status) => {
    try {
        const { accId, isOnline } = status;
        const lastSeen = new Date();
        
        console.log(`📡 Received live status: accId=${accId}, isOnline=${isOnline}`);

        // Tìm tất cả conversations có participant với accountId này
        const conversations = await Conversation.find({
            'participants.accountId': accId
        });

        if (!conversations || conversations.length === 0) {
            console.log(`⚠️ No conversations found for accountId: ${accId}`);
            return;
        }

        console.log(`📊 Found ${conversations.length} conversations for accountId: ${accId}`);

        // Tạo Map để nhóm conversations theo userId
        const userConversationsMap = new Map();

        conversations.forEach(conversation => {
            let hasUpdated = false;
            
            // Cập nhật status cho participant có accountId trùng khớp
            conversation.participants.forEach(participant => {
                if (participant.accountId === accId) {
                    // ✅ Cập nhật status trực tiếp vào participant object
                    participant.isOnline = isOnline;
                    participant.lastSeen = lastSeen ? new Date(lastSeen) : new Date();
                    hasUpdated = true;
                    
                    console.log(`✅ Updated status for participant ${participant.id}: isOnline=${isOnline}`);
                }
            });

            // Nhóm conversations theo các user khác (để gửi notification)
            if (hasUpdated) {
                conversation.participants.forEach(p => {
                    if (p.accountId !== accId) {
                        if (!userConversationsMap.has(p.id)) {
                            userConversationsMap.set(p.id, []);
                        }
                        userConversationsMap.get(p.id).push(conversation);
                    }
                });
            }
        });

        // ✅ Save tất cả conversations đã update vào DB
        await Promise.all(
            conversations.map(conv => conv.save())
        );

        console.log(`💾 Saved ${conversations.length} conversations to DB`);

        // Gửi update đến các users có conversation với user này
        const timestamp = new Date().toISOString();
        const notificationPromises = [];

        for (const [userId, userConversations] of userConversationsMap) {
            // Tạo conversation responses cho user này
            const conversationResponses = await Promise.all(
                userConversations.map(async (conv) => {
                    // Tìm user profile để tạo response
                    const userParticipant = conv.participants.find(p => p.id === userId);
                    if (userParticipant) {
                        return toConversationResponse(conv, userParticipant, { token: null });
                    }
                    return null;
                })
            );

            // Filter null values
            const validResponses = conversationResponses.filter(r => r !== null);

            if (validResponses.length > 0) {
                // Gửi update status đến user qua WebSocket
                notificationPromises.push(
                    sendToUser(userId, {
                        type: 'update_online_status',
                        accountId: accId,
                        isOnline: isOnline,
                        lastSeen: lastSeen,
                        conversations: validResponses,
                        timestamp
                    })
                );
            }
        }

        // Đợi tất cả notifications được gửi
        await Promise.all(notificationPromises);

        console.log(`✅ Live status updated and saved for ${conversations.length} conversations`);
    } catch (error) {
        console.error('❌ Error in listenersliveStatus:', error);
        throw error;
    }
};

export const toConversationResponse = async (conversation, user, req) => {
    let conversationDTO = new ConversationDTO(conversation);

    if (conversationDTO.type === 'PRIVATE') {
        const otherParticipant = conversationDTO.participants.find(p => p.id !== user.id);

        if (otherParticipant) {
            try {
                // Lấy profile info nếu có req.token
                const memberProfile =  await getProfileById(otherParticipant.id, req);

                conversationDTO.name = memberProfile?.fullName || otherParticipant.fullName;
                conversationDTO.avatarUrl = memberProfile?.avatarUrl || otherParticipant.avatarUrl;
                conversationDTO.isVerified = memberProfile?.isVerified || otherParticipant.isVerified || false;

                // ✅ Sử dụng status từ participant trong DB (đã được update bởi listenersliveStatus)
                conversationDTO.isOnline = otherParticipant.isOnline || false;
                conversationDTO.lastSeen = otherParticipant.lastSeen;
            } catch (error) {
                console.error('Error getting profile:', error);
                // Fallback to participant data từ DB
                conversationDTO.name = otherParticipant.fullName;
                conversationDTO.avatarUrl = otherParticipant.avatarUrl;
                conversationDTO.isOnline = otherParticipant.isOnline || false;
                conversationDTO.lastSeen = otherParticipant.lastSeen;
            }
        } else {
            conversationDTO.name = user.fullName;
        }
    } else {
        conversationDTO.name = conversationDTO.group?.name || 'Group';
        conversationDTO.avatarUrl = conversationDTO.group?.avatarUrl || '';
    }

    return conversationDTO;
};

const generateMemberHash = (memberIds) => {
    try {
        if (!Array.isArray(memberIds) || memberIds.length === 0) {
            throw new AppError("memberIds must not be empty", 400);
        }
        const sorted = [...memberIds].sort();
        const joined = sorted.join("_");

        return crypto.createHash("md5").update(joined, "utf8").digest("hex");
    } catch (err) {
        console.error("generateMemberHash error:", err);
        throw new AppError("ALGORITHM_NOT_SUPPORTED", 500);
    }
};

const notificationPayload = (conversation, to, message) => ({
    userId: to,
    message: message,
    target: {
        id: conversation.id,
        link: `/message/${conversation.id}`,
        type: "CONVERSATION"
    },
    type: "CONVERSATION_MESSAGE"
});
