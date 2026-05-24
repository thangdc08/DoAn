import { useEffect, useRef, useState } from 'react';
import {
  Input,
  Button,
  Avatar,
  Typography,
  List,
  Badge,
  Spin,
  Empty,
  Tooltip,
  message,
  Space,
} from 'antd';
import {
  SearchOutlined,
  SendOutlined,
  PaperClipOutlined,
  UserOutlined,
  TeamOutlined,
  InfoCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { chatApi } from '../../services/chatApi';
import type { ChatMessage } from '../../services/chatApi';
import { chatSocket } from '../../services/chatSocket';
import { useChatStore } from '../../stores/chatStore';
import { useAuthStore } from '../../stores/authStore';
import { BRAND } from '../../theme/antdTheme';

const { Text, Title } = Typography;
const { Search } = Input;

export default function ChatPage() {
  const { user } = useAuthStore();
  const {
    conversations,
    activeConversationId,
    setActiveConversation,
    messages,
    setMessages,
    addMessage,
    setConversations,
  } = useChatStore();

  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: convsData, isLoading: loadingConvs } = useQuery({
    queryKey: ['chat-conversations'],
    queryFn: chatApi.getConversations,
  });

  const { data: msgsData, isLoading: loadingMsgs } = useQuery({
    queryKey: ['chat-messages', activeConversationId],
    queryFn: () =>
      activeConversationId
        ? chatApi.getMessages(activeConversationId)
        : Promise.resolve([]),
    enabled: !!activeConversationId,
    refetchInterval: activeConversationId ? 1500 : false,
  });

  useEffect(() => {
    chatSocket.connect();
    return () => chatSocket.disconnect();
  }, []);

  useEffect(() => {
    if (convsData) setConversations(convsData || []);
  }, [convsData, setConversations]);

  useEffect(() => {
    if (activeConversationId && msgsData) {
      setMessages(activeConversationId, msgsData || []);
    }
  }, [activeConversationId, msgsData, setMessages]);

  useEffect(() => {
    if (!activeConversationId) return;

    chatSocket.connect();
    chatSocket.subscribeToConversation(activeConversationId, (newMsg) => {
      addMessage(activeConversationId, newMsg);
    });

    return () => {
      chatSocket.unsubscribeFromConversation(activeConversationId);
    };
  }, [activeConversationId, addMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeConversationId]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !activeConversationId) return;

    const optimisticMsg: ChatMessage = {
      id: 'temp-' + Date.now(),
      senderId: user?.id || '',
      senderName: user?.fullName || 'Me',
      content,
      timestamp: new Date().toISOString(),
      conversationId: activeConversationId,
      type: 'TEXT',
    };

    addMessage(activeConversationId, optimisticMsg);
    const sentByWs = chatSocket.sendChatMessage(activeConversationId, content);
    if (!sentByWs) {
      try {
        await chatApi.sendMessage({
          conversationId: activeConversationId,
          content,
          type: 'TEXT',
        });
      } catch {
        message.error('Gui tin nhan that bai');
      }
    }
  };

  const handleCreatePrivateConversation = async () => {
    const memberId = window.prompt('Nhap userId nguoi ban muon nhan tin:');
    if (!memberId?.trim()) return;

    try {
      const created = await chatApi.createPrivateConversation(memberId.trim());
      const nextConvs = await chatApi.getConversations();
      setConversations(nextConvs || []);
      if (created?.id) setActiveConversation(created.id);
      message.success('Tao cuoc tro chuyen thanh cong');
    } catch (error: any) {
      const apiMsg = error?.response?.data?.message || 'Khong the tao cuoc tro chuyen';
      message.error(apiMsg);
    }
  };

  const filteredConversations = (convsData || []).filter((c: any) =>
    c.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      style={{
        height: 'calc(100vh - 72px)',
        display: 'flex',
        background: '#f0f2f5',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: 360,
          background: '#fff',
          borderRight: '1px solid #dcdcdc',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ padding: 20, borderBottom: '1px solid #f0f0f0' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 16,
            }}
          >
            <Title level={4} style={{ marginBottom: 0 }}>
              Tin nhan
            </Title>
            <Tooltip title="Tao cuoc tro chuyen rieng moi">
              <Button
                type="primary"
                shape="circle"
                icon={<PlusOutlined />}
                onClick={handleCreatePrivateConversation}
              />
            </Tooltip>
          </div>

          <Search
            placeholder="Tim cuoc tro chuyen..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ borderRadius: 12 }}
          />
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loadingConvs ? (
            <div style={{ textAlign: 'center', padding: 40 }}>
              <Spin />
            </div>
          ) : filteredConversations.length === 0 ? (
            <Empty description="Khong co tin nhan nao" style={{ marginTop: 40 }} />
          ) : (
            <List
              itemLayout="horizontal"
              dataSource={filteredConversations}
              renderItem={(conv: any) => (
                <List.Item
                  onClick={() => setActiveConversation(conv.id)}
                  style={{
                    padding: '12px 20px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background:
                      activeConversationId === conv.id ? '#e6f4ff' : 'transparent',
                    borderBottom: '1px solid #f9f9f9',
                  }}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        style={{
                          backgroundColor:
                            conv.type === 'GROUP' ? '#1890ff' : '#87d068',
                        }}
                        icon={
                          conv.type === 'GROUP' ? <TeamOutlined /> : <UserOutlined />
                        }
                      />
                    }
                    title={
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text strong>{conv.name || 'Nguoi dung'}</Text>
                        <Text type="secondary" style={{ fontSize: 11 }}>
                          {conv.lastMessageTime
                            ? new Date(conv.lastMessageTime).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : ''}
                        </Text>
                      </div>
                    }
                    description={
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Text type="secondary" ellipsis style={{ maxWidth: 180 }}>
                          {conv.lastMessage || 'Bat dau tro chuyen...'}
                        </Text>
                        {conv.unreadCount > 0 && (
                          <Badge
                            count={conv.unreadCount}
                            size="small"
                            style={{ backgroundColor: BRAND.primary }}
                          />
                        )}
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff' }}>
        {activeConversationId ? (
          <>
            <div
              style={{
                padding: '16px 24px',
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#fff',
                zIndex: 10,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar size="large" style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                <div>
                  <Text strong style={{ fontSize: 16 }}>
                    {conversations.find((c: any) => c.id === activeConversationId)?.name ||
                      'Cuoc hoi thoai'}
                  </Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Dang truc tuyen
                  </Text>
                </div>
              </div>
              <Space>
                <Tooltip title="Thong tin chi tiet">
                  <Button type="text" icon={<InfoCircleOutlined />} />
                </Tooltip>
              </Space>
            </div>

            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: 24,
                background: '#f9f9f9',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              {loadingMsgs ? (
                <div style={{ textAlign: 'center', padding: 40 }}>
                  <Spin />
                </div>
              ) : (
                (messages[activeConversationId] || []).map((msg) => {
                  const isMe = msg.senderId === user?.id;
                  return (
                    <div
                      key={msg.id}
                      style={{
                        display: 'flex',
                        flexDirection: isMe ? 'row-reverse' : 'row',
                        marginBottom: 8,
                      }}
                    >
                      {!isMe && (
                        <Avatar
                          size="small"
                          style={{ marginRight: 8, alignSelf: 'flex-start' }}
                          icon={<UserOutlined />}
                        />
                      )}
                      <div
                        style={{
                          maxWidth: '70%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: isMe ? 'flex-end' : 'flex-start',
                        }}
                      >
                        {!isMe && (
                          <Text
                            style={{
                              fontSize: 11,
                              color: '#8c8c8c',
                              marginBottom: 4,
                              marginLeft: 4,
                            }}
                          >
                            {msg.senderName}
                          </Text>
                        )}
                        <div
                          style={{
                            padding: '8px 12px',
                            borderRadius: isMe ? '12px 12px 0 12px' : '12px 12px 12px 0',
                            background: isMe ? BRAND.primary : '#fff',
                            color: isMe ? '#fff' : '#000',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                            fontSize: 14,
                            lineHeight: 1.5,
                          }}
                        >
                          {msg.content}
                        </div>
                        <Text
                          style={{
                            fontSize: 10,
                            color: '#bfbfbf',
                            marginTop: 4,
                            textAlign: isMe ? 'right' : 'left',
                          }}
                        >
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </Text>
                      </div>
                      {isMe && (
                        <Avatar
                          size="small"
                          style={{
                            marginLeft: 8,
                            alignSelf: 'flex-start',
                            backgroundColor: BRAND.primary,
                          }}
                          icon={<UserOutlined />}
                        />
                      )}
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <div
              style={{
                padding: '20px 24px',
                borderTop: '1px solid #f0f0f0',
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <Button type="text" icon={<PaperClipOutlined />} style={{ color: '#8c8c8c' }} />
              <Input
                placeholder="Nhap tin nhan..."
                style={{ borderRadius: 24, padding: '8px 16px' }}
                onPressEnter={(e) => {
                  const val = e.currentTarget.value;
                  handleSendMessage(val);
                  e.currentTarget.value = '';
                }}
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                style={{
                  borderRadius: '50%',
                  width: 40,
                  height: 40,
                  backgroundColor: BRAND.primary,
                  borderColor: BRAND.primary,
                }}
                onClick={() => {
                  const input = document.querySelector(
                    'input[placeholder="Nhap tin nhan..."]'
                  ) as HTMLInputElement;
                  if (input) {
                    handleSendMessage(input.value);
                    input.value = '';
                  }
                }}
              />
            </div>
          </>
        ) : (
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#f9f9f9',
              color: '#8c8c8c',
            }}
          >
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                background: '#eee',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 24,
              }}
            >
              <SendOutlined style={{ fontSize: 40 }} />
            </div>
            <Title level={3}>Chao mung ban den voi BadmintonHub Chat</Title>
            <Text>Hay chon mot cuoc tro chuyen de bat dau ket noi</Text>
          </div>
        )}
      </div>
    </div>
  );
}
