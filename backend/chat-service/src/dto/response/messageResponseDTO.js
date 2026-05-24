export class MessageResponseDTO {
    constructor(data, sender, isMe) {
        this.id = data.id;
        this.conversationId = data.conversationId;
        this.message = data.message || '';
        this.fileUrls = data.fileUrls || [];
        this.isMe = isMe;
        this.sender = sender;
        this.deleteUserIds = data.deleteUserIds || [];
        this.createdDate = data.createdDate;
    }
}