import { Card, Table, Button, Space, Modal, Input, message, Typography, Tag, Avatar, Badge, Row, Col, Tabs, List, Divider, Alert } from 'antd';
import { 
  CheckOutlined, 
  CloseOutlined, 
  EyeOutlined, 
  ShopOutlined, 
  EnvironmentOutlined, 
  UserOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
  WifiOutlined,
  CarOutlined,
  CoffeeOutlined,
  ThunderboltOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { useState } from 'react';
import { BRAND } from '../../theme/antdTheme';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const MOCK_PENDING_VENUES = [
  {
    id: 'venue-101',
    name: 'Sân Cầu Lông Ngôi Sao',
    address: '123 Đường Số 7, Bình Tân',
    district: 'Bình Tân',
    city: 'TP. HCM',
    ownerName: 'Nguyễn Văn A',
    ownerId: 'owner-1',
    createdAt: '2024-05-10T08:00:00Z',
    courtCount: 12,
    status: 'PENDING',
    phone: '0901234567',
    description: 'Sân mới nâng cấp thảm, ánh sáng chuẩn thi đấu.',
    amenities: ['Wifi', 'Parking', 'Canteen', 'Locker']
  },
  {
    id: 'venue-102',
    name: 'Badminton Center Q10',
    address: '456 Tô Hiến Thành, Quận 10',
    district: 'Quận 10',
    city: 'TP. HCM',
    ownerName: 'Trần Thị B',
    ownerId: 'owner-2',
    createdAt: '2024-05-11T14:30:00Z',
    courtCount: 8,
    status: 'PENDING',
    phone: '0908889990',
    description: 'Vị trí trung tâm, sân thảm gỗ chất lượng cao.',
    amenities: ['Wifi', 'Parking', 'Shower']
  }
];

export default function VenueApprovalPage() {
  const navigate = useNavigate();
  const [rejectVenue, setRejectVenue] = useState<any | null>(null);
  const [viewVenue, setViewVenue] = useState<any | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [venues, setVenues] = useState(MOCK_PENDING_VENUES);

  const handleApprove = (id: string) => {
    message.success('Đã duyệt sân thành công!');
    setVenues(prev => prev.filter(v => v.id !== id));
    setViewVenue(null);
  };

  const handleReject = () => {
    if (!rejectReason) return message.warning('Vui lòng nhập lý do từ chối');
    message.error('Đã từ chối sân!');
    setVenues(prev => prev.filter(v => v.id !== rejectVenue.id));
    setRejectVenue(null);
    setRejectReason('');
  };

  const columns = [
    {
      title: 'Cơ sở đăng ký',
      key: 'venue',
      render: (_: any, record: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(0,91,172,0.1)', color: BRAND.sky, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
            <ShopOutlined />
          </div>
          <div>
            <Text strong style={{ display: 'block' }}>{record.name}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              <EnvironmentOutlined style={{ marginRight: 4 }} />
              {record.address}, {record.district}
            </Text>
          </div>
        </div>
      )
    },
    {
      title: 'Chủ sở hữu',
      key: 'owner',
      render: (_: any, record: any) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          <Text>{record.ownerName}</Text>
        </Space>
      )
    },
    {
      title: 'Quy mô',
      dataIndex: 'courtCount',
      key: 'courts',
      render: (count: number) => <Tag color="blue" style={{ borderRadius: 4 }}>{count} sân</Tag>
    },
    {
      title: 'Ngày gửi',
      dataIndex: 'createdAt',
      key: 'date',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm')
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'right' as const,
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => setViewVenue(record)}>Chi tiết</Button>
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={() => handleApprove(record.id)}
            style={{ background: BRAND.primary, border: 'none' }}
          >
            Duyệt
          </Button>
          <Button
            danger
            icon={<CloseOutlined />}
            onClick={() => setRejectVenue(record)}
          >
            Từ chối
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>Phê duyệt Sân mới</Title>
          <Text type="secondary">Xem xét và xác minh thông tin các cơ sở cầu lông mới tham gia hệ thống.</Text>
        </div>
        <Badge count={venues.length} offset={[10, 0]}>
           <Text strong style={{ background: '#fff', padding: '8px 16px', borderRadius: 10, border: '1px solid #f1f5f9' }}>
             Đang chờ: {venues.length} đơn
           </Text>
        </Badge>
      </div>

      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card 
            bodyStyle={{ padding: 0 }} 
            style={{ borderRadius: 16, overflow: 'hidden', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}
          >
            <Table
              columns={columns}
              dataSource={venues}
              rowKey="id"
              pagination={false}
              locale={{ emptyText: 'Hiện không có đơn đăng ký nào đang chờ duyệt' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Detailed Review Modal (Owner-like capabilities) */}
      <Modal
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: 40 }}>
             <Space><ShopOutlined style={{ color: BRAND.primary }} /> <Text strong>Hồ sơ cơ sở: {viewVenue?.name}</Text></Space>
             <Tag color="warning">Đang chờ duyệt</Tag>
          </div>
        }
        open={!!viewVenue}
        onCancel={() => setViewVenue(null)}
        width={900}
        footer={[
          <Button key="close" onClick={() => setViewVenue(null)}>Đóng</Button>,
          <Button key="reject" danger icon={<CloseOutlined />} onClick={() => { setRejectVenue(viewVenue); setViewVenue(null); }}>Từ chối</Button>,
          <Button key="approve" type="primary" icon={<CheckOutlined />} style={{ background: BRAND.primary }} onClick={() => handleApprove(viewVenue.id)}>Duyệt hệ thống</Button>
        ]}
      >
        <Tabs
          defaultActiveKey="1"
          items={[
            {
              key: '1',
              label: 'Thông tin chung',
              children: (
                <div style={{ padding: '16px 0' }}>
                   <Row gutter={[32, 32]}>
                      <Col span={14}>
                         <Title level={5}>Mô tả</Title>
                         <Paragraph>{viewVenue?.description}</Paragraph>
                         <Divider />
                         <Title level={5}>Địa chỉ & Liên hệ</Title>
                         <List size="small">
                            <List.Item><Space><EnvironmentOutlined /> {viewVenue?.address}, {viewVenue?.district}, {viewVenue?.city}</Space></List.Item>
                            <List.Item><Space><UserOutlined /> Chủ sân: {viewVenue?.ownerName}</Space></List.Item>
                            <List.Item><Space><ThunderboltOutlined /> Hotline: {viewVenue?.phone}</Space></List.Item>
                         </List>
                      </Col>
                      <Col span={10}>
                         <Card size="small" title="Hình ảnh cơ sở" style={{ borderRadius: 12 }}>
                            <div style={{ width: '100%', height: 180, background: '#f1f5f9', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                               No Preview Image
                            </div>
                         </Card>
                         <div style={{ marginTop: 20 }}>
                            <Title level={5}>Tiện ích</Title>
                            <Space wrap>
                               <Tag icon={<WifiOutlined />}>Free Wifi</Tag>
                               <Tag icon={<CarOutlined />}>Bãi đỗ xe</Tag>
                               <Tag icon={<CoffeeOutlined />}>Canteen</Tag>
                            </Space>
                         </div>
                      </Col>
                   </Row>
                </div>
              )
            },
            {
              key: '2',
              label: `Danh sách sân (${viewVenue?.courtCount})`,
              children: (
                <div style={{ padding: '16px 0' }}>
                   <Alert message="Admin có quyền quản lý trực tiếp sân lẻ của cơ sở này sau khi duyệt." type="info" showIcon style={{ marginBottom: 16 }} />
                   <Table
                      size="small"
                      columns={[
                        { title: 'Tên sân', dataIndex: 'name', key: 'name' },
                        { title: 'Loại', dataIndex: 'type', key: 'type', render: (t) => <Tag color="blue">{t}</Tag> },
                        { title: 'Giá mặc định', dataIndex: 'price', key: 'price' }
                      ]}
                      dataSource={[
                        { id: 1, name: 'Sân 1', type: 'STANDARD', price: '80.000đ' },
                        { id: 2, name: 'Sân 2', type: 'STANDARD', price: '80.000đ' },
                        { id: 3, name: 'Sân 3 (VIP)', type: 'VIP', price: '120.000đ' },
                      ]}
                      pagination={false}
                   />
                   <Button 
                    type="link" 
                    icon={<SettingOutlined />} 
                    style={{ marginTop: 12 }}
                    onClick={() => navigate(`/owner/venues/${viewVenue.id}/courts`)}
                   >
                      Truy cập trang quản lý sân chi tiết
                   </Button>
                </div>
              )
            },
            {
              key: '3',
              label: 'Chính sách vận hành',
              children: (
                <div style={{ padding: '16px 0' }}>
                   <Row gutter={[16, 16]}>
                      <Col span={12}>
                         <Card size="small" style={{ borderRadius: 10 }}>
                            <Space direction="vertical">
                               <Text strong><ClockCircleOutlined /> Thời gian hủy tối thiểu</Text>
                               <Text>24 giờ trước trận đấu</Text>
                            </Space>
                         </Card>
                      </Col>
                      <Col span={12}>
                         <Card size="small" style={{ borderRadius: 10 }}>
                            <Space direction="vertical">
                               <Text strong><SafetyCertificateOutlined /> Đặt cọc bắt buộc</Text>
                               <Text>100% giá trị slot</Text>
                            </Space>
                         </Card>
                      </Col>
                   </Row>
                </div>
              )
            }
          ]}
        />
      </Modal>

      <Modal
        title={
          <div style={{ color: '#ff4d4f' }}>
             <CloseOutlined style={{ marginRight: 8 }} />
             Từ chối yêu cầu đăng ký
          </div>
        }
        open={!!rejectVenue}
        onCancel={() => {
          setRejectVenue(null);
          setRejectReason('');
        }}
        onOk={handleReject}
        okText="Gửi thông báo từ chối"
        okButtonProps={{ danger: true }}
      >
        <div style={{ marginBottom: 16 }}>
           <Text type="secondary">Bạn đang từ chối sân:</Text>
           <div style={{ fontWeight: 'bold', fontSize: 16, marginTop: 4 }}>{rejectVenue?.name}</div>
        </div>
        <Text strong>Lý do từ chối:</Text>
        <TextArea
          rows={4}
          placeholder="Ví dụ: Hình ảnh không rõ ràng, thông tin địa chỉ sai lệch, chưa có giấy phép kinh doanh..."
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          style={{ marginTop: 8, borderRadius: 10 }}
        />
        <div style={{ marginTop: 12, fontSize: 13, color: '#94a3b8' }}>
           * Lý do này sẽ được gửi trực tiếp đến email của chủ sân.
        </div>
      </Modal>
    </div>
  );
}
