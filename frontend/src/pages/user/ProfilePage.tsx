import { useState } from 'react';
import { Card, Form, Input, Select, Button, Avatar, Upload, message, Row, Col, Typography, Divider, Space } from 'antd';
import { UserOutlined, UploadOutlined, StarFilled, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { mockCurrentUser } from '../../data/mockUsers';
import type { UploadFile } from 'antd';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function ProfilePage() {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [currentUser, setCurrentUser] = useState(mockCurrentUser);

  const handleSubmit = (values: any) => {
    console.log('Mock update profile:', values);
    message.success('Cập nhật hồ sơ thành công (mock)');
    // Update mock user
    setCurrentUser({
      ...currentUser,
      profile: {
        ...currentUser.profile!,
        ...values,
      },
    });
  };

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Hồ sơ cá nhân</Title>

      <Row gutter={[24, 24]}>
        {/* Profile Info Card */}
        <Col xs={24} lg={8}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <Avatar
                size={120}
                src={currentUser?.avatarUrl}
                icon={<UserOutlined />}
                style={{ marginBottom: 16 }}
              />
              <Title level={4}>{currentUser?.fullName}</Title>
              <Text type="secondary">{currentUser?.email}</Text>

              {currentUser?.profile && (
                <>
                  <Divider />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ marginBottom: 12 }}>
                      <Text strong>Trình độ: </Text>
                      <Text>{currentUser.profile.level || 'Chưa cập nhật'}</Text>
                    </div>
                    <div style={{ marginBottom: 12 }}>
                      <Text strong>Đánh giá: </Text>
                      <StarFilled style={{ color: '#faad14', marginLeft: 8 }} />
                      <Text style={{ marginLeft: 4 }}>
                        {currentUser.profile.ratingAvg.toFixed(1)} ({currentUser.profile.ratingCount})
                      </Text>
                    </div>
                    {currentUser.profile.preferredArea && (
                      <div style={{ marginBottom: 12 }}>
                        <Text strong>Khu vực ưu tiên: </Text>
                        <Text>{currentUser.profile.preferredArea}</Text>
                      </div>
                    )}
                  </div>
                </>
              )}

              <Upload
                fileList={fileList}
                onChange={({ fileList }) => setFileList(fileList)}
                beforeUpload={() => false}
                maxCount={1}
              >
                <Button icon={<UploadOutlined />} style={{ marginTop: 16 }}>
                  Đổi ảnh đại diện
                </Button>
              </Upload>
            </div>
          </Card>
        </Col>

        {/* Edit Form */}
        <Col xs={24} lg={16}>
          <Card title="Chỉnh sửa thông tin">
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                level: currentUser?.profile?.level,
                gender: currentUser?.profile?.gender,
                goal: currentUser?.profile?.goal,
                preferredArea: currentUser?.profile?.preferredArea,
                bio: currentUser?.profile?.bio,
                freeTime: currentUser?.profile?.freeTime || [],
              }}
              onFinish={handleSubmit}
            >
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Trình độ"
                    name="level"
                    rules={[{ required: true, message: 'Vui lòng chọn trình độ' }]}
                  >
                    <Select placeholder="Chọn trình độ">
                      <Option value="BEGINNER">Mới bắt đầu</Option>
                      <Option value="INTERMEDIATE">Trung bình</Option>
                      <Option value="ADVANCED">Nâng cao</Option>
                      <Option value="PROFESSIONAL">Chuyên nghiệp</Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item label="Giới tính" name="gender">
                    <Select placeholder="Chọn giới tính">
                      <Option value="MALE">Nam</Option>
                      <Option value="FEMALE">Nữ</Option>
                      <Option value="OTHER">Khác</Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item label="Mục tiêu" name="goal">
                    <Input placeholder="VD: Tăng cường sức khỏe, thi đấu..." />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item label="Khu vực ưu tiên" name="preferredArea">
                    <Input placeholder="VD: Quận 1, Quận 3..." />
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Form.Item label="Giới thiệu bản thân" name="bio">
                    <TextArea
                      rows={4}
                      placeholder="Viết vài dòng về bản thân, kinh nghiệm chơi cầu lông..."
                      maxLength={500}
                      showCount
                    />
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Divider orientation={"left" as any} orientationMargin="0">Lịch rảnh hàng tuần</Divider>
                  <Form.List name="freeTime">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map(({ key, name, ...restField }) => (
                          <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                            <Form.Item
                              {...restField}
                              name={[name, 'day']}
                              rules={[{ required: true, message: 'Chọn thứ' }]}
                            >
                              <Select placeholder="Chọn thứ" style={{ width: 120 }}>
                                {['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'].map(d => (
                                  <Option key={d} value={d}>{d}</Option>
                                ))}
                              </Select>
                            </Form.Item>
                            <Form.Item
                              {...restField}
                              name={[name, 'slots']}
                              rules={[{ required: true, message: 'Nhập khung giờ' }]}
                            >
                              <Input placeholder="VD: 18:00 - 20:00" style={{ width: 200 }} />
                            </Form.Item>
                            <MinusCircleOutlined onClick={() => remove(name)} />
                          </Space>
                        ))}
                        <Form.Item>
                          <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                            Thêm khung giờ rảnh
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                </Col>
              </Row>

              <Form.Item>
                <Button type="primary" htmlType="submit" size="large">
                  Lưu thay đổi
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
