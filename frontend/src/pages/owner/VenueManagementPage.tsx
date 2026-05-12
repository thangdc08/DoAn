import { useState } from 'react';
import { Card, Button, Table, Tag, Space, Modal, Form, Input, Select, message, Typography, Row, Col, Tabs, Checkbox, Divider, Avatar, Tooltip } from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  EyeOutlined, 
  EnvironmentOutlined, 
  WifiOutlined, 
  CarOutlined, 
  CoffeeOutlined, 
  ThunderboltOutlined,
  GlobalOutlined,
  ShopOutlined,
  CustomerServiceOutlined
} from '@ant-design/icons';
import { mockVenues } from '../../data/mockVenues';
import { useNavigate } from 'react-router-dom';
import type { Venue } from '../../types/venue.types';
import { BRAND } from '../../theme/antdTheme';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function VenueManagementPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);
  const [venues] = useState(mockVenues.filter(v => v.ownerId === 'owner-1'));

  const handleCreate = () => {
    setEditingVenue(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (venue: Venue) => {
    setEditingVenue(venue);
    form.setFieldsValue(venue);
    setIsModalOpen(true);
  };

  const handleSubmit = (values: any) => {
    console.log('Mock create/update venue:', values);
    message.success(editingVenue ? 'Cập nhật sân thành công!' : 'Tạo sân thành công! Hồ sơ đang chờ duyệt.');
    setIsModalOpen(false);
    form.resetFields();
    setEditingVenue(null);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING_APPROVAL: 'warning',
      APPROVED: 'success',
      REJECTED: 'error',
      SUSPENDED: 'default',
    };
    return colors[status] || 'default';
  };

  const columns = [
    {
      title: 'Thông tin cơ sở',
      key: 'venue',
      render: (_: any, record: Venue) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar size={48} shape="square" icon={<ShopOutlined />} style={{ background: '#f1f5f9', color: BRAND.primary, borderRadius: 10 }} />
          <div>
            <Text strong style={{ display: 'block', fontSize: 15 }}>{record.name}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
               <EnvironmentOutlined /> {record.district}, {record.city}
            </Text>
          </div>
        </div>
      )
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Đánh giá',
      dataIndex: 'ratingAvg',
      key: 'rating',
      render: (rating: number, record: Venue) => (
        <Space direction="vertical" size={0}>
          <Text strong>{(rating || 0).toFixed(1)} ⭐</Text>
          <Text type="secondary" style={{ fontSize: 11 }}>{record.ratingCount || 0} đánh giá</Text>
        </Space>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <Tag color={getStatusColor(status)} style={{ borderRadius: 6, fontWeight: 600 }}>{status}</Tag>,
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'right' as const,
      render: (_: any, record: Venue) => (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/owner/venues/${record.id}/courts`)}
            style={{ background: BRAND.primary, border: 'none' }}
          >
            Quản lý sân lẻ
          </Button>
          <Tooltip title="Chỉnh sửa thông tin">
            <Button
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const BasicInfoTab = (
    <div style={{ padding: '20px 0' }}>
       <Form.Item 
          label={<Text strong>Tên cơ sở cầu lông</Text>} 
          name="name" 
          rules={[
            { required: true, message: 'Vui lòng nhập tên cơ sở' },
            { min: 5, message: 'Tên cơ sở phải có ít nhất 5 ký tự' }
          ]}
       >
          <Input placeholder="VD: Sân cầu lông Ngôi Sao" size="large" style={{ borderRadius: 10 }} />
       </Form.Item>
       <Form.Item label={<Text strong>Mô tả cơ sở</Text>} name="description">
          <TextArea rows={4} placeholder="Giới thiệu về chất lượng sân, ánh sáng..." style={{ borderRadius: 10 }} />
       </Form.Item>
       <Row gutter={16}>
          <Col span={12}>
             <Form.Item 
                label={<Text strong>Số điện thoại hotline</Text>} 
                name="phone" 
                rules={[
                  { required: true, message: 'Vui lòng nhập số điện thoại' },
                  { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ (10-11 số)' }
                ]}
             >
                <Input placeholder="090..." style={{ borderRadius: 10 }} />
             </Form.Item>
          </Col>
          <Col span={12}>
             <Form.Item 
                label={<Text strong>Email liên hệ</Text>} 
                name="email"
                rules={[
                  { type: 'email', message: 'Email không hợp lệ' }
                ]}
             >
                <Input placeholder="contact@..." style={{ borderRadius: 10 }} />
             </Form.Item>
          </Col>
       </Row>
    </div>
  );

  const LocationTab = (
    <div style={{ padding: '20px 0' }}>
       <Form.Item label={<Text strong>Địa chỉ chi tiết</Text>} name="address" rules={[{ required: true }]}>
          <Input placeholder="Số nhà, tên đường..." style={{ borderRadius: 10 }} />
       </Form.Item>
       <Row gutter={16}>
          <Col span={8}>
             <Form.Item 
                label={<Text strong>Thành phố</Text>} 
                name="city" 
                rules={[{ required: true, message: 'Vui lòng chọn thành phố' }]}
             >
                <Select style={{ borderRadius: 10 }} placeholder="Chọn thành phố">
                   <Option value="Hồ Chí Minh">TP. HCM</Option>
                   <Option value="Hà Nội">Hà Nội</Option>
                </Select>
             </Form.Item>
          </Col>
          <Col span={8}>
             <Form.Item 
                label={<Text strong>Quận / Huyện</Text>} 
                name="district" 
                rules={[{ required: true, message: 'Vui lòng nhập quận/huyện' }]}
             >
                <Input placeholder="Bình Tân..." style={{ borderRadius: 10 }} />
             </Form.Item>
          </Col>
          <Col span={8}>
             <Form.Item label={<Text strong>Phường / Xã</Text>} name="ward" rules={[{ required: true, message: 'Vui lòng nhập phường/xã' }]}>
                <Input placeholder="Phường..." style={{ borderRadius: 10 }} />
             </Form.Item>
          </Col>
       </Row>
        <Divider orientation={"left" as any} orientationMargin={0}><Text type="secondary" style={{ fontSize: 12 }}>Tọa độ Bản đồ (GPS)</Text></Divider>
       <Row gutter={16}>
          <Col span={12}>
             <Form.Item label="Kinh độ (Longitude)" name="longitude">
                <Input placeholder="106.6..." style={{ borderRadius: 10 }} />
             </Form.Item>
          </Col>
          <Col span={12}>
             <Form.Item label="Vĩ độ (Latitude)" name="latitude">
                <Input placeholder="10.7..." style={{ borderRadius: 10 }} />
             </Form.Item>
          </Col>
       </Row>
    </div>
  );

  const AmenitiesTab = (
    <div style={{ padding: '20px 0' }}>
       <Title level={5}>Dịch vụ & Tiện ích tại sân</Title>
       <Paragraph type="secondary">Chọn các tiện ích mà cơ sở của bạn cung cấp để thu hút người chơi.</Paragraph>
       
       <Form.Item name="amenities">
          <Checkbox.Group style={{ width: '100%' }}>
             <Row gutter={[16, 16]}>
                <Col span={8}>
                   <Card size="small" style={{ borderRadius: 12 }}>
                      <Checkbox value="wifi"><WifiOutlined /> Wifi miễn phí</Checkbox>
                   </Card>
                </Col>
                <Col span={8}>
                   <Card size="small" style={{ borderRadius: 12 }}>
                      <Checkbox value="parking"><CarOutlined /> Bãi đỗ xe</Checkbox>
                   </Card>
                </Col>
                <Col span={8}>
                   <Card size="small" style={{ borderRadius: 12 }}>
                      <Checkbox value="canteen"><CoffeeOutlined /> Canteen / Nước</Checkbox>
                   </Card>
                </Col>
                <Col span={8}>
                   <Card size="small" style={{ borderRadius: 12 }}>
                      <Checkbox value="shower"><ThunderboltOutlined /> Nhà tắm / WC</Checkbox>
                   </Card>
                </Col>
                <Col span={8}>
                   <Card size="small" style={{ borderRadius: 12 }}>
                      <Checkbox value="rent"><ShopOutlined /> Thuê vợt / Giày</Checkbox>
                   </Card>
                </Col>
                <Col span={8}>
                   <Card size="small" style={{ borderRadius: 12 }}>
                      <Checkbox value="ac"><CustomerServiceOutlined /> Hệ thống quạt / AC</Checkbox>
                   </Card>
                </Col>
             </Row>
          </Checkbox.Group>
       </Form.Item>

       <Divider />
       <Form.Item label={<Text strong>Chính sách riêng của cơ sở</Text>} name="policy">
          <TextArea rows={3} placeholder="VD: Không mang giày đế đen vào thảm, không hút thuốc..." style={{ borderRadius: 10 }} />
       </Form.Item>
    </div>
  );

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
           <Title level={2} style={{ margin: 0 }}>Quản lý Cơ sở</Title>
           <Text type="secondary">Danh sách các cụm sân bạn đang sở hữu và quản lý trên nền tảng.</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} size="large" onClick={handleCreate} style={{ background: BRAND.primary, borderRadius: 10, height: 48, padding: '0 24px' }}>
          Đăng ký thêm sân mới
        </Button>
      </div>

      <Card bodyStyle={{ padding: 0 }} style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
        <Table
          columns={columns}
          dataSource={venues}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={
          <div style={{ paddingBottom: 12, borderBottom: '1px solid #f1f5f9' }}>
             <Space><GlobalOutlined style={{ color: BRAND.primary }} /> <Text strong>{editingVenue ? 'Cập nhật hồ sơ cơ sở' : 'Đăng ký cơ sở mới'}</Text></Space>
          </div>
        }
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingVenue(null);
          form.resetFields();
        }}
        footer={[
           <Button key="cancel" onClick={() => setIsModalOpen(false)}>Hủy bỏ</Button>,
           <Button key="submit" type="primary" onClick={() => form.submit()} style={{ background: BRAND.primary, padding: '0 32px' }}>
              {editingVenue ? 'Lưu thay đổi' : 'Gửi hồ sơ duyệt'}
           </Button>
        ]}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
           <Tabs
             defaultActiveKey="1"
             items={[
               { key: '1', label: <Space><ShopOutlined /> Thông tin chung</Space>, children: BasicInfoTab },
               { key: '2', label: <Space><EnvironmentOutlined /> Vị trí & Bản đồ</Space>, children: LocationTab },
               { key: '3', label: <Space><WifiOutlined /> Tiện ích & Dịch vụ</Space>, children: AmenitiesTab },
             ]}
           />
        </Form>
      </Modal>
    </div>
  );
}
