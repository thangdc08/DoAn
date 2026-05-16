import React from 'react';
import { Form, Input, Select, Col, Typography } from 'antd';
import { PROVINCE_OPTIONS, AREA_OPTIONS } from '../../constants/areas';

const { Text } = Typography;

interface AddressFieldsProps {
  citySpan?: number;
  wardSpan?: number;
  size?: 'large' | 'middle' | 'small';
  inputClassName?: string;
  selectStyle?: React.CSSProperties;
}

export const AddressFields: React.FC<AddressFieldsProps> = ({
  citySpan = 12,
  wardSpan = 12,
  size = 'large',
  inputClassName = "h-14 rounded-2xl bg-slate-50 border-slate-100",
  selectStyle = { borderRadius: '1rem' }
}) => {
  const form = Form.useFormInstance();
  const selectedCity = Form.useWatch('city', form);

  // Tìm danh sách phường/xã (quận/huyện cũ) dựa trên tỉnh đã chọn
  const getWardOptions = () => {
    if (!selectedCity) return [];
    
    // Tìm trong AREA_OPTIONS dựa trên label của city
    const cityLabel = PROVINCE_OPTIONS.find(p => p.value === selectedCity)?.label;
    const areaGroup = AREA_OPTIONS.find(group => group.label === cityLabel);
    
    return areaGroup ? areaGroup.options : [];
  };

  const wardOptions = getWardOptions();
  const hasWardOptions = wardOptions.length > 0;

  return (
    <>
      <Col span={citySpan}>
        <Form.Item 
          name="city" 
          label={<Text strong>Thành phố / Tỉnh</Text>} 
          rules={[{ required: true, message: 'Vui lòng chọn tỉnh/thành' }]}
        >
          <Select 
            size={size} 
            placeholder="Chọn thành phố" 
            className={size === 'large' ? "h-14 w-full" : "w-full"}
            options={PROVINCE_OPTIONS}
            showSearch
            optionFilterProp="label"
            style={selectStyle}
            onChange={() => {
              // Reset ward value when city changes
              form.setFieldValue('ward', undefined);
            }}
          />
        </Form.Item>
      </Col>
      <Col span={wardSpan}>
        <Form.Item 
          name="ward" 
          label={<Text strong>Phường / Xã</Text>} 
          rules={[{ required: true, message: 'Vui lòng nhập/chọn phường/xã' }]}
        >
          {hasWardOptions ? (
            <Select
              size={size}
              placeholder="Chọn phường/xã"
              className={size === 'large' ? "h-14 w-full" : "w-full"}
              options={wardOptions}
              showSearch
              optionFilterProp="label"
              style={selectStyle}
            />
          ) : (
            <Input 
              size={size} 
              placeholder="Nhập phường / xã" 
              className={inputClassName} 
              disabled={!selectedCity}
            />
          )}
        </Form.Item>
      </Col>
    </>
  );
};
