import { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, Row, Col, Typography, Space, Button, Table, Tag, Modal, Form, Input, InputNumber, message, Alert, Descriptions } from 'antd';
import { WalletOutlined, RollbackOutlined, FileTextOutlined, SendOutlined, BankOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { payoutApi } from '../../services/payoutApi';
import { venueApi } from '../../services/venueApi';
import { BRAND } from '../../theme/antdTheme';

const { Title, Text } = Typography;

export default function OwnerPayoutPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  // Fetch Owner Wallet Info
  const { data: wallet, isLoading: loadingWallet } = useQuery({
    queryKey: ['ownerWallet'],
    queryFn: payoutApi.getWallet,
  });

  // Fetch Payout History
  const { data: history, isLoading: loadingHistory } = useQuery({
    queryKey: ['payoutHistory'],
    queryFn: payoutApi.getOwnerHistory,
  });

  // Fetch Owner Venues (to extract configured bank accounts)
  const { data: venues } = useQuery({
    queryKey: ['ownerVenues'],
    queryFn: () => venueApi.getMyVenues(),
  });

  // Extract bank account from venue policies
  const defaultBankInfo = useMemo(() => {
    if (!venues || venues.length === 0) return null;
    for (const venue of venues) {
      if (venue.policy) {
        try {
          const parsed = JSON.parse(venue.policy);
          if (parsed.bankAccount && parsed.bankAccount.accountNumber) {
            // Map vcb/tcb code to readable names
            const bankCode = parsed.bankAccount.bankName || '';
            let bankName = bankCode.toUpperCase();
            if (bankCode === 'vcb') bankName = 'Vietcombank (VCB)';
            else if (bankCode === 'tcb') bankName = 'Techcombank (TCB)';
            else if (bankCode === 'bidv') bankName = 'BIDV';
            else if (bankCode === 'agribank') bankName = 'Agribank';
            else if (bankCode === 'acb') bankName = 'ACB';

            return {
              bankName,
              bankAccount: parsed.bankAccount.accountNumber,
              bankAccountName: parsed.bankAccount.accountHolder,
              venueName: venue.name
            };
          }
        } catch (e) {}
      }
    }
    return null;
  }, [venues]);

  // Create Payout Mutation
  const createPayoutMutation = useMutation({
    mutationFn: payoutApi.createPayoutRequest,
    onSuccess: () => {
      message.success('Gửi yêu cầu rút tiền thành công!');
      setIsModalOpen(false);
      form.resetFields();
      queryClient.invalidateQueries({ queryKey: ['ownerWallet'] });
      queryClient.invalidateQueries({ queryKey: ['payoutHistory'] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại');
    },
  });

  // Add test funds mutation
  const addTestFundsMutation = useMutation({
    mutationFn: (amount: number) => payoutApi.addTestFunds(amount),
    onSuccess: () => {
      message.success('Đã nạp số dư thử nghiệm thành công để test luồng rút tiền!');
      queryClient.invalidateQueries({ queryKey: ['ownerWallet'] });
    },
    onError: (error: any) => {
      message.error('Không thể nạp tiền test: ' + error.message);
    }
  });

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  // Pre-fill fields when modal opens
  useEffect(() => {
    if (isModalOpen && defaultBankInfo) {
      form.setFieldsValue({
        bankName: defaultBankInfo.bankName,
        bankAccount: defaultBankInfo.bankAccount,
        bankAccountName: defaultBankInfo.bankAccountName,
      });
    }
  }, [isModalOpen, defaultBankInfo, form]);

  const handleSubmit = (values: any) => {
    if (wallet && values.amount > wallet.balance) {
      message.error('Số tiền rút không được vượt quá số dư khả dụng');
      return;
    }
    createPayoutMutation.mutate({
      amount: values.amount,
      bankName: values.bankName,
      bankAccount: values.bankAccount,
      bankAccountName: values.bankAccountName,
      notes: values.notes,
    });
  };  // Calculate total pending withdrawal amount
  const pendingWithdrawal = useMemo(() => {
    if (!history) return 0;
    return history
      .filter((req) => req.status === 'PENDING')
      .reduce((sum, req) => sum + req.amount, 0);
  }, [history]);

  const columns = [
    {
      title: 'Mã yêu cầu',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => <Text copyable={{ text: id }}>{id.substring(0, 8)}...</Text>,
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
      render: (amount: number) => <Text strong style={{ color: '#ff4d4f' }}>{amount.toLocaleString('vi-VN')} đ</Text>,
    },
    {
      title: 'Thông tin tài khoản',
      key: 'bankInfo',
      render: (_: any, record: any) => (
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
          label = 'Đã duyệt';
        } else if (status === 'REJECTED') {
          color = 'red';
          label = 'Từ chối';
        }
        return <Tag color={color} style={{ borderRadius: 4, fontWeight: 600 }}>{label}</Tag>;
      },
    },
    {
      title: 'Phản hồi từ Admin',
      dataIndex: 'adminNotes',
      key: 'adminNotes',
      render: (notes: string) => notes ? <Text type="danger">{notes}</Text> : <Text type="secondary">-</Text>,
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>Doanh thu & Rút tiền</Title>
          <Text type="secondary">Quản lý thu nhập của các sân đấu, theo dõi số dư khả dụng và tạo yêu cầu chuyển tiền.</Text>
        </div>
        <Space wrap>
          {/* Test funds button for developers */}
          <Button
            type="dashed"
            icon={<PlusCircleOutlined />}
            loading={addTestFundsMutation.isPending}
            onClick={() => addTestFundsMutation.mutate(5000000)}
            style={{ borderRadius: 8, height: 45, color: BRAND.primary, borderColor: BRAND.primary }}
          >
            Nạp số dư test (5,000,000đ)
          </Button>

          <Button
            type="primary"
            icon={<WalletOutlined />}
            size="large"
            onClick={handleOpenModal}
            disabled={!wallet || wallet.balance <= 0}
            style={{ background: BRAND.primary, border: 'none', borderRadius: 8, height: 45 }}
          >
            Yêu cầu rút tiền
          </Button>
        </Space>
      </div>

      {/* Alert on bank configurations */}
      {!defaultBankInfo ? (
        <Alert
          message="Chưa cấu hình tài khoản nhận tiền mặc định"
          description={
            <span>
              Bạn chưa thiết lập tài khoản ngân hàng nhận tiền mặc định. Vui lòng truy cập{' '}
              <a href="/owner/settings" style={{ fontWeight: 600, color: BRAND.primary }}>Cấu hình vận hành &rarr; Thanh toán & Payout</a> để cấu hình tài khoản ngân hàng, hệ thống sẽ tự động điền thông tin khi tạo lệnh rút tiền.
            </span>
          }
          type="warning"
          showIcon
          style={{ marginBottom: 24, borderRadius: 12 }}
        />
      ) : (
        <Alert
          message="Đã liên kết tài khoản ngân hàng nhận tiền"
          description={`Tài khoản mặc định được định cấu hình từ cơ sở "${defaultBankInfo.venueName}": ${defaultBankInfo.bankName} - ${defaultBankInfo.bankAccount} (${defaultBankInfo.bankAccountName})`}
          type="success"
          showIcon
          style={{ marginBottom: 24, borderRadius: 12 }}
        />
      )}

      {/* Metrics Cards */}
      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} xl={6}>
          <Card
            bodyStyle={{ padding: 24 }}
            style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', height: '100%' }}
            loading={loadingWallet}
          >
            <Space direction="vertical" size={4}>
              <Text type="secondary" strong>Số dư khả dụng</Text>
              <Title level={2} style={{ margin: 0, fontWeight: 800, color: '#16a34a' }}>
                {wallet ? wallet.balance.toLocaleString('vi-VN') : 0} đ
              </Title>
              <Text type="secondary" style={{ fontSize: 12 }}>Tiền mặt khả dụng để gửi lệnh rút.</Text>
            </Space>
          </Card>
        </Col>

        <Col xs={24} sm={12} xl={6}>
          <Card
            bodyStyle={{ padding: 24 }}
            style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)', height: '100%' }}
            loading={loadingHistory}
          >
            <Space direction="vertical" size={4}>
              <Text type="secondary" strong>Đang yêu cầu rút</Text>
              <Title level={2} style={{ margin: 0, fontWeight: 800, color: '#d97706' }}>
                {pendingWithdrawal.toLocaleString('vi-VN')} đ
              </Title>
              <Text type="secondary" style={{ fontSize: 12 }}>Yêu cầu rút tiền đang chờ Admin phê duyệt.</Text>
            </Space>
          </Card>
        </Col>

        <Col xs={24} sm={12} xl={6}>
          <Card
            bodyStyle={{ padding: 24 }}
            style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', height: '100%' }}
            loading={loadingWallet}
          >
            <Space direction="vertical" size={4}>
              <Text type="secondary" strong>Tổng doanh thu tích lũy</Text>
              <Title level={2} style={{ margin: 0, fontWeight: 800, color: BRAND.primary }}>
                {wallet ? wallet.totalEarned.toLocaleString('vi-VN') : 0} đ
              </Title>
              <Text type="secondary" style={{ fontSize: 12 }}>Tổng doanh thu ròng sau khi trừ chiết khấu 5%.</Text>
            </Space>
          </Card>
        </Col>

        <Col xs={24} sm={12} xl={6}>
          <Card
            bodyStyle={{ padding: 24 }}
            style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', height: '100%' }}
            loading={loadingWallet}
          >
            <Space direction="vertical" size={4}>
              <Text type="secondary" strong>Tổng tiền đã rút</Text>
              <Title level={2} style={{ margin: 0, fontWeight: 800, color: '#475569' }}>
                {wallet ? wallet.totalWithdrawn.toLocaleString('vi-VN') : 0} đ
              </Title>
              <Text type="secondary" style={{ fontSize: 12 }}>Tổng số tiền đã rút về tài khoản ngân hàng thành công.</Text>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Alert about platform commission */}
      <Alert
        message="Thông tin về chiết khấu dịch vụ"
        description="Nền tảng tự động áp dụng mức chiết khấu 5% trên mỗi giao dịch đặt sân thành công. Số dư khả dụng của bạn hiển thị ở trên là doanh thu thực nhận (95% giá trị đặt sân) đã trừ chiết khấu."
        type="info"
        showIcon
        style={{ marginBottom: 24, borderRadius: 12 }}
      />

      {/* Detailed History Table */}
      <Card
        title={
          <Space>
            <FileTextOutlined style={{ color: BRAND.primary }} />
            <span>Lịch sử yêu cầu rút tiền</span>
          </Space>
        }
        style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}
      >
        <Table
          dataSource={history}
          columns={columns}
          rowKey="id"
          loading={loadingHistory}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Withdraw Modal */}
      <Modal
        title={
          <Space>
            <SendOutlined style={{ color: BRAND.primary }} />
            <span style={{ fontSize: 18, fontWeight: 700 }}>Tạo yêu cầu rút tiền</span>
          </Space>
        }
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        destroyOnClose
        centered
        bodyStyle={{ paddingTop: 12 }}
      >
        {wallet && (
          <Descriptions size="small" bordered column={1} style={{ marginBottom: 20 }}>
            <Descriptions.Item label="Số dư khả dụng">
              <Text strong style={{ color: '#16a34a' }}>{wallet.balance.toLocaleString('vi-VN')} đ</Text>
            </Descriptions.Item>
          </Descriptions>
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            amount: wallet ? wallet.balance : 0,
          }}
        >
          <Form.Item
            name="amount"
            label="Số tiền rút (đ)"
            rules={[
              { required: true, message: 'Vui lòng nhập số tiền cần rút' },
              {
                validator: (_, value) => {
                  if (!value || value <= 0) {
                    return Promise.reject(new Error('Số tiền rút phải lớn hơn 0'));
                  }
                  if (wallet && value > wallet.balance) {
                    return Promise.reject(new Error('Số tiền rút vượt quá số dư khả dụng'));
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <InputNumber<number>
              style={{ width: '100%' }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value!.replace(/\$\s?|(,*)/g, '') as any}
              min={1}
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="bankName"
            label="Tên ngân hàng"
            rules={[{ required: true, message: 'Vui lòng nhập tên ngân hàng (ví dụ: Vietcombank)' }]}
          >
            <Input size="large" placeholder="Ví dụ: Vietcombank, Techcombank..." />
          </Form.Item>

          <Form.Item
            name="bankAccount"
            label="Số tài khoản"
            rules={[{ required: true, message: 'Vui lòng nhập số tài khoản ngân hàng' }]}
          >
            <Input size="large" placeholder="Nhập số tài khoản nhận tiền" />
          </Form.Item>

          <Form.Item
            name="bankAccountName"
            label="Tên chủ tài khoản (Viết hoa không dấu)"
            rules={[{ required: true, message: 'Vui lòng nhập tên chủ tài khoản' }]}
          >
            <Input size="large" placeholder="Ví dụ: NGUYEN VAN A" />
          </Form.Item>

          <Form.Item
            name="notes"
            label="Ghi chú (nếu có)"
          >
            <Input.TextArea rows={3} placeholder="Nội dung ghi chú chuyển khoản hoặc thông tin bổ sung" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={handleCloseModal} icon={<RollbackOutlined />}>Huỷ bỏ</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={createPayoutMutation.isPending}
                style={{ background: BRAND.primary, border: 'none' }}
                icon={<SendOutlined />}
              >
                Gửi yêu cầu
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
