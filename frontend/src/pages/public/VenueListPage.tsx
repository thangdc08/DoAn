import { useState, useMemo } from 'react';
import { Row, Col, Input, Select, Button, Card, Pagination, Empty, Space, Typography, Spin, Tag } from 'antd';
import { SearchOutlined, EnvironmentOutlined, StarFilled, ClockCircleOutlined, DoubleRightOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { venueApi } from '../../services/venueApi';
import { BRAND } from '../../theme/antdTheme';

const { Title, Text } = Typography;
const { Option } = Select;

// Comprehensive district/ward mock data for major Vietnamese cities to make the search complete
const WARD_MAP: Record<string, string[]> = {
  'Hà Nội': [
    'Quận Cầu Giấy',
    'Quận Đống Đa',
    'Quận Thanh Xuân',
    'Quận Ba Đình',
    'Quận Hoàn Kiếm',
    'Quận Hai Bà Trưng',
    'Quận Tây Hồ',
    'Quận Nam Từ Liêm',
    'Quận Hà Đông'
  ],
  'Hồ Chí Minh': [
    'Quận 1',
    'Quận 3',
    'Quận 7',
    'Quận 10',
    'Bình Thạnh',
    'Phú Nhuận',
    'TP. Thủ Đức',
    'Quận Tân Bình',
    'Quận Tân Phú',
    'Quận Gò Vấp'
  ],
  'Đà Nẵng': [
    'Quận Hải Châu',
    'Quận Thanh Khê',
    'Quận Sơn Trà',
    'Quận Ngũ Hành Sơn',
    'Quận Liên Chiểu'
  ],
  'Cần Thơ': [
    'Quận Ninh Kiều',
    'Quận Cái Răng',
    'Quận Bình Thủy',
    'Quận Ô Môn'
  ]
};

export default function VenueListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [ward, setWard] = useState(searchParams.get('ward') || '');
  const [page, setPage] = useState(1);
  const pageSize = 8; // Change to 8 to show pagination control on mock datasets

  // Fetch actual venues from database
  const { data: venues = [], isLoading } = useQuery({
    queryKey: ['venues'],
    queryFn: () => venueApi.getVenues(),
  });

  // Filter fetched data
  const filteredVenues = useMemo(() => {
    return venues.filter(venue => {
      // Allow only APPROVED or PENDING_APPROVAL venues to be shown publicly
      if (venue.status !== 'APPROVED' && venue.status !== 'PENDING_APPROVAL') return false;

      const matchSearch = !search || venue.name.toLowerCase().includes(search.toLowerCase());
      const matchCity = !city || (venue.city && venue.city.toLowerCase() === city.toLowerCase());
      const matchWard = !ward || 
        (venue.ward && venue.ward.toLowerCase() === ward.toLowerCase()) ||
        (venue.address && venue.address.toLowerCase().includes(ward.toLowerCase()));
      return matchSearch && matchCity && matchWard;
    });
  }, [venues, search, city, ward]);

  const data = {
    content: filteredVenues.slice((page - 1) * pageSize, page * pageSize),
    totalElements: filteredVenues.length,
    totalPages: Math.ceil(filteredVenues.length / pageSize),
  };

  const handleSearch = () => {
    setPage(1);
    const params: any = {};
    if (search) params.search = search;
    if (city) params.city = city;
    if (ward) params.ward = ward;
    setSearchParams(params);
  };

  const handleReset = () => {
    setSearch('');
    setCity('');
    setWard('');
    setPage(1);
    setSearchParams({});
  };

  const handleCityChange = (val: string) => {
    setCity(val);
    setWard(''); // Reset ward when city changes
  };

  return (
    <div style={{ padding: '40px 24px', maxWidth: '1240px', margin: '0 auto', minHeight: '80vh' }}>
      
      {/* Header section with badge count */}
      <div style={{ marginBottom: 32, textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <Title level={2} style={{ margin: 0, fontWeight: 850, color: '#0f172a', letterSpacing: '-0.5px' }}>
            Danh sách sân cầu lông
          </Title>
          <Tag color="success" style={{ 
            borderRadius: 8, 
            fontWeight: 700, 
            border: 'none', 
            fontSize: 12,
            padding: '4px 10px',
            background: '#e2fbe8',
            color: '#10b981'
          }}>
            {filteredVenues.length} Cơ sở khả dụng
          </Tag>
        </div>
        <Text type="secondary" style={{ fontSize: 14, color: '#64748b' }}>
          Khám phá và đặt các sân cầu lông chất lượng cao, đầy đủ tiện ích xung quanh bạn.
        </Text>
      </div>

      {/* Modern Filter Card */}
      <Card 
        style={{ 
          marginBottom: 32, 
          borderRadius: 20, 
          boxShadow: '0 8px 30px rgba(0,0,0,0.03)',
          border: '1px solid #f1f5f9',
          padding: '6px'
        }}
      >
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={8}>
            <Input
              placeholder="Tìm theo tên sân..."
              prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onPressEnter={handleSearch}
              size="large"
              style={{ borderRadius: 12, border: '1px solid #cbd5e1' }}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Chọn thành phố"
              style={{ width: '100%' }}
              value={city || undefined}
              onChange={handleCityChange}
              allowClear
              size="large"
              dropdownStyle={{ borderRadius: 12 }}
            >
              <Option value="Hồ Chí Minh">Hồ Chí Minh</Option>
              <Option value="Hà Nội">Hà Nội</Option>
              <Option value="Đà Nẵng">Đà Nẵng</Option>
              <Option value="Cần Thơ">Cần Thơ</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Chọn quận/huyện"
              style={{ width: '100%' }}
              value={ward || undefined}
              onChange={setWard}
              allowClear
              disabled={!city}
              size="large"
              dropdownStyle={{ borderRadius: 12 }}
            >
              {city && WARD_MAP[city]?.map(w => (
                <Option key={w} value={w}>{w}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} md={4}>
            <div style={{ display: 'flex', gap: 10, width: '100%' }}>
              <Button 
                type="primary" 
                icon={<SearchOutlined />} 
                onClick={handleSearch}
                size="large"
                style={{ 
                  borderRadius: 12, 
                  background: BRAND.primary, 
                  border: 'none',
                  fontWeight: 600,
                  flex: 1,
                  boxShadow: `0 4px 14px rgba(0, 168, 84, 0.25)`
                }}
              >
                Tìm
              </Button>
              <Button 
                onClick={handleReset}
                size="large"
                style={{ borderRadius: 12, fontWeight: 600 }}
              >
                Reset
              </Button>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Venue List Content */}
      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '350px' }}>
          <Spin size="large" tip="Đang tải danh sách sân..." />
        </div>
      ) : data.content.length === 0 ? (
        <Empty 
          description={
            <div style={{ textAlign: 'center' }}>
              <Text strong style={{ fontSize: 16, color: '#475569', display: 'block', marginBottom: 4 }}>Không tìm thấy sân cầu lông nào</Text>
              <Text type="secondary">Thử thay đổi từ khóa hoặc bộ lọc tìm kiếm của bạn.</Text>
            </div>
          } 
          style={{ marginTop: 60 }} 
        />
      ) : (
        <>
          <Row gutter={[24, 24]}>
            {data.content.map((venue) => (
              <Col xs={24} sm={12} lg={8} xl={6} key={venue.id}>
                <Card
                  hoverable
                  style={{
                    borderRadius: 20,
                    overflow: 'hidden',
                    border: '1px solid #f1f5f9',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                  className="group hover:-translate-y-1.5 hover:shadow-lg"
                  cover={
                    <div style={{ position: 'relative', height: 180, overflow: 'hidden' }}>
                      <img
                        alt={venue.name}
                        src={venue.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&auto=format&fit=crop&q=80'}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                        className="group-hover:scale-105"
                      />
                      
                      {/* Floating rating badge inside the cover */}
                      <div style={{ 
                        position: 'absolute', 
                        top: 12, 
                        left: 12, 
                        background: 'rgba(255,255,255,0.92)', 
                        backdropFilter: 'blur(8px)',
                        padding: '4px 8px', 
                        borderRadius: 8,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4
                      }}>
                        <StarFilled style={{ color: '#f59e0b', fontSize: 11 }} />
                        <Text strong style={{ fontSize: 11.5, color: '#1e293b' }}>
                          {venue.ratingAvg?.toFixed(1) || '0.0'}
                        </Text>
                        <Text type="secondary" style={{ fontSize: 10 }}>
                          ({venue.ratingCount || 0})
                        </Text>
                      </div>
                    </div>
                  }
                  onClick={() => navigate(`/venues/${venue.id}`)}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                    <div>
                      <Title level={5} style={{ 
                        margin: '0 0 8px', 
                        fontSize: 14.5, 
                        fontWeight: 800,
                        color: '#0f172a',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {venue.name}
                      </Title>
                      
                      <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start', marginBottom: 8 }}>
                        <EnvironmentOutlined style={{ color: '#94a3b8', fontSize: 12, marginTop: 3, flexShrink: 0 }} />
                        <Text type="secondary" style={{ 
                          fontSize: 12, 
                          lineHeight: 1.3, 
                          color: '#64748b',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          height: 31
                        }}>
                          {venue.address}
                        </Text>
                      </div>

                      <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 12 }}>
                        <ClockCircleOutlined style={{ color: '#94a3b8', fontSize: 12 }} />
                        <Text style={{ fontSize: 12, color: '#64748b' }}>
                          Giờ mở cửa: {venue.openTime || '05:00'} - {venue.closeTime || '22:00'}
                        </Text>
                      </div>
                    </div>

                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      borderTop: '1px solid #f1f5f9', 
                      paddingTop: 12,
                      marginTop: 4
                    }}>
                      <div>
                        {venue.priceMin ? (
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <Text strong style={{ color: BRAND.primary, fontSize: 13 }}>
                              {venue.priceMin.toLocaleString('vi-VN')}đ
                            </Text>
                            <Text type="secondary" style={{ fontSize: 9.5, marginTop: -2 }}>Giá từ</Text>
                          </div>
                        ) : (
                          <Text style={{ color: '#10b981', fontWeight: 700, fontSize: 12.5 }}>
                            Đặt theo lịch
                          </Text>
                        )}
                      </div>
                      
                      <Button 
                        type="link" 
                        icon={<DoubleRightOutlined />} 
                        style={{ 
                          padding: 0, 
                          fontWeight: 700, 
                          fontSize: 12,
                          color: BRAND.primary,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4
                        }}
                      >
                        Đặt sân
                      </Button>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Pagination always styled and clean */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            marginTop: 48,
            padding: '16px 0',
            borderTop: '1px solid #f1f5f9'
          }}>
            <Pagination
              current={page}
              total={data.totalElements}
              pageSize={pageSize}
              onChange={setPage}
              showSizeChanger={false}
              showTotal={(total) => (
                <span style={{ fontWeight: 600, color: '#475569', fontSize: 12 }}>
                  Tổng cộng: {total} sân
                </span>
              )}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}
