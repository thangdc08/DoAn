import AppError from "../../common/Exception/app-error.js";
export class ConversationRequestDTO {
    constructor(req) {
        this.type = req.body.type; 
        this.memberIds = req.body.memberIds;

        // Nếu là string thì parse
        if (typeof this.memberIds === "string") {
            try {
                this.memberIds = JSON.parse(this.memberIds);
            } catch {
                this.memberIds = this.memberIds.split(",").map(m => m.trim());
            }
        }

        this.groupName = req.body.groupName || null;
        this.avatar = req.file || null;
    }

    validate() {
        if (!this.memberIds || this.memberIds.length < 1) {
            throw new AppError("Phải có ít nhất 1 thành viên", 400);
        }
        if (this.type !== "PRIVATE" && this.type !== "GROUP") {
            throw new AppError("Loại cuộc trò chuyện không hợp lệ", 400);
        }
        if (this.type === "GROUP" && (!this.groupName || this.groupName.trim() === "")) {
            throw new AppError("Cuộc trò chuyện nhóm phải có tên nhóm", 400);
        }
        return true;
    }
}
