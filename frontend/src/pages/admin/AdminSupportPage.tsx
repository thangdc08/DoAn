import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Typography, Input, Button, Space, Avatar, Tag, Spin,
  Select, Badge, Tooltip, Empty, message, Divider,
} from 'antd';
import {
  SendOutlined, SearchOutlined, UserOutlined, MailOutlined,
  CheckCircleOutlined, ClockCircleOutlined, SyncOutlined,
  CloseCircleOutlined, ReloadOutlined, FilterOutlined,
  InboxOutlined, ExclamationCircleOutlined,
} from '@ant-design/icons';
import { BRAND } from '../../theme/antdTheme';
import { bookingApi } from '../../services/bookingApi';
import type { SupportTicket } from '../../types/booking.types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';

dayjs.extend(relativeTime);
dayjs.locale('vi');

const { Title, Text } = Typography;
const { TextArea } = Input;

// ─── Constants ───────────────────────────────────────────────────────────────

const STATUS_CFG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  OPEN:        { label: 'Mở',        color: '#ef4444',  icon: <ExclamationCircleOutlined /> },
  IN_PROGRESS: { label: 'Đang xử lý', color: '#f59e0b', icon: <SyncOutlined spin /> },
  RESOLVED:    { label: 'Đã giải quyết', color: '#10b981', icon: <CheckCircleOutlined /> },
  CLOSED:      { label: 'Đã đóng',   color: '#94a3b8',  icon: <CloseCircleOutlined /> },
};

const FILTER_OPTIONS = [
  { value: '', label: 'Tất cả' },
  { value: 'OPEN', label: 'Mở' },
  { value: 'IN_PROGRESS', label: 'Đang xử lý' },
  { value: 'RESOLVED', label: 'Đã giải quyết' },
  { value: 'CLOSED', label: 'Đã đóng' },
];

// ─── Ticket Item ─────────────────────────────────────────────────────────────

