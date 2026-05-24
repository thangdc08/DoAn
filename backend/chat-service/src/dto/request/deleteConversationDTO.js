import AppError from "../../common/Exception/app-error.js";


export class DeleteConversationDTO {
    constructor(req) {
        this.conversationId = req.body.conversationId;
        this.type = req.body.type;
    }
    validate() {
        if (!this.conversationId || this.conversationId.trim() === "") {
            throw new AppError("Id cuộc trò chuyện không được để trống", 400);
        }
    }
}