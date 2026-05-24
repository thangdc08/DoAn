import mongoose from "mongoose";
import participantInfoSchema from "./participantInfo.js";

const groupInfoSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    avatarUrl: { type: String },
    admin: participantInfoSchema
  },
  { _id: false }
);

export default groupInfoSchema;
