import AppError from "../../common/Exception/app-error.js";

export class MessageRequestDTO {
    constructor(req) {
        this.conversationId = req.body.conversationId;
        this.message = req.body.message || '';
        this.type = req.body.type || 'TEXT';
        this.files = req.files || null;
    }
    validate() {
        if (!this.conversationId || this.conversationId.trim() === "") {
            throw new AppError("Id cuộc trò chuyện không được để trống", 400);
        }
        return true;
    }
}