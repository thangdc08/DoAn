import { Card, Table, Button, Space, Modal, Input, message, Typography, Tag, Avatar, Badge, Row, Col, List, Select, Image, Divider } from 'antd';
import { CheckOutlined, CloseOutlined, EyeOutlined, ShopOutlined, EnvironmentOutlined, UserOutlined, SearchOutlined, CheckCircleOutlined, WarningOutlined, DeleteOutlined } from '@ant-design/icons';
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
  const [viewVenue, setViewVenue] = useState<AdminVenue | null>(null);
  const [venues, setVenues] = useState<AdminVenue[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(1);
  const [size] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('');
  const [realPendingCount, setRealPendingCount] = useState(0);

  // Unified action popup states
  const [actionVenue, setActionVenue] = useState<AdminVenue | null>(null);
  const [actionType, setActionType] = useState<'APPROVE' | 'REJECT' | 'SUSPEND' | 'REACTIVATE' | 'DELETE' | null>(null);
  const [reason, setReason] = useState('');
  const [confirmInput, setConfirmInput] = useState('');

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

      // Fetch global pending count
      const pendingList = await venueApi.getPendingVenues();
      setRealPendingCount(pendingList?.length || 0);
    } catch (error) {
      console.error(error);
      message.error('Không tải được danh sách cơ sở');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, [page, size, search, status]);

  const triggerAction = (venue: AdminVenue, type: 'APPROVE' | 'REJECT' | 'SUSPEND' | 'REACTIVATE' | 'DELETE') => {
    setActionVenue(venue);
    setActionType(type);
    setReason('');
    setConfirmInput('');
  };

  const handleExecuteAction = async () => {
    if (!actionVenue || !actionType) return;
    
    if (actionType === 'REJECT' && !reason.trim()) {
      return message.warning('Vui lòng nhập lý do từ chối');
    }
    if (actionType === 'SUSPEND' && !reason.trim()) {
      return message.warning('Vui lòng nhập lý do tạm dừng hoạt động');
    }
    if (actionType === 'DELETE' && confirmInput.trim() !== actionVenue.name.trim()) {
      return message.warning('Tên cơ sở xác nhận không khớp');
    }

    try {
      setSubmitting(true);
      if (actionType === 'APPROVE' || actionType === 'REACTIVATE') {
        await venueApi.approveVenue(actionVenue.id);
        message.success(actionType === 'APPROVE' ? 'Phê duyệt cơ sở thành công' : 'Đã kích hoạt lại cơ sở thành công');
      } else if (actionType === 'REJECT') {
        await venueApi.rejectVenue(actionVenue.id, reason.trim());
        message.success('Đã từ chối đơn đăng ký cơ sở');
      } else if (actionType === 'SUSPEND') {
        await venueApi.suspendVenue(actionVenue.id);
        message.success('Đã tạm dừng hoạt động cơ sở thành công');
      } else if (actionType === 'DELETE') {
        await venueApi.deleteVenueByAdmin(actionVenue.id);
        message.success('Đã xóa cơ sở vĩnh viễn thành công');
      }
      
      setActionVenue(null);
      setActionType(null);
      setViewVenue(null);
      await fetchVenues();
    } catch (error) {
      console.error(error);
      message.error(error instanceof Error ? error.message : 'Thực hiện thao tác thất bại');
    } finally {
      setSubmitting(false);
    }
  };



  const columns = [
    {
      title: 'Cơ sở đăng ký',
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
      title: 'Chủ sở hữu',
      key: 'owner',
      render: (_: unknown, record: AdminVenue) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          <Text>{record.ownerName || record.ownerId || 'Chưa rõ'}</Text>
        </Space>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (value: string) => {
        const color = value === 'PENDING_APPROVAL' ? 'gold' : value === 'APPROVED' ? 'green' : value === 'REJECTED' ? 'red' : 'default';
        const label = value === 'PENDING_APPROVAL' ? 'Chờ duyệt' : value === 'APPROVED' ? 'Đã duyệt' : value === 'REJECTED' ? 'Từ chối' : value === 'SUSPENDED' ? 'Đình chỉ' : value;
        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: 'Ngày gửi',
      dataIndex: 'createdAt',
      key: 'date',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'right' as const,
      render: (_: unknown, record: AdminVenue) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => setViewVenue(record)}>Chi tiết</Button>
          {record.status === 'PENDING_APPROVAL' && (
            <>
              <Button type="primary" icon={<CheckOutlined />} onClick={() => triggerAction(record, 'APPROVE')} style={{ background: BRAND.primary, border: 'none' }}>
                Duyệt
              </Button>
              <Button danger icon={<CloseOutlined />} onClick={() => triggerAction(record, 'REJECT')}>Từ chối</Button>
            </>
          )}
          {record.status === 'APPROVED' && (
            <Button danger icon={<CloseOutlined />} onClick={() => triggerAction(record, 'SUSPEND')}>
              Tạm dừng
            </Button>
          )}
          {record.status === 'SUSPENDED' && (
            <Button type="primary" icon={<CheckOutlined />} onClick={() => triggerAction(record, 'REACTIVATE')} style={{ background: BRAND.primary, border: 'none' }}>
              Mở lại
            </Button>
          )}
          {record.status !== 'PENDING_APPROVAL' && (
            <Button danger type="text" onClick={() => triggerAction(record, 'DELETE')}>
              Xóa
            </Button>
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
          <Title level={2} style={{ margin: 0 }}>Quản lý tất cả cơ sở</Title>
          <Text type="secondary">Danh sách toàn bộ cơ sở trong hệ thống và bộ lọc theo trạng thái.</Text>
        </div>
        <Badge count={realPendingCount} offset={[10, 0]}>
          <Text 
            strong 
            style={{ 
              background: '#fff', 
              padding: '8px 16px', 
              borderRadius: 10, 
              border: '1px solid #f1f5f9',
              cursor: realPendingCount > 0 ? 'pointer' : 'default',
              transition: 'all 0.2s',
            }}
            onClick={() => {
              if (realPendingCount > 0) {
                setStatus('PENDING_APPROVAL');
                setPage(1);
              }
            }}
            onMouseEnter={(e) => {
              if (realPendingCount > 0) {
                e.currentTarget.style.borderColor = BRAND.primary;
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#f1f5f9';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Đang chờ: {realPendingCount} đơn
          </Text>
        </Badge>
      </div>

      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card style={{ borderRadius: 16, overflow: 'hidden', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <Input
                placeholder="Tìm theo tên, địa chỉ..."
                value={search}
                onChange={(e) => {
                  setPage(1);
                  setSearch(e.target.value);
                }}
                prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
                style={{ width: 320 }}
              />
              <Select
                placeholder="Lọc trạng thái"
                allowClear
                value={status || undefined}
                style={{ width: 220 }}
                onChange={(value) => {
                  setPage(1);
                  setStatus(value || '');
                }}
                options={[
                  { label: 'Chờ duyệt', value: 'PENDING_APPROVAL' },
                  { label: 'Đã duyệt', value: 'APPROVED' },
                  { label: 'Từ chối', value: 'REJECTED' },
                  { label: 'Đình chỉ', value: 'SUSPENDED' },
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
              locale={{ emptyText: 'Không có cơ sở nào' }}
            />
          </Card>
        </Col>
      </Row>

      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: BRAND.primaryLight,
              color: BRAND.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18
            }}>
              <ShopOutlined />
            </div>
            <div>
              <Text strong style={{ fontSize: 16 }}>Hồ sơ cơ sở: {viewVenue?.name}</Text>
              <div style={{ marginTop: 2 }}>
                {viewVenue && (
                  <Tag color={
                    viewVenue.status === 'PENDING_APPROVAL' ? 'gold' :
                    viewVenue.status === 'APPROVED' ? 'green' :
                    viewVenue.status === 'REJECTED' ? 'red' : 'default'
                  }>
                    {
                      viewVenue.status === 'PENDING_APPROVAL' ? 'Chờ duyệt' :
                      viewVenue.status === 'APPROVED' ? 'Đã duyệt' :
                      viewVenue.status === 'REJECTED' ? 'Từ chối' : 'Đình chỉ'
                    }
                  </Tag>
                )}
              </div>
            </div>
          </div>
        }
        open={!!viewVenue}
        onCancel={() => setViewVenue(null)}
        width={850}
        footer={[
          <Button key="close" onClick={() => setViewVenue(null)} size="large" style={{ borderRadius: 8 }}>
            Đóng
          </Button>,
          viewVenue?.status === 'PENDING_APPROVAL' && (
            <Button
              key="reject"
              danger
              icon={<CloseOutlined />}
              onClick={() => viewVenue && triggerAction(viewVenue, 'REJECT')}
              size="large"
              style={{ borderRadius: 8 }}
            >
              Từ chối
            </Button>
          ),
          viewVenue?.status === 'PENDING_APPROVAL' && (
            <Button
              key="approve"
              type="primary"
              icon={<CheckOutlined />}
              style={{ background: BRAND.primary, border: 'none', borderRadius: 8 }}
              onClick={() => viewVenue && triggerAction(viewVenue, 'APPROVE')}
              size="large"
            >
              Duyệt hệ thống
            </Button>
          ),
          viewVenue?.status === 'APPROVED' && (
            <Button
              key="suspend"
              danger
              icon={<CloseOutlined />}
              onClick={() => viewVenue && triggerAction(viewVenue, 'SUSPEND')}
              size="large"
              style={{ borderRadius: 8 }}
            >
              Tạm dừng cơ sở
            </Button>
          ),
          viewVenue?.status === 'SUSPENDED' && (
            <Button
              key="reactivate"
              type="primary"
              icon={<CheckOutlined />}
              style={{ background: BRAND.primary, border: 'none', borderRadius: 8 }}
              onClick={() => viewVenue && triggerAction(viewVenue, 'REACTIVATE')}
              size="large"
            >
              Kích hoạt lại cơ sở
            </Button>
          ),
          viewVenue && viewVenue.status !== 'PENDING_APPROVAL' && (
            <Button
              key="delete"
              danger
              type="primary"
              onClick={() => viewVenue && triggerAction(viewVenue, 'DELETE')}
              size="large"
              style={{ borderRadius: 8 }}
            >
              Xóa cơ sở
            </Button>
          )
        ].filter(Boolean as any)}
      >
        <div style={{ padding: '10px 0', marginTop: 16 }}>
          {/* Images Section */}
          {viewVenue?.images && viewVenue.images.length > 0 ? (
            <div style={{ marginBottom: 20 }}>
              <Text strong style={{ display: 'block', marginBottom: 10, fontSize: 15 }}>
                Hình ảnh cơ sở ({viewVenue.images.length})
              </Text>
              <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }}>
                <Image.PreviewGroup>
                  {viewVenue.images.map((img) => (
                    <Image
                      key={img.id}
                      src={img.imageUrl}
                      width={160}
                      height={100}
                      style={{ objectFit: 'cover', borderRadius: 10, border: '1px solid #e2e8f0' }}
                    />
                  ))}
                </Image.PreviewGroup>
              </div>
            </div>
          ) : (
            <div style={{
              height: 120,
              width: '100%',
              borderRadius: 12,
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
              border: '1px dashed #cbd5e1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748b',
              marginBottom: 20,
              flexDirection: 'column'
            }}>
              <ShopOutlined style={{ fontSize: 30, marginBottom: 6, color: '#94a3b8' }} />
              <Text style={{ color: '#64748b', fontSize: 13 }}>Chưa có hình ảnh cơ sở</Text>
            </div>
          )}

          <Row gutter={[24, 24]}>
            {/* Left Column */}
            <Col span={14}>
              <div style={{ background: '#f8fafc', padding: 16, borderRadius: 12, border: '1px solid #f1f5f9', marginBottom: 16 }}>
                <Title level={5} style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
                  <span style={{ width: 4, height: 16, background: BRAND.primary, borderRadius: 2, display: 'inline-block' }}></span>
                  Mô tả cơ sở
                </Title>
                <Paragraph style={{ margin: 0, color: '#334155', lineHeight: '1.6', fontSize: 13 }}>
                  {viewVenue?.description || 'Chưa có mô tả chi tiết từ chủ sân.'}
                </Paragraph>
              </div>

              <div style={{ background: '#f8fafc', padding: 16, borderRadius: 12, border: '1px solid #f1f5f9' }}>
                <Title level={5} style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
                  <span style={{ width: 4, height: 16, background: BRAND.primary, borderRadius: 2, display: 'inline-block' }}></span>
                  Khung giờ & Giá hoạt động
                </Title>
                <Row gutter={[16, 16]} style={{ marginTop: 12 }}>
                  <Col span={12}>
                    <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>Thời gian mở cửa</Text>
                    <Text strong style={{ fontSize: 14, color: BRAND.text }}>
                      {viewVenue?.openTime || '--:--'} - {viewVenue?.closeTime || '--:--'}
                    </Text>
                  </Col>
                  <Col span={12}>
                    <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>Mức giá dao động</Text>
                    <Text strong style={{ fontSize: 14, color: '#e11d48' }}>
                      {viewVenue?.priceMin ? viewVenue.priceMin.toLocaleString('vi-VN') : '0'}đ - {viewVenue?.priceMax ? viewVenue.priceMax.toLocaleString('vi-VN') : '0'}đ / giờ
                    </Text>
                  </Col>
                </Row>
                {viewVenue?.policy && (
                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px dashed #e2e8f0' }}>
                    <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>Chính sách đặt/huỷ sân</Text>
                    <Text style={{ fontSize: 13, color: '#475569' }}>{viewVenue.policy}</Text>
                  </div>
                )}
              </div>
            </Col>

            {/* Right Column */}
            <Col span={10}>
              <div style={{ background: '#fff', padding: 16, borderRadius: 12, border: '1px solid #e2e8f0', height: '100%' }}>
                <Title level={5} style={{ marginTop: 0, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
                  <span style={{ width: 4, height: 16, background: BRAND.sky, borderRadius: 2, display: 'inline-block' }}></span>
                  Thông tin liên hệ
                </Title>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>Địa chỉ chi tiết</Text>
                    <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                      <EnvironmentOutlined style={{ color: BRAND.sky, marginTop: 3 }} />
                      <Text style={{ color: BRAND.text, fontSize: 13 }}>{viewVenue?.address}</Text>
                    </div>
                  </div>

                  <div>
                    <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>Chủ sở hữu</Text>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                      <Avatar size="small" icon={<UserOutlined />} style={{ background: BRAND.sky }} />
                      <Text style={{ color: BRAND.text, fontSize: 13 }} copyable>
                        {viewVenue?.ownerName || viewVenue?.ownerId || 'Chưa rõ'}
                      </Text>
                    </div>
                  </div>

                  <div>
                    <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>Số điện thoại</Text>
                    <Text strong style={{ color: BRAND.text, fontSize: 13, display: 'block', marginTop: 2 }}>
                      {viewVenue?.phone || 'Chưa cung cấp'}
                    </Text>
                  </div>

                  {viewVenue?.email && (
                    <div>
                      <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>Email liên lạc</Text>
                      <Text style={{ color: BRAND.text, fontSize: 13, display: 'block', marginTop: 2 }}>
                        {viewVenue.email}
                      </Text>
                    </div>
                  )}

                  <Divider style={{ margin: '8px 0' }} />

                  <div>
                    <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>Tiện ích cơ sở</Text>
                    <Space wrap>
                      {utilities.length > 0 ? (
                        utilities.map((item) => (
                          <Tag key={item} color="blue" style={{ margin: 0, borderRadius: 6, padding: '2px 8px' }}>
                            {item}
                          </Tag>
                        ))
                      ) : (
                        <Text type="secondary" style={{ fontSize: 13 }}>Chưa cập nhật tiện ích</Text>
                      )}
                    </Space>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Modal>

      {/* Dynamic Action Confirmation Modal */}
      <Modal
        open={!!actionVenue && !!actionType}
        onCancel={() => {
          setActionVenue(null);
          setActionType(null);
        }}
        footer={null}
        width={480}
        centered
        styles={{
          body: { padding: '24px 24px 20px 24px' }
        }}
        closable={!submitting}
        title={null}
      >
        {actionVenue && actionType && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            {/* Action Icon Container */}
            <div style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              marginBottom: 16,
              background: 
                actionType === 'APPROVE' || actionType === 'REACTIVATE' ? '#ecfdf5' :
                actionType === 'REJECT' ? '#fef2f2' :
                actionType === 'SUSPEND' ? '#fffbeb' : '#fef2f2',
              color:
                actionType === 'APPROVE' || actionType === 'REACTIVATE' ? '#10b981' :
                actionType === 'REJECT' ? '#ef4444' :
                actionType === 'SUSPEND' ? '#f59e0b' : '#dc2626',
            }}>
              {actionType === 'APPROVE' && <CheckCircleOutlined />}
              {actionType === 'REACTIVATE' && <CheckCircleOutlined />}
              {actionType === 'REJECT' && <CloseOutlined />}
              {actionType === 'SUSPEND' && <WarningOutlined />}
              {actionType === 'DELETE' && <DeleteOutlined />}
            </div>

            {/* Title */}
            <Title level={4} style={{ margin: '0 0 8px 0', fontSize: 18, color: '#0f172a' }}>
              {actionType === 'APPROVE' && 'Xác nhận phê duyệt cơ sở'}
              {actionType === 'REACTIVATE' && 'Kích hoạt lại cơ sở'}
              {actionType === 'REJECT' && 'Từ chối yêu cầu đăng ký'}
              {actionType === 'SUSPEND' && 'Tạm dừng hoạt động'}
              {actionType === 'DELETE' && 'Xóa vĩnh viễn cơ sở'}
            </Title>

            {/* Description */}
            <Paragraph style={{ color: '#475569', fontSize: 13, lineHeight: '1.5', margin: '0 0 20px 0' }}>
              {actionType === 'APPROVE' && (
                <>Bạn có chắc chắn muốn phê duyệt hoạt động cho cơ sở <strong>{actionVenue.name}</strong>? Sau khi duyệt, cơ sở sẽ hiển thị công khai trên ứng dụng.</>
              )}
              {actionType === 'REACTIVATE' && (
                <>Hành động này sẽ kích hoạt lại cơ sở <strong>{actionVenue.name}</strong>. Khách hàng có thể tiếp tục đặt sân bình thường.</>
              )}
              {actionType === 'REJECT' && (
                <>Bạn đang từ chối yêu cầu đăng ký của <strong>{actionVenue.name}</strong>. Vui lòng nhập lý do bên dưới để gửi phản hồi cho chủ sân.</>
              )}
              {actionType === 'SUSPEND' && (
                <>Tạm dừng hoạt động cơ sở <strong>{actionVenue.name}</strong>. Tất cả các lịch đặt mới sẽ bị chặn cho đến khi được kích hoạt lại.</>
              )}
              {actionType === 'DELETE' && (
                <>Hành động này <span style={{ color: '#ef4444', fontWeight: 'bold' }}>KHÔNG THỂ KHÔI PHỤC</span>. Cơ sở <strong>{actionVenue.name}</strong> cùng toàn bộ sân, bảng giá và dữ liệu liên quan sẽ bị xóa vĩnh viễn khỏi hệ thống.</>
              )}
            </Paragraph>

            {/* Rejection / Suspension Input Reason */}
            {(actionType === 'REJECT' || actionType === 'SUSPEND') && (
              <div style={{ width: '100%', textAlign: 'left', marginBottom: 20 }}>
                <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 6, color: '#334155' }}>
                  Lý do {actionType === 'REJECT' ? 'từ chối' : 'tạm dừng'} <span style={{ color: '#ef4444' }}>*</span>
                </Text>
                <TextArea
                  rows={4}
                  placeholder={actionType === 'REJECT' ? 'Nhập lý do chi tiết (ví dụ: Thông tin liên hệ chưa chính xác, giấy phép không hợp lệ...)' : 'Nhập lý do tạm dừng hoạt động...'}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  style={{ borderRadius: 8, borderColor: '#cbd5e1', fontSize: 13 }}
                  disabled={submitting}
                />
              </div>
            )}

            {/* Delete Confirmation Name Input */}
            {actionType === 'DELETE' && (
              <div style={{ width: '100%', textAlign: 'left', marginBottom: 20, background: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <Text style={{ fontSize: 12, display: 'block', marginBottom: 8, color: '#475569' }}>
                  Để xác nhận, vui lòng nhập chính xác tên cơ sở: <strong>{actionVenue.name}</strong>
                </Text>
                <Input
                  placeholder="Nhập tên cơ sở để xác nhận..."
                  value={confirmInput}
                  onChange={(e) => setConfirmInput(e.target.value)}
                  style={{ borderRadius: 8, borderColor: '#cbd5e1', fontSize: 13 }}
                  disabled={submitting}
                />
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 10, width: '100%', marginTop: 10 }}>
              <Button
                style={{ flex: 1, height: 38, borderRadius: 8 }}
                onClick={() => {
                  setActionVenue(null);
                  setActionType(null);
                }}
                disabled={submitting}
              >
                Hủy
              </Button>
              <Button
                type="primary"
                danger={actionType === 'REJECT' || actionType === 'SUSPEND' || actionType === 'DELETE'}
                style={{
                  flex: 1,
                  height: 38,
                  borderRadius: 8,
                  border: 'none',
                  background:
                    actionType === 'APPROVE' || actionType === 'REACTIVATE' ? '#10b981' :
                    actionType === 'DELETE' ? '#dc2626' : undefined
                }}
                loading={submitting}
                onClick={handleExecuteAction}
                disabled={
                  (actionType === 'DELETE' && confirmInput.trim() !== actionVenue.name.trim()) ||
                  ((actionType === 'REJECT' || actionType === 'SUSPEND') && !reason.trim())
                }
              >
                {actionType === 'APPROVE' && 'Phê duyệt'}
                {actionType === 'REACTIVATE' && 'Kích hoạt lại'}
                {actionType === 'REJECT' && 'Từ chối đăng ký'}
                {actionType === 'SUSPEND' && 'Tạm dừng'}
                {actionType === 'DELETE' && 'Xóa vĩnh viễn'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
