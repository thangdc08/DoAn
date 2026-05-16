import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Button, Table, Tag, Space, Modal, Form, Input, Select, message, Typography, Popconfirm, Row, Col, InputNumber, Divider, Tooltip, Alert, Switch, Tabs, DatePicker, TimePicker, Checkbox } from 'antd';
import dayjs from 'dayjs';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  EnvironmentOutlined,
  ToolOutlined,
  HolderOutlined
} from '@ant-design/icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { venueApi } from '../../services/venueApi';
import type { Court } from '../../types/venue.types';
import { BRAND } from '../../theme/antdTheme';
import TextArea from 'antd/es/input/TextArea';
import BookingGrid from '../../components/ui/BookingGrid';

const { Title, Text } = Typography;
const { Option } = Select;

interface SortableCourtCardProps {
  court: Court;
  isEditLayout: boolean;
}

function SortableCourtCard({ court, isEditLayout }: SortableCourtCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: court.id, disabled: !isEditLayout });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1000 : 1,
    opacity: isDragging ? 0.3 : 1,
    touchAction: 'none',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <Card
        style={{
          borderRadius: 12,
          textAlign: 'center',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
          cursor: isEditLayout ? 'grab' : 'default',
          border: isEditLayout ? `1px dashed ${BRAND.primary}` : '1px solid #f1f5f9',
          userSelect: 'none',
          WebkitUserSelect: 'none',
        }}
        bodyStyle={{ padding: '24px 16px' }}
      >
        {isEditLayout && (
          <div style={{ position: 'absolute', top: 8, right: 8, color: '#94a3b8' }}>
            <HolderOutlined />
          </div>
        )}
        <div style={{ fontSize: 24, marginBottom: 8 }}>🏸</div>
        <Text strong style={{ fontSize: 16, display: 'block' }}>{court.name}</Text>
      </Card>
    </div>
  );
}

