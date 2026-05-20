# Functional Specification (Hoàn chỉnh) — Badminton Booking + Community Platform
**Ngày:** 20/05/2026  
**Scope:** Web responsive + Backend microservices + PostgreSQL/PostGIS + MongoDB + Redis + Kafka  
**Mục tiêu:** Đặt sân online + thanh toán + cộng đồng (kèo) + đánh giá + thông báo + gợi ý

---

## 0) Chốt công nghệ & phạm vi
### 0.1. Frontend
- React + Vite + TypeScript
- UI: Ant Design (dashboard/form/table) + Tailwind CSS (layout/public)
- Router: React Router
- Server state: TanStack Query
- HTTP: Axios (interceptor gắn token + refresh token)
- Form: React Hook Form + Zod

### 0.2. Backend
- Java 21 + Spring Boot 3.x
- Spring Security (JWT), Validation, Spring Data JPA
- API Docs: Springdoc OpenAPI/Swagger
- Gateway: Spring Cloud Gateway

### 0.3. Data & Infra
- PostgreSQL 16 + PostGIS (1 instance, nhiều schema: `identity`, `venue`, `booking`, `payment`, `community`)
- MongoDB 7 (notification_db, recommendation_db)
- Redis 7 (OTP, rate-limit, cache)
- **Kafka** (event bus)
- Docker Compose (demo)

### 0.4. Services
- `api-gateway` (no DB)
- `identity-service` (schema `identity`)
- `venue-service` (schema `venue` + PostGIS)
- `booking-service` (schema `booking`)
- `payment-service` (schema `payment`)
- `community-service` (schema `community`)
- `notification-service` (MongoDB `notification_db`)
- `recommendation-service` (MongoDB `recommendation_db` + Redis)

---

## 1) Nguyên tắc kiến trúc (bắt buộc)
1) Mỗi microservice **sở hữu dữ liệu** của mình; service khác chỉ gọi API hoặc consume event.
2) Không join DB chéo service; dùng `*_snapshot` để lưu lịch sử.
3) Booking/Payment/Slot lock phải transaction chặt trên PostgreSQL.
4) Event-driven qua Kafka: **idempotent** ở cả producer/consumer.
5) Frontend chỉ gọi API Gateway.

---

## 2) Chuẩn chung API
### 2.1. Header
- `Authorization: Bearer <accessToken>`
- `Content-Type: application/json`

### 2.2. Format lỗi chuẩn (recommend)
```json
{
  "timestamp": "2026-05-20T10:00:00Z",
  "status": 409,
  "error": "CONFLICT",
  "code": "SLOT_ALREADY_LOCKED",
  "message": "Slot is already locked by another user.",
  "path": "/api/bookings/locks",
  "traceId": "optional"
}
```

### 2.3. Pagination chuẩn
Query: `page`, `size`, `sort`  
Response:
```json
{ "items": [], "page": 0, "size": 20, "totalItems": 0, "totalPages": 0 }
```

---

## 3) Security & RBAC
### 3.1. Roles
- `USER`, `OWNER`, `ADMIN`

### 3.2. JWT claims (đề xuất)
- `sub` = userId (UUID)
- `email`
- `roles` = ["USER", ...]
- `exp`, `iat`

### 3.3. Rule phân quyền
- Guest: chỉ xem public
- User: booking + community + rating + notification của mình
- Owner: quản lý venue thuộc owner + xem booking doanh thu venue mình
- Admin: duyệt venue, quản lý user, xử lý report, xử lý ngoại lệ

---

## 4) Kafka — Thiết kế hoàn chỉnh (bắt buộc)
### 4.1. Event envelope chuẩn
```json
{
  "eventId": "uuid",
  "eventType": "PaymentSucceeded",
  "occurredAt": "2026-05-20T17:05:00Z",
  "producer": "payment-service",
  "version": 1,
  "data": {}
}
```

### 4.2. Topics (khuyến nghị tách theo domain)
- `identity.events`
- `venue.events`
- `booking.events`
- `payment.events`
- `community.events`

### 4.3. Partition key (đảm bảo thứ tự)
- payment.events: key=`bookingId`
- booking.events: key=`bookingId`
- venue.events: key=`venueId`
- identity.events: key=`userId`
- community.events: key=`matchPostId`

