import Conversation from "../models/coversationModel.js";


const findAllByParticipantIdAndNotDeleted = async (userId) => {
    return await Conversation.find({
        participants: { $elemMatch: { id: userId } },
        deleteUserIds: { $ne: userId }
    }).sort({ modifiedDate: -1 });
};

const findByConversationIdAndUserId = async (conversationId, userId) => {
    return await Conversation.findOne({
        _id: conversationId,
        participants: { $elemMatch: { id: userId } }
    });
};


export {
    Conversation,
    findAllByParticipantIdAndNotDeleted,
    findByConversationIdAndUserId
}