import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, Row, Col, DatePicker, Typography, Alert, Space, Spin } from 'antd';
import { CalendarOutlined, InfoCircleOutlined } from '@ant-design/icons';
import BookingGrid from '../../components/ui/BookingGrid';
import dayjs, { Dayjs } from 'dayjs';
import { useQuery } from '@tanstack/react-query';
import { venueApi } from '../../services/venueApi';

const { Title } = Typography;

export default function BookingPage() {
  const [searchParams] = useSearchParams();
  const venueId = searchParams.get('venueId') || '';

  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());

  // Fetch actual venue details
  const { data: venue, isLoading: isLoadingVenue } = useQuery({
    queryKey: ['venue', venueId],
    queryFn: () => venueApi.getVenueById(venueId),
    enabled: !!venueId,
  });

  // Fetch venue courts (filter out INACTIVE ones for booking view)
  const { data: courts = [], isLoading: isLoadingCourts } = useQuery({
    queryKey: ['courts', venueId],
    queryFn: async () => {
      const allCourts = await venueApi.getVenueCourts(venueId);
      return allCourts.filter(c => c.status !== 'INACTIVE');
    },
    enabled: !!venueId,
  });

  const { data: priceRules = [], isLoading: isLoadingPriceRules } = useQuery({
    queryKey: ['price-rules', venueId],
    queryFn: () => venueApi.getPriceRules(venueId),
    enabled: !!venueId,
  });

  const handleSelectionChange = (slots: string[]) => {
    console.log('Selected slots:', slots);
  };

  if (isLoadingVenue || isLoadingCourts || isLoadingPriceRules) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Spin size="large" tip="Đang tải thông tin lịch đặt sân..." />
      </div>
    );
  }

  if (!venue) {
    return (
      <div style={{ padding: '24px', maxWidth: 1400, margin: '0 auto' }}>
        <Alert message="Lỗi" description="Không tìm thấy thông tin sân cầu lông này." type="error" showIcon />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: 1400, margin: '0 auto' }}>
      <Title level={2}>Đặt sân: {venue?.name}</Title>
      
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={6}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Card title={<><CalendarOutlined /> Chọn ngày</>}>
              <DatePicker
                style={{ width: '100%' }}
                value={selectedDate}
                onChange={(date) => date && setSelectedDate(date)}
                disabledDate={(current) => current && current < dayjs().startOf('day')}
                format="DD/MM/YYYY"
                size="large"
              />
            </Card>

            <Alert
              message="Lưu ý"
              description="Slot bạn chọn sẽ được giữ trong 15 phút. Vui lòng hoàn tất thanh toán trong thời gian này."
              type="info"
              showIcon
              icon={<InfoCircleOutlined />}
            />

            <Card title="Quy định đặt sân">
              <ul style={{ paddingLeft: 16, fontSize: 13, color: '#64748b' }}>
                <li>Không hoàn tiền sau khi đã thanh toán.</li>
                <li>Hỗ trợ dời lịch nếu báo trước 24h (liên hệ chủ sân).</li>
                <li>Vui lòng có mặt trước 10 phút để nhận sân.</li>
              </ul>
            </Card>
          </Space>
        </Col>

        <Col xs={24} lg={18}>
          <Card 
            title={`Lịch sân ngày ${selectedDate.format('DD/MM/YYYY')}`}
            bodyStyle={{ padding: '24px 12px' }}
          >
            <BookingGrid 
              venueId={venue.id}
              courts={courts}
              priceRules={priceRules}
              courtNames={courts.map(c => c.name)}
              selectedDate={selectedDate}
              onSelectionChange={handleSelectionChange}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
