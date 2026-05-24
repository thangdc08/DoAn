import { getProfileById, getUserLogin } from '../client/index.js';
import { MessageRequestDTO } from "../dto/request/index.js";
import { MessageResponseDTO } from "../dto/response/index.js";
import ApiResponse from "../common/apiResponse.js";
import { deleteFile, uploadFiles } from '../client/mediaClient.js';
import {
    ChatMessage,
    findAllByConversationIdAndNotDeletedByUserOrderByCreatedDateAsc
} from '../repository/messageRepository.js';
import { findByConversationIdAndUserId } from '../repository/conversationRepository.js'
import AppError from '../common/Exception/app-error.js';
import { DeleteMessageDTO } from '../dto/request/deleteMessageDTO.js';
import { sendToUser } from '../configuration/websocket.js';
import { toConversationResponse } from './conversationService.js';
import { sendNotificationEvent } from '../configuration/kafka.js';
import { toParticipantResponse } from '../dto/response/index.js';

export const sendMessage = async (req) => {
    const dto = new MessageRequestDTO(req);
    dto.validate();

    const senderProfile = await getProfileLogin(req);
    const sender = toParticipantResponse(senderProfile);
    const conversation = await validateConversation(dto.conversationId, sender.id);

    // Tạo timestamp chung
    const now = new Date();
    const timestamp = now.toISOString();

    // Tạo message object
    const chatMessage = new ChatMessage({
        conversationId: dto.conversationId,
        type: dto.type,
        message: dto.message,
        sender: sender,
        deleteUserIds: [],
        createdDate: now
    });

    // Upload files nếu là message type FILE
    if (dto.files && dto.type === "FILE") {
        const fileUrls = await uploadFiles(dto.files);
        chatMessage.fileUrls = fileUrls;
    }

    // Update conversation
    conversation.lastMessage = dto.type === "FILE"
        ? "Đã gửi tệp đính kèm"
        : dto.message;
    conversation.lastMessageDate = now;
    conversation.modifiedDate = now;
    conversation.deleteUserIds = []; // Reset deleteUserIds khi có tin nhắn mới

    // Save cả 2 song song
    await Promise.all([
        conversation.save(),
        chatMessage.save()
    ]);

    // Tạo tất cả conversation responses song song
    const conversationResponses = await Promise.all(
        conversation.participants.map(participant =>
            toConversationResponse(conversation, participant, req)
        )
    );

    // Gửi notification đến tất cả participants
    conversation.participants.forEach(async (participant, index) => {
        // Gửi update conversation
        sendToUser(participant.id, {
            type: 'update_conversation',
            conversation: conversationResponses[index],
            timestamp
        });

        // Gửi new message
        sendToUser(participant.id, {
            type: 'new_message',
            message: await toMessageResponseDTO(chatMessage, participant.id, req),
            timestamp
        }, `/user/${participant.id}/queue/messages/${conversation.id}`);
    });

    const to = conversation.participants.filter(participant => participant.id !== sender.id);
    // Gửi notification event qua Kafka
    to.forEach(participant => {
        const notificationData = notificationPayload(conversation, participant.id, sender);
        sendNotificationEvent(notificationData);
    });

    return ApiResponse.success(await toMessageResponseDTO(chatMessage, sender.id, req));
};

export const getMessageByCoversation = async (req) => {
    const { id } = await getProfileLogin(req);
    const conversationId = req.params.id;

    await validateConversation(conversationId, id);

    const messages = await findAllByConversationIdAndNotDeletedByUserOrderByCreatedDateAsc(conversationId, id);

    const messagesResponse = await Promise.all(
        messages.map(async message => await toMessageResponseDTO(message, id, req))
    );

    return ApiResponse.success(messagesResponse);
};

export const deleteMessage = async (req) => {
    const dto = new DeleteMessageDTO(req);
    dto.validate();
    const message = await ChatMessage.findById(dto.messageId);
    if (!message) {
        throw new AppError("Tin nhắn không tồn tại", 400);
    }
    const { id } = await getProfileLogin(req);
    const conversation = await validateConversation(message.conversationId, id);

    if (dto.type === 'REVOKED') {
        if (id !== message.sender.id) {
            throw new AppError("Bạn không có quyền thu hồi tin nhắn này", 403);
        }

        if (message.type === 'FILE') {
            const fileUrls = message.fileUrls || [];
            console.log("File URLs to delete:", fileUrls);
            await Promise.all(fileUrls.map(url => deleteFile(url)));
        }

        message.message = "Tin nhắn đã được thu hồi";
        message.fileUrls = [];
        message.type = 'REVOKED';

        const now = new Date();

        conversation.lastMessage = 'Tin nhắn đã được thu hồi';
        conversation.lastMessageDate = now;
        conversation.modifiedDate = now;

        conversation.participants.forEach(async (participant) => {
            sendToUser(participant.id, {
                type: 'update_message',
                message: await toMessageResponseDTO(message, participant.id, req),
                timestamp: now.toISOString()
            },
                `/user/${participant.id}/queue/messages/${message.conversationId}`);
        });

        await Promise.all([
            conversation.save(),
            message.save()
        ]);
        return ApiResponse.success("Thu hồi tin nhắn thành công");
    } else if (dto.type === 'DELETED') {
        if (!message.deleteUserIds.includes(id)) {
            message.deleteUserIds.push(id);
            await message.save();
        }
        return ApiResponse.success("Xóa tin nhắn thành công");
    }

};

const notificationPayload = (conversation, to, sender) => ({
    userId: to,
    message: "Bạn có tin nhắn mới từ " + sender.fullName,
    target: {
        id: conversation.id,
        link: `/message/${conversation.id}`,
        type: "CONVERSATION"
    },
    type: "CHAT_MESSAGE"
});

const toMessageResponseDTO = async (chatMessage, id, req) => {
    const isMe = chatMessage?.sender?.id === id;
    const memberProfile = await getProfileById(chatMessage.sender.id, req);
    return new MessageResponseDTO(chatMessage, memberProfile, isMe);
}

const validateConversation = async (conversationId, userId) => {
    const conversation = await findByConversationIdAndUserId(conversationId, userId);
    if (!conversation) {
        throw new AppError("Cuộc trò chuyện không tồn tại", 400);
    }
    return conversation;
}

const getProfileLogin = async (req) => {
    return await getUserLogin(req);
};
