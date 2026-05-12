import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Button, Table, Tag, Space, Modal, Form, Input, Select, message, Typography, Popconfirm, Row, Col, InputNumber, Divider, Tooltip, Alert, Switch, Tabs } from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  DollarOutlined, 
  ClockCircleOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { mockVenues, mockCourts } from '../../data/mockVenues';
import type { Court } from '../../types/venue.types';
import { BRAND } from '../../theme/antdTheme';
import TextArea from 'antd/es/input/TextArea';
import BookingGrid from '../../components/ui/BookingGrid';
import { 
  EnvironmentOutlined,
  ToolOutlined 
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

export default function CourtManagementPage() {
  const { venueId } = useParams<{ venueId: string }>();
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [editingCourt, setEditingCourt] = useState<Court | null>(null);

  const venue = mockVenues.find(v => v.id === venueId);
  const [courts, setCourts] = useState(mockCourts[venueId!] || []);

  const handleCreate = () => {
    setEditingCourt(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (court: Court) => {
    setEditingCourt(court);
    form.setFieldsValue(court);
    setIsModalOpen(true);
  };

  const handleSubmit = (values: any) => {
    message.success(editingCourt ? 'Cập nhật sân thành công!' : 'Đã tạo sân mới thành công!');
    setIsModalOpen(false);
    setEditingCourt(null);
    form.resetFields();
  };

  const handleDelete = (courtId: string) => {
    setCourts(courts.filter(c => c.id !== courtId));
    message.success('Đã xóa sân thành công');
  };

  const columns = [
    {
      title: 'Tên sân lẻ',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => <Text strong style={{ fontSize: 15 }}>{name}</Text>
    },
    {
      title: 'Hạng sân',
      dataIndex: 'courtType',
      key: 'courtType',
      render: (type: string) => {
        let color = 'blue';
        if (type === 'PREMIUM') color = 'orange';
        if (type === 'VIP') color = 'purple';
        return <Tag color={color} style={{ borderRadius: 4, fontWeight: 600 }}>{type}</Tag>;
      },
    },
    {
      title: 'Giá mặc định',
      key: 'price',
      render: (_: any, record: Court) => (
        <Space direction="vertical" size={0}>
          <Text strong style={{ color: BRAND.primary }}>80.000đ/h</Text>
          <Text type="secondary" style={{ fontSize: 11 }}>Khung giờ thường</Text>
        </Space>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'ACTIVE' ? 'success' : 'warning'} icon={status === 'ACTIVE' ? <CheckCircleOutlined /> : <ThunderboltOutlined />}>
          {status === 'ACTIVE' ? 'Hoạt động' : 'Bảo trì'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'right' as const,
      render: (_: any, record: Court) => (
        <Space>
          <Tooltip title="Cấu hình giá & slot">
            <Button 
              icon={<DollarOutlined />} 
              onClick={() => setIsPricingModalOpen(true)}
              style={{ color: BRAND.primary, borderColor: BRAND.primary }}
            />
          </Tooltip>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm title="Xác nhận xóa sân?" onConfirm={() => handleDelete(record.id)}>
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
           <Space align="baseline">
              <Title level={2} style={{ margin: 0 }}>Quản lý Sân lẻ</Title>
              <Tag color="cyan" style={{ borderRadius: 10 }}>{venue?.name}</Tag>
           </Space>
           <Text type="secondary" style={{ display: 'block', marginTop: 4 }}>
              Cấu hình từng sân thi đấu, thiết lập giá theo khung giờ và quản lý tình trạng sân.
           </Text>
        </div>
        <Space>
           <Button icon={<PlusOutlined />} onClick={() => setIsBulkModalOpen(true)}>
             Tạo nhanh nhiều sân
           </Button>
           <Button type="primary" icon={<PlusOutlined />} size="large" onClick={handleCreate} style={{ background: BRAND.primary, borderRadius: 10 }}>
             Thêm sân con lẻ
           </Button>
        </Space>
      </div>

      <Row gutter={[20, 20]}>
        <Col span={24}>
           <Card bodyStyle={{ padding: '0 0 24px 0' }} style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
              <Tabs
                defaultActiveKey="1"
                items={[
                  {
                    key: '1',
                    label: <Space style={{ padding: '0 24px' }}><PlusOutlined /> Danh sách sân</Space>,
                    children: (
                      <Table
                        columns={columns}
                        dataSource={courts}
                        rowKey="id"
                        pagination={false}
                      />
                    )
                  },
                  {
                    key: '2',
                    label: <Space style={{ padding: '0 24px' }}><ClockCircleOutlined /> Lịch & Lock sân (Trực quan)</Space>,
                    children: (
                      <div style={{ padding: '0 24px' }}>
                        <Alert 
                          message="Chế độ Quản trị: Click vào slot để Khóa/Mở khóa sân nhanh." 
                          type="warning" 
                          showIcon 
                          style={{ marginBottom: 20, borderRadius: 10 }}
                        />
                        <BookingGrid 
                          isAdmin={true} 
                          courtNames={courts.map(c => c.name)} 
                        />
                      </div>
                    )
                  },
                  {
                    key: '3',
                    label: <Space style={{ padding: '0 24px' }}><EnvironmentOutlined /> Sơ đồ mặt bằng (2D Layout)</Space>,
                    children: (
                      <div style={{ padding: '24px' }}>
                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                            <div>
                               <Title level={4} style={{ margin: 0 }}>Sơ đồ vị trí sân</Title>
                               <Text type="secondary">Sắp xếp vị trí các sân theo thực tế mặt bằng của cơ sở.</Text>
                            </div>
                            <Button type="dashed" icon={<ToolOutlined />}>Chế độ chỉnh sửa sơ đồ</Button>
                         </div>
                         
                         <div style={{ 
                            background: '#f1f5f9', 
                            borderRadius: 20, 
                            padding: 40, 
                            minHeight: 400,
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                            gap: 24,
                            border: '2px dashed #cbd5e1'
                         }}>
                            {courts.map((court, idx) => (
                               <Card 
                                 key={court.id} 
                                 hoverable 
                                 style={{ 
                                    borderRadius: 12, 
                                    textAlign: 'center', 
                                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                                    cursor: 'move'
                                 }}
                                 bodyStyle={{ padding: '24px 16px' }}
                               >
                                  <div style={{ fontSize: 24, marginBottom: 8 }}>🏸</div>
                                  <Text strong style={{ fontSize: 16, display: 'block' }}>{court.name}</Text>
                                  <Tag color={court.courtType === 'VIP' ? 'purple' : 'blue'} style={{ marginTop: 8 }}>{court.courtType}</Tag>
                               </Card>
                            ))}
                            <div style={{ 
                               border: '2px dashed #cbd5e1', 
                               borderRadius: 12, 
                               display: 'flex', 
                               flexDirection: 'column',
                               alignItems: 'center', 
                               justifyContent: 'center',
                               background: 'rgba(255,255,255,0.5)',
                               cursor: 'pointer',
                               color: '#94a3b8'
                            }} onClick={() => setIsBulkModalOpen(true)}>
                               <PlusOutlined style={{ fontSize: 24, marginBottom: 8 }} />
                               <Text type="secondary">Thêm sân vào sơ đồ</Text>
                            </div>
                         </div>
                      </div>
                    )
                  }
                ]}
              />
           </Card>
        </Col>

        {/* Global Pricing Rules for the Venue */}
        <Col span={24}>
           <Card 
             title={<Space><DollarOutlined style={{ color: BRAND.primary }} /> Quy tắc giá chung cho cụm sân</Space>}
             extra={<Button type="link" icon={<PlusOutlined />}>Thêm khung giờ giá</Button>}
             style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}
           >
              <Row gutter={24}>
                 <Col xs={24} md={8}>
                    <div style={{ padding: '16px', background: 'rgba(0,166,81,0.05)', borderRadius: 12 }}>
                       <Text strong style={{ color: BRAND.primary, display: 'block' }}>Khung giờ sáng (05:00 - 16:00)</Text>
                       <Title level={3} style={{ margin: '8px 0', color: BRAND.primary }}>60.000đ<Text style={{ fontSize: 14, color: '#94a3b8' }}> / giờ</Text></Title>
                       <Text type="secondary" style={{ fontSize: 12 }}>Áp dụng từ Thứ 2 - Thứ 6</Text>
                    </div>
                 </Col>
                 <Col xs={24} md={8}>
                    <div style={{ padding: '16px', background: 'rgba(0,91,172,0.05)', borderRadius: 12 }}>
                       <Text strong style={{ color: BRAND.sky, display: 'block' }}>Giờ vàng (17:00 - 22:00)</Text>
                       <Title level={3} style={{ margin: '8px 0', color: BRAND.sky }}>120.000đ<Text style={{ fontSize: 14, color: '#94a3b8' }}> / giờ</Text></Title>
                       <Text type="secondary" style={{ fontSize: 12 }}>Nhu cầu cao, ánh sáng tối đa</Text>
                    </div>
                 </Col>
                 <Col xs={24} md={8}>
                    <div style={{ padding: '16px', background: 'rgba(114,46,209,0.05)', borderRadius: 12 }}>
                       <Text strong style={{ color: '#722ed1', display: 'block' }}>Cuối tuần (All day)</Text>
                       <Title level={3} style={{ margin: '8px 0', color: '#722ed1' }}>150.000đ<Text style={{ fontSize: 14, color: '#94a3b8' }}> / giờ</Text></Title>
                       <Text type="secondary" style={{ fontSize: 12 }}>Áp dụng Thứ 7 & Chủ Nhật</Text>
                    </div>
                 </Col>
              </Row>
           </Card>
        </Col>
      </Row>

      {/* Pricing & Slot Config Modal */}
      <Modal
        title={
          <div style={{ paddingBottom: 12, borderBottom: '1px solid #f1f5f9' }}>
            <Space><DollarOutlined /> Cấu hình Giá & Slot cho sân</Space>
          </div>
        }
        open={isPricingModalOpen}
        onCancel={() => setIsPricingModalOpen(false)}
        footer={[
          <Button key="back" onClick={() => setIsPricingModalOpen(false)}>Đóng</Button>,
          <Button key="submit" type="primary" style={{ background: BRAND.primary }} onClick={() => setIsPricingModalOpen(false)}>Lưu cấu hình</Button>
        ]}
        width={600}
      >
        <div style={{ marginTop: 20 }}>
           <Alert 
             message="Sử dụng cấu hình chung" 
             description="Mặc định sân này sẽ áp dụng bảng giá chung của cơ sở. Bạn có thể bật 'Tùy chỉnh riêng' để thiết lập giá đặc biệt."
             type="info" 
             showIcon
             style={{ marginBottom: 20, borderRadius: 10 }}
           />
           <Form layout="vertical">
              <Form.Item label="Sử dụng cấu hình riêng cho sân này?">
                 <Switch unCheckedChildren="OFF" checkedChildren="ON" />
              </Form.Item>
              <Divider />
              <Form.Item label={<Text strong>Thiết lập Slot (Khung giờ)</Text>}>
                 <Select mode="multiple" defaultValue={['5', '6', '7', '8']} style={{ width: '100%', borderRadius: 8 }}>
                    {Array.from({ length: 20 }, (_, i) => i + 5).map(h => (
                       <Option key={h} value={String(h)}>{h}:00 - {h+1}:00</Option>
                    ))}
                 </Select>
                 <Text type="secondary" style={{ fontSize: 12 }}>Chọn các khung giờ cho phép khách đặt sân lẻ.</Text>
              </Form.Item>
           </Form>
        </div>
      </Modal>

      {/* Bulk Create Modal */}
      <Modal
        title={
          <div style={{ paddingBottom: 12, borderBottom: '1px solid #f1f5f9' }}>
            <Space><PlusOutlined /> Thiết lập nhanh số lượng sân</Space>
          </div>
        }
        open={isBulkModalOpen}
        onCancel={() => setIsBulkModalOpen(false)}
        onOk={() => {
          message.success('Đã tạo nhanh danh sách sân thành công!');
          setIsBulkModalOpen(false);
        }}
        okText="Tạo danh sách sân"
        okButtonProps={{ style: { background: BRAND.primary } }}
      >
         <div style={{ marginTop: 20 }}>
            <Alert 
              message="Lưu ý" 
              description="Hệ thống sẽ tự động tạo các sân với tên theo thứ tự (Sân 1, Sân 2...) dựa trên số lượng bạn nhập."
              type="info" 
              showIcon
              style={{ marginBottom: 20, borderRadius: 10 }}
            />
            <Form layout="vertical">
               <Form.Item label={<Text strong>Số lượng sân muốn tạo</Text>}>
                  <InputNumber min={1} max={50} defaultValue={5} style={{ width: '100%', borderRadius: 8 }} placeholder="Nhập số lượng (VD: 10)" />
               </Form.Item>
               <Form.Item label={<Text strong>Loại sân mặc định</Text>}>
                  <Select defaultValue="STANDARD" style={{ borderRadius: 8 }}>
                    <Option value="STANDARD">Standard (Thường)</Option>
                    <Option value="PREMIUM">Premium (Nâng cao)</Option>
                    <Option value="VIP">VIP</Option>
                  </Select>
               </Form.Item>
               <div style={{ padding: '12px', background: '#f8fafc', borderRadius: 10 }}>
                  <Text type="secondary" style={{ fontSize: 13 }}>
                     Tên sân sẽ được đặt tự động: <Text strong>Sân 1, Sân 2, Sân 3...</Text>
                  </Text>
               </div>
            </Form>
         </div>
      </Modal>

      {/* Create/Edit Court Modal */}
      <Modal
        title={editingCourt ? 'Chỉnh sửa thông tin sân' : 'Thêm sân con mới'}
        open={isModalOpen}
        onCancel={() => { setIsModalOpen(false); setEditingCourt(null); form.resetFields(); }}
        onOk={() => form.submit()}
        okButtonProps={{ style: { background: BRAND.primary } }}
        width={500}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} style={{ marginTop: 20 }}>
          <Form.Item label="Tên sân lẻ" name="name" rules={[{ required: true }]}>
            <Input placeholder="VD: Sân 1, Sân VIP 1..." style={{ borderRadius: 8 }} />
          </Form.Item>
          <Form.Item label="Hạng sân" name="courtType" initialValue="STANDARD">
            <Select style={{ borderRadius: 8 }}>
              <Option value="STANDARD">Standard (Thường)</Option>
              <Option value="PREMIUM">Premium (Nâng cao)</Option>
              <Option value="VIP">VIP (Chất lượng cao nhất)</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Mô tả đặc điểm" name="description">
            <TextArea rows={3} placeholder="Mô tả thảm, ánh sáng, quạt..." style={{ borderRadius: 10 }} />
          </Form.Item>
          {editingCourt && (
            <Form.Item label="Trạng thái hoạt động" name="status">
              <Select style={{ borderRadius: 8 }}>
                <Option value="ACTIVE">Sẵn sàng đón khách</Option>
                <Option value="MAINTENANCE">Đang bảo trì / Sửa chữa</Option>
              </Select>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
}
