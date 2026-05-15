import React, { useState } from 'react';
import { Typography, Form, Input, Button, Steps, Card, Space, message, Divider, Checkbox, Row, Col, TimePicker, InputNumber, Alert, Select, AutoComplete } from 'antd';
import { 
  UserOutlined, 
  ShopOutlined, 
  CheckCircleOutlined, 
  ArrowRightOutlined,
  ArrowLeftOutlined,
  SafetyCertificateOutlined,
  RocketOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  DollarOutlined
} from '@ant-design/icons';
import { MapPin, X, Search } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { PROVINCE_OPTIONS } from '../../constants/areas';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';
import dayjs from 'dayjs';
import axios from 'axios';

// Leaflet fix for Vite/Webpack
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = (L as any).icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIconRetina,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
(L as any).Marker.prototype.options.icon = DefaultIcon;

const { Title, Text, Paragraph } = Typography;

const UTILITIES = [
  { label: 'Wifi miễn phí', value: 'wifi' },
  { label: 'Bãi đỗ xe', value: 'parking' },
  { label: 'Tủ đồ riêng', value: 'locker' },
  { label: 'Căng tin / Giải khát', value: 'canteen' },
  { label: 'Nhà vệ sinh / Tắm', value: 'shower' },
  { label: 'Bán đồ cầu lông', value: 'rental' },
];

function LocationPicker({ position, setPosition }: { position: [number, number], setPosition: (p: [number, number]) => void }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position ? <Marker position={position} /> : null;
}

function MapController({ center }: { center: [number, number] }) {
  const map = useMap() as any;
  React.useEffect(() => {
    if (map) {
      map.setView(center, map.getZoom());
      // Giới hạn bản đồ trong phạm vi Việt Nam
      const bounds = [[8.18, 102.14], [23.39, 109.46]];
      map.setMaxBounds(bounds);
      map.setMinZoom(5);
    }
  }, [center, map]);
  return null;
}

