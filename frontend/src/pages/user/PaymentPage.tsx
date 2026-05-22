import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Card, Row, Col, Button, Typography, Radio, Space, message, Spin, Alert, Divider } from 'antd';
import { CreditCardOutlined, WalletOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { paymentApi } from '../../services/paymentApi';
import { bookingApi } from '../../services/bookingApi';
import { useAuthStore } from '../../stores/authStore';

const { Title, Text } = Typography;

export default function PaymentPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookingId = searchParams.get('bookingId');
  const [paymentMethod, setPaymentMethod] = useState<'MOCK' | 'VNPAY'>('MOCK');
  const { user } = useAuthStore();

  // Get booking details
  const { data: booking, isLoading: loadingBooking, error: bookingError } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => bookingApi.getBookingById(bookingId!),
    enabled: !!bookingId,
    retry: false,
  });

  // Check ownership after booking is loaded
  useEffect(() => {
    if (booking && user && booking.userId !== user.id) {
      message.error('Bạn không có quyền thanh toán booking này');
      navigate('/user/bookings', { replace: true });
    }
  }, [booking, user, navigate]);

  // Create payment mutation
  const createPaymentMutation = useMutation({
    mutationFn: paymentApi.createPayment,
    onSuccess: (data) => {
      if (paymentMethod === 'MOCK') {
        // For mock payment, redirect to mock payment page
        window.location.href = data.paymentUrl;
      } else {
        // For VNPay, redirect to VNPay gateway
        window.location.href = data.paymentUrl;
      }
    },
    onError: (error: any) => {
      message.error('Tạo thanh toán thất bại: ' + (error?.message || 'Vui lòng thử lại'));
    },
  });

  const handlePayment = () => {
    if (!bookingId) {
      message.error('Không tìm thấy booking');
      return;
    }

    if (!booking) {
      message.error('Không thể tải thông tin booking');
      return;
    }

    // Additional check: booking status must be PENDING and paymentStatus UNPAID
    if (booking.status !== 'PENDING' || booking.paymentStatus !== 'UNPAID') {
      message.error('Booking không hợp lệ hoặc đã được thanh toán');
      navigate('/user/bookings', { replace: true });
      return;
    }

    createPaymentMutation.mutate({
      bookingId,
      userId: booking.userId,
      amount: booking.totalAmount,
      provider: paymentMethod,
    });
  };

  if (loadingBooking) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>Đang tải thông tin đơn hàng...</div>
      </div>
    );
  }

  if (bookingError || !booking) {
    return (
      <div style={{ padding: '24px', maxWidth: 800, margin: '0 auto' }}>
        <Alert
          message="Không tìm thấy booking"
          description="Vui lòng quay lại trang đặt sân"
          type="error"
          showIcon
          action={
            <Button type="primary" onClick={() => navigate('/venues')}>
              Về trang chủ
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: 800, margin: '0 auto' }}>
      <Title level={2}>Thanh toán</Title>

      <Row gutter={[24, 24]}>
        <Col xs={24}>
          {/* Booking Summary */}
          <Card title="Thông tin đơn hàng">
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Mã booking:</Text>
                <Text strong>{booking.id}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Sân:</Text>
                <Text strong>{booking.venueNameSnapshot}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Số lượng slot:</Text>
                <Text strong>{booking.items?.length || 0}</Text>
              </div>
              <Divider style={{ margin: '12px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text strong style={{ fontSize: 16 }}>
                  Tổng tiền:
                </Text>
                <Text strong style={{ fontSize: 20, color: '#52c41a' }}>
                  {booking.totalAmount.toLocaleString()}đ
                </Text>
              </div>
            </Space>
          </Card>
        </Col>

        <Col xs={24}>
          {/* Payment Method */}
          <Card title="Phương thức thanh toán">
            <Radio.Group
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              style={{ width: '100%' }}
            >
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Card
                  hoverable
                  style={{
                    border: paymentMethod === 'MOCK' ? '2px solid #1890ff' : '1px solid #d9d9d9',
                  }}
                  onClick={() => setPaymentMethod('MOCK')}
                >
                  <Radio value="MOCK">
                    <Space>
                      <WalletOutlined style={{ fontSize: 24 }} />
                      <div>
                        <div style={{ fontWeight: 'bold' }}>Mock Payment (Demo)</div>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          Thanh toán giả lập cho mục đích demo
                        </Text>
                      </div>
                    </Space>
                  </Radio>
                </Card>

                <Card
                  hoverable
                  style={{
                    border: paymentMethod === 'VNPAY' ? '2px solid #1890ff' : '1px solid #d9d9d9',
                  }}
                  onClick={() => setPaymentMethod('VNPAY')}
                >
                  <Radio value="VNPAY">
                    <Space>
                      <CreditCardOutlined style={{ fontSize: 24 }} />
                      <div>
                        <div style={{ fontWeight: 'bold' }}>VNPay</div>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          Thanh toán qua cổng VNPay (Sandbox)
                        </Text>
                      </div>
                    </Space>
                  </Radio>
                </Card>
              </Space>
            </Radio.Group>

            <Alert
              message="Thông tin thanh toán"
              description={
                paymentMethod === 'MOCK'
                  ? 'Bạn sẽ được chuyển đến trang thanh toán giả lập. Chọn "Thành công" hoặc "Thất bại" để test.'
                  : 'Bạn sẽ được chuyển đến cổng thanh toán VNPay Sandbox để hoàn tất giao dịch.'
              }
              type="info"
              showIcon
              style={{ marginTop: 16 }}
            />
          </Card>
        </Col>

        <Col xs={24}>
          <Card>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Button
                type="primary"
                size="large"
                block
                icon={<CheckCircleOutlined />}
                loading={createPaymentMutation.isPending}
                onClick={handlePayment}
              >
                Xác nhận thanh toán {booking.totalAmount.toLocaleString()}đ
              </Button>

              <Button size="large" block onClick={() => navigate(-1)}>
                Quay lại
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
