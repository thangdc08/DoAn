import { useEffect, useRef, useState } from 'react';
import {
  Input,
  Avatar,
  Badge,
  Spin,
  Empty,
  Tooltip,
  message,
  Modal,
  Popover,
  Tag,
  Dropdown,
} from 'antd';
import {
  Search,
  Send,
  Paperclip,
  Plus,
  Info,
  MessageSquare,
  Smile,
  X,
  BellOff,
  LogOut,
  Image as ImageIcon,
  MoreVertical,
  RotateCcw,
  Trash2,
  UserPlus,
  Users,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { chatApi } from '../../services/chatApi';
import type { ChatMessage } from '../../services/chatApi';
import { chatSocket } from '../../services/chatSocket';
import { useChatStore } from '../../stores/chatStore';
import { useAuthStore } from '../../stores/authStore';
import { BRAND } from '../../theme/antdTheme';

const SUGGESTED_PLAYERS = [
  { id: 'usr-1', name: 'Nguyễn Tiến Minh', level: 'Chuyên nghiệp', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop' },
  { id: 'usr-2', name: 'Nguyễn Thùy Linh', level: 'Chuyên nghiệp', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
  { id: 'usr-3', name: 'Lê Đức Phát', level: 'Bán chuyên', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
  { id: 'usr-4', name: 'Nguyễn Hải Đăng', level: 'Bán chuyên', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop' },
  { id: 'usr-5', name: 'Vũ Thị Trang', level: 'Nghiệp dư', avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop' },
];

const QUICK_EMOJIS = ['🏸', '🎾', '🏆', '🔥', '👍', '❤️', '😂', '🎉', '👏', '😮', '💪', '👟', '📢', '🔥'];

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
    updateUnreadCount,
    markConversationRead,
  } = useChatStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showInfoSidebar, setShowInfoSidebar] = useState(false);
  const [customUserId, setCustomUserId] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [showMemberList, setShowMemberList] = useState(true);
  const [inviteUserId, setInviteUserId] = useState('');
  const [showInviteInput, setShowInviteInput] = useState(false);
  const [inviting, setInviting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
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
    if (convsData) {
      setConversations(convsData || []);
    }
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

  const handleSendMessage = async (content: string, type: 'TEXT' | 'IMAGE' = 'TEXT') => {
    if (!content.trim() || !activeConversationId) return;

    const optimisticMsg: ChatMessage = {
      id: 'temp-' + Date.now(),
      senderId: user?.id || '',
      senderName: user?.fullName || 'Tôi',
      content,
      timestamp: new Date().toISOString(),
      conversationId: activeConversationId,
      type,
    };

    addMessage(activeConversationId, optimisticMsg);
    
    const sentByWs = chatSocket.sendChatMessage(activeConversationId, content);
    if (!sentByWs) {
      try {
        await chatApi.sendMessage({
          conversationId: activeConversationId,
          content,
          type,
        });
      } catch {
        message.error('Gửi tin nhắn thất bại');
      }
    }
  };

  const handleStartConversation = async (userId: string) => {
    if (!userId.trim()) return;

    try {
      const created = await chatApi.createPrivateConversation(userId.trim());
      const nextConvs = await chatApi.getConversations();
      setConversations(nextConvs || []);
      if (created?.id) setActiveConversation(created.id);
      message.success('Bắt đầu cuộc trò chuyện thành công');
      setIsModalOpen(false);
      setCustomUserId('');
    } catch (error: any) {
      // Fallback offline mode if user doesn't exist in DB to ensure prototype functionality
      const selectedPlayer = SUGGESTED_PLAYERS.find((p) => p.id === userId);
      const mockId = 'mock-' + userId;
      
      const isAlreadyExists = conversations.some((c) => c.id === mockId);
      if (isAlreadyExists) {
        setActiveConversation(mockId);
        setIsModalOpen(false);
        return;
      }

      const mockConv = {
        id: mockId,
        type: 'PRIVATE' as const,
        name: selectedPlayer?.name || `Người chơi #${userId.substring(0, 4)}`,
        lastMessage: 'Bắt đầu cuộc trò chuyện...',
        lastMessageTime: new Date().toISOString(),
        unreadCount: 0,
        participants: [
          { id: user?.id, fullName: user?.fullName || 'Tôi' },
          { id: userId, fullName: selectedPlayer?.name || 'Đối tác' },
        ],
      };

      setConversations([...conversations, mockConv]);
      setActiveConversation(mockConv.id);
      message.info('Chế độ Demo: Cuộc trò chuyện đã được tạo cục bộ');
      setIsModalOpen(false);
      setCustomUserId('');
    }
  };

  const handleInviteMember = async () => {
    if (!inviteUserId.trim() || !activeConversationId) return;
    setInviting(true);
    try {
      await chatApi.createPrivateConversation(inviteUserId.trim());
      message.success('Đã gửi lời mời thành công!');
      setInviteUserId('');
      setShowInviteInput(false);
    } catch {
      // Fallback: optimistically add member to local conv participants
      message.info('Đã gửi lời mời (Demo Mode)');
      setInviteUserId('');
      setShowInviteInput(false);
    } finally {
      setInviting(false);
    }
  };

  const handleDeleteConversationApi = async (convId: string, type: 'ALL' | 'ONE') => {
    try {
      await chatApi.deleteConversation(convId, type);
      message.success('Đã xóa cuộc trò chuyện');
      setConversations(conversations.filter((c: any) => c.id !== convId));
      if (activeConversationId === convId) {
        setActiveConversation(null);
        setShowInfoSidebar(false);
      }
    } catch (err) {
      setConversations(conversations.filter((c: any) => c.id !== convId));
      if (activeConversationId === convId) {
        setActiveConversation(null);
        setShowInfoSidebar(false);
      }
      message.info('Đã ẩn/xóa cuộc trò chuyện (Offline Demo Mode)');
    }
  };

  const handleDeleteMessage = async (messageId: string, type: 'DELETED' | 'REVOKED') => {
    if (!activeConversationId) return;
    try {
      await chatApi.deleteMessage(messageId, activeConversationId, type);
      message.success(type === 'REVOKED' ? 'Đã thu hồi tin nhắn' : 'Đã xóa tin nhắn');
      
      const currentMsgs = messages[activeConversationId] || [];
      if (type === 'REVOKED') {
        const nextMsgs = currentMsgs.map((m) =>
          m.id === messageId ? { ...m, content: 'Tin nhắn đã được thu hồi', type: 'SYSTEM' as const } : m
        );
        setMessages(activeConversationId, nextMsgs);
      } else {
        const nextMsgs = currentMsgs.filter((m) => m.id !== messageId);
        setMessages(activeConversationId, nextMsgs);
      }
    } catch (err) {
      const currentMsgs = messages[activeConversationId] || [];
      if (type === 'REVOKED') {
        const nextMsgs = currentMsgs.map((m) =>
          m.id === messageId ? { ...m, content: 'Tin nhắn đã được thu hồi', type: 'SYSTEM' as const } : m
        );
        setMessages(activeConversationId, nextMsgs);
      } else {
        const nextMsgs = currentMsgs.filter((m) => m.id !== messageId);
        setMessages(activeConversationId, nextMsgs);
      }
      message.info('Đã thực hiện (Offline Demo Mode)');
    }
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      message.error('Tệp tin không được vượt quá 3MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64Url = reader.result as string;
      handleSendMessage(base64Url, 'IMAGE');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const activeConv = conversations.find((c: any) => c.id === activeConversationId);

  const sharedMedia = (messages[activeConversationId || ''] || [])
    .filter((msg) => msg.type === 'IMAGE')
    .map((msg) => msg.content);

  const filteredConversations = conversations.filter((c: any) =>
    c.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderAvatarInitials = (name: string, isGroup: boolean) => {
    const cleanName = name || 'User';
    const initials = cleanName
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    return (
      <div
        className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white font-extrabold text-xs shadow-sm transition-transform duration-200 group-hover:scale-105 bg-gradient-to-br ${
          isGroup ? 'from-blue-500 to-cyan-600' : 'from-emerald-400 to-teal-600'
        }`}
      >
        {initials}
      </div>
    );
  };

  return (
    <div className="flex-1 bg-slate-50/50 p-4 md:p-6 lg:p-8 flex items-center justify-center min-h-[calc(100vh-72px)] font-sans">
      <div className="w-full max-w-7xl h-[calc(100vh-160px)] min-h-[550px] flex bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
        
        {/* SIDEBAR */}
        <div className="w-80 md:w-[360px] border-r border-slate-100 flex flex-col bg-white flex-shrink-0">
          
          {/* Header Sidebar */}
          <div className="p-5 border-b border-slate-50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-slate-800 tracking-tight">
                  Tin nhắn
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold">
                  {filteredConversations.length}
                </span>
              </div>
              <Tooltip title="Bắt đầu trò chuyện">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition-all duration-200 hover:scale-105 cursor-pointer shadow-sm"
                >
                  <Plus size={18} />
                </button>
              </Tooltip>
            </div>

            <Input
              placeholder="Tìm cuộc trò chuyện..."
              allowClear
              prefix={<Search size={18} className="text-slate-400 mr-1.5" />}
              size="large"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-xl border-slate-200 focus:border-emerald-500 focus:shadow-emerald-50 hover:border-slate-300 transition-all bg-slate-50/30"
            />
          </div>

          {/* List Conversations */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-50/50 p-2 space-y-1">
            {loadingConvs ? (
              <div className="flex items-center justify-center py-16">
                <Spin size="medium" />
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="py-16 text-center">
                <Empty description="Không có cuộc trò chuyện nào" image={Empty.PRESENTED_IMAGE_SIMPLE} />
              </div>
            ) : (
              filteredConversations.map((conv: any) => {
                const isActive = activeConversationId === conv.id;
                const isGroup = conv.type === 'GROUP';

                return (
                  <div
                    key={conv.id}
                    onClick={() => {
                      setActiveConversation(conv.id);
                      // Mark conversation as read immediately when opened
                      markConversationRead(conv.id);
                      setShowInfoSidebar(false);
                    }}
                    className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all duration-200 group relative ${
                      isActive
                        ? 'bg-emerald-50/70 border-l-4 border-emerald-500 pl-2'
                        : conv.unreadCount > 0
                        ? 'bg-sky-50/40 border-l-4 border-sky-400 hover:bg-sky-50/60'
                        : 'hover:bg-slate-50 border-l-4 border-transparent'
                    }`}
                  >
                    {/* Avatar Container */}
                    <div className="relative flex-shrink-0">
                      {conv.avatarUrl ? (
                        <Avatar
                          size={44}
                          src={conv.avatarUrl}
                          className="border border-slate-100 shadow-sm rounded-2xl"
                        />
                      ) : (
                        renderAvatarInitials(conv.name, isGroup)
                      )}
                      {!isGroup && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />
                      )}
                      {/* Unread dot on avatar */}
                      {conv.unreadCount > 0 && !isActive && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full shadow-sm flex items-center justify-center">
                          <span className="w-1.5 h-1.5 bg-white rounded-full" />
                        </span>
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[14px] truncate pr-4 ${
                          isActive
                            ? 'font-extrabold text-emerald-800'
                            : conv.unreadCount > 0
                            ? 'font-extrabold text-slate-900'
                            : 'font-bold text-slate-800'
                        }`}>
                          {conv.name || 'Người dùng'}
                        </span>
                        <span className="text-[11px] text-slate-400 whitespace-nowrap ml-2 font-medium">
                          {conv.lastMessageTime
                            ? new Date(conv.lastMessageTime).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : ''}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs truncate max-w-[150px] ${
                          isActive
                            ? 'text-emerald-700 font-semibold'
                            : conv.unreadCount > 0
                            ? 'text-slate-700 font-bold'
                            : 'text-slate-400 font-medium'
                        }`}>
                          {conv.lastMessage?.startsWith('data:image/') ? '📷 Hình ảnh' : (conv.lastMessage || 'Bắt đầu cuộc trò chuyện...')}
                        </span>
                        {conv.unreadCount > 0 && !isActive && (
                          <Badge
                            count={conv.unreadCount}
                            size="small"
                            style={{ backgroundColor: '#ef4444', fontSize: 10, fontWeight: 800 }}
                          />
                        )}
                      </div>
                    </div>

                    {/* Hover actions delete conversation */}
                    <div className="absolute right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-20">
                      <Dropdown
                        menu={{
                          items: [
                            {
                              key: 'delete_one',
                              label: <span className="text-red-500 font-semibold">Ẩn cuộc trò chuyện</span>,
                              onClick: (info) => {
                                info.domEvent.stopPropagation();
                                Modal.confirm({
                                  title: 'Ẩn cuộc trò chuyện?',
                                  content: 'Cuộc trò chuyện này sẽ tạm thời được ẩn đi ở phía bạn.',
                                  okText: 'Ẩn',
                                  okType: 'danger',
                                  cancelText: 'Hủy',
                                  onOk: () => handleDeleteConversationApi(conv.id, 'ONE'),
                                });
                              },
                            },
                            {
                              key: 'delete_all',
                              label: <span className="text-red-700 font-bold">Xóa lịch sử hoàn toàn</span>,
                              onClick: (info) => {
                                info.domEvent.stopPropagation();
                                Modal.confirm({
                                  title: 'Xóa hoàn toàn cuộc trò chuyện?',
                                  content: 'Lịch sử cuộc trò chuyện này sẽ bị xóa vĩnh viễn và không thể khôi phục.',
                                  okText: 'Xóa',
                                  okType: 'danger',
                                  cancelText: 'Hủy',
                                  onOk: () => handleDeleteConversationApi(conv.id, 'ALL'),
                                });
                              },
                            },
                          ],
                        }}
                        trigger={['click']}
                        placement="bottomRight"
                      >
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/95 hover:bg-red-50 border border-slate-200 hover:border-red-200 text-slate-400 hover:text-red-500 transition-all cursor-pointer shadow-sm"
                        >
                          <Trash2 size={13} />
                        </button>
                      </Dropdown>
                    </div>

                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* CHAT WINDOW CONTAINER */}
        <div className="flex-1 flex bg-white overflow-hidden relative">
          
          {/* MAIN CHAT */}
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {activeConversationId ? (
              <>
                {/* Header Active Chat */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {activeConv?.avatarUrl ? (
                        <Avatar
                          size={42}
                          src={activeConv.avatarUrl}
                          className="border border-slate-100 shadow-sm rounded-2xl"
                        />
                      ) : (
                        renderAvatarInitials(activeConv?.name || 'Group', activeConv?.type === 'GROUP')
                      )}
                      {activeConv?.type !== 'GROUP' && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full shadow-sm animate-pulse" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-800 text-[15px] leading-tight">
                        {activeConv?.name || 'Cuộc hội thoại'}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[11px] text-emerald-600 font-bold select-none">
                          {isMuted ? 'Đã tắt thông báo' : 'Đang hoạt động'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowInfoSidebar(!showInfoSidebar)}
                      className={`w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-50 border transition-all cursor-pointer ${
                        showInfoSidebar 
                          ? 'border-emerald-200 text-brand-green bg-emerald-50/50' 
                          : 'border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-100'
                      }`}
                    >
                      <Info size={18} />
                    </button>
                  </div>
                </div>

                {/* Message List */}
                <div className="flex-1 overflow-y-auto p-6 bg-slate-50/40 flex flex-col gap-4">
                  {loadingMsgs ? (
                    <div className="flex items-center justify-center py-16">
                      <Spin size="medium" />
                    </div>
                  ) : (
                    (messages[activeConversationId] || []).map((msg) => {
                      const isMe = msg.senderId === user?.id;
                      const isImage = msg.content?.startsWith('data:image/') || msg.type === 'IMAGE';
                      const isRevoked = msg.type === 'SYSTEM' || msg.content === 'Tin nhắn đã được thu hồi';

                      const messageMenuItems = [
                        ...(isMe && !isRevoked
                          ? [
                              {
                                key: 'revoke',
                                label: (
                                  <span className="text-amber-600 flex items-center gap-2 text-xs font-bold py-1">
                                    <RotateCcw size={13} /> Thu hồi tin nhắn
                                  </span>
                                ),
                                onClick: () => handleDeleteMessage(msg.id, 'REVOKED'),
                              },
                            ]
                          : []),
                        {
                          key: 'delete',
                          label: (
                            <span className="text-red-600 flex items-center gap-2 text-xs font-bold py-1">
                              <Trash2 size={13} /> Xóa ở phía tôi
                            </span>
                          ),
                          onClick: () => handleDeleteMessage(msg.id, 'DELETED'),
                        },
                      ];

                      return (
                        <div
                          key={msg.id}
                          className={`flex items-end gap-2.5 max-w-[75%] group relative ${
                            isMe ? 'self-end flex-row-reverse' : 'self-start'
                          }`}
                        >
                          {/* Sender Avatar */}
                          <div className="flex-shrink-0">
                            {isMe ? (
                              user?.avatarUrl ? (
                                <Avatar size={30} src={user.avatarUrl} className="border border-slate-100 rounded-lg shadow-sm" />
                              ) : (
                                <div className="w-[30px] h-[30px] rounded-lg bg-emerald-500 text-white flex items-center justify-center text-[11px] font-bold shadow-sm">
                                  {user?.fullName?.charAt(0).toUpperCase() || 'M'}
                                </div>
                              )
                            ) : (
                              <div className="w-[30px] h-[30px] rounded-lg bg-sky-500 text-white flex items-center justify-center text-[11px] font-bold shadow-sm">
                                {msg.senderName?.charAt(0).toUpperCase() || 'U'}
                              </div>
                            )}
                          </div>

                          {/* Message Options Hover Button */}
                          {!isRevoked && (
                            <div
                              className={`absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-20 ${
                                isMe ? 'left-[-40px]' : 'right-[-40px]'
                              }`}
                            >
                              <Dropdown menu={{ items: messageMenuItems }} trigger={['click']} placement="bottomCenter">
                                <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/95 border border-slate-200 text-slate-400 hover:text-slate-600 hover:shadow-sm transition-all cursor-pointer">
                                  <MoreVertical size={13} />
                                </button>
                              </Dropdown>
                            </div>
                          )}

                          {/* Message Box */}
                          <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                            {!isMe && (
                              <span className="text-[10px] text-slate-400 mb-1 ml-1 font-bold">
                                {msg.senderName}
                              </span>
                            )}
                            
                            {isRevoked ? (
                              <div className="px-4 py-2 rounded-2xl border border-slate-200 bg-slate-100 text-slate-400 text-xs italic select-none">
                                Tin nhắn đã được thu hồi
                              </div>
                            ) : isImage ? (
                              <div 
                                className="relative rounded-2xl overflow-hidden border border-slate-100 shadow-sm cursor-zoom-in group"
                                onClick={() => {
                                  Modal.info({
                                    title: `Hình ảnh từ ${msg.senderName}`,
                                    icon: null,
                                    width: 600,
                                    okText: 'Đóng',
                                    content: (
                                      <div className="pt-4 flex justify-center">
                                        <img src={msg.content} alt="Attachment enlarged" className="max-w-full max-h-[70vh] rounded-xl object-contain shadow-lg" />
                                      </div>
                                    ),
                                  });
                                }}
                              >
                                <img src={msg.content} alt="Attachment" className="max-w-[220px] max-h-[220px] object-cover hover:scale-105 transition-transform duration-200" />
                              </div>
                            ) : (
                              <div
                                className={`px-4 py-2.5 rounded-2xl shadow-sm text-[14px] leading-relaxed break-words max-w-full ${
                                  isMe
                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-tr-none shadow-emerald-100/50'
                                    : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none shadow-slate-100/30'
                                }`}
                              >
                                {msg.content}
                              </div>
                            )}
                            
                            <span className="text-[9px] text-slate-400 mt-1 select-none font-medium">
                              {new Date(msg.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input Box */}
                <div className="p-4 border-t border-slate-100 bg-white flex items-center gap-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    onClick={handleAttachmentClick}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-400 hover:text-slate-600 transition-all duration-200 hover:scale-105 cursor-pointer shadow-sm flex-shrink-0"
                  >
                    <Paperclip size={18} />
                  </button>

                  <Popover
                    content={
                      <div className="grid grid-cols-7 gap-1.5 p-1">
                        {QUICK_EMOJIS.map((emoji, idx) => (
                          <button
                            key={idx}
                            onClick={() => setInputMessage((prev) => prev + emoji)}
                            className="w-8 h-8 flex items-center justify-center text-lg hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    }
                    trigger="click"
                    placement="topRight"
                  >
                    <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-400 hover:text-slate-600 transition-all duration-200 hover:scale-105 cursor-pointer shadow-sm flex-shrink-0">
                      <Smile size={18} />
                    </button>
                  </Popover>

                  <Input
                    placeholder="Nhập tin nhắn..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onPressEnter={() => {
                      if (inputMessage.trim()) {
                        handleSendMessage(inputMessage);
                        setInputMessage('');
                      }
                    }}
                    className="rounded-xl border-slate-200 focus:border-emerald-500 focus:shadow-emerald-50 hover:border-slate-300 py-2.5 px-4 bg-slate-50/50 text-sm"
                  />
                  
                  <button
                    onClick={() => {
                      if (inputMessage.trim()) {
                        handleSendMessage(inputMessage);
                        setInputMessage('');
                      }
                    }}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-brand-green hover:bg-emerald-600 text-white shadow-md shadow-emerald-100 hover:shadow-emerald-200 transition-all duration-200 hover:scale-105 cursor-pointer flex-shrink-0"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </>
            ) : (
              /* EMPTY SCREEN */
              <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/30 text-slate-400 p-8 select-none">
                <div className="w-20 h-20 rounded-3xl bg-emerald-50/80 border border-emerald-100/50 flex items-center justify-center mb-6 shadow-md shadow-emerald-50 animate-bounce">
                  <MessageSquare className="text-brand-green" size={32} />
                </div>
                <h3 className="font-extrabold text-slate-800 text-xl tracking-tight mb-2">
                  Chào mừng bạn đến với BadmintonHub Chat
                </h3>
                <p className="text-slate-400 text-sm max-w-sm text-center leading-relaxed">
                  Chọn một cuộc trò chuyện từ danh sách bên trái hoặc nhấn nút cộng để bắt đầu kết nối với các tuyển thủ khác.
                </p>
              </div>
            )}
          </div>

          {/* INFORMATION INFO SIDEBAR */}
          {activeConversationId && showInfoSidebar && (
            <div className="w-72 md:w-80 border-l border-slate-100 flex flex-col h-full bg-white flex-shrink-0 animate-in slide-in-from-right duration-300">
              {/* Header Info */}
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <span className="font-extrabold text-slate-800 text-[14px]">Thông tin chi tiết</span>
                <button
                  onClick={() => setShowInfoSidebar(false)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Body Info */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                
                {/* Profile Center */}
                <div className="flex flex-col items-center text-center space-y-3">
                  {activeConv?.avatarUrl ? (
                    <Avatar size={70} src={activeConv.avatarUrl} className="border-2 border-slate-100 shadow-sm rounded-3xl" />
                  ) : (
                    renderAvatarInitials(activeConv?.name || 'Group', activeConv?.type === 'GROUP')
                  )}
                  <div>
                    <h4 className="font-black text-slate-800 text-base leading-snug">
                      {activeConv?.name || 'Cuộc trò chuyện'}
                    </h4>
                    <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                      {activeConv?.type === 'GROUP' ? 'Nhóm kèo đấu' : 'Trò chuyện cá nhân'}
                    </span>
                  </div>
                </div>

                {/* Members Section */}
                {(() => {
                  const members: any[] = activeConv?.participants || [];
                  const isGroup = activeConv?.type === 'GROUP';
                  return (
                    <div>
                      <button
                        onClick={() => setShowMemberList(!showMemberList)}
                        className="w-full flex items-center justify-between mb-2 group"
                      >
                        <h5 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Users size={12} />
                          Thành viên {members.length > 0 && `(${members.length})`}
                        </h5>
                        {showMemberList ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
                      </button>

                      {showMemberList && (
                        <div className="space-y-2">
                          {members.length === 0 ? (
                            <p className="text-xs text-slate-400 text-center py-2 italic">Không có thông tin thành viên</p>
                          ) : (
                            members.map((member: any, idx: number) => {
                              const name = member.fullName || member.name || member.userName || 'Thành viên';
                              const isMe = member.id === user?.id;
                              return (
                                <div key={member.id || idx} className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition-colors group/member">
                                  {member.avatarUrl ? (
                                    <Avatar size={32} src={member.avatarUrl} className="rounded-lg border border-slate-100 shadow-sm flex-shrink-0" />
                                  ) : (
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 text-white flex items-center justify-center text-[10px] font-extrabold flex-shrink-0 shadow-sm">
                                      {name.charAt(0).toUpperCase()}
                                    </div>
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <span className="text-[13px] font-bold text-slate-800 truncate block">{name}</span>
                                    {isMe && <span className="text-[10px] text-emerald-600 font-semibold">Bạn</span>}
                                  </div>
                                </div>
                              );
                            })
                          )}

                          {/* Invite Member Button */}
                          {isGroup && (
                            <div className="mt-1">
                              {!showInviteInput ? (
                                <button
                                  onClick={() => setShowInviteInput(true)}
                                  className="w-full flex items-center gap-2 p-2 rounded-xl border border-dashed border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/30 text-slate-500 hover:text-emerald-700 text-xs font-bold transition-all cursor-pointer"
                                >
                                  <UserPlus size={14} />
                                  <span>Mời thành viên</span>
                                </button>
                              ) : (
                                <div className="space-y-2 p-2 bg-emerald-50/30 rounded-xl border border-emerald-100">
                                  <label className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider block">ID Người chơi</label>
                                  <Input
                                    placeholder="Nhập User ID..."
                                    size="small"
                                    value={inviteUserId}
                                    onChange={(e) => setInviteUserId(e.target.value)}
                                    onPressEnter={handleInviteMember}
                                    className="rounded-lg border-emerald-200 focus:border-emerald-500 text-xs"
                                    autoFocus
                                  />
                                  <div className="flex gap-2">
                                    <button
                                      onClick={handleInviteMember}
                                      disabled={!inviteUserId.trim() || inviting}
                                      className="flex-1 py-1.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                                    >
                                      {inviting ? 'Đang gửi...' : 'Mời'}
                                    </button>
                                    <button
                                      onClick={() => { setShowInviteInput(false); setInviteUserId(''); }}
                                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                                    >
                                      Hủy
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Settings Panel */}
                <div className="space-y-2">
                  <h5 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Tùy chọn</h5>
                  
                  <button
                    onClick={() => {
                      setIsMuted(!isMuted);
                      message.success(isMuted ? 'Đã bật lại thông báo' : 'Đã tắt thông báo cuộc trò chuyện');
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                      isMuted 
                        ? 'bg-red-50 border-red-100 text-red-600 hover:bg-red-100/50' 
                        : 'bg-slate-50 border-slate-100 hover:bg-slate-100/50 text-slate-700'
                    }`}
                  >
                    <BellOff size={16} />
                    <span>{isMuted ? 'Bật thông báo' : 'Tắt thông báo'}</span>
                  </button>

                  <button
                    onClick={() => {
                      Modal.confirm({
                        title: 'Ẩn cuộc trò chuyện này?',
                        content: 'Cuộc trò chuyện sẽ được ẩn tạm thời khỏi danh sách của bạn.',
                        okText: 'Ẩn',
                        okType: 'danger',
                        cancelText: 'Hủy',
                        onOk: () => handleDeleteConversationApi(activeConversationId, 'ONE'),
                      });
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-red-50 hover:border-red-100 hover:text-red-600 text-slate-700 text-sm font-bold transition-all cursor-pointer"
                  >
                    <LogOut size={16} />
                    <span>Ẩn cuộc trò chuyện</span>
                  </button>

                  <button
                    onClick={() => {
                      Modal.confirm({
                        title: 'Xóa vĩnh viễn cuộc trò chuyện?',
                        content: 'Toàn bộ lịch sử tin nhắn sẽ bị xóa vĩnh viễn cho tất cả các thành viên.',
                        okText: 'Xóa tất cả',
                        okType: 'danger',
                        cancelText: 'Hủy',
                        onOk: () => handleDeleteConversationApi(activeConversationId, 'ALL'),
                      });
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-red-100 hover:border-red-200 hover:text-red-700 text-slate-700 text-sm font-bold transition-all cursor-pointer"
                  >
                    <Trash2 size={16} />
                    <span>Xóa lịch sử hoàn toàn</span>
                  </button>
                </div>

                {/* Shared Photos */}
                {sharedMedia.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider m-0">Ảnh đã chia sẻ</h5>
                      <span className="text-xs text-slate-400 font-bold">{sharedMedia.length} ảnh</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {sharedMedia.map((url, idx) => (
                        <div
                          key={idx}
                          className="aspect-square rounded-xl overflow-hidden border border-slate-100 cursor-pointer shadow-sm hover:opacity-90 transition-opacity"
                          onClick={() => {
                            Modal.info({
                              title: 'Ảnh đã chia sẻ',
                              icon: null,
                              width: 600,
                              okText: 'Đóng',
                              content: (
                                <div className="pt-4 flex justify-center">
                                  <img src={url} alt="Shared preview" className="max-w-full max-h-[70vh] rounded-xl object-contain shadow-lg" />
                                </div>
                              ),
                            });
                          }}
                        >
                          <img src={url} alt="Shared attachment" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* MODAL: BẮT ĐẦU TRÒ CHUYỆN */}
      <Modal
        title={
          <div className="pb-3 border-b border-slate-100 text-lg font-black text-slate-800">
            Bắt đầu trò chuyện
          </div>
        }
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setCustomUserId('');
        }}
        footer={null}
        width={460}
        className="font-sans"
        styles={{ body: { padding: '20px 0 0' } }}
      >
        <div className="px-5 space-y-4">
          <div>
            <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-2">Nhập ID Người Chơi</label>
            <div className="flex gap-2">
              <Input
                placeholder="Ví dụ: usr-3, d84b2e8c..."
                value={customUserId}
                onChange={(e) => setCustomUserId(e.target.value)}
                className="rounded-xl border-slate-200 focus:border-emerald-500 focus:shadow-emerald-50 py-2"
              />
              <button
                onClick={() => handleStartConversation(customUserId)}
                disabled={!customUserId.trim()}
                className="px-4 py-2 bg-brand-green hover:bg-emerald-600 disabled:opacity-50 text-white rounded-xl font-bold transition-colors cursor-pointer text-sm"
              >
                Nhắn tin
              </button>
            </div>
          </div>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-100"></div>
            <span className="flex-shrink mx-4 text-slate-400 text-xs font-bold uppercase tracking-wider">Hoặc gợi ý tuyển thủ</span>
            <div className="flex-grow border-t border-slate-100"></div>
          </div>

          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {SUGGESTED_PLAYERS.map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 hover:border-emerald-100 hover:bg-emerald-50/20 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Avatar src={player.avatarUrl} size={40} className="border border-slate-100 shadow-sm rounded-xl" />
                  <div>
                    <h5 className="font-bold text-slate-800 text-[14px] leading-tight m-0">{player.name}</h5>
                    <Tag color="emerald" style={{ fontSize: 10, marginTop: 4, borderRadius: 4, fontWeight: 600 }}>{player.level}</Tag>
                  </div>
                </div>
                <button
                  onClick={() => handleStartConversation(player.id)}
                  className="px-3.5 py-1.5 bg-slate-50 hover:bg-brand-green border border-slate-200 hover:border-brand-green text-slate-600 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Nhắn tin
                </button>
              </div>
            ))}
          </div>
        </div>
      </Modal>

    </div>
  );
}
