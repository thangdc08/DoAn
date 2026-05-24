import { useEffect, useMemo, useState } from 'react';
import { Card, Table, Tag, Button, Input, Select, Space, Modal, Form, message, Typography, Avatar, Row, Col, Statistic } from 'antd';
import { SearchOutlined, EditOutlined, UserOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import type { User } from '../../types/auth.types';
import { BRAND } from '../../theme/antdTheme';
import { adminApi } from '../../services/adminApi';

const { Title, Text } = Typography;
const { Option } = Select;

type RoleCode = 'USER' | 'OWNER' | 'ADMIN';

const toRoleList = (roles?: unknown): RoleCode[] => {
  if (!Array.isArray(roles)) return [];
  return roles
    .map((r) => {
      if (typeof r === 'string') return r;
      if (r && typeof r === 'object' && 'code' in r) return String((r as { code: string }).code);
      return '';
    })
    .filter((r): r is RoleCode => r === 'USER' || r === 'OWNER' || r === 'ADMIN');
};

export default function UserManagementPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [role, setRole] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [savingStatusId, setSavingStatusId] = useState<string | null>(null);
  const [savingRoles, setSavingRoles] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [form] = Form.useForm<{ roleCodes: RoleCode[] }>();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const data = await adminApi.getUsers({
          search: search || undefined,
          status: status || undefined,
          role: role || undefined,
          page: page - 1,
          size: 10,
        });
        setUsers(data?.content ?? []);
        setTotalElements(data?.totalElements ?? 0);
      } catch (error) {
        console.error(error);
        message.error('Không tải được danh sách người dùng');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [search, status, role, page]);

  useEffect(() => {
    if (!selectedUser) return;
    form.setFieldsValue({ roleCodes: toRoleList(selectedUser.roles) });
  }, [selectedUser, form]);

  const stats = useMemo(() => {
    const active = users.filter((u) => u.status === 'ACTIVE').length;
    const owners = users.filter((u) => toRoleList(u.roles).includes('OWNER')).length;
    return { active, owners };
  }, [users]);

  const handleUpdateStatus = async (userId: string, newStatus: string) => {
    try {
      setSavingStatusId(userId);
      await adminApi.updateUserStatus(userId, newStatus);
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: newStatus as User['status'] } : u)));
      message.success('Cập nhật trạng thái thành công');
    } catch (error) {
      console.error(error);
      message.error('Cập nhật trạng thái thất bại');
    } finally {
      setSavingStatusId(null);
    }
  };

  const handleUpdateRoles = async (values: { roleCodes: RoleCode[] }) => {
    if (!selectedUser) return;
    try {
      setSavingRoles(true);
      await adminApi.updateUserRoles(selectedUser.id, values.roleCodes);
      setUsers((prev) => prev.map((u) => (u.id === selectedUser.id ? { ...u, roles: values.roleCodes } : u)));
      message.success('Cập nhật vai trò thành công');
      setSelectedUser(null);
    } catch (error) {
      console.error(error);
      message.error('Cập nhật vai trò thất bại');
    } finally {
      setSavingRoles(false);
    }
  };

  const columns = [
    {
      title: 'Người dùng',
      key: 'user',
      render: (_: unknown, record: User) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar size={40} src={record.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${record.id}`} style={{ border: '2px solid #fff', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }} />
          <div>
            <Text strong style={{ display: 'block' }}>{record.fullName}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>{record.email}</Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Vai trò',
      dataIndex: 'roles',
      key: 'roles',
      render: (roles: unknown) => (
        <Space wrap>
          {toRoleList(roles).map((code) => {
            const color = code === 'ADMIN' ? 'purple' : code === 'OWNER' ? 'gold' : 'blue';
            return <Tag color={color} key={code} style={{ borderRadius: 6, fontWeight: 600 }}>{code}</Tag>;
          })}
        </Space>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (value: User['status']) => (
        <Tag color={value === 'ACTIVE' ? 'success' : value === 'BANNED' ? 'error' : 'default'} style={{ borderRadius: 6, fontWeight: 700 }}>
          {value}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'right' as const,
      render: (_: unknown, record: User) => (
        <Space>
          <Button type="text" icon={<EditOutlined style={{ color: BRAND.primary }} />} onClick={() => setSelectedUser(record)} style={{ background: 'rgba(0,166,81,0.05)' }}>
            Sửa
          </Button>
          <Select size="small" value={record.status} style={{ width: 120 }} loading={savingStatusId === record.id} onChange={(value) => handleUpdateStatus(record.id, value)}>
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
          <Text type="secondary">Quản trị toàn bộ tài khoản người chơi, chủ sân và admin trong hệ thống.</Text>
        </div>
      </div>

      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}><Card bodyStyle={{ padding: 20 }} style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}><Statistic title="Tổng người dùng" value={totalElements} prefix={<UserOutlined style={{ color: BRAND.primary }} />} /></Card></Col>
        <Col xs={24} sm={8}><Card bodyStyle={{ padding: 20 }} style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}><Statistic title="Hoạt động" value={stats.active} prefix={<SafetyCertificateOutlined style={{ color: '#52c41a' }} />} /></Card></Col>
        <Col xs={24} sm={8}><Card bodyStyle={{ padding: 20 }} style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}><Statistic title="Chủ sân" value={stats.owners} prefix={<UserOutlined style={{ color: BRAND.sky }} />} /></Card></Col>
      </Row>

      <Card bodyStyle={{ padding: 0 }} style={{ borderRadius: 16, overflow: 'hidden', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: 16 }}>
          <Input placeholder="Tìm theo tên, email..." prefix={<SearchOutlined style={{ color: '#94a3b8' }} />} value={search} onChange={(e) => { setPage(1); setSearch(e.target.value); }} style={{ width: 320, borderRadius: 10 }} />
          <Select placeholder="Lọc vai trò" style={{ width: 150 }} value={role || undefined} onChange={(value) => { setPage(1); setRole(value || ''); }} allowClear>
            <Option value="USER">Người chơi</Option>
            <Option value="OWNER">Chủ sân</Option>
            <Option value="ADMIN">Quản trị viên</Option>
          </Select>
          <Select placeholder="Trạng thái" style={{ width: 150 }} value={status || undefined} onChange={(value) => { setPage(1); setStatus(value || ''); }} allowClear>
            <Option value="ACTIVE">Hoạt động</Option>
            <Option value="INACTIVE">Khóa</Option>
            <Option value="BANNED">Cấm</Option>
          </Select>
        </div>

        <Table columns={columns} dataSource={users} rowKey="id" loading={loading} pagination={{ current: page, total: totalElements, pageSize: 10, onChange: setPage, showSizeChanger: false, style: { paddingRight: 24 } }} />
      </Card>

      <Modal title={<div style={{ paddingBottom: 10, borderBottom: '1px solid #f1f5f9' }}>Cập nhật vai trò</div>} open={!!selectedUser} onCancel={() => setSelectedUser(null)} onOk={() => form.submit()} confirmLoading={savingRoles} okButtonProps={{ style: { background: BRAND.primary } }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '20px 0' }}>
          <Avatar size={64} src={selectedUser?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser?.id}`} />
          <div>
            <Title level={4} style={{ margin: 0 }}>{selectedUser?.fullName}</Title>
            <Text type="secondary">{selectedUser?.email}</Text>
          </div>
        </div>
        <Form form={form} layout="vertical" onFinish={handleUpdateRoles}>
          <Form.Item name="roleCodes" label={<Text strong>Phân quyền hệ thống</Text>} rules={[{ required: true, message: 'Vui lòng chọn ít nhất 1 vai trò' }]}>
            <Select mode="multiple" placeholder="Chọn vai trò">
              <Option value="USER">Người chơi</Option>
              <Option value="OWNER">Chủ sân</Option>
              <Option value="ADMIN">Quản trị viên</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

