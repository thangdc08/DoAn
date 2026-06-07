import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, Row, Col, Typography, Space, Button, Table, Tag, Modal, Form, Input, message, Tooltip } from 'antd';
import { CheckOutlined, CloseOutlined, InfoCircleOutlined, WalletOutlined, HourglassOutlined, CheckCircleOutlined, FileTextOutlined } from '@ant-design/icons';
import { payoutApi, type PayoutRequest } from '../../services/payoutApi';
import { BRAND } from '../../theme/antdTheme';

const { Title, Text } = Typography;

export default function AdminPayoutPage() {
  const queryClient = useQueryClient();
  const [selectedRequest, setSelectedRequest] = useState<PayoutRequest | null>(null);
  const [actionType, setActionType] = useState<'APPROVE' | 'REJECT' | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  // Fetch all payout requests
  const { data: requests, isLoading } = useQuery({
    queryKey: ['adminPayoutRequests'],
    queryFn: payoutApi.getAllRequestsForAdmin,
  });

  // Approve Mutation
  const approveMutation = useMutation({
    mutationFn: ({ id, notes }: { id: string; notes: string }) => payoutApi.approvePayout(id, notes),
    onSuccess: () => {
      message.success('Phê duyệt yêu cầu rút tiền thành công!');
      handleCloseModal();
      queryClient.invalidateQueries({ queryKey: ['adminPayoutRequests'] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra khi phê duyệt');
    },
  });

  // Reject Mutation
  const rejectMutation = useMutation({
    mutationFn: ({ id, notes }: { id: string; notes: string }) => payoutApi.rejectPayout(id, notes),
    onSuccess: () => {
      message.success('Từ chối yêu cầu rút tiền thành công!');
      handleCloseModal();
      queryClient.invalidateQueries({ queryKey: ['adminPayoutRequests'] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra khi từ chối');
    },
  });

  const handleOpenActionModal = (request: PayoutRequest, type: 'APPROVE' | 'REJECT') => {
    setSelectedRequest(request);
    setActionType(type);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
    setActionType(null);
    form.resetFields();
  };

  const handleConfirmAction = (values: any) => {
    if (!selectedRequest) return;
    if (actionType === 'APPROVE') {
      approveMutation.mutate({ id: selectedRequest.id, notes: values.adminNotes });
    } else if (actionType === 'REJECT') {
      rejectMutation.mutate({ id: selectedRequest.id, notes: values.adminNotes });
    }
  };

  // Compute metrics
  const pendingRequests = requests ? requests.filter(r => r.status === 'PENDING') : [];
  const approvedRequests = requests ? requests.filter(r => r.status === 'APPROVED') : [];
  const totalApprovedAmount = approvedRequests.reduce((sum, r) => sum + r.amount, 0);

  const columns = [
    {
      title: 'Chủ sân (ID)',
      dataIndex: 'ownerId',
      key: 'ownerId',
      render: (ownerId: string) => <Text copyable={{ text: ownerId }}>{ownerId.substring(0, 8)}...</Text>,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString('vi-VN'),
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => <Text strong style={{ color: '#16a34a' }}>{amount.toLocaleString('vi-VN')} đ</Text>,
    },
    {
      title: 'Ngân hàng thụ hưởng',
      key: 'bankInfo',
      render: (_: any, record: PayoutRequest) => (
        <Space direction="vertical" size={0}>
          <Text strong>{record.bankName}</Text>
          <Text type="secondary">{record.bankAccount} - {record.bankAccountName}</Text>
        </Space>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'gold';
        let label = 'Chờ duyệt';
        if (status === 'APPROVED') {
          color = 'green';
          label = 'Đã thanh toán';
        } else if (status === 'REJECTED') {
          color = 'red';
          label = 'Đã từ chối';
        }
        return <Tag color={color} style={{ borderRadius: 4, fontWeight: 600 }}>{label}</Tag>;
      },
    },
    {
      title: 'Ghi chú của Owner',
      dataIndex: 'notes',
      key: 'notes',
      render: (notes: string) => notes ? <Text italic>{notes}</Text> : <Text type="secondary">-</Text>,
    },
    {
      title: 'Phản hồi/Giao dịch',
      dataIndex: 'adminNotes',
      key: 'adminNotes',
      render: (adminNotes: string) => adminNotes ? <Text strong>{adminNotes}</Text> : <Text type="secondary">-</Text>,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: PayoutRequest) => {
        if (record.status !== 'PENDING') return <Text type="secondary">-</Text>;
        return (
          <Space>
            <Tooltip title="Duyệt chi tiền">
              <Button
                type="primary"
                shape="circle"
                icon={<CheckOutlined />}
                onClick={() => handleOpenActionModal(record, 'APPROVE')}
                style={{ background: '#52c41a', borderColor: '#52c41a' }}
              />
            </Tooltip>
            <Tooltip title="Từ chối yêu cầu">
              <Button
                type="primary"
                danger
                shape="circle"
                icon={<CloseOutlined />}
                onClick={() => handleOpenActionModal(record, 'REJECT')}
              />
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>Quản lý Yêu cầu Rút tiền</Title>
        <Text type="secondary">Xét duyệt và xử lý các yêu cầu chuyển khoản doanh thu của chủ sân.</Text>
      </div>

      {/* Metrics Row */}
      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={8}>
          <Card
            bodyStyle={{ padding: 24 }}
            style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', background: 'linear-gradient(135deg, #fffbe6 0%, #fff1b8 100%)' }}
          >
            <Space size="large">
              <HourglassOutlined style={{ fontSize: 32, color: '#d4b106' }} />
              <Space direction="vertical" size={0}>
                <Text type="secondary" strong>Chờ xử lý</Text>
                <Title level={2} style={{ margin: 0, fontWeight: 800, color: '#d4b106' }}>
                  {pendingRequests.length} yêu cầu
                </Title>
              </Space>
            </Space>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card
            bodyStyle={{ padding: 24 }}
            style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', background: 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)' }}
          >
            <Space size="large">
              <CheckCircleOutlined style={{ fontSize: 32, color: '#389e0d' }} />
              <Space direction="vertical" size={0}>
                <Text type="secondary" strong>Đã giải quyết</Text>
                <Title level={2} style={{ margin: 0, fontWeight: 800, color: '#389e0d' }}>
                  {approvedRequests.length} yêu cầu
                </Title>
              </Space>
            </Space>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card
            bodyStyle={{ padding: 24 }}
            style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', background: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)' }}
          >
            <Space size="large">
              <WalletOutlined style={{ fontSize: 32, color: '#096dd9' }} />
              <Space direction="vertical" size={0}>
                <Text type="secondary" strong>Tổng số tiền đã chuyển</Text>
                <Title level={2} style={{ margin: 0, fontWeight: 800, color: '#096dd9' }}>
                  {totalApprovedAmount.toLocaleString('vi-VN')} đ
                </Title>
              </Space>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Main Table */}
      <Card
        title={
          <Space>
            <FileTextOutlined style={{ color: BRAND.primary }} />
            <span>Danh sách yêu cầu rút tiền toàn hệ thống</span>
          </Space>
        }
        style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}
      >
        <Table
          dataSource={requests}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Approve/Reject Confirmation Modal */}
      <Modal
        title={
          <Space>
            <InfoCircleOutlined style={{ color: actionType === 'APPROVE' ? '#52c41a' : '#ff4d4f' }} />
            <span style={{ fontSize: 18, fontWeight: 700 }}>
              {actionType === 'APPROVE' ? 'Xác nhận phê duyệt yêu cầu' : 'Xác nhận từ chối yêu cầu'}
            </span>
          </Space>
        }
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        destroyOnClose
        centered
      >
        {selectedRequest && (
          <div style={{ marginBottom: 20 }}>
            <p>
              Bạn đang chuẩn bị {actionType === 'APPROVE' ? 'phê duyệt' : 'từ chối'} yêu cầu rút tiền trị giá{' '}
              <Text strong style={{ color: actionType === 'APPROVE' ? '#16a34a' : '#ff4d4f' }}>
                {selectedRequest.amount.toLocaleString('vi-VN')} đ
              </Text>{' '}
              của chủ sân có ID <Text code>{selectedRequest.ownerId}</Text>.
            </p>
            <Card size="small" style={{ background: '#f8fafc', borderRadius: 8 }}>
              <Space direction="vertical" size={4} style={{ width: '100%' }}>
                <Text><strong>Ngân hàng:</strong> {selectedRequest.bankName}</Text>
                <Text><strong>Số tài khoản:</strong> {selectedRequest.bankAccount}</Text>
                <Text><strong>Chủ tài khoản:</strong> {selectedRequest.bankAccountName}</Text>
              </Space>
            </Card>
          </div>
        )}

        <Form form={form} layout="vertical" onFinish={handleConfirmAction}>
          <Form.Item
            name="adminNotes"
            label={actionType === 'APPROVE' ? 'Mã đối soát / Ghi chú chuyển tiền' : 'Lý do từ chối'}
            rules={[{ required: true, message: actionType === 'APPROVE' ? 'Vui lòng nhập mã giao dịch ngân hàng hoặc ghi chú duyệt' : 'Vui lòng nhập lý do từ chối yêu cầu' }]}
          >
            <Input.TextArea
              rows={3}
              placeholder={actionType === 'APPROVE' ? 'Nhập mã giao dịch chuyển tiền ngân hàng thành công' : 'Giải thích rõ lý do từ chối yêu cầu'}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={handleCloseModal}>Quay lại</Button>
              <Button
                type="primary"
                htmlType="submit"
                danger={actionType === 'REJECT'}
                style={{
                  background: actionType === 'APPROVE' ? '#52c41a' : undefined,
                  borderColor: actionType === 'APPROVE' ? '#52c41a' : undefined,
                }}
                loading={approveMutation.isPending || rejectMutation.isPending}
              >
                Xác nhận
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
