import { useState, useMemo } from 'react';
import { Card, Table, Tag, Typography, Space, Input, Button, Select, Modal, Divider, Descriptions, message, Badge } from 'antd';
import { 
  SearchOutlined, 
  FilterOutlined, 
  ExportOutlined, 
  MessageOutlined, 
  FileTextOutlined, 
  CalendarOutlined, 
  UserOutlined, 
  DollarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { BRAND } from '../../theme/antdTheme';
import { useNavigate } from 'react-router-dom';
import { bookingApi } from '../../services/bookingApi';
import { venueApi } from '../../services/venueApi';
import { authApi } from '../../services/authApi';
import type { Booking } from '../../types/booking.types';

const { Title, Text } = Typography;
const { Option } = Select;

// Component to dynamically fetch and display customer name/avatar
function CustomerName({ userId }: { userId: string }) {
  const { data: user, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => authApi.getUserById(userId),
    staleTime: 5 * 60 * 1000, // cache for 5 minutes
    retry: false,
  });

  if (isLoading) {
    return <Text type="secondary" style={{ fontSize: 13 }}>Đang tải...</Text>;
  }

  const displayName = user?.fullName || user?.email || `Khách hàng #${userId.substring(0, 4)}`;
  const avatarUrl = user?.avatarUrl;
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {avatarUrl ? (
        <img 
          src={avatarUrl} 
          alt={displayName} 
          style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} 
        />
      ) : (
        <div style={{ 
          width: 32, 
          height: 32, 
          borderRadius: '50%', 
          background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', 
          color: '#fff', 
          display: 'flex', 
          alignItems: 'center', 
          justify: 'center', 
          fontWeight: 'bold', 
          fontSize: 12,
          boxShadow: '0 2px 4px rgba(5, 150, 105, 0.2)'
        }}>
          {initial}
        </div>
      )}
      <Text style={{ fontWeight: 500 }}>{displayName}</Text>
    </div>
  );
}

