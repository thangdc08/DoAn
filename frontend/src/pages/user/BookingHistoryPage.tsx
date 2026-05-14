import { useState, useMemo } from 'react';
import { Card, Table, Tag, Button, Select, Space, Typography, Modal, Input, Row, Col, Badge, Divider } from 'antd';
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
  InfoCircleOutlined
} from '@ant-design/icons';
import { mockBookings } from '../../data/mockBookings';
import type { Booking } from '../../types/booking.types';
import dayjs from 'dayjs';
import { BRAND } from '../../theme/antdTheme';

const { Title, Text } = Typography;
const { Option } = Select;

// Mapping statuses to Vietnamese
const STATUS_MAP: Record<string, { label: string, color: string, icon: any }> = {
  PENDING: { label: 'Chờ xác nhận', color: 'orange', icon: <ClockCircleOutlined /> },
  PAID: { label: 'Đã xác nhận', color: 'green', icon: <CheckCircleOutlined /> },
  FAILED: { label: 'Thanh toán lỗi', color: 'red', icon: <CloseCircleOutlined /> },
  EXPIRED: { label: 'Đã hết hạn', color: 'default', icon: <ClockCircleOutlined /> },
  CANCELLED_BY_ADMIN: { label: 'Hủy bởi Admin', color: 'red', icon: <CloseCircleOutlined /> },
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
  const pageSize = 10;

  const filteredBookings = useMemo(() => {
    return mockBookings.filter(booking => {
      const matchesStatus = !status || booking.status === status;
      const matchesPayment = !paymentStatus || booking.paymentStatus === paymentStatus;
      const matchesSearch = !searchText || 
        booking.venueNameSnapshot.toLowerCase().includes(searchText.toLowerCase()) ||
        booking.id.toLowerCase().includes(searchText.toLowerCase());
      return matchesStatus && matchesPayment && matchesSearch;
    });
  }, [status, paymentStatus, searchText]);

  const data = {
    content: filteredBookings.slice((page - 1) * pageSize, page * pageSize),
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
        <Button
          type="primary"
          ghost
          icon={<EyeOutlined />}
          onClick={() => setSelectedBooking(record)}
          className="rounded-lg border-brand-green text-brand-green hover:bg-brand-green/5"
        >
          Chi tiết
        </Button>
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
          pagination={{
            current: page,
            pageSize,
            total: data.totalElements,
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
                    <Badge color="#10b981" />
                    <Text strong className="text-slate-700 text-xs uppercase tracking-wider">Thành công</Text>
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
                <Button className="h-11 px-6 rounded-xl font-bold border-slate-200 text-slate-500 hover:text-red-500 hover:border-red-200 transition-all">Hủy đơn</Button>
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
    </div>
  );
}
