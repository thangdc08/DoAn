import AppError from "../../common/Exception/app-error.js";

export class MemberDTO{
    constructor(req) {
        this.conversationId = req.body.conversationId;
        this.userIds = req.body.userIds;

        // Nếu là string thì parse
        if (typeof this.userIds === "string") {
            try {
                this.userIds = JSON.parse(this.userIds);
            } catch {
                this.userIds = this.userIds.split(",").map(m => m.trim());
            }
        }
        this.type = req.body.type;
    }
    validate() {
        if (!this.userIds || this.userIds.length < 1) {
            throw new AppError("Phải có ít nhất 1 thành viên", 400);
        }
        if (!this.conversationId || this.conversationId.trim() === "") {
            throw new AppError("Id cuộc trò chuyện không được để trống", 400);
        }   
        return true;
    }
}