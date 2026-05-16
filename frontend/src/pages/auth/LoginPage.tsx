import React, { useEffect, useState } from 'react';
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
import { authApi } from '../../services/authApi';
import { useAuthStore } from '../../stores/authStore';

const { Title, Text } = Typography;

type LoginFormValues = {
  email: string;
  password: string;
  remember: boolean;
};

const getErrorMessage = (err: any) => {
  const message = err?.response?.data?.message ?? err?.message;
  if (Array.isArray(message)) {
    return message.join('\n');
  }
  if (typeof message === 'string' && message.includes('Invalid URI path')) {
    return 'Cấu hình API frontend không hợp lệ. Vui lòng khởi động lại frontend dev server.';
  }
  return message || 'Sai email hoặc mật khẩu. Vui lòng thử lại.';
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
      const loginRes = await authApi.login({
        email: _values.email,
        password: _values.password,
      });

      // Xử lý ghi nhớ đăng nhập
      if (_values.remember) {
        localStorage.setItem('remembered_email', _values.email);
      } else {
        localStorage.removeItem('remembered_email');
      }

      const { access_token, refresh_token } = loginRes;
      
      // Sau khi đăng nhập thành công, gọi API /me để lấy thông tin user
      // Lưu token vào store trước để API getMe có thể dùng token này
      useAuthStore.getState().setAccessToken(access_token);
      
      const user = await authApi.getMe();
      useAuthStore.getState().setAuth(user, access_token, refresh_token);

      hide();
      success('Đăng nhập thành công! Chào mừng trở lại 🏸');
      
      // Điều hướng dựa trên Role
      if (user.roles?.includes('ADMIN')) {
        navigate('/admin/dashboard');
      } else if (user.roles?.includes('OWNER')) {
        navigate('/owner/dashboard');
      } else {
        navigate('/venues');
      }
    } catch (err: any) {
      hide();
      error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const rememberedEmail = localStorage.getItem('remembered_email');
    if (rememberedEmail) {
      form.setFieldsValue({
        email: rememberedEmail,
        remember: true
      });
    }
  }, [form]);

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