### 4.4. Consumer groups
- booking-service: `booking-service`
- notification-service: `notification-service`
- recommendation-service: `recommendation-service`
- identity-service (consume RatingCreated để update profile summary): `identity-service`

### 4.5. Idempotency & Dedup
- Consumer lưu bảng `processed_events(event_id, processed_at)` trong DB (hoặc Redis) để bỏ qua event lặp.
- Các handler phải idempotent:
  - PaymentSucceeded tới lại → booking vẫn PAID, không cập nhật sai
  - RatingCreated tới lại → không cộng ratingCount 2 lần

### 4.6. Outbox (khuyến nghị mạnh)
- Mỗi producer (payment/booking/community/venue/identity) có bảng `outbox_events`
- Khi transaction DB commit → ghi outbox → publisher đẩy Kafka → mark SENT
- Tránh mất event khi service crash.

---

## 5) Module A — Identity (Tài khoản & Hồ sơ)

### A1) Đăng ký
**POST** `/api/auth/register` (Guest)
```json
{ "email":"u@gmail.com","phone":"098...","password":"P@ssw0rd123","fullName":"Nguyen Van A" }
```
Rules:
- email unique; phone optional unique
- password >= 8 chars
- tạo user ACTIVE, role USER

Response:
```json
{ "userId":"uuid", "message":"REGISTER_SUCCESS" }
```

Kafka:
- Produce `identity.events` key=userId: `UserRegistered`

---

### A2) Đăng nhập
**POST** `/api/auth/login` (Guest)
```json
{ "email":"u@gmail.com", "password":"P@ssw0rd123" }
```
Response:
```json
{
  "accessToken":"jwt",
  "refreshToken":"rt",
  "expiresIn":3600,
  "user":{"id":"uuid","fullName":"...","roles":["USER"]}
}
```

---

### A3) Refresh token / Logout
- **POST** `/api/auth/refresh-token`
- **POST** `/api/auth/logout`

Rules:
- refresh token lưu DB hash, revoke khi logout

---

### A4) Quên mật khẩu (OTP)
- **POST** `/api/auth/forgot-password` (Guest)
- **POST** `/api/auth/reset-password` (Guest)

Rules:
- OTP/token TTL 5–10 phút (Redis)
- rate limit theo ip/email

---

### A5) Me + Profile
- **GET** `/api/users/me` (User/Owner/Admin)
- **PUT** `/api/users/me/profile` (User)
```json
{
  "level":"INTERMEDIATE",
  "gender":"MALE",
  "goal":"FITNESS",
  "preferredArea":"Cau Giay, Ha Noi",
  "bio":"..."
}
```

---

### A6) Admin quản lý user
- **GET** `/api/admin/users`
- **PATCH** `/api/admin/users/{userId}/status` (ACTIVE/LOCKED)
- **PATCH** `/api/admin/users/{userId}/roles`

---

### A7) Profile rating summary (consume event)
Identity-service consume `community.events:RatingCreated` để update:
- `identity.user_profiles.rating_avg`, `rating_count` (điểm uy tín người chơi)

---

## 6) Module B — Venue (Sân + Map + Price)

### B1) Danh sách sân
**GET** `/api/venues` (Guest/User)
Query gợi ý: `q, city, district, amenityIds, minPrice, maxPrice, page, size`

Rules:
- Guest chỉ thấy `status=APPROVED`

---

### B2) Sân gần tôi (PostGIS)
**GET** `/api/venues/nearby?lat=&lng=&radiusKm=&limit=` (Guest/User)
Rules:
- ST_DWithin + order by distance

---

### B3) Chi tiết sân
**GET** `/api/venues/{venueId}` (Guest/User)
Response nên có:
- venue info
- ratingAvg/ratingCount
- images/amenities (nếu làm)
- courts summary (optional)

---

### B4) Courts
**GET** `/api/venues/{venueId}/courts` (Guest/User)

---

### B5) Owner quản lý sân
- **POST** `/api/owner/venues` (Owner)
- **PUT** `/api/owner/venues/{venueId}` (Owner)
- **POST** `/api/owner/venues/{venueId}/courts` (Owner)
- **POST** `/api/owner/venues/{venueId}/price-rules` (Owner)

