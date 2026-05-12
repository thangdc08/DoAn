import { useState } from 'react';
import { Card, Input, Button, Space, Typography } from 'antd';
import { 
  SearchOutlined, 
  FilterOutlined, 
  EnvironmentOutlined, 
  AimOutlined,
  HomeOutlined,
  StarFilled,
  ClockCircleOutlined,
  CompassOutlined
} from '@ant-design/icons';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';
import { BRAND } from '../../theme/antdTheme';

const { Text, Title } = Typography;

// Custom marker icon
const customIcon = (L as any).icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const MOCK_VENUES = [
  {
    id: 1,
    name: 'Sân Cầu Lông Thiên Đường',
    address: '142 Bùi Xương Trạch, Thanh Xuân, Hà Nội',
    lat: 20.985,
    lng: 105.825,
    rating: 4.8,
    reviews: 124,
    price: '80k - 150k',
    status: 'Đang mở cửa',
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 2,
    name: 'CLB Cầu Lông Ngôi Sao',
    address: '181 Nguyễn Huy Tưởng, Thanh Xuân, Hà Nội',
    lat: 20.995,
    lng: 105.815,
    rating: 4.5,
    reviews: 89,
    price: '100k - 180k',
    status: 'Sắp đóng cửa',
    image: 'https://images.unsplash.com/photo-1521537634581-0dced2fee2ef?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 3,
    name: 'Trung Tâm Thể Thao Cầu Giấy',
    address: '35 Trần Quý Kiên, Dịch Vọng, Cầu Giấy',
    lat: 21.035,
    lng: 105.795,
    rating: 4.9,
    reviews: 256,
    price: '120k - 200k',
    status: 'Đang mở cửa',
    image: 'https://images.unsplash.com/photo-1611095773767-da21272718f6?q=80&w=2070&auto=format&fit=crop'
  }
];

function SetViewOnClick({ coords }: { coords: [number, number] }) {
  const map = useMap() as any;
  map.setView(coords, 15);
  return null;
}

export default function VenueMapPage() {
  const [selectedVenue, setSelectedVenue] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const center: [number, number] = [21.0285, 105.8542]; // Hà Nội center

  return (
    <div style={{ height: 'calc(100vh - 72px)', display: 'flex', background: '#fff' }}>
      {/* Sidebar */}
      <div style={{ 
        width: 420, 
        height: '100%', 
        borderRight: '1px solid #f1f5f9', 
        display: 'flex', 
        flexDirection: 'column',
        zIndex: 10
      }}>
        <div style={{ padding: '24px', borderBottom: '1px solid #f1f5f9' }}>
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <Button type="primary" shape="round" icon={<EnvironmentOutlined />} style={{ background: BRAND.primary }}>Sân</Button>
              <Button shape="round" icon={<AimOutlined />}>Kèo giao lưu</Button>
              <Button shape="round">Xếp hạng</Button>
            </div>
            
            <Input 
              prefix={<SearchOutlined style={{ color: '#94a3b8' }} />} 
              placeholder="Tìm theo tên sân, địa chỉ, quận..." 
              size="large"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ borderRadius: 12, background: '#f8fafc', border: '1px solid #e2e8f0' }}
            />

            <Button 
              block 
              type="primary" 
              ghost 
              icon={<CompassOutlined />} 
              style={{ borderRadius: 12, height: 44, fontWeight: 700, borderColor: BRAND.sky, color: BRAND.sky }}
            >
              Bật vị trí để xem khoảng cách
            </Button>
          </Space>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          <div style={{ marginBottom: 16, padding: '0 8px' }}>
            <Text type="secondary" strong style={{ fontSize: 13 }}>{MOCK_VENUES.length} sân đang hiển thị</Text>
          </div>

          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            {MOCK_VENUES.map(venue => (
              <Card 
                key={venue.id}
                hoverable
                bodyStyle={{ padding: 16 }}
                style={{ 
                  borderRadius: 20, 
                  border: selectedVenue?.id === venue.id ? `2px solid ${BRAND.primary}` : '1px solid #f1f5f9',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                }}
                onClick={() => setSelectedVenue(venue)}
              >
                <div style={{ display: 'flex', gap: 16 }}>
                  <div style={{ width: 100, height: 100, borderRadius: 12, overflow: 'hidden', flexShrink: 0 }}>
                    <img src={venue.image} alt={venue.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <Title level={5} style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 800 }}>{venue.name}</Title>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                      <StarFilled style={{ color: '#f59e0b', fontSize: 12 }} />
                      <Text strong style={{ fontSize: 13 }}>{venue.rating}</Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>({venue.reviews})</Text>
                    </div>
                    <Space direction="vertical" size={2}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <EnvironmentOutlined style={{ color: '#94a3b8', fontSize: 12, marginTop: 3 }} />
                        <Text type="secondary" style={{ fontSize: 12, lineHeight: 1.4 }}>{venue.address}</Text>
                      </div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <ClockCircleOutlined style={{ color: '#94a3b8', fontSize: 12, marginTop: 3 }} />
                        <Text type="secondary" style={{ fontSize: 12 }}>{venue.status}</Text>
                      </div>
                    </Space>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTop: '1px solid #f1f5f9' }}>
                  <Text strong style={{ color: BRAND.primary }}>{venue.price}</Text>
                  <Button size="small" type="link" style={{ fontWeight: 700, padding: 0 }}>Chi tiết</Button>
                </div>
              </Card>
            ))}
          </Space>
        </div>
      </div>

      {/* Map Area */}
      <div style={{ flex: 1, position: 'relative' }}>
        <MapContainer 
          center={center} 
          zoom={13} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {MOCK_VENUES.map(venue => (
            <Marker 
              key={venue.id} 
              position={[venue.lat, venue.lng]} 
              icon={customIcon}
              eventHandlers={{
                click: () => setSelectedVenue(venue),
              }}
            >
              <Popup>
                <div style={{ width: 200 }}>
                  <img src={venue.image} alt={venue.name} style={{ width: '100%', borderRadius: 8, marginBottom: 8 }} />
                  <Title level={5} style={{ margin: '0 0 4px' }}>{venue.name}</Title>
                  <Text type="secondary" style={{ fontSize: 12 }}>{venue.address}</Text>
                  <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between' }}>
                    <Text strong>{venue.price}</Text>
                    <Button size="small" type="primary">Đặt ngay</Button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {selectedVenue && <SetViewOnClick coords={[selectedVenue.lat, selectedVenue.lng]} />}
        </MapContainer>

        {/* Floating Controls over Map */}
        <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 1000, display: 'flex', gap: 10 }}>
          <Button icon={<FilterOutlined />} size="large" style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontWeight: 700 }}>Bộ lọc</Button>
          <Button icon={<EnvironmentOutlined />} size="large" style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontWeight: 700 }}>Chọn khu vực</Button>
        </div>

        <div style={{ position: 'absolute', top: 20, right: 20, zIndex: 1000, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Button icon={<AimOutlined />} size="large" style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
          <Button icon={<HomeOutlined />} size="large" style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
        </div>

        {/* Zoom Controls Overlay (Simulated) */}
        <div style={{ position: 'absolute', bottom: 40, right: 20, zIndex: 1000, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button style={{ width: 44, height: 44, borderRadius: '12px 12px 0 0', borderBottom: '1px solid #f1f5f9' }}>+</Button>
          <Button style={{ width: 44, height: 44, borderRadius: '0 0 12px 12px' }}>-</Button>
        </div>
      </div>
    </div>
  );
}
