import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Card, Row, Col, Button, Typography, Descriptions, Tag, Space, message, Spin, Alert } from 'antd';
import { ClockCircleOutlined, EnvironmentOutlined, CalendarOutlined } from '@ant-design/icons';
import { bookingApi } from '../../services/bookingApi';
import { useCountdown } from '../../hooks/useCountdown';
import dayjs from 'dayjs';
import type { CreateBookingResponse } from '../../types/booking.types';

const { Title, Text } = Typography;

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const lockIdsParam = searchParams.get('lockIds') || '';
  const lockIds = useMemo(
    () => lockIdsParam.split(',').map((id) => id.trim()).filter(Boolean),
    [lockIdsParam]
  );
  const [bookingId, setBookingId] = useState<string>('');
  const [bookingData, setBookingData] = useState<CreateBookingResponse | null>(null);
  const requestedLockIdsRef = useRef<string>('');

  const createBookingMutation = useMutation({
    mutationFn: bookingApi.createBooking,
    onSuccess: (data) => {
      message.success({ key: 'create-booking', content: 'Tao booking thanh cong' });
      setBookingId(data.bookingId);
      setBookingData(data);
    },
    onError: (error: any) => {
      message.error({
        key: 'create-booking',
        content: error?.response?.data?.message || error?.message || 'Tao booking that bai',
      });
    },
  });
  const bookingError = createBookingMutation.error as any;
  const bookingErrorMessage =
    bookingError?.response?.data?.message ||
    bookingError?.message ||
    'Khong the tao booking. Vui long thu lai.';

  useEffect(() => {
    if (lockIds.length > 0 && !bookingId && requestedLockIdsRef.current !== lockIdsParam) {
      requestedLockIdsRef.current = lockIdsParam;
      createBookingMutation.mutate({ lockIds });
    }
  }, [lockIds, lockIdsParam, bookingId]);

  const expiresInSeconds = bookingData?.expiresAt
    ? Math.max(0, dayjs(bookingData.expiresAt).diff(dayjs(), 'second'))
    : 900;
  const { display } = useCountdown(expiresInSeconds, !!bookingId);

  const handlePayment = () => {
    if (bookingId) {
      navigate(`/payment?bookingId=${bookingId}`);
    }
  };

  if (createBookingMutation.isPending) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>Dang tao booking...</div>
      </div>
    );
  }

  if (createBookingMutation.isError) {
    return (
      <div style={{ padding: '24px', maxWidth: 720, margin: '0 auto' }}>
        <Alert
          message="Tao booking that bai"
          description={bookingErrorMessage}
          type="error"
          showIcon
          action={(
            <Space>
              <Button onClick={() => {
                requestedLockIdsRef.current = '';
                createBookingMutation.reset();
              }}>
                Thu lai
              </Button>
              <Button type="primary" onClick={() => navigate('/venues')}>
                Chon san khac
              </Button>
            </Space>
          )}
        />
      </div>
    );
  }

  if (!bookingId || !bookingData) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert
          message="Khong tim thay booking"
          description="Vui long quay lai trang dat san"
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
      <Title level={2}>Xac nhan dat san</Title>

      <Alert
        message={(
          <Space>
            <ClockCircleOutlined />
            <Text strong>Thoi gian con lai: {display}</Text>
          </Space>
        )}
        description="Vui long hoan tat thanh toan truoc khi het thoi gian"
        type="warning"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card title="Thong tin dat san">
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Ma booking">
                <Text copyable>{bookingData.bookingId}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="San">
                <EnvironmentOutlined /> {bookingData.venueNameSnapshot}
              </Descriptions.Item>
              <Descriptions.Item label="Trang thai">
                <Tag color="warning">{bookingData.status}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Trang thai thanh toan">
                <Tag color="error">{bookingData.paymentStatus}</Tag>
              </Descriptions.Item>
            </Descriptions>

            <div style={{ marginTop: 24 }}>
              <Title level={5}>Chi tiet slot</Title>
              {bookingData.items?.map((item) => (
                <Card key={item.id} size="small" style={{ marginBottom: 8 }}>
                  <Row justify="space-between" align="middle">
                    <Col>
                      <Space direction="vertical" size="small">
                        <Text strong>{item.courtNameSnapshot}</Text>
                        <Text>
                          <CalendarOutlined /> {dayjs(item.startTime).format('DD/MM/YYYY')}
                        </Text>
                        <Text>
                          <ClockCircleOutlined /> {dayjs(item.startTime).format('HH:mm')} - {dayjs(item.endTime).format('HH:mm')}
                        </Text>
                      </Space>
                    </Col>
                    <Col>
                      <Text strong style={{ fontSize: 16, color: '#52c41a' }}>
                        {item.priceSnapshot.toLocaleString()}d
                      </Text>
                    </Col>
                  </Row>
                </Card>
              ))}
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Tom tat thanh toan" style={{ position: 'sticky', top: 24 }}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>So luong slot:</Text>
                <Text strong>{bookingData.items?.length || 0}</Text>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Tam tinh:</Text>
                <Text>{bookingData.totalAmount.toLocaleString()}d</Text>
              </div>

              <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 16, marginTop: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <Text strong style={{ fontSize: 16 }}>Tong cong:</Text>
                  <Text strong style={{ fontSize: 20, color: '#52c41a' }}>
                    {bookingData.totalAmount.toLocaleString()}d
                  </Text>
                </div>

                <Button type="primary" size="large" block onClick={handlePayment}>
                  Thanh toan ngay
                </Button>

                <Button size="large" block style={{ marginTop: 8 }} onClick={() => navigate('/venues')}>
                  Huy
                </Button>
              </div>

              <Alert
                message="Luu y"
                description="Booking se tu dong huy neu khong thanh toan trong thoi gian quy dinh"
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
