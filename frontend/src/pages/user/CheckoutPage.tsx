import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Card, Row, Col, Button, Typography, Descriptions, Tag, Space, message, Spin, Alert } from 'antd';
import { ClockCircleOutlined, EnvironmentOutlined, CalendarOutlined } from '@ant-design/icons';
import { bookingApi } from '../../services/bookingApi';
import { useCountdown } from '../../hooks/useCountdown';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const lockIds = searchParams.get('lockIds')?.split(',') || [];
  const [bookingId, setBookingId] = useState<string>('');

  // Create booking mutation
  const createBookingMutation = useMutation({
    mutationFn: bookingApi.createBooking,
    onSuccess: (data) => {
      message.success('Tạo booking thành công');
      setBookingId(data.bookingId);
    },
    onError: () => {
      message.error('Tạo booking thất bại');
      navigate('/venues');
    },
  });

  useEffect(() => {
    if (lockIds.length > 0 && !bookingId) {
      createBookingMutation.mutate({ lockIds });
    }
  }, [lockIds]);

  // Countdown for booking expiration (15 minutes = 900 seconds)
  const { display } = useCountdown(900, !!bookingId);

  const handlePayment = () => {
    if (bookingId) {
      navigate(`/user/payment?bookingId=${bookingId}`);
    }
  };

  if (createBookingMutation.isPending) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>Đang tạo booking...</div>
      </div>
    );
  }

  if (!bookingId) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert
          message="Không tìm thấy booking"
          description="Vui lòng quay lại trang đặt sân"
          type="error"
          showIcon
        />
      </div>
    );
  }

  const mockBookingData = {
    id: bookingId,
    venueNameSnapshot: 'Sân ABC',
    totalAmount: 240000,
    status: 'PENDING',
    paymentStatus: 'UNPAID',
    expiresAt: dayjs().add(15, 'minute').toISOString(),
    items: [
      {
        id: '1',
        courtNameSnapshot: 'Sân 1',
        startTime: '2024-05-20T18:00:00',
        endTime: '2024-05-20T19:00:00',
        priceSnapshot: 120000,
      },
      {
        id: '2',
        courtNameSnapshot: 'Sân 1',
        startTime: '2024-05-20T19:00:00',
        endTime: '2024-05-20T20:00:00',
        priceSnapshot: 120000,
      },
    ],
  };

  return (
    <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
      <Title level={2}>Xác nhận đặt sân</Title>

      {/* Countdown Alert */}
      <Alert
        message={
          <Space>
            <ClockCircleOutlined />
            <Text strong>
              Thời gian còn lại: {display}
            </Text>
          </Space>
        }
        description="Vui lòng hoàn tất thanh toán trước khi hết thời gian"
        type="warning"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Row gutter={[24, 24]}>
        {/* Booking Details */}
        <Col xs={24} lg={16}>
          <Card title="Thông tin đặt sân">
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Mã booking">
                <Text copyable>{mockBookingData.id}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Sân">
                <EnvironmentOutlined /> {mockBookingData.venueNameSnapshot}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color="warning">{mockBookingData.status}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái thanh toán">
                <Tag color="error">{mockBookingData.paymentStatus}</Tag>
              </Descriptions.Item>
            </Descriptions>

            <div style={{ marginTop: 24 }}>
              <Title level={5}>Chi tiết slot</Title>
              {mockBookingData.items.map((item) => (
                <Card key={item.id} size="small" style={{ marginBottom: 8 }}>
                  <Row justify="space-between" align="middle">
                    <Col>
                      <Space direction="vertical" size="small">
                        <Text strong>{item.courtNameSnapshot}</Text>
                        <Text>
                          <CalendarOutlined /> {dayjs(item.startTime).format('DD/MM/YYYY')}
                        </Text>
                        <Text>
                          <ClockCircleOutlined />{' '}
                          {dayjs(item.startTime).format('HH:mm')} - {dayjs(item.endTime).format('HH:mm')}
                        </Text>
                      </Space>
                    </Col>
                    <Col>
                      <Text strong style={{ fontSize: 16, color: '#52c41a' }}>
                        {item.priceSnapshot.toLocaleString()}đ
                      </Text>
                    </Col>
                  </Row>
                </Card>
              ))}
            </div>
          </Card>
        </Col>

        {/* Payment Summary */}
        <Col xs={24} lg={8}>
          <Card title="Tóm tắt thanh toán" style={{ position: 'sticky', top: 24 }}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Số lượng slot:</Text>
                <Text strong>{mockBookingData.items.length}</Text>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Tạm tính:</Text>
                <Text>{mockBookingData.totalAmount.toLocaleString()}đ</Text>
              </div>

              <div
                style={{
                  borderTop: '1px solid #f0f0f0',
                  paddingTop: 16,
                  marginTop: 8,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <Text strong style={{ fontSize: 16 }}>
                    Tổng cộng:
                  </Text>
                  <Text strong style={{ fontSize: 20, color: '#52c41a' }}>
                    {mockBookingData.totalAmount.toLocaleString()}đ
                  </Text>
                </div>

                <Button type="primary" size="large" block onClick={handlePayment}>
                  Thanh toán ngay
                </Button>

                <Button
                  size="large"
                  block
                  style={{ marginTop: 8 }}
                  onClick={() => navigate('/venues')}
                >
                  Hủy
                </Button>
              </div>

              <Alert
                message="Lưu ý"
                description="Booking sẽ tự động hủy nếu không thanh toán trong thời gian quy định"
                type="info"
                showIcon
                style={{ marginTop: 16 }}
              />
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