function TicketItem({
  ticket, selected, onClick,
}: { ticket: SupportTicket; selected: boolean; onClick: () => void }) {
  const cfg = STATUS_CFG[ticket.status] ?? STATUS_CFG.OPEN;
  return (
    <div
      onClick={onClick}
      style={{
        padding: '16px 18px',
        cursor: 'pointer',
        background: selected ? `${BRAND.primary}08` : '#fff',
        borderLeft: `3px solid ${selected ? BRAND.primary : 'transparent'}`,
        borderBottom: '1px solid #f1f5f9',
        transition: 'all 0.15s',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <Tag
          icon={cfg.icon}
          style={{
            borderRadius: 6, fontSize: 10, fontWeight: 600,
            background: `${cfg.color}15`, color: cfg.color,
            border: `1px solid ${cfg.color}30`, padding: '0 6px',
          }}
        >
          {cfg.label}
        </Tag>
        <Text type="secondary" style={{ fontSize: 10 }}>
          {dayjs(ticket.createdAt).fromNow()}
        </Text>
      </div>
      <Text strong style={{ fontSize: 13, display: 'block', marginBottom: 4, lineHeight: 1.4 }}>
        {ticket.subject}
      </Text>
      <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 4 }}>
        <UserOutlined style={{ marginRight: 4 }} />
        Booking #{ticket.bookingId?.substring(0, 8).toUpperCase()}
      </Text>
      <Text type="secondary" style={{ fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
        {ticket.description}
      </Text>
    </div>
  );
}

// ─── Chat Bubble ─────────────────────────────────────────────────────────────

function ChatBubble({ text, time, isAdmin }: { text: string; time: string; isAdmin: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: isAdmin ? 'flex-end' : 'flex-start', marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, flexDirection: isAdmin ? 'row-reverse' : 'row' }}>
        {!isAdmin && (
          <Avatar size={30} icon={<UserOutlined />} style={{ background: '#e2e8f0', color: '#64748b', flexShrink: 0 }} />
        )}
        <div style={{
          maxWidth: '68%',
          padding: '10px 14px',
          borderRadius: isAdmin ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
          background: isAdmin ? BRAND.primary : '#fff',
          color: isAdmin ? '#fff' : '#1e293b',
          boxShadow: isAdmin
            ? '0 4px 12px rgba(0,166,81,0.2)'
            : '0 2px 8px rgba(0,0,0,0.06)',
          fontSize: 13,
          lineHeight: 1.5,
        }}>
          {text}
        </div>
      </div>
      <Text type="secondary" style={{ fontSize: 10, marginTop: 4, paddingLeft: isAdmin ? 0 : 38, paddingRight: isAdmin ? 0 : 0, textAlign: isAdmin ? 'right' : 'left' }}>
        {dayjs(time).format('HH:mm · DD/MM/YYYY')}
      </Text>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replying, setReplying] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const loadTickets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await bookingApi.getAdminSupportTickets({
        status: statusFilter || undefined,
        page: 0,
        size: 50,
      });
      setTickets(res.content || []);
      setTotalElements(res.totalElements || 0);
    } catch {
      // fallback — no error shown, empty state handles it
      setTickets([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { loadTickets(); }, [loadTickets]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedTicket]);

  // ── Stats ──
  const countByStatus = (s: string) => tickets.filter(t => t.status === s).length;
  const statsCards = [
    { label: 'Tổng yêu cầu', value: totalElements, color: '#6366f1' },
    { label: 'Đang mở',      value: countByStatus('OPEN'),        color: '#ef4444' },
    { label: 'Đang xử lý',   value: countByStatus('IN_PROGRESS'), color: '#f59e0b' },
    { label: 'Đã giải quyết',value: countByStatus('RESOLVED'),    color: '#10b981' },
  ];

  // ── Filtered list ──
  const filtered = tickets.filter(t => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      t.subject.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.bookingId?.toLowerCase().includes(q)
    );
  });

  // ── Send reply ──
  const handleSendReply = async () => {
    if (!selectedTicket || !replyText.trim()) return;
    setReplying(true);
    try {
      const updated = await bookingApi.replyAdminSupportTicket(selectedTicket.id, replyText.trim());
      setSelectedTicket(updated);
      setReplyText('');
      setTickets(prev => prev.map(t => t.id === updated.id ? updated : t));
      message.success('Đã gửi phản hồi');
    } catch {
      message.error('Không gửi được phản hồi. Vui lòng thử lại.');
    } finally {
      setReplying(false);
    }
  };

  // ── Mark resolved ──
  const handleMarkResolved = async () => {
    if (!selectedTicket) return;
    try {
      const updated = await bookingApi.updateTicketStatus(selectedTicket.id, 'RESOLVED');
      setSelectedTicket(updated);
      setTickets(prev => prev.map(t => t.id === updated.id ? updated : t));
      message.success('Đã đánh dấu giải quyết xong');
    } catch {
      message.error('Không thể cập nhật trạng thái');
    }
  };

  const selectedCfg = selectedTicket ? (STATUS_CFG[selectedTicket.status] ?? STATUS_CFG.OPEN) : null;

  return (
    <div style={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>

      {/* ── Header ── */}
      <div style={{ padding: '20px 28px 0', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <Title level={3} style={{ margin: 0, fontWeight: 800 }}>Hỗ trợ & Phản hồi</Title>
            <Text type="secondary" style={{ fontSize: 13 }}>
              Quản lý và giải đáp tất cả yêu cầu hỗ trợ từ chủ sân và người dùng.
            </Text>
          </div>
          <Button icon={<ReloadOutlined />} onClick={loadTickets} loading={loading}>
            Làm mới
          </Button>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
          {statsCards.map(s => (
            <div key={s.label} style={{
              background: '#fff', borderRadius: 10, padding: '10px 18px',
              border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</span>
              <span style={{ fontSize: 12, color: '#64748b' }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main body ── */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0, padding: '0 28px 20px', gap: 16 }}>

        {/* ── LEFT: ticket list ── */}
        <div style={{
          width: 340, flexShrink: 0, display: 'flex', flexDirection: 'column',
          background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0',
          overflow: 'hidden',
        }}>
          {/* Filters */}
          <div style={{ padding: '14px 14px 10px', borderBottom: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Input
              prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
              placeholder="Tìm kiếm yêu cầu..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ borderRadius: 8 }}
            />
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              options={FILTER_OPTIONS}
              style={{ width: '100%' }}
              suffixIcon={<FilterOutlined />}
            />
          </div>

          {/* Ticket list */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <Spin spinning={loading}>
              {filtered.length === 0 ? (
                <div style={{ padding: 32, textAlign: 'center', color: '#94a3b8' }}>
                  <InboxOutlined style={{ fontSize: 32, marginBottom: 8 }} />
                  <div style={{ fontSize: 13 }}>Không có yêu cầu nào</div>
                </div>
              ) : (
                filtered.map(ticket => (
                  <TicketItem
                    key={ticket.id}
                    ticket={ticket}
                    selected={selectedTicket?.id === ticket.id}
                    onClick={() => setSelectedTicket(ticket)}
                  />
                ))
              )}
            </Spin>
          </div>
        </div>

        {/* ── RIGHT: chat panel ── */}
        {selectedTicket ? (
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0,
            background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0', overflow: 'hidden',
          }}>
            {/* Chat header */}
            <div style={{
              padding: '16px 22px', borderBottom: '1px solid #f1f5f9',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: '#fafbfc',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar size={40} icon={<UserOutlined />}
                  style={{ background: `${BRAND.primary}20`, color: BRAND.primary, flexShrink: 0 }} />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Text strong style={{ fontSize: 14 }}>{selectedTicket.subject}</Text>
                    <Tag
                      icon={selectedCfg?.icon}
                      style={{
                        borderRadius: 6, fontSize: 10, fontWeight: 600,
                        background: `${selectedCfg?.color}15`, color: selectedCfg?.color,
                        border: `1px solid ${selectedCfg?.color}30`,
                      }}
                    >
                      {selectedCfg?.label}
                    </Tag>
                  </div>
                  <Text type="secondary" style={{ fontSize: 11 }}>
                    Booking #{selectedTicket.bookingId?.substring(0, 8).toUpperCase()} ·{' '}
                    Mở lúc {dayjs(selectedTicket.createdAt).format('HH:mm DD/MM/YYYY')}
                  </Text>
                </div>
              </div>
              <Space>
                <Tooltip title="Email người dùng">
                  <Button icon={<MailOutlined />} />
                </Tooltip>
                {selectedTicket.status !== 'RESOLVED' && selectedTicket.status !== 'CLOSED' && (
                  <Button
                    type="primary" ghost
                    icon={<CheckCircleOutlined />}
                    onClick={handleMarkResolved}
                    style={{ borderRadius: 8, borderColor: '#10b981', color: '#10b981' }}
                  >
                    Đánh dấu giải quyết
                  </Button>
                )}
              </Space>
            </div>

            {/* Ticket description banner */}
            <div style={{
              margin: '16px 22px 0', padding: '12px 16px',
              background: '#f8fafc', borderRadius: 10,
              border: '1px solid #e2e8f0', fontSize: 13, color: '#475569',
            }}>
              <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                Nội dung yêu cầu
              </Text>
              {selectedTicket.description}
            </div>

            <Divider style={{ margin: '12px 22px', width: 'auto' }} />

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '4px 22px 8px' }}>
              {/* User's original message */}
              <ChatBubble
                text={selectedTicket.description}
                time={selectedTicket.createdAt}
                isAdmin={false}
              />

              {/* Admin reply */}
              {selectedTicket.reply && (
                <ChatBubble
                  text={selectedTicket.reply}
                  time={selectedTicket.repliedAt ?? selectedTicket.updatedAt}
                  isAdmin={true}
                />
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Reply box */}
            {selectedTicket.status !== 'CLOSED' ? (
              <div style={{ padding: '14px 22px', borderTop: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
                  <TextArea
                    placeholder="Nhập nội dung phản hồi cho người dùng..."
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    onPressEnter={e => {
                      if (!e.shiftKey) {
                        e.preventDefault();
                        handleSendReply();
                      }
                    }}
                    autoSize={{ minRows: 2, maxRows: 5 }}
                    style={{ borderRadius: 10, flex: 1, fontSize: 13 }}
                  />
                  <Button
                    type="primary"
                    icon={<SendOutlined />}
                    size="large"
                    loading={replying}
                    disabled={!replyText.trim()}
                    onClick={handleSendReply}
                    style={{
                      background: BRAND.primary, borderRadius: 10,
                      width: 48, height: 48, flexShrink: 0,
                    }}
                  />
                </div>
                <Text type="secondary" style={{ fontSize: 11, marginTop: 6, display: 'block' }}>
                  Nhấn Enter để gửi · Shift+Enter để xuống dòng
                </Text>
              </div>
            ) : (
              <div style={{ padding: '14px 22px', borderTop: '1px solid #f1f5f9', textAlign: 'center' }}>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  <CloseCircleOutlined style={{ marginRight: 6 }} />
                  Yêu cầu này đã được đóng
                </Text>
              </div>
            )}
          </div>
        ) : (
          /* ── Empty state ── */
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0',
          }}>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div style={{ textAlign: 'center' }}>
                  <Text style={{ fontSize: 15, fontWeight: 600, display: 'block', marginBottom: 4 }}>
                    Chọn một yêu cầu để bắt đầu
                  </Text>
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    Chọn ticket từ danh sách bên trái để xem và phản hồi
                  </Text>
                </div>
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}
