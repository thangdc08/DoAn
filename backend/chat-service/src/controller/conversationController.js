import AppError from "../common/Exception/app-error.js";
import {
  myConversations,
  getConversationById,
  createConversation,
  addMemberToGroup,
  leaveConversation,
  updateConversation,
  deleteConversation
} from "../service/conversationService.js";

export const getMyConversation = async (req, res) => {
  try {
    const data = await myConversations(req);
    return res.json(data);
  } catch (error) {
    throw new AppError(error.message, error.code || 500);
  }
};

export const getById = async (req, res) => {
  try {
    const data = await getConversationById(req);
    return res.json(data);
  } catch (error) {
    throw new AppError(error.message, error.code || 500);
  }
};

export const create = async (req, res) => {
  try {
    const data = await createConversation(req);
    return res.json(data);
  } catch (error) {
    throw new AppError(error.message, error.code || 500);
  }
};

export const addMember = async (req, res) => {
  try {
    const data = await addMemberToGroup(req);
    return res.json(data);
  } catch (error) {
    throw new AppError(error.message, error.code || 500);
  }
};

export const leave = async (req, res) => {
  try {
    const data = await leaveConversation(req);
    return res.json(data);
  } catch (error) {
    throw new AppError(error.message, error.code || 500);
  }
};

export const update = async (req, res) => {
  try {
    const data = await updateConversation(req);
    return res.json(data);
  } catch (error) {
   throw new AppError(error.response, error.code || 500);
  }
  
};

export const removeConversation = async (req, res) => {
  try {
    const data = await deleteConversation(req);
    return res.json(data);
  } catch (error) {
    throw new AppError(error.message, error.code || 500);
  }
};