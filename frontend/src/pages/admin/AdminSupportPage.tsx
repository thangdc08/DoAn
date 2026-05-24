import { useState } from 'react';
import { Card, Typography, List, Badge, Tag, Input, Button, Space, Avatar, Row, Col, Empty } from 'antd';
import {
  SendOutlined,
  SearchOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
} from '@ant-design/icons';
import { BRAND } from '../../theme/antdTheme';

const { Title, Text } = Typography;

const MOCK_TICKETS = [
  {
    id: 'T-1001',
    subject: 'Loi khong cap nhat duoc gia san',
    owner: 'Nguyen Van A',
    venue: 'San Ngoi Sao',
    status: 'PENDING',
    priority: 'HIGH',
    time: '10 phut truoc',
    lastMessage: 'Vui long kiem tra giup toi, khach khong dat duoc san...',
  },
  {
    id: 'T-1002',
    subject: 'Yeu cau rut tien doanh thu thang 4',
    owner: 'Tran Thi B',
    venue: 'Badminton Center Q10',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    time: '2 gio truoc',
    lastMessage: 'Da nhan duoc ho so cua ban, chung toi dang xu ly.',
  },
  {
    id: 'T-1003',
    subject: 'Huong dan cau hinh lock san tu dong',
    owner: 'Le Van C',
    venue: 'San Cau Long ABC',
    status: 'RESOLVED',
    priority: 'LOW',
    time: 'Hom qua',
    lastMessage: 'Cam on admin da ho tro tan tinh!',
  },
];

export default function AdminSupportPage() {
  const [selectedTicket, setSelectedTicket] = useState<any>(MOCK_TICKETS[0]);
  const [reply, setReply] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'error';
      case 'IN_PROGRESS':
        return 'processing';
      case 'RESOLVED':
        return 'success';
      default:
        return 'default';
    }
  };

  const ChatWindow = (
    <Card
      style={{ height: 'calc(100vh - 200px)', borderRadius: 16, display: 'flex', flexDirection: 'column' }}
      bodyStyle={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 0 }}
    >
      <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar size={40} icon={<UserOutlined />} style={{ background: BRAND.primary }} />
          <div>
            <Text strong style={{ display: 'block' }}>{selectedTicket.owner}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>Chu san: {selectedTicket.venue}</Text>
          </div>
        </div>
        <Space>
          <Button icon={<PhoneOutlined />} />
          <Button icon={<MailOutlined />} />
          <Button type="primary" ghost style={{ borderRadius: 8 }}>Dong yeu cau</Button>
        </Space>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', background: '#f8fafc' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ alignSelf: 'flex-start', maxWidth: '70%' }}>
            <div style={{ padding: '12px 16px', background: '#fff', borderRadius: '16px 16px 16px 4px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              {selectedTicket.lastMessage}
            </div>
            <Text type="secondary" style={{ fontSize: 11, marginTop: 4 }}>{selectedTicket.time}</Text>
          </div>

          <div style={{ alignSelf: 'flex-end', maxWidth: '70%' }}>
            <div style={{ padding: '12px 16px', background: BRAND.primary, color: '#fff', borderRadius: '16px 16px 4px 16px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              Chao ban, toi la Admin ho tro. Toi da nhan duoc yeu cau cua ban va dang tien hanh kiem tra he thong.
            </div>
            <div style={{ textAlign: 'right' }}>
              <Text type="secondary" style={{ fontSize: 11, marginTop: 4 }}>5 phut truoc</Text>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '20px 24px', borderTop: '1px solid #f1f5f9' }}>
        <Space.Compact style={{ width: '100%' }}>
          <Input
            placeholder="Nhap noi dung phan hoi..."
            value={reply}
            onChange={(e) => setReply(e.target.value)}
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
        <Col span={8}>
          <div style={{ marginBottom: 24 }}>
            <Title level={2} style={{ margin: 0 }}>Ho tro Chu san</Title>
            <Text type="secondary">Quan ly va giai dap cac thac mac tu doi tac.</Text>
          </div>

          <Input
            prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
            placeholder="Tim kiem yeu cau..."
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
                    borderBottom: '1px solid #f1f5f9',
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
                  {item.priority === 'HIGH' && <Badge color="red" text="Uu tien cao" style={{ fontSize: 11, marginTop: 8 }} />}
                </div>
              )}
            />
          </Card>
        </Col>

        <Col span={16}>
          {selectedTicket ? (
            ChatWindow
          ) : (
            <div style={{ height: 'calc(100vh - 160px)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', borderRadius: 16 }}>
              <Empty description="Chon mot yeu cau ho tro de bat dau phan hoi" />
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
}

