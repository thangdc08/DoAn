import { Card, Typography, Collapse, Form, Input, Button, Space, Row, Col, Tag, Timeline, Badge } from 'antd';
import { 
  QuestionCircleOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  MessageOutlined,
  SendOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { BRAND } from '../../theme/antdTheme';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

export default function OwnerSupportPage() {
  const [form] = Form.useForm();

  const faqs = [
    {
      key: '1',
      question: 'Làm thế nào để thay đổi giá sân vào giờ cao điểm?',
      answer: 'Bạn có thể vào phần "Quản lý sân", chọn sân cụ thể và nhấn vào "Chỉnh sửa khung giờ". Tại đây bạn có thể thiết lập mức giá khác nhau cho các khung giờ trong ngày.'
    },
    {
      key: '2',
      question: 'Khi nào tôi nhận được tiền thanh toán từ hệ thống?',
      answer: 'Hệ thống sẽ đối soát doanh thu hàng tuần vào ngày Chủ Nhật và thực hiện chuyển tiền vào tài khoản ngân hàng của bạn vào Thứ Hai hoặc Thứ Ba hàng tuần.'
    },
    {
      key: '3',
      question: 'Khách hàng hủy sân có được hoàn tiền không?',
      answer: 'Việc hoàn tiền phụ thuộc vào "Chính sách hủy sân" mà bạn thiết lập trong phần Cấu hình. Thông thường khách hủy trước 24h sẽ được hoàn 100%.'
    }
  ];

  const tickets = [
    { id: 'TK-882', subject: 'Lỗi hiển thị lịch thi đấu', status: 'RESOLVED', date: '2 giờ trước' },
    { id: 'TK-851', subject: 'Yêu cầu cập nhật thông tin ngân hàng', status: 'PENDING', date: '1 ngày trước' },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: 32 }}>
        <Title level={2} style={{ margin: 0 }}>Trung tâm Hỗ trợ Chủ sân</Title>
        <Text type="secondary">Chúng tôi luôn sẵn sàng hỗ trợ bạn vận hành cơ sở một cách tốt nhất.</Text>
      </div>

      <Row gutter={[24, 24]}>
        {/* FAQ Section */}
        <Col xs={24} lg={15}>
          <Card 
            title={<Space><QuestionCircleOutlined style={{ color: BRAND.primary }} /> Câu hỏi thường gặp</Space>}
            style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}
          >
            <Collapse 
              ghost 
              expandIconPosition="end"
              style={{ background: 'transparent' }}
            >
              {faqs.map(faq => (
                <Panel 
                  header={<Text strong>{faq.question}</Text>} 
                  key={faq.key}
                  style={{ borderBottom: '1px solid #f1f5f9', padding: '8px 0' }}
                >
                  <Paragraph style={{ color: '#64748b', marginBottom: 0 }}>{faq.answer}</Paragraph>
                </Panel>
              ))}
            </Collapse>
            <Button type="link" style={{ marginTop: 16, padding: 0 }}>Xem tất cả câu hỏi</Button>
          </Card>

          <Card 
            title={<Space><MessageOutlined style={{ color: BRAND.sky }} /> Gửi yêu cầu hỗ trợ mới</Space>}
            style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', marginTop: 24 }}
          >
            <Form layout="vertical" form={form}>
              <Form.Item label="Chủ đề cần hỗ trợ">
                <Input placeholder="Ví dụ: Lỗi thanh toán, Cần thêm sân mới..." style={{ borderRadius: 8 }} />
              </Form.Item>
              <Form.Item label="Nội dung chi tiết">
                <Input.TextArea rows={4} placeholder="Mô tả chi tiết vấn đề bạn đang gặp phải..." style={{ borderRadius: 10 }} />
              </Form.Item>
              <Button type="primary" icon={<SendOutlined />} style={{ background: BRAND.primary, borderRadius: 8 }}>Gửi yêu cầu</Button>
            </Form>
          </Card>
        </Col>

        {/* Contact & Tickets Section */}
        <Col xs={24} lg={9}>
          <Card 
            title="Liên hệ trực tiếp"
            style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', marginBottom: 24 }}
          >
            <Space direction="vertical" size={20} style={{ width: '100%' }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(0,166,81,0.1)', color: BRAND.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                  <PhoneOutlined />
                </div>
                <div>
                  <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>Hotline 24/7</Text>
                  <Text strong>1900 1234 56</Text>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(0,91,172,0.1)', color: BRAND.sky, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                  <MailOutlined />
                </div>
                <div>
                  <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>Email kỹ thuật</Text>
                  <Text strong>support@badmintonhub.com</Text>
                </div>
              </div>
            </Space>
          </Card>

          <Card 
            title="Yêu cầu gần đây"
            style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}
          >
            <Timeline
              items={tickets.map(t => ({
                color: t.status === 'RESOLVED' ? 'green' : 'blue',
                children: (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text strong style={{ fontSize: 13 }}>{t.subject}</Text>
                      <Tag color={t.status === 'RESOLVED' ? 'success' : 'processing'} style={{ fontSize: 10, borderRadius: 4 }}>
                        {t.status}
                      </Tag>
                    </div>
                    <Text type="secondary" style={{ fontSize: 12 }}>#{t.id} · {t.date}</Text>
                  </div>
                )
              }))}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
