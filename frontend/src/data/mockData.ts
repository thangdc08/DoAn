export const timeSlots = [
  '05:00', '05:30', '06:00', '06:30', '07:00', '07:30',
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
  '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30', '24:00',
];

export const courtNames = [
  'Sân 1', 'Sân 2', 'Sân 3', 'Sân 4',
  'Sân 5', 'Sân 6', 'Sân 7', 'Sân 8',
];

// ─── Match Post types ─────────────────────────────────────────────────

export type MatchPost = {
  id: string;
  host: string;
  hostAvatar?: string;
  privacy: 'Công khai' | 'Nội bộ';
  level: string;
  levelCode?: string;
  title: string;
  venueName: string;
  time: string;
  tags: string[];
  joined: number;
  capacity: number;
  price: string;
  likes?: number;
};

export const matchPosts: MatchPost[] = [
  {
    id: '1',
    host: 'Thắng Đinh',
    hostAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Thang',
    privacy: 'Công khai',
    level: 'TB',
    levelCode: 'TB',
    title: 'Giao lưu cầu lông tối nay — Nhóm Vui Vẻ',
    venueName: 'Sân Cầu Lông Đào Duy Anh, Phú Nhuận',
    time: '20:00 – 22:00, Hôm nay',
    tags: ['Giao lưu', 'Vui vẻ', 'Nam/Nữ'],
    joined: 6,
    capacity: 8,
    price: '40.000đ – 60.000đ / người',
    likes: 12,
  },
  {
    id: '2',
    host: 'Minh Trần',
    hostAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Minh',
    privacy: 'Công khai',
    level: 'TBK',
    levelCode: 'TBK',
    title: 'Tìm thêm 2 bạn nam/nữ trình trung bình',
    venueName: 'Sân Viettel, Quận 10',
    time: '18:00 – 20:00, Ngày mai',
    tags: ['Nghiêm túc', 'Cạnh tranh'],
    joined: 4,
    capacity: 6,
    price: '50.000đ / người',
    likes: 7,
  },
  {
    id: '3',
    host: 'Linh Nguyễn',
    hostAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Linh',
    privacy: 'Nội bộ',
    level: 'Y',
    levelCode: 'Y',
    title: 'Kèo sáng sớm — Tập thể dục nhóm nhỏ',
    venueName: 'Sân Kỳ Hòa, Quận 10',
    time: '05:30 – 07:00, 15/05',
    tags: ['Sáng sớm', 'Sức khỏe', 'Người mới'],
    joined: 2,
    capacity: 10,
    price: 'Miễn phí',
    likes: 3,
  },
  {
    id: '4',
    host: 'Hùng Phạm',
    hostAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hung',
    privacy: 'Công khai',
    level: 'TB++',
    levelCode: 'TB++',
    title: 'Kèo chiều thứ 7 — Trình khá trở lên',
    venueName: 'Sân Tân Bình Sport, Tân Bình',
    time: '15:00 – 17:00, Thứ 7',
    tags: ['Nhanh', 'Cạnh tranh cao'],
    joined: 8,
    capacity: 8,
    price: '70.000đ / người',
    likes: 21,
  },
];

// ─── Venue types ──────────────────────────────────────────────────────

export type Venue = {
  id: string;
  name: string;
  address: string;
  area: string;
  courts: number;
  rating: number;
  reviewCount: number;
  distance: string;
  priceRange: string;
  openTime: string;
  availableSlots: number;
  amenities: string[];
  image: string;
};

export const venues: Venue[] = [
  {
    id: '1',
    name: 'Sân Cầu Lông Đào Duy Anh',
    address: '21 Đào Duy Anh, Phường 9, Quận Phú Nhuận, TP. HCM',
    area: 'Phú Nhuận',
    courts: 8,
    rating: 4.8,
    reviewCount: 128,
    distance: '1.2 km',
    priceRange: '80.000đ – 120.000đ',
    openTime: '05:00 – 22:00',
    availableSlots: 45,
    amenities: ['WiFi', 'Bãi đỗ xe', 'Máy lạnh', 'Cho thuê vợt', 'Nước uống'],
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=1200',
  },
  {
    id: '2',
    name: 'Sân Cầu Lông Viettel',
    address: '285 Cách Mạng Tháng 8, Quận 10, TP. HCM',
    area: 'Quận 10',
    courts: 12,
    rating: 4.5,
    reviewCount: 85,
    distance: '3.5 km',
    priceRange: '100.000đ – 150.000đ',
    openTime: '06:00 – 22:00',
    availableSlots: 20,
    amenities: ['Bãi đỗ xe', 'Căng tin', 'Cho thuê giày', 'Tủ đồ'],
    image: 'https://images.unsplash.com/photo-1521537634581-0dced2fee2ef?q=80&w=1200',
  },
  {
    id: '3',
    name: 'Sân Kỳ Hòa',
    address: '261B Điện Biên Phủ, Phường 15, Quận 10, TP. HCM',
    area: 'Quận 10',
    courts: 6,
    rating: 4.3,
    reviewCount: 64,
    distance: '4.1 km',
    priceRange: '70.000đ – 100.000đ',
    openTime: '05:30 – 21:00',
    availableSlots: 12,
    amenities: ['Bãi đỗ xe', 'Nước uống', 'Cho thuê vợt'],
    image: 'https://images.unsplash.com/photo-1607627000458-210e8d2bdb1d?q=80&w=1200',
  },
];
