import React, { useState } from 'react';
import { Button, Checkbox, Divider, Form, Input, Typography } from 'antd';
import {
  GoogleOutlined,
  LockOutlined,
  MailOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/layout/AuthLayout';
import { useNotify } from '../../hooks/useNotify';
import { BRAND } from '../../theme/antdTheme';

const { Title, Text } = Typography;

type LoginFormValues = {
  email: string;
  password: string;
  remember: boolean;
};

const HERO_FEATURES = [
  { icon: '🔒', label: 'Bảo mật JWT' },
  { icon: '📅', label: 'Đặt sân online' },
  { icon: '🏸', label: 'Tìm kèo giao lưu' },
];

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { success, error, loading } = useNotify();
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm<LoginFormValues>();

  const handleFinish = async (_values: LoginFormValues) => {
    setSubmitting(true);
    const hide = loading('Đang đăng nhập...');

    try {
      // TODO: Kết nối identity-service API
      await new Promise((res) => setTimeout(res, 1200));

      hide();
      success('Đăng nhập thành công! Chào mừng trở lại 🏸');
      navigate('/venues');
    } catch {
      hide();
      error('Sai email hoặc mật khẩu. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinishFailed = () => {
    error('Vui lòng kiểm tra lại thông tin đã nhập.');
  };

  return (
    <AuthLayout
      heroTitle="Quay lại sân chơi của bạn."
      heroSubtitle="Đăng nhập để đặt sân, thanh toán online, xem lịch sử booking và tham gia các kèo giao lưu cầu lông."
      features={HERO_FEATURES}
    >
      <Title level={2} style={{ margin: '0 0 4px', fontWeight: 800 }}>
        Đăng nhập
      </Title>
      <Text type="secondary">
        Chưa có tài khoản?{' '}
        <Link
          to="/register"
          style={{ color: BRAND.primary, fontWeight: 600 }}
        >
          Đăng ký ngay
        </Link>
      </Text>

      <Form<LoginFormValues>
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        onFinishFailed={handleFinishFailed}
        initialValues={{ remember: true }}
        style={{ marginTop: 28 }}
        requiredMark={false}
      >
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Vui lòng nhập email' },
            { type: 'email', message: 'Email không hợp lệ' },
          ]}
        >
          <Input
            size="large"
            prefix={<MailOutlined style={{ color: '#94a3b8' }} />}
            placeholder="you@smashmate.vn"
            autoComplete="email"
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="Mật khẩu"
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu' },
            { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
          ]}
        >
          <Input.Password
            size="large"
            prefix={<LockOutlined style={{ color: '#94a3b8' }} />}
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </Form.Item>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Ghi nhớ đăng nhập</Checkbox>
          </Form.Item>
          <a
            style={{ color: BRAND.primary, fontSize: 13, fontWeight: 600 }}
            href="#"
          >
            Quên mật khẩu?
          </a>
        </div>

        <Button
          type="primary"
          htmlType="submit"
          block
          size="large"
          loading={submitting}
          style={{ height: 48, fontSize: 15, fontWeight: 700 }}
        >
          Đăng nhập
        </Button>
      </Form>

      <Divider style={{ color: '#94a3b8', fontSize: 13 }}>hoặc</Divider>

      <Button
        block
        size="large"
        icon={<GoogleOutlined />}
        style={{ height: 48, fontWeight: 600 }}
      >
        Tiếp tục với Google
      </Button>
    </AuthLayout>
  );
};

export default LoginPage;