export default function OwnerBookingPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedVenueId, setSelectedVenueId] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);

  // Fetch managed venues
  const { data: venues = [] } = useQuery({
    queryKey: ['my-venues'],
    queryFn: () => venueApi.getMyVenues(),
  });

  // Fetch bookings from backend
  const { data: bookingsData, isLoading: bookingsLoading } = useQuery({
    queryKey: ['owner-bookings', selectedVenueId, statusFilter, currentPage, pageSize],
    queryFn: () => bookingApi.getOwnerBookings({
      venueId: selectedVenueId === 'all' ? undefined : selectedVenueId,
      status: statusFilter === 'all' ? undefined : statusFilter,
      page: currentPage - 1,
      size: pageSize,
    }),
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'warning',
      PAID: 'processing',
      CONFIRMED: 'success',
      FAILED: 'error',
      EXPIRED: 'default',
      CANCELLED_BY_USER: 'error',
      CANCELLED_BY_OWNER: 'error',
      CANCELLED_BY_ADMIN: 'error',
    };
    return colors[status] || 'default';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      PENDING: 'Chờ thanh toán',
      PAID: 'Chờ duyệt',
      CONFIRMED: 'Đã xác nhận',
      FAILED: 'Thất bại',
      EXPIRED: 'Hết hạn',
      CANCELLED_BY_USER: 'Khách tự hủy',
      CANCELLED_BY_OWNER: 'Chủ sân từ chối',
      CANCELLED_BY_ADMIN: 'Admin hủy',
    };
    return labels[status] || status;
  };

  // Mutation for owner confirming booking
  const confirmMutation = useMutation({
    mutationFn: (bookingId: string) => bookingApi.confirmBookingByOwner(bookingId),
    onSuccess: () => {
      message.success('Đã xác nhận đơn đặt sân thành công!');
      queryClient.invalidateQueries({ queryKey: ['owner-bookings'] });
      setIsDetailModalOpen(false);
    },
    onError: (err: any) => {
      message.error(err.message || 'Có lỗi xảy ra khi xác nhận đơn.');
    }
  });

  // Mutation for owner rejecting booking
  const rejectMutation = useMutation({
    mutationFn: ({ bookingId, reason }: { bookingId: string, reason?: string }) => 
      bookingApi.rejectBookingByOwner(bookingId, reason),
    onSuccess: () => {
      message.success('Đã từ chối đơn đặt sân và hoàn tiền cho khách.');
      queryClient.invalidateQueries({ queryKey: ['owner-bookings'] });
      setIsDetailModalOpen(false);
    },
    onError: (err: any) => {
      message.error(err.message || 'Có lỗi xảy ra khi từ chối đơn.');
    }
  });

  const handleReject = (bookingId: string) => {
    let reason = '';
    Modal.confirm({
      title: 'Từ chối đơn đặt sân',
      icon: <FilterOutlined style={{ color: '#ef4444' }} />,
      content: (
        <div style={{ marginTop: 12 }}>
          <Text type="secondary">Nhập lý do từ chối (lý do này sẽ được gửi mail cho khách hàng):</Text>
          <Input 
            placeholder="Lý do từ chối..." 
            style={{ marginTop: 8, borderRadius: 6 }}
            onChange={(e) => { reason = e.target.value; }}
          />
        </div>
      ),
      okText: 'Xác nhận từ chối',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: () => {
        return rejectMutation.mutateAsync({ bookingId, reason: reason || 'Chủ sân bận đột xuất' });
      }
    });
  };

  // Client-side search filter on the current page content
  const filteredBookings = useMemo(() => {
    if (!bookingsData?.content) return [];
    if (!searchQuery) return bookingsData.content;
    const q = searchQuery.toLowerCase();
    return bookingsData.content.filter((b) => {
      const idMatch = b.id.toLowerCase().includes(q);
      const venueMatch = b.venueNameSnapshot.toLowerCase().includes(q);
      return idMatch || venueMatch;
    });
  }, [bookingsData, searchQuery]);

  const columns = [
    {
      title: 'Mã đơn',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => (
        <Text strong style={{ fontFamily: 'monospace', color: '#334155' }}>
          #{id.substring(0, 8).toUpperCase()}
        </Text>
      ),
    },
    {
      title: 'Khách hàng',
      dataIndex: 'userId',
      key: 'customer',
      render: (userId: string) => <CustomerName userId={userId} />,
    },
    {
      title: 'Sân / Khung giờ',
      key: 'details',
      render: (_: any, record: Booking) => {
        if (!record.items || record.items.length === 0) {
          return (
            <Space direction="vertical" size={0}>
              <Text strong>{record.venueNameSnapshot}</Text>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {dayjs(record.createdAt).format('DD/MM/YYYY HH:mm')}
              </Text>
            </Space>
          );
        }

        const firstItem = record.items[0];
        const courtName = firstItem.courtNameSnapshot || `Sân #${firstItem.courtId.substring(0, 4)}`;
        const dateStr = dayjs(firstItem.startTime).format('DD/MM/YYYY');
        const timeStr = `${dayjs(firstItem.startTime).format('HH:mm')} - ${dayjs(firstItem.endTime).format('HH:mm')}`;

        return (
          <Space direction="vertical" size={0}>
            <Text strong>{record.venueNameSnapshot} - {courtName}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {dateStr} | {timeStr} {record.items.length > 1 ? `(+${record.items.length - 1} ca)` : ''}
            </Text>
          </Space>
        );
      },
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => (
        <Text strong style={{ color: BRAND.primary, fontSize: '15px' }}>
          {amount.toLocaleString('vi-VN')}đ
        </Text>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)} style={{ borderRadius: 6, fontWeight: 600, padding: '2px 10px' }}>
          {getStatusLabel(status)}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_: any, record: Booking) => (
        <Space>
          {record.status === 'PAID' && (
            <>
              <Button
                type="primary"
                size="small"
                onClick={() => confirmMutation.mutate(record.id)}
                loading={confirmMutation.isPending && selectedBooking?.id === record.id}
                style={{ borderRadius: 6, background: '#10b981', borderColor: '#10b981' }}
              >
                Duyệt
              </Button>
              <Button
                type="primary"
                danger
                ghost
                size="small"
                onClick={() => handleReject(record.id)}
                loading={rejectMutation.isPending && selectedBooking?.id === record.id}
                style={{ borderRadius: 6 }}
              >
                Từ chối
              </Button>
            </>
          )}
          <Button
            type="primary"
            ghost
            icon={<MessageOutlined />}
            size="small"
            onClick={() => navigate('/chat')}
            style={{ borderRadius: 6 }}
          >
            Chat
          </Button>
          <Button 
            type="link" 
            style={{ fontWeight: 600 }} 
            size="small"
            onClick={() => {
              setSelectedBooking(record);
              setIsDetailModalOpen(true);
            }}
          >
            Chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ margin: 0, fontWeight: 700 }}>Quản lý Booking</Title>
          <Text type="secondary">Theo dõi và quản lý các lượt đặt sân tại cơ sở của bạn</Text>
        </div>
        <Space>
          <Select 
            value={selectedVenueId}
            onChange={(val) => {
              setSelectedVenueId(val);
              setCurrentPage(1);
            }}
            style={{ width: 220 }}
            placeholder="Lọc theo cơ sở"
            dropdownStyle={{ borderRadius: 8 }}
          >
            <Option value="all">Tất cả cơ sở</Option>
            {venues.map((venue) => (
              <Option key={venue.id} value={venue.id}>{venue.name}</Option>
            ))}
          </Select>
          <Button icon={<ExportOutlined />} style={{ borderRadius: 8 }}>Xuất báo cáo</Button>
        </Space>
      </div>

      <Card 
        bodyStyle={{ padding: 0 }} 
        style={{ 
          borderRadius: 16, 
          overflow: 'hidden', 
          border: '1px solid #e2e8f0', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)' 
        }}
      >
        <div style={{ 
          padding: '16px 24px', 
          borderBottom: '1px solid #f1f5f9', 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#fafafa',
          gap: 16,
          flexWrap: 'wrap'
        }}>
          <Input 
            placeholder="Tìm mã đơn, tên cơ sở..." 
            prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: 300, borderRadius: 10 }}
            allowClear
          />
          <Space>
            <Select 
              value={statusFilter}
              onChange={(val) => {
                setStatusFilter(val);
                setCurrentPage(1);
              }}
              style={{ width: 160 }}
              dropdownStyle={{ borderRadius: 8 }}
            >
              <Option value="all">Tất cả trạng thái</Option>
              <Option value="PENDING">Chờ thanh toán</Option>
              <Option value="PAID">Đã thanh toán</Option>
              <Option value="FAILED">Thất bại</Option>
              <Option value="EXPIRED">Hết hạn</Option>
            </Select>
            <Button icon={<FilterOutlined />} style={{ borderRadius: 8 }}>Bộ lọc nâng cao</Button>
          </Space>
        </div>
        
        <Table
          columns={columns}
          dataSource={filteredBookings}
          rowKey="id"
          loading={bookingsLoading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: bookingsData?.totalElements || 0,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
            showSizeChanger: true,
            style: { paddingRight: 24, paddingBottom: 16 }
          }}
          style={{ padding: '0 8px' }}
        />
      </Card>

      {/* Booking Receipt-Style Details Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FileTextOutlined style={{ color: BRAND.primary, fontSize: 20 }} />
            <span style={{ fontWeight: 700, fontSize: 18 }}>Chi tiết đơn đặt sân</span>
          </div>
        }
        visible={isDetailModalOpen}
        onCancel={() => setIsDetailModalOpen(false)}
        footer={
          selectedBooking && selectedBooking.status === 'PAID' ? [
            <Button 
              key="reject" 
              type="primary" 
              danger 
              ghost 
              onClick={() => handleReject(selectedBooking.id)}
              style={{ borderRadius: 8 }}
            >
              Từ chối đơn
            </Button>,
            <Button 
              key="confirm" 
              type="primary" 
              onClick={() => confirmMutation.mutate(selectedBooking.id)}
              loading={confirmMutation.isPending}
              style={{ borderRadius: 8, background: '#10b981', borderColor: '#10b981' }}
            >
              Xác nhận duyệt
            </Button>,
            <Button key="close" onClick={() => setIsDetailModalOpen(false)} style={{ borderRadius: 8 }}>
              Hủy bỏ
            </Button>
          ] : [
            <Button key="close" type="primary" onClick={() => setIsDetailModalOpen(false)} style={{ borderRadius: 8 }}>
              Đóng
            </Button>
          ]
        }
        width={550}
        bodyStyle={{ padding: '12px 24px 24px 24px' }}
        centered
      >
        {selectedBooking && (
          <div>
            <div style={{ textAlign: 'center', margin: '16px 0 24px 0' }}>
              <Tag color={getStatusColor(selectedBooking.status)} style={{ borderRadius: 8, fontWeight: 700, padding: '4px 14px', fontSize: 14 }}>
                {getStatusLabel(selectedBooking.status)}
              </Tag>
              <div style={{ marginTop: 8 }}>
                <Text type="secondary" style={{ fontSize: 13 }}>Mã giao dịch: </Text>
                <Text strong style={{ fontFamily: 'monospace' }}>#{selectedBooking.id.toUpperCase()}</Text>
              </div>
            </div>

            <Divider style={{ margin: '12px 0' }} />

            <Descriptions title="Thông tin chung" column={1} size="small" labelStyle={{ color: '#64748b', fontWeight: 500 }}>
              <Descriptions.Item label="Khách hàng">
                <CustomerName userId={selectedBooking.userId} />
              </Descriptions.Item>
              <Descriptions.Item label="Thời gian đặt">
                <Space>
                  <CalendarOutlined style={{ color: '#64748b' }} />
                  {dayjs(selectedBooking.createdAt).format('DD/MM/YYYY HH:mm:ss')}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Thanh toán">
                <Badge 
                  status={selectedBooking.paymentStatus === 'SUCCESS' ? 'success' : 'default'} 
                  text={selectedBooking.paymentStatus === 'SUCCESS' ? 'Đã hoàn tất thanh toán' : 'Chưa thanh toán'} 
                />
              </Descriptions.Item>
            </Descriptions>

            <Divider style={{ margin: '16px 0' }} />

            <div style={{ marginBottom: 12 }}>
              <Text strong style={{ fontSize: 15, color: '#1e293b' }}>Danh sách khung giờ đặt sân</Text>
            </div>

            <div style={{ background: '#f8fafc', borderRadius: 12, padding: 16, border: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {selectedBooking.items && selectedBooking.items.length > 0 ? (
                  selectedBooking.items.map((item, index) => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Space direction="vertical" size={0}>
                        <Text strong style={{ color: '#334155' }}>
                          {item.courtNameSnapshot || `Sân #${item.courtId.substring(0, 4)}`}
                        </Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          <ClockCircleOutlined style={{ marginRight: 4 }} />
                          {dayjs(item.startTime).format('DD/MM/YYYY')} | {dayjs(item.startTime).format('HH:mm')} - {dayjs(item.endTime).format('HH:mm')}
                        </Text>
                      </Space>
                      <Text strong style={{ color: '#475569' }}>
                        {item.priceSnapshot.toLocaleString('vi-VN')}đ
                      </Text>
                    </div>
                  ))
                ) : (
                  <Text type="secondary">Không có chi tiết khung giờ.</Text>
                )}
              </div>

              <Divider style={{ margin: '12px 0', borderStyle: 'dashed' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text strong style={{ fontSize: 15, color: '#1e293b' }}>Tổng thanh toán</Text>
                <Text strong style={{ fontSize: 20, color: BRAND.primary }}>
                  {selectedBooking.totalAmount.toLocaleString('vi-VN')}đ
                </Text>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
