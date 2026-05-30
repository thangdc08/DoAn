import { useState, useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import { Card, Button, Table, Tag, Space, Modal, Form, Input, Select, message, Typography, Row, Col, Tabs, Checkbox, Divider, Avatar, Tooltip, AutoComplete, InputNumber, Upload, TimePicker, Popconfirm, Rate, Empty, Image, Spin } from 'antd';
import type { UploadFile, UploadProps } from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  EyeOutlined, 
  EnvironmentOutlined, 
  WifiOutlined, 
  CarOutlined, 
  CoffeeOutlined, 
  ThunderboltOutlined,
  GlobalOutlined,
  ShopOutlined,
  CustomerServiceOutlined,
  PictureOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  StarOutlined,
  StarFilled
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';
import type { Venue } from '../../types/venue.types';
import { BRAND } from '../../theme/antdTheme';
import { venueApi } from '../../services/venueApi';
import { VENUE_STATUS_MAP, UTILITIES } from '../../constants/venue.constants.tsx';
import { AddressFields } from '../../components/forms/AddressFields';
import { PROVINCE_OPTIONS, AREA_OPTIONS } from '../../constants/areas';

// Leaflet fix for Vite/Webpack
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = (L as any).icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIconRetina,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
(L as any).Marker.prototype.options.icon = DefaultIcon;

function LocationPicker({ position, setPosition }: { position: [number, number], setPosition: (p: [number, number]) => void }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position ? <Marker position={position} /> : null;
}

function MapController({ center }: { center: [number, number] }) {
  const map = useMap() as any;
  useEffect(() => {
    if (map && center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
}

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;


export default function VenueManagementPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);
  const [position, setPosition] = useState<[number, number] | null>([10.762622, 106.660172]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [options, setOptions] = useState<{ value: string; label: string; lat: string; lon: string }[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [activeTab, setActiveTab] = useState('1');
  const searchTimeoutRef = useRef<any>(null);
  const [viewingRatingsVenueId, setViewingRatingsVenueId] = useState<string | null>(null);
  const [viewingRatingsVenueName, setViewingRatingsVenueName] = useState<string>('');

  // Lấy dữ liệu thật từ API
  const { data: venues = [], isLoading } = useQuery({
    queryKey: ['my-venues'],
    queryFn: () => venueApi.getMyVenues(),
  });

  // Query lấy đánh giá của sân đang chọn
  const { data: ownerRatingsData, isLoading: isLoadingOwnerRatings } = useQuery({
    queryKey: ['owner-venue-ratings', viewingRatingsVenueId],
    queryFn: () => venueApi.getVenueRatings(viewingRatingsVenueId!),
    enabled: !!viewingRatingsVenueId,
  });

  // Mutation tạo sân mới
  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const createdVenue = await venueApi.createVenue(data);
      // Nếu có ảnh thì upload ảnh lên trong cùng mutation
      if (fileList.length > 0) {
        const files = fileList.map(f => f.originFileObj as File);
        await venueApi.uploadVenueImages(createdVenue.id, files);
      }
      return createdVenue;
    },
    onSuccess: () => {
      message.success('Đăng ký cơ sở mới thành công! Hồ sơ đang chờ duyệt.');
      setIsModalOpen(false);
      setFileList([]);
      queryClient.invalidateQueries({ queryKey: ['my-venues'] });
      form.resetFields();
    },
    onError: (error: any) => {
      message.error(error.message || 'Có lỗi xảy ra khi tạo sân.');
    }
  });

  // Mutation xóa sân
  const deleteMutation = useMutation({
    mutationFn: (id: string) => venueApi.deleteVenue(id),
    onSuccess: () => {
      message.success('Xóa cơ sở thành công!');
      queryClient.invalidateQueries({ queryKey: ['my-venues'] });
    },
    onError: (error: any) => {
      message.error(error.message || 'Có lỗi xảy ra khi xóa cơ sở.');
    }
  });

  // Mutation cập nhật sân
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const updatedVenue = await venueApi.updateVenue(id, data);
      // Nếu có ảnh mới thì upload trong cùng mutation
      const newFiles = fileList
        .filter(f => !f.url && f.originFileObj)
        .map(f => f.originFileObj as File);
        
      if (newFiles.length > 0) {
        await venueApi.uploadVenueImages(id, newFiles);
      }
      return updatedVenue;
    },
    onSuccess: () => {
      message.success('Cập nhật thông tin cơ sở thành công!');
      setIsModalOpen(false);
      setFileList([]);
      queryClient.invalidateQueries({ queryKey: ['my-venues'] });
      form.resetFields();
    },
    onError: (error: any) => {
      message.error(error.message || 'Có lỗi xảy ra khi cập nhật cơ sở.');
    }
  });

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Xóa cơ sở',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có chắc chắn muốn xóa cơ sở này? Hành động này không thể hoàn tác và toàn bộ dữ liệu liên quan (sân, ảnh) sẽ bị xóa.',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk() {
        deleteMutation.mutate(id);
      },
    });
  };

  const handleRemoveImage = async (file: UploadFile) => {
    // Nếu là ảnh đã có trên server (có url)
    if (file.url && editingVenue) {
      try {
        await venueApi.deleteVenueImage(editingVenue.id, file.uid);
        message.success('Đã xóa ảnh thành công');
        return true;
      } catch (error) {
        message.error('Lỗi khi xóa ảnh trên hệ thống');
        return false;
      }
    }
    return true; // Cho phép xóa khỏi UI đối với ảnh mới
  };

  const handleCreate = () => {
    setEditingVenue(null);
    form.resetFields();
    setFileList([]);
    setActiveTab('1');
    form.setFieldsValue({
      phone: user?.phone,
      email: user?.email
    });
    setPosition([10.762622, 106.660172]);
    setIsModalOpen(true);
  };

  const handleEdit = (venue: Venue) => {
    setEditingVenue(venue);
    form.setFieldsValue({
      ...venue,
      openTime: venue.openTime ? dayjs(venue.openTime, 'HH:mm:ss') : undefined,
      closeTime: venue.closeTime ? dayjs(venue.closeTime, 'HH:mm:ss') : undefined,
    });
    
    // Load images
    if (venue.images) {
      setFileList(venue.images.map(img => ({
        uid: img.id,
        name: `image-${img.id}`,
        status: 'done',
        url: img.imageUrl,
      })));
    } else {
      setFileList([]);
    }

    setActiveTab('1');
    if (venue.latitude && venue.longitude) {
      setPosition([venue.latitude, venue.longitude]);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (values: any) => {
    console.log('Form Submit Values:', values);
    const formattedValues = {
      ...values,
      openTime: values.openTime?.format('HH:mm:00'),
      closeTime: values.closeTime?.format('HH:mm:00'),
    };

    if (fileList.length === 0) {
      message.error('Vui lòng tải lên ít nhất một hình ảnh thực tế của sân.');
      setActiveTab('4');
      return;
    }

    if (editingVenue) {
      updateMutation.mutate({ id: editingVenue.id, data: formattedValues });
    } else {
      createMutation.mutate(formattedValues);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.error('Validation Failed:', errorInfo);
    message.error('Vui lòng kiểm tra lại thông tin trong các tab (các trường có dấu * đỏ).');
    
    if (errorInfo.errorFields.length > 0) {
      const fieldName = errorInfo.errorFields[0].name[0];
      const basicFields = ['name', 'description', 'phone', 'email', 'courtCount', 'openTime', 'closeTime'];
      const locationFields = ['address', 'city', 'ward', 'latitude', 'longitude'];
      
      if (basicFields.includes(fieldName)) setActiveTab('1');
      else if (locationFields.includes(fieldName)) setActiveTab('2');
      else if (fieldName === 'utilities' || fieldName === 'policy') setActiveTab('3');
    }
  };


  const getStatusColor = (status: string) => {
    return VENUE_STATUS_MAP[status]?.color || 'default';
  };

  const getStatusLabel = (status: string) => {
    return VENUE_STATUS_MAP[status]?.label || status;
  };

  const columns = [
    {
      title: 'Thông tin cơ sở',
      key: 'venue',
      render: (_: any, record: Venue) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar size={48} shape="square" icon={<ShopOutlined />} style={{ background: '#f1f5f9', color: BRAND.primary, borderRadius: 10 }} />
          <div>
            <Text strong style={{ display: 'block', fontSize: 15 }}>{record.name}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
               <EnvironmentOutlined /> {record.city}
            </Text>
          </div>
        </div>
      )
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Đánh giá',
      dataIndex: 'ratingAvg',
      key: 'rating',
      render: (rating: number, record: Venue) => (
        <div 
          onClick={() => {
            setViewingRatingsVenueId(record.id);
            setViewingRatingsVenueName(record.name);
          }}
          style={{ cursor: 'pointer' }}
          className="hover:opacity-80 transition-opacity"
        >
          <Space direction="vertical" size={0}>
            <Text strong>{(rating || 0).toFixed(1)} ⭐</Text>
            <Text type="secondary" style={{ fontSize: 11, textDecoration: 'underline', color: BRAND.primary }}>
              {record.ratingCount || 0} đánh giá
            </Text>
          </Space>
        </div>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <Tag color={getStatusColor(status)} style={{ borderRadius: 6, fontWeight: 600 }}>{getStatusLabel(status)}</Tag>,
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'right' as const,
      render: (_: any, record: Venue) => (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/owner/venues/${record.id}/courts`)}
            style={{ background: BRAND.primary, border: 'none' }}
          >
            Quản lý sân lẻ
          </Button>
          <Tooltip title="Xem đánh giá của sân">
            <Button
              icon={<StarOutlined style={{ color: '#f59e0b' }} />}
              onClick={() => {
                setViewingRatingsVenueId(record.id);
                setViewingRatingsVenueName(record.name);
              }}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa thông tin">
            <Button
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa cơ sở">
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];
  const getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as File);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    if (newFileList.length > 10) {
      message.warning('Bạn chỉ có thể tải lên tối đa 10 hình ảnh.');
      setFileList(newFileList.slice(0, 10));
    } else {
      setFileList(newFileList);
    }
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Tải ảnh</div>
    </div>
  );

  // Logic tìm kiếm địa chỉ trên bản đồ
  const fetchSuggestions = (value: string) => {
    if (!value || value.length < 3) {
      setOptions([]);
      return;
    }
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const cityVal = form.getFieldValue('city');
        const wardVal = form.getFieldValue('ward');
        
        const cityLabel = PROVINCE_OPTIONS.find(p => p.value === cityVal)?.label || '';
        
        let wardLabel = '';
        if (cityLabel) {
          const areaGroup = AREA_OPTIONS.find(group => group.label === cityLabel);
          if (areaGroup) {
            wardLabel = areaGroup.options.find(o => o.value === wardVal)?.label || '';
          }
        }
        
        const fullQuery = [value, wardLabel, cityLabel].filter(Boolean).join(', ');

        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullQuery)}&countrycodes=vn&limit=5`,
          { headers: { 'Accept-Language': 'vi' } }
        );
        const data = await response.json();
        setOptions(data.map((item: any) => ({
          value: item.display_name,
          label: item.display_name,
          lat: item.lat,
          lon: item.lon,
        })));
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    }, 800);
  };

  const onSelectLocation = (value: string, option: any) => {
    const newPos: [number, number] = [parseFloat(option.lat), parseFloat(option.lon)];
    setPosition(newPos);
    form.setFieldsValue({
      latitude: newPos[0],
      longitude: newPos[1],
      address: value
    });
    message.success(`Đã trỏ đến: ${value}`);
  };

  const handleMapSearch = async (value: string) => {
    if (!value) return;
    setSearchLoading(true);
    try {
      const cityVal = form.getFieldValue('city');
      const wardVal = form.getFieldValue('ward');
      
      const cityLabel = PROVINCE_OPTIONS.find(p => p.value === cityVal)?.label || '';
      
      let wardLabel = '';
      if (cityLabel) {
        const areaGroup = AREA_OPTIONS.find(group => group.label === cityLabel);
        if (areaGroup) {
          wardLabel = areaGroup.options.find(o => o.value === wardVal)?.label || '';
        }
      }
      
      const fullQuery = [value, wardLabel, cityLabel].filter(Boolean).join(', ');

      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullQuery)}&countrycodes=vn&limit=1`);
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const newPos: [number, number] = [parseFloat(lat), parseFloat(lon)];
        setPosition(newPos);
        form.setFieldsValue({
          latitude: newPos[0],
          longitude: newPos[1]
        });
        message.success(`Đã tìm thấy: ${data[0].display_name}`);
      } else {
        message.warning('Không tìm thấy địa điểm này trong lãnh thổ Việt Nam.');
      }
    } catch (error) {
      message.error('Lỗi khi tìm kiếm vị trí. Vui lòng thử lại sau.');
    } finally {
      setSearchLoading(false);
    }
  };

  // Đồng bộ position với form fields
  useEffect(() => {
    if (position) {
      form.setFieldsValue({
        latitude: position[0],
        longitude: position[1]
      });
    }
  }, [position, form]);

  const BasicInfoTab = (
    <div style={{ padding: '20px 0' }}>
       <Form.Item 
          label={<Text strong>Tên cơ sở cầu lông</Text>} 
          name="name" 
          rules={[
            { required: true, message: 'Vui lòng nhập tên cơ sở' },
            { min: 5, message: 'Tên cơ sở phải có ít nhất 5 ký tự' }
          ]}
       >
          <Input placeholder="VD: Sân cầu lông Ngôi Sao" size="large" style={{ borderRadius: 10 }} />
       </Form.Item>
       <Form.Item label={<Text strong>Mô tả cơ sở</Text>} name="description">
          <TextArea rows={4} placeholder="Giới thiệu về chất lượng sân, ánh sáng..." style={{ borderRadius: 10 }} />
       </Form.Item>
       <Row gutter={16}>
          <Col span={12}>
             <Form.Item 
                label={<Text strong>Số điện thoại hotline</Text>} 
                name="phone" 
                rules={[
                  { required: true, message: 'Vui lòng nhập số điện thoại' },
                  { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ (10-11 số)' }
                ]}
             >
                <Input placeholder="090..." style={{ borderRadius: 10 }} />
             </Form.Item>
          </Col>
          <Col span={12}>
             <Form.Item 
                label={<Text strong>Email liên hệ</Text>} 
                name="email"
                rules={[
                  { type: 'email', message: 'Email không hợp lệ' }
                ]}
             >
                <Input placeholder="contact@..." style={{ borderRadius: 10 }} />
             </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
           <Col span={8}>
              <Form.Item 
                 label={<Text strong>Số lượng sân</Text>} 
                 name="courtCount" 
                 rules={[{ required: !editingVenue, message: 'Vui lòng nhập số lượng sân' }]}
              >
                 <InputNumber min={1} placeholder="10" style={{ borderRadius: 10, width: '100%' }} />
              </Form.Item>
           </Col>
           <Col span={8}>
              <Form.Item label={<Text strong>Giờ mở cửa</Text>} name="openTime" rules={[{ required: true }]}>
                 <TimePicker format="HH:mm" style={{ borderRadius: 10, width: '100%' }} />
              </Form.Item>
           </Col>
           <Col span={8}>
              <Form.Item label={<Text strong>Giờ đóng cửa</Text>} name="closeTime" rules={[{ required: true }]}>
                 <TimePicker format="HH:mm" style={{ borderRadius: 10, width: '100%' }} />
              </Form.Item>
           </Col>
        </Row>
     </div>
  );

  const LocationTab = (
    <div style={{ padding: '20px 0' }}>
       <Form.Item label={<Text strong>Địa chỉ chi tiết</Text>} name="address" rules={[{ required: true }]}>
          <AutoComplete
            options={options}
            onSearch={fetchSuggestions}
            onSelect={onSelectLocation}
            style={{ width: '100%' }}
          >
            <Input.Search 
              placeholder="Số nhà, tên đường... hoặc tìm nhanh vị trí" 
              style={{ borderRadius: 10 }}
              loading={searchLoading}
              onSearch={handleMapSearch}
              enterButton={<Button type="primary" icon={<EnvironmentOutlined />}>Tìm</Button>}
            />
          </AutoComplete>
       </Form.Item>
        <Row gutter={16}>
           <AddressFields 
             size="middle" 
             inputClassName="rounded-lg bg-white border-slate-200"
             selectStyle={{ borderRadius: 8 }}
           />
        </Row>

       <div style={{ height: 300, borderRadius: 12, overflow: 'hidden', border: '1px solid #f1f5f9', marginBottom: 20, zIndex: 0, position: 'relative' }}>
          <MapContainer 
            center={position || [10.762622, 106.660172]} 
            zoom={13} 
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationPicker position={position as any} setPosition={setPosition as any} />
            <MapController center={position as any} />
          </MapContainer>
       </div>

        <Divider orientation={"left" as any} orientationMargin={0}><Text type="secondary" style={{ fontSize: 12 }}>Tọa độ Bản đồ (GPS)</Text></Divider>
       <Row gutter={16}>
          <Col span={12}>
             <Form.Item label="Kinh độ (Longitude)" name="longitude">
                <InputNumber 
                  placeholder="106.6..." 
                  style={{ borderRadius: 10, width: '100%' }} 
                  onChange={(val) => val !== null && setPosition([position?.[0] || 0, Number(val)])}
                />
             </Form.Item>
          </Col>
          <Col span={12}>
             <Form.Item label="Vĩ độ (Latitude)" name="latitude">
                <InputNumber 
                  placeholder="10.7..." 
                  style={{ borderRadius: 10, width: '100%' }} 
                  onChange={(val) => val !== null && setPosition([Number(val), position?.[1] || 0])}
                />
             </Form.Item>
          </Col>
       </Row>
    </div>
  );

  const AmenitiesTab = (
    <div style={{ padding: '20px 0' }}>
       <Title level={5}>Dịch vụ & Tiện ích tại sân</Title>
       <Paragraph type="secondary">Chọn các tiện ích mà cơ sở của bạn cung cấp để thu hút người chơi.</Paragraph>
       
       <Form.Item name="utilities">
          <Checkbox.Group style={{ width: '100%' }}>
             <Row gutter={[16, 16]}>
                {UTILITIES.map(u => (
                  <Col span={8} key={u.value}>
                    <Card size="small" style={{ borderRadius: 12 }}>
                       <Checkbox value={u.value}>
                          <Space size={4}>
                             {u.icon}
                             {u.label}
                          </Space>
                       </Checkbox>
                    </Card>
                  </Col>
                ))}
             </Row>
          </Checkbox.Group>
       </Form.Item>

       <Divider />
       <Form.Item label={<Text strong>Chính sách riêng của cơ sở</Text>} name="policy">
          <TextArea rows={3} placeholder="VD: Không mang giày đế đen vào thảm, không hút thuốc..." style={{ borderRadius: 10 }} />
       </Form.Item>
    </div>
  );

  const ImagesTab = (
    <div style={{ padding: '20px 0' }}>
       <Title level={5}>Hình ảnh cơ sở <Text type="danger">*</Text></Title>
       <Paragraph type="secondary">Tải lên các hình ảnh thực tế của sân để khách hàng dễ dàng hình dung (Tối đa 10 ảnh).</Paragraph>
       
       <Upload
         listType="picture-card"
         fileList={fileList}
         onPreview={handlePreview}
         onChange={handleChange}
         beforeUpload={() => false} // Không tự động upload
         accept="image/*"
         multiple
       >
         {fileList.length >= 10 ? null : uploadButton}
       </Upload>

       <Modal 
         open={previewOpen} 
         title="Xem trước ảnh" 
         footer={null} 
         onCancel={() => setPreviewOpen(false)}
       >
         <img alt="preview" style={{ width: '100%' }} src={previewImage} />
       </Modal>
    </div>
  );

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
           <Title level={2} style={{ margin: 0 }}>Quản lý Cơ sở</Title>
           <Text type="secondary">Danh sách các cụm sân bạn đang sở hữu và quản lý trên nền tảng.</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} size="large" onClick={handleCreate} style={{ background: BRAND.primary, borderRadius: 10, height: 48, padding: '0 24px' }}>
          Đăng ký thêm sân mới
        </Button>
      </div>

      <Card bodyStyle={{ padding: 0 }} style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
        <Table
          columns={columns}
          dataSource={venues}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          loading={isLoading}
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={
          <div style={{ paddingBottom: 12, borderBottom: '1px solid #f1f5f9' }}>
             <Space><GlobalOutlined style={{ color: BRAND.primary }} /> <Text strong>{editingVenue ? 'Cập nhật hồ sơ cơ sở' : 'Đăng ký cơ sở mới'}</Text></Space>
          </div>
        }
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingVenue(null);
          form.resetFields();
          setActiveTab('1');
        }}
        footer={[
           <Button key="cancel" onClick={() => {
             setIsModalOpen(false);
             setActiveTab('1');
           }}>Hủy bỏ</Button>,
           activeTab !== '1' && (
             <Button key="back" onClick={() => setActiveTab((prev) => (parseInt(prev) - 1).toString())}> Quay lại</Button>
           ),
           activeTab !== '4' ? (
             <Button key="next" type="primary" onClick={() => setActiveTab((prev) => (parseInt(prev) + 1).toString())} style={{ background: BRAND.primary, borderRadius: 8 }}>
               Tiếp tục
             </Button>
           ) : (
             <Button 
               key="submit" 
               type="primary" 
               onClick={() => form.submit()} 
               loading={createMutation.isPending || updateMutation.isPending}
               style={{ background: BRAND.primary, padding: '0 32px', borderRadius: 8 }}
             >
                {editingVenue ? 'Lưu thay đổi' : 'Gửi hồ sơ duyệt'}
             </Button>
           )
        ]}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} onFinishFailed={onFinishFailed}>
           <Tabs
             activeKey={activeTab}
             onChange={setActiveTab}
             items={[
               { key: '1', label: <Space><ShopOutlined /> Thông tin chung</Space>, children: BasicInfoTab },
               { key: '2', label: <Space><EnvironmentOutlined /> Vị trí & Bản đồ</Space>, children: LocationTab },
               { key: '3', label: <Space><WifiOutlined /> Tiện ích & Dịch vụ</Space>, children: AmenitiesTab },
               { key: '4', label: <Space><PictureOutlined /> Hình ảnh</Space>, children: ImagesTab },
             ]}
           />
        </Form>
      </Modal>

      {/* View Ratings Modal */}
      <Modal
        title={
          <div style={{ paddingBottom: 12, borderBottom: '1px solid #f1f5f9' }}>
            <Space>
              <StarFilled style={{ color: '#f59e0b' }} />
              <Text strong style={{ fontSize: 16 }}>Đánh giá từ khách hàng - {viewingRatingsVenueName}</Text>
            </Space>
          </div>
        }
        open={!!viewingRatingsVenueId}
        onCancel={() => {
          setViewingRatingsVenueId(null);
          setViewingRatingsVenueName('');
        }}
        footer={[
          <Button 
            key="close" 
            type="primary"
            onClick={() => {
              setViewingRatingsVenueId(null);
              setViewingRatingsVenueName('');
            }}
            style={{ background: BRAND.primary, borderRadius: 8 }}
          >
            Đóng
          </Button>
        ]}
        width={700}
        bodyStyle={{ padding: '20px 0 10px' }}
      >
        <div style={{ maxHeight: '550px', overflowY: 'auto', padding: '0 8px' }}>
          {isLoadingOwnerRatings ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 0' }}>
              <Spin size="large" tip="Đang tải danh sách đánh giá..." />
            </div>
          ) : !ownerRatingsData || !ownerRatingsData.content || ownerRatingsData.content.length === 0 ? (
            <div style={{ padding: '40px 0', textAlign: 'center' }}>
              <Empty description="Cơ sở này chưa nhận được đánh giá nào từ khách hàng." />
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Summary Card */}
              <Card 
                style={{ 
                  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', 
                  border: 'none', 
                  borderRadius: 12, 
                  marginBottom: 8 
                }}
                bodyStyle={{ padding: '16px 24px' }}
              >
                <Row align="middle" gutter={24}>
                  <Col span={8} style={{ textAlign: 'center', borderRight: '1px solid #cbd5e1' }}>
                    <div style={{ fontSize: 40, fontWeight: 800, color: '#1e293b', lineHeight: 1 }}>
                      {ownerRatingsData.content.reduce((acc: number, item: any) => acc + item.stars, 0) / ownerRatingsData.content.length ? 
                        (ownerRatingsData.content.reduce((acc: number, item: any) => acc + item.stars, 0) / ownerRatingsData.content.length).toFixed(1) : 
                        '0.0'
                      }
                    </div>
                    <Rate 
                      disabled 
                      allowHalf 
                      defaultValue={ownerRatingsData.content.reduce((acc: number, item: any) => acc + item.stars, 0) / ownerRatingsData.content.length} 
                      style={{ fontSize: 14, margin: '8px 0' }} 
                    />
                    <div style={{ fontSize: 12, color: '#64748b' }}>
                      Trung bình ({ownerRatingsData.content.length} đánh giá)
                    </div>
                  </Col>
                  <Col span={16}>
                    <Text type="secondary" style={{ fontSize: 13, display: 'block', marginBottom: 6 }}>
                      Ý kiến phản hồi từ khách hàng đóng vai trò rất quan trọng để nâng cao chất lượng dịch vụ của sân đấu.
                    </Text>
                    <Text strong style={{ fontSize: 13, color: BRAND.primary }}>
                      Mẹo: Hãy ghi nhận phản hồi để không ngừng cải thiện trải nghiệm khách hàng.
                    </Text>
                  </Col>
                </Row>
              </Card>

              {/* Ratings List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {ownerRatingsData.content.map((rating: any) => (
                  <Card 
                    key={rating.id} 
                    style={{ 
                      borderRadius: 12, 
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                    }}
                    bodyStyle={{ padding: 16 }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Space size={12}>
                        <Avatar 
                          style={{ 
                            backgroundColor: BRAND.primary, 
                            verticalAlign: 'middle',
                            boxShadow: '0 2px 4px rgba(0,166,81,0.2)'
                          }} 
                          size="large"
                        >
                          K
                        </Avatar>
                        <div>
                          <div style={{ fontWeight: 600, color: '#1e293b', fontSize: 14 }}>
                            Khách hàng
                          </div>
                          <div style={{ fontSize: 11, color: '#94a3b8' }}>
                            {dayjs(rating.createdAt).format('DD/MM/YYYY HH:mm')}
                          </div>
                        </div>
                      </Space>
                      <Rate disabled defaultValue={rating.stars} style={{ fontSize: 14 }} />
                    </div>

                    {rating.comment && (
                      <div style={{ margin: '12px 0 8px 52px', color: '#334155', fontSize: 14, lineHeight: 1.5 }}>
                        {rating.comment}
                      </div>
                    )}

                    {rating.images && rating.images.length > 0 && (
                      <div style={{ marginLeft: 52, marginTop: 12 }}>
                        <Image.PreviewGroup>
                          <Space size={8} wrap>
                            {rating.images.map((imgUrl: string, idx: number) => (
                              <Image
                                key={idx}
                                src={imgUrl}
                                alt={`Đánh giá sân ${idx + 1}`}
                                style={{ 
                                  width: '72px', 
                                  height: '72px', 
                                  objectFit: 'cover', 
                                  borderRadius: '8px',
                                  border: '1px solid #e2e8f0'
                                }}
                              />
                            ))}
                          </Space>
                        </Image.PreviewGroup>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}

