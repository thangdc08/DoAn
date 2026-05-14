import { Card, Form, Input, Button, Switch, Divider, Typography, Space, Alert, List, Tag } from 'antd';
import { 
  ShieldCheck,
  Smartphone
} from 'lucide-react';
import { 
  LockOutlined, 
  BellOutlined, 
  SafetyCertificateOutlined,
  GlobalOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { BRAND } from '../../theme/antdTheme';

const { Title, Text } = Typography;

export default function UserSettingsPage() {
  const [form] = Form.useForm();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div style={{ marginBottom: 24 }}>
        <Title level={3}>Cài đặt tài khoản</Title>
        <Text type="secondary">Quản lý bảo mật, thông báo và các thiết lập cá nhân của bạn.</Text>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Security & Password */}
        <div className="lg:col-span-2 space-y-6">
          <Card title={<Space><LockOutlined size={18} className="text-brand-green" /> Đổi mật khẩu</Space>} className="shadow-app-sm border-none rounded-2xl">
            <Form form={form} layout="vertical">
              <Form.Item label="Mật khẩu hiện tại" name="currentPassword">
                <Input.Password placeholder="••••••••" />
              </Form.Item>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item label="Mật khẩu mới" name="newPassword">
                  <Input.Password placeholder="••••••••" />
                </Form.Item>
                <Form.Item label="Xác nhận mật khẩu mới" name="confirmPassword">
                  <Input.Password placeholder="••••••••" />
                </Form.Item>
              </div>
              <Button type="primary" style={{ borderRadius: 8 }}>Cập nhật mật khẩu</Button>
            </Form>
          </Card>

          <Card title={<Space><BellOutlined size={18} className="text-brand-green" /> Cấu hình thông báo</Space>} className="shadow-app-sm border-none rounded-2xl">
            <List
              itemLayout="horizontal"
              dataSource={[
                { title: 'Email thông báo', desc: 'Nhận email về các cập nhật quan trọng và khuyến mãi.', active: true },
                { title: 'Thông báo đặt sân', desc: 'Nhận thông báo khi sân được xác nhận hoặc hủy.', active: true },
                { title: 'Thông báo kèo đấu', desc: 'Nhận thông báo khi có người tham gia kèo của bạn.', active: false },
                { title: 'Tin nhắn hệ thống', desc: 'Các thông báo bảo mật và bảo trì hệ thống.', active: true },
              ]}
              renderItem={(item) => (
                <List.Item
                  actions={[<Switch defaultChecked={item.active} key="switch" />]}
                  className="px-0"
                >
                  <List.Item.Meta
                    title={<Text strong>{item.title}</Text>}
                    description={item.desc}
                  />
                </List.Item>
              )}
            />
          </Card>
        </div>

        {/* Right: Security Status & Misc */}
        <div className="space-y-6">
          <Card className="shadow-app-sm border-none rounded-2xl bg-gray-50/50">
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck size={32} className="text-green-600" />
              </div>
              <Title level={5}>Bảo mật tài khoản</Title>
              <Text type="success" strong>Mức độ: Cao</Text>
            </div>
            <Divider />
            <Space direction="vertical" className="w-full">
              <div className="flex justify-between items-center">
                <Space><Smartphone size={16} /> <Text className="text-sm">Xác thực 2 lớp</Text></Space>
                <Tag color="success">Đã bật</Tag>
              </div>
              <div className="flex justify-between items-center">
                <Space><SafetyCertificateOutlined style={{ fontSize: 16 }} /> <Text className="text-sm">Thiết bị tin cậy</Text></Space>
                <Text type="secondary" className="text-sm">2 thiết bị</Text>
              </div>
            </Space>
            <Button block className="mt-6" type="dashed">Quản lý bảo mật</Button>
          </Card>

          <Card title="Thiết lập khác" className="shadow-app-sm border-none rounded-2xl">
            <Space direction="vertical" className="w-full" size={16}>
              <div className="flex justify-between items-center">
                <Space><GlobalOutlined style={{ fontSize: 16 }} /> Ngôn ngữ</Space>
                <Text strong>Tiếng Việt</Text>
              </div>
              <Divider className="my-0" />
              <div className="py-2">
                <Text type="danger" strong className="block mb-2">Vùng nguy hiểm</Text>
                <Text type="secondary" className="text-sm block mb-4">
                  Xóa tài khoản sẽ xóa tất cả dữ liệu vĩnh viễn và không thể khôi phục.
                </Text>
                <Button danger icon={<DeleteOutlined size={14} className="mr-1" />} block>Xóa tài khoản</Button>
              </div>
            </Space>
          </Card>
        </div>
      </div>
    </div>
  );
}
