import { useState, useMemo } from 'react';
import { Row, Col, Input, Select, Button, Card, Pagination, Empty, Space, Typography, Spin } from 'antd';
import { SearchOutlined, EnvironmentOutlined, StarFilled } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { venueApi } from '../../services/venueApi';

const { Title } = Typography;
const { Option } = Select;

export default function VenueListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [ward, setWard] = useState(searchParams.get('ward') || '');
  const [page, setPage] = useState(1);
  const pageSize = 12;

  // Fetch actual venues from database
  const { data: venues = [], isLoading } = useQuery({
    queryKey: ['venues'],
    queryFn: () => venueApi.getVenues(),
  });

  // Filter fetched data
  const filteredVenues = useMemo(() => {
    return venues.filter(venue => {
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

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Danh sách sân cầu lông</Title>

      {/* Search & Filter */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Input
              placeholder="Tìm theo tên sân..."
              prefix={<SearchOutlined />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onPressEnter={handleSearch}
            />
          </Col>
          <Col xs={24} md={6}>
            <Select
              placeholder="Chọn thành phố"
              style={{ width: '100%' }}
              value={city || undefined}
              onChange={setCity}
              allowClear
            >
              <Option value="Hồ Chí Minh">Hồ Chí Minh</Option>
              <Option value="Hà Nội">Hà Nội</Option>
              <Option value="Đà Nẵng">Đà Nẵng</Option>
              <Option value="Cần Thơ">Cần Thơ</Option>
            </Select>
          </Col>
          <Col xs={24} md={6}>
            <Select
              placeholder="Chọn phường/xã"
              style={{ width: '100%' }}
              value={ward || undefined}
              onChange={setWard}
              allowClear
              disabled={!city}
            >
              {city === 'Hồ Chí Minh' && (
                <>
                  <Option value="Phường Tân Phú">Phường Tân Phú</Option>
                  <Option value="Phường Hiệp Phú">Phường Hiệp Phú</Option>
                  <Option value="Phường Linh Chiểu">Phường Linh Chiểu</Option>
                  <Option value="Phường Bến Nghé">Phường Bến Nghé</Option>
                  <Option value="Phường Đa Kao">Phường Đa Kao</Option>
                </>
              )}
            </Select>
          </Col>
          <Col xs={24} md={4}>
            <Space>
              <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                Tìm
              </Button>
              <Button onClick={handleReset}>Reset</Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Venue Grid */}
      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
          <Spin size="large" tip="Đang tải danh sách sân..." />
        </div>
      ) : data.content.length === 0 ? (
        <Empty description="Không tìm thấy sân nào" />
      ) : (
        <>
          <Row gutter={[16, 16]}>
            {data.content.map((venue) => (
              <Col xs={24} sm={12} lg={8} xl={6} key={venue.id}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt={venue.name}
                      src={venue.images?.[0]?.imageUrl || 'https://via.placeholder.com/300x200'}
                      style={{ height: 200, objectFit: 'cover' }}
                    />
                  }
                  onClick={() => navigate(`/venues/${venue.id}`)}
                >
                  <Card.Meta
                    title={venue.name}
                    description={
                      <div>
                        <div style={{ marginBottom: 8, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                          <EnvironmentOutlined /> {venue.address}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span>
                            <StarFilled style={{ color: '#faad14' }} /> {(venue.ratingAvg || 0).toFixed(1)} ({venue.ratingCount || 0})
                          </span>
                          <span style={{ color: '#52c41a', fontWeight: 'bold' }}>
                            Theo sân &amp; khung giờ
                          </span>
                        </div>
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <Pagination
                current={page}
                total={data.totalElements}
                pageSize={pageSize}
                onChange={setPage}
                showSizeChanger={false}
                showTotal={(total) => `Tổng ${total} sân`}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
