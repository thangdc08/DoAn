# Hướng dẫn sử dụng Mock Data

## ✅ Đã tạo Mock Data Files

```
src/data/
├── mockVenues.ts       # Mock venues và courts
├── mockBookings.ts     # Mock bookings và availability
├── mockCommunity.ts    # Mock match posts
├── mockNotifications.ts # Mock notifications
└── mockUsers.ts        # Mock users (current, owner, admin)
```

## 🔄 Cách thay thế API calls bằng Mock Data

### 1. **VenueListPage** ✅ (Đã cập nhật)
```typescript
// Thay vì:
import { useQuery } from '@tanstack/react-query';
import { venueApi } from '../../services/venueApi';

const { data, isLoading } = useQuery({
  queryKey: ['venues'],
  queryFn: () => venueApi.getVenues(),
});

// Dùng:
import { mockVenues } from '../../data/mockVenues';
const data = { content: mockVenues, totalElements: mockVenues.length };
```

### 2. **VenueDetailPage**
```typescript
// Import
import { mockVenues, mockCourts } from '../../data/mockVenues';

// Trong component
const { venueId } = useParams();
const venue = mockVenues.find(v => v.id === venueId);
const courts = mockCourts[venueId!] || [];
```

### 3. **CommunityPage**
```typescript
import { mockMatchPosts } from '../../data/mockCommunity';

// Filter theo level, status
const filteredPosts = mockMatchPosts.filter(post => {
  const matchLevel = !level || post.level === level;
  const matchStatus = !status || post.status === status;
  return matchLevel && matchStatus;
});
```

### 4. **BookingPage**
```typescript
import { mockAvailability } from '../../data/mockBookings';
import { mockVenues, mockCourts } from '../../data/mockVenues';

const venue = mockVenues.find(v => v.id === venueId);
const courts = mockCourts[venueId!] || [];
const availability = mockAvailability;
```

### 5. **BookingHistoryPage**
```typescript
import { mockBookings } from '../../data/mockBookings';

const filteredBookings = mockBookings.filter(booking => {
  return !status || booking.status === status;
});
```

### 6. **NotificationsPage**
```typescript
import { mockNotifications } from '../../data/mockNotifications';

const notifications = mockNotifications;
const unreadCount = notifications.filter(n => !n.readAt).length;
```

### 7. **ProfilePage**
```typescript
import { mockCurrentUser } from '../../data/mockUsers';

const currentUser = mockCurrentUser;
```

### 8. **OwnerDashboardPage**
```typescript
import { mockVenues } from '../../data/mockVenues';
import { mockBookings } from '../../data/mockBookings';

const venues = mockVenues.filter(v => v.ownerId === 'owner-1');
const bookings = mockBookings;
const revenueData = {
  totalRevenue: 5000000,
  bookingCount: 25,
  chartData: [],
};
```

### 9. **VenueManagementPage**
```typescript
import { mockVenues } from '../../data/mockVenues';

const venues = mockVenues.filter(v => v.ownerId === 'owner-1');
```

### 10. **CourtManagementPage**
```typescript
import { mockVenues, mockCourts } from '../../data/mockVenues';

const { venueId } = useParams();
const venue = mockVenues.find(v => v.id === venueId);
const courts = mockCourts[venueId!] || [];
```

### 11. **UserManagementPage (Admin)**
```typescript
import { mockAllUsers } from '../../data/mockUsers';

const users = mockAllUsers;
```

### 12. **VenueApprovalPage (Admin)**
```typescript
import { mockVenues } from '../../data/mockVenues';

const pendingVenues = mockVenues.filter(v => v.status === 'PENDING_APPROVAL');
```

## 🎯 Pattern chung để thay thế

### Bước 1: Xóa imports không cần
```typescript
// Xóa
import { useQuery, useMutation } from '@tanstack/react-query';
import { venueApi } from '../../services/venueApi';
```

### Bước 2: Import mock data
```typescript
// Thêm
import { mockVenues } from '../../data/mockVenues';
```

### Bước 3: Thay useQuery bằng mock data
```typescript
// Thay vì
const { data, isLoading } = useQuery({
  queryKey: ['venues'],
  queryFn: () => venueApi.getVenues(),
});

// Dùng
const data = mockVenues;
const isLoading = false;
```

### Bước 4: Thay useMutation bằng mock function
```typescript
// Thay vì
const createMutation = useMutation({
  mutationFn: venueApi.createVenue,
  onSuccess: () => { /* ... */ },
});

// Dùng
const handleCreate = (values: any) => {
  console.log('Mock create:', values);
  message.success('Tạo thành công (mock)');
  // Có thể thêm vào mockVenues array nếu muốn
};
```

## 📝 Lưu ý

1. **Không cần TanStack Query**: Xóa tất cả `useQuery` và `useMutation`
2. **Không cần API services**: Không import từ `services/`
3. **Filter/Search**: Dùng `Array.filter()` và `Array.map()` trên mock data
4. **Pagination**: Dùng `Array.slice()` để phân trang
5. **Loading state**: Set `isLoading = false` hoặc bỏ loading UI
6. **Error handling**: Bỏ error handling hoặc mock error states

## 🚀 Quick Start

Để chạy với mock data:

```bash
cd frontend
npm install
npm run dev
```

Tất cả pages sẽ hiển thị với mock data, không cần backend!

## 🔧 Thêm Mock Data

Để thêm mock data mới:

1. Mở file mock tương ứng trong `src/data/`
2. Thêm object mới vào array
3. Đảm bảo follow đúng TypeScript types

Ví dụ thêm venue mới:

```typescript
// src/data/mockVenues.ts
export const mockVenues: Venue[] = [
  // ... existing venues
  {
    id: '4',
    ownerId: 'owner-2',
    name: 'Sân Mới',
    // ... other fields
  },
];
```

## ✨ Benefits

- ✅ Không cần backend để xem UI
- ✅ Develop frontend độc lập
- ✅ Demo nhanh cho stakeholders
- ✅ Test UI/UX flows
- ✅ Dễ dàng thêm/sửa data để test edge cases
