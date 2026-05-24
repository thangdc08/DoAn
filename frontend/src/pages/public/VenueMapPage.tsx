import { useState, useEffect, useMemo } from 'react';
import { Card, Input, Button, Space, Typography, Select, Slider, Tag, Drawer, Spin, Empty, message } from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  EnvironmentOutlined,
  AimOutlined,
  HomeOutlined,
  StarFilled,
  CompassOutlined,
  PlayCircleOutlined,
  CloseOutlined
} from '@ant-design/icons';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { venueApi } from '../../services/venueApi';
import { BRAND } from '../../theme/antdTheme';
import type { Venue } from '../../types/venue.types';

const { Text, Title } = Typography;

// Fix Leaflet default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom venue marker icon
const createVenueIcon = (rating: number = 0, isSelected: boolean = false): L.DivIcon => {
  const color = rating >= 4.5 ? '#10b981' : rating >= 4.0 ? '#3b82f6' : rating >= 3.5 ? '#f59e0b' : '#ef4444';

  return L.divIcon({
    className: 'custom-venue-marker',
    html: `
      <div style="
        background: ${isSelected ? BRAND.primary : color};
        width: 40px;
        height: 40px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
      ">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="white" style="transform: rotate(45deg)">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
        </svg>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
};

const MOCK_CITIES = [
  { value: 'Hồ Chí Minh', label: 'Hồ Chí Minh' },
  { value: 'Hà Nội', label: 'Hà Nội' },
  { value: 'Đà Nẵng', label: 'Đà Nẵng' },
  { value: 'Cần Thơ', label: 'Cần Thơ' },
];

const DEFAULT_CENTER: [number, number] = [10.8231, 106.6297]; // TP.HCM

// Location marker component
function LocationMarker({ position, setUserLocation }: { position?: [number, number]; setUserLocation: (loc: [number, number] | null) => void }) {
  useMapEvents({
    click(e) {
      setUserLocation([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position ? (
    <Marker
      position={position}
      icon={L.divIcon({
        className: 'user-location-marker',
        html: `<div style="
          background: ${BRAND.primary};
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 0 0 6px rgba(59, 130, 246, 0.2);
        "></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      })}
    />
  ) : null;
}

// Zoom to venue component
function ZoomToVenue({ venue }: { venue: Venue | null }) {
  const map = useMap();

  useEffect(() => {
    if (venue?.latitude && venue?.longitude) {
      map.setView([venue.latitude, venue.longitude], 14);
    }
  }, [venue, map]);

  return null;
}

// Calculate distance (Haversine)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function VenueMapPage() {
  const navigate = useNavigate();
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState<string>('');
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
  const [showFilters, setShowFilters] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Fetch venues từ API
  const { data: venues = [], isLoading, error } = useQuery({
    queryKey: ['venues', { search: searchQuery, city: cityFilter }],
    queryFn: async () => {
      const params: any = {
        search: searchQuery || undefined,
        city: cityFilter || undefined,
      };
      return venueApi.getVenues(params);
    },
    staleTime: 5 * 60 * 1000,
  });

  // Get user geolocation on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.log('Geolocation not available:', error.message);
        }
      );
    }
  }, []);

  // Handle API errors
  useEffect(() => {
    if (error) {
      message.error('Không thể tải danh sách sân. Vui lòng thử lại.');
      console.error('Venues fetch error:', error);
    }
  }, [error]);

  // Filter venues
  const filteredVenues = useMemo(() => {
    return venues.filter(venue => {
      if (venue.ratingAvg < ratingFilter) return false;
      if (venue.priceMin && (venue.priceMin < priceRange[0] || venue.priceMin > priceRange[1])) return false;
      if (venue.status !== 'APPROVED' && venue.status !== 'PENDING_APPROVAL') return false;
      return true;
    });
  }, [venues, ratingFilter, priceRange]);

  // Calculate distance + sort
  const venuesWithDistance = useMemo(() => {
    if (!userLocation) return filteredVenues.map(v => ({ ...v, distance: null }));

    return filteredVenues
      .map(venue => {
        if (!venue.latitude || !venue.longitude) return { ...venue, distance: null };
        const distance = calculateDistance(userLocation[0], userLocation[1], venue.latitude, venue.longitude);
        return { ...venue, distance };
      })
      .sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }, [filteredVenues, userLocation]);

  const handleVenueSelect = (venue: Venue) => {
    setSelectedVenue(venue);
    if (window.innerWidth < 768) setMobileDrawerOpen(false);
  };

  const handleBookNow = (venueId: string) => {
    navigate(`/booking?venueId=${venueId}`);
  };

  const handleViewDetails = (venueId: string) => {
    navigate(`/venues/${venueId}`);
  };

  const center: [number, number] = useMemo(() => {
    if (selectedVenue?.latitude && selectedVenue?.longitude) {
      return [selectedVenue.latitude, selectedVenue.longitude];
    }
    if (userLocation) return userLocation;
    return DEFAULT_CENTER;
  }, [selectedVenue, userLocation]);

  // Render venue card
  const renderVenueCard = (venue: Venue & { distance?: number | null }) => (
    <Card
      key={venue.id}
      hoverable
      bodyStyle={{ padding: 16 }}
      style={{
        borderRadius: 16,
        border: selectedVenue?.id === venue.id ? `2px solid ${BRAND.primary}` : '1px solid #f1f5f9',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        marginBottom: 12,
        cursor: 'pointer'
      }}
      onClick={() => handleVenueSelect(venue)}
    >
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ width: 80, height: 80, borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
          <img
            src={venue.images?.[0]?.imageUrl || 'https://via.placeholder.com/80x80?text=No+image'}
            alt={venue.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Title level={5} style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {venue.name}
          </Title>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
            <StarFilled style={{ color: '#f59e0b', fontSize: 12 }} />
            <Text strong style={{ fontSize: 12 }}>{venue.ratingAvg?.toFixed(1) || '0.0'}</Text>
            <Text type="secondary" style={{ fontSize: 11 }}>({venue.ratingCount || 0})</Text>
            {venue.distance && (
              <Tag color="blue" style={{ fontSize: 10, marginLeft: 4 }}>
                {venue.distance.toFixed(1)} km
              </Tag>
            )}
          </div>
          <Space direction="vertical" size={2} style={{ width: '100%' }}>
            <div style={{ display: 'flex', gap: 4, alignItems: 'flex-start' }}>
              <EnvironmentOutlined style={{ color: '#94a3b8', fontSize: 11, marginTop: 2, flexShrink: 0 }} />
              <Text type="secondary" style={{ fontSize: 11, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {venue.address}
              </Text>
            </div>
            {venue.priceMin && (
              <div style={{ display: 'flex', gap: 4 }}>
                <Text strong style={{ color: BRAND.primary, fontSize: 12 }}>
                  {venue.priceMin.toLocaleString()}đ - {venue.priceMax?.toLocaleString() || '...'}đ
                </Text>
              </div>
            )}
          </Space>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 10, borderTop: '1px solid #f1f5f9' }}>
        <Button size="small" type="link" style={{ padding: 0, fontWeight: 600 }} onClick={(e) => { e.stopPropagation(); handleViewDetails(venue.id); }}>
          Chi tiết
        </Button>
        <Button size="small" type="primary" style={{ borderRadius: 8 }} onClick={(e) => { e.stopPropagation(); handleBookNow(venue.id); }}>
          Đặt sân
        </Button>
      </div>
    </Card>
  );

  return (
    <div style={{ height: 'calc(100vh - 72px)', display: 'flex', background: '#fff' }}>
      {/* Desktop Sidebar */}
      {window.innerWidth >= 768 && (
        <div style={{ width: 420, height: '100%', borderRight: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', zIndex: 10, background: '#fff' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #f1f5f9' }}>
            <Space direction="vertical" size={12} style={{ width: '100%' }}>
              <Title level={4} style={{ margin: 0 }}>Tìm sân</Title>
              <Input prefix={<SearchOutlined style={{ color: '#94a3b8' }} />} placeholder="Tên sân, địa chỉ..." size="large" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ borderRadius: 12 }} />
              <Button block type="primary" ghost icon={<CompassOutlined />} onClick={() => { if (navigator.geolocation) { navigator.geolocation.getCurrentPosition((pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]), (err) => message.error('Không thể lấy vị trí: ' + err.message)); } else message.error('Trình duyệt không hỗ trợ geolocation'); }} style={{ borderRadius: 12 }}>
                Dùng vị trí hiện tại
              </Button>
            </Space>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
            <div style={{ marginBottom: 12, padding: '0 4px' }}><Text type="secondary" strong style={{ fontSize: 12 }}>{venuesWithDistance.length} sân</Text></div>
            {venuesWithDistance.length === 0 && !isLoading ? <Empty description="Không tìm thấy sân" /> : venuesWithDistance.map(renderVenueCard)}
          </div>
        </div>
      )}

      {/* Map */}
      <div style={{ flex: 1, position: 'relative' }}>
        <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
          <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocationMarker position={userLocation} setUserLocation={setUserLocation} />
          <ZoomToVenue venue={selectedVenue} />
          {userLocation && selectedVenue?.latitude && selectedVenue?.longitude && (
            <Polyline positions={[userLocation, [selectedVenue.latitude, selectedVenue.longitude]]} color={BRAND.primary} weight={3} dashArray="5, 10" opacity={0.6} />
          )}
          {venuesWithDistance.map(venue => venue.latitude && venue.longitude && (
            <Marker key={venue.id} position={[venue.latitude, venue.longitude]} icon={createVenueIcon(venue.ratingAvg || 0, selectedVenue?.id === venue.id)} eventHandlers={{ click: () => handleVenueSelect(venue) }}>
              <Popup>
                <div style={{ minWidth: 240, maxWidth: 280 }}>
                  <div style={{ marginBottom: 8 }}>
                    <img src={venue.images?.[0]?.imageUrl || 'https://via.placeholder.com/280x120'} alt={venue.name} style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 6 }} />
                  </div>
                  <Title level={5} style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 700 }}>{venue.name}</Title>
                  <Space direction="vertical" size={2} style={{ width: '100%', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><StarFilled style={{ color: '#f59e0b', fontSize: 12 }} /><Text strong style={{ fontSize: 12 }}>{venue.ratingAvg?.toFixed(1) || '0.0'}</Text><Text type="secondary" style={{ fontSize: 11 }}>({venue.ratingCount || 0} đánh giá)</Text></div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 4 }}><EnvironmentOutlined style={{ color: '#94a3b8', fontSize: 11, marginTop: 2 }} /><Text style={{ fontSize: 11, lineHeight: 1.4 }}>{venue.address}</Text></div>
                    {venue.priceMin && <Text strong style={{ color: BRAND.primary, fontSize: 13 }}>{venue.priceMin.toLocaleString()}đ - {venue.priceMax?.toLocaleString() || '...'}đ / giờ</Text>}
                  </Space>
                  <Space style={{ marginTop: 8 }}>
                    <Button size="small" type="primary" icon={<PlayCircleOutlined />} style={{ flex: 1 }} onClick={() => handleBookNow(venue.id)}>Đặt sân</Button>
                    <Button size="small" onClick={() => handleViewDetails(venue.id)}>Chi tiết</Button>
                  </Space>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Controls */}
        <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 1000, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Button icon={<AimOutlined />} size="large" style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} onClick={() => { if (userLocation) setSelectedVenue(null); else if (navigator.geolocation) { navigator.geolocation.getCurrentPosition((pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude])); } }} title="Vị trí của tôi" />
          <Button icon={<HomeOutlined />} size="large" style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} onClick={() => { setUserLocation(null); setSelectedVenue(null); }} title="Về mặc định" />
        </div>

        <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 1000 }}>
          <Button icon={<FilterOutlined />} size="large" style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} onClick={() => setShowFilters(!showFilters)} type={showFilters ? 'primary' : 'default'} />
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div style={{ position: 'absolute', top: 80, right: 16, width: 280, maxHeight: 'calc(100vh - 120px)', overflowY: 'auto', background: 'white', borderRadius: 16, padding: 16, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 1000 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Title level={5} style={{ margin: 0 }}>Bộ lọc</Title>
              <Button type="text" size="small" icon={<CloseOutlined />} onClick={() => setShowFilters(false)} />
            </div>
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              <div>
                <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>Thành phố</Text>
                <Select style={{ width: '100%' }} placeholder="Tất cả" value={cityFilter || undefined} onChange={setCityFilter} allowClear size="small">
                  {MOCK_CITIES.map(city => <Select.Option key={city.value} value={city.value}>{city.label}</Select.Option>)}
                </Select>
              </div>
              <div>
                <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>Đánh giá tối thiểu: {ratingFilter}+</Text>
                <Slider min={0} max={5} step={0.5} value={ratingFilter} onChange={setRatingFilter} marks={{ 0: 'Tất cả', 3: '3', 4: '4', 4.5: '4.5', 5: '5' }} />
              </div>
              <div>
                <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>Giá (k/ca): {priceRange[0].toLocaleString()}đ - {priceRange[1].toLocaleString()}đ</Text>
                <Slider range min={0} max={500000} step={10000} value={priceRange} onChange={(val) => setPriceRange(val as [number, number])} tooltip={{ formatter: (v) => `${v?.toLocaleString()}đ` }} />
              </div>
              <Button type="primary" block size="small" onClick={() => setShowFilters(false)}>Áp dụng</Button>
            </Space>
          </div>
        )}

        {isLoading && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
            <Spin size="large" />
          </div>
        )}
      </div>

      {/* Mobile Drawer */}
      <Drawer
        title={<Space><Text strong>Danh sách sân</Text><Tag color="blue">{venuesWithDistance.length}</Tag></Space>}
        placement="left"
        onClose={() => setMobileDrawerOpen(false)}
        open={mobileDrawerOpen}
        width={400}
        styles={{ body: { padding: 16 } }}
        extra={<Button icon={<FilterOutlined />} type={showFilters ? 'primary' : 'default'} onClick={() => setShowFilters(!showFilters)} />}
      >
        <div style={{ marginBottom: 16 }}>
          <Input placeholder="Tìm kiếm sân..." prefix={<SearchOutlined />} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} allowClear />
        </div>
        <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
          <Select style={{ flex: 1 }} placeholder="Thành phố" value={cityFilter || undefined} onChange={setCityFilter} allowClear size="small">
            {MOCK_CITIES.map(city => <Select.Option key={city.value} value={city.value}>{city.label}</Select.Option>)}
          </Select>
        </div>
        {venuesWithDistance.length === 0 ? <Empty description="Không tìm thấy sân nào" /> : <div style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>{venuesWithDistance.map(renderVenueCard)}</div>}
      </Drawer>

      {/* Mobile Toggle Button */}
      {window.innerWidth < 768 && (
        <Button icon={<EnvironmentOutlined />} size="large" style={{ position: 'absolute', bottom: 24, right: 24, borderRadius: '50%', width: 60, height: 60, boxShadow: '0 4px 16px rgba(0,0,0,0.2)', zIndex: 1000 }} onClick={() => setMobileDrawerOpen(true)} type="primary" />
      )}
    </div>
  );
}
