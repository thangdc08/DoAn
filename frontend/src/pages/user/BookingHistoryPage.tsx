import { useState, useMemo } from 'react';
import { Card, Table, Tag, Button, Select, Space, Typography, Modal } from 'antd';
import { EyeOutlined, CalendarOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { mockBookings } from '../../data/mockBookings';
import type { Booking } from '../../types/booking.types';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

export default function BookingHistoryPage() {
  const [status, setStatus] = useState<string>('');
  const [page, setPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const pageSize = 10;

  const filteredBookings = useMemo(() => {
    return mockBookings.filter(booking => {
      return !status || booking.status === status;
    });
  }, [status]);

  const data = {
    content: filteredBookings.slice((page - 1) * pageSize, page * pageSize),
    totalElements: filteredBookings.length,
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'warning',
      PAID: 'success',
      FAILED: 'error',
      EXPIRED: 'default',
      CANCELLED_BY_ADMIN: 'error',
    };
    return colors[status] || 'default';
  };

  const getPaymentStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      UNPAID: 'error',
      PROCESSING: 'processing',
      SUCCESS: 'success',
      FAILED: 'error',
    };
    return colors[status] || 'default';
  };

  const columns = [
    {
      title: 'Mã booking',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => <Text copyable={{ text: id }}>{id.substring(0, 8)}...</Text>,
    },
    {
      title: 'Sân',
      dataIndex: 'venueNameSnapshot',
      key: 'venue',
      render: (name: string) => (
        <Space>
          <EnvironmentOutlined />
          {name}
        </Space>
      ),
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => (
        <Space>
          <CalendarOutlined />
          {dayjs(date).format('DD/MM/YYYY HH:mm')}
        </Space>
      ),
    },
    {
      title: 'Số slot',
      dataIndex: 'items',
      key: 'items',
      render: (items: any[]) => items?.length || 0,
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => (
        <Text strong style={{ color: '#52c41a' }}>
          {amount.toLocaleString()}đ
        </Text>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
    {
      title: 'Thanh toán',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (status: string) => <Tag color={getPaymentStatusColor(status)}>{status}</Tag>,
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Booking) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => setSelectedBooking(record)}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2}>Lịch sử đặt sân</Title>
      </div>

      <Card>
        <Space style={{ marginBottom: 16 }}>
          <Select
            placeholder="Lọc theo trạng thái"
            style={{ width: 200 }}
            value={status || undefined}
            onChange={setStatus}
            allowClear
          >
            <Option value="PENDING">Chờ thanh toán</Option>
            <Option value="PAID">Đã thanh toán</Option>
            <Option value="FAILED">Thất bại</Option>
            <Option value="EXPIRED">Hết hạn</Option>
          </Select>
        </Space>

        <Table
          columns={columns}
          dataSource={data.content}
          rowKey="id"
          pagination={{
            current: page,
            pageSize,
            total: data.totalElements,
            onChange: setPage,
            showSizeChanger: false,
            showTotal: (total) => `Tổng ${total} booking`,
          }}
        />
      </Card>

      {/* Booking Detail Modal */}
      <Modal
        title="Chi tiết booking"
        open={!!selectedBooking}
        onCancel={() => setSelectedBooking(null)}
        footer={[
          <Button key="close" onClick={() => setSelectedBooking(null)}>
            Đóng
          </Button>,
        ]}
        width={700}
      >
        {selectedBooking && (
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Text strong>Mã booking:</Text>
              <div>
                <Text copyable>{selectedBooking.id}</Text>
              </div>
            </div>

            <div>
              <Text strong>Sân:</Text>
              <div>{selectedBooking.venueNameSnapshot}</div>
            </div>

            <div>
              <Text strong>Trạng thái:</Text>
              <div>
                <Tag color={getStatusColor(selectedBooking.status)}>{selectedBooking.status}</Tag>
                <Tag color={getPaymentStatusColor(selectedBooking.paymentStatus)}>
                  {selectedBooking.paymentStatus}
                </Tag>
              </div>
            </div>

            <div>
              <Text strong>Chi tiết slot:</Text>
              {selectedBooking.items?.map((item) => (
                <Card key={item.id} size="small" style={{ marginTop: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Space direction="vertical" size="small">
                      <Text>{item.courtNameSnapshot}</Text>
                      <Text type="secondary">
                        {dayjs(item.startTime).format('DD/MM/YYYY HH:mm')} -{' '}
                        {dayjs(item.endTime).format('HH:mm')}
                      </Text>
                    </Space>
                    <Text strong style={{ color: '#52c41a' }}>
                      {item.priceSnapshot.toLocaleString()}đ
                    </Text>
                  </div>
                </Card>
              ))}
            </div>

            <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text strong style={{ fontSize: 16 }}>
                  Tổng tiền:
                </Text>
                <Text strong style={{ fontSize: 18, color: '#52c41a' }}>
                  {selectedBooking.totalAmount.toLocaleString()}đ
                </Text>
              </div>
            </div>

            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Ngày tạo: {dayjs(selectedBooking.createdAt).format('DD/MM/YYYY HH:mm')}
              </Text>
            </div>
          </Space>
        )}
      </Modal>
    </div>
  );
}
