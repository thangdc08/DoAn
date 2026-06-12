import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Card,
  Row,
  Col,
  Typography,
  Table,
  Tag,
  Button,
  Space,
  Statistic,
  Spin,
  Alert,
  message,
  Input,
  Select,
  DatePicker,
  Modal,
  Empty,
  Badge,
} from 'antd';
import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  SearchOutlined,
  QrcodeOutlined,
  InfoCircleOutlined,
  FilterOutlined,
  ScanOutlined,
  DollarOutlined,
  UserOutlined,
  FieldTimeOutlined,
  PhoneOutlined,
  MailOutlined,
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { BRAND } from '../../theme/antdTheme';
import { bookingApi } from '../../services/bookingApi';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const STATUS_CONFIG: Record<string, { label: string; color: string; status: 'success' | 'warning' | 'error' | 'default' }> = {
  PAID: { label: 'Đã thanh toán', color: 'success', status: 'success' },
  PENDING: { label: 'Chờ xử lý', color: 'warning', status: 'warning' },
  FAILED: { label: 'Thất bại', color: 'error', status: 'error' },
  EXPIRED: { label: 'Hết hạn', color: 'default', status: 'default' },
  CANCELLED_BY_ADMIN: { label: 'Đã huỷ', color: 'default', status: 'default' },
  CANCELLED_BY_USER: { label: 'Khách huỷ', color: 'default', status: 'default' },
};

