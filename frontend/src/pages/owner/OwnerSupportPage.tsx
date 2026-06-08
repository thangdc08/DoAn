import { useState } from 'react';
import { 
  Card, 
  Typography, 
  Collapse, 
  Form, 
  Input, 
  Button, 
  Space, 
  Row, 
  Col, 
  Tag, 
  Badge, 
  List, 
  Modal, 
  message, 
  Spin,
  Empty,
  Divider,
  Tabs
} from 'antd';
import { 
  QuestionCircleOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  MessageOutlined,
  SendOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  SearchOutlined,
  EyeOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingApi } from '../../services/bookingApi';
import { BRAND } from '../../theme/antdTheme';
import type { SupportTicket } from '../../types/booking.types';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;
const { Search } = Input;

export default function OwnerSupportPage() {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('ALL');

  // FAQs Data
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
    },
    {
      key: '4',
      question: 'Làm sao tôi có thể kết nối với khách hàng trực tiếp?',
      answer: 'Hệ thống hỗ trợ trò chuyện trực tuyến qua mục "Tin nhắn". Bạn có thể tìm thấy cuộc hội thoại với khách hàng đã đặt sân tại đây.'
    },
    {
      key: '5',
      question: 'Tôi có thể thiết lập nhiều cơ sở sân khác nhau không?',
      answer: 'Có, bạn hoàn toàn có thể thêm nhiều cơ sở (sân tập) khác nhau trong mục "Quản lý sân" và quản lý chung dưới một tài khoản chủ sân.'
    }
  ];

  // Filter FAQs based on search query
  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Fetch Tickets Query
  const { data: ticketsData, isLoading: isLoadingTickets } = useQuery({
    queryKey: ['owner-support-tickets', activeTab],
    queryFn: async () => {
      const params = activeTab !== 'ALL' ? { status: activeTab } : undefined;
      return bookingApi.getSupportTickets(params);
    }
  });

  const ticketsList = ticketsData?.content || [];

  // Create Ticket Mutation
  const createTicketMutation = useMutation({
    mutationFn: (data: { subject: string; description: string }) => 
      bookingApi.createOwnerSupportTicket(data),
    onSuccess: () => {
      message.success('Gửi yêu cầu hỗ trợ thành công!');
      form.resetFields();
      queryClient.invalidateQueries({ queryKey: ['owner-support-tickets'] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra khi gửi yêu cầu hỗ trợ.');
    }
  });

  const handleCreateTicket = (values: { subject: string; description: string }) => {
    createTicketMutation.mutate(values);
  };

  const showTicketDetail = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setIsModalVisible(true);
  };

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'OPEN':
        return <Tag color="blue" style={{ borderRadius: 6, padding: '2px 8px' }}>Chờ xử lý</Tag>;
      case 'IN_PROGRESS':
        return <Tag color="warning" style={{ borderRadius: 6, padding: '2px 8px' }}>Đang xử lý</Tag>;
      case 'RESOLVED':
        return <Tag color="success" style={{ borderRadius: 6, padding: '2px 8px' }}>Đã giải quyết</Tag>;
      case 'CLOSED':
        return <Tag color="default" style={{ borderRadius: 6, padding: '2px 8px' }}>Đã đóng</Tag>;
      default:
        return <Tag style={{ borderRadius: 6, padding: '2px 8px' }}>{status}</Tag>;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1300px', margin: '0 auto' }}>
      {/* Header Section */}
      <div style={{ marginBottom: 32 }}>
        <Title level={2} style={{ margin: 0, fontWeight: 700 }}>Trung tâm Hỗ trợ Chủ sân</Title>
        <Text type="secondary">Chúng tôi luôn sẵn sàng hỗ trợ bạn vận hành cơ sở một cách tốt nhất.</Text>
      </div>

      <Row gutter={[24, 24]}>
        {/* Left Column: FAQ & New Request */}
        <Col xs={24} lg={15}>
          {/* FAQ Card */}
          <Card 
            title={<Space><QuestionCircleOutlined style={{ color: BRAND.primary }} /> Câu hỏi thường gặp</Space>}
            style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}
            extra={
              <Search 
                placeholder="Tìm câu hỏi..." 
                allowClear
                onChange={e => setSearchQuery(e.target.value)} 
                style={{ width: 220 }} 
                prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
              />
            }
          >
            {filteredFaqs.length > 0 ? (
              <Collapse 
                ghost 
                expandIconPosition="end"
                style={{ background: 'transparent' }}
              >
                {filteredFaqs.map(faq => (
                  <Panel 
                    header={<Text strong style={{ fontSize: 14 }}>{faq.question}</Text>} 
                    key={faq.key}
                    style={{ borderBottom: '1px solid #f1f5f9', padding: '8px 0' }}
                  >
                    <Paragraph style={{ color: '#64748b', marginBottom: 0, lineHeight: 1.6 }}>{faq.answer}</Paragraph>
                  </Panel>
                ))}
              </Collapse>
            ) : (
              <Empty description="Không tìm thấy câu hỏi phù hợp." image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Card>

          {/* New Request Card */}
          <Card 
            title={<Space><MessageOutlined style={{ color: BRAND.sky }} /> Gửi yêu cầu hỗ trợ mới</Space>}
            style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', marginTop: 24 }}
          >
            <Form 
              layout="vertical" 
              form={form} 
              onFinish={handleCreateTicket}
            >
              <Form.Item 
                name="subject"
                label="Chủ đề cần hỗ trợ"
                rules={[{ required: true, message: 'Vui lòng nhập chủ đề cần hỗ trợ!' }]}
              >
                <Input placeholder="Ví dụ: Lỗi thanh toán, Cần thêm sân mới, Thay đổi thông tin ngân hàng..." style={{ borderRadius: 8, height: 40 }} />
              </Form.Item>
              <Form.Item 
                name="description"
                label="Nội dung chi tiết"
                rules={[{ required: true, message: 'Vui lòng nhập nội dung chi tiết!' }]}
              >
                <Input.TextArea rows={4} placeholder="Mô tả chi tiết vấn đề bạn đang gặp phải..." style={{ borderRadius: 10 }} />
              </Form.Item>
              <Form.Item style={{ marginBottom: 0 }}>
                <Button 
                  type="primary" 
                  htmlType="submit"
                  icon={<SendOutlined />} 
                  loading={createTicketMutation.isPending}
                  style={{ background: BRAND.primary, borderRadius: 8, height: 40, padding: '0 24px' }}
                >
                  Gửi yêu cầu
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        {/* Right Column: Contact info & Recent Tickets */}
        <Col xs={24} lg={9}>
          {/* Direct Contact Card */}
          <Card 
            title="Liên hệ trực tiếp"
            style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', marginBottom: 24 }}
          >
            <Space direction="vertical" size={20} style={{ width: '100%' }}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'rgba(0,166,81,0.1)', color: BRAND.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                  <PhoneOutlined />
                </div>
                <div>
                  <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>Hotline hỗ trợ 24/7</Text>
                  <Text strong style={{ fontSize: 16 }}>1900 1234 56</Text>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'rgba(0,91,172,0.1)', color: BRAND.sky, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                  <MailOutlined />
                </div>
                <div>
                  <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>Email kỹ thuật & đối soát</Text>
                  <Text strong style={{ fontSize: 16 }}>support@badmintonhub.vn</Text>
                </div>
              </div>
            </Space>
          </Card>

          {/* Recent Tickets Card */}
          <Card 
            title="Yêu cầu gần đây"
            style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}
          >
            <Tabs 
              activeKey={activeTab} 
              onChange={setActiveTab}
              size="small"
              tabBarStyle={{ marginBottom: 16 }}
              items={[
                { label: 'Tất cả', key: 'ALL' },
                { label: 'Chờ xử lý', key: 'OPEN' },
                { label: 'Đang xử lý', key: 'IN_PROGRESS' },
                { label: 'Đã giải quyết', key: 'RESOLVED' }
              ]}
            />

            {isLoadingTickets ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <Spin size="medium" />
              </div>
            ) : ticketsList.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={ticketsList}
                renderItem={(ticket: SupportTicket) => (
                  <List.Item
                    actions={[
                      <Button 
                        type="link" 
                        icon={<EyeOutlined />} 
                        onClick={() => showTicketDetail(ticket)}
                        style={{ padding: 0 }}
                      >
                        Chi tiết
                      </Button>
                    ]}
                    style={{ padding: '12px 0' }}
                  >
                    <List.Item.Meta
                      title={
                        <Space direction="vertical" size={2} style={{ width: '100%' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                            <Text strong style={{ fontSize: 13, maxWidth: '140px' }} ellipsis>{ticket.subject}</Text>
                            {getStatusTag(ticket.status)}
                          </div>
                        </Space>
                      }
                      description={
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {formatDate(ticket.createdAt)}
                        </Text>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="Không có yêu cầu hỗ trợ nào." image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Card>
        </Col>
      </Row>

      {/* Detail Modal */}
      <Modal
        title={
          <Space>
            <InfoCircleOutlined style={{ color: BRAND.primary }} />
            <span>Chi tiết yêu cầu hỗ trợ</span>
          </Space>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setIsModalVisible(false)} style={{ borderRadius: 6 }}>
            Đóng
          </Button>
        ]}
        width={600}
        style={{ borderRadius: 16 }}
      >
        {selectedTicket && (
          <div style={{ padding: '12px 0' }}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Text type="secondary" style={{ fontSize: 12 }}>Tiêu đề yêu cầu</Text>
                <div style={{ fontSize: 16, fontWeight: 600, marginTop: 4 }}>{selectedTicket.subject}</div>
              </Col>
              
              <Col span={12}>
                <Text type="secondary" style={{ fontSize: 12 }}>Trạng thái</Text>
                <div style={{ marginTop: 4 }}>{getStatusTag(selectedTicket.status)}</div>
              </Col>
              
              <Col span={12}>
                <Text type="secondary" style={{ fontSize: 12 }}>Ngày tạo</Text>
                <div style={{ marginTop: 4, fontWeight: 500 }}>{formatDate(selectedTicket.createdAt)}</div>
              </Col>

              <Col span={24}>
                <Divider style={{ margin: '12px 0' }} />
                <Text type="secondary" style={{ fontSize: 12 }}>Nội dung chi tiết</Text>
                <Card 
                  style={{ 
                    marginTop: 8, 
                    background: '#f8fafc', 
                    borderRadius: 8, 
                    border: '1px solid #f1f5f9' 
                  }}
                  bodyStyle={{ padding: '12px' }}
                >
                  <Paragraph style={{ marginBottom: 0, whiteSpace: 'pre-wrap' }}>
                    {selectedTicket.description}
                  </Paragraph>
                </Card>
              </Col>

              {selectedTicket.reply ? (
                <Col span={24}>
                  <Text type="secondary" style={{ fontSize: 12, color: BRAND.primary }}>Phản hồi từ Ban quản trị</Text>
                  <Card 
                    style={{ 
                      marginTop: 8, 
                      background: 'rgba(0,166,81,0.03)', 
                      borderRadius: 8, 
                      border: '1px solid rgba(0,166,81,0.1)' 
                    }}
                    bodyStyle={{ padding: '12px' }}
                  >
                    <Paragraph style={{ marginBottom: 8, whiteSpace: 'pre-wrap', fontWeight: 500 }}>
                      {selectedTicket.reply}
                    </Paragraph>
                    <Text type="secondary" style={{ fontSize: 11, display: 'block', textAlign: 'right' }}>
                      Phản hồi lúc: {formatDate(selectedTicket.repliedAt || '')}
                    </Text>
                  </Card>
                </Col>
              ) : (
                <Col span={24}>
                  <Text type="secondary" style={{ fontStyle: 'italic', fontSize: 13, color: '#94a3b8' }}>
                    * Yêu cầu này đang được ban quản trị tiếp nhận và sẽ phản hồi sớm nhất có thể.
                  </Text>
                </Col>
              )}
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
}
