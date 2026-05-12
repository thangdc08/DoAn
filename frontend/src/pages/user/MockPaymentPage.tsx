import { useSearchParams, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Card, Button, Space, Typography, Alert } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { paymentApi } from '../../services/paymentApi';
import { message } from 'antd';

const { Title, Text } = Typography;

export default function MockPaymentPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const transactionId = searchParams.get('transactionId');

  const mockCallbackMutation = useMutation({
    mutationFn: ({ success }: { success: boolean }) =>
      paymentApi.mockPaymentCallback(transactionId!, success),
    onSuccess: (_, variables) => {
      if (variables.success) {
        message.success('Thanh toán thành công');
        navigate('/user/payment-result?status=success');
      } else {
        message.error('Thanh toán thất bại');
        navigate('/user/payment-result?status=failed');
      }
    },
    onError: () => {
      message.error('Có lỗi xảy ra');
    },
  });

  const handleSuccess = () => {
    mockCallbackMutation.mutate({ success: true });
  };

  const handleFailed = () => {
    mockCallbackMutation.mutate({ success: false });
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f0f2f5',
        padding: '24px',
      }}
    >
      <Card style={{ maxWidth: 500, width: '100%' }}>
        <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
          <Title level={3}>Mock Payment Gateway</Title>

          <Alert
            message="Đây là trang thanh toán giả lập"
            description="Chọn kết quả thanh toán để test luồng nghiệp vụ"
            type="info"
            showIcon
          />

          <div>
            <Text strong>Transaction ID:</Text>
            <div style={{ marginTop: 8 }}>
              <Text code>{transactionId}</Text>
            </div>
          </div>

          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Button
              type="primary"
              size="large"
              block
              icon={<CheckCircleOutlined />}
              loading={mockCallbackMutation.isPending}
              onClick={handleSuccess}
              style={{ background: '#52c41a', borderColor: '#52c41a' }}
            >
              Thanh toán thành công
            </Button>

            <Button
              danger
              size="large"
              block
              icon={<CloseCircleOutlined />}
              loading={mockCallbackMutation.isPending}
              onClick={handleFailed}
            >
              Thanh toán thất bại
            </Button>
          </Space>
        </Space>
      </Card>
    </div>
  );
}
