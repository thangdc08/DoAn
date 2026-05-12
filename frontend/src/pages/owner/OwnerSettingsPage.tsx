import { Card, Typography, Tabs, Form, Input, Switch, Button, Space, Divider, message, Select, InputNumber, Row, Col, Alert, List, Badge, TimePicker, Tag } from 'antd';
import { 
  SettingOutlined, 
  CreditCardOutlined, 
  BellOutlined, 
  ClockCircleOutlined, 
  SaveOutlined,
  BankOutlined,
  SafetyCertificateOutlined,
  NotificationOutlined,
  TeamOutlined,
  ToolOutlined,
  PercentageOutlined,
  HourglassOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { BRAND } from '../../theme/antdTheme';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

export default function OwnerSettingsPage() {
  const [form] = Form.useForm();

  const handleSave = () => {
    message.success('Đã cập nhật cấu hình vận hành thành công!');
  };

  const BookingPolicies = (
    <div style={{ maxWidth: 800 }}>
       <Title level={4}>Quy định & Chính sách vận hành</Title>
       <Paragraph type="secondary">Cấu hình cách hệ thống xử lý các lượt đặt sân tại cơ sở của bạn.</Paragraph>
       
       <Form layout="vertical" initialValues={{ autoApprove: true, cancelWindow: 24, minSlot: 1, bufferTime: 0, maxBooking: 4, deposit: 100 }}>
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

          <Form.Item label={<Text strong>Chính sách hoàn tiền khi khách hủy</Text>}>
             <Select defaultValue="standard" style={{ borderRadius: 8 }}>
                <Option value="standard">Tiêu chuẩn (Hoàn 100% nếu hủy trước 24h)</Option>
                <Option value="strict">Nghiêm ngặt (Hoàn 50% nếu hủy trước 48h)</Option>
                <Option value="flexible">Linh hoạt (Hoàn 100% nếu hủy trước 6h)</Option>
             </Select>
          </Form.Item>

          <Divider />
          <Button type="primary" size="large" icon={<SaveOutlined />} onClick={handleSave} style={{ background: BRAND.primary, borderRadius: 10, height: 48, padding: '0 32px' }}>Lưu thay đổi</Button>
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
                      <TimePicker defaultValue={dayjs('05:00', 'HH:mm')} format="HH:mm" style={{ borderRadius: 6 }} />
                      <TimePicker defaultValue={dayjs('23:00', 'HH:mm')} format="HH:mm" style={{ borderRadius: 6 }} />
                   </Space>
                   <Switch defaultChecked checkedChildren="Mở" unCheckedChildren="Đóng" />
                </div>
             </Col>
          ))}
       </Row>
       <Button type="primary" style={{ marginTop: 24, background: BRAND.primary, borderRadius: 8 }}>Cập nhật lịch hoạt động</Button>
    </div>
  );

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2} style={{ marginBottom: 24 }}>Cấu hình vận hành</Title>

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
                   <Form layout="vertical">
                      <Form.Item label="Ngân hàng thụ hưởng">
                         <Select placeholder="Chọn ngân hàng" style={{ borderRadius: 8 }}><Option value="vcb">Vietcombank</Option></Select>
                      </Form.Item>
                      <Form.Item label="Số tài khoản">
                         <Input placeholder="Nhập số tài khoản" style={{ borderRadius: 8 }} />
                      </Form.Item>
                      <Form.Item label="Tên chủ tài khoản">
                         <Input placeholder="NGUYEN VAN A" style={{ borderRadius: 8 }} />
                      </Form.Item>
                   </Form>
                </div>
                <Button type="primary" icon={<BankOutlined />} style={{ background: BRAND.primary, marginTop: 24, borderRadius: 8 }}>Cập nhật ngân hàng</Button>
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
                      { title: 'Booking mới', desc: 'Thông báo khi có khách đặt sân thành công.', status: true },
                      { title: 'Nhắc lịch đấu', desc: 'Gửi tin nhắn trước 30p trận đấu bắt đầu.', status: true },
                      { title: 'Báo cáo ngày', desc: 'Gửi tổng kết doanh thu vào 23:00 hàng ngày.', status: false },
                    ]}
                    renderItem={item => (
                      <List.Item extra={<Switch defaultChecked={item.status} />}>
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
