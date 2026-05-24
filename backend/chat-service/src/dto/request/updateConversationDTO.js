import AppError from "../../common/Exception/app-error.js";

export class UpdateConversationDTO {
    constructor(req) {
        this.groupName = req.body.groupName;
        this.adminId = req.body.adminId;
        this.conversationId = req.body.conversationId;
        this.avatarGroup = req.file || null;
    }
    validate() {
        if (!this.conversationId || this.conversationId.trim() === "") {
            throw new AppError("Id cuộc trò chuyện không được để trống", 400);
        }
        return true;
    }
}