Rules:
- venue mới: `PENDING_APPROVAL`
- owner chỉ sửa venue thuộc mình

---

### B6) Admin duyệt sân
- **GET** `/api/admin/venues/pending`
- **PATCH** `/api/admin/venues/{venueId}/approve`
- **PATCH** `/api/admin/venues/{venueId}/reject`

Kafka:
- Produce `venue.events` key=venueId: `VenueApproved`

---

## 7) Module C — Booking (Availability + Lock + Booking)

### C0) Status enum
- Booking `status`: `PENDING | PAID | FAILED | EXPIRED | CANCELLED_BY_ADMIN`
- Booking `paymentStatus`: `UNPAID | PROCESSING | SUCCESS | FAILED`
- BookingItem `status`: `PENDING | BOOKED | FAILED | EXPIRED`
- SlotLock `status`: `LOCKED | RELEASED | EXPIRED | CONVERTED_TO_BOOKING`

---

### C1) Availability theo ngày
**GET** `/api/bookings/availability?venueId=&date=YYYY-MM-DD` (Guest/User)

Slot status: `AVAILABLE|LOCKED|BOOKED|CLOSED|EVENT`

---

### C2) Lock slot (chống trùng)
**POST** `/api/bookings/locks` (User)
```json
{
  "venueId":"uuid",
  "courtId":"uuid",
  "slots":[{"startTime":"2026-05-20T18:00:00","endTime":"2026-05-20T19:00:00"}]
}
```

Rules:
- TTL lock 10–15 phút
- unique index `(court_id,start_time,end_time)` WHERE status='LOCKED'
- conflict → 409 SLOT_ALREADY_LOCKED

Response:
```json
{ "lockIds":["uuid"], "expiresAt":"...", "status":"LOCKED" }
```

---

### C3) Create booking PENDING
**POST** `/api/bookings` (User)
```json
{ "lockIds":["uuid"] }
```

Rules:
- lock thuộc user, còn hạn
- tạo booking + items (snapshot venue/court/price)
- lock → CONVERTED_TO_BOOKING
- unique index booking_item `(court_id,start_time,end_time)` WHERE status IN ('PENDING','BOOKED')

Kafka:
- Produce `booking.events` key=bookingId: `BookingCreated`

---

### C4) Booking history / detail
- **GET** `/api/bookings/my` (User)
- **GET** `/api/bookings/{bookingId}` (User/Owner/Admin)

Owner endpoints:
- **GET** `/api/owner/bookings`
- **GET** `/api/owner/revenue`

---

### C5) Expire jobs
- Job 1: booking PENDING quá hạn → EXPIRED + items EXPIRED
  - publish `BookingExpired`
- Job 2: slot locks hết hạn → EXPIRED

---

## 8) Module D — Payment (MOCK/VNPay)
### D1) Create payment transaction
**POST** `/api/payments/create` (User)
```json
{ "bookingId":"uuid", "provider":"MOCK" }
```

Rules:
- verify booking: thuộc user, PENDING, chưa expired
- tạo transaction PENDING
- trả `paymentUrl` để FE redirect

Response:
```json
{
  "transactionId":"uuid",
  "bookingId":"uuid",
  "amount":120000,
  "provider":"MOCK",
  "status":"PENDING",
  "paymentUrl":"http://localhost:5173/mock-payment?transactionId=uuid"
}
```

---

### D2) Mock callback
**POST** `/api/payments/mock/callback`
```json
{ "transactionId":"uuid", "result":"SUCCESS" }
```

Rules:
- update transaction SUCCESS/FAILED
- publish Kafka:
  - `PaymentSucceeded` hoặc `PaymentFailed` (key=bookingId)

---

### D3) Booking consume payment events
Booking-service consume `payment.events`:
- `PaymentSucceeded`:
  - if booking PENDING → set PAID, paymentStatus SUCCESS, items BOOKED
  - publish `BookingPaid`
- `PaymentFailed`:
  - if booking PENDING → set FAILED, items FAILED
  - (optional) publish BookingFailed

---

