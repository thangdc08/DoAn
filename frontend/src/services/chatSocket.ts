import { Client } from '@stomp/stompjs';
import type { ChatMessage } from './chatApi';
import { normalizeChatMessage } from './chatApi';
import { useAuthStore } from '../stores/authStore';

const getWsUrl = () => {
  const envUrl = import.meta.env.VITE_CHAT_WS_URL?.trim();
  if (envUrl) return envUrl;
  return 'ws://localhost:8686/ws-chat';
};

class ChatSocketManager {
  private client: Client | null = null;
  private subscriptions: Map<string, any> = new Map();
  private messageCallbacks: Map<string, (msg: ChatMessage) => void> = new Map();
  private pendingConversationIds: Set<string> = new Set();
  private isActivating = false;

  connect() {
    if (this.client?.active || this.client?.connected || this.isActivating) return;

    const { accessToken } = useAuthStore.getState();
    if (!accessToken) return;

    this.isActivating = true;
    this.client = new Client({
      brokerURL: getWsUrl(),
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
      debug: (str) => {
        console.log('[STOMP] ' + str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.client.onConnect = () => {
      this.isActivating = false;
      this.subscribeToUserQueue();
      this.pendingConversationIds.forEach((conversationId) => {
        const cb = this.messageCallbacks.get(conversationId);
        if (cb) this.subscribeToConversation(conversationId, cb);
      });
      this.pendingConversationIds.clear();
    };

    this.client.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    this.client.onWebSocketClose = () => {
      this.isActivating = false;
    };

    this.client.activate();
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate();
      this.client = null;
    }
  }

  private subscribeToUserQueue() {
    const { user } = useAuthStore.getState();
    if (!user?.id) return;

    this.client?.subscribe(`/user/${user.id}/queue/conversations`, (message) => {
      const payload = JSON.parse(message.body);
      if (payload?.type === 'new_message' && payload?.message) {
        this.handleIncomingMessage(normalizeChatMessage(payload.message));
      }
    });
  }

  subscribeToConversation(conversationId: string, callback: (msg: ChatMessage) => void) {
    this.messageCallbacks.set(conversationId, callback);

    if (!this.client?.connected) {
      this.pendingConversationIds.add(conversationId);
      this.connect();
      return;
    }

    if (this.subscriptions.has(conversationId)) return;

    const { user } = useAuthStore.getState();
    if (!user?.id) return;

    const destination = `/user/${user.id}/queue/messages/${conversationId}`;
    const subscription = this.client.subscribe(destination, (message) => {
      const payload = JSON.parse(message.body);
      const raw = payload?.message || payload;
      callback(normalizeChatMessage(raw));
    });

    this.subscriptions.set(conversationId, subscription);
  }

  unsubscribeFromConversation(conversationId: string) {
    const sub = this.subscriptions.get(conversationId);
    if (sub) {
      sub.unsubscribe();
      this.subscriptions.delete(conversationId);
      this.messageCallbacks.delete(conversationId);
    }
  }

  sendChatMessage(conversationId: string, content: string, type: 'TEXT' | 'IMAGE' = 'TEXT') {
    const { user } = useAuthStore.getState();
    if (!this.client?.connected) {
      this.connect();
      return false;
    }
    if (!user?.id) {
      console.error('User not authenticated. Cannot send message.');
      return false;
    }

    this.client.publish({
      destination: '/app/chat.send',
      body: JSON.stringify({
        senderId: user.id,
        conversationId,
        content,
        type,
        timestamp: new Date().toISOString(),
      }),
    });

    return true;
  }

  private handleIncomingMessage(msg: ChatMessage) {
    const callback = this.messageCallbacks.get(msg.conversationId);
    if (callback) callback(msg);
  }
}

export const chatSocket = new ChatSocketManager();