export default function StaffDashboardPage() {
  const location = useLocation();
  const queryClient = useQueryClient();
  const currentPath = location.pathname;

  // State variables for routing tabs
  const [bookingPage, setBookingPage] = useState(1);
  const [bookingStatus, setBookingStatus] = useState<string>('ALL');
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingDate, setBookingDate] = useState<dayjs.Dayjs | null>(null);

  // State variables for Check-in tab search and QR Simulation
  const [checkinSearch, setCheckinSearch] = useState('');
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [selectedBookingDetail, setSelectedBookingDetail] = useState<any>(null);

  // Fetch today's bookings (for Overview & Checkin tabs)
  const { data: todayBookingsPage, isLoading: todayLoading } = useQuery({
    queryKey: ['staff-today-bookings'],
    queryFn: () => bookingApi.getTodayBookings({ size: 100 }),
  });
  const todayBookings = todayBookingsPage?.content || [];

  // Fetch all staff bookings (for Bookings tab)
  const { data: allBookingsPage, isLoading: allLoading } = useQuery({
    queryKey: ['staff-all-bookings', bookingPage, bookingStatus],
    queryFn: () =>
      bookingApi.getStaffBookings({
        page: bookingPage - 1,
        size: 10,
        status: bookingStatus === 'ALL' ? undefined : bookingStatus,
      }),
  });
  const allBookings = allBookingsPage?.content || [];
  const totalBookingsCount = allBookingsPage?.totalElements || 0;

  // Mutator for checking in a booking
  const checkInMutation = useMutation({
    mutationFn: (bookingId: string) => bookingApi.checkInBooking(bookingId),
    onSuccess: () => {
      message.success('Check-in thành công!');
      queryClient.invalidateQueries({ queryKey: ['staff-today-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['staff-all-bookings'] });
    },
    onError: () => {
      message.error('Check-in thất bại, vui lòng thử lại');
    },
  });

  // ── Computing statistics ────────────────────────────────────────────────
  const checkedInCount = useMemo(() => todayBookings.filter((b: any) => b.checkedIn).length, [todayBookings]);
  const pendingCount = useMemo(
    () => todayBookings.filter((b: any) => b.status === 'PAID' && !b.checkedIn).length,
    [todayBookings]
  );
  const uncheckinUnpaidCount = useMemo(
    () => todayBookings.filter((b: any) => b.status === 'PENDING').length,
    [todayBookings]
  );

  // ── Recharts Chart Data Formatter ───────────────────────────────────────
  // 1. Hourly checkin Peak
  const hourlyData = useMemo(() => {
    const hours = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];
    const counts = hours.reduce((acc, h) => {
      acc[h] = { name: h, booking: 0, checkedIn: 0 };
      return acc;
    }, {} as Record<string, any>);

    todayBookings.forEach((b: any) => {
      const startHour = dayjs(b.startTime).hour();
      // Find closest slot
      let matchedHour = '08:00';
      if (startHour >= 21) matchedHour = '22:00';
      else if (startHour >= 19) matchedHour = '20:00';
      else if (startHour >= 17) matchedHour = '18:00';
      else if (startHour >= 15) matchedHour = '16:00';
      else if (startHour >= 13) matchedHour = '14:00';
      else if (startHour >= 11) matchedHour = '12:00';
      else if (startHour >= 9) matchedHour = '10:00';

      if (counts[matchedHour]) {
        counts[matchedHour].booking += 1;
        if (b.checkedIn) {
          counts[matchedHour].checkedIn += 1;
        }
      }
    });

    return Object.values(counts);
  }, [todayBookings]);

  // 2. Booking Status Distribution Pie Chart
  const statusPieData = useMemo(() => {
    const paid = todayBookings.filter((b: any) => b.status === 'PAID').length;
    const pending = todayBookings.filter((b: any) => b.status === 'PENDING').length;
    const others = todayBookings.filter((b: any) => b.status !== 'PAID' && b.status !== 'PENDING').length;

    return [
      { name: 'Đã thanh toán', value: paid, fill: BRAND.primary },
      { name: 'Chờ xử lý', value: pending, fill: '#faad14' },
      { name: 'Khác', value: others, fill: '#94a3b8' },
    ].filter((item) => item.value > 0);
  }, [todayBookings]);

  // Upcoming matches / bookings for today
  const upcomingBookings = useMemo(() => {
    return todayBookings
      .filter((b: any) => !b.checkedIn && b.status !== 'FAILED' && b.status !== 'EXPIRED')
      .sort((a: any, b: any) => dayjs(a.startTime).diff(dayjs(b.startTime)))
      .slice(0, 5);
  }, [todayBookings]);

  // ── Columns configuration ────────────────────────────────────────────────
  const commonColumns = [
    {
      title: 'Khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
      render: (text: string, record: any) => (
        <Space>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: '#f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 13,
              color: BRAND.primary,
            }}
          >
            {text ? text.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <Text strong style={{ fontSize: 13 }}>
              {text || 'Khách vãng lai'}
            </Text>
            <br />
            <Text type="secondary" style={{ fontSize: 11 }}>
              {record.customerEmail}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Sân',
      dataIndex: 'courtName',
      key: 'courtName',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Thời gian',
      key: 'time',
      render: (_: any, record: any) => (
        <Text style={{ fontSize: 13 }}>
          {dayjs(record.startTime).format('HH:mm')} - {dayjs(record.endTime).format('HH:mm')}
        </Text>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const cfg = STATUS_CONFIG[status] || { label: status, color: 'default' };
        return (
          <Tag color={cfg.color} style={{ borderRadius: 6, fontWeight: 600 }}>
            {cfg.label}
          </Tag>
        );
      },
    },
    {
      title: 'Check-in',
      dataIndex: 'checkedIn',
      key: 'checkedIn',
      render: (checkedIn: boolean) =>
        checkedIn ? (
          <Tag color="success" icon={<CheckCircleOutlined />} style={{ borderRadius: 6 }}>
            Đã check-in
          </Tag>
        ) : (
          <Tag color="default" style={{ borderRadius: 6 }}>
            Chưa check-in
          </Tag>
        ),
    },
  ];

  // ── Render Views ─────────────────────────────────────────────────────────

  // 1. Overview View
  const renderOverview = () => {
    return (
      <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={8}>
            <Card
              bordered={false}
              style={{
                borderRadius: 16,
                boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)',
              }}
            >
              <Statistic
                title={<Text type="secondary" style={{ fontSize: 13, fontWeight: 600 }}>Đặt sân hôm nay</Text>}
                value={todayBookings.length}
                prefix={<CalendarOutlined style={{ color: BRAND.primary }} />}
                valueStyle={{ fontWeight: 800, fontSize: 32, color: BRAND.primary }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card
              bordered={false}
              style={{
                borderRadius: 16,
                boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                background: 'linear-gradient(135deg, #f8fafc 0%, #ecfdf5 100%)',
              }}
            >
              <Statistic
                title={<Text type="secondary" style={{ fontSize: 13, fontWeight: 600 }}>Đã check-in</Text>}
                value={checkedInCount}
                prefix={<CheckCircleOutlined style={{ color: '#10b981' }} />}
                valueStyle={{ fontWeight: 800, fontSize: 32, color: '#10b981' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card
              bordered={false}
              style={{
                borderRadius: 16,
                boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                background: 'linear-gradient(135deg, #f8fafc 0%, #fffbeb 100%)',
              }}
            >
              <Statistic
                title={<Text type="secondary" style={{ fontSize: 13, fontWeight: 600 }}>Chờ check-in (Đã thanh toán)</Text>}
                value={pendingCount}
                prefix={<ClockCircleOutlined style={{ color: '#f59e0b' }} />}
                valueStyle={{ fontWeight: 800, fontSize: 32, color: '#f59e0b' }}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
          {/* Hourly chart */}
          <Col xs={24} lg={15}>
            <Card
              title="Phân bổ đặt sân & Check-in hôm nay"
              bordered={false}
              style={{ borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}
            >
              <div style={{ height: 320 }}>
                {todayBookings.length === 0 ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <Empty description="Không có dữ liệu đặt sân hôm nay" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
                      />
                      <Bar dataKey="booking" name="Tổng đặt sân" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={16} />
                      <Bar dataKey="checkedIn" name="Đã check-in" fill="#10b981" radius={[4, 4, 0, 0]} barSize={16} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </Card>
          </Col>

          {/* Pie chart summary */}
          <Col xs={24} lg={9}>
            <Card
              title="Tỷ lệ thanh toán hôm nay"
              bordered={false}
              style={{ borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.03)', height: '100%' }}
            >
              <div style={{ height: 200, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {todayBookings.length === 0 ? (
                  <Empty description="Trống" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {statusPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} đơn`, 'Số lượng']} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
              <div style={{ marginTop: 16 }}>
                {statusPieData.map((d) => (
                  <div
                    key={d.name}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '6px 0',
                      borderBottom: '1px solid #f8fafc',
                    }}
                  >
                    <Space>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: d.fill }} />
                      <Text style={{ fontSize: 13, color: '#475569' }}>{d.name}</Text>
                    </Space>
                    <Text strong style={{ color: '#1e293b' }}>{d.value} đơn</Text>
                  </div>
                ))}
              </div>
            </Card>
          </Col>
        </Row>

        {/* Upcoming appointments card */}
        <Card
          title="Các lượt chơi tiếp theo hôm nay"
          bordered={false}
          style={{ borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}
        >
          {upcomingBookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 24 }}>
              <Empty description="Không có ca chơi nào sắp tới chưa check-in trong hôm nay" />
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {upcomingBookings.map((b: any) => (
                <div
                  key={b.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 18px',
                    background: '#f8fafc',
                    borderRadius: 12,
                    border: '1px solid #f1f5f9',
                  }}
                >
                  <Space size={16}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        background: b.status === 'PAID' ? '#ecfdf5' : '#fffbeb',
                        color: b.status === 'PAID' ? '#10b981' : '#f59e0b',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 18,
                      }}
                    >
                      <FieldTimeOutlined />
                    </div>
                    <div>
                      <Text strong style={{ fontSize: 14 }}>
                        {b.courtName}
                      </Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        Khách: {b.customerName} · {dayjs(b.startTime).format('HH:mm')} - {dayjs(b.endTime).format('HH:mm')}
                      </Text>
                    </div>
                  </Space>
                  <Space>
                    <Tag color={STATUS_CONFIG[b.status]?.color || 'default'}>
                      {STATUS_CONFIG[b.status]?.label || b.status}
                    </Tag>
                    {b.status === 'PAID' && (
                      <Button
                        type="primary"
                        size="small"
                        icon={<CheckCircleOutlined />}
                        style={{ borderRadius: 8, background: '#10b981', borderColor: '#10b981' }}
                        onClick={() => checkInMutation.mutate(b.id)}
                        loading={checkInMutation.isPending && checkInMutation.variables === b.id}
                      >
                        Check-in
                      </Button>
                    )}
                  </Space>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    );
  };

  // 2. Check-in View
  const renderCheckin = () => {
    // Filter today's bookings by search input
    const filteredTodayBookings = todayBookings.filter((b: any) => {
      const searchLower = checkinSearch.toLowerCase();
      return (
        b.customerName?.toLowerCase().includes(searchLower) ||
        b.customerPhone?.includes(searchLower) ||
        b.customerEmail?.toLowerCase().includes(searchLower) ||
        b.id?.toLowerCase().includes(searchLower) ||
        b.courtName?.toLowerCase().includes(searchLower)
      );
    });

    const checkinColumns = [
      ...commonColumns,
      {
        title: 'Thao tác',
        key: 'action',
        render: (_: any, record: any) => (
          <Space>
            {!record.checkedIn && record.status === 'PAID' && (
              <Button
                type="primary"
                size="small"
                icon={<CheckCircleOutlined />}
                onClick={() => checkInMutation.mutate(record.id)}
                loading={checkInMutation.isPending && checkInMutation.variables === record.id}
                style={{ borderRadius: 8, background: '#10b981', borderColor: '#10b981' }}
              >
                Xác nhận Check-in
              </Button>
            )}
            {!record.checkedIn && record.status === 'PENDING' && (
              <Button
                type="primary"
                size="small"
                danger
                onClick={() => {
                  Modal.warning({
                    title: 'Đơn chưa thanh toán!',
                    content: 'Khách hàng cần thực hiện thanh toán trước khi check-in vào sân.',
                    okText: 'Đã hiểu',
                  });
                }}
                style={{ borderRadius: 8 }}
              >
                Chưa thanh toán
              </Button>
            )}
            <Button
              size="small"
              icon={<SearchOutlined />}
              onClick={() => setSelectedBookingDetail(record)}
              style={{ borderRadius: 8 }}
            >
              Chi tiết
            </Button>
          </Space>
        ),
      },
    ];

    return (
      <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
        <Row gutter={[20, 20]}>
          {/* Simulated QR Code Scanner Panel */}
          <Col xs={24} lg={8}>
            <Card
              title={
                <Space>
                  <ScanOutlined style={{ color: BRAND.primary }} />
                  <span>Quét mã QR Check-in</span>
                </Space>
              }
              bordered={false}
              style={{ borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.03)', textAlign: 'center' }}
            >
              <div
                style={{
                  height: 200,
                  background: '#0f172a',
                  borderRadius: 16,
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                  overflow: 'hidden',
                }}
              >
                {/* Simulated Green Scanner Box */}
                <div
                  style={{
                    width: 130,
                    height: 130,
                    border: '3px solid #10b981',
                    borderRadius: 12,
                    position: 'relative',
                    boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)',
                  }}
                  className="scanner-box"
                >
                  {/* Laser line animation */}
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      width: '100%',
                      height: 2,
                      background: '#10b981',
                      boxShadow: '0 0 8px #10b981',
                      animation: 'scanLaser 2s infinite ease-in-out',
                    }}
                  />
                </div>
                <div
                  style={{
                    position: 'absolute',
                    bottom: 12,
                    color: '#94a3b8',
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                >
                  ĐANG ĐỢI QUÉT QR...
                </div>
              </div>
              <Paragraph style={{ fontSize: 13, color: '#64748b' }}>
                Hướng camera điện thoại hoặc thiết bị quét về phía mã QR booking của khách hàng để check-in tức thì.
              </Paragraph>
              <Button
                type="primary"
                icon={<QrcodeOutlined />}
                onClick={() => setIsQrModalOpen(true)}
                style={{ width: '100%', borderRadius: 10, background: BRAND.primary, height: 40, fontWeight: 700 }}
              >
                Mô phỏng quét mã QR
              </Button>
            </Card>
          </Col>

          {/* Search Table list */}
          <Col xs={24} lg={16}>
            <Card
              title="Danh sách khách hàng check-in hôm nay"
              bordered={false}
              style={{ borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}
              extra={
                <Input
                  placeholder="Tìm khách hàng, sân, số ĐT..."
                  allowClear
                  prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
                  value={checkinSearch}
                  onChange={(e) => setCheckinSearch(e.target.value)}
                  style={{ width: 240, borderRadius: 8 }}
                />
              }
            >
              {todayLoading ? (
                <div style={{ textAlign: 'center', padding: 40 }}>
                  <Spin size="large" />
                </div>
              ) : (
                <Table
                  rowKey="id"
                  columns={checkinColumns}
                  dataSource={filteredTodayBookings}
                  pagination={{ pageSize: 8, size: 'small' }}
                  size="middle"
                  locale={{ emptyText: <Empty description="Không tìm thấy lượt đặt sân nào trùng khớp" /> }}
                />
              )}
            </Card>
          </Col>
        </Row>

        {/* QR Simulation Modal */}
        <Modal
          title="MÔ PHỎNG QUÉT MÃ QR CHECK-IN"
          open={isQrModalOpen}
          onCancel={() => setIsQrModalOpen(false)}
          footer={null}
          width={500}
          style={{ borderRadius: 16 }}
        >
          <Paragraph type="secondary" style={{ fontSize: 12 }}>
            Chọn một đơn hàng đã thanh toán hôm nay dưới đây để mô phỏng hành vi quét mã QR tại quầy:
          </Paragraph>
          <div
            style={{
              maxHeight: 320,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              paddingRight: 4,
            }}
          >
            {todayBookings.filter((b: any) => !b.checkedIn && b.status === 'PAID').length === 0 ? (
              <Empty description="Không có đơn nào cần check-in hôm nay" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
              todayBookings
                .filter((b: any) => !b.checkedIn && b.status === 'PAID')
                .map((b: any) => (
                  <div
                    key={b.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 12,
                      background: '#f8fafc',
                      borderRadius: 10,
                      border: '1px solid #f1f5f9',
                    }}
                  >
                    <div>
                      <Text strong style={{ fontSize: 13 }}>
                        {b.customerName}
                      </Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: 11 }}>
                        {b.courtName} · {dayjs(b.startTime).format('HH:mm')} - {dayjs(b.endTime).format('HH:mm')}
                      </Text>
                    </div>
                    <Button
                      type="primary"
                      size="small"
                      icon={<ScanOutlined />}
                      style={{ background: '#10b981', borderColor: '#10b981', borderRadius: 6 }}
                      onClick={() => {
                        setIsQrModalOpen(false);
                        // Trigger check-in
                        checkInMutation.mutate(b.id);
                      }}
                    >
                      Quét mã này
                    </Button>
                  </div>
                ))
            )}
          </div>
        </Modal>
      </div>
    );
  };

  // 3. Booking list View
  const renderBookings = () => {
    // Filter bookings on front-end for Search and Date Picker to make it super fast and robust
    const filteredAllBookings = allBookings.filter((b: any) => {
      const searchLower = bookingSearch.toLowerCase();
      const matchSearch =
        b.customerName?.toLowerCase().includes(searchLower) ||
        b.courtName?.toLowerCase().includes(searchLower) ||
        b.id?.toLowerCase().includes(searchLower);

      if (bookingDate) {
        const matchDate = dayjs(b.bookingDate).isSame(bookingDate, 'day');
        return matchSearch && matchDate;
      }
      return matchSearch;
    });

    const bookingColumns = [
      ...commonColumns,
      {
        title: 'Thao tác',
        key: 'action',
        render: (_: any, record: any) => (
          <Button
            size="small"
            icon={<SearchOutlined />}
            onClick={() => setSelectedBookingDetail(record)}
            style={{ borderRadius: 8 }}
          >
            Chi tiết
          </Button>
        ),
      },
    ];

    return (
      <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
        <Card
          bordered={false}
          style={{ borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}
          title={
            <Space>
              <FilterOutlined style={{ color: BRAND.primary }} />
              <span>Nhật ký đặt sân cơ sở</span>
            </Space>
          }
        >
          {/* Filters Bar */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 12,
              marginBottom: 20,
              padding: 16,
              background: '#f8fafc',
              borderRadius: 12,
              border: '1px solid #f1f5f9',
            }}
          >
            <Input
              placeholder="Tìm tên khách, mã booking..."
              prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
              value={bookingSearch}
              onChange={(e) => setBookingSearch(e.target.value)}
              style={{ width: 220, borderRadius: 8 }}
            />
            <Select
              defaultValue="ALL"
              style={{ width: 160 }}
              onChange={(value) => {
                setBookingStatus(value);
                setBookingPage(1);
              }}
              className="rounded-select"
            >
              <Option value="ALL">Tất cả trạng thái</Option>
              <Option value="PAID">Đã thanh toán</Option>
              <Option value="PENDING">Chờ thanh toán</Option>
              <Option value="CANCELLED_BY_USER">Khách huỷ</Option>
              <Option value="EXPIRED">Hết hạn</Option>
            </Select>
            <DatePicker
              placeholder="Chọn ngày đặt sân"
              onChange={(date) => setBookingDate(date)}
              style={{ width: 160, borderRadius: 8 }}
            />
            {(bookingSearch || bookingStatus !== 'ALL' || bookingDate) && (
              <Button
                type="text"
                onClick={() => {
                  setBookingSearch('');
                  setBookingStatus('ALL');
                  setBookingDate(null);
                  setBookingPage(1);
                }}
                style={{ color: '#94a3b8', fontWeight: 600 }}
              >
                Đặt lại bộ lọc
              </Button>
            )}
          </div>

          {allLoading ? (
            <div style={{ textAlign: 'center', padding: 40 }}>
              <Spin size="large" />
            </div>
          ) : (
            <Table
              rowKey="id"
              columns={bookingColumns}
              dataSource={filteredAllBookings}
              pagination={{
                current: bookingPage,
                pageSize: 10,
                total: totalBookingsCount,
                onChange: (page) => setBookingPage(page),
                size: 'small',
              }}
              size="middle"
            />
          )}
        </Card>
      </div>
    );
  };

  return (
    <div style={{ padding: 0 }}>
      {/* Alert banner for staff access status */}
      <Alert
        message="Chế độ làm việc Nhân viên"
        description="Chào mừng bạn đến với khu vực điều hành. Tại đây bạn có thể kiểm tra danh sách đặt sân hôm nay, duyệt check-in khách hàng vào sân, và nhắn tin hỗ trợ nhanh."
        type="info"
        showIcon
        icon={<InfoCircleOutlined style={{ color: BRAND.primary }} />}
        style={{ marginBottom: 24, borderRadius: 12, border: 'none', background: '#eff6ff' }}
      />

      {/* Conditional rendering based on pathname */}
      {currentPath === '/staff/checkin'
        ? renderCheckin()
        : currentPath === '/staff/bookings'
        ? renderBookings()
        : renderOverview()}

      {/* Styled Receipt Detail Modal */}
      <Modal
        title={
          <div style={{ textAlign: 'center', borderBottom: '1px dashed #e2e8f0', paddingBottom: 16 }}>
            <QrcodeOutlined style={{ fontSize: 32, color: BRAND.primary, marginBottom: 8 }} />
            <Title level={4} style={{ margin: 0 }}>
              CHI TIẾT VÉ ĐẶT SÂN
            </Title>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Mã số: #{selectedBookingDetail?.id?.substring(0, 8).toUpperCase() || 'N/A'}
            </Text>
          </div>
        }
        open={!!selectedBookingDetail}
        onCancel={() => setSelectedBookingDetail(null)}
        footer={[
          <Button key="close" onClick={() => setSelectedBookingDetail(null)} style={{ borderRadius: 8 }}>
            Đóng vé
          </Button>,
          selectedBookingDetail && !selectedBookingDetail.checkedIn && selectedBookingDetail.status === 'PAID' && (
            <Button
              key="checkin"
              type="primary"
              icon={<CheckCircleOutlined />}
              style={{ background: '#10b981', borderColor: '#10b981', borderRadius: 8 }}
              onClick={() => {
                checkInMutation.mutate(selectedBookingDetail.id);
                setSelectedBookingDetail(null);
              }}
              loading={checkInMutation.isPending}
            >
              Check-in
            </Button>
          ),
        ]}
        width={450}
        bodyStyle={{ padding: '20px 8px' }}
      >
        {selectedBookingDetail && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Customer info */}
            <div>
              <Text type="secondary" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Khách hàng
              </Text>
              <div style={{ background: '#f8fafc', padding: 12, borderRadius: 10, marginTop: 4 }}>
                <Space direction="vertical" size={4} style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text strong><UserOutlined style={{ marginRight: 6 }} />{selectedBookingDetail.customerName}</Text>
                  </div>
                  <Text type="secondary" style={{ fontSize: 12 }}><MailOutlined style={{ marginRight: 6 }} />{selectedBookingDetail.customerEmail}</Text>
                  {selectedBookingDetail.customerPhone && (
                    <Text type="secondary" style={{ fontSize: 12 }}><PhoneOutlined style={{ marginRight: 6 }} />{selectedBookingDetail.customerPhone}</Text>
                  )}
                </Space>
              </div>
            </div>

            {/* Time and Court Details */}
            <div>
              <Text type="secondary" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Thông tin dịch vụ
              </Text>
              <div style={{ background: '#f8fafc', padding: 12, borderRadius: 10, marginTop: 4 }}>
                <Space direction="vertical" size={8} style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>Cơ sở:</Text>
                    <Text strong>{selectedBookingDetail.venueNameSnapshot || 'Badminton Hub'}</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>Số sân / Court:</Text>
                    <Text strong>{selectedBookingDetail.courtName}</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>Loại sân:</Text>
                    <Text>{selectedBookingDetail.courtType || 'Sân tiêu chuẩn'}</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>Thời gian chơi:</Text>
                    <Text strong style={{ color: BRAND.primary }}>
                      {dayjs(selectedBookingDetail.startTime).format('HH:mm')} -{' '}
                      {dayjs(selectedBookingDetail.endTime).format('HH:mm')}
                    </Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>Ngày đặt sân:</Text>
                    <Text>{dayjs(selectedBookingDetail.bookingDate).format('DD/MM/YYYY')}</Text>
                  </div>
                </Space>
              </div>
            </div>

            {/* Payment Details */}
            <div>
              <Text type="secondary" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Thông tin thanh toán
              </Text>
              <div style={{ background: '#f8fafc', padding: 12, borderRadius: 10, marginTop: 4 }}>
                <Space direction="vertical" size={8} style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>Trạng thái đặt sân:</Text>
                    <Tag color={STATUS_CONFIG[selectedBookingDetail.status]?.color || 'default'} style={{ margin: 0 }}>
                      {STATUS_CONFIG[selectedBookingDetail.status]?.label || selectedBookingDetail.status}
                    </Tag>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>Trạng thái check-in:</Text>
                    <Text strong style={{ color: selectedBookingDetail.checkedIn ? '#10b981' : '#64748b' }}>
                      {selectedBookingDetail.checkedIn ? 'Đã check-in vào sân' : 'Chưa check-in'}
                    </Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: 8 }}>
                    <Text strong>Tổng cộng:</Text>
                    <Text strong style={{ color: BRAND.primary, fontSize: 16 }}>
                      {(selectedBookingDetail.totalAmount || 0).toLocaleString('vi-VN')} đ
                    </Text>
                  </div>
                </Space>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Injection of Scanner laser line keyframes styling */}
      <style>{`
        @keyframes scanLaser {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
