import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Typography, Button, Tag, Image, Space, Divider } from 'antd';
import { EnvironmentOutlined, PhoneOutlined, ClockCircleOutlined, StarFilled, CalendarOutlined } from '@ant-design/icons';
import { mockVenues, mockCourts } from '../../data/mockVenues';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import BookingGrid from '../../components/ui/BookingGrid';

const { Title, Paragraph } = Typography;

export default function VenueDetailPage() {
  const { venueId } = useParams<{ venueId: string }>();
  const navigate = useNavigate();

  const venue = mockVenues.find(v => v.id === venueId);
  const courts = mockCourts[venueId!] || [];

  if (!venue) {
    return <div style={{ padding: '24px' }}>Không tìm thấy sân</div>;
  }

  const dayNames = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={[24, 24]}>
        {/* Images */}
        <Col xs={24} lg={16}>
          <Card>
            {venue.images && venue.images.length > 0 ? (
              <Image.PreviewGroup>
                <Row gutter={[8, 8]}>
                  <Col span={24}>
                    <Image
                      src={venue.images[0].imageUrl}
                      alt={venue.name}
                      style={{ width: '100%', height: 400, objectFit: 'cover' }}
                    />
                  </Col>
                  {venue.images.slice(1, 5).map((img) => (
                    <Col span={6} key={img.id}>
                      <Image
                        src={img.imageUrl}
                        alt={venue.name}
                        style={{ width: '100%', height: 100, objectFit: 'cover' }}
                      />
                    </Col>
                  ))}
                </Row>
              </Image.PreviewGroup>
            ) : (
              <img
                src="https://via.placeholder.com/800x400"
                alt={venue.name}
                style={{ width: '100%', height: 400, objectFit: 'cover' }}
              />
            )}
          </Card>

          {/* Description */}
          <Card title="Giới thiệu" style={{ marginTop: 16 }}>
            <Paragraph>{venue.description || 'Chưa có mô tả'}</Paragraph>
          </Card>

          {/* Preview Schedule */}
          <Card
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Xem trước lịch sân (Hôm nay)</span>
                <Tag color="blue">Xem chi tiết để đặt</Tag>
              </div>
            }
            style={{ marginTop: 16 }}
            bodyStyle={{ padding: '12px 0' }}
          >
            <div style={{ padding: '0 12px' }}>
              <BookingGrid
                readOnly
                courtNames={courts.map(c => c.name)}
                pricePerSlot={venue.priceMin}
              />
            </div>
            <div style={{ textAlign: 'center', marginTop: 16, padding: '0 12px' }}>
              <Button type="link" onClick={() => navigate(`/user/booking?venueId=${venue.id}`)}>
                Xem toàn bộ lịch và đặt sân →
              </Button>
            </div>
          </Card>

          {/* Courts */}
          <Card title="Danh sách sân" style={{ marginTop: 16 }}>
            <Row gutter={[16, 16]}>
              {courts.map((court) => (
                <Col xs={24} sm={12} md={8} key={court.id}>
                  <Card size="small">
                    <div style={{ fontWeight: 'bold' }}>{court.name}</div>
                    <div>
                      <Tag color={court.courtType === 'PREMIUM' ? 'gold' : court.courtType === 'VIP' ? 'purple' : 'blue'}>
                        {court.courtType}
                      </Tag>
                      <Tag color={court.status === 'ACTIVE' ? 'green' : 'red'}>
                        {court.status}
                      </Tag>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>

          {/* Map */}
          {venue.latitude && venue.longitude && (
            <Card title="Vị trí" style={{ marginTop: 16 }}>
              <div style={{ height: 300 }}>
                <MapContainer
                  center={[venue.latitude, venue.longitude]}
                  zoom={15}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  />
                  <Marker position={[venue.latitude, venue.longitude]}>
                    <Popup>{venue.name}</Popup>
                  </Marker>
                </MapContainer>
              </div>
            </Card>
          )}
        </Col>

        {/* Sidebar */}
        <Col xs={24} lg={8}>
          <Card>
            <Title level={3}>{venue.name}</Title>

            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div>
                <StarFilled style={{ color: '#faad14', marginRight: 8 }} />
                <span style={{ fontSize: 18, fontWeight: 'bold' }}>
                  {venue.ratingAvg.toFixed(1)}
                </span>
                <span style={{ color: '#8c8c8c', marginLeft: 8 }}>
                  ({venue.ratingCount} đánh giá)
                </span>
              </div>

              <Divider style={{ margin: '12px 0' }} />

              <div>
                <EnvironmentOutlined style={{ marginRight: 8 }} />
                {venue.address}, {venue.ward && `${venue.ward}, `}
                {venue.district}, {venue.city}
              </div>

              {venue.phone && (
                <div>
                  <PhoneOutlined style={{ marginRight: 8 }} />
                  {venue.phone}
                </div>
              )}

              <Divider style={{ margin: '12px 0' }} />

              {/* Business Hours */}
              {venue.businessHours && venue.businessHours.length > 0 && (
                <div>
                  <div style={{ fontWeight: 'bold', marginBottom: 8 }}>
                    <ClockCircleOutlined style={{ marginRight: 8 }} />
                    Giờ mở cửa
                  </div>
                  {venue.businessHours.map((hour) => (
                    <div key={hour.id} style={{ marginLeft: 24, fontSize: 14 }}>
                      {dayNames[hour.dayOfWeek]}: {' '}
                      {hour.isClosed ? (
                        <span style={{ color: '#ff4d4f' }}>Đóng cửa</span>
                      ) : (
                        <span>{hour.openTime} - {hour.closeTime}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <Divider style={{ margin: '12px 0' }} />

              {/* Amenities */}
              {venue.amenities && venue.amenities.length > 0 && (
                <div>
                  <div style={{ fontWeight: 'bold', marginBottom: 8 }}>Tiện ích</div>
                  <Space wrap>
                    {venue.amenities.map((amenity) => (
                      <Tag key={amenity.id}>{amenity.icon} {amenity.name}</Tag>
                    ))}
                  </Space>
                </div>
              )}

              <Button
                type="primary"
                size="large"
                block
                icon={<CalendarOutlined />}
                onClick={() => navigate(`/user/booking?venueId=${venue.id}`)}
                style={{ marginTop: 16 }}
              >
                Đặt sân ngay
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
