import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert, Button, Col, DatePicker, Divider, Rate, Row, Space, Steps, Tag, Typography,
} from 'antd';
import {
  ArrowLeftOutlined, CheckCircleOutlined, ClockCircleOutlined,
  CreditCardOutlined, EnvironmentOutlined, PhoneOutlined, StarFilled, WifiOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import BookingGrid from '../../components/ui/BookingGrid';
import StatusTag from '../../components/ui/StatusTag';
import PageContainer from '../../components/ui/PageContainer';
import { venues } from '../../data/mockData';
import { useCountdown } from '../../hooks/useCountdown';
import { colors } from '../../styles/theme';

const { Title, Text, Paragraph } = Typography;

const AmenityTag: React.FC<{ label: string }> = ({ label }) => {
  const icon = label.toLowerCase().includes('wifi') ? '📶'
    : label.toLowerCase().includes('xe') ? '🅿️'
    : label.toLowerCase().includes('lạnh') ? '❄️'
    : label.toLowerCase().includes('vợt') ? '🏸'
    : label.toLowerCase().includes('giày') ? '👟'
    : label.toLowerCase().includes('nước') ? '💧' : '✓';
  return (
    <Tag style={{ borderRadius: 8, padding: '4px 10px', fontWeight: 600, fontSize: 12, border: '1px solid #e2e8f0' }}>
      {icon} {label}
    </Tag>
  );
};

const VenueDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const venue = venues.find((v) => v.id === id) ?? venues[0];
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState('Hôm nay');
  const countdown = useCountdown(600, selectedSlots.length > 0);
  const totalPrice = useMemo(() => selectedSlots.length * 120_000, [selectedSlots.length]);
  const handleSlotChange = useCallback((slots: string[]) => setSelectedSlots(slots), []);

  return (
    <PageContainer padding="24px 32px">
      <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate('/venues')}
        style={{ marginBottom: 16, fontWeight: 600, color: '#64748b', padding: '4px 0' }}>
        Quay lại danh sách sân
      </Button>

      {/* Hero */}
      <div style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid #e2e8f0', marginBottom: 24, boxShadow: '0 2px 12px rgba(15,23,42,0.07)', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr' }} className="max-lg:grid-cols-1">
        <div style={{ position: 'relative', height: 340, overflow: 'hidden' }}>
          <img src={venue.image} alt={venue.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.28) 100%)' }} />
        </div>
        <div style={{ background: '#fff', padding: '28px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Space size={[8, 8]} wrap style={{ marginBottom: 12 }}>
            <StatusTag status="OPENING" />
            <Tag color="blue" style={{ fontWeight: 600 }}>{venue.area}</Tag>
            <Tag style={{ fontWeight: 600 }}>{venue.courts} sân</Tag>
          </Space>
          <Title level={2} style={{ margin: '0 0 10px', fontWeight: 800, lineHeight: 1.25 }}>{venue.name}</Title>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <Rate disabled allowHalf value={venue.rating} character={<StarFilled style={{ fontSize: 13 }} />} />
            <Text style={{ color: colors.primary, fontWeight: 700 }}>{venue.rating}</Text>
            <Text type="secondary" style={{ fontSize: 13 }}>({venue.reviewCount} đánh giá) · {venue.distance}</Text>
          </div>
          <Paragraph style={{ color: '#475569', fontSize: 14, margin: '0 0 18px' }}>{venue.address}</Paragraph>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 18 }}>
            {[
              { label: 'Giá / giờ', value: venue.priceRange, color: colors.primary },
              { label: 'Giờ mở cửa', value: venue.openTime, color: colors.text },
              { label: 'Slot còn trống', value: `${venue.availableSlots}`, color: colors.secondary },
            ].map((item) => (
              <div key={item.label} style={{ background: '#f8fafc', borderRadius: 10, padding: '10px 12px', border: '1px solid #f1f5f9' }}>
                <Text type="secondary" style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{item.label}</Text>
                <div style={{ fontSize: 13, fontWeight: 700, color: item.color, marginTop: 4 }}>{item.value}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {venue.amenities.map((a) => <AmenityTag key={a} label={a} />)}
          </div>
        </div>
      </div>

      {/* Grid + Sidebar */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={17}>
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 24, boxShadow: '0 1px 4px rgba(15,23,42,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
              <div>
                <Title level={4} style={{ margin: 0, fontWeight: 700 }}>Lịch sân trực quan</Title>
                <Text type="secondary" style={{ fontSize: 13 }}>Nhấp vào ô trống để chọn slot, nhấp lại để bỏ chọn</Text>
              </div>
              <Space>
                {['Hôm nay', 'Ngày mai'].map((d) => (
                  <Button key={d} type={selectedDate === d ? 'primary' : 'default'} onClick={() => setSelectedDate(d)} style={{ fontWeight: 600, borderRadius: 8 }}>{d}</Button>
                ))}
                <DatePicker placeholder="Chọn ngày" style={{ borderRadius: 8 }} onChange={() => setSelectedDate('custom')} />
              </Space>
            </div>
            <BookingGrid onSelectionChange={handleSlotChange} />
          </div>
        </Col>

        <Col xs={24} lg={7}>
          <div style={{ position: 'sticky', top: 88, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Booking summary */}
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 20, boxShadow: '0 1px 4px rgba(15,23,42,0.05)' }}>
              <Title level={5} style={{ margin: '0 0 16px', fontWeight: 700 }}>Tóm tắt đặt sân</Title>
              <Steps size="small" current={selectedSlots.length > 0 ? 1 : 0} style={{ marginBottom: 18 }}
                items={[
                  { title: 'Chọn slot', icon: <CheckCircleOutlined /> },
                  { title: 'Giữ chỗ', icon: <ClockCircleOutlined /> },
                  { title: 'Thanh toán', icon: <CreditCardOutlined /> },
                ]} />
              <Divider style={{ margin: '8px 0' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Slot đã chọn', value: `${selectedSlots.length} slot` },
                  { label: 'Đơn giá', value: '120.000đ / slot' },
                ].map((row) => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text type="secondary" style={{ fontSize: 13 }}>{row.label}</Text>
                    <Text strong>{row.value}</Text>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text type="secondary" style={{ fontSize: 13 }}>Trạng thái</Text>
                  <StatusTag status="PENDING" />
                </div>
                {selectedSlots.length > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text type="secondary" style={{ fontSize: 13 }}>Hết hạn giữ chỗ</Text>
                    <Text strong style={{ color: countdown.urgent ? '#ef4444' : colors.primary, fontFamily: 'monospace', fontSize: 15 }}>
                      {countdown.display}
                    </Text>
                  </div>
                )}
                <Divider style={{ margin: '4px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text strong style={{ fontSize: 15 }}>Tổng tiền</Text>
                  <Text strong style={{ fontSize: 18, color: colors.primary }}>{totalPrice.toLocaleString('vi-VN')}đ</Text>
                </div>
              </div>
              <Alert style={{ marginTop: 14 }} type="info" showIcon message="Chính sách đặt sân"
                description="Slot được giữ 10 phút. Hủy trước 2 giờ để hoàn tiền 100%." />
            </div>

            {/* Contact */}
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 20, boxShadow: '0 1px 4px rgba(15,23,42,0.05)' }}>
              <Title level={5} style={{ margin: '0 0 14px', fontWeight: 700 }}>Thông tin liên hệ</Title>
              {[
                { icon: <EnvironmentOutlined style={{ color: colors.primary }} />, text: venue.address },
                { icon: <PhoneOutlined style={{ color: colors.primary }} />, text: '0909 123 456' },
                { icon: <WifiOutlined style={{ color: colors.primary }} />, text: 'WiFi miễn phí trong khuôn viên' },
              ].map((row, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, color: '#475569', fontSize: 13, marginBottom: i < 2 ? 10 : 0 }}>
                  {row.icon}<span>{row.text}</span>
                </div>
              ))}
            </div>
          </div>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default VenueDetail;
