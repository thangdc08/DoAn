import { useState, useMemo } from 'react';
import { Card, Table, Tag, Button, Input, Select, Space, Modal, Form, message, Typography, Avatar, Row, Col, Statistic } from 'antd';
import { SearchOutlined, EditOutlined, UserOutlined, MailOutlined, SafetyCertificateOutlined, UserAddOutlined, MoreOutlined } from '@ant-design/icons';
import { mockAllUsers } from '../../data/mockUsers';
import type { User } from '../../types/auth.types';
import { BRAND } from '../../theme/antdTheme';

const { Title, Text } = Typography;
const { Option } = Select;

export default function UserManagementPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [form] = Form.useForm();
  const [users, setUsers] = useState(mockAllUsers);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchSearch = !search ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.fullName.toLowerCase().includes(search.toLowerCase());
      const matchStatus = !status || user.status === status;
      return matchSearch && matchStatus;
    });
  }, [users, search, status]);

  const handleUpdateStatus = (userId: string, newStatus: string) => {
    setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus as any } : u));
    message.success('Cập nhật trạng thái thành công');
  };

  const handleUpdateRoles = (values: any) => {
    message.success('Cập nhật vai trò thành công');
    setSelectedUser(null);
  };

  const columns = [
    {
      title: 'Người dùng',
      key: 'user',
      render: (_: any, record: User) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar 
            size={40} 
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${record.id}`} 
            style={{ border: '2px solid #fff', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }} 
          />
          <div>
            <Text strong style={{ display: 'block' }}>{record.fullName}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>{record.email}</Text>
          </div>
        </div>
      )
    },
    {
      title: 'Vai trò',
      dataIndex: 'roles',
      key: 'roles',
      render: (roles: any[]) => (
        <Space wrap>
          {roles?.map(r => {
            let color = 'blue';
            if (r.code === 'ADMIN') color = 'purple';
            if (r.code === 'OWNER') color = 'gold';
            return <Tag color={color} key={r.id} style={{ borderRadius: 6, fontWeight: 600 }}>{r.code}</Tag>;
          })}
        </Space>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'ACTIVE' ? 'success' : status === 'BANNED' ? 'error' : 'default'} style={{ borderRadius: 6, fontWeight: 700 }}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'right' as const,
      render: (_: any, record: User) => (
        <Space>
          <Button 
            type="text" 
            icon={<EditOutlined style={{ color: BRAND.primary }} />} 
            onClick={() => setSelectedUser(record)}
            style={{ background: 'rgba(0,166,81,0.05)' }}
          >
            Sửa
          </Button>
          <Select
            size="small"
            value={record.status}
            style={{ width: 110 }}
            onChange={(value) => handleUpdateStatus(record.id, value)}
            className="custom-select"
          >
            <Option value="ACTIVE">Hoạt động</Option>
            <Option value="INACTIVE">Khóa</Option>
            <Option value="BANNED">Cấm</Option>
          </Select>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>Quản lý Người dùng</Title>
          <Text type="secondary">Quản trị toàn bộ tài khoản người chơi, chủ sân và nhân viên trong hệ thống.</Text>
        </div>
        <Button type="primary" icon={<UserAddOutlined />} style={{ background: BRAND.primary, borderRadius: 10 }}>Thêm thành viên</Button>
      </div>

      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card bodyStyle={{ padding: 20 }} style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <Statistic title="Tổng người dùng" value={users.length} prefix={<UserOutlined style={{ color: BRAND.primary }} />} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bodyStyle={{ padding: 20 }} style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <Statistic title="Hoạt động" value={users.filter(u => u.status === 'ACTIVE').length} prefix={<SafetyCertificateOutlined style={{ color: '#52c41a' }} />} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bodyStyle={{ padding: 20 }} style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <Statistic title="Chủ sân" value={users.filter(u => u.roles?.some(r => r.code === 'OWNER')).length} prefix={<UserOutlined style={{ color: BRAND.sky }} />} />
          </Card>
        </Col>
      </Row>

      <Card 
        bodyStyle={{ padding: 0 }} 
        style={{ borderRadius: 16, overflow: 'hidden', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}
      >
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: 16 }}>
          <Input
            placeholder="Tìm theo tên, email..."
            prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 320, borderRadius: 10 }}
          />
          <Select
            placeholder="Lọc vai trò"
            style={{ width: 150 }}
            allowClear
            className="custom-select"
          >
            <Option value="USER">Người chơi</Option>
            <Option value="OWNER">Chủ sân</Option>
            <Option value="ADMIN">Quản trị viên</Option>
          </Select>
          <Select
            placeholder="Trạng thái"
            style={{ width: 150 }}
            value={status || undefined}
            onChange={setStatus}
            allowClear
            className="custom-select"
          >
            <Option value="ACTIVE">Hoạt động</Option>
            <Option value="INACTIVE">Khóa</Option>
            <Option value="BANNED">Cấm</Option>
          </Select>
        </div>

        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="id"
          pagination={{
            current: page,
            total: filteredUsers.length,
            pageSize: 10,
            onChange: setPage,
            showSizeChanger: false,
            style: { paddingRight: 24 }
          }}
        />
      </Card>

      <Modal
        title={<div style={{ paddingBottom: 10, borderBottom: '1px solid #f1f5f9' }}>Cập nhật vai trò & Thông tin</div>}
        open={!!selectedUser}
        onCancel={() => setSelectedUser(null)}
        onOk={() => form.submit()}
        okButtonProps={{ style: { background: BRAND.primary } }}
        style={{ top: 100 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '20px 0' }}>
           <Avatar size={64} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser?.id}`} />
           <div>
             <Title level={4} style={{ margin: 0 }}>{selectedUser?.fullName}</Title>
             <Text type="secondary">{selectedUser?.email}</Text>
           </div>
        </div>
        <Form
          form={form}
          layout="vertical"
          initialValues={{ roleCodes: selectedUser?.roles?.map(r => r.code) }}
          onFinish={handleUpdateRoles}
        >
          <Form.Item name="roleCodes" label={<Text strong>Phân quyền hệ thống</Text>}>
            <Select mode="multiple" placeholder="Chọn vai trò" style={{ width: '100%' }}>
              <Option value="USER">Người chơi (Default)</Option>
              <Option value="OWNER">Chủ sân (Quản lý sân)</Option>
              <Option value="ADMIN">Quản trị viên (Hệ thống)</Option>
            </Select>
          </Form.Item>
          <Form.Item label={<Text strong>Ghi chú quản trị</Text>}>
            <Input.TextArea placeholder="Nhập lý do thay đổi hoặc ghi chú..." rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
