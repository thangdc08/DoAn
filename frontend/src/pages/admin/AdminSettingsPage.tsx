import { useEffect, useState } from 'react';
import {
  Card, Typography, Form, Input, Switch, Button, Space, message,
  Spin, Divider, Select, InputNumber, Alert, Row, Col,
} from 'antd';
import {
  SettingOutlined, LockOutlined, BellOutlined, CloudServerOutlined,
  SaveOutlined, CalendarOutlined, ShopOutlined, UserOutlined, TeamOutlined,
} from '@ant-design/icons';
import { BRAND } from '../../theme/antdTheme';
import { adminApi } from '../../services/adminApi';

const { Title, Text } = Typography;

const NAV = [
  { key: 'general',    icon: <SettingOutlined />,      label: 'Chung' },
  { key: 'security',   icon: <LockOutlined />,          label: 'Bảo mật' },
  { key: 'notify',     icon: <BellOutlined />,          label: 'Thông báo' },
  { key: 'p_booking',  icon: <CalendarOutlined />,      label: 'Chính sách Booking' },
  { key: 'p_venue',    icon: <ShopOutlined />,          label: 'Phê duyệt Sân' },
  { key: 'p_match',    icon: <TeamOutlined />,          label: 'Chính sách Kèo' },
  { key: 'p_user',     icon: <UserOutlined />,          label: 'Chính sách Người dùng' },
  { key: 'infra',      icon: <CloudServerOutlined />,   label: 'Hạ tầng' },
];

function SectionTitle({ title, desc }: { title: string; desc?: string }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <Text strong style={{ fontSize: 15 }}>{title}</Text>
      {desc && <div><Text type="secondary" style={{ fontSize: 12 }}>{desc}</Text></div>}
      <Divider style={{ margin: '12px 0 20px' }} />
    </div>
  );
}

function ToggleRow({ label, desc, name }: { label: string; desc: string; name: string }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '12px 14px', background: '#f8fafc', borderRadius: 8,
      border: '1px solid #e2e8f0', marginBottom: 10,
    }}>
      <div>
        <Text strong style={{ display: 'block', fontSize: 13 }}>{label}</Text>
        <Text type="secondary" style={{ fontSize: 11 }}>{desc}</Text>
      </div>
      <Form.Item name={name} valuePropName="checked" style={{ margin: 0 }}>
        <Switch />
      </Form.Item>
    </div>
  );
}

/** Convert flat string map to typed form values */
function mapToForm(cfg: Record<string, string>) {
  return {
    site_name: cfg.site_name ?? 'BadmintonHub',
    site_url: cfg.site_url ?? '',
    support_email: cfg.support_email ?? '',
    support_phone: cfg.support_phone ?? '',
    timezone: cfg.timezone ?? 'Asia/Ho_Chi_Minh',
    language: cfg.language ?? 'vi',
    maintenance_mode: cfg.maintenance_mode === 'true',
    maintenance_msg: cfg.maintenance_msg ?? '',
    jwt_expire_hours: Number(cfg.jwt_expire_hours ?? 24),
    max_login_attempts: Number(cfg.max_login_attempts ?? 5),
    lockout_minutes: Number(cfg.lockout_minutes ?? 15),
    require_email_verify: cfg.require_email_verify === 'true',
    enable_2fa: cfg.enable_2fa === 'true',
    email_enabled: cfg.email_enabled !== 'false',
    smtp_host: cfg.smtp_host ?? '',
    smtp_port: Number(cfg.smtp_port ?? 587),
    smtp_user: cfg.smtp_user ?? '',
    smtp_password: cfg.smtp_password ?? '',
    notify_new_booking: cfg.notify_new_booking !== 'false',
    notify_payout: cfg.notify_payout !== 'false',
    notify_report: cfg.notify_report !== 'false',
    platform_commission_pct: Number(cfg.platform_commission_pct ?? 10),
    booking_advance_days: Number(cfg.booking_advance_days ?? 30),
    max_bookings_per_day: Number(cfg.max_bookings_per_day ?? 5),
    cancellation_window_hours: Number(cfg.cancellation_window_hours ?? 2),
    auto_expire_minutes: Number(cfg.auto_expire_minutes ?? 15),
    min_court_price: Number(cfg.min_court_price ?? 50000),
    max_court_price: Number(cfg.max_court_price ?? 500000),
    max_courts_per_venue: Number(cfg.max_courts_per_venue ?? 20),
    venue_require_approval: cfg.venue_require_approval !== 'false',
    venue_auto_approve_days: Number(cfg.venue_auto_approve_days ?? 0),
    max_active_bookings_per_user: Number(cfg.max_active_bookings_per_user ?? 10),
    no_show_penalty_enabled: cfg.no_show_penalty_enabled === 'true',
    suspend_after_no_shows: Number(cfg.suspend_after_no_shows ?? 3),
    review_required_after_booking: cfg.review_required_after_booking === 'true',
    match_cancel_before_hours: Number(cfg.match_cancel_before_hours ?? 2),
    max_active_matches_per_user: Number(cfg.max_active_matches_per_user ?? 5),
    match_platform_fee: Number(cfg.match_platform_fee ?? 0),
    enable_match_auto_close: cfg.enable_match_auto_close !== 'false',
  };
}

