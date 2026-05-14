export const AREA_OPTIONS = [
  {
    label: 'Hà Nội',
    options: [
      { value: 'HN_BA_DINH', label: 'Ba Đình' },
      { value: 'HN_HOAN_KIEM', label: 'Hoàn Kiếm' },
      { value: 'HN_TAY_HO', label: 'Tây Hồ' },
      { value: 'HN_LONG_BIEN', label: 'Long Biên' },
      { value: 'HN_CAU_GIAY', label: 'Cầu Giấy' },
      { value: 'HN_DONG_DA', label: 'Đống Đa' },
      { value: 'HN_HAI_BA_TRUNG', label: 'Hai Bà Trưng' },
      { value: 'HN_HOANG_MAI', label: 'Hoàng Mai' },
      { value: 'HN_THANH_XUAN', label: 'Thanh Xuân' },
      { value: 'HN_NAM_TU_LIEM', label: 'Nam Từ Liêm' },
      { value: 'HN_BAC_TU_LIEM', label: 'Bắc Từ Liêm' },
      { value: 'HN_HA_DONG', label: 'Hà Đông' },
    ],
  },
  {
    label: 'TP. Hồ Chí Minh',
    options: [
      { value: 'HCM_QUAN_1', label: 'Quận 1' },
      { value: 'HCM_QUAN_3', label: 'Quận 3' },
      { value: 'HCM_QUAN_4', label: 'Quận 4' },
      { value: 'HCM_QUAN_5', label: 'Quận 5' },
      { value: 'HCM_QUAN_7', label: 'Quận 7' },
      { value: 'HCM_QUAN_10', label: 'Quận 10' },
      { value: 'HCM_BINH_THANH', label: 'Bình Thạnh' },
      { value: 'HCM_GO_VAP', label: 'Gò Vấp' },
      { value: 'HCM_PHU_NHUAN', label: 'Phú Nhuận' },
      { value: 'HCM_TAN_BINH', label: 'Tân Bình' },
      { value: 'HCM_THU_DUC', label: 'Thủ Đức' },
    ],
  },
];

/**
 * Phẳng hóa danh sách để tra cứu nhanh
 */
export const ALL_AREAS = AREA_OPTIONS.flatMap(group => group.options);

export const AREA_MAP: Record<string, string> = Object.fromEntries(
  ALL_AREAS.map(item => [item.value, item.label])
);
