import ChatMessage from '../models/chatModel.js'

const findAllByConversationIdAndNotDeletedByUserOrderByCreatedDateAsc = async (conversationId, userId) => {
    return await ChatMessage.find({
        conversationId: conversationId,
        deleteUserIds: { $ne: userId }
    })
        .sort({ createdDate: 1 });
};


export {
    ChatMessage,
    findAllByConversationIdAndNotDeletedByUserOrderByCreatedDateAsc 
}