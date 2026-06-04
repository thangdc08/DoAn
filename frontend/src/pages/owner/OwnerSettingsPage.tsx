import { useState, useEffect } from 'react';
import { Card, Typography, Tabs, Form, Input, Switch, Button, Space, Divider, message, Select, InputNumber, Row, Col, Alert, List, Badge, TimePicker, Tag, Spin, Empty } from 'antd';
import { 
  SettingOutlined, 
  CreditCardOutlined, 
  BellOutlined, 
  ClockCircleOutlined, 
  SaveOutlined,
  BankOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
  PercentageOutlined,
  HourglassOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { BRAND } from '../../theme/antdTheme';
import { venueApi } from '../../services/venueApi';
import type { Venue } from '../../types/venue.types';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

export default function OwnerSettingsPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [bookingForm] = Form.useForm();
  const [bankForm] = Form.useForm();
  const [timeForms, setTimeForms] = useState<Record<string, { open: string; close: string; isOpen: boolean }>>({
    'Thứ 2': { open: '05:00', close: '22:00', isOpen: true },
    'Thứ 3': { open: '05:00', close: '22:00', isOpen: true },
    'Thứ 4': { open: '05:00', close: '22:00', isOpen: true },
    'Thứ 5': { open: '05:00', close: '22:00', isOpen: true },
    'Thứ 6': { open: '05:00', close: '22:00', isOpen: true },
    'Thứ 7': { open: '05:00', close: '22:00', isOpen: true },
    'Chủ Nhật': { open: '05:00', close: '22:00', isOpen: true },
  });
  const [notifications, setNotifications] = useState({
    newBooking: true,
    matchReminder: true,
    dailyReport: false
  });

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

    if (selectedVenue.policy) {
      try {
        const parsed = JSON.parse(selectedVenue.policy);
        if (parsed.bookingPolicy) bookingPolicy = { ...bookingPolicy, ...parsed.bookingPolicy };
        if (parsed.bankAccount) bankAccount = { ...bankAccount, ...parsed.bankAccount };
        if (parsed.notifications) notifs = { ...notifs, ...parsed.notifications };
      } catch (e) {
        console.warn('Policy is not JSON, treating as raw string:', selectedVenue.policy);
      }
    }

    bookingForm.setFieldsValue(bookingPolicy);
    bankForm.setFieldsValue(bankAccount);
    setNotifications(notifs);

    // 2. Parse openTime/closeTime for day-by-day (defaulting all days to these times)
    const openStr = selectedVenue.openTime ? selectedVenue.openTime.substring(0, 5) : '05:00';
    const closeStr = selectedVenue.closeTime ? selectedVenue.closeTime.substring(0, 5) : '22:00';
    
    const updatedTimeForms: Record<string, { open: string; close: string; isOpen: boolean }> = {};
    ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'].forEach((day) => {
      updatedTimeForms[day] = { open: openStr, close: closeStr, isOpen: true };
    });
    setTimeForms(updatedTimeForms);
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

  const handleSaveBusinessHours = async () => {
    if (!selectedVenue) return;
    try {
      setSaving(true);
      // Get times from the first day (Thứ 2) to update global openTime and closeTime
      const monTimes = timeForms['Thứ 2'];
      const openTimeStr = monTimes.open + ':00';
      const closeTimeStr = monTimes.close + ':00';

      const updated = await venueApi.updateVenue(selectedVenue.id, {
        openTime: openTimeStr,
        closeTime: closeTimeStr
      });

      setSelectedVenue(updated);
      setVenues(venues.map(v => v.id === updated.id ? updated : v));
      message.success('Đã cập nhật lịch hoạt động thành công!');
    } catch (error: any) {
      message.error('Không thể cập nhật lịch hoạt động: ' + error.message);
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
      message.success('Đã cập nhật tùy chọn thông báo!');
    } catch (error: any) {
      message.error('Không thể cập nhật tùy chọn thông báo: ' + error.message);
    }
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
       
       <Form layout="vertical" form={bookingForm}>
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
             <Col span={12}>
                <Form.Item label={<Space><HourglassOutlined /> <Text strong>Thời gian chuẩn bị giữa các ca (Phút)</Text></Space>} name="bufferTime">
                   <InputNumber min={0} max={30} step={5} style={{ width: '100%', borderRadius: 8 }} suffix="phút" />
                </Form.Item>
             </Col>
             <Col span={12}>
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
          <Button type="primary" size="large" icon={<SaveOutlined />} onClick={handleSaveBookingPolicy} loading={saving} style={{ background: BRAND.primary, borderRadius: 10, height: 48, padding: '0 32px' }}>Lưu thay đổi</Button>
       </Form>
    </div>
  );

  const BusinessHours = (
    <div style={{ maxWidth: 800 }}>
       <Title level={4}>Thời gian hoạt động mặc định</Title>
       <Paragraph type="secondary">Thiết lập khung giờ mở cửa cho toàn bộ các sân trong hệ thống.</Paragraph>
       
       <Row gutter={[16, 16]}>
          {['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'].map((day) => (
             <Col span={24} key={day}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', background: '#f8fafc', borderRadius: 12 }}>
                   <Text strong style={{ width: 100 }}>{day}</Text>
                   <Space split={<Text type="secondary">-</Text>}>
                      <TimePicker 
                        value={dayjs(timeForms[day]?.open || '05:00', 'HH:mm')} 
                        format="HH:mm" 
                        allowClear={false}
                        onChange={(time) => {
                          if (time) {
                            setTimeForms({
                              ...timeForms,
                              [day]: { ...timeForms[day], open: time.format('HH:mm') }
                            });
                          }
                        }}
                        style={{ borderRadius: 6 }} 
                      />
                      <TimePicker 
                        value={dayjs(timeForms[day]?.close || '22:00', 'HH:mm')} 
                        format="HH:mm" 
                        allowClear={false}
                        onChange={(time) => {
                          if (time) {
                            setTimeForms({
                              ...timeForms,
                              [day]: { ...timeForms[day], close: time.format('HH:mm') }
                            });
                          }
                        }}
                        style={{ borderRadius: 6 }} 
                      />
                   </Space>
                   <Switch 
                     checked={timeForms[day]?.isOpen} 
                     onChange={(checked) => {
                       setTimeForms({
                         ...timeForms,
                         [day]: { ...timeForms[day], isOpen: checked }
                       });
                     }}
                     checkedChildren="Mở" 
                     unCheckedChildren="Đóng" 
                   />
                </div>
             </Col>
          ))}
       </Row>
       <Button type="primary" loading={saving} onClick={handleSaveBusinessHours} style={{ marginTop: 24, background: BRAND.primary, borderRadius: 8 }}>Cập nhật lịch hoạt động</Button>
    </div>
  );

  const StaffManagement = (
    <div style={{ maxWidth: 800 }}>
       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
             <Title level={4} style={{ margin: 0 }}>Quản lý Nhân viên & Phân quyền</Title>
             <Text type="secondary">Cấp quyền cho nhân viên quản lý lịch đấu và check-in khách tại sân.</Text>
          </div>
          <Button type="primary" ghost icon={<PlusOutlined />} style={{ borderRadius: 8 }}>Thêm nhân viên</Button>
       </div>

       <List
         itemLayout="horizontal"
         dataSource={[
           { name: 'Nguyễn Văn A', email: 'vanya@gmail.com', role: 'Quản lý', status: 'Active' },
           { name: 'Trần Thị B', email: 'thib@gmail.com', role: 'Nhân viên Check-in', status: 'Active' },
           { name: 'Lê Văn C', email: 'vanc@gmail.com', role: 'Nhân viên Check-in', status: 'Inactive' },
         ]}
         renderItem={(item) => (
           <List.Item actions={[<Button type="link">Sửa</Button>, <Button type="link" danger>Gỡ quyền</Button>]}>
             <List.Item.Meta
               avatar={<Badge status={item.status === 'Active' ? 'success' : 'default'} offset={[-5, 35]}><div style={{ width: 40, height: 40, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><TeamOutlined /></div></Badge>}
               title={<Space><Text strong>{item.name}</Text> <Tag color={item.role === 'Quản lý' ? 'purple' : 'blue'}>{item.role}</Tag></Space>}
               description={item.email}
             />
           </List.Item>
         )}
       />
    </div>
  );

  return (
    <div style={{ padding: '24px' }}>
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
              key: '2',
              label: <Space><ClockCircleOutlined /> Lịch hoạt động</Space>,
              children: <div style={{ padding: '32px 40px' }}>{BusinessHours}</div>,
            },
            {
              key: '3',
              label: <Space><CreditCardOutlined /> Thanh toán & Payout</Space>,
              children: <div style={{ padding: '32px 40px' }}>
                <Title level={4}>Cấu hình Nhận thanh toán</Title>
                <Paragraph type="secondary">Thông tin tài khoản ngân hàng để hệ thống đối soát và chuyển doanh thu định kỳ.</Paragraph>
                <div style={{ padding: '24px', background: '#f8fafc', borderRadius: 16, border: '1px dashed #d9d9d9' }}>
                   <Form layout="vertical" form={bankForm}>
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
                <Button type="primary" loading={saving} onClick={handleSaveBankInfo} icon={<BankOutlined />} style={{ background: BRAND.primary, marginTop: 24, borderRadius: 8 }}>Cập nhật ngân hàng</Button>
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
                      <List.Item extra={<Switch checked={item.status} onChange={(checked) => handleToggleNotification(item.key as any, checked)} />}>
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
    </div>
  );
}
