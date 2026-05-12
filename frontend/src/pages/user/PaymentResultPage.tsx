import { useSearchParams, useNavigate } from 'react-router-dom';
import { Result, Button, Space } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

export default function PaymentResultPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const status = searchParams.get('status');

  if (status === 'success') {
    return (
      <div style={{ padding: '60px 24px', textAlign: 'center' }}>
        <Result
          status="success"
          icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
          title="Thanh toán thành công!"
          subTitle="Booking của bạn đã được xác nhận. Vui lòng đến sân đúng giờ."
          extra={
            <Space>
              <Button type="primary" size="large" onClick={() => navigate('/user/bookings')}>
                Xem lịch đặt sân
              </Button>
              <Button size="large" onClick={() => navigate('/venues')}>
                Đặt sân tiếp
              </Button>
            </Space>
          }
        />
      </div>
    );
  }

  return (
    <div style={{ padding: '60px 24px', textAlign: 'center' }}>
      <Result
        status="error"
        icon={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
        title="Thanh toán thất bại"
        subTitle="Giao dịch không thành công. Vui lòng thử lại hoặc chọn phương thức thanh toán khác."
        extra={
          <Space>
            <Button type="primary" size="large" onClick={() => navigate(-1)}>
              Thử lại
            </Button>
            <Button size="large" onClick={() => navigate('/venues')}>
              Về trang chủ
            </Button>
          </Space>
        }
      />
    </div>
  );
}
