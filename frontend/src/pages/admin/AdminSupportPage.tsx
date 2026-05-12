import { useState } from 'react';
import { Card, Typography, List, Badge, Tag, Input, Button, Space, Avatar, Divider, Row, Col, Empty } from 'antd';
import { 
  SendOutlined, 
  SearchOutlined, 
  UserOutlined, 
  ClockCircleOutlined, 
  CheckCircleOutlined,
  MessageOutlined,
  PhoneOutlined,
  MailOutlined
} from '@ant-design/icons';
import { BRAND } from '../../theme/antdTheme';

const { Title, Text, Paragraph } = Typography;

const MOCK_TICKETS = [
  {
    id: 'T-1001',
    subject: 'Lỗi không cập nhật được giá sân',
    owner: 'Nguyễn Văn A',
    venue: 'Sân Ngôi Sao',
    status: 'PENDING',
    priority: 'HIGH',
    time: '10 phút trước',
    lastMessage: 'Vui lòng kiểm tra giúp tôi, khách không đặt được sân...'
  },
  {
    id: 'T-1002',
    subject: 'Yêu cầu rút tiền doanh thu tháng 4',
    owner: 'Trần Thị B',
    venue: 'Badminton Center Q10',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    time: '2 giờ trước',
    lastMessage: 'Đã nhận được hồ sơ của bạn, chúng tôi đang xử lý.'
  },
  {
    id: 'T-1003',
    subject: 'Hướng dẫn cấu hình lock sân tự động',
    owner: 'Lê Văn C',
    venue: 'Sân Cầu Lông ABC',
    status: 'RESOLVED',
    priority: 'LOW',
    time: 'Hôm qua',
    lastMessage: 'Cảm ơn admin đã hỗ trợ tận tình!'
  }
];

export default function AdminSupportPage() {
  const [selectedTicket, setSelectedTicket] = useState<any>(MOCK_TICKETS[0]);
  const [reply, setReply] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'error';
      case 'IN_PROGRESS': return 'processing';
      case 'RESOLVED': return 'success';
      default: return 'default';
    }
  };

  const ChatWindow = (
    <Card 
      style={{ height: 'calc(100vh - 200px)', borderRadius: 16, display: 'flex', flexDirection: 'column' }}
      bodyStyle={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 0 }}
    >
      {/* Chat Header */}
      <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Avatar size={40} icon={<UserOutlined />} style={{ background: BRAND.primary }} />
            <div>
               <Text strong style={{ display: 'block' }}>{selectedTicket.owner}</Text>
               <Text type="secondary" style={{ fontSize: 12 }}>Chủ sân: {selectedTicket.venue}</Text>
            </div>
         </div>
         <Space>
            <Button icon={<PhoneOutlined />} />
            <Button icon={<MailOutlined />} />
            <Button type="primary" ghost style={{ borderRadius: 8 }}>Đóng yêu cầu</Button>
         </Space>
      </div>

      {/* Chat Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', background: '#f8fafc' }}>
         <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* User message */}
            <div style={{ alignSelf: 'flex-start', maxWidth: '70%' }}>
               <div style={{ padding: '12px 16px', background: '#fff', borderRadius: '16px 16px 16px 4px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                  {selectedTicket.lastMessage}
               </div>
               <Text type="secondary" style={{ fontSize: 11, marginTop: 4 }}>{selectedTicket.time}</Text>
            </div>

            {/* Admin message */}
            <div style={{ alignSelf: 'flex-end', maxWidth: '70%' }}>
               <div style={{ padding: '12px 16px', background: BRAND.primary, color: '#fff', borderRadius: '16px 16px 4px 16px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                  Chào bạn, tôi là Admin hỗ trợ. Tôi đã nhận được yêu cầu của bạn và đang tiến hành kiểm tra hệ thống.
               </div>
               <div style={{ textAlign: 'right' }}>
                  <Text type="secondary" style={{ fontSize: 11, marginTop: 4 }}>5 phút trước</Text>
               </div>
            </div>
         </div>
      </div>

      {/* Chat Input */}
      <div style={{ padding: '20px 24px', borderTop: '1px solid #f1f5f9' }}>
         <Space.Compact style={{ width: '100%' }}>
            <Input 
              placeholder="Nhập nội dung phản hồi..." 
              value={reply}
              onChange={e => setReply(e.target.value)}
              onPressEnter={() => { setReply(''); }}
              size="large"
              style={{ borderRadius: '10px 0 0 10px' }}
            />
            <Button 
              type="primary" 
              icon={<SendOutlined />} 
              size="large"
              style={{ background: BRAND.primary, width: 60, borderRadius: '0 10px 10px 0' }}
              onClick={() => { setReply(''); }}
            />
         </Space.Compact>
      </div>
    </Card>
  );

  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={24}>
        {/* Sidebar: Ticket List */}
        <Col span={8}>
           <div style={{ marginBottom: 24 }}>
              <Title level={2} style={{ margin: 0 }}>Hỗ trợ Chủ sân</Title>
              <Text type="secondary">Quản lý và giải đáp các thắc mắc từ đối tác.</Text>
           </div>
           
           <Input 
             prefix={<SearchOutlined style={{ color: '#94a3b8' }} />} 
             placeholder="Tìm kiếm yêu cầu..." 
             size="large"
             style={{ marginBottom: 20, borderRadius: 12, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
           />

           <Card bodyStyle={{ padding: 0 }} style={{ borderRadius: 16, overflow: 'hidden', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <List
                dataSource={MOCK_TICKETS}
                renderItem={(item) => (
                  <div 
                    onClick={() => setSelectedTicket(item)}
                    style={{ 
                      padding: '20px', 
                      cursor: 'pointer', 
                      transition: 'all 0.2s',
                      background: selectedTicket.id === item.id ? 'rgba(0,166,81,0.05)' : '#fff',
                      borderLeft: selectedTicket.id === item.id ? `4px solid ${BRAND.primary}` : '4px solid transparent',
                      borderBottom: '1px solid #f1f5f9'
                    }}
                  >
                     <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <Tag color={getStatusColor(item.status)} style={{ borderRadius: 4, fontSize: 10 }}>{item.status}</Tag>
                        <Text type="secondary" style={{ fontSize: 11 }}>{item.time}</Text>
                     </div>
                     <Title level={5} style={{ margin: '0 0 4px 0', fontSize: 14 }}>{item.subject}</Title>
                     <div style={{ fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <UserOutlined /> {item.owner} • {item.venue}
                     </div>
                     {item.priority === 'HIGH' && <Badge color="red" text="Ưu tiên cao" style={{ fontSize: 11, marginTop: 8 }} />}
                  </div>
                )}
              />
           </Card>
        </Col>

        {/* Main Content: Chat Window */}
        <Col span={16}>
           {selectedTicket ? ChatWindow : (
             <div style={{ height: 'calc(100vh - 160px)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', borderRadius: 16 }}>
                <Empty description="Chọn một yêu cầu hỗ trợ để bắt đầu phản hồi" />
             </div>
           )}
        </Col>
      </Row>
    </div>
  );
}
