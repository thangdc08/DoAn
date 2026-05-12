import { Card, Table, Tag, Typography, Space, Input, Button } from 'antd';
import { SearchOutlined, FilterOutlined, ExportOutlined } from '@ant-design/icons';
import { mockBookings } from '../../data/mockBookings';
import dayjs from 'dayjs';
import { BRAND } from '../../theme/antdTheme';

const { Title, Text } = Typography;

export default function OwnerBookingPage() {
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'warning',
      PAID: 'success',
      FAILED: 'error',
      EXPIRED: 'default',
    };
    return colors[status] || 'default';
  };

  const columns = [
    {
      title: 'Mã đơn',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => <Text strong>#{id.substring(0, 8).toUpperCase()}</Text>,
    },
    {
      title: 'Khách hàng',
      dataIndex: 'userId',
      key: 'customer',
      render: (userId: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: BRAND.primary, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 12 }}>
            {userId.charAt(0).toUpperCase()}
          </div>
          <Text>Khách hàng #{userId.substring(0, 4)}</Text>
        </div>
      ),
    },
    {
      title: 'Sân / Khung giờ',
      key: 'details',
      render: (_: any, record: any) => (
        <Space direction="vertical" size={0}>
          <Text strong>{record.venueNameSnapshot}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {dayjs(record.createdAt).format('DD/MM/YYYY')} | 18:00 - 20:00
          </Text>
        </Space>
      ),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => (
        <Text strong style={{ color: BRAND.primary }}>
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
          {status}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: () => (
        <Button type="link" style={{ fontWeight: 700 }}>Chi tiết</Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>Quản lý Booking</Title>
          <Text type="secondary">Theo dõi và quản lý các lượt đặt sân tại cơ sở của bạn</Text>
        </div>
        <Space>
          <Button icon={<ExportOutlined />}>Xuất báo cáo</Button>
          <Button type="primary" style={{ background: BRAND.primary }}>Cập nhật trạng thái</Button>
        </Space>
      </div>

      <Card 
        bodyStyle={{ padding: 0 }} 
        style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid #f1f5f9', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}
      >
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' }}>
          <Input 
            placeholder="Tìm mã đơn, tên khách..." 
            prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
            style={{ width: 300, borderRadius: 10 }}
          />
          <Button icon={<FilterOutlined />}>Bộ lọc nâng cao</Button>
        </div>
        
        <Table
          columns={columns}
          dataSource={mockBookings}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          style={{ padding: '0 8px' }}
        />
      </Card>
    </div>
  );
}
