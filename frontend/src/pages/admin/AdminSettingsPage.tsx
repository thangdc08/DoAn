import { useEffect, useState } from 'react';
import { Card, Typography, Tabs, Form, Input, Switch, Button, Space, Tag, message, Spin } from 'antd';
import { SettingOutlined, LockOutlined, BellOutlined, CloudServerOutlined, SaveOutlined, SyncOutlined } from '@ant-design/icons';
import { BRAND } from '../../theme/antdTheme';
import { adminApi } from '../../services/adminApi';

const { Title, Text } = Typography;

export default function AdminSettingsPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      try {
        const data = await adminApi.getSettings();
        form.setFieldsValue({
          siteName: data?.siteName ?? 'BadmintonHub',
          description: data?.description ?? '',
          maintenance: !!data?.maintenance,
          supportEmail: data?.supportEmail ?? '',
          smtpHost: data?.smtpHost ?? '',
          smtpPort: data?.smtpPort ?? '',
        });
      } catch (error) {
        console.error(error);
        message.warning('Không tải được cấu hình từ server, đang dùng cấu hình mặc định');
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, [form]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const values = await form.validateFields();
      await adminApi.updateSettings(values);
      message.success('Đã lưu cấu hình hệ thống');
    } catch (error) {
      console.error(error);
      message.error('Lưu cấu hình thất bại');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Spin spinning={loading}>
      <div style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <Title level={2} style={{ margin: 0 }}>Cấu hình Hệ thống</Title>
          <Space><Tag color="blue" icon={<SyncOutlined spin />}>Admin Config</Tag><Text type="secondary">Đồng bộ qua API</Text></Space>
        </div>

        <Card bodyStyle={{ padding: 0 }} style={{ borderRadius: 16, overflow: 'hidden', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <Tabs
            tabPosition="left"
            items={[
              {
                key: '1',
                label: <Space><SettingOutlined /> Chung</Space>,
                children: (
                  <div style={{ padding: '32px 40px' }}>
                    <Form layout="vertical" form={form}>
                      <Form.Item label={<Text strong>Tên nền tảng</Text>} name="siteName"><Input size="large" style={{ borderRadius: 10 }} /></Form.Item>
                      <Form.Item label={<Text strong>Mô tả hệ thống</Text>} name="description"><Input.TextArea rows={3} style={{ borderRadius: 10 }} /></Form.Item>
                      <Form.Item label={<Text strong>Email hỗ trợ</Text>} name="supportEmail"><Input size="large" style={{ borderRadius: 10 }} /></Form.Item>
                      <Form.Item label={<Text strong>Maintenance mode</Text>} name="maintenance" valuePropName="checked"><Switch checkedChildren="ON" unCheckedChildren="OFF" /></Form.Item>
                    </Form>
                  </div>
                ),
              },
              {
                key: '2',
                label: <Space><LockOutlined /> Bảo mật</Space>,
                children: (
                  <div style={{ padding: '32px 40px' }}>
                    <Form layout="vertical" form={form}>
                      <Form.Item label="SMTP Host" name="smtpHost"><Input style={{ borderRadius: 8 }} /></Form.Item>
                      <Form.Item label="SMTP Port" name="smtpPort"><Input style={{ borderRadius: 8 }} /></Form.Item>
                    </Form>
                  </div>
                ),
              },
              { key: '3', label: <Space><BellOutlined /> Thông báo</Space>, children: <div style={{ padding: '32px 40px' }}><Text type="secondary">Cấu hình thông báo dùng chung đang được đồng bộ qua backend settings.</Text></div> },
              { key: '4', label: <Space><CloudServerOutlined /> Hạ tầng</Space>, children: <div style={{ padding: '32px 40px' }}><Text type="secondary">Theo dõi hạ tầng đặt trong monitoring service.</Text></div> },
            ]}
          />
        </Card>
        <div style={{ marginTop: 16 }}>
          <Button type="primary" size="large" icon={<SaveOutlined />} loading={saving} onClick={handleSave} style={{ background: BRAND.primary, borderRadius: 10, height: 44 }}>Lưu cài đặt</Button>
        </div>
      </div>
    </Spin>
  );
}

