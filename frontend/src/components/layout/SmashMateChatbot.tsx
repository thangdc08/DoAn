import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Badge, Spin, Typography } from 'antd';
import { 
  MessageOutlined, 
  CloseOutlined, 
  SendOutlined, 
  ClockCircleOutlined, 
  CalendarOutlined, 
  CheckCircleOutlined,
  CoffeeOutlined,
  CommentOutlined,
  CompassOutlined
} from '@ant-design/icons';
import apiClient from '../../services/apiClient';

const { Text } = Typography;

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  action?: 'FILTER_MATCHES' | 'FILTER_COURTS' | 'DEFAULT';
  params?: any;
}

export const SmashMateChatbot: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasNewBadge, setHasNewBadge] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggestions defined exactly like the design
  const SUGGESTIONS = [
    { text: 'Tìm kèo tối nay khu Cầu Giấy trình TB+', label: 'Tìm kèo tối nay khu Cầu Giấy trình TB+' },
    { text: 'Có sân trống ngày mai buổi sáng không?', label: 'Có sân trống ngày mai buổi sáng không?' },
    { text: 'Tìm lớp dạy cầu lông cho người mới', label: 'Tìm lớp dạy cầu lông cho người mới' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasNewBadge(false);
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Add User Message
    const userMsg: ChatMessage = { sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      // Send message to the backend via api-gateway (/api/ai/chat -> routes to ai-service /chat)
      const response = await apiClient.post('/ai/chat', { message: textToSend });
      const data = response.data;

      // Add AI Message
      const aiMsg: ChatMessage = {
        sender: 'ai',
        text: data.reply || 'Mình đã nhận được yêu cầu của bạn.',
        action: data.action,
        params: data.params
      };

      setMessages(prev => [...prev, aiMsg]);

      // Auto trigger filter navigation if action is detected and page matches
      if (data.action && data.action !== 'DEFAULT') {
        applyFilters(data.action, data.params);
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: 'Xin lỗi, kết nối tới hệ thống AI của SmashMate gặp gián đoạn. Bạn vui lòng thử lại sau nhé!'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = (action: string, params: any) => {
    if (!params) return;

    if (action === 'FILTER_MATCHES') {
      const searchParams = new URLSearchParams();
      if (params.q) searchParams.set('q', params.q);
      if (params.level) searchParams.set('level', params.level);
      if (params.date) searchParams.set('date', params.date);
      searchParams.set('category', 'matches');
      navigate(`/community?${searchParams.toString()}`);
    } else if (action === 'FILTER_COURTS') {
      const searchParams = new URLSearchParams();
      if (params.q) searchParams.set('search', params.q);
      if (params.city) searchParams.set('city', params.city);
      navigate(`/venues?${searchParams.toString()}`);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* ── Chat floating button with pulse animation ── */}
      <div 
        className="fixed bottom-6 right-6 z-[1003]"
        style={{
          display: isOpen ? 'none' : 'block'
        }}
      >
        <Badge dot={hasNewBadge} status="success" offset={[-2, 2]}>
          <button
            onClick={toggleChat}
            className="w-14 h-14 rounded-full bg-brand-green hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer relative group"
            style={{
              border: 'none',
              outline: 'none'
            }}
          >
            {/* Pulsing ring animation around the button */}
            <span className="absolute -inset-0.5 rounded-full bg-brand-green/30 animate-ping opacity-75 group-hover:opacity-100 transition-opacity"></span>
            <MessageOutlined style={{ fontSize: 24, position: 'relative', zIndex: 2 }} />
          </button>
        </Badge>
      </div>

      {/* ── Chat Window ── */}
      {isOpen && (
        <div 
          className="fixed bottom-6 right-6 w-[400px] h-[550px] max-h-[85vh] z-[1003] bg-white rounded-[28px] shadow-2xl flex flex-col overflow-hidden border border-slate-100/80 transition-all duration-300"
          style={{
            boxShadow: '0 20px 50px -12px rgba(0, 0, 0, 0.15)',
          }}
        >
          {/* Header Section */}
          <div 
            className="px-6 py-4 flex items-center justify-between text-white"
            style={{
              background: 'linear-gradient(135deg, #007A3D 0%, #00A651 100%)',
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <span className="text-xl">✨</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-[16px] tracking-tight leading-none">SmashMate AI</span>
                  <span className="text-[9px] font-bold bg-white/20 px-1.5 py-0.5 rounded-md uppercase tracking-wider">Beta</span>
                </div>
                <div className="text-[11px] text-green-100 font-medium mt-1">
                  Hỏi bằng tiếng Việt • AI tìm bài đăng
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Optional Active Status Badge */}
              <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Welcome
              </span>
              <button 
                onClick={toggleChat}
                className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg border-none bg-transparent cursor-pointer transition-colors"
              >
                <CloseOutlined style={{ fontSize: 16 }} />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto px-5 py-4 bg-slate-50/50 flex flex-col gap-4">
            
            {/* Greeting Box (Always shown at the top) */}
            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-green-light flex items-center justify-center flex-shrink-0 text-brand-green">
                  <CompassOutlined style={{ fontSize: 18 }} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm mb-1">Xin chào! Mình là SmashMate AI</h4>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    Gõ 1 câu → AI hiểu ý bạn → mở đúng feed/filter. Bạn tiết kiệm thời gian tìm kèo mỗi ngày.
                  </p>
                </div>
              </div>

              {/* Badges row */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-50">
                <div className="bg-slate-50 rounded-xl p-2 text-center flex flex-col items-center justify-center border border-slate-100/50">
                  <ClockCircleOutlined className="text-brand-green text-[13px] mb-1" />
                  <span className="text-[10px] font-bold text-slate-700">Nhanh</span>
                  <span className="text-[8px] text-slate-400 mt-0.5">1 câu lệnh</span>
                </div>
                <div className="bg-slate-50 rounded-xl p-2 text-center flex flex-col items-center justify-center border border-slate-100/50">
                  <CalendarOutlined className="text-brand-green text-[13px] mb-1" />
                  <span className="text-[10px] font-bold text-slate-700">Nhắc lịch</span>
                  <span className="text-[8px] text-slate-400 mt-0.5">Khung giờ</span>
                </div>
                <div className="bg-slate-50 rounded-xl p-2 text-center flex flex-col items-center justify-center border border-slate-100/50">
                  <CheckCircleOutlined className="text-emerald-500 text-[13px] mb-1" />
                  <span className="text-[10px] font-bold text-slate-700">Welcome</span>
                  <span className="text-[8px] text-slate-400 mt-0.5">Đang bật</span>
                </div>
              </div>
            </div>

            {/* Suggestions (Show suggestions if history is empty) */}
            {messages.length === 0 && (
              <div className="flex flex-col gap-2 mt-2">
                <span className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase mb-1">Ví dụ câu hỏi</span>
                {SUGGESTIONS.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(item.text)}
                    className="w-full text-left bg-white hover:bg-slate-50 border border-slate-200/60 hover:border-emerald-200 px-4 py-3 rounded-xl text-xs font-semibold text-slate-600 hover:text-brand-green transition-all cursor-pointer shadow-sm active:scale-[0.99]"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}

            {/* Chat History */}
            {messages.map((msg, index) => (
              <div 
                key={index}
                className={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'self-end items-end' : 'self-start items-start'}`}
              >
                <div 
                  className={`px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-slate-800 text-white rounded-tr-none' 
                      : 'bg-white text-slate-700 border border-slate-100 shadow-sm rounded-tl-none'
                  }`}
                  style={{
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  {msg.text}
                </div>

                {/* Optional interactive actions when AI suggests a filter */}
                {msg.sender === 'ai' && msg.action && msg.action !== 'DEFAULT' && (
                  <div className="mt-2 bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex flex-col gap-2 w-full">
                    <div className="text-[10px] font-bold text-emerald-700 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Phát hiện bộ lọc tự động
                    </div>
                    <Button 
                      type="primary" 
                      size="small"
                      style={{
                        background: '#00A651',
                        borderColor: '#00A651',
                        borderRadius: 8,
                        fontSize: 11,
                        fontWeight: 700,
                        height: 28
                      }}
                      onClick={() => applyFilters(msg.action!, msg.params)}
                    >
                      Áp dụng bộ lọc ngay
                    </Button>
                  </div>
                )}
              </div>
            ))}

            {/* Loading message spinner */}
            {isLoading && (
              <div className="self-start bg-white border border-slate-100 shadow-sm rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2">
                <Spin size="small" />
                <span className="text-[11px] text-slate-400 font-medium">SmashMate AI đang phân tích...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Supporting links & Input */}
          <div className="border-t border-slate-100 p-4 bg-white">
            {/* Supporting row */}
            <div className="flex justify-between items-center mb-3 text-[11px] font-bold">
              <button 
                onClick={() => handleSendMessage('Làm sao để tôi ủng hộ bạn?')}
                className="text-amber-500 hover:text-amber-600 flex items-center gap-1 bg-transparent border-none cursor-pointer"
              >
                <CoffeeOutlined style={{ fontSize: 12 }} />
                Ủng hộ
              </button>
              <button 
                onClick={() => handleSendMessage('Tôi muốn góp ý về chatbot này')}
                className="text-sky-500 hover:text-sky-600 flex items-center gap-1 bg-transparent border-none cursor-pointer"
              >
                <CommentOutlined style={{ fontSize: 12 }} />
                Góp ý
              </button>
            </div>

            {/* Input bar */}
            <div className="flex gap-2">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onPressEnter={() => handleSendMessage(inputText)}
                placeholder="VD: tìm kèo tối nay Cầu Giấy TB+..."
                className="rounded-full bg-slate-50 border-slate-200/80 px-4 py-2 hover:border-slate-300 focus:border-brand-green text-xs"
                disabled={isLoading}
              />
              <button 
                onClick={() => handleSendMessage(inputText)}
                disabled={isLoading}
                className="w-9 h-9 rounded-full bg-brand-green hover:bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 border-none cursor-pointer disabled:opacity-50 transition-colors shadow-md shadow-emerald-500/10 active:scale-95"
              >
                <SendOutlined style={{ fontSize: 13 }} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SmashMateChatbot;
