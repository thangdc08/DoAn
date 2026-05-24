import express from "express";
import { getMyConversation, getById, create, addMember, leave, update, removeConversation } from "../controller/conversationController.js";
import multer from "multer";
const upload = multer();

export const conversationRoute = express.Router();

conversationRoute.get("", getMyConversation);
conversationRoute.get("/:id", getById);
conversationRoute.post("", upload.single('avatar'), create);
conversationRoute.put("/add-member", upload.none(), addMember);
conversationRoute.put("/leave", leave);
conversationRoute.put("", upload.single('avatarGroup'), update);
conversationRoute.delete("", removeConversation);