## 9) Module E — Notification (In-app)
### E1) Consume events → tạo notification
Consume:
- `identity.events.UserRegistered`
- `booking.events.BookingCreated`
- `booking.events.BookingPaid`
- `booking.events.BookingExpired`
- `community.events.MatchJoinRequested`
- `community.events.MatchApproved`
- `community.events.RatingCreated`
- (optional) `venue.events.VenueApproved` (owner notification)

Dedup:
- unique by `eventId`

### E2) API
- **GET** `/api/notifications/my`
- **GET** `/api/notifications/unread-count`
- **PATCH** `/api/notifications/{id}/read`
- **PATCH** `/api/notifications/read-all`

---

## 10) Module F — Community (Kèo) — HOÀN CHỈNH

### F0) Status & rule
MatchPost:
- `status`: `OPEN | CLOSED | FINISHED | HIDDEN`
- `joinMode`: `OPEN | APPROVAL`
- `visibility`: `PUBLIC | PRIVATE` (optional; đồ án có thể chỉ PUBLIC)

Participant:
- `status`: `PENDING | APPROVED | REJECTED | CANCELLED_BY_USER | REMOVED_BY_HOST`

---

### F1) Tạo kèo (UC-E2.1)
**POST** `/api/community/match-posts` (User)
```json
{
  "title":"Tìm kèo tối nay",
  "description":"Cần 2 bạn TB-Khá",
  "startTime":"2026-05-21T19:00:00",
  "endTime":"2026-05-21T21:00:00",
  "venueId":"optional-uuid",
  "locationText":"Nếu không chọn venue",
  "lat":21.03,
  "lng":105.81,
  "levelRequired":"INTERMEDIATE",
  "maxPlayers":4,
  "joinMode":"APPROVAL",
  "visibility":"PUBLIC"
}
```

Validation:
- title required 3..120
- startTime < endTime
- startTime >= now + 30 phút (recommend)
- maxPlayers >= 2
- phải có venueId **hoặc** locationText/lat/lng
- authorId lấy từ JWT

Response:
```json
{ "id":"uuid", "status":"OPEN" }
```

Kafka:
- Produce `community.events` key=matchPostId: `MatchPostCreated`

---

### F2) Tìm kèo / lọc kèo (UC-E2.2)
**GET** `/api/community/match-posts` (Guest/User)

Query:
- `q`
- `status` (default OPEN)
- `fromTime`, `toTime`
- `lat`, `lng`, `radiusKm` (nearby)
- `level`
- `joinMode`
- `venueId`
- `page`, `size`, `sort` (newest, nearest, startTimeSoon)

Rules:
- Guest thấy PUBLIC và status != HIDDEN
- “nearest” yêu cầu lat/lng

---

### F3) Chi tiết kèo (UC-E2.3)
**GET** `/api/community/match-posts/{id}` (Guest/User)

Rule hiển thị participants:
- Guest: chỉ count
- User: có thể thấy basic (optional)
- Host/Admin: thấy full list (PENDING/APPROVED)

---

### F4) Xin tham gia kèo (UC-E2.5)
**POST** `/api/community/match-posts/{id}/join` (User)
```json
{ "note":"Mình xin tham gia" }
```

Rules:
- match status=OPEN
- không vượt maxPlayers (count APPROVED)
- không tạo trùng: unique (matchPostId, userId)
- joinMode=OPEN → participant APPROVED
- joinMode=APPROVAL → participant PENDING

Response:
```json
{ "participantId":"uuid", "status":"PENDING" }
```

Kafka:
- joinMode=APPROVAL → `MatchJoinRequested` (notify host)
- joinMode=OPEN → `MatchApproved` (notify user + host optional)

---

### F5) Chủ kèo duyệt / từ chối (UC-E2.4)
**POST** `/api/community/match-posts/{id}/participants/{participantId}/approve` (Host/Admin)  
**POST** `/api/community/match-posts/{id}/participants/{participantId}/reject` (Host/Admin)

Rules:
- host = authorId hoặc admin
- match status OPEN
- participant status PENDING
- approve phải check capacity
- optional: nếu đủ người → match status CLOSED

Response:
```json
{ "participantId":"uuid", "status":"APPROVED" }
```

