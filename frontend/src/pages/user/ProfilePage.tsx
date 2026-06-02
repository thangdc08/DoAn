import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Form, Input, Select, Button, Avatar, Upload, message, Row, Col, Typography, Divider, Space, Tabs, List, Empty, Tooltip, Modal } from 'antd';
import { UserOutlined, UploadOutlined, StarFilled, PlusOutlined, MinusCircleOutlined, MessageOutlined, CheckOutlined, CloseOutlined, UserDeleteOutlined } from '@ant-design/icons';
import { useAuthStore } from '../../stores/authStore';
import { authApi } from '../../services/authApi';
import { friendApi } from '../../services/friendApi';
import { chatApi } from '../../services/chatApi';
import { useChatStore } from '../../stores/chatStore';
import { LEVEL_OPTIONS } from '../../constants/levels';
import { DAY_MAP, REVERSE_DAY_MAP, DAYS_OF_WEEK } from '../../constants/days';
import { TIME_SLOTS, getTimeKeyByRange, getTimeRangeByKey, TIME_MAP } from '../../constants/times';
import { AREA_OPTIONS, AREA_MAP } from '../../constants/areas';
import { BRAND } from '../../theme/antdTheme';
import type { UploadFile } from 'antd';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function ProfilePage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const user = useAuthStore((state) => state.user);
  const updateUserStore = useAuthStore((state) => state.updateUser);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [friends, setFriends] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [loadingFriends, setLoadingFriends] = useState(false);

  const loadFriendsData = async () => {
    if (!user) return;
    setLoadingFriends(true);
    try {
      const [friendsList, pendingList] = await Promise.all([
        friendApi.getFriends(),
        friendApi.getPendingRequests()
      ]);
      setFriends(friendsList || []);
      setPendingRequests(pendingList || []);
    } catch (error) {
      console.error('Failed to load friends details', error);
    } finally {
      setLoadingFriends(false);
    }
  };

  const handleAcceptRequest = async (friendId: string) => {
    try {
      await friendApi.acceptRequest(friendId);
      message.success('Đã chấp nhận yêu cầu kết bạn');
      loadFriendsData();
    } catch (err: any) {
      message.error(err?.response?.data?.message || 'Chấp nhận kết bạn thất bại');
    }
  };

  const handleDeclineRequest = async (friendId: string) => {
    try {
      await friendApi.declineRequest(friendId);
      message.success('Đã từ chối yêu cầu kết bạn');
      loadFriendsData();
    } catch (err: any) {
      message.error(err?.response?.data?.message || 'Từ chối yêu cầu kết bạn thất bại');
    }
  };

  const handleRemoveFriend = async (friendId: string, fullName: string) => {
    Modal.confirm({
      title: 'Hủy kết bạn',
      content: `Bạn có chắc chắn muốn hủy kết bạn với ${fullName}?`,
      okText: 'Hủy kết bạn',
      okType: 'danger',
      cancelText: 'Hủy bỏ',
      onOk: async () => {
        try {
          await friendApi.removeFriend(friendId);
          message.success('Đã hủy kết bạn');
          loadFriendsData();
        } catch (err: any) {
          message.error(err?.response?.data?.message || 'Hủy kết bạn thất bại');
        }
      }
    });
  };

  useEffect(() => {
    if (user) {
      loadFriendsData();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        fullName: user.fullName,
        level: user.level,
        gender: user.gender,
        goal: user.goal,
        preferredAreas: user.preferredAreas || [],
        bio: user.bio,
        freeTime: user.availabilities?.map(a => ({
          day: DAY_MAP[a.dayOfWeek] || a.dayOfWeek,
          slots: (a.startTime && a.endTime) ? getTimeKeyByRange(a.startTime, a.endTime) : null
        })) || [],
      });
    }
  }, [user, form]);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      // Use preferredAreas directly as it's now a list of keys from Select
      const preferredAreas = values.preferredAreas || [];
      
      // Parse freeTime back to availabilities
      const availabilities = values.freeTime
        ?.filter((ft: any) => ft.day && ft.slots)
        ?.map((ft: any) => {
          const { start, end } = getTimeRangeByKey(ft.slots);
          return {
            dayOfWeek: REVERSE_DAY_MAP[ft.day] || ft.day,
            startTime: start,
            endTime: end
          };
        }) || [];

      let avatarUrl = user?.avatarUrl;
      if (fileList.length > 0 && fileList[0].originFileObj) {
        avatarUrl = await authApi.uploadAvatar(fileList[0].originFileObj as File);
      }

      const updateData = {
        fullName: values.fullName,
        gender: values.gender,
        level: values.level,
        goal: values.goal,
        bio: values.bio,
        avatarUrl,
        preferredAreas,
        availabilities
      };

      const updatedUser = await authApi.updateMe(updateData);
      updateUserStore(updatedUser);
      setPreviewUrl(null);
      message.success('Cập nhật hồ sơ thành công! 🏸');
    } catch (err: any) {
      message.error(err?.response?.data?.message || 'Cập nhật hồ sơ thất bại');
    } finally {
      setLoading(false);
    }
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
                src={previewUrl || user?.avatarUrl}
                icon={<UserOutlined />}
                style={{ marginBottom: 16 }}
              />
              <Title level={4}>{user?.fullName}</Title>
              <Text type="secondary">{user?.email}</Text>
              {user?.id && (
                <div style={{ marginTop: 8 }}>
                  <Text type="secondary" style={{ fontSize: '12px' }}>ID: </Text>
                  <Text code copyable={{ tooltips: ['Sao chép ID', 'Đã sao chép!'] }} style={{ fontSize: '13px' }}>
                    {user.id}
                  </Text>
                </div>
              )}

              <Divider />
              <div style={{ textAlign: 'left' }}>
                <div style={{ marginBottom: 12 }}>
                  <Text strong>Trình độ: </Text>
                  <Text>{LEVEL_OPTIONS.find(opt => opt.value === user?.level)?.label || user?.level || 'Chưa cập nhật'}</Text>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <Text strong>Đánh giá: </Text>
                  <StarFilled style={{ color: '#faad14', marginLeft: 8 }} />
                  <Text style={{ marginLeft: 4 }}>
                    {user?.rating?.toFixed(1) || '0.0'} ({user?.reviewCount || 0})
                  </Text>
                </div>
                {user?.preferredAreas && user.preferredAreas.length > 0 && (
                  <div style={{ marginBottom: 12 }}>
                    <Text strong>Khu vực ưu tiên: </Text>
                    <Text>
                      {user.preferredAreas.map(key => AREA_MAP[key] || key).join(', ')}
                    </Text>
                  </div>
                )}
                {user?.availabilities && user.availabilities.length > 0 && (
                  <div style={{ marginBottom: 12 }}>
                    <Text strong style={{ display: 'block', marginBottom: 4 }}>Lịch rảnh hàng tuần:</Text>
                    {user.availabilities.map((a, idx) => {
                      const dayLabel = DAY_MAP[a.dayOfWeek] || a.dayOfWeek;
                      const timeKey = getTimeKeyByRange(a.startTime, a.endTime);
                      const timeLabel = timeKey ? TIME_MAP[timeKey] : `${a.startTime.substring(0, 5)} - ${a.endTime.substring(0, 5)}`;
                      return (
                        <div key={idx} style={{ marginBottom: 2, paddingLeft: 8, borderLeft: `2px solid ${BRAND.primary}` }}>
                          <Text style={{ fontSize: '12px' }}>{dayLabel}: {timeLabel}</Text>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <Upload
                fileList={fileList}
                onChange={({ fileList }) => {
                  setFileList(fileList);
                  if (fileList.length > 0) {
                    const file = fileList[0].originFileObj;
                    if (file) {
                      const url = URL.createObjectURL(file as File);
                      setPreviewUrl(url);
                    }
                  } else {
                    setPreviewUrl(null);
                  }
                }}
                beforeUpload={() => false}
                maxCount={1}
                showUploadList={false}
              >
                <Button icon={<UploadOutlined />} style={{ marginTop: 16 }}>
                  Đổi ảnh đại diện
                </Button>
              </Upload>
            </div>
          </Card>
        </Col>

        {/* Edit Form */}
        {/* Edit Form & Friends Tabs */}
        <Col xs={24} lg={16}>
          <Card style={{ borderRadius: 20, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)', border: '1px solid #e2e8f0' }}>
            <Tabs
              defaultActiveKey="edit"
              items={[
                {
                  key: 'edit',
                  label: <span style={{ fontWeight: 600, fontSize: '15px' }}>Chỉnh sửa thông tin</span>,
                  children: (
                    <Form
                      form={form}
                      layout="vertical"
                      onFinish={handleSubmit}
                      style={{ marginTop: 16 }}
                    >
                      <Row gutter={16}>
                        <Col xs={24}>
                          <Form.Item
                            label="Họ và tên"
                            name="fullName"
                            rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                          >
                            <Input placeholder="Nhập họ và tên" style={{ borderRadius: 8 }} />
                          </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                          <Form.Item
                            label="Trình độ"
                            name="level"
                            rules={[{ required: true, message: 'Vui lòng chọn trình độ' }]}
                          >
                            <Select placeholder="Chọn trình độ" style={{ borderRadius: 8 }}>
                              {LEVEL_OPTIONS.map(opt => (
                                <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                          <Form.Item label="Giới tính" name="gender">
                            <Select placeholder="Chọn giới tính" style={{ borderRadius: 8 }}>
                              <Option value="MALE">Nam</Option>
                              <Option value="FEMALE">Nữ</Option>
                              <Option value="OTHER">Khác</Option>
                            </Select>
                          </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                          <Form.Item label="Mục tiêu" name="goal">
                            <Input placeholder="VD: Tăng cường sức khỏe, thi đấu..." style={{ borderRadius: 8 }} />
                          </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                          <Form.Item label="Khu vực ưu tiên" name="preferredAreas">
                            <Select
                              mode="multiple"
                              placeholder="Chọn các quận/huyện ưu tiên"
                              style={{ width: '100%', borderRadius: 8 }}
                              options={AREA_OPTIONS}
                              maxTagCount="responsive"
                            />
                          </Form.Item>
                        </Col>

                        <Col xs={24}>
                          <Form.Item label="Giới thiệu bản thân" name="bio">
                            <TextArea
                              rows={4}
                              placeholder="Viết vài dòng về bản thân, kinh nghiệm chơi cầu lông..."
                              maxLength={500}
                              showCount
                              style={{ borderRadius: 8 }}
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
                                      <Select placeholder="Chọn thứ" style={{ width: 120, borderRadius: 8 }}>
                                        {DAYS_OF_WEEK.map(d => (
                                          <Option key={d} value={d}>{d}</Option>
                                        ))}
                                      </Select>
                                    </Form.Item>
                                    <Form.Item
                                      {...restField}
                                      name={[name, 'slots']}
                                      rules={[{ required: true, message: 'Chọn khung giờ' }]}
                                    >
                                      <Select placeholder="Chọn khung giờ" style={{ width: 200, borderRadius: 8 }}>
                                        {TIME_SLOTS.map(slot => (
                                          <Option key={slot.value} value={slot.value}>{slot.label}</Option>
                                        ))}
                                      </Select>
                                    </Form.Item>
                                    <MinusCircleOutlined onClick={() => remove(name)} />
                                  </Space>
                                ))}
                                <Form.Item>
                                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />} style={{ borderRadius: 8 }}>
                                    Thêm khung giờ rảnh
                                  </Button>
                                </Form.Item>
                              </>
                            )}
                          </Form.List>
                        </Col>
                      </Row>

                      <Form.Item>
                        <Button type="primary" htmlType="submit" size="large" loading={loading} style={{ borderRadius: 8 }}>
                          Lưu thay đổi
                        </Button>
                      </Form.Item>
                    </Form>
                  )
                },
                {
                  key: 'friends',
                  label: <span style={{ fontWeight: 600, fontSize: '15px' }}>Bạn bè ({friends.length})</span>,
                  children: (
                    <List
                      loading={loadingFriends}
                      dataSource={friends}
                      locale={{ emptyText: <Empty description="Bạn chưa kết bạn với ai" /> }}
                      style={{ marginTop: 16 }}
                      renderItem={(f) => (
                        <List.Item
                          actions={[
                            <Tooltip title="Nhắn tin" key="chat">
                              <Button
                                type="text"
                                shape="circle"
                                icon={<MessageOutlined style={{ color: BRAND.primary, fontSize: 18 }} />}
                                onClick={async () => {
                                  try {
                                    const allConvs = await chatApi.getConversations();
                                    const existingPrivate = (allConvs || []).find((c: any) =>
                                      c.type === 'PRIVATE' && Array.isArray(c.participants) &&
                                      c.participants.some((part: any) => part?.id === f.id || part?.userId === f.id)
                                    );
                                    
                                    let conv = existingPrivate;
                                    if (!conv) {
                                      conv = await chatApi.createPrivateConversation(f.id);
                                    }
                                    const convId = conv?.id || conv?._id;
                                    if (convId) {
                                      useChatStore.getState().setActiveConversation(convId);
                                      navigate('/chat');
                                    }
                                  } catch (err) {
                                    message.error('Không thể bắt đầu chat với bạn bè');
                                  }
                                }}
                              />
                            </Tooltip>,
                            <Tooltip title="Hủy kết bạn" key="unfriend">
                              <Button
                                type="text"
                                danger
                                shape="circle"
                                icon={<UserDeleteOutlined style={{ fontSize: 18 }} />}
                                onClick={() => handleRemoveFriend(f.id, f.fullName)}
                              />
                            </Tooltip>
                          ]}
                        >
                          <List.Item.Meta
                            avatar={<Avatar src={f.avatarUrl} icon={<UserOutlined />} style={{ background: '#16a34a' }} />}
                            title={<span style={{ fontWeight: 600, color: '#1e293b' }}>{f.fullName}</span>}
                            description={
                              <Space size={8} style={{ marginTop: 4 }}>
                                {f.level && (
                                  <span style={{ fontSize: '11px', background: '#eff6ff', color: '#1d4ed8', padding: '2px 8px', borderRadius: 6, fontWeight: 600 }}>
                                    {LEVEL_OPTIONS.find(opt => opt.value === f.level)?.label || f.level}
                                  </span>
                                )}
                                {f.gender && (
                                  <span style={{ fontSize: '11px', background: '#fff7ed', color: '#c2410c', padding: '2px 8px', borderRadius: 6, fontWeight: 600 }}>
                                    {f.gender === 'MALE' ? 'Nam' : f.gender === 'FEMALE' ? 'Nữ' : 'Khác'}
                                  </span>
                                )}
                              </Space>
                            }
                          />
                        </List.Item>
                      )}
                    />
                  )
                },
                {
                  key: 'requests',
                  label: <span style={{ fontWeight: 600, fontSize: '15px' }}>Yêu cầu kết bạn ({pendingRequests.length})</span>,
                  children: (
                    <List
                      loading={loadingFriends}
                      dataSource={pendingRequests}
                      locale={{ emptyText: <Empty description="Không có yêu cầu kết bạn nào" /> }}
                      style={{ marginTop: 16 }}
                      renderItem={(r) => (
                        <List.Item
                          actions={[
                            <Button
                              type="primary"
                              size="small"
                              icon={<CheckOutlined />}
                              onClick={() => handleAcceptRequest(r.id)}
                              style={{ borderRadius: 8, fontWeight: 600 }}
                              key="accept"
                            >
                              Đồng ý
                            </Button>,
                            <Button
                              danger
                              size="small"
                              icon={<CloseOutlined />}
                              onClick={() => handleDeclineRequest(r.id)}
                              style={{ borderRadius: 8, fontWeight: 600 }}
                              key="decline"
                            >
                              Từ chối
                            </Button>
                          ]}
                        >
                          <List.Item.Meta
                            avatar={<Avatar src={r.avatarUrl} icon={<UserOutlined />} style={{ background: '#16a34a' }} />}
                            title={<span style={{ fontWeight: 600, color: '#1e293b' }}>{r.fullName}</span>}
                            description={
                              <Space size={8} style={{ marginTop: 4 }}>
                                {r.level && (
                                  <span style={{ fontSize: '11px', background: '#eff6ff', color: '#1d4ed8', padding: '2px 8px', borderRadius: 6, fontWeight: 600 }}>
                                    {LEVEL_OPTIONS.find(opt => opt.value === r.level)?.label || r.level}
                                  </span>
                                )}
                              </Space>
                            }
                          />
                        </List.Item>
                      )}
                    />
                  )
                }
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
