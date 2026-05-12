import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, Row, Col, DatePicker, Typography, Alert, Space } from 'antd';
import { CalendarOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { mockVenues, mockCourts } from '../../data/mockVenues';
import BookingGrid from '../../components/ui/BookingGrid';
import dayjs, { Dayjs } from 'dayjs';

const { Title } = Typography;

export default function BookingPage() {
  const [searchParams] = useSearchParams();
  const venueId = searchParams.get('venueId') || '1';

  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const venue = mockVenues.find(v => v.id === venueId);
  const courts = mockCourts[venueId] || [];

  const handleSelectionChange = (slots: string[]) => {
    console.log('Selected slots:', slots);
  };

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
              courtNames={courts.map(c => c.name)}
              pricePerSlot={venue?.priceMin}
              onSelectionChange={handleSelectionChange}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
