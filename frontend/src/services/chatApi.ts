import apiClient from './apiClient';

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  conversationId: string;
  type: 'TEXT' | 'IMAGE' | 'SYSTEM';
}

export interface Conversation {
  id: string;
  type: 'PRIVATE' | 'GROUP';
  name?: string;
  avatarUrl?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  participants: any[];
  matchPostId?: string;
}

const unwrap = (response: any) => response?.data?.data ?? response?.data?.result ?? response?.data;

export const normalizeChatMessage = (raw: any): ChatMessage => ({
  id: raw?.id ?? `temp-${Date.now()}`,
  conversationId: raw?.conversationId ?? '',
  content: raw?.content ?? raw?.message ?? '',
  senderId: raw?.senderId ?? raw?.sender?.id ?? '',
  senderName: raw?.senderName ?? raw?.sender?.fullName ?? raw?.sender?.name ?? 'Unknown',
  timestamp: raw?.timestamp ?? raw?.createdDate ?? new Date().toISOString(),
  type: raw?.type ?? 'TEXT',
});

export const chatApi = {
  getConversations: async () => {
    const response = await apiClient.get('/chat/api/conversation');
    return unwrap(response);
  },

  getMessages: async (conversationId: string, page = 0, size = 50) => {
    const response = await apiClient.get(`/chat/api/chat/${conversationId}`, {
      params: { page, size },
    });
    const data = unwrap(response);
    return Array.isArray(data) ? data.map(normalizeChatMessage) : [];
  },

  sendMessage: async (message: {
    conversationId: string;
    content: string;
    type: 'TEXT' | 'IMAGE';
  }) => {
    const response = await apiClient.post('/chat/api/chat', {
      conversationId: message.conversationId,
      message: message.content,
      type: message.type,
    });
    return normalizeChatMessage(unwrap(response));
  },

  createPrivateConversation: async (memberId: string) => {
    const response = await apiClient.post('/chat/api/conversation', {
      type: 'PRIVATE',
      memberIds: [memberId],
    });
    return unwrap(response);
  },

  createGroupForMatch: async (matchPostId: string) => {
    const response = await apiClient.post('/chat/api/conversation', { matchPostId });
    return unwrap(response);
  },

  deleteMessage: async (messageId: string, conversationId: string, type: 'DELETED' | 'REVOKED') => {
    const response = await apiClient.delete('/chat/api/chat', {
      data: { messageId, conversationId, type },
    });
    return unwrap(response);
  },

  deleteConversation: async (conversationId: string, type: 'ALL' | 'ONE') => {
    const response = await apiClient.delete('/chat/api/conversation', {
      data: { conversationId, type },
    });
    return unwrap(response);
  },
};
