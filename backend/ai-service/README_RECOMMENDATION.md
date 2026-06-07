# Recommendation System — AI Service

Hệ thống gợi ý sân cầu lông cá nhân hóa dựa trên Weighted Scoring + Content-Based Filtering.

---

## Mục lục

- [Kiến trúc tổng quan](#kiến-trúc-tổng-quan)
- [Thuật toán](#thuật-toán)
  - [Tại sao chọn thuật toán này?](#tại-sao-chọn-thuật-toán-này)
  - [5 yếu tố scoring](#5-yếu-tố-scoring)
  - [Luồng xử lý](#luồng-xử-lý)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [API Endpoint](#api-endpoint)
- [Cài đặt & chạy](#cài--chạy)
- [Docker](#docker)
- [Tích hợp Frontend](#tích-hợp-frontend)
- [Kiểm thử](#kiểm-thử)
- [Điều chỉnh & mở rộng](#điều-chỉnh--mở-rộng)

---

## Kiến trúc tổng quan

```
┌─────────────┐     ┌──────────────┐     ┌────────────────┐
│   Frontend  │────▶│  API Gateway  │────▶│  ai-service    │
│             │     │  :8080        │     │  :8091          │
└─────────────┘     └──────┬───────┘     │  ┌────────────┐│
                          │              │  │recommendations│
                          │              │  │   routes     ││
                   ┌──────▼───────┐      │  ├────────────┤│
                   │  identity-   │      │  │ scoringEngine││
                   │  service     │      │  ├────────────┤│
                   │  :8081       │      │  │ userClient   ││
                   └──────────────┘      │  │ venueClient  ││
                   ┌──────────────┐      │  │ bookingClient││
                   │  venue-      │      │  └────────────┘│
                   │  service     │      └────────────────┘
                   │  :8082       │
                   └──────────────┘
                   ┌──────────────┐
                   │  booking-    │
                   │  service     │
                   │  :8083       │
                   └──────────────┘
```

**ai-service** (Node.js/Express) chịu trách nhiệm:
1. Gọi các service khác (identity, venue, booking) qua API Gateway
2. Chạy thuật toán scoring trên dữ liệu thu thập được
3. Trả về danh sách sân xếp hạng (ranked) cho frontend

---

## Thuật toán

### Tại sao chọn thuật toán này?

| Tiêu chí | Weighted Scoring + Content-Based | Collaborative Filtering |
|----------|----------------------------------|-------------------------|
| Cold-start (user mới) | ✅ Hoạt động ngay, chỉ cần level + preferred area | ❌ Cần lịch sử tương tác |
| Data ít (< 1000 booking) | ✅ Không cần nhiều data | ❌ Không đủ để tính similarity |
| Interpretable | ✅ Score rõ từng yếu tố, dễ debug | ❌ Black box, khó giải thích |
| Triển khai | ✅ Không cần ML infra | ❌ Cần training pipeline, matrix factorization |
| Tùy chỉnh | ✅ Điều chỉnh trọng số dễ dàng | ❌ Cần retrain model |

### 5 yếu tố scoring

Mỗi venue được tính điểm **0–100** từ 5 yếu tố:

| # | Yếu tố | Trọng số | Phương pháp | Input |
|---|--------|----------|-------------|-------|
| 1 | **Khoảng cách địa lý** | 30% | Haversine giữa preferred area → venue | `lat/lng` |
| 2 | **Trình độ phù hợp** | 25% | Level distance theo bảng thứ bậc | `user.level` vs `venue.playedLevels` |
| 3 | **Rating venue** | 20% | Linear map 0–5 sao → 0–100 | `venue.ratingAvg` |
| 4 | **Giá cả** | 15% | So với trung bình giá trong city | `venue.defaultPrice` vs `avgPrice` |
| 5 | **Lịch sử đặt sân** | 10% | Tần suất book tại venue | `bookingHistory` |

#### Chi tiết từng yếu tố

**1. Distance Score (30%)**
- Method: [Haversine formula](https://en.wikipedia.org/wiki/Haversine_formula) — tính khoảng cách địa lý (km) giữa preferred area của user và venue
- Ngưỡng: < 2km → 100 | 2–5km → 70 | 5–10km → 40 | > 10km → 10
- Fallback: User không có preferred area → 40 điểm. Venue không có lat/lng → 30 điểm

**2. Level Score (25%)**
- Bảng thứ bậc (cao → thấp): `Y+ > Y > TBY+ > TBY > TB+ > TB > TB- > TBK`
- Method: Level distance → `score = max(0, 100 - distance * 30)`
- Match exact → 100, ±1 level → 70, ±2 level → 40, khác → 10
- `venue.playedLevels` = level phổ biến nhất user đã từng book tại venue đó
- Fallback: User mới không có booking → 40 điểm

**3. Rating Score (20%)**
- Method: `(venue.ratingAvg / 5.0) * 100`
- Bonus +5 điểm nếu `ratingCount >= 10` (đủ người đánh giá)
- Cap ở 100

**4. Price Score (15%)**
- Method: So sánh `venue.defaultPrice` với trung bình giá của tất cả venues trong city
- < 80% avg → 100 | 80%–120% avg → tuyến tính 100→70 | > 120% avg → 40

**5. History Score (10%)**
- Chưa từng book → 0 | 1 lần → 50 | ≥2 lần → `min(100, 50 + count * 10)`

### Luồng xử lý

```
GET /recommendations/venues?userId=<uuid>&city=Hà+Nội&limit=10
  │
  ├─ Step 1: FETCH (3 calls parallel, timeout 5s mỗi call)
  │     ├─ GET /identity/api/v1/users/{userId}
  │     │     → { level, rating, preferredAreas, availabilities }
  │     ├─ GET /api/venues (filter APPROVED)
  │     │     → [{ id, name, address, city, lat, lng, ratingAvg, ratingCount,
  │     │         defaultPrice, courtCount, utilities, images }]
  │     └─ GET /api/bookings/my?userId={userId}
  │           → { venueId: { count, name } }
  │
  ├─ Step 2: ENRICH
  │     └─ Đánh dấu playedLevels cho mỗi venue từ booking history
  │
  ├─ Step 3: SCORE (mỗi venue độc lập)
  │     └─ scoreVenue(user, venue, bookingHistory, allVenuePrices)
  │         → { score, breakdown: { distance, level, rating, price, history } }
  │
  ├─ Step 4: RANK + FILTER
  │     └─ Sort DESC by score, lọc score >= 50, slice top N
  │
  └─ Step 5: RESPONSE
        {
          success: true,
          data: [
            {
              venue: { id, name, address, city, latitude, longitude,
                       ratingAvg, ratingCount, defaultPrice, courtCount,
                       utilities, openTime, closeTime, images },
              score: 87.5,
              breakdown: {
                distance: 100,
                level: 70,
                rating: 85,
                price: 100,
                history: 50
              }
            },
            ...
          ],
          meta: { totalCandidates, returned, city, userLevel }
        }
```

---

## Cấu trúc thư mục

```
backend/ai-service/
├── src/
│   ├── index.js                          # Entry point, register routes
│   ├── routes/
│   │   └── recommendations.js            # GET /recommendations/venues handler
│   ├── models/
│   │   ├── level.config.js               # Level hierarchy + scoring helpers
│   │   └── venue.model.js                # Constants: weights, thresholds, defaults
│   ├── engine/
│   │   ├── distance.js                   # Haversine formula + distance → score
│   │   └── scoringEngine.js              # 5-feature weighted scoring logic
│   └── clients/
│       ├── userClient.js                 # Fetch user profile from identity-service
│       ├── venueClient.js                # Fetch venues + price from venue-service
│       └── bookingClient.js              # Fetch booking history from booking-service
├── Dockerfile
├── .env
├── package.json
└── README_RECOMMENDATION.md             ← this file
```

### Mô tả từng file

| File | Mô tả |
|------|-------|
| `src/models/level.config.js` | Định nghĩa `LEVEL_ORDER` (thứ bậc trình độ), `getLevelDistance()`, `getLevelScore()` |
| `src/models/venue.model.js` | Constants: `SCORE_WEIGHTS` (trọng số 5 features), `DISTANCE_THRESHOLDS`, `DEFAULT_LIMIT` |
| `src/engine/distance.js` | `haversine()` tính khoảng cách km từ 2 cặp lat/lng; `scoreDistance()` map km → điểm |
| `src/engine/scoringEngine.js` | `scoreVenue()` — orchestrator 5 features, trả về `{score, breakdown}` |
| `src/clients/userClient.js` | HTTP client → identity-service `/api/v1/users/{id}` |
| `src/clients/venueClient.js` | HTTP client → venue-service `/api/venues` + `/api/venues/{id}` |
| `src/clients/bookingClient.js` | HTTP client → booking-service `/api/bookings/my` (với header `X-Auth-User-Id`) |
| `src/routes/recommendations.js` | Express router: fetch → enrich → score → rank → respond |

---

## API Endpoint

### `GET /recommendations/venues`

Gợi ý danh sách sân phù hợp cho người chơi.

**Query Parameters:**

| Param | Type | Required | Default | Mô tả |
|-------|------|----------|---------|-------|
| `userId` | UUID | ✅ | — | ID người dùng |
| `city` | string | ❌ | `Hà Nội` | Thành phố tìm sân |
| `limit` | int | ❌ | `10` | Số kết quả trả về |

**Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "venue": {
        "id": "uuid",
        "name": "Sân Cầu Lông Cầu Giấy",
        "address": "123 Đường Cầu Giấy",
        "ward": "Cầu Giấy",
        "city": "Hà Nội",
        "latitude": 21.0333,
        "longitude": 105.8000,
        "ratingAvg": 4.5,
        "ratingCount": 25,
        "defaultPrice": 80000,
        "courtCount": 4,
        "utilities": ["Wifi", "Nước uống", "Giày thuê"],
        "openTime": "06:00:00",
        "closeTime": "22:00:00",
        "images": [{"imageUrl": "https://..."}]
      },
      "score": 87.5,
      "breakdown": {
        "distance": 100,
        "level": 70,
        "rating": 85,
        "price": 100,
        "history": 50
      }
    }
  ],
  "meta": {
    "totalCandidates": 15,
    "returned": 3,
    "city": "Hà Nội",
    "userLevel": "TB+"
  }
}
```

**Lỗi (400/404/500):**

```json
{
  "success": false,
  "message": "Thiếu tham số userId"
}
```

---

## Cài đặt & chạy

### Yêu cầu

- Node.js >= 18
- npm >= 9
- Các service khác đang chạy: identity-service, venue-service, booking-service, Eureka, API Gateway

### Bước 1: Cài dependencies

```bash
cd backend/ai-service
npm install
```

### Bước 2: Cấu hình `.env`

```env
PORT=8091
GATEWAY_URL=http://localhost:8080
GEMINI_API_KEY=your_gemini_key_here  # optional, cho chatbot
```

### Bước 3: Chạy service

```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

Service sẽ chạy tại `http://localhost:8091`

---

## Docker

### Build & chạy với docker-compose

```bash
# Build image
docker-compose build ai-service

# Start service
docker-compose up -d ai-service

# Xem logs
docker-compose logs -f ai-service

# Stop
docker-compose stop ai-service
```

### Build thủ công

```bash
cd backend/ai-service
docker build -t badminton-ai-service .
docker run -p 8091:8091 \
  -e PORT=8091 \
  -e GATEWAY_URL=http://host.docker.internal:8080 \
  badminton-ai-service
```

> **Lưu ý Docker network:** Khi chạy trong docker-compose, `GATEWAY_URL` phải là `http://api-gateway:8080` (tên service trong network). Khi chạy local, dùng `http://localhost:8080`.

---

## Tích hợp Frontend

### Gọi API từ React/Vue/Next.js

```typescript
// src/services/recommendationApi.ts
const API_BASE = 'http://localhost:8080'; // API Gateway

export async function getRecommendedVenues(userId: string, city = 'Hà Nội', limit = 10) {
  const res = await fetch(
    `${API_BASE}/recommendations/venues?userId=${userId}&city=${encodeURIComponent(city)}&limit=${limit}`
  );
  const data = await res.json();
  return data.data; // Array<{venue, score, breakdown}>
}
```

### Hiển thị trong component

```tsx
// Trang gợi ý: src/pages/user/RecommendationsPage.tsx
import { useEffect, useState } from 'react';
import { getRecommendedVenues } from '../services/recommendationApi';

export default function RecommendationsPage({ userId }) {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRecommendedVenues(userId, 'Hà Nội', 10)
      .then(data => { setVenues(data); setLoading(false); });
  }, [userId]);

  if (loading) return <div>Đang tìm sân phù hợp...</div>;

  return (
    <div className="space-y-4">
      {venues.map(({ venue, score, breakdown }) => (
        <div key={venue.id} className="border rounded-lg p-4">
          <h3>{venue.name} ⭐ {venue.ratingAvg}</h3>
          <p>{venue.address}, {venue.ward}, {venue.city}</p>
          <div className="flex gap-2">
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
              Điểm: {score}/100
            </span>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
              📍 {breakdown.distance}/30
            </span>
            <span className="bg-purple-100 px-2 py-1 rounded">
              🏸 {breakdown.level}/25
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
```

### Router

```typescript
// src/app/router.tsx — thêm route
<Route path="/recommendations" element={<RecommendationsPage userId={user.id} />} />
```

---

## Kiểm thử

### 1. Kiểm tra service chạy

```bash
curl http://localhost:8091/health
# {"status":"ok","timestamp":"2025-..."}
```

### 2. Kiểm tra endpoint (thay UUID hợp lệ)

```bash
curl "http://localhost:8080/recommendations/venues?userId=<UUID>&city=Hà+Nội&limit=5"
```

### 3. Kiểm tra từng component

```bash
# Test Haversine
node -e "
import('./src/engine/distance.js').then(m => {
  console.log('Cầu Giấy → Lê Văn Lương:', m.haversine(21.0333, 105.8000, 21.0333, 105.7833), 'km');
  console.log('Score:', m.scoreDistance(2.5));
});
"

# Test Level scoring
node -e "
import('./src/models/level.config.js').then(m => {
  console.log('Y+ vs TB distance:', m.getLevelDistance('Y+', 'TB'));
  console.log('Y+ vs TB score:', m.getLevelScore('Y+', 'TB'));
  console.log('TB+ vs TBY score:', m.getLevelScore('TB+', 'TBY'));
});
"
```

### 4. Test case quan trọng

| Tình huống | Kỳ vọng |
|-----------|---------|
| User có preferred area "Cầu Giấy" | Venue gần Cầu Giấy có distance score = 100 |
| User level Y+, venue playedLevels = ['TB'] | Level score = 10 (xa trình độ) |
| User level TB+, venue playedLevels = ['TB+'] | Level score = 100 (exact match) |
| User chưa từng book sân nào | History score = 0 cho tất cả venues |
| User đã book venue X 3 lần | Venue X có history score = 80 |
| Venue rating 4.8 sao, 20 reviews | Rating score = 96 + 5 bonus = 100 |
| City "Hà Nội" không có venue nào | `data: []`, message phù hợp |
| Không truyền userId | 400 Bad Request |

---

## Điều chỉnh & mở rộng

### Điều chỉnh trọng số

Sửa `src/models/venue.model.js`:

```javascript
export const SCORE_WEIGHTS = {
  distance:  0.30,  // Tăng nếu muốn ưu tiên gần hơn
  level:     0.25,  // Tăng nếu muốn ưu tiên đúng trình độ
  rating:    0.20,
  price:     0.15,
  history:   0.10,
};
```

### Điều chỉnh ngưỡng khoảng cách

Sửa `src/models/venue.model.js`:

```javascript
export const DISTANCE_THRESHOLDS = [
  { maxKm: 1,  score: 100 },   // Gần hơn
  { maxKm: 3,  score: 80  },
  { maxKm: 5,  score: 60  },
  { maxKm: 10, score: 30  },
  { maxKm: Infinity, score: 0 },
];
```

### Mở rộng: Thêm yếu tố thời gian (UserAvailability)

```javascript
// Trong scoringEngine.js
function computeTimeScore(user, venue) {
  const now = new Date().getDay(); // 0=Sun
  const todaySlots = user.availabilities
    .filter(a => a.dayOfWeek === now)
    .map(a => `${a.startTime}-${a.endTime}`);
  // So với openTime/closeTime của venue
  // ...
}
```

### Mở rộng: Thêm utilities matching

```javascript
function computeUtilityScore(userPrefs, venue) {
  const prefSet = new Set(userPrefs);
  const venueUtils = new Set(venue.utilities);
  const matchCount = [...prefSet].filter(u => venueUtils.has(u)).length;
  return (matchCount / Math.max(prefSet.size, 1)) * 100;
}
```

### Mở rộng: Tích hợp Gemini Chatbot

Khi user hỏi "gợi ý sân phù hợp với mình" → chatbot tự động gọi `/recommendations/venues` và trả về kết quả dạng text.

```javascript
// Trong src/index.js /chat endpoint
if (intent === 'RECOMMEND_VENUES') {
  const result = await recommendVenues(userId, city);
  reply = `Mình gợi ý các sân sau đây cho bạn:\n` +
    result.data.map((v, i) => `${i+1}. ${v.venue.name} (${v.score} điểm)`).join('\n');
}
```

---

## Tech Stack

| Component | Công nghệ |
|-----------|-----------|
| Runtime | Node.js 20 (ESM) |
| Framework | Express.js |
| HTTP Client | Axios |
| AI (chatbot) | Google Gemini 1.5 Flash |
| Geolocation | Haversine formula (pure math, no external lib) |
| Deployment | Docker + docker-compose |
| Gateway | Spring Cloud Gateway (routing `/recommendations/**` → ai-service) |

---

## License

Part of BadmintonHub project.
