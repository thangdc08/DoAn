import { useState, useEffect, useMemo } from 'react';
import { Card, Input, Button, Space, Typography, Select, Slider, Tag, Drawer, Spin, Empty, message, Segmented, Modal } from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  EnvironmentOutlined,
  AimOutlined,
  HomeOutlined,
  StarFilled,
  CompassOutlined,
  PlayCircleOutlined,
  CloseOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline, useMap, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { venueApi } from '../../services/venueApi';
import { BRAND } from '../../theme/antdTheme';
import type { Venue } from '../../types/venue.types';

const { Text, Title } = Typography;

// Fix Leaflet default marker icon
delete ((L.Icon as any).Default.prototype as any)._getIconUrl;
(L.Icon as any).Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom venue marker icon displaying rating score inside
const createVenueIcon = (rating: number = 0, isSelected: boolean = false): L.DivIcon => {
  const color = rating >= 4.5 ? '#10b981' : rating >= 4.0 ? '#3b82f6' : rating >= 3.5 ? '#f59e0b' : '#ef4444';
  const scale = isSelected ? 'scale(1.15)' : 'scale(1)';
  const zIndex = isSelected ? 9999 : 1000;

  return L.divIcon({
    className: 'custom-venue-marker',
    html: `
      <div style="
        position: relative;
        transform: ${scale};
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: ${zIndex};
      ">
        <div style="
          background: ${isSelected ? BRAND.primary : color};
          width: 38px;
          height: 38px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 2.5px solid white;
          box-shadow: 0 4px 10px rgba(0,0,0,0.18), 0 0 0 3px ${isSelected ? 'rgba(0, 168, 84, 0.25)' : 'rgba(0,0,0,0.05)'};
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            transform: rotate(45deg);
            color: white;
            font-size: 11px;
            font-weight: 800;
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            ${rating > 0 ? rating.toFixed(1) : '🏸'}
          </div>
        </div>
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

const DEFAULT_CENTER: [number, number] = [10.762622, 106.660172]; // TP.HCM center

const LCircle = Circle as any;
const LPolyline = Polyline as any;

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
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px;">
            <style>
              @keyframes locationPulse {
                0% {
                  transform: scale(0.5);
                  opacity: 1;
                }
                100% {
                  transform: scale(2.4);
                  opacity: 0;
                }
              }
            </style>
            <!-- Pulsating Halo -->
            <div style="
              position: absolute;
              width: 32px;
              height: 32px;
              border-radius: 50%;
              border: 2px solid #2563eb;
              background: rgba(37, 99, 235, 0.15);
              animation: locationPulse 2s infinite cubic-bezier(0.165, 0.84, 0.44, 1);
              z-index: 1;
            "></div>
            <!-- Inner Glowing Dot -->
            <div style="
              background: #2563eb;
              width: 16px;
              height: 16px;
              border-radius: 50%;
              border: 3px solid white;
              box-shadow: 0 4px 12px rgba(37, 99, 235, 0.5), 0 0 0 2px rgba(37, 99, 235, 0.2);
              z-index: 2;
            "></div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      })}
    />
  ) : null;
}

// Map controller for initial focus, user locate action, and selected venue panning
function MapController({ 
  userLocation, 
  selectedVenue, 
  recenterCount 
}: { 
  userLocation: [number, number] | null; 
  selectedVenue: Venue | null;
  recenterCount: number;
}) {
  const map = useMap() as any;
  const [hasCenteredOnStart, setHasCenteredOnStart] = useState(false);

  // Auto-focus on start when userLocation is first retrieved
  useEffect(() => {
    if (userLocation && !hasCenteredOnStart) {
      map.setView(userLocation, 13);
      setHasCenteredOnStart(true);
    }
  }, [userLocation, map, hasCenteredOnStart]);

  // Recenter when the target trigger count changes
  useEffect(() => {
    if (recenterCount > 0 && userLocation) {
      map.setView(userLocation, 13);
    }
  }, [recenterCount, userLocation, map]);

  // Focus on selected venue
  useEffect(() => {
    if (selectedVenue?.latitude && selectedVenue?.longitude) {
      map.setView([selectedVenue.latitude, selectedVenue.longitude], 14);
    }
  }, [selectedVenue, map]);

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
  const [recenterCount, setRecenterCount] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Position Permission Modal state
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [locationStatus, setLocationStatus] = useState<'prompt' | 'granted' | 'denied' | 'unsupported'>('prompt');

  // Handle screen resizing
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  // Handle Geolocation Authorization
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus('unsupported');
      return;
    }

    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'geolocation' as PermissionName }).then((permissionStatus) => {
        setLocationStatus(permissionStatus.state);
        if (permissionStatus.state === 'prompt') {
          setLocationModalOpen(true);
        } else if (permissionStatus.state === 'granted') {
          requestActualLocation(true);
        }

        permissionStatus.onchange = () => {
          setLocationStatus(permissionStatus.state);
          if (permissionStatus.state === 'granted') {
            requestActualLocation(false);
          }
        };
      }).catch(() => {
        // Fallback
        requestActualLocation(true);
      });
    } else {
      requestActualLocation(true);
    }
  }, []);

  const requestActualLocation = (silent = false) => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
        setLocationStatus('granted');
        if (!silent) {
          message.success('Định vị thành công! 📍');
        }
      },
      (err) => {
        console.warn('Geolocation error:', err);
        if (err.code === err.PERMISSION_DENIED) {
          setLocationStatus('denied');
          if (!silent) {
            message.warning('Truy cập vị trí bị từ chối. Bạn có thể cấp lại quyền ở góc thanh địa chỉ trình duyệt.');
          }
        }
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

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
      .sort((a, b) => (a.distance || 9999) - (b.distance || 9999));
  }, [filteredVenues, userLocation]);

  const handleVenueSelect = (venue: Venue) => {
    setSelectedVenue(venue);
    if (isMobile) setMobileDrawerOpen(false);
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

  // Render venue card with beautiful glassmorphism/shadow effects
  const renderVenueCard = (venue: Venue & { distance?: number | null }) => {
    const isSelected = selectedVenue?.id === venue.id;
    return (
      <Card
        key={venue.id}
        hoverable
        bodyStyle={{ padding: 14 }}
        style={{
          borderRadius: 16,
          border: isSelected ? `2.5px solid ${BRAND.primary}` : '1px solid #f1f5f9',
          boxShadow: isSelected 
            ? '0 8px 24px rgba(0, 168, 84, 0.12)' 
            : '0 2px 8px rgba(0,0,0,0.03)',
          marginBottom: 12,
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          background: isSelected ? '#f6fdf9' : '#fff',
        }}
        onClick={() => handleVenueSelect(venue)}
      >
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ 
            width: 84, 
            height: 84, 
            borderRadius: 12, 
            overflow: 'hidden', 
            flexShrink: 0,
            boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
          }}>
            <img
              src={venue.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=120&auto=format&fit=crop&q=60'}
              alt={venue.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
              className="hover:scale-110"
            />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Title level={5} style={{ 
              margin: '0 0 4px', 
              fontSize: 13.5, 
              fontWeight: 700, 
              whiteSpace: 'nowrap', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis',
              color: '#0f172a'
            }}>
              {venue.name}
            </Title>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
              <StarFilled style={{ color: '#f59e0b', fontSize: 11 }} />
              <Text strong style={{ fontSize: 12, color: '#1e293b' }}>{venue.ratingAvg?.toFixed(1) || '0.0'}</Text>
              <Text type="secondary" style={{ fontSize: 11 }}>({venue.ratingCount || 0})</Text>
              {venue.distance !== null && venue.distance !== undefined && (
                <Tag color="success" style={{ 
                  fontSize: 10, 
                  marginLeft: 6, 
                  border: 'none', 
                  borderRadius: 6,
                  fontWeight: 600,
                  background: '#e2fbe8', 
                  color: '#10b981'
                }}>
                  📍 {venue.distance.toFixed(1)} km
                </Tag>
              )}
            </div>

            <Space direction="vertical" size={2} style={{ width: '100%' }}>
              <div style={{ display: 'flex', gap: 4, alignItems: 'flex-start' }}>
                <EnvironmentOutlined style={{ color: '#94a3b8', fontSize: 11, marginTop: 2, flexShrink: 0 }} />
                <Text type="secondary" style={{ 
                  fontSize: 11, 
                  lineHeight: 1.3, 
                  display: '-webkit-box', 
                  WebkitLineClamp: 1, 
                  WebkitBoxOrient: 'vertical', 
                  overflow: 'hidden',
                  color: '#64748b'
                }}>
                  {venue.address}
                </Text>
              </div>
              {venue.priceMin && (
                <div style={{ display: 'flex', gap: 4, marginTop: 2 }}>
                  <Text strong style={{ color: BRAND.primary, fontSize: 12 }}>
                    {venue.priceMin.toLocaleString('vi-VN')}đ - {venue.priceMax?.toLocaleString('vi-VN') || '...'}đ
                  </Text>
                  <Text type="secondary" style={{ fontSize: 10, alignSelf: 'flex-end' }}>/ giờ</Text>
                </div>
              )}
            </Space>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 8, borderTop: '1px solid #f1f5f9' }}>
          <Button 
            size="small" 
            type="link" 
            style={{ padding: 0, fontWeight: 700, color: '#64748b' }} 
            onClick={(e) => { e.stopPropagation(); handleViewDetails(venue.id); }}
          >
            Chi tiết
          </Button>
          <Button 
            size="small" 
            type="primary" 
            style={{ 
              borderRadius: 8, 
              background: BRAND.primary, 
              border: 'none',
              fontWeight: 600,
              padding: '0 12px'
            }} 
            onClick={(e) => { e.stopPropagation(); handleBookNow(venue.id); }}
          >
            Đặt sân
          </Button>
        </div>
      </Card>
    );
  };

  return (
    <div style={{ height: 'calc(100vh - 72px)', display: 'flex', background: '#fff', overflow: 'hidden' }}>
      
      {/* Geolocation Explanation Modal */}
      <Modal
        open={locationModalOpen}
        onCancel={() => setLocationModalOpen(false)}
        footer={null}
        width={380}
        centered
        styles={{
          body: {
            padding: '28px 24px',
            textAlign: 'center'
          }
        }}
      >
        <div style={{ 
          width: 56, 
          height: 56, 
          borderRadius: '50%', 
          backgroundColor: '#e6f4ea', 
          color: BRAND.primary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          fontSize: 24,
          boxShadow: '0 4px 10px rgba(0, 168, 84, 0.15)'
        }}>
          <CompassOutlined />
        </div>
        <Title level={4} style={{ margin: '0 0 8px', fontWeight: 800, color: '#0f172a' }}>Tìm sân gần bạn?</Title>
        <Text type="secondary" style={{ display: 'block', marginBottom: 24, fontSize: 13, lineHeight: 1.5, color: '#475569' }}>
          Hãy cho phép định vị giúp bạn nhanh chóng tìm thấy các sân cầu lông xung quanh trong bán kính 10km và ước tính khoảng cách chính xác nhất.
        </Text>
        <Space direction="vertical" style={{ width: '100%' }} size={8}>
          <Button 
            type="primary" 
            block 
            size="large" 
            style={{ 
              background: BRAND.primary, 
              border: 'none', 
              borderRadius: 12, 
              fontWeight: 600,
              boxShadow: `0 4px 12px rgba(0, 168, 84, 0.2)`
            }}
            onClick={() => {
              setLocationModalOpen(false);
              requestActualLocation(false);
            }}
          >
            Đồng ý chia sẻ vị trí
          </Button>
          <Button 
            block 
            size="large" 
            style={{ borderRadius: 12, fontWeight: 600 }}
            onClick={() => setLocationModalOpen(false)}
          >
            Để sau, nhập thủ công
          </Button>
        </Space>
      </Modal>

      {/* Desktop Sidebar */}
      {!isMobile && (
        <div style={{ width: 400, height: '100%', borderRight: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', zIndex: 10, background: '#fff' }}>
          <div style={{ padding: '24px 20px', borderBottom: '1px solid #f1f5f9', background: '#fafafa' }}>
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={4} style={{ margin: 0, fontWeight: 800, color: '#0f172a' }}>Tìm kiếm cơ sở</Title>
                <Tag color="blue" style={{ borderRadius: 6, fontWeight: 600, border: 'none', padding: '2px 8px' }}>
                  {venuesWithDistance.length} Sân bóng
                </Tag>
              </div>
              <Input 
                prefix={<SearchOutlined style={{ color: '#94a3b8' }} />} 
                placeholder="Nhập tên sân, địa chỉ tìm kiếm..." 
                size="large" 
                value={searchQuery} 
                onChange={e => setSearchQuery(e.target.value)} 
                style={{ borderRadius: 12, border: '1px solid #cbd5e1', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }} 
                allowClear
              />
              <Button 
                block 
                type="primary" 
                ghost 
                icon={<AimOutlined />} 
                onClick={() => {
                  if (locationStatus === 'denied') {
                    message.warning('Truy cập vị trí đang bị chặn. Vui lòng cho phép truy cập vị trí trên trình duyệt.');
                  } else {
                    requestActualLocation(false);
                  }
                }} 
                style={{ 
                  borderRadius: 12, 
                  fontWeight: 600, 
                  height: 40,
                  border: `1.5px solid ${BRAND.primary}`,
                  color: BRAND.primary
                }}
              >
                Dùng vị trí hiện tại
              </Button>
            </Space>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }} className="custom-scrollbar">
            {venuesWithDistance.length === 0 && !isLoading ? (
              <Empty description="Không có sân nào phù hợp với bộ lọc của bạn." style={{ marginTop: 40 }} />
            ) : (
              venuesWithDistance.map(renderVenueCard)
            )}
          </div>
        </div>
      )}

      {/* Map Content */}
      <div style={{ flex: 1, position: 'relative', height: '100%' }}>
        <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
          <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocationMarker position={userLocation} setUserLocation={setUserLocation} />
          <MapController userLocation={userLocation} selectedVenue={selectedVenue} recenterCount={recenterCount} />
          
          {/* 10km Radius circle of search */}
          {userLocation && (
            <LCircle
              center={userLocation}
              radius={10000}
              pathOptions={{
                color: '#2563eb',
                fillColor: '#2563eb',
                fillOpacity: 0.03,
                weight: 1.5,
                dashArray: '6, 12'
              }}
            />
          )}
          
          {/* Polyline path between user and selected venue */}
          {userLocation && selectedVenue?.latitude && selectedVenue?.longitude && (
            <LPolyline
              positions={[userLocation, [selectedVenue.latitude, selectedVenue.longitude]]}
              pathOptions={{
                color: BRAND.primary,
                weight: 3.5,
                dashArray: '6, 10',
                opacity: 0.75
              }}
            />
          )}
          
          {/* Venue Markers */}
          {venuesWithDistance.map(venue => venue.latitude && venue.longitude && (
            <Marker 
              key={venue.id} 
              position={[venue.latitude, venue.longitude]} 
              icon={createVenueIcon(venue.ratingAvg || 0, selectedVenue?.id === venue.id)} 
              eventHandlers={{ click: () => handleVenueSelect(venue) }}
            >
              <Popup>
                <div style={{ minWidth: 260, maxWidth: 300, padding: '2px' }}>
                  <div style={{ 
                    marginBottom: 10, 
                    borderRadius: 8, 
                    overflow: 'hidden', 
                    height: 110,
                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                  }}>
                    <img 
                      src={venue.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=280&auto=format&fit=crop&q=60'} 
                      alt={venue.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  </div>
                  <Title level={5} style={{ margin: '0 0 6px', fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{venue.name}</Title>
                  <Space direction="vertical" size={4} style={{ width: '100%', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <StarFilled style={{ color: '#f59e0b', fontSize: 12 }} />
                      <Text strong style={{ fontSize: 12 }}>{venue.ratingAvg?.toFixed(1) || '0.0'}</Text>
                      <Text type="secondary" style={{ fontSize: 11 }}>({venue.ratingCount || 0} đánh giá)</Text>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 4 }}>
                      <EnvironmentOutlined style={{ color: '#94a3b8', fontSize: 11, marginTop: 2, flexShrink: 0 }} />
                      <Text style={{ fontSize: 11, lineHeight: 1.4, color: '#475569' }}>{venue.address}</Text>
                    </div>
                    {venue.priceMin && (
                      <Text strong style={{ color: BRAND.primary, fontSize: 13 }}>
                        {venue.priceMin.toLocaleString('vi-VN')}đ - {venue.priceMax?.toLocaleString('vi-VN') || '...'}đ / giờ
                      </Text>
                    )}
                  </Space>
                  <div style={{ display: 'flex', gap: 8, borderTop: '1px solid #f1f5f9', paddingTop: 8 }}>
                    <Button 
                      size="small" 
                      type="primary" 
                      icon={<PlayCircleOutlined />} 
                      style={{ flex: 1, background: BRAND.primary, border: 'none', borderRadius: 6, fontWeight: 600 }} 
                      onClick={() => handleBookNow(venue.id)}
                    >
                      Đặt sân
                    </Button>
                    <Button 
                      size="small" 
                      style={{ borderRadius: 6 }} 
                      onClick={() => handleViewDetails(venue.id)}
                    >
                      Chi tiết
                    </Button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Floating Controls Overlay */}
        <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 1000, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Button 
            icon={<AimOutlined />} 
            size="large" 
            style={{ 
              borderRadius: 12, 
              boxShadow: '0 4px 12px rgba(15,23,42,0.1)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              border: 'none',
              background: '#fff'
            }} 
            onClick={() => { 
              if (userLocation) {
                setSelectedVenue(null);
                setRecenterCount(prev => prev + 1);
              } else { 
                requestActualLocation(false);
              } 
            }} 
            title="Vị trí của tôi" 
          />
          <Button 
            icon={<HomeOutlined />} 
            size="large" 
            style={{ 
              borderRadius: 12, 
              boxShadow: '0 4px 12px rgba(15,23,42,0.1)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              border: 'none',
              background: '#fff'
            }} 
            onClick={() => { 
              setUserLocation(null); 
              setSelectedVenue(null); 
            }} 
            title="Về mặc định" 
          />
        </div>

        <div style={{ position: 'absolute', top: 20, right: 20, zIndex: 1000 }}>
          <Button 
            icon={<FilterOutlined />} 
            size="large" 
            style={{ 
              borderRadius: 12, 
              boxShadow: '0 4px 12px rgba(15,23,42,0.1)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              border: 'none'
            }} 
            onClick={() => setShowFilters(!showFilters)} 
            type={showFilters ? 'primary' : 'default'} 
          />
        </div>

        {/* Beautiful Filter Panel */}
        {showFilters && (
          <div style={{ 
            position: 'absolute', 
            top: 80, 
            right: 20, 
            width: 'calc(100vw - 40px)', 
            maxWidth: 320, 
            maxHeight: 'calc(100vh - 160px)', 
            overflowY: 'auto', 
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(16px)',
            borderRadius: 20, 
            padding: 20, 
            boxShadow: '0 20px 40px rgba(15, 23, 42, 0.12)', 
            border: '1px solid rgba(226, 232, 240, 0.8)',
            zIndex: 1000,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FilterOutlined style={{ color: BRAND.primary, fontSize: 16 }} />
                <Title level={5} style={{ margin: 0, fontWeight: 800, color: '#0f172a' }}>Bộ lọc tìm kiếm</Title>
              </div>
              <Button 
                type="text" 
                shape="circle" 
                size="small" 
                icon={<CloseOutlined style={{ color: '#64748b', fontSize: 12 }} />} 
                onClick={() => setShowFilters(false)} 
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}
              />
            </div>
            
            <Space direction="vertical" size={20} style={{ width: '100%' }}>
              <div>
                <Text strong style={{ fontSize: 13, color: '#1e293b', display: 'block', marginBottom: 8 }}>Thành phố</Text>
                <Select 
                  style={{ width: '100%' }} 
                  placeholder="Tất cả thành phố" 
                  value={cityFilter || undefined} 
                  onChange={setCityFilter} 
                  allowClear
                  size="middle"
                  dropdownStyle={{ borderRadius: 12 }}
                >
                  {MOCK_CITIES.map(city => <Select.Option key={city.value} value={city.value}>{city.label}</Select.Option>)}
                </Select>
              </div>

              <div>
                <Text strong style={{ fontSize: 13, color: '#1e293b', display: 'block', marginBottom: 10 }}>Đánh giá tối thiểu</Text>
                <Segmented
                  block
                  value={ratingFilter.toString()}
                  onChange={(val) => setRatingFilter(Number(val))}
                  options={[
                    { label: 'Tất cả', value: '0' },
                    { label: '3★+', value: '3' },
                    { label: '4★+', value: '4' },
                    { label: '4.5★+', value: '4.5' }
                  ]}
                  style={{ background: '#f1f5f9', borderRadius: 10, padding: 3 }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <Text strong style={{ fontSize: 13, color: '#1e293b' }}>Mức giá (mỗi giờ)</Text>
                  <Tag color="success" style={{ borderRadius: 6, margin: 0, fontWeight: 600, border: 'none', background: '#e2fbe8', color: '#10b981' }}>
                    {priceRange[0] === 0 ? '0đ' : `${(priceRange[0]/1000)}k`} - {priceRange[1] >= 500000 ? '500k+' : `${(priceRange[1]/1000)}k`}
                  </Tag>
                </div>
                <Slider 
                  range 
                  min={0} 
                  max={500000} 
                  step={10000} 
                  value={priceRange} 
                  onChange={(val) => setPriceRange(val as [number, number])} 
                  tooltip={{ formatter: (v) => `${v?.toLocaleString()}đ` }}
                  style={{ margin: '8px 8px 16px 8px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <Button 
                  block 
                  style={{ borderRadius: 12, height: 40, fontWeight: 600 }}
                  onClick={() => {
                    setCityFilter('');
                    setRatingFilter(0);
                    setPriceRange([0, 500000]);
                  }}
                >
                  Xóa lọc
                </Button>
                <Button 
                  type="primary" 
                  block 
                  style={{ 
                    borderRadius: 12, 
                    height: 40, 
                    fontWeight: 600,
                    background: BRAND.primary,
                    border: 'none',
                    boxShadow: `0 4px 14px rgba(0, 168, 84, 0.3)`
                  }} 
                  onClick={() => setShowFilters(false)}
                >
                  Áp dụng
                </Button>
              </div>
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
        width="85%"
        styles={{ body: { padding: '16px 12px' } }}
        extra={<Button icon={<FilterOutlined />} type={showFilters ? 'primary' : 'default'} onClick={() => setShowFilters(!showFilters)} />}
      >
        <div style={{ marginBottom: 16 }}>
          <Input placeholder="Tìm kiếm sân..." prefix={<SearchOutlined />} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} allowClear style={{ borderRadius: 10 }} />
        </div>
        <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
          <Select style={{ flex: 1 }} placeholder="Thành phố" value={cityFilter || undefined} onChange={setCityFilter} allowClear dropdownStyle={{ borderRadius: 10 }}>
            {MOCK_CITIES.map(city => <Select.Option key={city.value} value={city.value}>{city.label}</Select.Option>)}
          </Select>
        </div>
        {venuesWithDistance.length === 0 ? (
          <Empty description="Không tìm thấy sân nào" />
        ) : (
          <div style={{ height: 'calc(100vh - 220px)', overflowY: 'auto' }}>
            {venuesWithDistance.map(renderVenueCard)}
          </div>
        )}
      </Drawer>

      {/* Mobile Toggle Trigger Button */}
      {isMobile && (
        <Button 
          icon={<EnvironmentOutlined />} 
          size="large" 
          style={{ 
            position: 'absolute', 
            bottom: 24, 
            right: 24, 
            borderRadius: '50%', 
            width: 56, 
            height: 56, 
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)', 
            zIndex: 1000,
            background: BRAND.primary,
            color: '#fff',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }} 
          onClick={() => setMobileDrawerOpen(true)} 
          type="primary" 
        />
      )}
    </div>
  );
}
