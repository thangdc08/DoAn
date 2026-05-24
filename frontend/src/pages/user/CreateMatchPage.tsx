import { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Radio,
  Button,
  Card,
  Typography,
  Row,
  Col,
  message,
  Slider,
  Divider,
} from 'antd';
import {
  CalendarOutlined,
  EnvironmentOutlined,
  UserOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  InfoCircleOutlined,
  PlusCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { communityApi } from '../../services/communityApi';
import { LEVEL_OPTIONS } from '../../constants/levels';
import { useAuthStore } from '../../stores/authStore';
import { BRAND } from '../../theme/antdTheme';

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function CreateMatchPage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      message.warning('Vui lòng đăng nhập để tạo kèo');
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const onFinish = async (values: any) => {
    if (!isAuthenticated) {
      message.warning('Vui lòng đăng nhập để tạo kèo');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const [startHour, endHour] = values.timeRange || [18, 20];
      const toDateTime = (date: dayjs.Dayjs, hourValue: number) => {
        const hour = Math.floor(hourValue);
        const minute = Math.round((hourValue % 1) * 60);
        return date.hour(hour).minute(minute).second(0).millisecond(0).toISOString();
      };

      await communityApi.createMatchPost({
        title: values.title,
        description: values.description || '',
        level: Array.isArray(values.level) ? values.level[0] : values.level,
        startTime: toDateTime(values.date, startHour),
        endTime: toDateTime(values.date, endHour),
        locationText: values.venue,
        maxParticipants: Number(values.totalPlayers || 2),
        joinMode: 'APPROVAL',
        visibility: 'PUBLIC',
      } as any);

      message.success('Tạo kèo thành công');
      navigate('/user/challenges');
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Không thể tạo kèo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Title level={2} style={{ color: '#1e293b', marginBottom: 8, fontWeight: 800 }}>
            Tạo Kèo Giao Lưu Mới
          </Title>
          <Text type="secondary" style={{ fontSize: 16 }}>
            Kết nối đam mê, tìm kiếm đồng đội cùng trình độ
          </Text>
        </div>

        <Card
          style={{
            borderRadius: 24,
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
            border: 'none',
            overflow: 'hidden'
          }}
          bodyStyle={{ padding: '32px' }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              gender: 'ANY',
              priceType: 'SHARE',
              totalPlayers: 2,
              timeRange: [18, 20],
            }}
          >
            {/* Section 1: Basic Information */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                <InfoCircleOutlined style={{ color: BRAND.primary, fontSize: 20 }} />
                <Text strong style={{ fontSize: 16, color: '#475569' }}>Thông tin cơ bản</Text>
              </div>

              <Form.Item
                name="title"
                label={<span style={{ fontWeight: 600 }}>Tiêu đề kèo *</span>}
                rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
              >
                <Input
                  placeholder="Ví dụ: Giao lưu cuối tuần, Tìm đối thủ trình B..."
                  size="large"
                  style={{ borderRadius: 10 }}
                />
              </Form.Item>

              <Row gutter={24}>
                <Col xs={24} md={16}>
                  <Form.Item
                    name="venue"
                    label={<span style={{ fontWeight: 600 }}>Địa điểm *</span>}
                    rules={[{ required: true, message: 'Vui lòng chọn địa điểm' }]}
                  >
                    <Input
                      prefix={<EnvironmentOutlined style={{ color: '#94a3b8' }} />}
                      placeholder="Tên sân hoặc địa chỉ"
                      size="large"
                      style={{ borderRadius: 10 }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="date"
                    label={<span style={{ fontWeight: 600 }}>Ngày chơi *</span>}
                    rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
                  >
                    <DatePicker
                      className="w-full"
                      disabledDate={(current) => current && current < dayjs().startOf('day')}
                      size="large"
                      style={{ width: '100%', borderRadius: 10 }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            <Divider style={{ margin: '0 0 32px 0' }} />

            {/* Section 2: Time and Players */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                <ClockCircleOutlined style={{ color: BRAND.primary, fontSize: 20 }} />
                <Text strong style={{ fontSize: 16, color: '#475569' }}>Thời gian & Nhân sự</Text>
              </div>

              <Form.Item
                name="timeRange"
                label={<span style={{ fontWeight: 600 }}>Khung giờ dự kiến</span>}
              >
                <div style={{ padding: '10px 0' }}>
                  <Slider
                    range
                    min={0}
                    max={24}
                    step={0.25}
                    style={{ margin: '20px 0' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: 12 }}>
                    <span>00:00</span>
                    <span>12:00</span>
                    <span>24:00</span>
                  </div>
                </div>
              </Form.Item>

              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="totalPlayers"
                    label={<span style={{ fontWeight: 600 }}>Số người cần tìm *</span>}
                    rules={[{ required: true }]}
                  >
                    <InputNumber
                      min={1}
                      max={20}
                      className="w-full"
                      size="large"
                      style={{ width: '100%', borderRadius: 10 }}
                      prefix={<UserOutlined style={{ color: '#94a3b8', marginRight: 8 }} />}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="gender" label={<span style={{ fontWeight: 600 }}>Giới tính ưu tiên</span>}>
                    <Radio.Group optionType="button" buttonStyle="solid">
                      <Radio.Button value="ANY" style={{ borderRadius: 8 }}>Cả hai</Radio.Button>
                      <Radio.Button value="MALE" style={{ borderRadius: 8 }}>Chi nam</Radio.Button>
                      <Radio.Button value="FEMALE" style={{ borderRadius: 8 }}>Chi nu</Radio.Button>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </Row>
            </div>

            <Divider style={{ margin: '0 0 32px 0' }} />

            {/* Section 3: Level and Details */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                <TrophyOutlined style={{ color: BRAND.primary, fontSize: 20 }} />
                <Text strong style={{ fontSize: 16, color: '#475569' }}>Yêu cầu trình độ & Mô tả</Text>
              </div>

              <Form.Item
                name="level"
                label={<span style={{ fontWeight: 600 }}>Trình độ mong muốn *</span>}
                rules={[{ required: true, message: 'Vui lòng chọn trình độ' }]}
              >
                <Select
                  mode="multiple"
                  options={LEVEL_OPTIONS}
                  placeholder="Chọn một hoặc nhiều trình độ"
                  size="large"
                  style={{ borderRadius: 10 }}
                />
              </Form.Item>

              <Form.Item name="description" label={<span style={{ fontWeight: 600 }}>Mô tả chi tiết</span>}>
                <TextArea
                  rows={4}
                  placeholder="Ví dụ: Cần tìm bạn chơi phong cách tấn công, vui vẻ là chính..."
                  style={{ borderRadius: 10 }}
                />
              </Form.Item>
            </div>

            <div style={{ textAlign: 'center', marginTop: 40 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                icon={<PlusCircleOutlined />}
                style={{
                  borderRadius: 12,
                  padding: '0 48px',
                  height: 50,
                  fontSize: 16,
                  fontWeight: 600,
                  backgroundColor: BRAND.primary,
                  borderColor: BRAND.primary,
                  boxShadow: `0 4px 14px 0 ${BRAND.primary}66`
                }}
              >
                Đăng Kèo Giao Lưu
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
}
