import mongoose from "mongoose";
import participantInfoSchema from "./participantInfo.js";
import groupInfoSchema from "./groupInfo.js";

const conversationSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    participantsHash: { type: String, index: true },
    participants: [participantInfoSchema],
    matchPostId: { type: String, index: true },
    lastMessage: { type: String },
    lastMessageDate: { type: Date },
    deleteUserIds: [{ type: String }],
    group: groupInfoSchema,
    createdDate: { type: Date, default: Date.now },
    modifiedDate: { type: Date, default: Date.now }
  },
  { collection: "conversation" }
);

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
