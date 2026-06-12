import { useEffect, useMemo, useState } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Statistic, 
  Typography, 
  Space, 
  Button, 
  Table, 
  Tag, 
  Select, 
  Spin, 
  Empty, 
  message, 
  Tabs, 
  Input, 
  Modal, 
  Badge, 
  Descriptions,
  List
} from 'antd';
import { useQuery } from '@tanstack/react-query';
import { getLevelLabel } from '../../constants/levels';
import dayjs from 'dayjs';
import { 
  UserOutlined, 
  HomeOutlined, 
  TrophyOutlined, 
  LineChartOutlined, 
  GlobalOutlined, 
  DownloadOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  DollarOutlined,
  ReloadOutlined,
  SearchOutlined,
  EyeOutlined,
  CloudDownloadOutlined,
  AlertOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  ShareAltOutlined,
  MessageOutlined
} from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { BRAND } from '../../theme/antdTheme';
import { adminApi } from '../../services/adminApi';
import { venueApi } from '../../services/venueApi';
import { bookingApi } from '../../services/bookingApi';
import { communityApi } from '../../services/communityApi';
import type { FacebookPost } from '../../types/community.types';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

export default function AdminReportPage() {
  const [activeTab, setActiveTab] = useState<string>('revenue');
  const [selectedVenueId, setSelectedVenueId] = useState<string>('ALL');
  const [timeRange, setTimeRange] = useState<string>('30-days');

  // Community-specific states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<string>('ALL');
  const [selectedCompletenessFilter, setSelectedCompletenessFilter] = useState<string>('ALL');
  const [isScraping, setIsScraping] = useState<boolean>(false);
  const [scrapingLogs, setScrapingLogs] = useState<string[]>([
    'Hệ thống Facebook Scraper sẵn sàng.',
    'Nhóm cào mặc định: Hội giao lưu cầu lông Hà Nội (ID: 910458119501297).'
  ]);
  const [selectedPost, setSelectedPost] = useState<FacebookPost | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState<boolean>(false);

  // Compute dates based on time range
  const { startDate, endDate } = useMemo(() => {
    const today = dayjs();
    let start = today.subtract(30, 'day');
    
    if (timeRange === '7-days') {
      start = today.subtract(7, 'day');
    } else if (timeRange === 'this-month') {
      start = today.startOf('month');
    } else if (timeRange === 'this-year') {
      start = today.startOf('year');
    }
    
    return {
      startDate: start.format('YYYY-MM-DD'),
      endDate: today.format('YYYY-MM-DD')
    };
  }, [timeRange]);

  // Fetch all venues in system for the filter dropdown
  const { data: systemVenues = [], isLoading: isLoadingVenues } = useQuery({
    queryKey: ['systemVenues'],
    queryFn: () => venueApi.getVenues({ size: 1000 })
  });

  // Fetch admin revenue stats
  const { data: revenueData, isLoading: isLoadingRevenue } = useQuery({
    queryKey: ['adminRevenue', selectedVenueId, startDate, endDate],
    queryFn: () => bookingApi.getAdminRevenue({
      venueId: selectedVenueId === 'ALL' ? undefined : selectedVenueId,
      startDate,
      endDate
    })
  });

  // Fetch total users for top cards
  const { data: usersData, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['adminUsersCount'],
    queryFn: () => adminApi.getUsers({ page: 0, size: 1 })
  });

  // Fetch Facebook crawled posts
  const { data: facebookPosts = [], isLoading: isLoadingFbPosts, refetch: refetchFbPosts } = useQuery({
    queryKey: ['adminFacebookPosts'],
    queryFn: () => communityApi.getFacebookPosts(),
    enabled: activeTab === 'community'
  });

  const totalUsers = usersData?.totalElements || 0;
  const totalVenuesCount = systemVenues.length;

  const isLoading = isLoadingVenues || isLoadingRevenue || isLoadingUsers;

  // Format daily data for Recharts
  const chartData = useMemo(() => {
    if (!revenueData?.dailyBreakdown || revenueData.dailyBreakdown.length === 0) {
      return [];
    }
    return revenueData.dailyBreakdown.map(item => ({
      date: dayjs(item.date).format('DD/MM'),
      revenue: item.revenue,
      bookings: item.bookingCount
    }));
  }, [revenueData]);

  // Table columns for revenue breakdown
  const tableColumns = useMemo(() => {
    if (selectedVenueId === 'ALL') {
      return [
        { 
          title: 'Tên sân / Cơ sở', 
          dataIndex: 'venueName', 
          key: 'venueName', 
          render: (text: string) => <Text strong>{text || 'Không xác định'}</Text> 
        },
        { 
          title: 'Số lượng Booking', 
          dataIndex: 'bookingCount', 
          key: 'bookingCount', 
          align: 'center' as const 
        },
        { 
          title: 'Tổng doanh thu', 
          dataIndex: 'revenue', 
          key: 'revenue', 
          align: 'right' as const,
          render: (val: number) => <Text strong style={{ color: BRAND.primary }}>{Number(val).toLocaleString()}đ</Text> 
        },
        { 
          title: 'Đóng đóng góp', 
          key: 'ratio', 
          align: 'center' as const,
          render: (_: any, record: any) => {
            const total = revenueData?.totalRevenue || 1;
            const percentage = Math.round((record.revenue / total) * 100);
            return (
              <Tag color={percentage > 25 ? 'success' : 'processing'} style={{ borderRadius: 4 }}>
                {percentage}%
              </Tag>
            );
          } 
        },
      ];
    } else {
      return [
        { 
          title: 'Ngày', 
          dataIndex: 'date', 
          key: 'date', 
          render: (text: string) => <Text strong>{dayjs(text).format('DD/MM/YYYY')}</Text> 
        },
        { 
          title: 'Số lượng Booking', 
          dataIndex: 'bookingCount', 
          key: 'bookingCount', 
          align: 'center' as const 
        },
        { 
          title: 'Doanh thu trong ngày', 
          dataIndex: 'revenue', 
          key: 'revenue', 
          align: 'right' as const,
          render: (val: number) => <Text strong style={{ color: BRAND.primary }}>{Number(val).toLocaleString()}đ</Text> 
        }
      ];
    }
  }, [selectedVenueId, revenueData]);

  // Export CSV helper
  const handleExport = () => {
    if (!revenueData) return;
    
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    
    if (selectedVenueId === 'ALL') {
      csvContent += "Ten San,So Luong Booking,Doanh Thu\n";
      revenueData.venueBreakdown.forEach(row => {
        csvContent += `"${row.venueName}",${row.bookingCount},${row.revenue}\n`;
      });
    } else {
      csvContent += "Ngay,So Luong Booking,Doanh Thu\n";
      revenueData.dailyBreakdown.forEach(row => {
        csvContent += `"${row.date}",${row.bookingCount},${row.revenue}\n`;
      });
    }
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Bao_cao_doanh_thu_he_thong_${dayjs().format('YYYYMMDD')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Poll scraper status on mount and when isScraping changes
  useEffect(() => {
    let intervalId: any;

    const checkStatus = async () => {
      try {
        const result = await communityApi.getScrapeStatus();
        if (result.logs) {
          setScrapingLogs(result.logs);
        }
        if (result.status === 'scraping') {
          setIsScraping(true);
        } else if (result.status === 'idle' && isScraping) {
          setIsScraping(false);
          message.success('Cào dữ liệu Facebook hoàn tất!');
          refetchFbPosts();
        }
      } catch (err) {
        console.error('Error fetching scrape status:', err);
      }
    };

    if (activeTab === 'community') {
      checkStatus();
      intervalId = setInterval(checkStatus, 2000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [activeTab, isScraping, refetchFbPosts]);

  // Facebook Scraper Trigger Action
  const handleScrape = async () => {
    setIsScraping(true);
    setScrapingLogs(prev => [...prev, `[${dayjs().format('HH:mm:ss')}] Bắt đầu gửi lệnh cào dữ liệu Facebook...`]);
    
    try {
      const response = await communityApi.scrapeFacebookPosts();
      message.info(response.message || 'Tiến trình cào đã bắt đầu trong nền.');
    } catch (err: any) {
      const errMsg = err.response?.data?.error || err.message || 'Lỗi kết nối API Gateway';
      message.error(`Không thể bắt đầu cào: ${errMsg}`);
      setIsScraping(false);
      setScrapingLogs(prev => [
        ...prev,
        `[${dayjs().format('HH:mm:ss')}] ❌ LỖI: ${errMsg}`
      ]);
    }
  };

  // Calculate completeness status client-side for Swiss HUD dashboard
  const getCompletenessStatus = (post: FacebookPost) => {
    const hasContact = post.contact && post.contact !== 'Không rõ';
    const hasLocation = post.location && post.location !== 'Không xác định';
    const hasSlots = post.slots && post.slots !== 'Không rõ';
    
    if (hasContact && hasLocation && hasSlots) {
      return { text: 'Hoàn thiện', color: 'success', status: 'COMPLETE' };
    } else if (!hasContact && !hasLocation) {
      return { text: 'Nghi vấn Spam', color: 'error', status: 'SPAM' };
    } else {
      return { text: 'Thiếu thông tin', color: 'warning', status: 'INCOMPLETE' };
    }
  };

  // Filter facebook posts based on user search & filter selections
  const filteredFbPosts = useMemo(() => {
    return facebookPosts.filter(post => {
      // 1. Text Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        post.userName.toLowerCase().includes(searchLower) ||
        (post.title || '').toLowerCase().includes(searchLower) ||
        post.content.toLowerCase().includes(searchLower) ||
        post.location.toLowerCase().includes(searchLower);

      // 2. Level filter
      let matchesLevel = true;
      if (selectedLevelFilter !== 'ALL') {
        const levelLower = post.level.toLowerCase();
        const filterLower = selectedLevelFilter.toLowerCase();
        matchesLevel = levelLower.includes(filterLower);
      }

      // 3. Completeness status filter
      let matchesCompleteness = true;
      if (selectedCompletenessFilter !== 'ALL') {
        const compInfo = getCompletenessStatus(post);
        matchesCompleteness = compInfo.status === selectedCompletenessFilter;
      }

      return matchesSearch && matchesLevel && matchesCompleteness;
    });
  }, [facebookPosts, searchQuery, selectedLevelFilter, selectedCompletenessFilter]);

  // Metadata totals for community posts
  const communityStats = useMemo(() => {
    let completeCount = 0;
    let incompleteCount = 0;
    let spamCount = 0;

    facebookPosts.forEach(post => {
      const comp = getCompletenessStatus(post);
      if (comp.status === 'COMPLETE') completeCount++;
      else if (comp.status === 'SPAM') spamCount++;
      else incompleteCount++;
    });

    return {
      total: facebookPosts.length,
      complete: completeCount,
      incomplete: incompleteCount,
      spam: spamCount
    };
  }, [facebookPosts]);

  // Columns for Facebook crawled posts table
  const facebookTableColumns = useMemo(() => {
    return [
      {
        title: 'Người đăng',
        dataIndex: 'userName',
        key: 'userName',
        width: 160,
        render: (text: string, record: FacebookPost) => (
          <Space direction="vertical" size={2}>
            <Text strong style={{ fontSize: '13px' }}>{text}</Text>
            <Tag color="blue" style={{ fontSize: '10px', margin: 0, borderRadius: 2 }}>Facebook Member</Tag>
          </Space>
        )
      },
      {
        title: 'Nội dung trích xuất',
        key: 'extractedContent',
        render: (_: any, record: FacebookPost) => (
          <Space direction="vertical" size={6} style={{ width: '100%' }}>
            {record.title && <Text strong style={{ color: '#1e293b' }}>{record.title}</Text>}
            <Paragraph 
              ellipsis={{ rows: 2, expandable: false }} 
              style={{ fontSize: '12px', color: '#64748b', marginBottom: 4 }}
            >
              {record.content}
            </Paragraph>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              <Tag color="cyan" style={{ borderRadius: 2, fontSize: '11px' }}>📍 {record.location}</Tag>
              <Tag color="orange" style={{ borderRadius: 2, fontSize: '11px' }}>🏆 Trình độ: {getLevelLabel(record.level)}</Tag>
              <Tag color="purple" style={{ borderRadius: 2, fontSize: '11px' }}>👥 Slot: {record.slots}</Tag>
              {record.price && <Tag color="gold" style={{ borderRadius: 2, fontSize: '11px' }}>💵 Giá: {record.price}</Tag>}
            </div>
          </Space>
        )
      },
      {
        title: 'Độ tin cậy',
        key: 'completeness',
        width: 140,
        align: 'center' as const,
        render: (_: any, record: FacebookPost) => {
          const comp = getCompletenessStatus(record);
          return (
            <Tag color={comp.color} style={{ borderRadius: 2, fontWeight: 'bold', textTransform: 'uppercase', fontSize: '11px', padding: '2px 8px' }}>
              {comp.text}
            </Tag>
          );
        }
      },
      {
        title: 'Thời gian cào',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        width: 130,
        render: (text: string) => <Text style={{ fontSize: '12px', color: '#64748b' }}>{dayjs(text).format('DD/MM HH:mm')}</Text>
      },
      {
        title: 'Thao tác',
        key: 'actions',
        width: 100,
        align: 'center' as const,
        render: (_: any, record: FacebookPost) => (
          <Space size={8}>
            <Button 
              size="small" 
              type="text" 
              icon={<EyeOutlined style={{ color: BRAND.primary }} />}
              onClick={() => {
                setSelectedPost(record);
                setIsDetailModalVisible(true);
              }}
              style={{ border: `1px solid ${BRAND.primary}22` }}
            />
            <Button 
              size="small" 
              type="text" 
              icon={<ShareAltOutlined style={{ color: '#1890ff' }} />}
              href={record.url}
              target="_blank"
              style={{ border: '1px solid #1890ff22' }}
            />
          </Space>
        )
      }
    ];
  }, []);

  return (
    <Spin spinning={isLoading} tip="Đang tải dữ liệu báo cáo...">
      <div style={{ padding: '24px', background: '#f8fafc', minHeight: '100vh' }}>
        
        {/* Header Block */}
        <div style={{ 
          background: '#ffffff', 
          padding: '24px', 
          borderRadius: '4px', 
          border: '1px solid #e2e8f0', 
          marginBottom: 24 
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <Title level={3} style={{ margin: 0, fontWeight: 800, letterSpacing: '-0.5px' }}>BÁO CÁO & ĐIỀU HÀNH HỆ THỐNG</Title>
              <Text type="secondary">Phân tích tăng trưởng, phân bổ doanh thu sân bãi và giám sát dữ liệu cộng đồng Facebook.</Text>
            </div>
            
            {activeTab === 'revenue' && (
              <Space wrap>
                <Select 
                  value={selectedVenueId} 
                  onChange={setSelectedVenueId} 
                  style={{ width: 220 }}
                  placeholder="Lọc theo sân"
                >
                  <Option value="ALL">Tất cả các cơ sở</Option>
                  {systemVenues.map(v => (
                    <Option key={v.id} value={v.id}>{v.name}</Option>
                  ))}
                </Select>

                <Select value={timeRange} onChange={setTimeRange} style={{ width: 150 }}>
                  <Option value="7-days">7 ngày qua</Option>
                  <Option value="30-days">30 ngày qua</Option>
                  <Option value="this-month">Tháng này</Option>
                  <Option value="this-year">Năm nay</Option>
                </Select>

                <Button 
                  icon={<DownloadOutlined />} 
                  type="primary" 
                  style={{ background: BRAND.primary, borderRadius: '4px' }}
                  onClick={handleExport}
                  disabled={!revenueData}
                >
                  Xuất báo cáo
                </Button>
              </Space>
            )}

            {activeTab === 'community' && (
              <Button
                icon={<ReloadOutlined spin={isScraping} />}
                type="primary"
                style={{ background: '#0f172a', borderColor: '#0f172a', borderRadius: '4px' }}
                onClick={handleScrape}
                disabled={isScraping}
              >
                {isScraping ? 'Đang cào Facebook...' : 'Đồng bộ cào dữ liệu'}
              </Button>
            )}
          </div>
        </div>

        {/* Tabbed Navigation */}
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          type="card"
          style={{ marginBottom: 0 }}
        >
          <TabPane 
            tab={
              <span>
                <DollarOutlined />
                Doanh thu & Hiệu suất Sân
              </span>
            } 
            key="revenue"
          >
            <div style={{ paddingTop: '20px' }}>
              {/* Top Stats */}
              <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} lg={6}>
                  <Card style={{ borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                    <Statistic 
                      title="Tổng doanh thu thực tế" 
                      value={Number(revenueData?.totalRevenue || 0)} 
                      suffix="đ" 
                      prefix={<GlobalOutlined style={{ color: BRAND.primary }} />} 
                      valueStyle={{ fontWeight: 800, color: BRAND.primary, fontSize: '24px' }} 
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card style={{ borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                    <Statistic 
                      title="Tổng lượt đặt sân" 
                      value={revenueData?.totalBookings || 0} 
                      prefix={<HomeOutlined style={{ color: BRAND.sky }} />} 
                      valueStyle={{ fontWeight: 800, fontSize: '24px' }} 
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card style={{ borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                    <Statistic 
                      title="Lượt giao dịch thành công" 
                      value={revenueData?.paidBookings || 0} 
                      prefix={<CheckCircleOutlined style={{ color: '#10b981' }} />} 
                      valueStyle={{ fontWeight: 800, color: '#10b981', fontSize: '24px' }} 
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card style={{ borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                    <Statistic 
                      title="Thành viên hệ thống" 
                      value={totalUsers} 
                      prefix={<UserOutlined style={{ color: '#6366f1' }} />} 
                      valueStyle={{ fontWeight: 800, fontSize: '24px' }} 
                    />
                  </Card>
                </Col>
              </Row>

              <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
                {/* Trend Line Chart */}
                <Col xs={24} lg={16}>
                  <Card 
                    title={
                      <Space>
                        <LineChartOutlined style={{ color: BRAND.primary }} />
                        <span style={{ fontWeight: 700 }}>BIỂU ĐỒ DOANH THU HỆ THỐNG</span>
                      </Space>
                    }
                    style={{ borderRadius: 4, border: '1px solid #e2e8f0' }}
                  >
                    {chartData.length === 0 ? (
                      <Empty description="Không có dữ liệu doanh thu trong khoảng thời gian này" style={{ padding: '60px 0' }} />
                    ) : (
                      <div style={{ height: 350, width: '100%', marginTop: 20 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(val) => `${val >= 1000000 ? `${val/1000000}M` : `${val/1000}K`}`} />
                            <RechartsTooltip 
                              contentStyle={{ borderRadius: 4, border: '1px solid #cbd5e1', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                              formatter={(val: any) => [`${Number(val).toLocaleString()}đ`, 'Doanh thu']}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="revenue" 
                              stroke={BRAND.primary} 
                              strokeWidth={3} 
                              dot={{ r: 3, fill: BRAND.primary, strokeWidth: 2, stroke: '#fff' }} 
                              activeDot={{ r: 5, strokeWidth: 0 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </Card>
                </Col>

                {/* Platforms Overview stats */}
                <Col xs={24} lg={8}>
                  <Card 
                    title={<span style={{ fontWeight: 700 }}>PHÂN BỔ TRẠNG THÁI ĐẶT SÂN</span>} 
                    style={{ borderRadius: 4, border: '1px solid #e2e8f0' }}
                  >
                    <div style={{ padding: '10px 0' }}>
                      <Space direction="vertical" style={{ width: '100%' }} size={24}>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <Text>Thành công (PAID)</Text>
                            <Text strong>{revenueData?.paidBookings || 0} ({revenueData?.totalBookings ? Math.round((revenueData.paidBookings / revenueData.totalBookings) * 100) : 0}%)</Text>
                          </div>
                          <div style={{ height: 8, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                            <div style={{ width: `${revenueData?.totalBookings ? (revenueData.paidBookings / revenueData.totalBookings) * 100 : 0}%`, height: '100%', background: '#10b981' }} />
                          </div>
                        </div>

                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <Text>Chờ thanh toán (PENDING)</Text>
                            <Text strong>{revenueData?.pendingBookings || 0} ({revenueData?.totalBookings ? Math.round((revenueData.pendingBookings / revenueData.totalBookings) * 100) : 0}%)</Text>
                          </div>
                          <div style={{ height: 8, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                            <div style={{ width: `${revenueData?.totalBookings ? (revenueData.pendingBookings / revenueData.totalBookings) * 100 : 0}%`, height: '100%', background: '#f59e0b' }} />
                          </div>
                        </div>

                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <Text>Thất bại/Hủy (FAILED)</Text>
                            <Text strong>{revenueData?.failedBookings || 0} ({revenueData?.totalBookings ? Math.round((revenueData.failedBookings / revenueData.totalBookings) * 100) : 0}%)</Text>
                          </div>
                          <div style={{ height: 8, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                            <div style={{ width: `${revenueData?.totalBookings ? (revenueData.failedBookings / revenueData.totalBookings) * 100 : 0}%`, height: '100%', background: '#ef4444' }} />
                          </div>
                        </div>
                      </Space>
                    </div>
                  </Card>
                </Col>
              </Row>

              {/* Detailed Data Table */}
              <Row>
                <Col span={24}>
                  <Card 
                    title={
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <span style={{ fontWeight: 700 }}>CHI TIẾT DOANH THU CỦA TỪNG SÂN ĐẤU</span>
                        <Tag color="cyan" style={{ borderRadius: 2 }}><CalendarOutlined /> {startDate} đến {endDate}</Tag>
                      </div>
                    }
                    style={{ borderRadius: 4, border: '1px solid #e2e8f0' }}
                  >
                    <Table
                      dataSource={selectedVenueId === 'ALL' ? (revenueData?.venueBreakdown || []) : (revenueData?.dailyBreakdown || [])}
                      rowKey={selectedVenueId === 'ALL' ? 'venueId' : 'date'}
                      columns={tableColumns}
                      pagination={{ pageSize: 10, showSizeChanger: false }}
                      locale={{ emptyText: <Empty description="Không có số liệu giao dịch nào" /> }}
                    />
                  </Card>
                </Col>
              </Row>
            </div>
          </TabPane>

          <TabPane 
            tab={
              <span>
                <MessageOutlined />
                Dashboard Cộng đồng & Facebook Scraper
              </span>
            } 
            key="community"
          >
            <div style={{ paddingTop: '20px' }}>
              {/* Community Overview Cards */}
              <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} lg={6}>
                  <Card style={{ borderRadius: 4, border: '1px solid #e2e8f0', background: '#ffffff' }}>
                    <Statistic 
                      title="Tổng tin đã thu thập" 
                      value={communityStats.total} 
                      prefix={<CloudDownloadOutlined style={{ color: '#0f172a' }} />} 
                      valueStyle={{ fontWeight: 800, fontSize: '24px' }} 
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card style={{ borderRadius: 4, border: '1px solid #e2e8f0' }}>
                    <Statistic 
                      title="Bài cào đầy đủ thông tin" 
                      value={communityStats.complete} 
                      prefix={<CheckCircleOutlined style={{ color: '#10b981' }} />} 
                      valueStyle={{ fontWeight: 800, color: '#10b981', fontSize: '24px' }} 
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card style={{ borderRadius: 4, border: '1px solid #e2e8f0' }}>
                    <Statistic 
                      title="Bài cào thiếu thông tin" 
                      value={communityStats.incomplete} 
                      prefix={<InfoCircleOutlined style={{ color: '#f59e0b' }} />} 
                      valueStyle={{ fontWeight: 800, color: '#f59e0b', fontSize: '24px' }} 
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card style={{ borderRadius: 4, border: '1px solid #e2e8f0' }}>
                    <Statistic 
                      title="Số tin nghi vấn Spam" 
                      value={communityStats.spam} 
                      prefix={<AlertOutlined style={{ color: '#ef4444' }} />} 
                      valueStyle={{ fontWeight: 800, color: '#ef4444', fontSize: '24px' }} 
                    />
                  </Card>
                </Col>
              </Row>

              {/* Scraper Control Card & Logs console */}
              <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
                <Col xs={24} lg={10}>
                  <Card 
                    title={<span style={{ fontWeight: 700, letterSpacing: '-0.3px' }}>BẢNG ĐIỀU KHIỂN SCRAPER</span>} 
                    style={{ borderRadius: 4, border: '1px solid #e2e8f0', height: '100%' }}
                  >
                    <Space direction="vertical" style={{ width: '100%' }} size={16}>
                      <div>
                        <Text strong style={{ fontSize: '13px' }}>Nguồn cào tự động (Facebook public group ID):</Text>
                        <Input 
                          value="910458119501297 (Hội giao lưu cầu lông Hà Nội)" 
                          disabled 
                          style={{ marginTop: 6, borderRadius: 2 }}
                        />
                      </div>
                      <div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          Trình điều khiển gửi lệnh cào trực tiếp đến dịch vụ Node.js microservice (`fb-community-service`) thông qua API Gateway, dịch vụ sẽ thực hiện phân tích NLP để bóc tách địa điểm, slots, trình độ, liên hệ và lưu về MongoDB.
                        </Text>
                      </div>
                      <Button
                        icon={<ReloadOutlined spin={isScraping} />}
                        type="primary"
                        onClick={handleScrape}
                        disabled={isScraping}
                        style={{ width: '100%', background: '#0f172a', borderColor: '#0f172a', borderRadius: 2 }}
                      >
                        {isScraping ? 'Đang chạy phân tích NLP bài đăng...' : 'Bắt đầu cào dữ liệu mới ngay'}
                      </Button>
                    </Space>
                  </Card>
                </Col>
                
                <Col xs={24} lg={14}>
                  <Card 
                    title={<span style={{ fontWeight: 700, letterSpacing: '-0.3px' }}>NHẬT KÝ HỆ THỐNG CÀO (SCRAPER LOGS)</span>} 
                    style={{ borderRadius: 4, border: '1px solid #e2e8f0', height: '100%' }}
                  >
                    <div style={{ 
                      background: '#0f172a', 
                      color: '#38bdf8', 
                      fontFamily: 'Consolas, Courier New, monospace', 
                      padding: '16px', 
                      borderRadius: 2, 
                      fontSize: '12px',
                      height: '170px',
                      overflowY: 'auto'
                    }}>
                      {scrapingLogs.map((log, index) => (
                        <div key={index} style={{ marginBottom: 4 }}>
                          {log}
                        </div>
                      ))}
                      {isScraping && <div style={{ color: '#e2e8f0' }}>&gt; Đang kết nối gateway... [Đang chờ phản hồi]</div>}
                    </div>
                  </Card>
                </Col>
              </Row>

              {/* Crawled Facebook Posts Table */}
              <Row>
                <Col span={24}>
                  <Card 
                    title={
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '12px' }}>
                        <span style={{ fontWeight: 700 }}>DANH SÁCH BÀI ĐĂNG CẦU LÔNG TỰ ĐỘNG THU THẬP</span>
                        
                        {/* Filters toolbar */}
                        <Space wrap>
                          <Input
                            placeholder="Tìm kiếm nội dung, tên..."
                            prefix={<SearchOutlined />}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ width: 220, borderRadius: 2 }}
                          />
                          
                          <Select
                            value={selectedLevelFilter}
                            onChange={setSelectedLevelFilter}
                            style={{ width: 140 }}
                            placeholder="Lọc trình độ"
                          >
                            <Option value="ALL">Tất cả trình độ</Option>
                            <Option value="TBY">TBY (Trung bình yếu)</Option>
                            <Option value="TB">TB (Trung bình)</Option>
                            <Option value="Newbie">Newbie (Mới chơi)</Option>
                          </Select>

                          <Select
                            value={selectedCompletenessFilter}
                            onChange={setSelectedCompletenessFilter}
                            style={{ width: 155 }}
                            placeholder="Lọc độ tin cậy"
                          >
                            <Option value="ALL">Tất cả độ tin cậy</Option>
                            <Option value="COMPLETE">Hoàn thiện</Option>
                            <Option value="INCOMPLETE">Thiếu thông tin</Option>
                            <Option value="SPAM">Nghi vấn Spam</Option>
                          </Select>
                        </Space>
                      </div>
                    }
                    style={{ borderRadius: 4, border: '1px solid #e2e8f0' }}
                  >
                    <Table
                      dataSource={filteredFbPosts}
                      rowKey="_id"
                      columns={facebookTableColumns}
                      pagination={{ pageSize: 10, showSizeChanger: true }}
                      loading={isLoadingFbPosts}
                      locale={{ emptyText: <Empty description="Không tìm thấy bài viết Facebook nào khớp bộ lọc" /> }}
                    />
                  </Card>
                </Col>
              </Row>
            </div>
          </TabPane>
        </Tabs>

        {/* Facebook Post View Detail Modal */}
        <Modal
          title={
            <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
              <span style={{ fontWeight: 800, fontSize: '16px', letterSpacing: '-0.3px' }}>CHI TIẾT BÀI ĐĂNG THU THẬP TỪ FACEBOOK</span>
            </div>
          }
          open={isDetailModalVisible}
          onCancel={() => setIsDetailModalVisible(false)}
          footer={[
            <Button key="close" style={{ borderRadius: 2 }} onClick={() => setIsDetailModalVisible(false)}>
              Đóng lại
            </Button>,
            <Button key="link" type="primary" style={{ borderRadius: 2 }} href={selectedPost?.url} target="_blank">
              Mở link gốc Facebook
            </Button>
          ]}
          width={700}
          bodyStyle={{ paddingTop: '20px' }}
        >
          {selectedPost && (
            <Space direction="vertical" size={20} style={{ width: '100%' }}>
              <Descriptions title="Dữ liệu NLP trích xuất" bordered size="small" column={2}>
                <Descriptions.Item label="Người đăng">{selectedPost.userName}</Descriptions.Item>
                <Descriptions.Item label="Trình độ">{selectedPost.level}</Descriptions.Item>
                <Descriptions.Item label="Thời gian">{selectedPost.time}</Descriptions.Item>
                <Descriptions.Item label="Số slot">{selectedPost.slots}</Descriptions.Item>
                <Descriptions.Item label="Giá">{selectedPost.price || 'Không rõ'}</Descriptions.Item>
                <Descriptions.Item label="Liên hệ">{selectedPost.contact}</Descriptions.Item>
                <Descriptions.Item label="Địa điểm" span={2}>{selectedPost.location}</Descriptions.Item>
              </Descriptions>

              <div>
                <div style={{ marginBottom: 8, fontWeight: 'bold' }}>
                  <FileTextOutlined /> Nội dung thô của bài đăng:
                </div>
                <div style={{ 
                  background: '#f8fafc', 
                  border: '1px solid #e2e8f0', 
                  padding: '16px', 
                  borderRadius: 4, 
                  whiteSpace: 'pre-line',
                  fontSize: '13px',
                  color: '#334155',
                  maxHeight: '220px',
                  overflowY: 'auto'
                }}>
                  {selectedPost.content}
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <Text type="secondary" style={{ fontSize: '12px' }}>Link URL bài viết:</Text>
                  <a href={selectedPost.url} target="_blank" rel="noreferrer" style={{ fontSize: '12px', wordBreak: 'break-all' }}>
                    {selectedPost.url}
                  </a>
                </div>
              </div>
            </Space>
          )}
        </Modal>

      </div>
    </Spin>
  );
}
