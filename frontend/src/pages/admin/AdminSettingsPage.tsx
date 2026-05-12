import { Card, Typography, Tabs, Form, Input, Switch, Button, Space, Divider, message, List, Tag, Row, Col, Progress, Alert } from 'antd';
import { 
  SettingOutlined, 
  LockOutlined, 
  BellOutlined, 
  CloudServerOutlined, 
  SaveOutlined,
  KeyOutlined,
  MailOutlined,
  HistoryOutlined,
  DatabaseOutlined,
  SyncOutlined
} from '@ant-design/icons';
import { BRAND } from '../../theme/antdTheme';

const { Title, Text, Paragraph } = Typography;

export default function AdminSettingsPage() {
  const [form] = Form.useForm();

  const handleSave = () => {
    message.success('Đã lưu cấu hình hệ thống thành công!');
  };

  const GeneralSettings = (
    <div style={{ maxWidth: 800 }}>
       <Form layout="vertical" initialValues={{ siteName: 'BadmintonHub', maintenance: false }}>
          <Form.Item label={<Text strong>Tên nền tảng</Text>} name="siteName">
            <Input placeholder="Nhập tên website" size="large" style={{ borderRadius: 10 }} />
          </Form.Item>
          <Form.Item label={<Text strong>Mô tả hệ thống</Text>} name="description">
            <Input.TextArea rows={3} placeholder="Mô tả ngắn gọn về nền tảng" style={{ borderRadius: 10 }} />
          </Form.Item>
          <Divider />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, padding: '16px', background: '#f8fafc', borderRadius: 12 }}>
             <div>
                <Title level={5} style={{ margin: 0 }}>Chế độ bảo trì (Maintenance)</Title>
                <Text type="secondary">Khi bật, người dùng sẽ không thể đặt sân. Chỉ Admin mới có thể truy cập.</Text>
             </div>
             <Form.Item name="maintenance" valuePropName="checked" noStyle>
               <Switch checkedChildren="ON" unCheckedChildren="OFF" />
             </Form.Item>
          </div>
          <Button type="primary" size="large" icon={<SaveOutlined />} onClick={handleSave} style={{ background: BRAND.primary, borderRadius: 10, height: 48, padding: '0 32px' }}>Lưu cài đặt</Button>
       </Form>
    </div>
  );

  const SecuritySettings = (
    <div style={{ maxWidth: 800 }}>
       <Title level={4}>Cấu hình Bảo mật & API</Title>
       <List
         itemLayout="horizontal"
         dataSource={[
           { title: 'Xác thực 2 lớp (2FA)', desc: 'Bắt buộc đối với tài khoản Admin và Chủ sân.', status: true },
           { title: 'Giới hạn đăng nhập', desc: 'Tự động khóa tài khoản sau 5 lần nhập sai mật khẩu.', status: true },
           { title: 'Đăng nhập mạng xã hội', desc: 'Cho phép đăng nhập qua Google và Facebook.', status: false },
         ]}
         renderItem={(item) => (
           <List.Item actions={[<Switch checked={item.status} />]}>
             <List.Item.Meta
               title={item.title}
               description={item.desc}
             />
           </List.Item>
         )}
       />
       <Divider />
       <Title level={4}>Quản lý API Keys</Title>
       <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card size="small" style={{ borderRadius: 12, border: '1px solid #f1f5f9' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Space><KeyOutlined style={{ color: BRAND.primary }} /> <Text strong>Google Maps Platform</Text></Space>
                  <Tag color="success">Đang hoạt động</Tag>
               </div>
               <Input.Password value="AIzaSyA1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q" readOnly style={{ marginTop: 12, borderRadius: 8 }} />
            </Card>
          </Col>
          <Col span={24}>
            <Card size="small" style={{ borderRadius: 12, border: '1px solid #f1f5f9' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Space><KeyOutlined style={{ color: BRAND.primary }} /> <Text strong>VNPay / MoMo Gateway</Text></Space>
                  <Tag color="warning">Môi trường Test</Tag>
               </div>
               <Input.Password value="MOMO_SECRET_KEY_123456789" readOnly style={{ marginTop: 12, borderRadius: 8 }} />
            </Card>
          </Col>
       </Row>
    </div>
  );

  const NotificationSettings = (
    <div style={{ maxWidth: 800 }}>
       <Title level={4}>Cấu hình Thông báo (Email & Push)</Title>
       <Alert 
          message="Lưu ý cấu hình" 
          description="Việc cấu hình sai SMTP có thể dẫn đến việc người dùng không nhận được mã OTP hoặc thông báo đặt sân thành công." 
          type="info" 
          showIcon 
          style={{ marginBottom: 24, borderRadius: 10 }}
       />
       
       <Form layout="vertical">
          <Row gutter={16}>
             <Col span={16}>
                <Form.Item label="SMTP Server" initialValue="smtp.gmail.com">
                   <Input prefix={<MailOutlined />} style={{ borderRadius: 8 }} />
                </Form.Item>
             </Col>
             <Col span={8}>
                <Form.Item label="Port" initialValue="587">
                   <Input style={{ borderRadius: 8 }} />
                </Form.Item>
             </Col>
          </Row>
          <Form.Item label="Email gửi tin" initialValue="no-reply@badmintonhub.com">
             <Input style={{ borderRadius: 8 }} />
          </Form.Item>
          <Form.Item label="Mật khẩu ứng dụng (App Password)">
             <Input.Password placeholder="••••••••••••••••" style={{ borderRadius: 8 }} />
          </Form.Item>
          
          <Divider />
          <Title level={5}>Firebase Cloud Messaging (FCM)</Title>
          <Form.Item label="Server Key (Legacy) / Service Account JSON">
             <Input.TextArea rows={4} placeholder="Nhập cấu hình Firebase..." style={{ borderRadius: 10 }} />
          </Form.Item>
          
          <Button type="primary" ghost icon={<SyncOutlined />}>Gửi Email thử nghiệm</Button>
       </Form>
    </div>
  );

  const SystemHealth = (
    <div>
       <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
             <Card title="Sức khỏe Máy chủ" style={{ borderRadius: 16 }}>
                <Space direction="vertical" style={{ width: '100%' }} size={24}>
                   <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                         <Text strong>CPU Usage</Text>
                         <Text>24%</Text>
                      </div>
                      <Progress percent={24} strokeColor={BRAND.primary} status="active" />
                   </div>
                   <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                         <Text strong>RAM Usage (16GB)</Text>
                         <Text>4.2GB / 16GB</Text>
                      </div>
                      <Progress percent={28} strokeColor={BRAND.sky} status="active" />
                   </div>
                   <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                         <Text strong>Disk Storage (SSD)</Text>
                         <Text>120GB / 500GB</Text>
                      </div>
                      <Progress percent={35} strokeColor="#fa8c16" />
                   </div>
                </Space>
             </Card>
          </Col>
          
          <Col xs={24} md={12}>
             <Card title="Sao lưu Dữ liệu (Backup)" style={{ borderRadius: 16 }}>
                <div style={{ padding: '12px', background: 'rgba(0,166,81,0.05)', borderRadius: 12, marginBottom: 16 }}>
                   <Space><DatabaseOutlined style={{ color: BRAND.primary }} /> <Text strong>Tình trạng: Khỏe mạnh</Text></Space>
                   <div style={{ fontSize: 12, marginTop: 4, color: '#64748b' }}>Lần sao lưu cuối: Hôm nay, 02:00 AM (340MB)</div>
                </div>
                
                <Title level={5}>Lịch trình tự động</Title>
                <List
                  size="small"
                  dataSource={[
                    { time: 'Hàng ngày', status: 'ON' },
                    { time: 'Hàng tuần (Full)', status: 'ON' },
                    { time: 'Lưu trữ Cloud (S3)', status: 'OFF' },
                  ]}
                  renderItem={item => (
                    <List.Item extra={<Switch size="small" checked={item.status === 'ON'} />}>
                       {item.time}
                    </List.Item>
                  )}
                />
                <Button block icon={<HistoryOutlined />} style={{ marginTop: 16, borderRadius: 8 }}>Xem lịch sử sao lưu</Button>
             </Card>
          </Col>
       </Row>
    </div>
  );

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>Cấu hình Hệ thống</Title>
        <Space>
           <Tag color="blue" icon={<SyncOutlined spin />}>V.1.2.0 (Stable)</Tag>
           <Text type="secondary">Cập nhật lần cuối: 2 giờ trước</Text>
        </Space>
      </div>

      <Card bodyStyle={{ padding: 0 }} style={{ borderRadius: 16, overflow: 'hidden', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
        <Tabs
          tabPosition="left"
          className="admin-settings-tabs"
          items={[
            {
              key: '1',
              label: <Space><SettingOutlined /> Chung</Space>,
              children: <div style={{ padding: '32px 40px' }}>{GeneralSettings}</div>,
            },
            {
              key: '2',
              label: <Space><LockOutlined /> Bảo mật & API</Space>,
              children: <div style={{ padding: '32px 40px' }}>{SecuritySettings}</div>,
            },
            {
              key: '3',
              label: <Space><BellOutlined /> Thông báo</Space>,
              children: <div style={{ padding: '32px 40px' }}>{NotificationSettings}</div>,
            },
            {
              key: '4',
              label: <Space><CloudServerOutlined /> Hạ tầng & Hệ thống</Space>,
              children: <div style={{ padding: '32px 40px' }}>{SystemHealth}</div>,
            },
          ]}
          style={{ minHeight: 650 }}
        />
      </Card>
    </div>
  );
}
