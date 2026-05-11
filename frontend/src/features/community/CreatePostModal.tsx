import React, { useState } from 'react';
import {
  Button, Col, DatePicker, Divider, Form, Input,
  Modal, Row, Select, Space, Typography,
} from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useNotify } from '../../hooks/useNotify';
import { colors } from '../../styles/theme';

const { TextArea } = Input;
const { Text } = Typography;

// ── Constants ─────────────────────────────────────────────────────────────

const LEVEL_OPTIONS = [
  { value: 'beginner',    label: 'Yếu (người mới)'  },
  { value: 'medium',      label: 'Trung bình'         },
  { value: 'medium_good', label: 'Trung bình khá'     },
  { value: 'good',        label: 'Khá'                },
];

const PRIVACY_OPTIONS = [
  { value: 'public',  label: '🌐 Công khai — ai cũng thấy' },
  { value: 'private', label: '🔒 Nội bộ — chủ kèo duyệt'  },
];

const TIME_OPTIONS = Array.from({ length: 34 }, (_, i) => {
  const h = Math.floor(i / 2) + 5;
  const m = i % 2 === 0 ? '00' : '30';
  const label = `${String(h).padStart(2, '0')}:${m}`;
  return { value: label, label };
});

// ── Types ─────────────────────────────────────────────────────────────────

export type CreatePostValues = {
  title: string;
  venue: string;
  date: unknown;
  time: string;
  capacity: number;
  level: string;
  privacy: string;
  price: string;
  description?: string;
};

export interface CreatePostModalProps {
  open: boolean;
  onClose: () => void;
  /** Callback sau khi đăng bài thành công */
  onSuccess?: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────

/**
 * CreatePostModal — modal form tạo bài tìm kèo.
 * Tự quản lý trạng thái loading, validate, gọi API (mock).
 *
 * @example
 * <CreatePostModal
 *   open={createOpen}
 *   onClose={() => setCreateOpen(false)}
 *   onSuccess={() => refetch()}
 * />
 */
export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const { success, error } = useNotify();
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm<CreatePostValues>();

  const handleFinish = async (values: CreatePostValues) => {
    setSubmitting(true);
    try {
      // TODO: replace with real API call
      await new Promise((res) => setTimeout(res, 1000));
      console.info('[CreatePostModal] payload:', values);
      success('Đăng bài tìm kèo thành công! Mọi người sẽ thấy bài của bạn sớm 🏸');
      onClose();
      form.resetFields();
      onSuccess?.();
    } catch {
      error('Không thể đăng bài. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    form.resetFields();
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 32, height: 32, borderRadius: 8,
              background: colors.primary, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            <EditOutlined style={{ color: '#fff', fontSize: 15 }} />
          </div>
          <Text strong style={{ fontSize: 16 }}>Tạo bài tìm kèo</Text>
        </div>
      }
      open={open}
      onCancel={handleClose}
      footer={null}
      width={580}
      centered
      destroyOnClose
    >
      <Divider style={{ marginTop: 12 }} />

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        requiredMark={false}
      >
        {/* Title */}
        <Form.Item
          name="title"
          label="Tiêu đề bài đăng"
          rules={[
            { required: true, message: 'Vui lòng nhập tiêu đề' },
            { min: 10, message: 'Tiêu đề phải có ít nhất 10 ký tự' },
          ]}
        >
          <Input
            size="large"
            placeholder="VD: Tìm 2 bạn nữ đánh đôi tối thứ 6"
            maxLength={100}
            showCount
          />
        </Form.Item>

        {/* Venue + Capacity */}
        <Row gutter={12}>
          <Col span={14}>
            <Form.Item
              name="venue"
              label="Tên sân"
              rules={[{ required: true, message: 'Vui lòng nhập tên sân' }]}
            >
              <Input size="large" placeholder="Tên sân cầu lông" />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item
              name="capacity"
              label="Số người cần"
              rules={[{ required: true, message: 'Chọn số người' }]}
            >
              <Select
                size="large"
                placeholder="Chọn"
                options={[2, 4, 6, 8, 10, 12].map((n) => ({
                  value: n,
                  label: `${n} người`,
                }))}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Date + Time */}
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              name="date"
              label="Ngày chơi"
              rules={[{ required: true, message: 'Chọn ngày chơi' }]}
            >
              <DatePicker
                size="large"
                style={{ width: '100%' }}
                placeholder="Ngày/tháng/năm"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="time"
              label="Giờ chơi"
              rules={[{ required: true, message: 'Chọn giờ chơi' }]}
            >
              <Select
                size="large"
                placeholder="Chọn giờ bắt đầu"
                options={TIME_OPTIONS}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Level + Privacy */}
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              name="level"
              label="Trình độ yêu cầu"
              rules={[{ required: true, message: 'Chọn trình độ' }]}
            >
              <Select size="large" options={LEVEL_OPTIONS} placeholder="Chọn trình độ" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="privacy"
              label="Chế độ kèo"
              rules={[{ required: true, message: 'Chọn chế độ' }]}
            >
              <Select size="large" options={PRIVACY_OPTIONS} placeholder="Chọn chế độ" />
            </Form.Item>
          </Col>
        </Row>

        {/* Price */}
        <Form.Item
          name="price"
          label="Chi phí mỗi người"
          rules={[{ required: true, message: 'Nhập chi phí hoặc ghi Miễn phí' }]}
        >
          <Input
            size="large"
            placeholder="VD: 50.000đ / người hoặc Miễn phí"
          />
        </Form.Item>

        {/* Description */}
        <Form.Item name="description" label="Ghi chú thêm (tùy chọn)">
          <TextArea
            rows={3}
            placeholder="Thêm thông tin về kèo, yêu cầu trang bị, v.v."
            maxLength={300}
            showCount
          />
        </Form.Item>

        <Divider />

        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
          <Button onClick={handleClose}>Hủy</Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={submitting}
            icon={<EditOutlined />}
            style={{ fontWeight: 700 }}
          >
            Đăng bài
          </Button>
        </Space>
      </Form>
    </Modal>
  );
};

export default CreatePostModal;
