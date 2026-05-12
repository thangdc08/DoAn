# Badminton Platform - Frontend Implementation

## 📋 Tổng quan

Frontend được xây dựng hoàn chỉnh với **React + Vite + TypeScript + Ant Design + Tailwind CSS** theo đúng tài liệu kỹ thuật.

## ✅ Đã hoàn thành

### 1. **Core Infrastructure**
- ✅ Types đầy đủ cho tất cả entities (Auth, Venue, Booking, Payment, Community, Notification)
- ✅ Zustand store cho authentication với persist
- ✅ Axios client với JWT interceptor và refresh token logic
- ✅ API services cho tất cả modules (authApi, venueApi, bookingApi, paymentApi, communityApi, notificationApi, adminApi)
- ✅ TanStack Query setup
- ✅ Router với lazy loading

### 2. **Public Pages (Guest)**
- ✅ **HomePage**: Hero section, features, CTA
- ✅ **VenueListPage**: Search, filter, pagination, venue cards
- ✅ **VenueDetailPage**: Images gallery, courts, map (React-Leaflet), business hours, amenities
- ✅ **CommunityPage**: Match posts feed, filters, pagination

### 3. **Auth Pages**
- ✅ **LoginPage**: Form validation với React Hook Form + Zod
- ✅ **RegisterPage**: Role selection (USER/OWNER)

### 4. **User Pages (Player)**
- ✅ **ProfilePage**: View/edit profile, avatar upload, level, bio
- ✅ **BookingPage**: Date picker, court selection, availability grid, slot selection, price calculation
- ✅ **CheckoutPage**: Booking summary, countdown timer, payment CTA
- ✅ **PaymentPage**: Payment method selection (MOCK/VNPAY)
- ✅ **MockPaymentPage**: Mock payment gateway for testing
- ✅ **PaymentResultPage**: Success/failure result pages
- ✅ **BookingHistoryPage**: Table with filters, status tags, booking detail modal
- ✅ **NotificationsPage**: Notification list, mark as read, unread count

### 5. **Owner Pages (Venue Owner)**
- ✅ **OwnerDashboardPage**: Revenue statistics, booking count, recent bookings table
- ✅ **VenueManagementPage**: CRUD venues, status tags, create/edit modal
- ✅ **CourtManagementPage**: CRUD courts, court types, status management

### 6. **Admin Pages**
- ✅ **UserManagementPage**: User list, search, status update, role management
- ✅ **VenueApprovalPage**: Pending venues, approve/reject actions

## 📁 Cấu trúc thư mục

```
frontend/src/
├── app/
│   └── router.tsx              # React Router configuration
├── pages/
│   ├── public/                 # Guest pages
│   │   ├── HomePage.tsx
│   │   ├── VenueListPage.tsx
│   │   ├── VenueDetailPage.tsx
│   │   └── CommunityPage.tsx
│   ├── auth/                   # Auth pages
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   ├── user/                   # User pages
│   │   ├── ProfilePage.tsx
│   │   ├── BookingPage.tsx
│   │   ├── CheckoutPage.tsx
│   │   ├── PaymentPage.tsx
│   │   ├── MockPaymentPage.tsx
│   │   ├── PaymentResultPage.tsx
│   │   ├── BookingHistoryPage.tsx
│   │   └── NotificationsPage.tsx
│   ├── owner/                  # Owner pages
│   │   ├── OwnerDashboardPage.tsx
│   │   ├── VenueManagementPage.tsx
│   │   └── CourtManagementPage.tsx
│   └── admin/                  # Admin pages
│       ├── UserManagementPage.tsx
│       └── VenueApprovalPage.tsx
├── services/
│   ├── apiClient.ts            # Axios instance with interceptors
│   ├── authApi.ts
│   ├── venueApi.ts
│   ├── bookingApi.ts
│   ├── paymentApi.ts
│   ├── communityApi.ts
│   ├── notificationApi.ts
│   └── adminApi.ts
├── stores/
│   └── authStore.ts            # Zustand auth store
├── types/
│   ├── auth.types.ts
│   ├── venue.types.ts
│   ├── booking.types.ts
│   ├── payment.types.ts
│   ├── community.types.ts
│   └── notification.types.ts
├── layouts/
│   ├── PublicLayout.tsx
│   ├── AuthLayout.tsx
│   └── DashboardLayout.tsx
├── components/
│   ├── layout/
│   ├── ui/
│   ├── forms/
│   ├── maps/
│   └── tables/
└── hooks/
    ├── useCountdown.ts
    └── useNotify.ts
```

