import mongoose from "mongoose";

const participantInfoSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    accountId: { type: String, required: true },
    avatarUrl: { type: String },
    fullName: { type: String },
    isVerified: { type: Boolean, default: false },
    isOnline: { type: Boolean, default: false },
    lastSeen: { type: Date, default: Date.now }
  },
  { _id: false }
);

export default participantInfoSchema;
