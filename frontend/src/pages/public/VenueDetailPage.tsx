import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Typography, Button, Tag, Image, Space, Divider, Spin, Rate, Empty, Avatar, Breadcrumb } from 'antd';
import { 
  EnvironmentOutlined, 
  PhoneOutlined, 
  ClockCircleOutlined, 
  StarFilled, 
  CalendarOutlined, 
  DollarOutlined, 
  CompassOutlined, 
  ArrowLeftOutlined,
  CheckCircleOutlined,
  HeartOutlined
} from '@ant-design/icons';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';
import BookingGrid from '../../components/ui/BookingGrid';
import { useQuery } from '@tanstack/react-query';
import { venueApi } from '../../services/venueApi';
import dayjs from 'dayjs';
import { UTILITIES } from '../../constants/venue.constants';
import { AREA_MAP } from '../../constants/areas';
import { BRAND } from '../../theme/antdTheme';

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

const { Title, Paragraph, Text } = Typography;

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

  const { data: ratingsData, isLoading: isLoadingRatings } = useQuery({
    queryKey: ['venue-ratings', venueId],
    queryFn: () => venueApi.getVenueRatings(venueId!, { page: 0, size: 20 }),
    enabled: !!venueId,
  });

  if (isLoadingVenue || isLoadingCourts || isLoadingPriceRules) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '500px' }}>
        <Spin size="large" tip="Đang tải thông tin chi tiết sân..." />
      </div>
    );
  }

  if (!venue) {
    return (
      <div style={{ padding: '40px 24px', maxWidth: '1240px', margin: '0 auto', textAlign: 'center' }}>
        <Empty description="Không tìm thấy thông tin sân cầu lông" />
        <Button type="primary" onClick={() => navigate('/venues')} style={{ marginTop: 16 }}>
          Quay lại danh sách sân
        </Button>
      </div>
    );
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

  // Google Maps directions URL
  const googleMapsUrl = venue.latitude && venue.longitude
    ? `https://www.google.com/maps/dir/?api=1&destination=${venue.latitude},${venue.longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.name + ' ' + venue.address)}`;

  return (
    <div style={{ padding: '32px 24px 60px', maxWidth: '1240px', margin: '0 auto', minHeight: '80vh' }}>
      
      {/* Navigation Breadcrumb & Back button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Space size="large">
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/venues')}
            style={{ borderRadius: 10, fontWeight: 600 }}
          >
            Quay lại
          </Button>
          <Breadcrumb separator=">">
            <Breadcrumb.Item onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Trang chủ</Breadcrumb.Item>
            <Breadcrumb.Item onClick={() => navigate('/venues')} style={{ cursor: 'pointer' }}>Danh sách sân</Breadcrumb.Item>
            <Breadcrumb.Item>{venue.name}</Breadcrumb.Item>
          </Breadcrumb>
        </Space>
        
        <Button 
          icon={<HeartOutlined />} 
          style={{ borderRadius: 10, fontWeight: 600 }}
        >
          Yêu thích
        </Button>
      </div>

      <Row gutter={[24, 24]}>
        
        {/* Left Column - Main detailed info */}
        <Col xs={24} lg={16}>
          
          {/* Images Grid */}
          <div style={{ 
            borderRadius: 20, 
            overflow: 'hidden', 
            boxShadow: '0 10px 30px rgba(0,0,0,0.03)', 
            marginBottom: 24,
            border: '1px solid #f1f5f9'
          }}>
            {venue.images && venue.images.length > 0 ? (
              <Image.PreviewGroup>
                <Row gutter={[8, 8]}>
                  <Col span={24}>
                    <Image
                      src={venue.images[0].imageUrl}
                      alt={venue.name}
                      style={{ width: '100%', height: 420, objectFit: 'cover' }}
                    />
                  </Col>
                  {venue.images.slice(1, 5).map((img) => (
                    <Col span={6} key={img.id}>
                      <Image
                        src={img.imageUrl}
                        alt={venue.name}
                        style={{ width: '100%', height: 110, objectFit: 'cover' }}
                      />
                    </Col>
                  ))}
                </Row>
              </Image.PreviewGroup>
            ) : (
              <img
                src="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=1200&auto=format&fit=crop&q=80"
                alt={venue.name}
                style={{ width: '100%', height: 400, objectFit: 'cover' }}
              />
            )}
          </div>

          {/* Description */}
          <Card 
            title={
              <Title level={4} style={{ margin: 0, fontWeight: 800 }}>
                Giới thiệu cơ sở
              </Title>
            }
            style={{ 
              borderRadius: 20, 
              boxShadow: '0 4px 20px rgba(0,0,0,0.02)', 
              border: '1px solid #f1f5f9',
              marginBottom: 24 
            }}
          >
            <Paragraph style={{ fontSize: 14.5, color: '#334155', lineHeight: 1.6, whiteSpace: 'pre-wrap', margin: 0 }}>
              {venue.description || 'Cơ sở hiện chưa cập nhật phần giới thiệu chi tiết.'}
            </Paragraph>
          </Card>

          {/* Courts list */}
          <Card 
            title={
              <Title level={4} style={{ margin: 0, fontWeight: 800 }}>
                Danh sách sân tại cơ sở
              </Title>
            }
            style={{ 
              borderRadius: 20, 
              boxShadow: '0 4px 20px rgba(0,0,0,0.02)', 
              border: '1px solid #f1f5f9',
              marginBottom: 24 
            }}
          >
            <Row gutter={[16, 16]}>
              {courts.map((court) => (
                <Col xs={24} sm={12} md={8} key={court.id}>
                  <Card 
                    size="small" 
                    style={{ 
                      borderRadius: 14, 
                      border: '1px solid #f1f5f9', 
                      background: '#f8fafc',
                      padding: 8
                    }}
                  >
                    <div style={{ fontWeight: 800, fontSize: 14.5, color: '#0f172a', marginBottom: 8 }}>
                      {court.name}
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <Tag color={court.courtType === 'PREMIUM' ? 'gold' : court.courtType === 'VIP' ? 'purple' : 'blue'} style={{ fontWeight: 600 }}>
                        {court.courtType}
                      </Tag>
                      <Tag color={court.status === 'ACTIVE' ? 'green' : court.status === 'MAINTENANCE' ? 'orange' : 'red'} style={{ fontWeight: 600 }}>
                        {court.status === 'ACTIVE' ? 'Đang hoạt động' : court.status === 'MAINTENANCE' ? 'Bảo trì' : 'Ngừng hoạt động'}
                      </Tag>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>

          {/* Preview Schedule */}
          <Card
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <Title level={4} style={{ margin: 0, fontWeight: 800 }}>
                  Xem trước lịch trống (Hôm nay)
                </Title>
                <Tag color="success" style={{ 
                  borderRadius: 6, 
                  fontWeight: 700,
                  background: BRAND.primaryLight,
                  color: BRAND.primaryDark,
                  border: 'none',
                  fontSize: 11
                }}>
                  Đặt sân trực tuyến 24/7
                </Tag>
              </div>
            }
            style={{ 
              borderRadius: 20, 
              boxShadow: '0 4px 20px rgba(0,0,0,0.02)', 
              border: '1px solid #f1f5f9',
              marginBottom: 24 
            }}
            bodyStyle={{ padding: '20px 0' }}
          >
            <div style={{ padding: '0 20px' }}>
              <BookingGrid
                readOnly
                venueId={venue.id}
                courts={courts}
                priceRules={priceRules}
                courtNames={courts.map(c => c.name)}
                selectedDate={dayjs()}
              />
            </div>
            <div style={{ textAlign: 'center', marginTop: 24, padding: '0 20px' }}>
              <Button 
                type="primary" 
                icon={<CalendarOutlined />} 
                onClick={() => navigate(`/booking?venueId=${venue.id}`)}
                size="large"
                style={{
                  borderRadius: 12,
                  background: BRAND.primary,
                  border: 'none',
                  fontWeight: 700,
                  padding: '0 24px',
                  boxShadow: `0 4px 14px rgba(22, 163, 74, 0.25)`
                }}
              >
                Xem chi tiết & Đặt sân ngay
              </Button>
            </div>
          </Card>

          {/* Map Location & Directions */}
          {venue.latitude && venue.longitude && (
            <Card 
              title={
                <Title level={4} style={{ margin: 0, fontWeight: 800 }}>
                  Vị trí địa lý
                </Title>
              }
              extra={
                <Button 
                  type="link" 
                  href={googleMapsUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  icon={<CompassOutlined />}
                  style={{ fontWeight: 700, color: BRAND.primary }}
                >
                  Chỉ đường Google Maps
                </Button>
              }
              style={{ 
                borderRadius: 20, 
                boxShadow: '0 4px 20px rgba(0,0,0,0.02)', 
                border: '1px solid #f1f5f9',
                marginBottom: 24 
              }}
            >
              <div style={{ position: 'relative', height: 350, borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
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
                    <Popup>
                      <div style={{ textAlign: 'center', padding: '4px' }}>
                        <strong style={{ display: 'block', marginBottom: 6, fontSize: 13 }}>{venue.name}</strong>
                        <Button 
                          type="primary" 
                          size="small" 
                          href={googleMapsUrl} 
                          target="_blank"
                          rel="noopener noreferrer"
                          icon={<CompassOutlined />}
                          style={{ fontSize: 11, borderRadius: 6, background: BRAND.primary, border: 'none' }}
                        >
                          Chỉ đường
                        </Button>
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>

                {/* Floating Directions Button on top of Map Container */}
                <Button
                  type="primary"
                  icon={<CompassOutlined />}
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    zIndex: 1000,
                    borderRadius: 10,
                    fontWeight: 700,
                    background: '#ffffff',
                    color: '#0f172a',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                  }}
                  className="hover:!text-green-600 hover:!border-green-600"
                >
                  Mở bản đồ chỉ đường
                </Button>
              </div>
            </Card>
          )}

          {/* Customer Reviews */}
          <Card 
            title={
              <Title level={4} style={{ margin: 0, fontWeight: 800 }}>
                Đánh giá từ khách hàng ({venue.ratingCount || 0})
              </Title>
            }
            style={{ 
              borderRadius: 20, 
              boxShadow: '0 4px 20px rgba(0,0,0,0.02)', 
              border: '1px solid #f1f5f9' 
            }}
          >
            {isLoadingRatings ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '24px' }}>
                <Spin tip="Đang tải đánh giá..." />
              </div>
            ) : !ratingsData || !ratingsData.content || ratingsData.content.length === 0 ? (
              <Empty description="Chưa có đánh giá nào cho sân này" />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {ratingsData.content.map((rating: any) => (
                  <div 
                    key={rating.id} 
                    style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: 12, 
                      paddingBottom: 20, 
                      borderBottom: '1px solid #f1f5f9' 
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Avatar 
                          style={{ 
                            backgroundColor: BRAND.primaryLight, 
                            color: BRAND.primaryDark,
                            fontWeight: 700, 
                            fontSize: 14 
                          }}
                        >
                          {rating.userId ? (rating.userId.substring(0, 2).toUpperCase()) : 'KH'}
                        </Avatar>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>
                            Khách hàng thân thiết
                          </div>
                          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                            {dayjs(rating.createdAt).format('DD/MM/YYYY HH:mm')}
                          </div>
                        </div>
                      </div>
                      <Rate disabled defaultValue={rating.stars} style={{ fontSize: 13 }} />
                    </div>

                    {rating.comment && (
                      <Paragraph style={{ color: '#334155', fontSize: 13.5, whiteSpace: 'pre-wrap', margin: '4px 0 0', lineHeight: 1.5 }}>
                        {rating.comment}
                      </Paragraph>
                    )}

                    {/* Review Images */}
                    {rating.images && rating.images.length > 0 && (
                      <Image.PreviewGroup>
                        <Space size={8} wrap style={{ marginTop: 8 }}>
                          {rating.images.map((imgUrl: string, idx: number) => (
                            <Image
                              key={idx}
                              src={imgUrl}
                              alt={`Review image ${idx + 1}`}
                              style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 10, border: '1px solid #e2e8f0' }}
                            />
                          ))}
                        </Space>
                      </Image.PreviewGroup>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </Col>

        {/* Right Column - Sticky Sidebar */}
        <Col xs={24} lg={8}>
          <div style={{ position: 'sticky', top: 24 }}>
            <Card
              style={{
                borderRadius: 20,
                boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
                border: '1px solid #f1f5f9',
              }}
            >
              <Title level={3} style={{ margin: '0 0 16px', fontWeight: 850, color: '#0f172a', letterSpacing: '-0.5px' }}>
                {venue.name}
              </Title>

              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                
                {/* Rating average */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <StarFilled style={{ color: '#f59e0b', fontSize: 16 }} />
                  <span style={{ fontSize: 20, fontWeight: 800, color: '#1e293b' }}>
                    {(venue.ratingAvg || 0).toFixed(1)}
                  </span>
                  <span style={{ color: '#64748b', fontSize: 13 }}>
                    ({venue.ratingCount || 0} lượt đánh giá)
                  </span>
                </div>

                {/* Price range */}
                {formattedAverageCourtPrice && (
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 12,
                    background: BRAND.primaryLight,
                    padding: '12px 16px',
                    borderRadius: 12
                  }}>
                    <DollarOutlined style={{ color: BRAND.primaryDark, fontSize: 18 }} />
                    <div>
                      <div style={{ fontSize: 11, color: BRAND.primaryDark, fontWeight: 700 }}>GIÁ TRUNG BÌNH</div>
                      <div style={{ color: BRAND.primaryDark, fontWeight: 850, fontSize: 15, marginTop: -2 }}>
                        {formattedAverageCourtPrice}
                      </div>
                    </div>
                  </div>
                )}

                <Divider style={{ margin: '4px 0' }} />

                {/* Direct info list */}
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <EnvironmentOutlined style={{ color: '#94a3b8', fontSize: 16, marginTop: 3 }} />
                    <span style={{ fontSize: 13.5, color: '#334155', lineHeight: 1.4 }}>
                      {venue.address}
                      {venue.ward && AREA_MAP[venue.ward] ? `, ${AREA_MAP[venue.ward]}` : ''}
                      {venue.city && AREA_MAP[venue.city] ? `, ${AREA_MAP[venue.city]}` : ''}
                    </span>
                  </div>

                  {venue.phone && (
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <PhoneOutlined style={{ color: '#94a3b8', fontSize: 16 }} />
                      <span style={{ fontSize: 13.5, color: '#334155' }}>
                        {venue.phone}
                      </span>
                    </div>
                  )}

                  {/* Business Hours */}
                  {venue.businessHours && venue.businessHours.length > 0 ? (
                    <div>
                      <div style={{ fontWeight: 800, marginBottom: 8, fontSize: 13.5, color: '#0f172a' }}>
                        <ClockCircleOutlined style={{ color: '#94a3b8', marginRight: 8 }} />
                        Giờ mở cửa hàng tuần
                      </div>
                      {venue.businessHours.map((hour) => (
                        <div key={hour.id} style={{ display: 'flex', justifyContent: 'space-between', marginLeft: 24, fontSize: 12.5, color: '#475569', marginBottom: 4 }}>
                          <span>{dayNames[hour.dayOfWeek]}:</span>
                          {hour.isClosed ? (
                            <span style={{ color: '#ef4444', fontWeight: 600 }}>Đóng cửa</span>
                          ) : (
                            <span style={{ fontWeight: 600 }}>{hour.openTime} - {hour.closeTime}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    (venue.openTime || venue.closeTime) && (
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <ClockCircleOutlined style={{ color: '#94a3b8', fontSize: 16 }} />
                        <span style={{ fontSize: 13.5, color: '#334155' }}>
                          Giờ hoạt động: {venue.openTime || '06:00'} - {venue.closeTime || '22:00'}
                        </span>
                      </div>
                    )
                  )}
                </Space>

                <Divider style={{ margin: '4px 0' }} />

                {/* Amenities / Utilities */}
                {((venue.utilities && venue.utilities.length > 0) || (venue.amenities && venue.amenities.length > 0)) && (
                  <div>
                    <div style={{ fontWeight: 800, marginBottom: 10, fontSize: 13.5, color: '#0f172a' }}>
                      Cơ sở vật chất & Tiện ích
                    </div>
                    <Space wrap size={6}>
                      {venue.amenities?.map((amenity) => (
                        <Tag key={amenity.id} style={{ borderRadius: 6, fontWeight: 500 }}>
                          {amenity.icon} {amenity.name}
                        </Tag>
                      ))}
                      {venue.utilities?.map((utilityKey, idx) => {
                        const ut = UTILITIES.find(u => u.value === utilityKey.toLowerCase() || u.label.toLowerCase() === utilityKey.toLowerCase());
                        return (
                          <Tag key={idx} style={{ borderRadius: 6, fontWeight: 500, border: '1px solid #cbd5e1' }}>
                            {ut ? (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
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
                  style={{ 
                    marginTop: 16,
                    height: 48,
                    borderRadius: 12,
                    fontWeight: 700,
                    background: BRAND.primary,
                    border: 'none',
                    boxShadow: `0 4px 14px rgba(22, 163, 74, 0.35)`
                  }}
                >
                  Đặt lịch ngay
                </Button>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', marginTop: 8 }}>
                  <CheckCircleOutlined style={{ color: BRAND.primary, fontSize: 13 }} />
                  <Text type="secondary" style={{ fontSize: 11.5 }}>Hỗ trợ hoàn hủy lịch linh hoạt</Text>
                </div>

              </Space>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
}
