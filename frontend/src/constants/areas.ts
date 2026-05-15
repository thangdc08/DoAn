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

export const PROVINCE_OPTIONS = [
  // 6 Thành phố trực thuộc trung ương
  { value: 'HANOI', label: 'Hà Nội' },
  { value: 'HOCHIMINH', label: 'TP. Hồ Chí Minh' },
  { value: 'HAIPHONG', label: 'Hải Phòng' },
  { value: 'HUE', label: 'Thừa Thiên Huế' },
  { value: 'DANANG', label: 'Đà Nẵng' },
  { value: 'CANTHO', label: 'Cần Thơ' },
  
  // 28 Tỉnh
  { value: 'CAOBANG', label: 'Cao Bằng' },
  { value: 'LANGSON', label: 'Lạng Sơn' },
  { value: 'QUANGNINH', label: 'Quảng Ninh' },
  { value: 'BACNINH', label: 'Bắc Ninh' },
  { value: 'PHUTHO', label: 'Phú Thọ' },
  { value: 'THAINGUYEN', label: 'Thái Nguyên' },
  { value: 'LAOCAI', label: 'Lào Cai' },
  { value: 'TUYENQUANG', label: 'Tuyên Quang' },
  { value: 'LAICHAU', label: 'Lai Châu' },
  { value: 'DIENBIEN', label: 'Điện Biên' },
  { value: 'SONLA', label: 'Sơn La' },
  { value: 'HUNGYEN', label: 'Hưng Yên' },
  { value: 'NINHBINH', label: 'Ninh Bình' },
  { value: 'THANHHOA', label: 'Thanh Hóa' },
  { value: 'NGHEAN', label: 'Nghệ An' },
  { value: 'HATINH', label: 'Hà Tĩnh' },
  { value: 'QUANGTRI', label: 'Quảng Trị' },
  { value: 'QUANGNGAI', label: 'Quảng Ngãi' },
  { value: 'GIALAI', label: 'Gia Lai' },
  { value: 'KHANHHOA', label: 'Khánh Hòa' },
  { value: 'LAMDONG', label: 'Lâm Đồng' },
  { value: 'DAKLAK', label: 'Đắk Lắk' },
  { value: 'DONGNAI', label: 'Đồng Nai' },
  { value: 'TAYNINH', label: 'Tây Ninh' },
  { value: 'VINHLONG', label: 'Vĩnh Long' },
  { value: 'DONGTHAP', label: 'Đồng Tháp' },
  { value: 'CAMAU', label: 'Cà Mau' },
  { value: 'ANGIANG', label: 'An Giang' },
];

/**
 * Phẳng hóa danh sách để tra cứu nhanh
 */
export const ALL_AREAS = AREA_OPTIONS.flatMap(group => group.options);

export const AREA_MAP: Record<string, string> = Object.fromEntries(
  [...ALL_AREAS, ...PROVINCE_OPTIONS].map(item => [item.value, item.label])
);
