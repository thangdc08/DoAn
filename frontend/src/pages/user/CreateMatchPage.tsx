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
} from 'antd';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { communityApi } from '../../services/communityApi';
import { LEVEL_OPTIONS } from '../../constants/levels';
import { useAuthStore } from '../../stores/authStore';

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
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Title level={2}>Tao keo giao luu moi</Title>
      <Text type="secondary">Nhap thong tin va dang keo len cong dong</Text>

      <Row gutter={24} className="mt-6">
        <Col xs={24} lg={16}>
          <Card>
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
              <Form.Item name="title" label="Tieu de" rules={[{ required: true }]}>
                <Input placeholder="Vi du: Giao luu thu 7" />
              </Form.Item>

              <Row gutter={12}>
                <Col xs={24} md={16}>
                  <Form.Item name="venue" label="Dia diem" rules={[{ required: true }]}>
                    <Input placeholder="Ten san, dia chi" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item name="date" label="Ngay" rules={[{ required: true }]}>
                    <DatePicker className="w-full" disabledDate={(current) => current && current < dayjs().startOf('day')} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="timeRange" label="Khung gio">
                <Slider range min={0} max={24} step={0.25} />
              </Form.Item>

              <Row gutter={12}>
                <Col xs={24} md={12}>
                  <Form.Item name="totalPlayers" label="So nguoi can tim" rules={[{ required: true }]}>
                    <InputNumber min={1} max={20} className="w-full" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="gender" label="Gioi tinh uu tien">
                    <Radio.Group optionType="button" buttonStyle="solid">
                      <Radio.Button value="ANY">Ca hai</Radio.Button>
                      <Radio.Button value="MALE">Chi nam</Radio.Button>
                      <Radio.Button value="FEMALE">Chi nu</Radio.Button>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="level" label="Trinh do" rules={[{ required: true }]}>
                <Select mode="multiple" options={LEVEL_OPTIONS} />
              </Form.Item>

              <Form.Item name="description" label="Mo ta them">
                <TextArea rows={4} />
              </Form.Item>

              <Button type="primary" htmlType="submit" loading={loading}>
                Tao keo
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