export default function PartnerOnboardingPage() {
  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [position, setPosition] = useState<[number, number] | null>([10.762622, 106.660172]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [options, setOptions] = useState<{ value: string; label: string; lat: string; lon: string }[]>([]);

  // Thêm biến ref để quản lý debounce timer
  const searchTimeoutRef = React.useRef<any>(null);

  const fetchSuggestions = (value: string) => {
    if (!value || value.length < 3) {
      setOptions([]);
      return;
    }

    // Xóa timer cũ nếu người dùng vẫn đang gõ
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Đợi 800ms sau khi người dùng dừng gõ mới gửi request
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&countrycodes=vn&limit=5`,
          {
            headers: {
              'Accept-Language': 'vi',
              // Nominatim yêu cầu thông tin định danh nếu dùng nhiều, ở mức dev thì dùng mặc định trình duyệt
            }
          }
        );
        const data = await response.json();
        setOptions(data.map((item: any) => ({
          value: item.display_name,
          label: item.display_name,
          lat: item.lat,
          lon: item.lon,
        })));
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    }, 800);
  };

  const onSelectLocation = (value: string, option: any) => {
    const newPos: [number, number] = [parseFloat(option.lat), parseFloat(option.lon)];
    setPosition(newPos);
    message.success(`Đã trỏ đến: ${value}`);
  };

  const handleMapSearch = async (value: string) => {
    if (!value) return;
    setSearchLoading(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&countrycodes=vn&limit=1`);
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const newPos: [number, number] = [parseFloat(lat), parseFloat(lon)];
        setPosition(newPos);
        message.success(`Đã tìm thấy: ${data[0].display_name}`);
      } else {
        message.warning('Không tìm thấy địa điểm này trong lãnh thổ Việt Nam.');
      }
    } catch (error) {
      message.error('Lỗi khi tìm kiếm vị trí. Vui lòng thử lại sau.');
    } finally {
      setSearchLoading(false);
    }
  };

  const next = async () => {
    try {
      await form.validateFields();
      setCurrent(current + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (info) {
      message.error('Vui lòng hoàn thành các thông tin bắt buộc');
    }
  };

  const prev = () => {
    setCurrent(current - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onFinish = async (_values: any) => {
    // Lấy toàn bộ giá trị từ form, bao gồm các field đã bị ẩn (do dùng preserve={true})
    const values = form.getFieldsValue(true);
    console.log('--- SUBMITTING ONBOARDING DATA ---', values);

    if (!position) {
      message.error('Vui lòng chọn vị trí trên bản đồ');
      return;
    }

    try {
      setIsSubmitting(true);
      // Bước 1: Đăng ký tài khoản Chủ sân
      const authRes = await axios.post('http://localhost:8080/identity/api/v1/auth/register-owner', {
        fullName: values.ownerName, 
        email: values.email,
        phone: values.phone,
        level: 'PRO',
        password: values.password
      });
      
      // Sửa: Lấy token đúng cấu trúc { result: { access_token: "..." } }
      const token = authRes.data.result.access_token;

      // Bước 2: Khởi tạo thông tin Sân
      await axios.post('http://localhost:8080/venues/api/v1/venues/onboard', {
        venueName: values.venueName,
        address: values.address,
        city: values.city,
        courtCount: values.courtCount,
        utilities: values.utilities,
        latitude: position[0],
        longitude: position[1],
        openTime: values.openTime.format('HH:mm:00'),
        closeTime: values.closeTime.format('HH:mm:00'),
        pricing: values.pricing.map((p: any) => ({
          from: p.from.format('HH:mm:00'),
          to: p.to.format('HH:mm:00'),
          price: p.price
        }))
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      message.success('Đã gửi hồ sơ đăng ký thành công!');
      setCurrent(4);
    } catch (error: any) {
      console.error("Lỗi đăng ký:", error);
      const errorMsg = error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại!';
      message.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center py-12 px-6">
      <div className="w-full max-w-5xl flex items-center justify-between mb-12">
        <Link to="/partner" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-brand-green flex items-center justify-center text-white text-xl shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            🏸
          </div>
          <span className="text-xl font-black text-slate-900 tracking-tight">
            Badminton<span className="text-brand-green">Hub</span>
          </span>
        </Link>
        <Link to="/partner" className="text-sm font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1">
          <ArrowLeftOutlined /> Quay lại trang chủ
        </Link>
      </div>

      <div className="w-full max-w-4xl">
        <div className="mb-12 px-4">
          <Steps
            current={current}
            items={[
              { title: 'Chủ sở hữu', icon: <UserOutlined /> },
              { title: 'Cơ sở & Tiện ích', icon: <ShopOutlined /> },
              { title: 'Vị trí & Vận hành', icon: <EnvironmentOutlined /> },
              { title: 'Xác nhận', icon: <SafetyCertificateOutlined /> },
            ]}
          />
        </div>

        <Card className="rounded-[40px] shadow-2xl shadow-slate-200/50 border-none p-4 md:p-10 overflow-hidden">
          <Form form={form} layout="vertical" requiredMark={false} onFinish={onFinish} initialValues={{ utilities: ['wifi', 'parking'] }} preserve={true}>
            {current === 0 && (
              <div className="animate-in fade-in slide-in-from-bottom duration-500">
                <div className="mb-10 text-center max-w-md mx-auto">
                  <Title level={2} style={{ fontWeight: 900 }}>Thông tin cá nhân</Title>
                  <Text type="secondary" style={{ fontSize: 16 }}>Chúng tôi cần thông tin liên hệ chính thức của bạn để bắt đầu quy trình hợp tác.</Text>
                </div>
                
                <Row gutter={24}>
                  <Col span={24}>
                    <Form.Item name="ownerName" label={<Text strong>Họ và tên đầy đủ</Text>} rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
                      <Input size="large" placeholder="Nguyễn Văn A" className="h-14 rounded-2xl bg-slate-50 border-slate-100 focus:bg-white transition-all" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="phone" label={<Text strong>Số điện thoại</Text>} rules={[{ required: true, pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ' }]}>
                      <Input size="large" placeholder="0901234567" className="h-14 rounded-2xl bg-slate-50 border-slate-100" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="email" label={<Text strong>Email liên hệ</Text>} rules={[{ required: true, type: 'email', message: 'Email không hợp lệ' }]}>
                      <Input size="large" placeholder="partner@example.com" className="h-14 rounded-2xl bg-slate-50 border-slate-100" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="password" label={<Text strong>Mật khẩu đăng nhập</Text>} rules={[{ required: true, min: 6, message: 'Mật khẩu tối thiểu 6 ký tự' }]}>
                      <Input.Password size="large" placeholder="••••••••" className="h-14 rounded-2xl bg-slate-50 border-slate-100" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item 
                      name="confirmPassword" 
                      label={<Text strong>Xác nhận mật khẩu</Text>} 
                      dependencies={['password']}
                      rules={[
                        { required: true, message: 'Vui lòng xác nhận mật khẩu' },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                          },
                        }),
                      ]}
                    >
                      <Input.Password size="large" placeholder="••••••••" className="h-14 rounded-2xl bg-slate-50 border-slate-100" />
                    </Form.Item>
                  </Col>
                </Row>

                <Button type="primary" block onClick={next} className="h-16 mt-8 rounded-2xl bg-emerald-500 font-bold text-lg shadow-xl shadow-emerald-500/20 border-none">
                  Tiếp theo <ArrowRightOutlined />
                </Button>
              </div>
            )}

            {current === 1 && (
              <div className="animate-in fade-in slide-in-from-right duration-500">
                <div className="mb-10">
                  <Title level={2} style={{ fontWeight: 900 }}>Thông tin cơ sở & Tiện ích</Title>
                  <Text type="secondary">Cung cấp các thông tin cơ bản về sân cầu lông của bạn.</Text>
                </div>

                <Row gutter={24}>
                  <Col span={24}>
                    <Form.Item name="venueName" label={<Text strong>Tên cơ sở / Câu lạc bộ</Text>} rules={[{ required: true, message: 'Vui lòng nhập tên sân' }]}>
                      <Input size="large" placeholder="VD: Sân Cầu Lông Ngôi Sao" className="h-14 rounded-2xl bg-slate-50 border-slate-100" />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item name="address" label={<Text strong>Địa chỉ chi tiết</Text>} rules={[{ required: true }]}>
                      <Input size="large" placeholder="Số nhà, đường, phường/xã, quận/huyện..." className="h-14 rounded-2xl bg-slate-50 border-slate-100" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="courtCount" label={<Text strong>Số lượng sân (Capacity)</Text>} rules={[{ required: true }]}>
                      <InputNumber size="large" min={1} placeholder="10" className="w-full h-14 rounded-2xl bg-slate-50 border-slate-100 pt-3" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="city" label={<Text strong>Thành phố / Tỉnh</Text>} rules={[{ required: true }]}>
                      <Select 
                        size="large" 
                        placeholder="Chọn thành phố" 
                        className="h-14 w-full"
                        options={PROVINCE_OPTIONS}
                        showSearch
                        optionFilterProp="label"
                        style={{ borderRadius: '1rem' }}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Divider orientation={"left" as any}><Text strong className="text-slate-400">TIỆN ÍCH DỊCH VỤ</Text></Divider>
                
                <Form.Item name="utilities">
                  <Checkbox.Group className="w-full">
                    <Row gutter={[16, 16]}>
                      {UTILITIES.map(u => (
                        <Col span={12} md={8} key={u.value}>
                          <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-center gap-3">
                            <Checkbox value={u.value} />
                            <Text strong style={{ fontSize: 13 }}>{u.label}</Text>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </Checkbox.Group>
                </Form.Item>

                <div className="flex gap-4 mt-10">
                  <Button size="large" onClick={prev} className="h-16 px-8 rounded-2xl border-slate-200 font-bold">
                    Quay lại
                  </Button>
                  <Button type="primary" block onClick={next} className="h-16 rounded-2xl bg-emerald-500 font-bold text-lg border-none">
                    Tiếp theo
                  </Button>
                </div>
              </div>
            )}

            {current === 2 && (
              <div className="animate-in fade-in slide-in-from-right duration-500">
                <div className="mb-10">
                  <Title level={2} style={{ fontWeight: 900 }}>Vị trí & Vận hành</Title>
                  <Text type="secondary">Xác định vị trí chính xác trên bản đồ và cấu hình giờ mở cửa.</Text>
                </div>

                <Alert 
                  message={<Text strong>Hướng dẫn định vị</Text>}
                  description="Bạn có thể nhập địa chỉ để tìm kiếm hoặc nhấn chuột trực tiếp vào bản đồ để đánh dấu vị trí sân."
                  type="info"
                  showIcon
                  className="mb-6 rounded-2xl"
                  icon={<EnvironmentOutlined />}
                />

                <div className="mt-8 mb-4">
                  <AutoComplete
                    options={options}
                    onSearch={fetchSuggestions}
                    onSelect={onSelectLocation}
                    style={{ width: '100%' }}
                  >
                    <Input.Search 
                      placeholder="Nhập địa chỉ hoặc tên khu vực để tìm nhanh... (VD: Lê Văn Lương, Hà Nội)" 
                      enterButton={
                        <Button type="primary" className="bg-slate-900 border-none h-full px-6 rounded-r-2xl flex items-center gap-2">
                          <Search size={26} /> Tìm vị trí
                        </Button>
                      }
                      size="large"
                      loading={searchLoading}
                      onSearch={handleMapSearch}
                      className="h-14 rounded-2xl overflow-hidden shadow-sm border-none"
                      style={{ borderRadius: '1rem' }}
                    />
                  </AutoComplete>
                </div>

                <div className="h-[450px] rounded-3xl overflow-hidden border-4 border-slate-100 mb-8 z-0 relative">
                  <MapContainer 
                    center={position || [10.762622, 106.660172]} 
                    zoom={13} 
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LocationPicker position={position} setPosition={setPosition} />
                    <MapController center={position} />
                  </MapContainer>
                  {position && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg z-[1000] border border-slate-200 flex items-center gap-2">
                      <MapPin size={16} className="text-emerald-500" />
                      <Text strong style={{ fontSize: 11 }}>LAT: {position[0].toFixed(6)} | LNG: {position[1].toFixed(6)}</Text>
                    </div>
                  )}
                </div>

                <Row gutter={24}>
                  <Col span={24}>
                    <div className="p-6 rounded-[32px] bg-slate-50 border border-slate-100 mb-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center text-brand-green">
                          <ClockCircleOutlined />
                        </div>
                        <div>
                          <Text strong className="text-lg">Thời gian vận hành</Text>
                          <p className="text-xs text-slate-400 mb-0">Thiết lập giờ mở cửa và đóng cửa của cơ sở</p>
                        </div>
                      </div>
                      
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item name="openTime" label={<Text strong>Giờ mở cửa</Text>} rules={[{ required: true }]}>
                            <TimePicker format="HH:mm" className="h-14 w-full rounded-2xl border-white bg-white" placeholder="05:00" />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item name="closeTime" label={<Text strong>Giờ đóng cửa</Text>} rules={[{ required: true }]}>
                            <TimePicker format="HH:mm" className="h-14 w-full rounded-2xl border-white bg-white" placeholder="23:00 (hoặc 00:00)" />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Alert 
                        message={<Text style={{ fontSize: 12 }}>Lưu ý: Nếu giờ đóng cửa nhỏ hơn giờ mở cửa, hệ thống sẽ tự động hiểu là sang ngày hôm sau (qua đêm).</Text>}
                        type="warning"
                        className="rounded-xl border-none bg-amber-50"
                      />
                    </div>
                  </Col>

                  <Col span={24}>
                    <div className="p-6 rounded-[32px] bg-white border border-slate-100 mb-8 shadow-sm">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                            <DollarOutlined />
                          </div>
                          <div>
                            <Text strong className="text-lg">Bảng giá linh hoạt</Text>
                            <p className="text-xs text-slate-400 mb-0">Thiết lập giá tiền khác nhau cho từng khung giờ (ví dụ: giờ cao điểm)</p>
                          </div>
                        </div>
                      </div>

                      <Form.List 
                        name="pricing" 
                        initialValue={[{ 
                          from: dayjs('05:00', 'HH:mm'), 
                          to: dayjs('17:00', 'HH:mm'), 
                          price: 50000 
                        }]}
                      >
                        {(fields, { add, remove }) => (
                          <>
                            {fields.map(({ key, name, ...restField }) => (
                              <div key={key} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-4 animate-in fade-in zoom-in duration-300">
                                <Row gutter={12} align="middle">
                                  <Col span={24}>
                                    <div className="flex items-center gap-4">
                                      <div className="flex-1">
                                        <Text type="secondary" className="text-[10px] uppercase tracking-wider mb-1 block">Khung giờ</Text>
                                        <div className="flex items-center gap-2">
                                          <Form.Item {...restField} name={[name, 'from']} rules={[{ required: true }]} noStyle>
                                            <TimePicker format="HH:mm" placeholder="Từ" className="flex-1 h-11 rounded-xl bg-white border-slate-200" />
                                          </Form.Item>
                                          <Text type="secondary" className="px-1">—</Text>
                                          <Form.Item {...restField} name={[name, 'to']} rules={[{ required: true }]} noStyle>
                                            <TimePicker format="HH:mm" placeholder="Đến" className="flex-1 h-11 rounded-xl bg-white border-slate-200" />
                                          </Form.Item>
                                        </div>
                                      </div>
                                      <div className="w-[200px]">
                                        <Text type="secondary" className="text-[10px] uppercase tracking-wider mb-1 block">Giá thuê (vnđ/giờ)</Text>
                                        <Form.Item {...restField} name={[name, 'price']} rules={[{ required: true }]} noStyle>
                                          <InputNumber 
                                            placeholder="50,000" 
                                            className="w-full h-11 rounded-xl font-bold text-brand-green" 
                                            formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            parser={v => v!.replace(/\$\s?|(,*)/g, '')}
                                            addonAfter={<span className="text-[10px] font-normal text-slate-400">đ/giờ</span>}
                                          />
                                        </Form.Item>
                                      </div>
                                      <div className="pt-5">
                                        <Button 
                                          type="text" 
                                          danger 
                                          shape="circle"
                                          icon={<X size={18} />} 
                                          onClick={() => remove(name)} 
                                          disabled={fields.length === 1}
                                          className="hover:bg-red-50 flex items-center justify-center"
                                        />
                                      </div>
                                    </div>
                                  </Col>
                                </Row>
                              </div>
                            ))}
                            <Button 
                              type="dashed" 
                              onClick={() => add()} 
                              block 
                              icon={<RocketOutlined />} 
                              className="h-12 rounded-xl border-slate-200 text-slate-500 hover:text-brand-green hover:border-brand-green"
                            >
                              Thêm khung giờ & giá mới
                            </Button>
                          </>
                        )}
                      </Form.List>
                    </div>
                  </Col>
                </Row>

                <div className="flex gap-4 mt-10">
                  <Button size="large" onClick={prev} className="h-16 px-8 rounded-2xl border-slate-200 font-bold">
                    Quay lại
                  </Button>
                  <Button type="primary" block onClick={next} className="h-16 rounded-2xl bg-emerald-500 font-bold text-lg border-none">
                    Tiếp theo
                  </Button>
                </div>
              </div>
            )}

            {current === 3 && (
              <div className="animate-in fade-in slide-in-from-right duration-500 text-center py-6">
                <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center text-5xl mx-auto mb-8">
                  <RocketOutlined />
                </div>
                <Title level={2} style={{ marginBottom: 12, fontWeight: 900 }}>Gửi hồ sơ xét duyệt</Title>
                <Paragraph className="text-slate-500 text-lg mb-10 max-w-lg mx-auto">
                  Bạn đã hoàn thành việc cung cấp thông tin. BadmintonHub sẽ xem xét hồ sơ và liên hệ sớm nhất có thể.
                </Paragraph>
                
                <div className="flex flex-col gap-4">
                  <Button type="primary" size="large" block onClick={form.submit} loading={isSubmitting} className="h-16 rounded-2xl bg-emerald-500 font-bold text-lg shadow-xl shadow-emerald-500/20 border-none">
                    Xác nhận & Gửi hồ sơ
                  </Button>
                  <Button type="link" onClick={() => setCurrent(0)} disabled={isSubmitting} className="text-slate-400 font-bold">
                    Quay lại bước đầu tiên
                  </Button>
                </div>
              </div>
            )}

            {current === 4 && (
              <div className="animate-in zoom-in duration-500 text-center py-12">
                <div className="w-28 h-28 bg-emerald-500 text-white rounded-[40px] flex items-center justify-center text-6xl mx-auto mb-8 shadow-2xl shadow-emerald-500/30">
                  <CheckCircleOutlined />
                </div>
                <Title level={2} style={{ marginBottom: 16, fontWeight: 900 }}>Đăng ký thành công!</Title>
                <Paragraph className="text-slate-500 text-xl mb-12 max-w-sm mx-auto leading-relaxed">
                  Chuyên viên của chúng tôi sẽ liên hệ với bạn sớm nhất có thể.
                </Paragraph>
                <Button 
                  type="primary" 
                  size="large" 
                  onClick={() => navigate('/')} 
                  className="h-20 px-16 rounded-2xl bg-slate-900 border-none font-bold text-xl"
                >
                  Trở về trang chủ
                </Button>
              </div>
            )}
          </Form>
        </Card>
      </div>
    </div>
  );
}
