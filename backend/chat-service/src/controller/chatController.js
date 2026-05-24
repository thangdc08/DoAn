import AppError from "../common/Exception/app-error.js";
import { deleteMessage, getMessageByCoversation, sendMessage } from "../service/chatService.js";

export const sentMessage = async (req, res) => {
    try {
        const data = await sendMessage(req);
        return res.json(data);
    } catch (error) {
        throw new AppError(error.message, error.code || 500);
    }
};

export const getMessage = async (req, res) => {
    try {
        const data = await getMessageByCoversation(req);
        return res.json(data);
    } catch (error) {
        throw new AppError(error.message, error.code || 500);
    }
};

export const removedMessage = async (req, res) => {
    try {
        const data = await deleteMessage(req);
        return res.json(data);
    } catch (error) {
        throw new AppError(error.message, error.code || 500);
    }
};