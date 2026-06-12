import { useSearchParams, useNavigate } from 'react-router-dom';
import { Result, Button, Space, QRCode, Typography, Card } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, QrcodeOutlined } from '@ant-design/icons';

const { Text } = Typography;

export default function PaymentResultPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const status = searchParams.get('status');
  const bookingId = searchParams.get('bookingId');

  if (status === 'success') {
    return (
      <div style={{ padding: '60px 24px', textAlign: 'center', maxWidth: 600, margin: '0 auto', animation: 'fadeIn 0.4s ease' }}>
        <Result
          status="success"
          icon={<CheckCircleOutlined style={{ color: '#10b981', fontSize: 64 }} />}
          title="Thanh toán thành công!"
          subTitle="Đơn đặt sân của bạn đã được xác nhận. Vui lòng đến sân đúng giờ."
        >
          {bookingId && (
            <Card
              bordered={false}
              style={{
                background: '#f8fafc',
                borderRadius: 20,
                padding: '24px 16px',
                marginTop: 16,
                marginBottom: 24,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
                border: '1px solid #f1f5f9',
              }}
            >
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div style={{ display: 'inline-flex', padding: 12, background: 'white', borderRadius: 16, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.02)' }}>
                  <QRCode
                    value={bookingId}
                    size={160}
                    bordered={false}
                    color="#00a651"
                  />
                </div>
                <div>
                  <Text type="secondary" style={{ fontSize: 12, display: 'block', letterSpacing: '0.05em' }}>
                    MÃ CHECK-IN CỦA BẠN
                  </Text>
                  <Text strong style={{ fontSize: 16, color: '#334155', marginTop: 4, display: 'block' }}>
                    #{bookingId.substring(0, 8).toUpperCase()}
                  </Text>
                </div>
                <div style={{ background: '#eff6ff', padding: '10px 14px', borderRadius: 10, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <QrcodeOutlined style={{ color: '#1d4ed8' }} />
                  <Text style={{ fontSize: 12, color: '#1e40af', textAlign: 'left' }}>
                    Đưa mã QR này cho nhân viên tại quầy để check-in nhận sân nhanh.
                  </Text>
                </div>
              </Space>
            </Card>
          )}
        </Result>
        <Space size="middle">
          <Button type="primary" size="large" onClick={() => navigate('/user/bookings')} style={{ borderRadius: 10, height: 46 }}>
            Xem lịch đặt sân
          </Button>
          <Button size="large" onClick={() => navigate('/venues')} style={{ borderRadius: 10, height: 46 }}>
            Đặt sân tiếp
          </Button>
        </Space>
        
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ padding: '60px 24px', textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
      <Result
        status="error"
        icon={<CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: 64 }} />}
        title="Thanh toán thất bại"
        subTitle="Giao dịch không thành công hoặc đã bị huỷ. Vui lòng thử lại hoặc chọn phương thức thanh toán khác."
        extra={
          <Space>
            <Button type="primary" size="large" onClick={() => navigate(-1)} style={{ borderRadius: 10, height: 46 }}>
              Thử lại
            </Button>
            <Button size="large" onClick={() => navigate('/venues')} style={{ borderRadius: 10, height: 46 }}>
              Về trang chủ
            </Button>
          </Space>
        }
      />
    </div>
  );
}