Kafka:
- Approve → `MatchApproved` (notify participant)
- Reject → (optional) `MatchRejected` (notify participant)

---

### F6) Người chơi rời kèo
**POST** `/api/community/match-posts/{id}/leave` (User)

Rules:
- participant phải tồn tại và status in (PENDING, APPROVED)
- match not FINISHED
- set participant `CANCELLED_BY_USER`

---

### F7) Chủ kèo đóng/mở kèo
- **POST** `/api/community/match-posts/{id}/close` (Host/Admin)
- **POST** `/api/community/match-posts/{id}/reopen` (Host/Admin)

Rules:
- close: OPEN → CLOSED
- reopen: CLOSED → OPEN nếu startTime còn tương lai

---

### F8) Xác nhận đã chơi (finish)
**POST** `/api/community/match-posts/{id}/finish` (Host/Admin)

Rules:
- match OPEN/CLOSED → FINISHED
- khuyến nghị chỉ finish khi endTime < now (có thể nới lỏng cho đồ án)

---

### F9) Like/Comment/Report (optional nhưng nên có)
- Like toggle: **POST** `/api/community/match-posts/{id}/likes`
- Comment:
  - **POST** `/api/community/match-posts/{id}/comments`
  - **GET** `/api/community/match-posts/{id}/comments`
- Report:
  - **POST** `/api/community/reports`
  - Admin: **GET** `/api/admin/reports`, **PATCH** `/api/admin/reports/{id}/resolve`

Rate limit:
- Redis limit theo userId (vd 10 comments/phút)

---

## 11) Module G — Rating (Đánh giá) — HOÀN CHỈNH

> **Chính sách chốt (khuyến nghị):**
> - **Đánh giá sân**: chỉ cho rate nếu user có **booking PAID** tại venue.
> - **Đánh giá người chơi**: chỉ khi match **FINISHED**; host rate participants APPROVED. (Đơn giản để làm đồ án)

---

# G1) Đánh giá SÂN (Venue Rating) — Venue Service sở hữu

### G1.1) Tạo/Update rating sân
**POST** `/api/venues/{venueId}/ratings` (User)
```json
{ "stars":5, "comment":"Sân sạch, đèn tốt" }
```

Rules:
- stars 1..5
- Policy: user phải có booking PAID tại venue  
  - venue-service gọi booking-service internal:
    - `GET /internal/bookings/has-paid?userId=&venueId=` → true/false
- Unique (userId, venueId)
  - Nếu đã tồn tại: update (hoặc trả 409; chốt: **cho update**)

Response:
```json
{ "ratingId":"uuid", "venueId":"uuid", "stars":5 }
```

Side effects:
- Update `venues.rating_avg`, `venues.rating_count`
  - Nếu create mới: tăng count
  - Nếu update: count giữ nguyên, avg tính lại
- (Optional) publish Kafka:
  - `venue.events:VenueRated` key=venueId

---

### G1.2) Danh sách rating sân
**GET** `/api/venues/{venueId}/ratings` (Guest/User)
Query: page/size/sort=newest

Response item:
```json
{
  "ratingId":"uuid",
  "userId":"uuid",
  "fullNameSnapshot":"Nguyen Van A",
  "stars":5,
  "comment":"...",
  "createdAt":"..."
}
```

---

# G2) Đánh giá NGƯỜI CHƠI (Player Rating) — Community Service sở hữu

### G2.1) Tạo rating người chơi
**POST** `/api/community/match-posts/{id}/ratings` (Host)

Request:
```json
{
  "rateeUserId":"uuid",
  "stars":4,
  "comment":"Đúng giờ, thái độ tốt"
}
```

Rules:
- match status = FINISHED
- rater phải là authorId (host)
- rateeUserId phải là participant APPROVED của match
- Unique (matchPostId, raterId, rateeUserId)
  - nếu tồn tại: cho update hoặc 409; chốt: **cho update**

Response:
```json
{ "ratingId":"uuid", "stars":4 }
```

Kafka:
- Produce `community.events:RatingCreated` key=rateeUserId hoặc matchPostId
```json
{
  "eventId":"uuid",
  "eventType":"RatingCreated",
  "occurredAt":"...",
  "producer":"community-service",
  "version":1,
  "data":{
    "matchPostId":"uuid",
    "raterId":"uuid",
    "rateeUserId":"uuid",
    "stars":4
  }
}
```

