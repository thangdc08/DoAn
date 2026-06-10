import { useMemo } from 'react';
import { Card, Row, Col, Typography, Table, Tag, Button, Space, Statistic, Spin, Alert, message } from 'antd';
import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  SearchOutlined,
  QrcodeOutlined,
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { BRAND } from '../../theme/antdTheme';
import { venueApi } from '../../services/venueApi';
import { bookingApi } from '../../services/bookingApi';

const { Title, Text } = Typography;

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  PAID: { label: 'Đã thanh toán', color: 'success' },
  PENDING: { label: 'Chờ xử lý', color: 'warning' },
  FAILED: { label: 'Thất bại', color: 'error' },
  EXPIRED: { label: 'Hết hạn', color: 'default' },
  CANCELLED_BY_ADMIN: { label: 'Đã huỷ', color: 'default' },
  CANCELLED_BY_USER: { label: 'Khách huỷ', color: 'default' },
};

export default function StaffDashboardPage() {
  const queryClient = useQueryClient();
  const { data: venues = [] } = useQuery({
    queryKey: ['staff-venues'],
    queryFn: () => venueApi.getMyVenues(),
  });

  const venueIds = venues.map(v => v.id);

  const { data: bookingsPage, isLoading } = useQuery({
    queryKey: ['staff-today-bookings', venueIds.join(',')],
    queryFn: () => {
      if (venueIds.length === 0) return Promise.resolve({ content: [], totalElements: 0, totalPages: 0 });
      return bookingApi.getTodayBookings({ venueId: venueIds[0] });
    },
    enabled: venueIds.length > 0,
  });

  const bookings = bookingsPage?.content || [];

  const checkedIn = useMemo(() => bookings.filter((b: any) => b.checkedIn).length, [bookings]);
  const pending = useMemo(
    () => bookings.filter((b: any) => b.status === 'PAID' && !b.checkedIn).length,
    [bookings]
  );

  const checkInMutation = useMutation({
    mutationFn: (bookingId: string) => bookingApi.checkInBooking(bookingId),
    onSuccess: () => {
      message.success('Check-in thành công!');
      queryClient.invalidateQueries({ queryKey: ['staff-today-bookings'] });
    },
    onError: () => {
      message.error('Check-in thất bại, vui lòng thử lại');
    },
  });

  const columns = [
    {
      title: 'Khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
      render: (text: string, record: any) => (
        <Space>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: '#f1f5f9', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 13, color: BRAND.primary
          }}>
            {text.charAt(0).toUpperCase()}
          </div>
          <div>
            <Text strong style={{ fontSize: 13 }}>{text}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 11 }}>{record.customerEmail}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Sân',
      dataIndex: 'courtName',
      key: 'courtName',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Thời gian',
      key: 'time',
      render: (_: any, record: any) => (
        <Text style={{ fontSize: 13 }}>
          {dayjs(record.startTime).format('HH:mm')} - {dayjs(record.endTime).format('HH:mm')}
        </Text>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const cfg = STATUS_CONFIG[status] || { label: status, color: 'default' };
        return <Tag color={cfg.color}>{cfg.label}</Tag>;
      },
    },
    {
      title: 'Check-in',
      dataIndex: 'checkedIn',
      key: 'checkedIn',
      render: (checkedIn: boolean) =>
        checkedIn ? (
          <Tag color="success" icon={<CheckCircleOutlined />}>Đã check-in</Tag>
        ) : (
          <Tag color="default">Chưa check-in</Tag>
        ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          {!record.checkedIn && record.status === 'PAID' && (
            <Button
              type="primary"
              size="small"
              icon={<QrcodeOutlined />}
              onClick={() => checkInMutation.mutate(record.id)}
              loading={checkInMutation.isPending}
              style={{ borderRadius: 8 }}
            >
              Check-in
            </Button>
          )}
          <Button
            size="small"
            icon={<SearchOutlined />}
            onClick={() => handleViewDetail(record)}
            style={{ borderRadius: 8 }}
          >
            Chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  const handleViewDetail = (record: any) => {
    console.log('View booking detail:', record.id);
  };

  return (
    <div style={{ padding: 0 }}>
      <Alert
        message="Chế độ Nhân viên"
        description="Bạn có quyền xem và check-in các lượt đặt sân. Các thao tác chỉnh sửa cấu hình không khả dụng."
        type="info"
        showIcon
        style={{ marginBottom: 24, borderRadius: 12 }}
      />

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <Statistic
              title={<Text type="secondary" style={{ fontSize: 13 }}>Booking hôm nay</Text>}
              value={bookings.length}
              prefix={<CalendarOutlined style={{ color: BRAND.primary }} />}
              valueStyle={{ fontWeight: 800, fontSize: 28 }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <Statistic
              title={<Text type="secondary" style={{ fontSize: 13 }}>Đã check-in</Text>}
              value={checkedIn}
              prefix={<CheckCircleOutlined style={{ color: '#10b981' }} />}
              valueStyle={{ fontWeight: 800, fontSize: 28, color: '#10b981' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <Statistic
              title={<Text type="secondary" style={{ fontSize: 13 }}>Chờ check-in</Text>}
              value={pending}
              prefix={<ClockCircleOutlined style={{ color: '#f59e0b' }} />}
              valueStyle={{ fontWeight: 800, fontSize: 28, color: '#f59e0b' }}
            />
          </Card>
        </Col>
      </Row>

      <Card
        bordered={false}
        style={{ borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Title level={4} style={{ margin: 0 }}>Danh sách Booking hôm nay</Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            {dayjs().format('DD/MM/YYYY')}
          </Text>
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Spin size="large" />
          </div>
        ) : (
          <Table
            rowKey="id"
            columns={columns}
            dataSource={bookings}
            pagination={{ pageSize: 10, size: 'small' }}
            size="middle"
          />
        )}
      </Card>
    </div>
  );
}
