import { Button, Input, Card, Row, Col, Typography, Space } from 'antd';
import { SearchOutlined, EnvironmentOutlined, CalendarOutlined, TeamOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const { Title, Paragraph } = Typography;

export default function HomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    navigate(`/venues?search=${searchQuery}`);
  };

  const features = [
    {
      icon: <SearchOutlined style={{ fontSize: 48, color: '#1890ff' }} />,
      title: 'Tìm sân dễ dàng',
      description: 'Tìm kiếm và đặt sân cầu lông gần bạn chỉ với vài cú click',
    },
    {
      icon: <CalendarOutlined style={{ fontSize: 48, color: '#52c41a' }} />,
      title: 'Đặt lịch nhanh chóng',
      description: 'Xem lịch trống, khóa slot và thanh toán online an toàn',
    },
    {
      icon: <TeamOutlined style={{ fontSize: 48, color: '#fa8c16' }} />,
      title: 'Kết nối cộng đồng',
      description: 'Tìm bạn chơi cùng, tham gia các trận đấu và giao lưu',
    },
    {
      icon: <EnvironmentOutlined style={{ fontSize: 48, color: '#eb2f96' }} />,
      title: 'Sân gần bạn',
      description: 'Tìm sân theo vị trí với bản đồ tích hợp PostGIS',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '80px 24px',
          textAlign: 'center',
          color: 'white',
        }}
      >
        <Title level={1} style={{ color: 'white', marginBottom: 16 }}>
          Đặt Sân Cầu Lông Trực Tuyến
        </Title>
        <Paragraph style={{ fontSize: 18, color: 'white', marginBottom: 32 }}>
          Tìm sân, đặt lịch và kết nối với cộng đồng người chơi cầu lông
        </Paragraph>

        <Space.Compact size="large" style={{ maxWidth: 600, width: '100%' }}>
          <Input
            size="large"
            placeholder="Tìm sân theo tên, địa điểm..."
            prefix={<SearchOutlined />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onPressEnter={handleSearch}
          />
          <Button type="primary" size="large" onClick={handleSearch}>
            Tìm kiếm
          </Button>
        </Space.Compact>

        <div style={{ marginTop: 24 }}>
          <Button
            size="large"
            style={{ marginRight: 16 }}
            onClick={() => navigate('/venues')}
          >
            Xem tất cả sân
          </Button>
          <Button
            size="large"
            type="default"
            onClick={() => navigate('/community')}
          >
            Tìm bạn chơi
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div style={{ padding: '60px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 48 }}>
          Tại sao chọn chúng tôi?
        </Title>

        <Row gutter={[24, 24]}>
          {features.map((feature, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Card
                hoverable
                style={{ textAlign: 'center', height: '100%' }}
              >
                <div style={{ marginBottom: 16 }}>{feature.icon}</div>
                <Title level={4}>{feature.title}</Title>
                <Paragraph>{feature.description}</Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* CTA Section */}
      <div
        style={{
          background: '#f0f2f5',
          padding: '60px 24px',
          textAlign: 'center',
        }}
      >
        <Title level={2}>Bắt đầu ngay hôm nay</Title>
        <Paragraph style={{ fontSize: 16, marginBottom: 32 }}>
          Đăng ký tài khoản để trải nghiệm đầy đủ tính năng
        </Paragraph>
        <Space>
          <Button type="primary" size="large" onClick={() => navigate('/register')}>
            Đăng ký ngay
          </Button>
          <Button size="large" onClick={() => navigate('/login')}>
            Đăng nhập
          </Button>
        </Space>
      </div>
    </div>
  );
}
