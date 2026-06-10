import { useMemo, useState, useEffect, useRef } from 'react';
import { 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  TimePicker, 
  InputNumber, 
  Radio, 
  Button, 
  Card, 
  Typography, 
  Space, 
  Row, 
  Col, 
  Divider, 
  message,
  Alert,
  Tag,
  Slider,
  Avatar,
  Modal,
  Checkbox,
  Spin
} from 'antd';
import { 
  Swords, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Trophy, 
  Banknote, 
  Info,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { BRAND } from '../../theme/antdTheme';
import { LEVEL_OPTIONS } from '../../constants/levels';
import dayjs from 'dayjs';
import { communityApi } from '../../services/communityApi';
import { venueApi } from '../../services/venueApi';
import type { Venue } from '../../types/venue.types';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function CreateMatchPage() {
  const user = useAuthStore((state) => state.user);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [venueModalOpen, setVenueModalOpen] = useState(false);
  const [venueLoading, setVenueLoading] = useState(false);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [venueSearch, setVenueSearch] = useState('');
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [draftVenue, setDraftVenue] = useState<Venue | null>(null);
  const hasLoadedVenuesRef = useRef(false);

  useEffect(() => {
    if (hasLoadedVenuesRef.current) return;
    hasLoadedVenuesRef.current = true;
    const fetchVenues = async () => {
      setVenueLoading(true);
      try {
        const data = await venueApi.getVenues({ size: 200 });
        setVenues(data || []);
      } catch (error) {
        message.error('Không thể tải danh sách sân');
      } finally {
        setVenueLoading(false);
      }
    };
    fetchVenues();
  }, []);

  const filteredVenues = useMemo(() => {
    const q = venueSearch.trim().toLowerCase();
    if (!q) return venues;
    return venues.filter((v) =>
      `${v.name} ${v.address} ${v.ward || ''} ${v.city || ''}`.toLowerCase().includes(q),
    );
  }, [venueSearch, venues]);

  const mapUrl = useMemo(() => {
    const center = draftVenue || selectedVenue || venues.find((v) => v.latitude && v.longitude) || null;
    if (!center?.latitude || !center?.longitude) return '';
    return `https://www.openstreetmap.org/export/embed.html?bbox=106.55%2C10.68%2C106.88%2C10.93&layer=mapnik&marker=${center.latitude}%2C${center.longitude}`;
  }, [draftVenue, selectedVenue, venues]);

  const mapLevelToApi = (uiLevel?: string): 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' => {
    if (!uiLevel) return 'INTERMEDIATE';
    if (['BEGINNER', 'LOW_MEDIUM'].includes(uiLevel)) return 'BEGINNER';
    if (['MEDIUM', 'MEDIUM_STRONG', 'STRONG'].includes(uiLevel)) return 'INTERMEDIATE';
    return 'ADVANCED';
  };

  const formatHourToTime = (hourValue: number): { hour: number; minute: number } => {
    const hour = Math.floor(hourValue);
    const minute = Math.round((hourValue % 1) * 60);
    return { hour, minute };
  };

  const onFinish = async (values: any) => {
    if (!values.date || !values.timeRange || values.timeRange.length !== 2) {
      message.error('Vui lòng chọn ngày và khung giờ chơi');
      return;
    }

    const startParts = formatHourToTime(values.timeRange[0]);
    const endParts = formatHourToTime(values.timeRange[1]);

    const startTime = dayjs(values.date)
      .hour(startParts.hour)
      .minute(startParts.minute)
      .second(0)
      .millisecond(0);
    const endTime = dayjs(values.date)
      .hour(endParts.hour)
      .minute(endParts.minute)
      .second(0)
      .millisecond(0);

    if (!endTime.isAfter(startTime)) {
      message.error('Giờ kết thúc phải sau giờ bắt đầu');
      return;
    }

    setLoading(true);
    try {
      const selectedLevels: string[] = Array.isArray(values.level) ? values.level : values.level ? [values.level] : [];
      const mappedLevels = Array.from(
        new Set(selectedLevels),
      );
      const primaryLevel = mappedLevels[0] || 'BEGINNER';

      await communityApi.createMatchPost({
        title: values.title,
        description: values.description || '',
        level: primaryLevel,
        levels: mappedLevels,
        startTime: startTime.format('YYYY-MM-DDTHH:mm:ss'),
        endTime: endTime.format('YYYY-MM-DDTHH:mm:ss'),
        venueId: values.venueId || undefined,
        locationText: values.venue,
        latitude: selectedVenue?.latitude,
        longitude: selectedVenue?.longitude,
        maxParticipants: Number(values.totalPlayers || 2),
        joinMode: values.joinMode || 'APPROVAL',
        visibility: 'PUBLIC',
        genderPreference: values.gender,
        paymentType: values.priceType,
        contactPhone: values.contactPhone,
      });

      message.success('Tạo kèo thành công! Kèo của bạn đã được đăng lên cộng đồng.');
      navigate('/user/challenges');
    } catch (error: any) {
      const apiMessage = error?.response?.data?.message || error?.response?.data?.error || error?.message;
      message.error(apiMessage || 'Không thể tạo kèo. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-700">
      <div className="mb-8">
        <Title level={2} className="!mb-1 flex items-center gap-3">
          <div className="p-2 bg-brand-primary/10 rounded-xl">
            <Trophy className="text-brand-primary" size={28} />
          </div>
          Tạo kèo giao lưu mới
        </Title>
        <Text type="secondary" className="text-lg">Tổ chức trận đấu của bạn và kết nối với những người chơi khác</Text>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        requiredMark="optional"
        initialValues={{
          gender: 'ANY',
          priceType: 'SHARE',
          joinMode: 'APPROVAL',
          contactPhone: user?.phone || '',
          totalPlayers: 2,
          timeRange: [18, 20],
          level: []
        }}
      >
        <Row gutter={[32, 32]}>
          {/* Form Section */}
          <Col xs={24} lg={15}>
            <Card bordered={false} className="shadow-sm rounded-2xl overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-brand-primary/5 to-transparent p-1" />
              <div className="p-8">
                {/* General Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1.5 h-6 bg-brand-primary rounded-full" />
                    <Title level={4} className="!mb-0">Thông tin cơ bản</Title>
                  </div>
                  
                  <Form.Item
                    label={<span className="font-bold text-gray-600">Tiêu đề kèo đấu</span>}
                    name="title"
                    rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
                  >
                    <Input 
                      placeholder="Ví dụ: Giao lưu sân Viettel sáng CN" 
                      className="h-12 rounded-lg text-base border-gray-200 hover:border-brand-primary focus:border-brand-primary transition-all"
                    />
                  </Form.Item>

                  <Row gutter={24}>
                    <Col xs={24} md={16}>
                      <Form.Item
                        label={<span className="font-bold text-gray-600">Địa điểm (Sân)</span>}
                        name="venue"
                        rules={[{ required: true, message: 'Nhập địa điểm' }]}
                      >
                        <Input 
                          placeholder="Tên sân, số sân..." 
                          className="h-12 rounded-lg border-gray-200 hover:border-brand-primary transition-all" 
                          prefix={<MapPin size={18} className="text-brand-green mr-2" />} 
                          readOnly
                          onClick={() => {
                            setDraftVenue(selectedVenue);
                            setVenueSearch('');
                            setVenueModalOpen(true);
                          }}
                        />
                      </Form.Item>
                      <Form.Item name="venueId" hidden>
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item
                        label={<span className="font-bold text-gray-600">Ngày thi đấu</span>}
                        name="date"
                        rules={[{ required: true, message: 'Chọn ngày' }]}
                      >
                        <DatePicker 
                          className="w-full h-12 rounded-lg border-gray-200 hover:border-brand-primary transition-all" 
                          placeholder="Chọn ngày"
                          format="DD/MM/YYYY"
                          disabledDate={(current) => current && current < dayjs().startOf('day')}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>

                <Divider className="my-8" />

                {/* Match Requirements */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1.5 h-6 bg-brand-green rounded-full" />
                    <Title level={4} className="!mb-0">Yêu cầu & Chi phí</Title>
                  </div>

                  <Row gutter={24}>
                    {/* Time Selection */}
                    <Col xs={24} md={12}>
                      <Form.Item label={<span className="font-bold text-gray-600">Khung giờ chơi</span>} required>
                        <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 mt-2">
                          <Form.Item noStyle shouldUpdate={(prev, curr) => prev.timeRange !== curr.timeRange}>
                            {() => {
                              const range = form.getFieldValue('timeRange') || [18, 20];
                              const formatTime = (val: number) => {
                                const h = Math.floor(val);
                                const m = Math.round((val % 1) * 60);
                                return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
                              };
                              return (
                                <div className="flex justify-between items-center mb-8">
                                  <div className="text-center">
                                    <div className="text-[10px] text-app-muted uppercase font-bold tracking-widest mb-1">Bắt đầu</div>
                                    <Text className="text-2xl font-black text-brand-primary block px-4 py-1 bg-white rounded-xl shadow-sm border border-gray-50">
                                      {formatTime(range[0])}
                                    </Text>
                                  </div>
                                  <div className="flex flex-col items-center">
                                    <div className="h-0.5 w-12 bg-gray-200 rounded-full mb-1" />
                                    <Text className="text-[11px] text-app-muted font-bold italic">{range[1] - range[0]}h</Text>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-[10px] text-app-muted uppercase font-bold tracking-widest mb-1">Kết thúc</div>
                                    <Text className="text-2xl font-black text-brand-green block px-4 py-1 bg-white rounded-xl shadow-sm border border-gray-50">
                                      {formatTime(range[1])}
                                    </Text>
                                  </div>
                                </div>
                              );
                            }}
                          </Form.Item>
                          <Form.Item
                            name="timeRange"
                            noStyle
                          >
                            <Slider 
                              range 
                              min={0} 
                              max={24} 
                              step={0.25}
                              marks={{
                                0: '00:00',
                                12: '12:00',
                                24: '24:00'
                              }}
                              className="app-slider"
                              tooltip={{
                                formatter: (val) => {
                                  const h = Math.floor(val!);
                                  const m = Math.round((val! % 1) * 60);
                                  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
                                }
                              }}
                            />
                          </Form.Item>
                        </div>
                      </Form.Item>
                    </Col>

                    {/* Participants & Gender */}
                    <Col xs={24} md={12}>
                      <Space direction="vertical" size={20} className="w-full">
                        <Form.Item
                          label={<span className="font-bold text-gray-600">Số lượng người cần tìm</span>}
                          name="totalPlayers"
                          rules={[{ required: true, message: 'Nhập số lượng' }]}
                        >
                          <InputNumber 
                            min={1} 
                            max={20} 
                            precision={0 as any}
                            step={1}
                            className="w-full h-12 rounded-lg flex items-center bg-white border-gray-200 hover:border-brand-primary transition-all" 
                            prefix={<Users size={18} className="text-brand-green mr-2" />} 
                            onKeyPress={(event) => {
                              if (!/[0-9]/.test(event.key)) {
                                event.preventDefault();
                              }
                            }}
                          />
                        </Form.Item>
                        
                        <Form.Item
                          label={<span className="font-bold text-gray-600">Yêu cầu giới tính</span>}
                          name="gender"
                        >
                          <Radio.Group 
                            block 
                            optionType="button" 
                            buttonStyle="solid" 
                            className="gender-segmented-group"
                          >
                            <Row gutter={0} className="w-full bg-gray-100 p-1 rounded-xl">
                              <Col span={8}>
                                <Radio.Button value="ANY" className="w-full text-center h-10 border-none rounded-lg font-medium flex items-center justify-center">Cả hai</Radio.Button>
                              </Col>
                              <Col span={8}>
                                <Radio.Button value="MALE" className="w-full text-center h-10 border-none rounded-lg font-medium flex items-center justify-center">Chỉ Nam</Radio.Button>
                              </Col>
                              <Col span={8}>
                                <Radio.Button value="FEMALE" className="w-full text-center h-10 border-none rounded-lg font-medium flex items-center justify-center">Chỉ Nữ</Radio.Button>
                              </Col>
                            </Row>
                          </Radio.Group>
                        </Form.Item>
                      </Space>
                    </Col>
                  </Row>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <Form.Item
                      label={<span className="font-bold text-gray-600">Trình độ yêu cầu</span>}
                      name="level"
                      rules={[{ required: true, message: 'Chọn ít nhất 1 trình độ' }]}
                    >
                      <Select
                        mode="multiple"
                        maxTagCount="responsive"
                        placeholder="Chọn trình độ..."
                        className="w-full h-12 rounded-lg"
                        options={LEVEL_OPTIONS}
                      />
                    </Form.Item>

                    <Form.Item
                      label={<span className="font-bold text-gray-600">Hình thức đóng phí</span>}
                      name="priceType"
                    >
                      <Select className="w-full h-12 rounded-lg">
                        <Option value="SHARE">Chia sẻ (Campuchia)</Option>
                        <Option value="FIXED">Cố định (Thu theo người)</Option>
                        <Option value="FREE">Miễn phí</Option>
                      </Select>
                    </Form.Item>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                    <Form.Item
                      label={<span className="font-bold text-gray-600">Cách tham gia</span>}
                      name="joinMode"
                    >
                      <Select className="w-full h-12 rounded-lg">
                        <Option value="APPROVAL">Cần chủ kèo duyệt</Option>
                        <Option value="OPEN">Tự do tham gia (auto duyệt)</Option>
                      </Select>
                    </Form.Item>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                    <Form.Item
                      label={<span className="font-bold text-gray-600">Số điện thoại liên hệ</span>}
                      name="contactPhone"
                      rules={[
                        { required: true, message: 'Vui lòng nhập số điện thoại liên hệ' },
                        { pattern: /^0\d{9,10}$/, message: 'Số điện thoại không hợp lệ' },
                      ]}
                    >
                      <Input
                        placeholder="VD: 0901234567"
                        className="h-12 rounded-lg"
                        maxLength={11}
                      />
                    </Form.Item>
                  </div>

                  {/* Dynamic Price Input */}
                  <Form.Item noStyle shouldUpdate={(prev, curr) => prev.priceType !== curr.priceType}>
                    {() => {
                      const type = form.getFieldValue('priceType');
                      if (type === 'FIXED') {
                        return (
                          <div className="bg-brand-green/5 p-6 rounded-2xl border border-brand-green/10 mt-4 animate-in slide-in-from-top-2 duration-300">
                            <Form.Item
                              label={<span className="text-brand-green font-bold">Mức giá mỗi người</span>}
                              name="price"
                              rules={[
                                { required: true, message: 'Vui lòng nhập giá' },
                                { type: 'number', min: 0, message: 'Giá không thể âm' }
                              ]}
                              className="mb-0"
                            >
                              <InputNumber
                                className="w-full h-12 rounded-lg text-lg font-bold"
                                min={0}
                                precision={0 as any}
                                step={1000}
                                formatter={(value) => value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}
                                parser={(value) => value?.replace(/[^\d]/g, '') as any}
                                addonAfter={<span className="text-brand-green font-black">VNĐ</span>}
                                placeholder="0"
                                controls={false}
                                style={{ width: '100%' }}
                                onKeyPress={(event) => {
                                  if (!/[0-9]/.test(event.key)) {
                                    event.preventDefault();
                                  }
                                }}
                              />
                            </Form.Item>
                          </div>
                        );
                      }
                      return null;
                    }}
                  </Form.Item>
                </div>

                <Divider className="my-8" />

                {/* Additional Info */}
                <Form.Item
                  label={<span className="font-bold text-gray-600">Mô tả thêm (Tùy chọn)</span>}
                  name="description"
                >
                  <TextArea 
                    rows={4} 
                    placeholder="Thông tin thêm về số sân, lưu ý..." 
                    className="rounded-xl border-gray-200 hover:border-brand-primary focus:border-brand-primary transition-all" 
                  />
                </Form.Item>

                <Form.Item className="mt-8 mb-0">
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    size="large" 
                    block 
                    loading={loading}
                    className="h-14 rounded-xl text-lg font-bold shadow-lg shadow-brand-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all"
                  >
                    Tạo kèo ngay
                  </Button>
                </Form.Item>
              </div>
            </Card>
          </Col>

          {/* Preview Section */}
          <Col xs={24} lg={9}>
            <Space direction="vertical" size={24} className="w-full sticky top-8">
              <Card 
                bordered={false} 
                className="shadow-xl rounded-2xl overflow-hidden border border-gray-100"
                bodyStyle={{ padding: 0 }}
              >
                <div className="bg-gradient-to-br from-brand-primary to-brand-green p-6 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12">
                    <Trophy size={80} />
                  </div>
                  <div className="relative z-10 flex items-center gap-2">
                    <Swords size={20} />
                    <Text className="text-white/80 font-bold tracking-wider uppercase text-xs">Xem trước kèo đấu</Text>
                  </div>
                </div>
                
                <div className="p-8">
                  <Form.Item noStyle shouldUpdate>
                    {() => {
                      const values = form.getFieldsValue(true);
                      
                      return (
                        <div className="space-y-6">
                          <div className="flex items-start gap-4">
                            <Avatar size={56} src={user?.avatarUrl} className="border-2 border-brand-green/20 shadow-md" />
                            <div>
                              <Title level={5} className="!mb-1">{values.title || 'Tiêu đề kèo đấu'}</Title>
                              <Text type="secondary" className="text-sm">Đăng bởi: <Text strong className="text-gray-700">{user?.fullName || 'Bạn'}</Text></Text>
                            </div>
                          </div>

                          <Divider className="my-0 opacity-50" />

                          <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                                <Calendar size={16} className="text-brand-green" />
                              </div>
                              <Text className="text-sm font-medium">{values.date ? dayjs(values.date).format('DD/MM/YYYY') : 'Ngày chưa chọn'}</Text>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                                <Clock size={16} className="text-brand-green" />
                              </div>
                              <Text className="text-sm font-medium">
                                {values.timeRange ? `${Math.floor(values.timeRange[0]).toString().padStart(2, '0')}:${Math.round((values.timeRange[0] % 1) * 60).toString().padStart(2, '0')} - ${Math.floor(values.timeRange[1]).toString().padStart(2, '0')}:${Math.round((values.timeRange[1] % 1) * 60).toString().padStart(2, '0')}` : '18:00 - 20:00'}
                              </Text>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                                <MapPin size={16} className="text-brand-green" />
                              </div>
                              <Text className="text-sm font-medium line-clamp-1">{values.venue || 'Địa điểm chơi cầu...'}</Text>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                                <Users size={16} className="text-brand-green" />
                              </div>
                              <Text className="text-sm font-medium">Cần tìm: <Text strong>{values.totalPlayers || 2}</Text> người</Text>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 pt-2">
                            {Array.isArray(values.level) && values.level.length > 0 ? (
                              <Tag color="green" className="rounded-full px-4 py-0.5 border-none bg-brand-green/10 text-brand-green font-medium">
                                {values.level.map((lv: string) => LEVEL_OPTIONS.find(opt => opt.value === lv)?.label || lv).join(', ')}
                              </Tag>
                            ) : (
                              <Tag className="rounded-full px-4 py-0.5 border-none bg-gray-100 text-gray-500">Chưa chọn trình độ</Tag>
                            )}
                            <Tag color="orange" className="rounded-full px-4 py-0.5 border-none bg-brand-primary/10 text-brand-primary font-medium">
                              {values.gender === 'ANY' ? 'Nam & Nữ' : values.gender === 'MALE' ? 'Chỉ Nam' : 'Chỉ Nữ'}
                            </Tag>
                          </div>

                          <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 flex items-center justify-between shadow-inner">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center">
                                <Banknote size={20} className="text-brand-primary" />
                              </div>
                              <Text strong className="text-gray-600">Chi phí dự kiến</Text>
                            </div>
                            <Text strong className="text-xl text-brand-primary">
                              {values.priceType === 'FREE' ? 'Miễn phí' : 
                               values.priceType === 'FIXED' ? `${(values.price || 0).toLocaleString()}đ` : 
                               'Chia sẻ'}
                            </Text>
                          </div>
                        </div>
                      );
                    }}
                  </Form.Item>
                </div>
              </Card>

              <Card bordered={false} className="bg-brand-green/5 border border-brand-green/10 rounded-2xl shadow-sm">
                <div className="flex gap-3">
                  <Info className="text-brand-green shrink-0" size={24} />
                  <div className="space-y-2">
                    <Text strong className="block text-brand-green">Mẹo cho chủ kèo</Text>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1.5 leading-relaxed">
                      <li>Mô tả rõ trình độ để tìm được đối thủ "vừa miếng".</li>
                      <li>Sử dụng tiêu đề thu hút như <Text italic className="text-brand-primary">"Giao lưu vui vẻ"</Text>.</li>
                      <li>Nên đăng kèo trước ít nhất <Text strong>1-2 ngày</Text> để dễ đủ người.</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </Space>
          </Col>
        </Row>
      </Form>

      <Modal
        open={venueModalOpen}
        onCancel={() => setVenueModalOpen(false)}
        width={1200}
        footer={null}
        title={(
          <div>
            <div className="font-bold text-xl">Chọn sân</div>
            <div className="text-sm text-gray-500 mt-1">Tìm và chọn sân để tạo kèo - {venues.length} sân</div>
          </div>
        )}
      >
        <Input
          size="large"
          placeholder="Tìm theo tên, địa chỉ, quận..."
          value={venueSearch}
          onChange={(e) => setVenueSearch(e.target.value)}
          style={{ marginBottom: 12 }}
        />
        <div style={{ border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', minHeight: 520 }}>
            <div style={{ maxHeight: 520, overflowY: 'auto' }}>
              {venueLoading ? (
                <div className="h-full min-h-[300px] flex items-center justify-center">
                  <Spin />
                </div>
              ) : filteredVenues.map((v) => {
                const checked = draftVenue?.id === v.id;
                return (
                  <div
                    key={v.id}
                    style={{ padding: '14px 16px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }}
                    onClick={() => setDraftVenue(v)}
                  >
                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <Checkbox checked={checked} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 15 }}>{v.name}</div>
                        <div style={{ color: '#64748b', marginTop: 4 }}>{v.address}</div>
                        <Tag style={{ marginTop: 8 }}>{v.ward || v.city || 'Khác'}</Tag>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ borderLeft: '1px solid #e2e8f0', background: '#f8fafc' }}>
              {mapUrl ? (
                <iframe title="venue-map-picker" src={mapUrl} style={{ width: '100%', height: '100%', border: 0 }} />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">Không có dữ liệu bản đồ</div>
              )}
            </div>
          </div>
          <div style={{ padding: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="text-gray-500 text-sm">{draftVenue ? `Đã chọn: ${draftVenue.name}` : 'Chưa chọn sân'}</span>
            <Space>
              <Button onClick={() => setVenueModalOpen(false)}>Hủy</Button>
              <Button
                type="primary"
                onClick={() => {
                  setSelectedVenue(draftVenue || null);
                  form.setFieldsValue({
                    venue: draftVenue ? `${draftVenue.name} - ${draftVenue.address}` : '',
                    venueId: draftVenue?.id,
                  });
                  setVenueModalOpen(false);
                }}
              >
                Xác nhận
              </Button>
            </Space>
          </div>
        </div>
      </Modal>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-in {
          animation: fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        
        .app-slider .ant-slider-rail { background-color: #f1f5f9 !important; height: 6px !important; }
        .app-slider .ant-slider-track { background-color: var(--brand-primary) !important; height: 6px !important; }
        .app-slider .ant-slider-handle::after { 
          width: 20px !important; 
          height: 20px !important; 
          background: white !important;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15) !important;
          border: 2px solid var(--brand-primary) !important;
        }
        
        .gender-segmented-group .ant-radio-button-wrapper {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          color: #64748b !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .gender-segmented-group .ant-radio-button-wrapper-checked {
          background: white !important;
          color: var(--brand-primary) !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08) !important;
          font-weight: 700 !important;
        }
        .gender-segmented-group .ant-radio-button-wrapper::before {
          display: none !important;
        }

        .ant-select-selector, .ant-input, .ant-input-number, .ant-picker {
          border-radius: 12px !important;
          border-color: #e2e8f0 !important;
          transition: all 0.2s ease !important;
        }
        .ant-select-selector:hover, .ant-input:hover, .ant-input-number:hover, .ant-picker:hover {
          border-color: var(--brand-primary) !important;
        }
        .ant-select-focused .ant-select-selector, .ant-input-focused, .ant-input-number-focused, .ant-picker-focused {
          border-color: var(--brand-primary) !important;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1) !important;
        }
      `}} />
    </div>
  );
}