export default function CourtManagementPage() {
  const { venueId } = useParams<{ venueId: string }>();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [slotForm] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isPriceRuleModalOpen, setIsPriceRuleModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [editingCourt, setEditingCourt] = useState<Court | null>(null);
  const [isEditLayout, setIsEditLayout] = useState(false);
  const [sortedCourts, setSortedCourts] = useState<Court[]>([]);
  const [selectedCourtForPricing, setSelectedCourtForPricing] = useState<Court | null>(null);
  const [priceRuleForm] = Form.useForm();

  const handleSaveAvailability = async () => {
    try {
      const values = await slotForm.validateFields();
      if (!selectedCourtForPricing || !venueId) return;

      const [startDate, endDate] = values.dateRange;

      await venueApi.updateCourtAvailability(venueId, selectedCourtForPricing.id, {
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD'),
        availableSlots: values.slots, // Giờ đã là mảng string ["05:00", "05:30", ...]
      });

      message.success('Cập nhật lịch sân thành công!');
      setIsPricingModalOpen(false);
    } catch (error) {
      console.error('Failed to save availability:', error);
    }
  };

  const handleSavePriceRule = async () => {
    try {
      const values = await priceRuleForm.validateFields();
      if (!venueId) return;

      // Xử lý lưu từng ngày (nếu chọn nhiều ngày)
      const dayRequests = values.days.map((day: number) => {
        return venueApi.createPriceRule(venueId, {
          venueId,
          dayOfWeek: day,
          startTime: values.timeRange[0].format('HH:mm'),
          endTime: values.timeRange[1].format('HH:mm'),
          pricePerHour: values.pricePerHour,
          status: 'ACTIVE'
        });
      });

      await Promise.all(dayRequests);

      message.success('Đã thêm khung giờ giá mới thành công!');
      setIsPriceRuleModalOpen(false);
      priceRuleForm.resetFields();
      refetchPriceRules();
    } catch (error) {
      console.error('Failed to save price rule:', error);
      message.error('Không thể lưu khung giờ giá');
    }
  };
  const handleDeletePriceRule = async (ruleId: string) => {
    try {
      await venueApi.deletePriceRule(venueId!, ruleId);
      message.success('Đã xóa quy tắc giá');
      refetchPriceRules();
    } catch (error) {
      message.error('Không thể xóa quy tắc giá');
    }
  };

  const [activeId, setActiveId] = useState<string | null>(null);

  const { data: priceRules = [], refetch: refetchPriceRules } = useQuery({
    queryKey: ['price-rules', venueId],
    queryFn: () => venueApi.getPriceRules(venueId!),
    enabled: !!venueId,
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const { data: venue } = useQuery({
    queryKey: ['venue', venueId],
    queryFn: () => venueApi.getVenueById(venueId!),
    enabled: !!venueId,
  });

  const { data: courts = [], isLoading: isLoadingCourts } = useQuery({
    queryKey: ['venue-courts', venueId],
    queryFn: () => venueApi.getVenueCourts(venueId!),
    enabled: !!venueId,
  });

  // Tự động load cấu hình khung giờ khi mở Modal hoặc chọn ngày
  useEffect(() => {
    const fetchAvailability = async () => {
      if (isPricingModalOpen && selectedCourtForPricing && venueId) {
        try {
          const today = dayjs().format('YYYY-MM-DD');
          const availability = await venueApi.getCourtAvailability(venueId, selectedCourtForPricing.id, today);

          // Lọc ra những khung giờ đang là AVAILABLE để tích sẵn
          const availableHours = availability
            .filter(slot => slot.status === 'AVAILABLE')
            .map(slot => {
              const [h, m] = slot.startTime.split(':');
              return `${h.padStart(2, '0')}:${m.padStart(2, '0')}`;
            });

          slotForm.setFieldsValue({
            slots: availableHours,
            dateRange: [dayjs(), dayjs().add(7, 'day')] // Mặc định chọn khoảng 1 tuần
          });
        } catch (error) {
          console.error('Failed to fetch initial availability:', error);
        }
      }
    };

    fetchAvailability();
  }, [isPricingModalOpen, selectedCourtForPricing, venueId, slotForm]);

  useEffect(() => {
    if (courts.length > 0) {
      setSortedCourts(courts);
    }
  }, [courts]);

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSortedCourts((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
    setActiveId(null);
  };

  const activeCourt = activeId ? sortedCourts.find(c => c.id === activeId) : null;

  const handleCreate = () => {
    setEditingCourt(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (court: Court) => {
    setEditingCourt(court);
    form.setFieldsValue(court);
    setIsModalOpen(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingCourt) {
        await venueApi.updateCourt(venueId!, editingCourt.id, values);
        message.success('Cập nhật sân thành công!');
      } else {
        await venueApi.createCourt(venueId!, values);
        message.success('Đã tạo sân mới thành công!');
      }
      setIsModalOpen(false);
      setEditingCourt(null);
      form.resetFields();
      queryClient.invalidateQueries({ queryKey: ['venue-courts', venueId] });
    } catch (error) {
      message.error(editingCourt ? 'Không thể cập nhật sân' : 'Không thể tạo sân mới');
    }
  };

  const handleDelete = async (courtId: string) => {
    try {
      await venueApi.deleteCourt(venueId!, courtId);
      message.success('Đã xóa sân thành công');
      queryClient.invalidateQueries({ queryKey: ['venue-courts', venueId] });
    } catch (error) {
      message.error('Không thể xóa sân');
    }
  };

  const columns = [
    {
      title: 'Tên sân lẻ',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => <Text strong style={{ fontSize: 15 }}>{name}</Text>
    },
    {
      title: 'Giá mặc định',
      key: 'price',
      render: (_: any, record: Court) => (
        <Space direction="vertical" size={0}>
          <Text strong style={{ color: BRAND.primary }}>80.000đ/h</Text>
          <Text type="secondary" style={{ fontSize: 11 }}>Khung giờ thường</Text>
        </Space>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'ACTIVE' ? 'success' : 'warning'} icon={status === 'ACTIVE' ? <CheckCircleOutlined /> : <ThunderboltOutlined />}>
          {status === 'ACTIVE' ? 'Hoạt động' : 'Bảo trì'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'right' as const,
      render: (_: any, record: Court) => (
        <Space>
          <Tooltip title="Cấu hình giá & slot">
            <Button
              icon={<DollarOutlined />}
              onClick={() => { setSelectedCourtForPricing(record); setIsPricingModalOpen(true); }}
              style={{ color: BRAND.primary, borderColor: BRAND.primary }}
            />
          </Tooltip>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm title="Xác nhận xóa sân?" onConfirm={() => handleDelete(record.id)}>
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Space align="baseline">
            <Title level={2} style={{ margin: 0 }}>Quản lý Sân lẻ</Title>
            <Tag color="cyan" style={{ borderRadius: 10 }}>{venue?.name}</Tag>
          </Space>
          <Text type="secondary" style={{ display: 'block', marginTop: 4 }}>
            Cấu hình từng sân thi đấu, thiết lập giá theo khung giờ và quản lý tình trạng sân.
          </Text>
        </div>
        <Space>
          <Button icon={<PlusOutlined />} onClick={() => setIsBulkModalOpen(true)}>
            Tạo nhanh nhiều sân
          </Button>
          <Button type="primary" icon={<PlusOutlined />} size="large" onClick={handleCreate} style={{ background: BRAND.primary, borderRadius: 10 }}>
            Thêm sân con lẻ
          </Button>
        </Space>
      </div>

      <Row gutter={[20, 20]}>
        <Col span={24}>
          <Card bodyStyle={{ padding: '0 0 24px 0' }} style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
            <Tabs
              defaultActiveKey="1"
              items={[
                {
                  key: '1',
                  label: <Space style={{ padding: '0 24px' }}><PlusOutlined /> Danh sách sân</Space>,
                  children: (
                    <Table
                      columns={columns}
                      dataSource={courts}
                      rowKey="id"
                      pagination={false}
                      loading={isLoadingCourts}
                    />
                  )
                },
                {
                  key: '2',
                  label: <Space style={{ padding: '0 24px' }}><ClockCircleOutlined /> Lịch & Lock sân (Trực quan)</Space>,
                  children: (
                    <div style={{ padding: '0 24px' }}>
                      <Alert
                        message="Chế độ Quản trị: Click vào slot để Khóa/Mở khóa sân nhanh."
                        type="warning"
                        showIcon
                        style={{ marginBottom: 20, borderRadius: 10 }}
                      />
                      <BookingGrid
                        isAdmin={true}
                        courtNames={courts.map(c => c.name)}
                      />
                    </div>
                  )
                },
                {
                  key: '3',
                  label: <Space style={{ padding: '0 24px' }}><EnvironmentOutlined /> Sơ đồ mặt bằng (2D Layout)</Space>,
                  children: (
                    <div style={{ padding: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                        <div>
                          <Title level={4} style={{ margin: 0 }}>Sơ đồ vị trí sân</Title>
                          <Text type="secondary">Sắp xếp vị trí các sân theo thực tế mặt bằng của cơ sở (Kéo thả để thay đổi thứ tự).</Text>
                        </div>
                        <Button
                          type={isEditLayout ? "primary" : "dashed"}
                          icon={<ToolOutlined />}
                          onClick={async () => {
                            if (isEditLayout) {
                              try {
                                const courtIds = sortedCourts.map(c => c.id);
                                await venueApi.reorderCourts(venueId!, courtIds);
                                message.success("Đã lưu sơ đồ vị trí mới!");
                                queryClient.invalidateQueries({ queryKey: ['venue-courts', venueId] });
                              } catch (error) {
                                message.error("Không thể lưu sơ đồ vị trí");
                              }
                            }
                            setIsEditLayout(!isEditLayout);
                          }}
                        >
                          {isEditLayout ? "Lưu sơ đồ" : "Chế độ chỉnh sửa sơ đồ"}
                        </Button>
                      </div>

                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                      >
                        <SortableContext
                          items={sortedCourts.map(c => c.id)}
                          strategy={rectSortingStrategy}
                        >
                          <div style={{
                            background: '#f1f5f9',
                            borderRadius: 20,
                            padding: 40,
                            minHeight: 400,
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                            gap: 24,
                            border: isEditLayout ? '2px dashed ' + BRAND.primary : '2px solid transparent',
                            transition: 'all 0.3s'
                          }}>
                            {sortedCourts.map((court) => (
                              <SortableCourtCard
                                key={court.id}
                                court={court}
                                isEditLayout={isEditLayout}
                              />
                            ))}
                          </div>
                        </SortableContext>
                        <DragOverlay dropAnimation={{
                          sideEffects: defaultDropAnimationSideEffects({
                            styles: {
                              active: {
                                opacity: '0.5',
                              },
                            },
                          }),
                        }}>
                          {activeCourt ? (
                            <Card
                              style={{
                                borderRadius: 12,
                                textAlign: 'center',
                                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                                cursor: 'grabbing',
                                border: `2px solid ${BRAND.primary}`,
                                width: 200,
                                zIndex: 2000
                              }}
                              bodyStyle={{ padding: '24px 16px' }}
                            >
                              <div style={{ fontSize: 24, marginBottom: 8 }}>🏸</div>
                              <Text strong style={{ fontSize: 16, display: 'block' }}>{activeCourt.name}</Text>
                              <Tag color={activeCourt.courtType === 'VIP' ? 'purple' : 'blue'} style={{ marginTop: 8 }}>{activeCourt.courtType}</Tag>
                            </Card>
                          ) : null}
                        </DragOverlay>
                      </DndContext>
                    </div>
                  )
                }
              ]}
            />
          </Card>
        </Col>

        <Col span={24}>
          <Card
            title={<Space><DollarOutlined style={{ color: BRAND.primary }} /> Quy tắc giá chung cho cụm sân</Space>}
            extra={<Button type="link" icon={<PlusOutlined />} onClick={() => setIsPriceRuleModalOpen(true)}>Thêm khung giờ giá</Button>}
            style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}
          >
            <Row gutter={24}>
              {priceRules.length === 0 ? (
                <Col span={24}>
                  <div style={{ padding: '40px', textAlign: 'center', background: '#f8fafc', borderRadius: 12 }}>
                    <Text type="secondary">Chưa có quy tắc giá nào được cấu hình. Hệ thống sẽ sử dụng giá mặc định 100.000đ/h.</Text>
                  </div>
                </Col>
              ) : (
                priceRules.map((rule) => {
                  const dayNames = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
                  return (
                    <Col xs={24} md={8} key={rule.id} style={{ marginBottom: 16 }}>
                      <div style={{ 
                        padding: '16px', 
                        background: rule.dayOfWeek && rule.dayOfWeek >= 6 ? 'rgba(114,46,209,0.05)' : 'rgba(0,166,81,0.05)', 
                        borderRadius: 12,
                        position: 'relative',
                        border: '1px solid #f1f5f9'
                      }}>
                        <div style={{ position: 'absolute', top: 12, right: 12 }}>
                          <Popconfirm title="Xóa quy tắc giá này?" onConfirm={() => handleDeletePriceRule(rule.id)}>
                            <Button size="small" type="text" danger icon={<DeleteOutlined />} />
                          </Popconfirm>
                        </div>
                        <Text strong style={{ 
                          color: rule.dayOfWeek && rule.dayOfWeek >= 6 ? '#722ed1' : BRAND.primary, 
                          display: 'block' 
                        }}>
                          {rule.startTime.substring(0, 5)} - {rule.endTime.substring(0, 5)}
                        </Text>
                        <Title level={3} style={{ 
                          margin: '8px 0', 
                          color: rule.dayOfWeek && rule.dayOfWeek >= 6 ? '#722ed1' : BRAND.primary 
                        }}>
                          {rule.pricePerHour.toLocaleString()}đ<Text style={{ fontSize: 14, color: '#94a3b8' }}> / giờ</Text>
                        </Title>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          Áp dụng: {dayNames[rule.dayOfWeek % 7]}
                        </Text>
                      </div>
                    </Col>
                  );
                })
              )}
            </Row>
          </Card>
        </Col>
      </Row>

      <Modal
        title={
          <div style={{ paddingBottom: 12, borderBottom: '1px solid #f1f5f9' }}>
            <Space><DollarOutlined /> Cấu hình Giá & Slot cho sân {selectedCourtForPricing?.name}</Space>
          </div>
        }
        open={isPricingModalOpen}
        onCancel={() => setIsPricingModalOpen(false)}
        footer={[
          <Button key="back" onClick={() => setIsPricingModalOpen(false)}>Đóng</Button>,
          <Button key="submit" type="primary" style={{ background: BRAND.primary }} onClick={handleSaveAvailability}>Lưu cấu hình</Button>
        ]}
        width={600}
      >
        <div style={{ marginTop: 20 }}>
          <Alert
            message="Cấu hình lịch bận & Khóa sân"
            description="Chọn khoảng ngày và các khung giờ bạn muốn mở để khách đặt. Các khung giờ không được chọn sẽ tự động bị KHÓA."
            type="info"
            showIcon
            style={{ marginBottom: 20, borderRadius: 10 }}
          />
          <Form form={slotForm} layout="vertical">
            <Form.Item
              label={<Text strong>Chọn khoảng ngày áp dụng</Text>}
              name="dateRange"
              rules={[{ required: true, message: 'Vui lòng chọn khoảng ngày' }]}
            >
              <DatePicker.RangePicker
                style={{ width: '100%', borderRadius: 8 }}
                format="DD/MM/YYYY"
                disabledDate={(current) => current && current < dayjs().startOf('day')}
              />
            </Form.Item>

            <Form.Item
              label={<Text strong>Chọn khung giờ mở cửa (Available)</Text>}
              name="slots"
              rules={[{ required: true, message: 'Vui lòng chọn ít nhất một khung giờ' }]}
            >
              <Select mode="multiple" style={{ width: '100%', borderRadius: 8 }}>
                {(() => {
                  const startHour = venue?.openTime ? parseInt(venue.openTime.split(':')[0]) : 5;
                  let endHour = venue?.closeTime ? parseInt(venue.closeTime.split(':')[0]) : 22;
                  if (endHour === 0) endHour = 24;

                  const hours = [];
                  for (let h = startHour; h < endHour; h++) {
                    const hStr = String(h).padStart(2, '0');
                    hours.push(
                      <Option key={`${hStr}:00`} value={`${hStr}:00`}>{hStr}:00 - {hStr}:30</Option>
                    );
                    hours.push(
                      <Option key={`${hStr}:30`} value={`${hStr}:30`}>{hStr}:30 - {h + 1 === 24 ? '00:00' : `${String(h + 1).padStart(2, '0')}:00`}</Option>
                    );
                  }
                  return hours;
                })()}
              </Select>
            </Form.Item>

            <div style={{ padding: '12px', background: '#f8fafc', borderRadius: 10 }}>
              <Space>
                <InfoCircleOutlined style={{ color: '#64748b' }} />
                <Text type="secondary" style={{ fontSize: 13 }}>
                  Gợi ý: Nếu bạn muốn khóa toàn bộ sân trong 1 ngày, hãy để trống phần chọn khung giờ hoặc chọn ngày đó nhưng không tích giờ nào.
                </Text>
              </Space>
            </div>
          </Form>
        </div>
      </Modal>

      <Modal
        title={
          <div style={{ paddingBottom: 12, borderBottom: '1px solid #f1f5f9' }}>
            <Space><PlusOutlined /> Thiết lập nhanh số lượng sân</Space>
          </div>
        }
        open={isBulkModalOpen}
        onCancel={() => setIsBulkModalOpen(false)}
        onOk={() => {
          message.success('Đã tạo nhanh danh sách sân thành công!');
          setIsBulkModalOpen(false);
        }}
        okText="Tạo danh sách sân"
        okButtonProps={{ style: { background: BRAND.primary } }}
      >
        <div style={{ marginTop: 20 }}>
          <Alert
            message="Lưu ý"
            description="Hệ thống sẽ tự động tạo các sân với tên theo thứ tự (Sân 1, Sân 2...) dựa trên số lượng bạn nhập."
            type="info"
            showIcon
            style={{ marginBottom: 20, borderRadius: 10 }}
          />
          <Form layout="vertical">
            <Form.Item label={<Text strong>Số lượng sân muốn tạo</Text>}>
              <InputNumber min={1} max={50} defaultValue={5} style={{ width: '100%', borderRadius: 8 }} placeholder="Nhập số lượng (VD: 10)" />
            </Form.Item>
            <div style={{ padding: '12px', background: '#f8fafc', borderRadius: 10 }}>
              <Text type="secondary" style={{ fontSize: 13 }}>
                Tên sân sẽ được đặt tự động: <Text strong>Sân 1, Sân 2, Sân 3...</Text>
              </Text>
            </div>
          </Form>
        </div>
      </Modal>

      <Modal
        title={editingCourt ? 'Chỉnh sửa thông tin sân' : 'Thêm sân con mới'}
        open={isModalOpen}
        onCancel={() => { setIsModalOpen(false); setEditingCourt(null); form.resetFields(); }}
        onOk={() => form.submit()}
        okButtonProps={{ style: { background: BRAND.primary } }}
        width={500}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} style={{ marginTop: 20 }}>
          <Form.Item label="Tên sân lẻ" name="name" rules={[{ required: true }]}>
            <Input placeholder="VD: Sân 1, Sân VIP 1..." style={{ borderRadius: 8 }} />
          </Form.Item>
          <Form.Item label="Mô tả đặc điểm" name="description">
            <TextArea rows={3} placeholder="Mô tả thảm, ánh sáng, quạt..." style={{ borderRadius: 10 }} />
          </Form.Item>
          {editingCourt && (
            <Form.Item label="Trạng thái hoạt động" name="status">
              <Select style={{ borderRadius: 8 }}>
                <Option value="ACTIVE">Sẵn sàng đón khách</Option>
                <Option value="MAINTENANCE">Đang bảo trì / Sửa chữa</Option>
              </Select>
            </Form.Item>
          )}
        </Form>
      </Modal>

      <Modal
        title={
          <div style={{ paddingBottom: 12, borderBottom: '1px solid #f1f5f9' }}>
            <Space><DollarOutlined /> Thêm khung giờ giá mới</Space>
          </div>
        }
        open={isPriceRuleModalOpen}
        onCancel={() => setIsPriceRuleModalOpen(false)}
        onOk={() => priceRuleForm.submit()}
        okText="Thêm khung giờ"
        okButtonProps={{ style: { background: BRAND.primary } }}
        width={500}
      >
        <div style={{ marginTop: 20 }}>
          <Alert
            message="Quy tắc giá theo khung giờ"
            description="Giá này sẽ được áp dụng cho tất cả các sân lẻ trong cơ sở nếu không có cấu hình giá riêng cho từng sân."
            type="info"
            showIcon
            style={{ marginBottom: 20, borderRadius: 10 }}
          />
          <Form form={priceRuleForm} layout="vertical" onFinish={handleSavePriceRule}>
            <Form.Item
              label={<Text strong>Chọn ngày áp dụng</Text>}
              name="days"
              rules={[{ required: true, message: 'Vui lòng chọn ít nhất một ngày' }]}
              initialValue={[1, 2, 3, 4, 5, 6, 7]}
            >
              <Checkbox.Group style={{ width: '100%' }}>
                <Row>
                  <Col span={6}><Checkbox value={1}>Thứ 2</Checkbox></Col>
                  <Col span={6}><Checkbox value={2}>Thứ 3</Checkbox></Col>
                  <Col span={6}><Checkbox value={3}>Thứ 4</Checkbox></Col>
                  <Col span={6}><Checkbox value={4}>Thứ 5</Checkbox></Col>
                  <Col span={6}><Checkbox value={5}>Thứ 6</Checkbox></Col>
                  <Col span={6}><Checkbox value={6}>Thứ 7</Checkbox></Col>
                  <Col span={6}><Checkbox value={7}>Chủ Nhật</Checkbox></Col>
                </Row>
              </Checkbox.Group>
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label={<Text strong>Khoảng giờ</Text>}
                  name="timeRange"
                  rules={[{ required: true, message: 'Vui lòng chọn khung giờ' }]}
                >
                  <TimePicker.RangePicker format="HH:mm" style={{ width: '100%', borderRadius: 8 }} minuteStep={30} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={<Text strong>Giá (VNĐ/h)</Text>}
                  name="pricePerHour"
                  rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
                >
                  <InputNumber
                    style={{ width: '100%', borderRadius: 8 }}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
                    placeholder="VD: 80,000"
                    min={0 as number}
                  />
                </Form.Item>
              </Col>
            </Row>

            <div style={{ padding: '12px', background: '#f8fafc', borderRadius: 10 }}>
              <Space>
                <InfoCircleOutlined style={{ color: '#64748b' }} />
                <Text type="secondary" style={{ fontSize: 13 }}>
                  Lưu ý: Nếu có nhiều quy tắc trùng giờ, hệ thống sẽ ưu tiên quy tắc được tạo sau cùng.
                </Text>
              </Space>
            </div>
          </Form>
        </div>
      </Modal>
    </div>
  );
}
