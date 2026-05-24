import express from "express";
import multer from "multer";
import { getMessage, removedMessage, sentMessage } from "../controller/chatController.js";

const upload = multer();

export const chatRoute = express.Router();

chatRoute.post("", upload.array("files"), sentMessage);
chatRoute.get('/:id', getMessage);
chatRoute.delete('', removedMessage);
