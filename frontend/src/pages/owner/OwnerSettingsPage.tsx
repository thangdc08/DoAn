import { useState, useEffect } from 'react';
import { Card, Typography, Tabs, Form, Input, Switch, Button, Space, Divider, message, Select, InputNumber, Alert, List, Badge, Tag, Spin, Empty, Modal, Row, Col } from 'antd';
import { 
  SettingOutlined, 
  CreditCardOutlined, 
  BellOutlined, 
  SaveOutlined,
  BankOutlined,
  TeamOutlined,
  PlusOutlined,
  PercentageOutlined,
  ClockCircleOutlined,
  HourglassOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';
import { BRAND } from '../../theme/antdTheme';
import { venueApi } from '../../services/venueApi';
import { authApi } from '../../services/authApi';
import type { Venue } from '../../types/venue.types';
import type { User } from '../../types/auth.types';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

export default function OwnerSettingsPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const isReadOnly = selectedVenue?.currentUserRole === 'Nhân viên Check-in';

  const [bookingForm] = Form.useForm();
  const [bankForm] = Form.useForm();
  const [notifications, setNotifications] = useState({
    newBooking: true,
    matchReminder: true,
    dailyReport: false
  });
  const [staffList, setStaffList] = useState<any[]>([]);
  const [staffModalVisible, setStaffModalVisible] = useState(false);
  const [editingStaff, setEditingStaff] = useState<any | null>(null);
  const [staffForm] = Form.useForm();
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const handleUserSearch = async (value: string) => {
    if (!value || value.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      setSearchLoading(true);
      const users = await authApi.searchUsers(value);
      setSearchResults(users);
    } catch (error) {
      console.error('Failed to search users:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSelectUser = (userId: string) => {
    const selectedUser = searchResults.find(u => u.id === userId);
    if (selectedUser) {
      staffForm.setFieldsValue({
        name: selectedUser.fullName,
        email: selectedUser.email
      });
    }
  };

  const loadVenues = async () => {
    try {
      setLoading(true);
      const myVenues = await venueApi.getMyVenues();
      setVenues(myVenues);
      if (myVenues.length > 0) {
        setSelectedVenue(myVenues[0]);
      }
    } catch (error: any) {
      message.error('Không thể tải danh sách cơ sở: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVenues();
  }, []);

  // When selectedVenue changes, populate forms
  useEffect(() => {
    if (!selectedVenue) return;

    // 1. Parse policy JSON
    let bookingPolicy = { autoApprove: true, bufferTime: 0, maxBooking: 4, deposit: 100, cancelWindow: 24, refundPolicy: 'standard' };
    let bankAccount = { bankName: '', accountNumber: '', accountHolder: '' };
    let notifs = { newBooking: true, matchReminder: true, dailyReport: false };
    let bHours: any = null;
    let sList: any[] = [
      { id: '1', name: 'Nguyễn Văn A', email: 'vanya@gmail.com', role: 'Nhân viên Check-in', status: 'Active' },
      { id: '2', name: 'Trần Thị B', email: 'thib@gmail.com', role: 'Nhân viên Check-in', status: 'Active' },
      { id: '3', name: 'Lê Văn C', email: 'vanc@gmail.com', role: 'Nhân viên Check-in', status: 'Inactive' },
    ];

    if (selectedVenue.policy) {
      try {
        const parsed = JSON.parse(selectedVenue.policy);
        if (parsed.bookingPolicy) bookingPolicy = { ...bookingPolicy, ...parsed.bookingPolicy };
        if (parsed.bankAccount) bankAccount = { ...bankAccount, ...parsed.bankAccount };
        if (parsed.notifications) notifs = { ...notifs, ...parsed.notifications };
        if (parsed.businessHours) bHours = parsed.businessHours;
        if (parsed.staff) sList = parsed.staff;
      } catch (e) {
        console.warn('Policy is not JSON, treating as raw string:', selectedVenue.policy);
      }
    }

    bookingForm.setFieldsValue(bookingPolicy);
    bankForm.setFieldsValue(bankAccount);
    setNotifications(notifs);
    setStaffList(sList);


  }, [selectedVenue]);

  const handleSaveBookingPolicy = async () => {
    if (!selectedVenue) return;
    try {
      setSaving(true);
      const values = await bookingForm.validateFields();
      
      // Fetch existing policy parts
      let existingPolicy: any = {};
      if (selectedVenue.policy) {
        try { existingPolicy = JSON.parse(selectedVenue.policy); } catch (e) {}
      }

      // Update only bookingPolicy
      const updatedPolicy = {
        ...existingPolicy,
        bookingPolicy: values
      };

      const updated = await venueApi.updateVenue(selectedVenue.id, {
        policy: JSON.stringify(updatedPolicy)
      });

      setSelectedVenue(updated);
      setVenues(venues.map(v => v.id === updated.id ? updated : v));
      message.success('Đã cập nhật chính sách đặt sân thành công!');
    } catch (error: any) {
      message.error('Không thể cập nhật chính sách đặt sân: ' + error.message);
    } finally {
      setSaving(false);
    }
  };



  const handleSaveBankInfo = async () => {
    if (!selectedVenue) return;
    try {
      setSaving(true);
      const values = await bankForm.validateFields();

      // Fetch existing policy parts
      let existingPolicy: any = {};
      if (selectedVenue.policy) {
        try { existingPolicy = JSON.parse(selectedVenue.policy); } catch (e) {}
      }

      // Update bankAccount
      const updatedPolicy = {
        ...existingPolicy,
        bankAccount: values
      };

      const updated = await venueApi.updateVenue(selectedVenue.id, {
        policy: JSON.stringify(updatedPolicy)
      });

      setSelectedVenue(updated);
      setVenues(venues.map(v => v.id === updated.id ? updated : v));
      message.success('Đã cập nhật tài khoản nhận thanh toán thành công!');
    } catch (error: any) {
      message.error('Không thể cập nhật tài khoản: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleNotification = async (key: 'newBooking' | 'matchReminder' | 'dailyReport', checked: boolean) => {
    if (!selectedVenue) return;
    try {
      const updatedNotifs = {
        ...notifications,
        [key]: checked
      };
      setNotifications(updatedNotifs);

      // Fetch existing policy parts
      let existingPolicy: any = {};
      if (selectedVenue.policy) {
        try { existingPolicy = JSON.parse(selectedVenue.policy); } catch (e) {}
      }

      // Update notifications
      const updatedPolicy = {
        ...existingPolicy,
        notifications: updatedNotifs
      };

      const updated = await venueApi.updateVenue(selectedVenue.id, {
        policy: JSON.stringify(updatedPolicy)
      });

      setSelectedVenue(updated);
      setVenues(venues.map(v => v.id === updated.id ? updated : v));
    } catch (error: any) {
      message.error('Không thể cập nhật cấu hình thông báo: ' + error.message);
    }
  };

  const handleSaveStaff = async () => {
    if (!selectedVenue) return;
    try {
      const values = await staffForm.validateFields();
      let updatedList = [...staffList];

      if (editingStaff) {
        // Edit existing staff
        updatedList = updatedList.map(s => s.id === editingStaff.id ? { ...s, ...values } : s);
      } else {
        // Add new staff
        const newStaff = {
          id: Date.now().toString(),
          ...values
        };
        updatedList.push(newStaff);
      }

      setSaving(true);
      let existingPolicy: any = {};
      if (selectedVenue.policy) {
        try { existingPolicy = JSON.parse(selectedVenue.policy); } catch (e) {}
      }

      const updatedPolicy = {
        ...existingPolicy,
        staff: updatedList
      };

      const updated = await venueApi.updateVenue(selectedVenue.id, {
        policy: JSON.stringify(updatedPolicy)
      });

      setSelectedVenue(updated);
      setVenues(venues.map(v => v.id === updated.id ? updated : v));
      setStaffList(updatedList);
      setStaffModalVisible(false);
      message.success(editingStaff ? 'Đã cập nhật thông tin nhân viên!' : 'Đã thêm nhân viên mới!');
    } catch (error: any) {
      message.error('Không thể lưu nhân viên: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteStaff = async (staffId: string) => {
    if (!selectedVenue) return;
    try {
      const updatedList = staffList.filter(s => s.id !== staffId);
      setSaving(true);
      
      let existingPolicy: any = {};
      if (selectedVenue.policy) {
        try { existingPolicy = JSON.parse(selectedVenue.policy); } catch (e) {}
      }

      const updatedPolicy = {
        ...existingPolicy,
        staff: updatedList
      };

      const updated = await venueApi.updateVenue(selectedVenue.id, {
        policy: JSON.stringify(updatedPolicy)
      });

      setSelectedVenue(updated);
      setVenues(venues.map(v => v.id === updated.id ? updated : v));
      setStaffList(updatedList);
      message.success('Đã gỡ quyền nhân viên!');
    } catch (error: any) {
      message.error('Không thể gỡ quyền nhân viên: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const openAddStaffModal = () => {
    setEditingStaff(null);
    setSearchResults([]);
    staffForm.resetFields();
    staffForm.setFieldsValue({ status: 'Active', role: 'Nhân viên Check-in' });
    setStaffModalVisible(true);
  };

  const openEditStaffModal = (staff: any) => {
    setEditingStaff(staff);
    setSearchResults([]);
    staffForm.setFieldsValue(staff);
    setStaffModalVisible(true);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Spin size="large" tip="Đang tải cấu hình..." />
      </div>
    );
  }

  if (venues.length === 0) {
    return (
      <div style={{ padding: '24px' }}>
        <Title level={2} style={{ marginBottom: 24 }}>Cấu hình vận hành</Title>
        <Card style={{ borderRadius: 16, textAlign: 'center', padding: '40px 0' }}>
          <Empty description="Bạn chưa đăng ký cơ sở nào. Vui lòng đăng ký cơ sở tại mục 'Quản lý sân' trước khi cấu hình vận hành." />
        </Card>
      </div>
    );
  }

  const BookingPolicies = (
    <div style={{ maxWidth: 800 }}>
       <Title level={4}>Quy định & Chính sách vận hành</Title>
       <Paragraph type="secondary">Cấu hình cách hệ thống xử lý các lượt đặt sân tại cơ sở của bạn.</Paragraph>
       
       <Form layout="vertical" form={bookingForm} disabled={isReadOnly}>
          <div style={{ padding: '20px', background: 'rgba(0,166,81,0.03)', border: '1px solid rgba(0,166,81,0.1)', borderRadius: 12, marginBottom: 24 }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                   <Text strong style={{ fontSize: 16 }}>Tự động duyệt Booking</Text>
                   <div style={{ fontSize: 13, color: '#64748b' }}>Hệ thống sẽ tự động xác nhận khi có khách đặt và thanh toán thành công.</div>
                </div>
                <Form.Item name="autoApprove" valuePropName="checked" noStyle>
                   <Switch checkedChildren="BẬT" unCheckedChildren="TẮT" />
                </Form.Item>
             </div>
          </div>

          <Row gutter={24}>
             <Col span={24}>
                <Form.Item label={<Space><SafetyCertificateOutlined /> <Text strong>Số giờ đặt tối đa / người / ngày</Text></Space>} name="maxBooking">
                   <InputNumber min={1} style={{ width: '100%', borderRadius: 8 }} suffix="giờ" />
                </Form.Item>
             </Col>
          </Row>

          <Row gutter={24}>
             <Col span={12}>
                <Form.Item label={<Space><PercentageOutlined /> <Text strong>Yêu cầu đặt cọc (%)</Text></Space>} name="deposit">
                   <Select style={{ borderRadius: 8 }}>
                      <Option value={100}>Trả trước 100% (Khuyên dùng)</Option>
                      <Option value={50}>Đặt cọc 50%</Option>
                      <Option value={0}>Không cần đặt cọc</Option>
                   </Select>
                </Form.Item>
             </Col>
             <Col span={12}>
                <Form.Item label={<Space><ClockCircleOutlined /> <Text strong>Thời gian hủy sân tối thiểu (Giờ)</Text></Space>} name="cancelWindow">
                   <InputNumber min={0} style={{ width: '100%', borderRadius: 8 }} suffix="giờ" />
                </Form.Item>
             </Col>
          </Row>

          <Form.Item label={<Text strong>Chính sách hoàn tiền khi khách hủy</Text>} name="refundPolicy">
             <Select style={{ borderRadius: 8 }}>
                <Option value="standard">Tiêu chuẩn (Hoàn 100% nếu hủy trước 24h)</Option>
                <Option value="strict">Nghiêm ngặt (Hoàn 50% nếu hủy trước 48h)</Option>
                <Option value="flexible">Linh hoạt (Hoàn 100% nếu hủy trước 6h)</Option>
             </Select>
          </Form.Item>

          <Divider />
          <Button type="primary" size="large" icon={<SaveOutlined />} onClick={handleSaveBookingPolicy} loading={saving} disabled={isReadOnly} style={{ background: isReadOnly ? undefined : BRAND.primary, borderRadius: 10, height: 48, padding: '0 32px' }}>Lưu thay đổi</Button>
       </Form>
    </div>
  );



  const StaffManagement = (
    <div style={{ maxWidth: 800 }}>
       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
             <Title level={4} style={{ margin: 0 }}>Quản lý Nhân viên & Phân quyền</Title>
             <Text type="secondary">Cấp quyền cho nhân viên quản lý lịch đấu và check-in khách tại sân.</Text>
          </div>
          <Button type="primary" ghost icon={<PlusOutlined />} onClick={openAddStaffModal} disabled={isReadOnly} style={{ borderRadius: 8 }}>Thêm nhân viên</Button>
       </div>

       <List
         itemLayout="horizontal"
         dataSource={staffList}
         renderItem={(item) => (
           <List.Item actions={isReadOnly ? [] : [
             <Button type="link" onClick={() => openEditStaffModal(item)}>Sửa</Button>, 
             <Button type="link" danger onClick={() => handleDeleteStaff(item.id)}>Gỡ quyền</Button>
           ]}>
             <List.Item.Meta
               avatar={<Badge status={item.status === 'Active' ? 'success' : 'default'} offset={[-5, 35]}><div style={{ width: 40, height: 40, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><TeamOutlined /></div></Badge>}
               title={<Space><Text strong>{item.name}</Text> <Tag color="blue">{item.role}</Tag></Space>}
               description={item.email}
             />
           </List.Item>
         )}
       />
    </div>
  );

  return (
    <div style={{ padding: '24px' }}>
      {isReadOnly && (
        <Alert
          message="Quyền truy cập hạn chế"
          description="Bạn đang truy cập với vai trò Nhân viên Check-in. Bạn chỉ có thể xem các cấu hình này mà không thể chỉnh sửa hoặc lưu thay đổi."
          type="warning"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>Cấu hình vận hành</Title>
        {venues.length >= 1 && (
          <Space>
            <Text strong>Chọn cơ sở:</Text>
            <Select
              value={selectedVenue?.id}
              onChange={(id) => setSelectedVenue(venues.find(v => v.id === id) || null)}
              style={{ width: 250 }}
            >
              {venues.map(v => (
                <Option key={v.id} value={v.id}>{v.name}</Option>
              ))}
            </Select>
          </Space>
        )}
      </div>

      <Card bodyStyle={{ padding: 0 }} style={{ borderRadius: 16, overflow: 'hidden', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
        <Tabs
          tabPosition="left"
          items={[
            {
              key: '1',
              label: <Space><SettingOutlined /> Chính sách đặt sân</Space>,
              children: <div style={{ padding: '32px 40px' }}>{BookingPolicies}</div>,
            },
            {
              key: '3',
              label: <Space><CreditCardOutlined /> Thanh toán & Payout</Space>,
              children: <div style={{ padding: '32px 40px' }}>
                <Title level={4}>Cấu hình Nhận thanh toán</Title>
                <Paragraph type="secondary">Thông tin tài khoản ngân hàng để hệ thống đối soát và chuyển doanh thu định kỳ.</Paragraph>
                <div style={{ padding: '24px', background: '#f8fafc', borderRadius: 16, border: '1px dashed #d9d9d9' }}>
                   <Form layout="vertical" form={bankForm} disabled={isReadOnly}>
                      <Form.Item label="Ngân hàng thụ hưởng" name="bankName" rules={[{ required: true, message: 'Vui lòng chọn ngân hàng' }]}>
                         <Select placeholder="Chọn ngân hàng" style={{ borderRadius: 8 }}>
                           <Option value="vcb">Vietcombank (VCB)</Option>
                           <Option value="tcb">Techcombank (TCB)</Option>
                           <Option value="bidv">BIDV</Option>
                           <Option value="agribank">Agribank</Option>
                           <Option value="acb">ACB</Option>
                         </Select>
                      </Form.Item>
                      <Form.Item label="Số tài khoản" name="accountNumber" rules={[{ required: true, message: 'Vui lòng nhập số tài khoản' }]}>
                         <Input placeholder="Nhập số tài khoản" style={{ borderRadius: 8 }} />
                      </Form.Item>
                      <Form.Item label="Tên chủ tài khoản" name="accountHolder" rules={[{ required: true, message: 'Vui lòng nhập tên chủ tài khoản' }]}>
                         <Input placeholder="NGUYEN VAN A" style={{ borderRadius: 8 }} />
                      </Form.Item>
                   </Form>
                </div>
                <Button type="primary" loading={saving} disabled={isReadOnly} onClick={handleSaveBankInfo} icon={<BankOutlined />} style={{ background: isReadOnly ? undefined : BRAND.primary, marginTop: 24, borderRadius: 8 }}>Cập nhật ngân hàng</Button>
              </div>,
            },
            {
              key: '4',
              label: <Space><TeamOutlined /> Nhân sự</Space>,
              children: <div style={{ padding: '32px 40px' }}>{StaffManagement}</div>,
            },
            {
              key: '5',
              label: <Space><BellOutlined /> Thông báo</Space>,
              children: <div style={{ padding: '32px 40px' }}>
                 <Title level={4}>Tùy chọn Thông báo</Title>
                 <List
                    itemLayout="horizontal"
                    dataSource={[
                      { key: 'newBooking', title: 'Booking mới', desc: 'Thông báo khi có khách đặt sân thành công.', status: notifications.newBooking },
                      { key: 'matchReminder', title: 'Nhắc lịch đấu', desc: 'Gửi tin nhắn trước 30p trận đấu bắt đầu.', status: notifications.matchReminder },
                      { key: 'dailyReport', title: 'Báo cáo ngày', desc: 'Gửi tổng kết doanh thu vào 23:00 hàng ngày.', status: notifications.dailyReport },
                    ]}
                    renderItem={item => (
                      <List.Item extra={<Switch checked={item.status} disabled={isReadOnly} onChange={(checked) => handleToggleNotification(item.key as any, checked)} />}>
                         <List.Item.Meta title={item.title} description={item.desc} />
                      </List.Item>
                    )}
                 />
              </div>,
            },
          ]}
          style={{ minHeight: 700 }}
        />
      </Card>

      <Modal
        title={editingStaff ? "Sửa thông tin nhân viên" : "Thêm nhân viên mới"}
        open={staffModalVisible}
        onOk={handleSaveStaff}
        onCancel={() => setStaffModalVisible(false)}
        confirmLoading={saving}
        okText="Lưu"
        cancelText="Hủy"
        destroyOnClose
      >
        <Form form={staffForm} layout="vertical" style={{ marginTop: 16 }}>
          {!editingStaff && (
            <Form.Item label="Tìm tài khoản hệ thống (Email hoặc Tên)" tooltip="Nhập ít nhất 2 ký tự email hoặc tên để tìm tài khoản có sẵn trong hệ thống">
              <Select
                showSearch
                placeholder="Nhập tên hoặc email..."
                filterOption={false}
                onSearch={handleUserSearch}
                onChange={handleSelectUser}
                notFoundContent={searchLoading ? <Spin size="small" /> : 'Không tìm thấy người dùng'}
                loading={searchLoading}
                style={{ borderRadius: 8 }}
              >
                {(searchResults || []).map(user => (
                  <Option key={user.id} value={user.id}>
                    {user.fullName} ({user.email})
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}
          <Form.Item label="Họ và tên" name="name" rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}>
            <Input placeholder="Nguyễn Văn A" style={{ borderRadius: 8 }} />
          </Form.Item>
          <Form.Item label="Email đăng nhập" name="email" rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ' }]}>
            <Input placeholder="name@domain.com" style={{ borderRadius: 8 }} />
          </Form.Item>
          <Form.Item label="Vai trò" name="role" initialValue="Nhân viên Check-in" hidden>
            <Input />
          </Form.Item>
          <Form.Item label="Trạng thái" name="status" rules={[{ required: true }]}>
            <Select style={{ borderRadius: 8 }}>
              <Option value="Active">Hoạt động (Active)</Option>
              <Option value="Inactive">Tạm khóa (Inactive)</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>


    </div>
  );
}
