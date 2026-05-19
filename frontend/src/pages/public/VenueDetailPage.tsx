import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Typography, Button, Tag, Image, Space, Divider, Spin } from 'antd';
import { EnvironmentOutlined, PhoneOutlined, ClockCircleOutlined, StarFilled, CalendarOutlined, DollarOutlined } from '@ant-design/icons';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';
import BookingGrid from '../../components/ui/BookingGrid';
import { useQuery } from '@tanstack/react-query';
import { venueApi } from '../../services/venueApi';
import dayjs from 'dayjs';
import { UTILITIES } from '../../constants/venue.constants';
import { AREA_MAP } from '../../constants/areas';

// Leaflet default marker icon fix under Vite
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = (L as any).icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIconRetina,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
(L as any).Marker.prototype.options.icon = DefaultIcon;

const { Title, Paragraph } = Typography;

export default function VenueDetailPage() {
  const { venueId } = useParams<{ venueId: string }>();
  const navigate = useNavigate();

  // Fetch actual venue details
  const { data: venue, isLoading: isLoadingVenue } = useQuery({
    queryKey: ['venue', venueId],
    queryFn: () => venueApi.getVenueById(venueId!),
    enabled: !!venueId,
  });

  // Fetch venue courts (filter out INACTIVE ones for public view)
  const { data: courts = [], isLoading: isLoadingCourts } = useQuery({
    queryKey: ['courts', venueId],
    queryFn: async () => {
      const allCourts = await venueApi.getVenueCourts(venueId!);
      return allCourts.filter(c => c.status !== 'INACTIVE');
    },
    enabled: !!venueId,
  });

  const { data: priceRules = [], isLoading: isLoadingPriceRules } = useQuery({
    queryKey: ['price-rules', venueId],
    queryFn: () => venueApi.getPriceRules(venueId!),
    enabled: !!venueId,
  });

  if (isLoadingVenue || isLoadingCourts || isLoadingPriceRules) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Spin size="large" tip="Đang tải thông tin chi tiết sân..." />
      </div>
    );
  }

  if (!venue) {
    return <div style={{ padding: '24px' }}>Không tìm thấy sân</div>;
  }

  const dayNames = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

  const courtPrices = courts
    .map((court) => court.defaultPrice)
    .filter((price): price is number => price !== undefined && price !== null);
  const averageCourtPrice = courtPrices.length > 0
    ? courtPrices.reduce((total, price) => total + Number(price), 0) / courtPrices.length
    : courts.find((court) => court.defaultPrice !== undefined)?.defaultPrice;
  const formattedAverageCourtPrice = averageCourtPrice !== undefined && averageCourtPrice !== null
    ? `${Math.round(averageCourtPrice).toLocaleString('vi-VN')}đ / giờ`
    : null;

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
                venueId={venue.id}
                courts={courts}
                priceRules={priceRules}
                courtNames={courts.map(c => c.name)}
                selectedDate={dayjs()}
              />
            </div>
            <div style={{ textAlign: 'center', marginTop: 16, padding: '0 12px' }}>
              <Button type="link" onClick={() => navigate(`/booking?venueId=${venue.id}`)}>
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
                      <Tag color={court.status === 'ACTIVE' ? 'green' : court.status === 'MAINTENANCE' ? 'orange' : 'red'}>
                        {court.status === 'ACTIVE' ? 'Đang hoạt động' : court.status === 'MAINTENANCE' ? 'Đang bảo trì' : 'Ngừng hoạt động'}
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
                  {(venue.ratingAvg || 0).toFixed(1)}
                </span>
                <span style={{ color: '#8c8c8c', marginLeft: 8 }}>
                  ({venue.ratingCount || 0} đánh giá)
                </span>
              </div>

              {formattedAverageCourtPrice && (
                <div>
                  <DollarOutlined style={{ color: '#00a651', marginRight: 8 }} />
                  <span style={{ fontWeight: 'bold' }}>Giá trung bình: </span>
                  <span style={{ color: '#00a651', fontWeight: 'bold' }}>
                    {formattedAverageCourtPrice}
                  </span>
                </div>
              )}

              <Divider style={{ margin: '12px 0' }} />

              <div>
                <EnvironmentOutlined style={{ marginRight: 8 }} />
                {venue.address}
                {venue.ward && AREA_MAP[venue.ward] ? `, ${AREA_MAP[venue.ward]}` : ''}
                {venue.city && AREA_MAP[venue.city] ? `, ${AREA_MAP[venue.city]}` : ''}
              </div>

              {venue.phone && (
                <div>
                  <PhoneOutlined style={{ marginRight: 8 }} />
                  {venue.phone}
                </div>
              )}

              <Divider style={{ margin: '12px 0' }} />

              {/* Business Hours */}
              {venue.businessHours && venue.businessHours.length > 0 ? (
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
              ) : (
                (venue.openTime || venue.closeTime) && (
                  <div>
                    <div style={{ fontWeight: 'bold', marginBottom: 8 }}>
                      <ClockCircleOutlined style={{ marginRight: 8 }} />
                      Giờ hoạt động
                    </div>
                    <div style={{ marginLeft: 24, fontSize: 14 }}>
                      {venue.openTime || '06:00'} - {venue.closeTime || '22:00'}
                    </div>
                  </div>
                )
              )}

              <Divider style={{ margin: '12px 0' }} />

              {/* Amenities / Utilities */}
              {((venue.utilities && venue.utilities.length > 0) || (venue.amenities && venue.amenities.length > 0)) && (
                <div>
                  <div style={{ fontWeight: 'bold', marginBottom: 8 }}>Tiện ích</div>
                  <Space wrap>
                    {venue.amenities?.map((amenity) => (
                      <Tag key={amenity.id}>{amenity.icon} {amenity.name}</Tag>
                    ))}
                    {venue.utilities?.map((utilityKey, idx) => {
                      const ut = UTILITIES.find(u => u.value === utilityKey.toLowerCase() || u.label.toLowerCase() === utilityKey.toLowerCase());
                      return (
                        <Tag key={idx}>
                          {ut ? (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              {ut.icon}
                              <span>{ut.label}</span>
                            </span>
                          ) : (
                            utilityKey
                          )}
                        </Tag>
                      );
                    })}
                  </Space>
                </div>
              )}

              <Button
                type="primary"
                size="large"
                block
                icon={<CalendarOutlined />}
                onClick={() => navigate(`/booking?venueId=${venue.id}`)}
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
