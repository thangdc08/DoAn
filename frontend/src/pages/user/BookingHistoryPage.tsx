import { useState, useMemo, useEffect } from 'react';
import { Card, Table, Tag, Button, Select, Space, Typography, Modal, Input, Row, Col, Badge, Divider, Spin, Empty, message, Rate, Upload, QRCode } from 'antd';
import {
  EyeOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  SearchOutlined,
  FilterOutlined,
  CreditCardOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  StarOutlined,
  CameraOutlined
} from '@ant-design/icons';
import { bookingApi } from '../../services/bookingApi';
import { venueApi } from '../../services/venueApi';
import type { Booking } from '../../types/booking.types';
import dayjs from 'dayjs';
import { BRAND } from '../../theme/antdTheme';

const { Title, Text } = Typography;
const { Option } = Select;

// Mapping statuses to Vietnamese
const STATUS_MAP: Record<string, { label: string, color: string, icon: any }> = {
  PENDING: { label: 'Chờ thanh toán', color: 'orange', icon: <ClockCircleOutlined /> },
  PAID: { label: 'Chờ duyệt', color: 'blue', icon: <ClockCircleOutlined /> },
  CONFIRMED: { label: 'Đã xác nhận', color: 'green', icon: <CheckCircleOutlined /> },
  FAILED: { label: 'Thanh toán lỗi', color: 'red', icon: <CloseCircleOutlined /> },
  EXPIRED: { label: 'Đã hết hạn', color: 'default', icon: <ClockCircleOutlined /> },
  CANCELLED_BY_ADMIN: { label: 'Hủy bởi Admin', color: 'red', icon: <CloseCircleOutlined /> },
  CANCELLED_BY_USER: { label: 'Đã hủy', color: 'red', icon: <CloseCircleOutlined /> },
  CANCELLED_BY_OWNER: { label: 'Bị từ chối', color: 'red', icon: <CloseCircleOutlined /> },
};

const PAYMENT_STATUS_MAP: Record<string, { label: string, color: string }> = {
  UNPAID: { label: 'Chưa thanh toán', color: 'error' },
  PROCESSING: { label: 'Đang xử lý', color: 'processing' },
  SUCCESS: { label: 'Thành công', color: 'success' },
  FAILED: { label: 'Thất bại', color: 'error' },
};

