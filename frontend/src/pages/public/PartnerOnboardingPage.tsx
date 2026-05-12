import React, { useState } from 'react';
import { Typography, Form, Input, Button, Steps, Card, Space, message, Divider, Checkbox, Row, Col, TimePicker, InputNumber, Alert } from 'antd';
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
import { MapPin } from 'lucide-react';
import { BRAND } from '../../theme/antdTheme';
import { useNavigate, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';

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
  { label: 'Thuê vợt / Cầu', value: 'rental' },
];

function LocationPicker({ position, setPosition }: { position: [number, number], setPosition: (p: [number, number]) => void }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position ? <Marker position={position} /> : null;
}

export default function PartnerOnboardingPage() {
  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [position, setPosition] = useState<[number, number]>([10.762622, 106.660172]);

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

  const onFinish = () => {
    message.success('Đã gửi hồ sơ đăng ký thành công!');
    setCurrent(4);
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
          <Form form={form} layout="vertical" requiredMark={false} onFinish={onFinish} initialValues={{ utilities: ['wifi', 'parking'] }}>
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
                      <Input size="large" placeholder="Hồ Chí Minh" className="h-14 rounded-2xl bg-slate-50 border-slate-100" />
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
                  description="Hãy nhấn chuột vào bản đồ bên dưới để đánh dấu chính xác vị trí sân của bạn."
                  type="info"
                  showIcon
                  className="mb-6 rounded-2xl"
                  icon={<EnvironmentOutlined />}
                />

                <div className="h-[400px] rounded-3xl overflow-hidden border-4 border-slate-100 mb-8 z-0 relative">
                  <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LocationPicker position={position} setPosition={setPosition} />
                  </MapContainer>
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg z-[1000] border border-slate-200 flex items-center gap-2">
                    <MapPin size={16} className="text-emerald-500" />
                    <Text strong style={{ fontSize: 11 }}>LAT: {position[0].toFixed(6)} | LNG: {position[1].toFixed(6)}</Text>
                  </div>
                </div>

                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item name="hours" label={<Text strong><ClockCircleOutlined /> Giờ hoạt động</Text>} rules={[{ required: true }]}>
                      <TimePicker.RangePicker format="HH:mm" className="h-14 w-full rounded-2xl bg-slate-50 border-slate-100" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="basePrice" label={<Text strong><DollarOutlined /> Giá thuê cơ bản (vnđ/giờ)</Text>} rules={[{ required: true }]}>
                      <InputNumber 
                        size="large" 
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                        placeholder="50,000" 
                        className="w-full h-14 rounded-2xl bg-slate-50 border-slate-100 pt-3" 
                      />
                    </Form.Item>
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
                  <Button type="primary" size="large" block onClick={onFinish} className="h-16 rounded-2xl bg-emerald-500 font-bold text-lg shadow-xl shadow-emerald-500/20 border-none">
                    Xác nhận & Gửi hồ sơ
                  </Button>
                  <Button type="link" onClick={() => setCurrent(0)} className="text-slate-400 font-bold">
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