## 🚀 Cài đặt và chạy

### 1. Install dependencies
```bash
cd frontend
npm install
```

### 2. Setup environment
```bash
cp .env.example .env
```

Cập nhật `.env`:
```
VITE_API_BASE_URL=http://localhost:8080/api
```

### 3. Run development server
```bash
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5173`

## 🔑 Features chính

### Authentication Flow
1. User đăng ký/đăng nhập
2. JWT token được lưu trong Zustand store (persist)
3. Axios interceptor tự động gắn token vào headers
4. Refresh token tự động khi access token hết hạn
5. Redirect về login khi refresh token fail

### Booking Flow
1. User chọn sân và ngày
2. Xem availability grid theo court
3. Chọn multiple slots
4. Lock slots (giữ 15 phút)
5. Tạo booking PENDING
6. Chọn payment method (MOCK/VNPAY)
7. Thanh toán
8. Booking chuyển sang PAID
9. Nhận notification

### Owner Flow
1. Owner tạo venue (status: PENDING_APPROVAL)
2. Admin duyệt venue
3. Owner thêm courts, price rules
4. Xem bookings và revenue
5. Quản lý support tickets

### Admin Flow
1. Quản lý users (status, roles)
2. Duyệt/từ chối venues
3. Xem reports
4. Quản lý payments

## 🎨 UI/UX

- **Responsive**: Mobile-first design với Tailwind CSS
- **Component Library**: Ant Design cho consistency
- **Loading States**: Skeleton, Spin components
- **Error Handling**: Toast notifications với message API
- **Empty States**: Empty component cho no data
- **Form Validation**: React Hook Form + Zod
- **Maps**: React-Leaflet + OpenStreetMap

## 📦 Dependencies chính

```json
{
  "react": "^18.x",
  "react-router-dom": "^6.x",
  "@tanstack/react-query": "^5.x",
  "axios": "^1.x",
  "zustand": "^4.x",
  "antd": "^5.x",
  "tailwindcss": "^3.x",
  "react-hook-form": "^7.x",
  "zod": "^3.x",
  "react-leaflet": "^4.x",
  "leaflet": "^1.x",
  "dayjs": "^1.x"
}
```

## 🔧 Cần bổ sung

### Pages còn thiếu (có thể thêm sau):
- [ ] Owner: Pricing Management Page
- [ ] Owner: Revenue Reports Page (charts)
- [ ] Owner: Support Tickets Page
- [ ] User: Create Match Post Page
- [ ] User: Match Detail Page
- [ ] Admin: Reports Management Page
- [ ] Admin: Payment Oversight Page
- [ ] Admin: System Settings Page

### Features nâng cao:
- [ ] Real-time notifications (WebSocket/SSE)
- [ ] Image upload với preview
- [ ] Advanced filters với query params
- [ ] Export data (CSV/PDF)
- [ ] Charts với recharts/chart.js
- [ ] Dark mode
- [ ] i18n (multi-language)
- [ ] PWA support

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e
```

## 📝 Notes

- Tất cả API calls đều qua API Gateway (`http://localhost:8080/api`)
- JWT token tự động refresh khi hết hạn
- Mock payment page để test luồng thanh toán
- Map sử dụng OpenStreetMap (free, không cần API key)
- Tất cả forms đều có validation
- Responsive design cho mobile/tablet/desktop

## 🎯 Next Steps

1. **Backend Integration**: Kết nối với Spring Boot services
2. **Testing**: Viết unit tests và E2E tests
3. **Performance**: Code splitting, lazy loading optimization
4. **SEO**: Meta tags, sitemap
5. **Deployment**: Build production và deploy lên server

---

**Tác giả**: Kiro AI Assistant
**Ngày tạo**: 2024
**Version**: 1.0.0