---

### G2.2) Xem rating người chơi (tùy scope)
Option 1 (đơn giản): chỉ show summary ở profile
- `GET /api/users/me` trả `ratingAvg`, `ratingCount`

Option 2 (thêm): show list
- **GET** `/api/users/{userId}/player-ratings` (User)
  - có thể đặt ở community-service: `/api/community/users/{userId}/ratings`

---

### G2.3) Identity cập nhật rating summary
Identity-service consume `community.events:RatingCreated`:
- Update:
  - `user_profiles.rating_count += 1` (nếu rating mới)
  - hoặc recompute avg theo công thức incremental
- **Idempotent** theo eventId + ratingId (nếu có)

---

## 12) Recommendation Service (Gợi ý) — FULL (rule-based)
### R1) Gợi ý sân
**GET** `/api/recommendations/venues?lat=&lng=&radiusKm=&limit=` (User)
Signals:
- distance (PostGIS / precomputed)
- price fit (optional)
- venue rating (ratingAvg)
- user history (consume BookingPaid)

Cache:
- Redis TTL 5–15 phút

### R2) Gợi ý kèo
**GET** `/api/recommendations/matches?lat=&lng=&radiusKm=&limit=` (User)
Signals:
- nearby + startTime soon + level fit + host reputation

### R3) Gợi ý người chơi (optional)
**GET** `/api/recommendations/players?...`

---

## 13) Event Catalog (đầy đủ)

### identity.events
- `UserRegistered`

### venue.events
- `VenueApproved`
- `VenueRated` (optional)

### payment.events
- `PaymentSucceeded`
- `PaymentFailed`

### booking.events
- `BookingCreated`
- `BookingPaid`
- `BookingExpired`

### community.events
- `MatchPostCreated`
- `MatchJoinRequested`
- `MatchApproved`
- `RatingCreated`

---

## 14) Luồng nghiệp vụ end-to-end

### 14.1) Booking + Payment (Saga)
1) FE lock slot → `POST /api/bookings/locks`
2) FE create booking → `POST /api/bookings`
3) FE create payment → `POST /api/payments/create`
4) Payment callback success/fail
5) payment-service publish `PaymentSucceeded/PaymentFailed`
6) booking-service consume → update booking PAID/FAILED → publish `BookingPaid/BookingExpired`
7) notification-service consume → create noti
8) recommendation-service consume → update activity

### 14.2) Kèo (community)
1) Host tạo kèo → `POST /api/community/match-posts` → `MatchPostCreated`
2) User join:
   - OPEN → auto approve → `MatchApproved`
   - APPROVAL → `MatchJoinRequested` → host approve → `MatchApproved`
3) Host finish match → mở rating
4) Host rate players → `RatingCreated` → identity update reputation → notification gửi noti

---

## 15) Test cases bắt buộc (để code đúng)

### 15.1) Community
- Tạo kèo startTime quá khứ → 400
- Join kèo CLOSED/FINISHED → 409
- Join trùng → trả trạng thái cũ, không tạo record mới
- Approve khi đủ người → 409 hoặc auto close

### 15.2) Player rating
- Rate khi match chưa FINISHED → 409
- Rate user không thuộc APPROVED list → 403/409
- Event RatingCreated replay → identity không cộng double

### 15.3) Venue rating
- Rate khi chưa booking PAID (policy strict) → 403/409
- Update rating → ratingAvg/ratingCount đúng

### 15.4) Booking/payment
- Lock trùng slot → 409
- Payment callback duplicate → booking vẫn idempotent

---
## 16) Thứ tự triển khai khuyến nghị
1) Infra Compose: Postgres+PostGIS, Mongo, Redis, Kafka  
2) Identity: register/login/jwt/roles  
3) Venue: CRUD + nearby + approval + rating venue  
4) Booking: availability + lock + booking + jobs  
5) Payment: mock + publish Kafka  
6) Booking consume payment events + publish booking events  
7) Notification consume + UI bell  
8) Community: create/search/join/approve/finish + player rating  
9) Recommendation: rule-based + cache

---