import { Card, Table, Button, Space, Modal, Input, message, Typography, Tag, Avatar, Badge, Row, Col, List, Select } from 'antd';
import { CheckOutlined, CloseOutlined, EyeOutlined, ShopOutlined, EnvironmentOutlined, UserOutlined, SearchOutlined } from '@ant-design/icons';
import { useEffect, useMemo, useState } from 'react';
import { BRAND } from '../../theme/antdTheme';
import dayjs from 'dayjs';
import { venueApi } from '../../services/venueApi';
import type { Venue } from '../../types/venue.types';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

type AdminVenue = Venue & { ownerName?: string; courtCount?: number };

export default function VenueApprovalPage() {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [rejectVenue, setRejectVenue] = useState<AdminVenue | null>(null);
  const [viewVenue, setViewVenue] = useState<AdminVenue | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [venues, setVenues] = useState<AdminVenue[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(1);
  const [size] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('');

  const fetchVenues = async () => {
    setLoading(true);
    try {
      const data = await venueApi.getAdminVenues({
        page: page - 1,
        size,
        search: search || undefined,
        status: status || undefined,
      });
      setVenues((data?.content || []) as AdminVenue[]);
      setTotalElements(data?.totalElements || 0);
    } catch (error) {
      console.error(error);
      message.error('Khong tai duoc danh sach co so');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, [page, size, search, status]);

  const handleApprove = async (id: string) => {
    try {
      setSubmitting(true);
      await venueApi.approveVenue(id);
      message.success('Da duyet san thanh cong');
      setViewVenue(null);
      await fetchVenues();
    } catch (error) {
      console.error(error);
      message.error('Duyet san that bai');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!rejectVenue) return;
    if (!rejectReason.trim()) return message.warning('Vui long nhap ly do tu choi');
    try {
      setSubmitting(true);
      await venueApi.rejectVenue(rejectVenue.id, rejectReason.trim());
      message.success('Da tu choi san');
      setRejectVenue(null);
      setRejectReason('');
      await fetchVenues();
    } catch (error) {
      console.error(error);
      message.error('Tu choi that bai');
    } finally {
      setSubmitting(false);
    }
  };

  const pendingCount = useMemo(
    () => venues.filter((v) => v.status === 'PENDING_APPROVAL').length,
    [venues]
  );

  const columns = [
    {
      title: 'Co so dang ky',
      key: 'venue',
      render: (_: unknown, record: AdminVenue) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(0,91,172,0.1)', color: BRAND.sky, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
            <ShopOutlined />
          </div>
          <div>
            <Text strong style={{ display: 'block' }}>{record.name}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              <EnvironmentOutlined style={{ marginRight: 4 }} />
              {record.address}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Chu so huu',
      key: 'owner',
      render: (_: unknown, record: AdminVenue) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          <Text>{record.ownerName || record.ownerId || 'Chua ro'}</Text>
        </Space>
      ),
    },
    {
      title: 'Trang thai',
      dataIndex: 'status',
      key: 'status',
      render: (value: string) => {
        const color = value === 'PENDING_APPROVAL' ? 'gold' : value === 'APPROVED' ? 'green' : value === 'REJECTED' ? 'red' : 'default';
        return <Tag color={color}>{value}</Tag>;
      },
    },
    {
      title: 'Ngay gui',
      dataIndex: 'createdAt',
      key: 'date',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Thao tac',
      key: 'action',
      align: 'right' as const,
      render: (_: unknown, record: AdminVenue) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => setViewVenue(record)}>Chi tiet</Button>
          {record.status === 'PENDING_APPROVAL' && (
            <>
              <Button type="primary" icon={<CheckOutlined />} loading={submitting} onClick={() => handleApprove(record.id)} style={{ background: BRAND.primary, border: 'none' }}>
                Duyet
              </Button>
              <Button danger icon={<CloseOutlined />} onClick={() => setRejectVenue(record)}>Tu choi</Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  const utilities = useMemo(() => viewVenue?.utilities || [], [viewVenue]);

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>Quan ly tat ca co so</Title>
          <Text type="secondary">Danh sach toan bo co so trong he thong va bo loc theo trang thai.</Text>
        </div>
        <Badge count={pendingCount} offset={[10, 0]}>
          <Text strong style={{ background: '#fff', padding: '8px 16px', borderRadius: 10, border: '1px solid #f1f5f9' }}>Dang cho: {pendingCount} don</Text>
        </Badge>
      </div>

      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card style={{ borderRadius: 16, overflow: 'hidden', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <Input
                placeholder="Tim theo ten, dia chi..."
                value={search}
                onChange={(e) => {
                  setPage(1);
                  setSearch(e.target.value);
                }}
                prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
                style={{ width: 320 }}
              />
              <Select
                placeholder="Loc trang thai"
                allowClear
                value={status || undefined}
                style={{ width: 220 }}
                onChange={(value) => {
                  setPage(1);
                  setStatus(value || '');
                }}
                options={[
                  { label: 'PENDING_APPROVAL', value: 'PENDING_APPROVAL' },
                  { label: 'APPROVED', value: 'APPROVED' },
                  { label: 'REJECTED', value: 'REJECTED' },
                  { label: 'SUSPENDED', value: 'SUSPENDED' },
                ]}
              />
            </div>
            <Table
              columns={columns}
              dataSource={venues}
              rowKey="id"
              loading={loading}
              pagination={{
                current: page,
                pageSize: size,
                total: totalElements,
                onChange: setPage,
                showSizeChanger: false,
              }}
              locale={{ emptyText: 'Khong co co so nao' }}
            />
          </Card>
        </Col>
      </Row>

      <Modal title={<Space><ShopOutlined style={{ color: BRAND.primary }} /> <Text strong>Ho so co so: {viewVenue?.name}</Text></Space>} open={!!viewVenue} onCancel={() => setViewVenue(null)} width={760} footer={[<Button key="close" onClick={() => setViewVenue(null)}>Dong</Button>, viewVenue?.status === 'PENDING_APPROVAL' ? <Button key="reject" danger icon={<CloseOutlined />} onClick={() => { setRejectVenue(viewVenue); setViewVenue(null); }}>Tu choi</Button> : null, viewVenue?.status === 'PENDING_APPROVAL' ? <Button key="approve" type="primary" loading={submitting} icon={<CheckOutlined />} style={{ background: BRAND.primary }} onClick={() => viewVenue && handleApprove(viewVenue.id)}>Duyet he thong</Button> : null].filter(Boolean as any)}>
        <div style={{ padding: '16px 0' }}>
          <Row gutter={[24, 24]}>
            <Col span={14}>
              <Title level={5}>Mo ta</Title>
              <Paragraph>{viewVenue?.description || 'Chua co mo ta'}</Paragraph>
              <Title level={5}>Dia chi va lien he</Title>
              <List size="small">
                <List.Item><Space><EnvironmentOutlined /> {viewVenue?.address}</Space></List.Item>
                <List.Item><Space><UserOutlined /> Chu san: {viewVenue?.ownerName || viewVenue?.ownerId || 'Chua ro'}</Space></List.Item>
                <List.Item><Space>SDT: {viewVenue?.phone || '-'}</Space></List.Item>
              </List>
            </Col>
            <Col span={10}>
              <Title level={5}>Tien ich</Title>
              <Space wrap>
                {utilities.length ? utilities.map((item) => <Tag key={item}>{item}</Tag>) : <Text type="secondary">Chua co tien ich</Text>}
              </Space>
            </Col>
          </Row>
        </div>
      </Modal>

      <Modal title={<div style={{ color: '#ff4d4f' }}><CloseOutlined style={{ marginRight: 8 }} />Tu choi yeu cau dang ky</div>} open={!!rejectVenue} confirmLoading={submitting} onCancel={() => { setRejectVenue(null); setRejectReason(''); }} onOk={handleReject} okText="Gui thong bao tu choi" okButtonProps={{ danger: true }}>
        <div style={{ marginBottom: 16 }}>
          <Text type="secondary">Ban dang tu choi san:</Text>
          <div style={{ fontWeight: 'bold', fontSize: 16, marginTop: 4 }}>{rejectVenue?.name}</div>
        </div>
        <Text strong>Ly do tu choi:</Text>
        <TextArea rows={4} placeholder="Nhap ly do tu choi..." value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} style={{ marginTop: 8, borderRadius: 10 }} />
      </Modal>
    </div>
  );
}

