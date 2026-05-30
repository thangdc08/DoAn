import { create } from 'zustand';
import type { Conversation, ChatMessage } from '../services/chatApi';
import { useAuthStore } from './authStore';

const LAST_READ_KEY = 'chat_last_read';

/** Returns map of { conversationId -> ISO timestamp of last read } */
const getLastReadMap = (): Record<string, string> => {
  try {
    return JSON.parse(localStorage.getItem(LAST_READ_KEY) || '{}');
  } catch {
    return {};
  }
};

/** Save a single entry into the lastRead map */
const persistLastRead = (conversationId: string, timestamp: string) => {
  const map = getLastReadMap();
  map[conversationId] = timestamp;
  localStorage.setItem(LAST_READ_KEY, JSON.stringify(map));
};

/** Compute unread count for a conversation from localStorage lastReadAt */
const computeUnread = (conv: any): number => {
  if (typeof conv.unreadCount === 'number' && conv.unreadCount > 0) return conv.unreadCount;

  const lastReadMap = getLastReadMap();
  const lastReadAt = lastReadMap[conv.id];
  const lastMsgDate = conv.lastMessageDate || conv.lastMessageTime;

  if (!lastMsgDate) return 0;
  if (!lastReadAt) return 1;

  return new Date(lastMsgDate) > new Date(lastReadAt) ? 1 : 0;
};

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Record<string, ChatMessage[]>;
  isLoading: boolean;

  setConversations: (conversations: Conversation[]) => void;
  mergeConversations: (conversations: Conversation[]) => void;
  setActiveConversation: (id: string | null) => void;
  setMessages: (conversationId: string, messages: ChatMessage[]) => void;
  addMessage: (conversationId: string, message: ChatMessage) => void;
  setLoading: (loading: boolean) => void;
  updateUnreadCount: (conversationId: string, count: number) => void;
  markConversationRead: (conversationId: string) => void;
  receiveIncomingMessage: (message: ChatMessage) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  conversations: [],
  activeConversationId: null,
  messages: {},
  isLoading: false,

  setConversations: (conversations) => set({
    conversations: conversations.map(conv => ({
      ...conv,
      lastMessageTime: (conv as any).lastMessageTime || (conv as any).lastMessageDate || null,
      unreadCount: computeUnread(conv),
    })),
  }),

  mergeConversations: (updates) => set((state) => {
    const activeId = state.activeConversationId;
    const currentMap = new Map(state.conversations.map(c => [c.id, c]));

    const merged = updates.map(upd => {
      const existing = currentMap.get(upd.id);
      const newLastMsg = (upd as any).lastMessageDate || upd.lastMessageTime;
      const existingLastMsg = (existing as any)?.lastMessageDate || existing?.lastMessageTime;

      const hasNewMsg = upd.lastMessage && upd.lastMessage !== existing?.lastMessage;
      const isActive = activeId === upd.id;
      const prevUnread = existing?.unreadCount || 0;

      return {
        ...(existing || {}),
        ...upd,
        lastMessageTime: newLastMsg || existingLastMsg || null,
        unreadCount: isActive ? 0 : hasNewMsg ? prevUnread + 1 : prevUnread,
      };
    });

    const updatedIds = new Set(updates.map(u => u.id));
    const unchanged = state.conversations.filter(c => !updatedIds.has(c.id));

    return { conversations: [...merged, ...unchanged] };
  }),

  setActiveConversation: (id) => set({ activeConversationId: id }),

  setMessages: (conversationId, messages) => set((state) => ({
    messages: {
      ...state.messages,
      [conversationId]: messages,
    },
  })),

  addMessage: (conversationId, message) => set((state) => {
    const currentMessages = state.messages[conversationId] || [];
    const optimisticIdx = currentMessages.findIndex(
      (m) => m.id.startsWith('temp-') && m.conversationId === message.conversationId && m.senderId === message.senderId
    );
    let nextMessages: ChatMessage[];
    if (optimisticIdx >= 0) {
      const filtered = currentMessages.filter((_, i) => i !== optimisticIdx);
      const exists = filtered.some((m) => m.id === message.id);
      nextMessages = exists ? filtered : [...filtered, message];
    } else {
      const exists = currentMessages.some((m) => m.id === message.id);
      nextMessages = exists ? currentMessages : [...currentMessages, message];
    }
    return { messages: { ...state.messages, [conversationId]: nextMessages } };
  }),

  setLoading: (loading) => set({ isLoading: loading }),

  updateUnreadCount: (conversationId, count) => set((state) => ({
    conversations: state.conversations.map(conv =>
      conv.id === conversationId ? { ...conv, unreadCount: count } : conv
    ),
  })),

  markConversationRead: (conversationId) => {
    persistLastRead(conversationId, new Date().toISOString());
    set((state) => ({
      conversations: state.conversations.map(conv =>
        conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
      ),
    }));
  },

  receiveIncomingMessage: (message) => set((state) => {
    const currentMessages = state.messages[message.conversationId] || [];
    const messageExists = currentMessages.some(m => m.id === message.id);
    const nextMessages = messageExists ? currentMessages : [...currentMessages, message];

    const isChattingNow = state.activeConversationId === message.conversationId;

    const convExists = state.conversations.some(c => c.id === message.conversationId);
    let nextConversations = state.conversations.map(conv => {
      if (conv.id === message.conversationId) {
        return {
          ...conv,
          lastMessage: message.content,
          lastMessageTime: message.timestamp,
          unreadCount: isChattingNow ? 0 : (conv.unreadCount || 0) + 1,
        };
      }
      return conv;
    });

    if (!convExists) {
      nextConversations = [
        {
          id: message.conversationId,
          name: message.senderName || 'Người dùng',
          type: 'PRIVATE',
          lastMessage: message.content,
          lastMessageTime: message.timestamp,
          unreadCount: isChattingNow ? 0 : 1,
          participants: [],
        },
        ...nextConversations,
      ];
    }

    const isFromMe = message.senderId === useAuthStore.getState().user?.id;
    if (!isFromMe) {
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } catch (e) {
        console.error('Audio chirp failed', e);
      }

      const event = new CustomEvent('new_chat_message', { detail: message });
      window.dispatchEvent(event);
    }

    return {
      messages: {
        ...state.messages,
        [message.conversationId]: nextMessages,
      },
      conversations: nextConversations,
    };
  }),
}));
