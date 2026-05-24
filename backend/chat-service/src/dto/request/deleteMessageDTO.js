import AppError from "../../common/Exception/app-error.js";

export class DeleteMessageDTO {
    constructor(req) {
        this.messageId = req.body.messageId;
        this.conversationId = req.body.conversationId;
        this.type = req.body.type;
    }
    validate() {
        if (!this.messageId || this.messageId.trim() === "") {
            throw new AppError("Id tin nhắn không được để trống", 400);
        }
        if (!this.conversationId || this.conversationId.trim() === "") {
            throw new AppError("Id cuộc trò chuyện không được để trống", 400);
        }
        const validTypes = ['DELETED', 'REVOKED'];
        if (!validTypes.includes(this.type)) {
            throw new AppError("Trạng thái xóa không hợp lệ", 400);
        }
        return true;
    }
}