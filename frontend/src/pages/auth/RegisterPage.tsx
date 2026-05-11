import React, { useState } from 'react';
import { Button, Divider, Form, Input, Select, Typography } from 'antd';
import {
  GoogleOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/layout/AuthLayout';
import { useNotify } from '../../hooks/useNotify';
import { BRAND } from '../../theme/antdTheme';

const { Title, Text } = Typography;

type RegisterFormValues = {
  fullName: string;
  email: string;
  phone: string;
  level: string;
  password: string;
  confirmPassword: string;
};

const LEVEL_OPTIONS = [
  { value: 'beginner', label: '🟢 Người mới' },
  { value: 'medium', label: '🟡 Trung bình' },
  { value: 'good', label: '🟠 Khá' },
  { value: 'advanced', label: '🔴 Giỏi' },
];

const HERO_FEATURES = [
  { icon: '👤', label: 'Hồ sơ người chơi' },
  { icon: '🎯', label: 'Gợi ý theo trình độ' },
  { icon: '📍', label: 'Ưu tiên khu vực' },
];

const PHONE_REGEX = /^(0|\+84)(3|5|7|8|9)\d{8}$/;

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { success, error, loading } = useNotify();
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm<RegisterFormValues>();

  const handleFinish = async (values: RegisterFormValues) => {
    setSubmitting(true);
    const hide = loading('Đang tạo tài khoản...');

    try {
      // TODO: Kết nối identity-service /auth/register
      console.info('Register payload:', {
        ...values,
        confirmPassword: undefined,
      });
      await new Promise((res) => setTimeout(res, 1400));

      hide();
      success('Tạo tài khoản thành công! Hãy đăng nhập để bắt đầu 🏸');
      navigate('/login');
    } catch {
      hide();
      error('Không thể tạo tài khoản. Vui lòng thử lại sau.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinishFailed = () => {
    error('Vui lòng kiểm tra lại các thông tin bắt buộc.');
  };

  return (
    <AuthLayout
      heroTitle="Tạo hồ sơ người chơi trong vài bước."
      heroSubtitle="Hệ thống sẽ gợi ý sân, kèo và người chơi phù hợp dựa trên trình độ và khu vực ưu tiên của bạn."
      features={HERO_FEATURES}
      panelWidth={520}
    >
      <Title level={2} style={{ margin: '0 0 4px', fontWeight: 800 }}>
        Đăng ký
      </Title>
      <Text type="secondary">
        Đã có tài khoản?{' '}
        <Link to="/login" style={{ color: BRAND.primary, fontWeight: 600 }}>
          Đăng nhập
        </Link>
      </Text>

      <Form<RegisterFormValues>
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        onFinishFailed={handleFinishFailed}
        style={{ marginTop: 28 }}
        requiredMark={false}
        scrollToFirstError
      >
        <Form.Item
          name="fullName"
          label="Họ và tên"
          rules={[
            { required: true, message: 'Vui lòng nhập họ tên' },
            { min: 2, message: 'Họ tên phải có ít nhất 2 ký tự' },
            {
              pattern: /^[\p{L}\s]+$/u,
              message: 'Họ tên không được chứa ký tự đặc biệt',
            },
          ]}
        >
          <Input
            size="large"
            prefix={<UserOutlined style={{ color: '#94a3b8' }} />}
            placeholder="Nguyễn Văn A"
            autoComplete="name"
          />
        </Form.Item>

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
            placeholder="you@email.com"
            autoComplete="email"
          />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Số điện thoại"
          rules={[
            { required: true, message: 'Vui lòng nhập số điện thoại' },
            {
              pattern: PHONE_REGEX,
              message: 'Số điện thoại không hợp lệ (VD: 0912345678)',
            },
          ]}
        >
          <Input
            size="large"
            prefix={<PhoneOutlined style={{ color: '#94a3b8' }} />}
            placeholder="0912 345 678"
            autoComplete="tel"
          />
        </Form.Item>

        <Form.Item
          name="level"
          label="Trình độ cầu lông"
          rules={[{ required: true, message: 'Vui lòng chọn trình độ' }]}
        >
          <Select
            size="large"
            placeholder="Chọn trình độ của bạn"
            options={LEVEL_OPTIONS}
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="Mật khẩu"
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu' },
            { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự' },
            {
              pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
              message:
                'Mật khẩu phải có chữ hoa, chữ thường và số',
            },
          ]}
          hasFeedback
        >
          <Input.Password
            size="large"
            prefix={<LockOutlined style={{ color: '#94a3b8' }} />}
            placeholder="Tối thiểu 8 ký tự"
            autoComplete="new-password"
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Xác nhận mật khẩu"
          dependencies={['password']}
          hasFeedback
          rules={[
            { required: true, message: 'Vui lòng xác nhận mật khẩu' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Mật khẩu xác nhận không khớp'));
              },
            }),
          ]}
        >
          <Input.Password
            size="large"
            prefix={<LockOutlined style={{ color: '#94a3b8' }} />}
            placeholder="Nhập lại mật khẩu"
            autoComplete="new-password"
          />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          block
          size="large"
          loading={submitting}
          style={{ height: 48, fontSize: 15, fontWeight: 700, marginTop: 4 }}
        >
          Tạo tài khoản
        </Button>
      </Form>

      <Divider style={{ color: '#94a3b8', fontSize: 13 }}>hoặc</Divider>

      <Button
        block
        size="large"
        icon={<GoogleOutlined />}
        style={{ height: 48, fontWeight: 600 }}
      >
        Đăng ký với Google
      </Button>
    </AuthLayout>
  );
};

export default RegisterPage;