export default function BookingHistoryPage() {
  const [status, setStatus] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');
  const [page, setPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  
  // Venue Rating Modal state
  const [venueRatingModalOpen, setVenueRatingModalOpen] = useState(false);
  const [ratingVenueId, setRatingVenueId] = useState('');
  const [ratingVenueName, setRatingVenueName] = useState('');
  const [venueStars, setVenueStars] = useState(5);
  const [venueComment, setVenueComment] = useState('');
  const [submittingVenueRating, setSubmittingVenueRating] = useState(false);
  const [ratingFileList, setRatingFileList] = useState<any[]>([]);

  const handleOpenVenueRating = (booking: Booking, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setRatingVenueId(booking.venueId);
    setRatingVenueName(booking.venueNameSnapshot);
    setVenueStars(5);
    setVenueComment('');
    setRatingFileList([]);
    setVenueRatingModalOpen(true);
  };

  const handleSubmitVenueRating = async () => {
    if (!ratingVenueId) return;
    setSubmittingVenueRating(true);
    try {
      let uploadedUrls: string[] = [];
      const filesToUpload = ratingFileList
        .filter((file) => file.originFileObj)
        .map((file) => file.originFileObj as File);

      if (filesToUpload.length > 0) {
        uploadedUrls = await venueApi.uploadRatingImages(filesToUpload);
      }

      await venueApi.rateVenue(ratingVenueId, {
        stars: venueStars,
        comment: venueComment,
        images: uploadedUrls
      });
      message.success(`Đã gửi đánh giá thành công cho sân ${ratingVenueName}!`);
      setVenueRatingModalOpen(false);
    } catch (error) {
      console.error(error);
      message.error('Không thể gửi đánh giá sân');
    } finally {
      setSubmittingVenueRating(false);
    }
  };

  const canRateBooking = (booking: Booking) => {
    if (booking.status !== 'CONFIRMED' && booking.status !== 'PAID') return false;
    const isFinished = booking.items && booking.items.length > 0
      ? dayjs().isAfter(dayjs(booking.items.reduce((max, item) => dayjs(item.endTime).isAfter(max) ? dayjs(item.endTime) : max, dayjs(booking.items[0].endTime))))
      : dayjs().isAfter(dayjs(booking.endTime));
      
    return booking.checkedIn || isFinished;
  };

  const handleCancelBooking = async (booking: Booking) => {
    let cancelWindow = 2;
    try {
      const venue = await venueApi.getVenueById(booking.venueId);
      if (venue && venue.policy) {
        const policyObj = typeof venue.policy === 'string' ? JSON.parse(venue.policy) : venue.policy;
        if (policyObj.bookingPolicy && policyObj.bookingPolicy.cancelWindow !== undefined) {
          cancelWindow = Number(policyObj.bookingPolicy.cancelWindow);
        }
      }
    } catch (e) {
      console.warn('Failed to parse venue policy', e);
    }

    const earliestStart = booking.items && booking.items.length > 0
      ? booking.items.reduce((min, item) => dayjs(item.startTime).isBefore(min) ? dayjs(item.startTime) : min, dayjs(booking.items[0].startTime))
      : dayjs(booking.startTime);

    const isTooLate = earliestStart.isBefore(dayjs().add(cancelWindow, 'hour'));

    if (isTooLate) {
      Modal.error({
        title: 'Không thể hủy đặt sân',
        content: `Theo chính sách của sân, bạn chỉ được phép hủy trước giờ chơi ít nhất ${cancelWindow} tiếng. Đơn này không đủ điều kiện để hủy.`,
        okText: 'Đóng',
      });
      return;
    }

    Modal.confirm({
      title: 'Xác nhận hủy đặt sân',
      content: `Bạn có chắc chắn muốn hủy đặt sân này? Theo chính sách, bạn sẽ được hoàn tiền đầy đủ nếu hủy trước giờ chơi ${cancelWindow} tiếng.`,
      okText: 'Hủy đặt sân',
      okType: 'danger',
      cancelText: 'Đóng',
      onOk: async () => {
        try {
          setLoading(true);
          const updated = await bookingApi.cancelBooking(booking.id);
          message.success('Hủy đặt sân thành công!');
          setBookings(prev => prev.map(b => b.id === updated.id ? updated : b));
          setSelectedBooking(updated);
        } catch (error: any) {
          message.error(error?.response?.data?.message || error?.message || 'Không thể hủy đặt sân');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const pageSize = 10;

  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true);
        const response = await bookingApi.getMyBookings({
          status: status || undefined,
          page: page - 1,
          size: pageSize,
        });
        setBookings(response.content || []);
        setTotalElements(response.totalElements || 0);
      } catch (error) {
        message.error('Không thể tải danh sách đặt sân');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [status, page]);

  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => {
      const matchesPayment = !paymentStatus || booking.paymentStatus === paymentStatus;
      const matchesSearch = !searchText ||
        booking.venueNameSnapshot.toLowerCase().includes(searchText.toLowerCase()) ||
        booking.id.toLowerCase().includes(searchText.toLowerCase());
      return matchesPayment && matchesSearch;
    });
  }, [bookings, paymentStatus, searchText]);

  const data = {
    content: filteredBookings,
    totalElements: filteredBookings.length,
  };

  const columns = [
    {
      title: 'Mã đặt sân',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => (
        <Space direction="vertical" size={0}>
          <Text strong style={{ color: BRAND.primary }}>#{id.substring(0, 8).toUpperCase()}</Text>
          <Text type="secondary" style={{ fontSize: '11px' }}>ID: {id.substring(0, 12)}...</Text>
        </Space>
      ),
    },
    {
      title: 'Thông tin sân',
      dataIndex: 'venueNameSnapshot',
      key: 'venue',
      render: (name: string) => (
        <div className="flex flex-col">
          <Text strong className="text-app-text">{name}</Text>
          <Space className="text-xs text-app-muted mt-1">
            <EnvironmentOutlined style={{ fontSize: '10px' }} />
            <span>Khu vực trung tâm</span>
          </Space>
        </div>
      ),
    },
    {
      title: 'Thời gian đặt',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => (
        <div className="flex flex-col">
          <Text className="text-sm">{dayjs(date).format('DD/MM/YYYY')}</Text>
          <Text type="secondary" className="text-xs">{dayjs(date).format('HH:mm')}</Text>
        </div>
      ),
    },
    {
      title: 'Chi phí',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => (
        <Text strong className="text-brand-green text-base">
          {amount.toLocaleString()}đ
        </Text>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const config = STATUS_MAP[status] || { label: status, color: 'default', icon: null };
        return (
          <Tag color={config.color} icon={config.icon} className="rounded-full px-3 py-0.5 border-none font-semibold">
            {config.label}
          </Tag>
        );
      },
    },
    {
      title: 'Thanh toán',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (pStatus: string) => {
        const config = PAYMENT_STATUS_MAP[pStatus] || { label: pStatus, color: 'default' };
        return <Badge status={config.color as any} text={config.label} className="font-medium" />;
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'right' as any,
      render: (_: any, record: Booking) => (
        <Space>
          {(record.status === 'CONFIRMED' || record.status === 'PAID') && (
            <Button
              type="default"
              disabled={!canRateBooking(record)}
              icon={<StarOutlined />}
              onClick={(e) => handleOpenVenueRating(record, e)}
              title={!record.checkedIn 
                ? "Bạn cần check-in hoặc kết thúc giờ chơi để đánh giá" 
                : undefined}
              className="rounded-lg border-amber-200 text-amber-600 hover:bg-amber-50 hover:border-amber-300 disabled:opacity-50"
            >
              Đánh giá
            </Button>
          )}
          <Button
            type="primary"
            ghost
            icon={<EyeOutlined />}
            onClick={() => setSelectedBooking(record)}
            className="rounded-lg border-brand-green text-brand-green hover:bg-brand-green/5"
          >
            Chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-6">
        <Title level={2}>Lịch sử đặt sân</Title>
        <Text type="secondary">Theo dõi và quản lý tất cả các yêu cầu đặt sân của bạn.</Text>
      </div>

      <Card className="shadow-app-sm border-none rounded-2xl mb-6 overflow-hidden" bodyStyle={{ padding: 0 }}>
        <div className="p-6 bg-gray-50/50 border-b border-gray-100">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={8}>
              <Input
                placeholder="Tìm theo tên sân hoặc mã đặt sân..."
                prefix={<SearchOutlined className="text-gray-400" />}
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                className="rounded-xl h-10"
                allowClear
              />
            </Col>
            <Col xs={12} md={6}>
              <Select
                placeholder="Trạng thái đặt sân"
                style={{ width: '100%' }}
                value={status || undefined}
                onChange={setStatus}
                allowClear
                suffixIcon={<FilterOutlined />}
                className="h-10"
              >
                {Object.keys(STATUS_MAP).map(key => (
                  <Option key={key} value={key}>{STATUS_MAP[key].label}</Option>
                ))}
              </Select>
            </Col>
            <Col xs={12} md={6}>
              <Select
                placeholder="Trạng thái thanh toán"
                style={{ width: '100%' }}
                value={paymentStatus || undefined}
                onChange={setPaymentStatus}
                allowClear
                className="h-10"
              >
                {Object.keys(PAYMENT_STATUS_MAP).map(key => (
                  <Option key={key} value={key}>{PAYMENT_STATUS_MAP[key].label}</Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} md={4} className="text-right">
              <Text strong className="text-app-muted">Tổng: {data.totalElements}</Text>
            </Col>
          </Row>
        </div>

        <Table
          columns={columns}
          dataSource={data.content}
          rowKey="id"
          className="app-table"
          loading={loading}
          locale={{ emptyText: <Empty description="Không có đặt sân nào" /> }}
          pagination={{
            current: page,
            pageSize,
            total: totalElements,
            onChange: setPage,
            showSizeChanger: false,
            className: "px-6 py-4",
          }}
        />
      </Card>

      {/* Booking Detail Modal */}
      <Modal
        title={null}
        open={!!selectedBooking}
        onCancel={() => setSelectedBooking(null)}
        footer={null}
        width={850}
        centered
        className="premium-modal"
        bodyStyle={{ padding: 0, borderRadius: '24px', overflow: 'hidden' }}
      >
        {selectedBooking && (
          <div className="animate-in fade-in zoom-in-95 duration-500 bg-white">
            {/* Top Navigation/Status Bar */}
            <div className="px-8 py-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <Space split={<Divider type="vertical" />}>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Chi tiết đặt sân</span>
                <Text strong className="text-[10px] text-brand-primary">ID: {selectedBooking.id.substring(0, 12).toUpperCase()}</Text>
              </Space>
              <Tag 
                color={STATUS_MAP[selectedBooking.status]?.color} 
                className="m-0 rounded-full font-black px-4 py-0.5 border-none shadow-sm uppercase text-[9px] tracking-widest"
              >
                {STATUS_MAP[selectedBooking.status]?.label}
              </Tag>
            </div>

            {/* Main Content Area */}
            <div className="p-8">
              <div className="mb-10 text-center max-w-2xl mx-auto">
                <Title level={1} className="!m-0 !text-4xl font-black text-slate-900 tracking-tight mb-2">
                  #{selectedBooking.id.substring(0, 8).toUpperCase()}
                </Title>
                <div className="flex items-center justify-center gap-6 text-slate-500 font-medium">
                  <span className="flex items-center gap-2"><CalendarOutlined className="text-brand-green" /> {dayjs(selectedBooking.createdAt).format('DD/MM/YYYY')}</span>
                  <span className="flex items-center gap-2"><ClockCircleOutlined className="text-brand-green" /> {dayjs(selectedBooking.createdAt).format('HH:mm')}</span>
                  <span className="flex items-center gap-2"><CreditCardOutlined className="text-brand-green" /> VNPAY QR</span>
                </div>
              </div>

              <Row gutter={[40, 0]}>
                {/* Left Side: Court Details */}
                <Col span={13}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1.5 h-6 bg-brand-green rounded-full" />
                    <Title level={4} className="!mb-0 font-black tracking-tight text-slate-800">Thông tin giờ chơi</Title>
                  </div>
                  
                  <div className="space-y-4">
                    {selectedBooking.items?.map((item) => (
                      <div key={item.id} className="p-5 bg-slate-50 border border-slate-100 rounded-3xl hover:border-brand-primary/20 hover:bg-white hover:shadow-xl transition-all duration-300">
                        <div className="flex justify-between items-center">
                          <div className="flex gap-4 items-center">
                            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-brand-green shadow-sm">
                              <CheckCircleOutlined style={{ fontSize: '20px' }} />
                            </div>
                            <div>
                              <Title level={5} className="!mb-1 font-bold text-slate-800">{item.courtNameSnapshot}</Title>
                              <Text type="secondary" className="text-xs flex items-center gap-1.5">
                                <ClockCircleOutlined style={{ fontSize: '10px' }} /> {dayjs(item.startTime).format('HH:mm')} - {dayjs(item.endTime).format('HH:mm')}
                              </Text>
                            </div>
                          </div>
                          <div className="text-right">
                            <Text strong className="text-slate-900 block">{item.priceSnapshot.toLocaleString()}đ</Text>
                            <Text className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Giá sân</Text>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 p-6 bg-amber-50/50 border border-amber-100 rounded-3xl flex items-start gap-3">
                    <InfoCircleOutlined className="text-amber-500 mt-1" />
                    <div className="text-xs leading-relaxed text-amber-800/80">
                      <Text strong className="text-amber-900 block mb-1">Lưu ý khi nhận sân</Text>
                      Vui lòng xuất trình mã đơn hàng tại quầy lễ tân để được hướng dẫn vào vị trí sân. 
                    </div>
                  </div>
                </Col>

                {/* Right Side: Map & Venue Info */}
                <Col span={11}>
                  {selectedBooking.status === 'PAID' && (
                    <Card
                      bordered={false}
                      className="shadow-xl rounded-[2.5rem] border border-slate-100 overflow-hidden bg-white mb-6"
                      bodyStyle={{ padding: '24px 16px', textAlign: 'center' }}
                    >
                      <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        <div style={{ display: 'inline-flex', padding: 8, background: '#f8fafc', borderRadius: 16, border: '1px solid #f1f5f9' }}>
                          <QRCode
                            value={selectedBooking.id}
                            size={120}
                            bordered={false}
                            color="#00a651"
                          />
                        </div>
                        <div>
                          <Text type="secondary" style={{ fontSize: '10px', display: 'block', letterSpacing: '0.05em', fontWeight: 'bold' }}>MÃ CHECK-IN CỦA BẠN</Text>
                          <Text strong style={{ fontSize: '14px', color: '#334155', display: 'block', marginTop: 2 }}>
                            #{selectedBooking.id.substring(0, 8).toUpperCase()}
                          </Text>
                        </div>
                      </Space>
                    </Card>
                  )}

                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1.5 h-6 bg-brand-primary rounded-full" />
                    <Title level={4} className="!mb-0 font-black tracking-tight text-slate-800">Vị trí sân chơi</Title>
                  </div>

                  <Card 
                    bordered={false} 
                    className="shadow-xl rounded-[2.5rem] border border-slate-100 overflow-hidden bg-white"
                    bodyStyle={{ padding: 0 }}
                  >
                    <div className="p-5">
                      <Title level={5} className="!mb-1 !text-base font-bold text-slate-900">{selectedBooking.venueNameSnapshot}</Title>
                      <div className="flex items-start gap-2 mb-4">
                        <EnvironmentOutlined className="text-brand-green mt-1 text-xs" />
                        <Text className="text-xs text-slate-500 leading-relaxed">Quận 10, TP. Hồ Chí Minh, Việt Nam</Text>
                      </div>
                      <Button type="primary" block className="h-10 rounded-xl font-bold bg-brand-green border-none shadow-md shadow-brand-green/10">Xem bản đồ lớn</Button>
                    </div>
                    <div className="h-56 w-full bg-slate-100 relative">
                      <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.460232427344!2d106.6641!3d10.7766!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752edc00000001%3A0x6e288d6c8b9c8b9c!2zU8OibiBD4bqndSBMw7RuZyBL4buzIEjDsmE!5e0!3m2!1svi!2s!4v1715000000000!5m2!1svi!2s" 
                        width="100%" 
                        height="100%" 
                        style={{ border: 0 }} 
                        allowFullScreen={true} 
                        loading="lazy" 
                        className="grayscale"
                      ></iframe>
                    </div>
                  </Card>
                </Col>
              </Row>
            </div>

            {/* Bottom Total & Actions Bar */}
            <div className="px-8 py-6 bg-slate-50/80 backdrop-blur-md border-t border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-8">
                <div>
                  <Text className="text-slate-400 text-[10px] uppercase font-black tracking-widest block mb-1">Trạng thái</Text>
                  <div className="flex items-center gap-2">
                    <Badge color={
                      selectedBooking.status === 'PAID' ? '#10b981' : 
                      selectedBooking.status === 'PENDING' ? '#f59e0b' : '#ef4444'
                    } />
                    <Text strong className="text-slate-700 text-xs uppercase tracking-wider">
                      {STATUS_MAP[selectedBooking.status]?.label || selectedBooking.status}
                    </Text>
                  </div>
                </div>
                <Divider type="vertical" className="h-8 bg-slate-200 m-0" />
                <div>
                  <Text className="text-slate-400 text-[10px] uppercase font-black tracking-widest block mb-1">Tổng tiền thanh toán</Text>
                  <Text className="text-2xl font-black text-brand-green leading-none">
                    {selectedBooking.totalAmount.toLocaleString()}đ
                  </Text>
                </div>
              </div>
              <Space size={16}>
                {selectedBooking.status === 'PAID' && (
                  <Button 
                    type="default"
                    disabled={!canRateBooking(selectedBooking)}
                    icon={<StarOutlined />}
                    title={!selectedBooking.checkedIn 
                      ? "Bạn cần check-in trước khi đánh giá" 
                      : !dayjs().isAfter(dayjs(selectedBooking.endTime)) 
                        ? "Vui lòng chờ sau khi hết giờ chơi để đánh giá" 
                        : undefined}
                    className="h-11 px-6 rounded-xl font-bold border-amber-200 text-amber-600 hover:bg-amber-50 hover:border-amber-300 disabled:opacity-50"
                    onClick={() => handleOpenVenueRating(selectedBooking)}
                  >
                    Đánh giá sân
                  </Button>
                )}
                {(selectedBooking.status === 'PENDING' || selectedBooking.status === 'PAID') && !selectedBooking.checkedIn && (
                  <Button 
                    className="h-11 px-6 rounded-xl font-bold border-slate-200 text-slate-500 hover:text-red-500 hover:border-red-200 transition-all"
                    onClick={() => handleCancelBooking(selectedBooking)}
                  >
                    Hủy đơn
                  </Button>
                )}
                <Button 
                  type="primary" 
                  className="h-11 px-10 rounded-xl font-black shadow-lg shadow-brand-primary/20 bg-brand-primary border-none"
                  onClick={() => setSelectedBooking(null)}
                >
                  Hoàn tất
                </Button>
              </Space>
            </div>
          </div>
        )}
      </Modal>

      {/* Venue Rating Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2 pt-2">
            <StarOutlined style={{ color: '#f59e0b', fontSize: 20 }} />
            <span className="font-extrabold text-slate-800 text-lg">Đánh giá sân đấu 🏟️</span>
          </div>
        }
        open={venueRatingModalOpen}
        onOk={handleSubmitVenueRating}
        onCancel={() => setVenueRatingModalOpen(false)}
        okText="Gửi đánh giá"
        cancelText="Đóng"
        okButtonProps={{ 
          className: 'bg-emerald-600 hover:bg-emerald-700 rounded-xl font-bold h-10 px-6',
          loading: submittingVenueRating 
        }}
        cancelButtonProps={{ className: 'rounded-xl font-bold h-10 px-6' }}
        className="rounded-3xl overflow-hidden"
        width={450}
      >
        <div className="py-4 space-y-4">
          <div className="p-4 bg-emerald-50/50 border border-emerald-100/50 rounded-2xl">
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block mb-1">Tên sân đấu</span>
            <Text strong className="text-slate-800 text-sm block">{ratingVenueName}</Text>
          </div>

          <div className="space-y-1.5">
            <Text strong className="text-slate-700 text-xs block">Vui lòng chọn số sao chất lượng dịch vụ & cơ sở vật chất:</Text>
            <Rate allowHalf value={venueStars} onChange={setVenueStars} className="text-amber-500 text-2xl" />
          </div>

          <div className="space-y-1.5">
            <Text strong className="text-slate-700 text-xs block">Nhận xét chi tiết (Không bắt buộc):</Text>
            <Input.TextArea
              rows={4}
              placeholder="Chia sẻ trải nghiệm của bạn về chất lượng sân, nhân viên, ánh sáng, bãi giữ xe..."
              value={venueComment}
              onChange={(e) => setVenueComment(e.target.value)}
              className="rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <Text strong className="text-slate-700 text-xs block">Hình ảnh thực tế (Tối đa 5 ảnh, JPG/PNG/WebP):</Text>
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl">
              <Upload
                listType="picture-card"
                fileList={ratingFileList}
                onChange={({ fileList }) => setRatingFileList(fileList)}
                beforeUpload={(file) => {
                  const isAcceptedType = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp';
                  if (!isAcceptedType) {
                    message.error('Chỉ hỗ trợ file ảnh định dạng JPG, PNG hoặc WebP!');
                    return Upload.LIST_IGNORE;
                  }
                  const isLt5M = file.size / 1024 / 1024 < 5;
                  if (!isLt5M) {
                    message.error('Kích thước ảnh không được vượt quá 5MB!');
                    return Upload.LIST_IGNORE;
                  }
                  return false;
                }}
                accept="image/*"
              >
                {ratingFileList.length < 5 && (
                  <div className="flex flex-col items-center justify-center text-slate-500 hover:text-emerald-600 transition-colors duration-200">
                    <CameraOutlined style={{ fontSize: 20 }} className="text-slate-400 mb-1.5" />
                    <div className="text-[11px] font-bold">Thêm ảnh</div>
                  </div>
                )}
              </Upload>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
