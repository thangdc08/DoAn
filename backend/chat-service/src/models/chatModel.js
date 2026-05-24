import mongoose from 'mongoose';
import participantInfoSchema from './participantInfo.js';

const { Schema, model } = mongoose;

const chatMessageSchema = new Schema(
  {
    conversationId: { type: String, index: true, required: true },
    type: { type: String, default: 'TEXT' }, 
    fileUrls: [{ type: String }], 
    message: { type: String },
    sender: participantInfoSchema, 
    deleteUserIds: [{ type: String }],
    createdDate: { type: Date, default: Date.now },
  },
  {
    collection: 'chat_message',
    timestamps: false,
  }
);

export default model('ChatMessage', chatMessageSchema);