/** Convert form values back to flat string map */
function formToMap(values: Record<string, any>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(values)) {
    out[k] = String(v);
  }
  return out;
}

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const cfg = await adminApi.getSettings();
        form.setFieldsValue(mapToForm(cfg));
      } catch {
        message.warning('Không tải được cấu hình — dùng giá trị mặc định');
        form.setFieldsValue(mapToForm({}));
      } finally {
        setLoading(false);
      }
    })();
  }, [form]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const values = await form.validateFields();
      await adminApi.updateSettings(formToMap(values));
      message.success('Đã lưu cấu hình hệ thống thành công!');
    } catch {
      message.error('Lưu cấu hình thất bại. Vui lòng kiểm tra lại.');
    } finally {
      setSaving(false);
    }
  };

  const tabs: Record<string, React.ReactNode> = {

    general: (
      <>
        <SectionTitle title="Thông tin nền tảng" desc="Tên, URL và mô tả công khai của hệ thống" />
        <Row gutter={20}>
          <Col xs={24} md={12}>
            <Form.Item label="Tên nền tảng" name="site_name" rules={[{ required: true }]}>
              <Input size="large" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="URL chính thức" name="site_url">
              <Input size="large" placeholder="https://..." />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Ngôn ngữ" name="language">
              <Select size="large" options={[{ value: 'vi', label: 'Tiếng Việt' }, { value: 'en', label: 'English' }]} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Múi giờ" name="timezone">
              <Select size="large" options={[{ value: 'Asia/Ho_Chi_Minh', label: 'GMT+7 (Hà Nội)' }, { value: 'UTC', label: 'UTC' }]} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Email hỗ trợ" name="support_email" rules={[{ type: 'email' }]}>
              <Input size="large" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Số điện thoại hỗ trợ" name="support_phone">
              <Input size="large" />
            </Form.Item>
          </Col>
        </Row>
        <SectionTitle title="Chế độ bảo trì" />
        <Form.Item label="Kích hoạt Maintenance Mode" name="maintenance_mode" valuePropName="checked">
          <Switch checkedChildren="BẬT" unCheckedChildren="TẮT" />
        </Form.Item>
        <Form.Item label="Thông báo hiển thị khi bảo trì" name="maintenance_msg">
          <Input.TextArea rows={2} />
        </Form.Item>
        <Alert type="warning" showIcon message="Khi bật, tất cả người dùng (trừ Admin) không thể truy cập hệ thống." />
      </>
    ),

    security: (
      <>
        <SectionTitle title="JWT & Phiên đăng nhập" />
        <Row gutter={20}>
          <Col xs={24} md={8}>
            <Form.Item label="Token hết hạn sau (giờ)" name="jwt_expire_hours">
              <InputNumber min={1} max={720} size="large" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item label="Số lần đăng nhập sai tối đa" name="max_login_attempts">
              <InputNumber min={1} max={20} size="large" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item label="Khóa tài khoản (phút)" name="lockout_minutes">
              <InputNumber min={1} max={1440} size="large" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <SectionTitle title="Xác thực người dùng" />
        <ToggleRow name="require_email_verify" label="Bắt buộc xác thực Email" desc="Người dùng phải xác nhận email trước khi sử dụng" />
        <ToggleRow name="enable_2fa" label="Xác thực 2 yếu tố (2FA)" desc="Cho phép người dùng bật xác thực 2 bước qua ứng dụng" />
      </>
    ),

    notify: (
      <>
        <SectionTitle title="Cấu hình SMTP Email" />
        <Form.Item label="Kích hoạt gửi Email" name="email_enabled" valuePropName="checked">
          <Switch checkedChildren="BẬT" unCheckedChildren="TẮT" />
        </Form.Item>
        <Row gutter={20}>
          <Col xs={24} md={14}>
            <Form.Item label="SMTP Host" name="smtp_host">
              <Input size="large" placeholder="smtp.gmail.com" />
            </Form.Item>
          </Col>
          <Col xs={24} md={10}>
            <Form.Item label="SMTP Port" name="smtp_port">
              <InputNumber min={1} max={65535} size="large" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Tài khoản SMTP" name="smtp_user">
              <Input size="large" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Mật khẩu SMTP" name="smtp_password">
              <Input.Password size="large" />
            </Form.Item>
          </Col>
        </Row>
        <SectionTitle title="Sự kiện gửi thông báo" />
        <ToggleRow name="notify_new_booking" label="Booking mới được tạo" desc="Gửi email xác nhận cho người dùng và chủ sân" />
        <ToggleRow name="notify_payout" label="Yêu cầu rút tiền" desc="Thông báo admin khi có yêu cầu rút tiền mới" />
        <ToggleRow name="notify_report" label="Báo cáo vi phạm mới" desc="Cảnh báo admin khi có báo cáo khẩn cấp" />
      </>
    ),

    p_booking: (
      <>
        <SectionTitle title="Chính sách Booking" desc="Các quy tắc áp dụng cho toàn bộ quy trình đặt sân" />
        <Alert
          type="info" showIcon style={{ marginBottom: 20, borderRadius: 8 }}
          message="Các giá trị này được booking-service đọc trực tiếp và áp dụng ngay cho mọi booking mới."
        />
        <Row gutter={20}>
          <Col xs={24} md={8}>
            <Form.Item label="Hoa hồng nền tảng (%)" name="platform_commission_pct" tooltip="Tỉ lệ % trên mỗi giao dịch nền tảng giữ lại">
              <InputNumber min={0} max={50} size="large" style={{ width: '100%' }} addonAfter="%" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item label="Đặt sân trước tối đa (ngày)" name="booking_advance_days">
              <InputNumber min={1} max={365} size="large" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item label="Booking tối đa / ngày / người" name="max_bookings_per_day">
              <InputNumber min={1} max={50} size="large" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item label="Tự động hủy booking chưa thanh toán" name="auto_expire_minutes" tooltip="Booking chưa thanh toán sẽ bị hủy sau N phút">
              <InputNumber min={5} max={60} size="large" style={{ width: '100%' }} addonAfter="phút" />
            </Form.Item>
          </Col>
        </Row>
      </>
    ),

    p_venue: (
      <>
        <SectionTitle title="Phê duyệt Cơ sở" desc="Quy định áp dụng khi chủ sân đăng ký cơ sở mới" />
        <ToggleRow name="venue_require_approval" label="Cơ sở mới phải chờ Admin phê duyệt" desc="Nếu tắt, cơ sở được tự động phê duyệt ngay khi đăng ký" />
        <Form.Item label="Tự động phê duyệt sau N ngày (0 = tắt)" name="venue_auto_approve_days" style={{ marginTop: 12 }}>
          <InputNumber min={0} max={30} size="large" style={{ width: 200 }} addonAfter="ngày" />
        </Form.Item>
      </>
    ),

    p_match: (
      <>
        <SectionTitle title="Chính sách Kèo" desc="Các quy định và giới hạn cho hệ thống ghép kèo cộng đồng" />
        <Alert
          type="info" showIcon style={{ marginBottom: 20, borderRadius: 8 }}
          message="Các cấu hình này được community-service đọc trực tiếp để kiểm tra khi người dùng tạo hoặc hủy kèo đấu."
        />
        <Row gutter={20}>
          <Col xs={24} md={8}>
            <Form.Item label="Thời gian hủy kèo tối thiểu" name="match_cancel_before_hours" tooltip="Người dùng chỉ có thể hủy kèo nếu còn ít nhất N giờ trước giờ bắt đầu">
              <InputNumber min={0} max={72} size="large" style={{ width: '100%' }} addonAfter="giờ" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item label="Số kèo hoạt động tối đa / người dùng" name="max_active_matches_per_user" tooltip="Số lượng kèo (OPEN/PENDING) tối đa một người dùng có thể tạo đồng thời">
              <InputNumber min={1} max={50} size="large" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item label="Phí dịch vụ tạo kèo" name="match_platform_fee" tooltip="Phí dịch vụ thu trên mỗi kèo đấu được tạo (nếu có)">
              <InputNumber min={0} formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} size="large" style={{ width: '100%' }} addonAfter="VND" />
            </Form.Item>
          </Col>
        </Row>
        <div style={{ marginTop: 20 }}><SectionTitle title="Tự động đóng kèo" /></div>
        <ToggleRow name="enable_match_auto_close" label="Tự động đóng kèo khi đủ người tham gia" desc="Khi số người tham gia đạt giới hạn tối đa, trạng thái kèo tự chuyển sang CLOSED" />
      </>
    ),

    p_user: (
      <>
        <SectionTitle title="Chính sách Người dùng" desc="Giới hạn và quy tắc áp dụng cho tài khoản người dùng" />
        <Row gutter={20}>
          <Col xs={24} md={8}>
            <Form.Item label="Booking đang mở tối đa / người dùng" name="max_active_bookings_per_user">
              <InputNumber min={1} max={100} size="large" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item label="Số lần vắng mặt trước khi tạm đình chỉ" name="suspend_after_no_shows">
              <InputNumber min={1} max={20} size="large" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <SectionTitle title="Hành vi người dùng" />
        <ToggleRow name="no_show_penalty_enabled" label="Áp dụng phạt khi vắng mặt không báo" desc="Ghi nhận no-show và tính vào lịch sử vi phạm của người dùng" />
        <ToggleRow name="review_required_after_booking" label="Yêu cầu đánh giá sau mỗi booking hoàn thành" desc="Hiển thị nhắc nhở đánh giá sau khi người dùng sử dụng sân" />
      </>
    ),

    infra: (
      <>
        <SectionTitle title="Trạng thái Microservices" />
        {[
          { name: 'Identity Service',       port: '8081' },
          { name: 'Booking Service',        port: '8082' },
          { name: 'Venue Service',          port: '8083' },
          { name: 'Payment Service',        port: '8084' },
          { name: 'Notification Service',   port: '8085' },
          { name: 'Community Service',      port: '8086' },
          { name: 'Recommendation Service', port: '8087' },
          { name: 'API Gateway',            port: '8080' },
          { name: 'Service Registry',       port: '8761' },
        ].map(s => (
          <div key={s.name} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '10px 14px', background: '#f8fafc', borderRadius: 8,
            border: '1px solid #e2e8f0', marginBottom: 8,
          }}>
            <Space><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} /><Text strong style={{ fontSize: 13 }}>{s.name}</Text><Text type="secondary" style={{ fontSize: 11 }}>:{s.port}</Text></Space>
            <span style={{ fontSize: 11, color: '#10b981', fontWeight: 600 }}>● Online</span>
          </div>
        ))}
        <Alert type="success" showIcon message="Tất cả microservices đang hoạt động bình thường" style={{ marginTop: 12, borderRadius: 8 }} />
      </>
    ),
  };

  return (
    <Spin spinning={loading}>
      <div style={{ padding: 28, background: '#f8fafc', minHeight: '100vh' }}>
        <div style={{ marginBottom: 24 }}>
          <Title level={2} style={{ margin: 0, fontWeight: 800 }}>Cấu hình Hệ thống</Title>
          <Text type="secondary">Cấu hình được lưu vào DB và áp dụng thật cho toàn hệ thống</Text>
        </div>

        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
          {/* Sidebar */}
          <div style={{ width: 210, flexShrink: 0, background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            {NAV.map(item => (
              <div key={item.key} onClick={() => setActiveTab(item.key)} style={{
                padding: '13px 18px', cursor: 'pointer', fontSize: 13,
                display: 'flex', alignItems: 'center', gap: 10,
                background: activeTab === item.key ? `${BRAND.primary}0d` : 'transparent',
                color: activeTab === item.key ? BRAND.primary : '#475569',
                borderLeft: `3px solid ${activeTab === item.key ? BRAND.primary : 'transparent'}`,
                fontWeight: activeTab === item.key ? 600 : 400, transition: 'all 0.15s',
              }}>
                {item.icon}{item.label}
              </div>
            ))}
          </div>

          {/* Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <Card bordered={false} style={{ borderRadius: 14, border: '1px solid #e2e8f0' }} bodyStyle={{ padding: '28px 32px' }}>
              <Form form={form} layout="vertical">
                {tabs[activeTab]}
              </Form>
            </Card>
            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="primary" size="large" icon={<SaveOutlined />} loading={saving} onClick={handleSave}
                style={{ background: BRAND.primary, borderRadius: 10, height: 44, paddingInline: 28, fontWeight: 600 }}>
                Lưu cài đặt
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Spin>
  );
}
