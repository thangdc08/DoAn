import React, { useMemo, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, ZoomControl } from 'react-leaflet';
import { Button, Input, Segmented, Typography } from 'antd';
import {
  AimOutlined, AppstoreAddOutlined, BulbOutlined,
  EnvironmentOutlined, FilterOutlined, SearchOutlined, TeamOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { CourtResult } from '../../types/venue.types';
import { createMarkerIcon } from './VenueMapMarker';
import { VenueCard } from './VenueCard';
import { colors } from '../../styles/theme';

const { Text } = Typography;


// ─── Mock venues ──────────────────────────────────────────────────────────

const COURTS: CourtResult[] = [
  {
    id: 'nam-dong',
    name: 'Sân Cầu Lông Nam Đồng',
    address: '2R6G+MW5, Nam Đồng, Đống Đa, Hà Nội',
    district: 'Đống Đa',
    distance: '',
    posts: 0,
    rating: 4.2,
    position: [21.0157, 105.829],
  },
  {
    id: 'nasd',
    name: 'CLB Cầu Lông NASD',
    address: '178 Đường Láng, Nhân Chính, Đống Đa, Hà Nội',
    district: 'Đống Đa',
    distance: '735 m',
    posts: 3,
    rating: 4.7,
    position: [21.0138, 105.8114],
    active: true,
    badge: 3,
  },
  {
    id: 'trong-dong',
    name: 'Sân Cầu Trống Đồng',
    address: '173B Trường Chinh, Khương Mai, Thanh Xuân, Hà Nội',
    district: 'Thanh Xuân',
    distance: '921 m',
    posts: 0,
    rating: 4.4,
    position: [20.9972, 105.8267],
  },
  {
    id: 'black-pink',
    name: 'Sân Cầu Black Pink',
    address: '173B Trường Chinh, Khương Mai, Thanh Xuân, Hà Nội',
    district: 'Thanh Xuân',
    distance: '953 m',
    posts: 0,
    rating: 4.1,
    position: [20.9992, 105.8212],
  },
  {
    id: 'nguyen-xien',
    name: 'TP Badminton 300 Nguyễn Xiển',
    address: '300 Nguyễn Xiển, Thanh Xuân, Hà Nội',
    district: 'Thanh Xuân',
    distance: '1.2 km',
    posts: 2,
    rating: 4.9,
    position: [20.9868, 105.807],
    active: true,
    badge: 2,
  },
];

// Background markers (demo density)
const DENSE_MARKERS: CourtResult[] = Array.from({ length: 80 }, (_, i) => {
  const angle = i * 0.71;
  const ring = 0.012 + (i % 9) * 0.006;
  return {
    id: `m-${i}`,
    name: `Sân cầu lông khu vực ${i + 1}`,
    address: 'Hà Nội, Việt Nam',
    district: i % 2 === 0 ? 'Đống Đa' : 'Thanh Xuân',
    distance: `${(600 + i * 23).toLocaleString('vi-VN')} m`,
    posts: 0,
    rating: 4.0,
    position: [
      21.018 + Math.sin(angle) * ring,
      105.838 + Math.cos(angle * 1.25) * ring * 1.45,
    ],
    active: i % 13 === 0,
    badge: i % 13 === 0 ? (i % 9) + 1 : undefined,
  };
});


// ─── Category options ─────────────────────────────────────────────────────

const CATEGORY_OPTIONS = [
  { label: 'Kèo', value: 'Kèo', icon: <TeamOutlined /> },
  { label: 'Pass sân', value: 'Pass sân', icon: <EnvironmentOutlined /> },
  { label: 'Lớp dạy', value: 'Lớp dạy', icon: <BulbOutlined /> },
  { label: 'CLB', value: 'CLB', icon: <AppstoreAddOutlined /> },
];



// ─── Main component ───────────────────────────────────────────────────────

const VenueList: React.FC = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState<string>('Kèo');
  const [selectedId, setSelectedId] = useState<string>('nasd');
  const [search, setSearch] = useState('');

  const allMarkers = useMemo(() => [...DENSE_MARKERS, ...COURTS], []);
  const selectedCourt = COURTS.find((c) => c.id === selectedId) ?? COURTS[1];

  const filteredCourts = useMemo(() =>
    COURTS.filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.district.toLowerCase().includes(search.toLowerCase()) ||
        c.address.toLowerCase().includes(search.toLowerCase()),
    ),
    [search],
  );

  return (
    <div style={{ height: 'calc(100vh - 72px)', overflow: 'hidden', background: '#fff' }}>
      <div style={{ display: 'grid', height: '100%', gridTemplateColumns: '520px 1fr' }} className="max-md:grid-cols-1">
        {/* ── Sidebar ──────────────────────────────── */}
        <aside
          style={{
            display: 'flex', flexDirection: 'column',
            borderRight: '1px solid #e2e8f0',
            background: '#fafbfc',
            minHeight: 0,
            boxShadow: '4px 0 16px rgba(15,23,42,0.04)',
            zIndex: 10,
          }}
        >
          {/* Category filter */}
          <div style={{ padding: '14px 16px 10px', borderBottom: '1px solid #f1f5f9' }}>
            <Segmented
              value={category}
              onChange={(v) => setCategory(String(v))}
              options={CATEGORY_OPTIONS}
              size="middle"
              block
              style={{ background: '#f1f5f9', borderRadius: 10, padding: 4, fontWeight: 700 }}
            />
          </div>

          {/* Stats + Search */}
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9' }}>
            <Text type="secondary" style={{ fontSize: 13, display: 'block', marginBottom: 10 }}>
              {filteredCourts.length} sân · {COURTS.filter((c) => c.posts > 0).length} kèo khớp · Gần nhất trước
            </Text>
            <Input
              size="large"
              prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
              placeholder="Tìm sân theo tên, địa chỉ, quận..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ borderRadius: 10 }}
              allowClear
            />
          </div>

          {/* Venue list */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filteredCourts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>🔍</div>
                <Text type="secondary">Không tìm thấy sân phù hợp</Text>
              </div>
            ) : (
              filteredCourts.map((court) => (
                <VenueCard
                  key={court.id}
                  court={court}
                  selected={selectedId === court.id}
                  onClick={() => setSelectedId(court.id)}
                  onNavigate={() => navigate(`/venues/${court.id}`)}
                />
              ))
            )}
          </div>
        </aside>

        {/* ── Map ──────────────────────────────────── */}
        <main style={{ position: 'relative', minHeight: 0 }}>
          <MapContainer
            center={selectedCourt.position}
            zoom={13}
            zoomControl={false}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ZoomControl position="topright" />
            {allMarkers.map((court) => (
              <Marker
                key={court.id}
                position={court.position}
                icon={createMarkerIcon(court.active || court.id === selectedId, court.badge)}
              >
                <Popup className="venue-popup">
                  <div style={{ padding: 4 }}>
                    <div style={{ fontWeight: 800, fontSize: 14, color: '#0f172a' }}>{court.name}</div>
                    <div style={{ marginTop: 4, fontSize: 12, color: '#64748b' }}>
                      {court.posts > 0 ? `${court.posts} bài đăng khớp bộ lọc` : 'Sân cầu lông'}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Map overlay buttons */}
          <div style={{ position: 'absolute', left: 16, top: 16, zIndex: 500, display: 'flex', flexWrap: 'wrap', gap: 8, pointerEvents: 'none' }}>
            <Button size="large" icon={<FilterOutlined />}
              style={{ pointerEvents: 'auto', height: 44, borderRadius: 22, fontWeight: 700, border: 0, boxShadow: '0 4px 16px rgba(15,23,42,0.12)', background: '#fff' }}>
              Bộ lọc
            </Button>
            <Button size="large" icon={<EnvironmentOutlined style={{ color: colors.secondary }} />}
              style={{ pointerEvents: 'auto', height: 44, borderRadius: 22, fontWeight: 700, border: 0, boxShadow: '0 4px 16px rgba(15,23,42,0.12)', background: '#fff' }}>
              Khu vực
            </Button>
            <Button shape="circle" size="large" icon={<AimOutlined style={{ color: colors.secondary }} />}
              style={{ pointerEvents: 'auto', height: 44, width: 44, border: 0, boxShadow: '0 4px 16px rgba(15,23,42,0.12)', background: '#fff' }} />
          </div>

          {/* AI assistant CTA */}
          <div
            style={{
              position: 'absolute', bottom: 80, right: 20, zIndex: 500,
              background: 'rgba(15,23,42,0.88)', backdropFilter: 'blur(12px)',
              borderRadius: 20, padding: '14px 20px',
              display: 'flex', alignItems: 'center', gap: 14,
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 12px 32px rgba(15,23,42,0.25)',
              cursor: 'pointer',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.04)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
          >
            <div style={{ width: 40, height: 40, borderRadius: 12, background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
              🤖
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: 800, fontSize: 14 }}>Trợ lý AI</div>
              <div style={{ color: '#4ade80', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Smart Search</div>
            </div>
          </div>

          {/* Install app */}
          <Button type="primary" size="large"
            style={{ position: 'absolute', bottom: 20, right: 20, zIndex: 500, height: 48, borderRadius: 24, fontWeight: 800, fontSize: 14, boxShadow: `0 8px 24px rgba(22,163,74,0.35)` }}>
            📱 Cài app
          </Button>
        </main>
      </div>
    </div>
  );
};

export default VenueList;
