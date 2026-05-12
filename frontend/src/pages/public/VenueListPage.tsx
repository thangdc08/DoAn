import { useState, useMemo } from 'react';
import { Row, Col, Input, Select, Button, Card, Pagination, Empty, Space, Typography } from 'antd';
import { SearchOutlined, EnvironmentOutlined, StarFilled } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { mockVenues } from '../../data/mockVenues';

const { Title } = Typography;
const { Option } = Select;

export default function VenueListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [district, setDistrict] = useState(searchParams.get('district') || '');
  const [page, setPage] = useState(1);
  const pageSize = 12;

  // Filter mock data
  const filteredVenues = useMemo(() => {
    return mockVenues.filter(venue => {
      const matchSearch = !search || venue.name.toLowerCase().includes(search.toLowerCase());
      const matchCity = !city || venue.city === city;
      const matchDistrict = !district || venue.district === district;
      return matchSearch && matchCity && matchDistrict;
    });
  }, [search, city, district]);

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
    if (district) params.district = district;
    setSearchParams(params);
  };

  const handleReset = () => {
    setSearch('');
    setCity('');
    setDistrict('');
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
              placeholder="Chọn quận/huyện"
              style={{ width: '100%' }}
              value={district || undefined}
              onChange={setDistrict}
              allowClear
              disabled={!city}
            >
              {city === 'Hồ Chí Minh' && (
                <>
                  <Option value="Quận 1">Quận 1</Option>
                  <Option value="Quận 3">Quận 3</Option>
                  <Option value="Quận 7">Quận 7</Option>
                  <Option value="Quận 9">Quận 9</Option>
                  <Option value="Thủ Đức">Thủ Đức</Option>
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
      {data.content.length === 0 ? (
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
                        <div style={{ marginBottom: 8 }}>
                          <EnvironmentOutlined /> {venue.district}, {venue.city}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span>
                            <StarFilled style={{ color: '#faad14' }} /> {venue.ratingAvg.toFixed(1)} ({venue.ratingCount})
                          </span>
                          {venue.priceRange && <span style={{ color: '#52c41a', fontWeight: 'bold' }}>{venue.priceRange}</span>}
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
