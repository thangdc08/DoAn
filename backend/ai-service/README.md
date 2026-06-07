# SmashMate AI — Hệ thống Gợi ý Sân Cầu Lông Cá nhân hóa

Module gợi ý sân cầu lông cá nhân hóa cho nền tảng SmashMate, dựa trên địa điểm, trình độ, rating và lịch sử đặt sân của người chơi.

---

## Cấu trúc thư mục

```
ai-service/
├── src/
│   ├── index.js                      # Entry point, register routes
│   ├── routes/
│   │   └── recommendations.js        # API endpoint orchestrator
│   ├── engine/
│   │   ├── distance.js               # Haversine + distance score
│   │   └── scoringEngine.js          # 5-feature weighted scoring
│   ├── models/
│   │   ├── level.config.js           # Level hierarchy + scoring helpers
│   │   └── venue.model.js            # Constants (weights, thresholds)
│   └── clients/
│       ├── userClient.js             # Gọi identity-service
│       ├── venueClient.js            # Gọi venue-service
│       └── bookingClient.js          # Gọi booking-service
├── package.json
├── Dockerfile
├── .env
└── README.md
```

---

## Thuật toán

Hybrid Weighted Scoring + Content-Based Filtering. Phù hợp cold-start (user mới không có lịch sử).

### 5 Yếu tố & Trọng số

| Yếu tố | Trọng số | Cách tính |
|---------|---------|-----------|
| Khoảng cách địa lý | 30% | Haversine từ preferred area → venue. <2km: 100, 2-5km: 70, 5-10km: 40, >10km: 10 |
| Trình độ phù hợp | 25% | Bậc Y+ > Y > TBY+ > TBY > TB+ > TB > TB- > TBK. Exact: 100, ±1: 70, ±2: 40 |
| Rating venue | 20% | ratingAvg / 5 × 100. Bonus +5 nếu ratingCount ≥ 10 |
| Giá cả | 15% | So với trung bình giá trong city. <80% avg: 100, 80-120%: tuyến tính, >120%: 40 |
| Lịch sử đặt sân | 10% | Chưa từng: 0, từng 1 lần: 50, ≥2 lần: 50 + 10×count (max 100) |

### Score cuối cùng

```
score = Σ (featureScore × weight)
```

---

## API

### GET /recommendations/venues

Gợi ý sân phù hợp cho user.

**Query Params:**
| Param | Required | Mặc định | Mô tả |
|-------|----------|---------|-------|
| `userId` | ✅ | — | UUID của người dùng |
| `city` | ❌ | `Hà Nội` | Thành phố lọc venues |
| `limit` | ❌ | `10` | Số kết quả trả về |

**Request:**
```
GET /recommendations/venues?userId=<uuid>&city=Hà+Nội&limit=10
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "venue": {
        "id": "uuid",
        "name": "Sân Cầu Giấy",
        "address": "...",
        "ward": "Cầu Giấy",
        "city": "Hà Nội",
        "latitude": 21.03,
        "longitude": 105.79,
        "ratingAvg": 4.5,
        "ratingCount": 25,
        "defaultPrice": 80000,
        "courtCount": 4,
        "utilities": ["Wifi", "Nước uống"],
        "openTime": "06:00:00",
        "closeTime": "22:00:00",
        "images": []
      },
      "score": 87.3,
      "breakdown": {
        "distance": 100,
        "level": 70,
        "rating": 95,
        "price": 80,
        "history": 50
      }
    }
  ],
  "meta": {
    "totalCandidates": 15,
    "returned": 10,
    "city": "Hà Nội",
    "userLevel": "TB+"
  }
}
```

### GET /health
```
{ "status": "ok", "timestamp": "..." }
```

### POST /chat (đã có trước)
Chatbot Gemini — gửi message tiếng Việt, nhận JSON intent.

---

## Chạy local

### Yêu cầu
- Node.js ≥ 18
- npm
- Các service đã chạy: identity-service (8081), venue-service (8082), booking-service (8083), Eureka (8761)

### Cài đặt & chạy

```bash
cd backend/ai-service
npm install
npm run dev
```

Service chạy tại `http://localhost:8091`

### Test thủ công

```bash
curl "http://localhost:8091/recommendations/venues?userId=<USER_UUID>&city=Hà+Nội&limit=10"
```

---

## Chạy với Docker Compose

```bash
cd backend
docker-compose up --build ai-service
```

Service đăng ký với Eureka, gateway tự động route:
- External: `http://localhost:8080/recommendations/venues?userId=...&city=...`

---

## Mở rộng

- Thêm yếu tố `UserAvailability` — ưu tiên venue có slot trống lúc user rảnh
- Thêm `community post` — gợi ý venue mà nhóm bạn thường chơi
- A/B testing trọng số — đo click-through rate
- Kết hợp chatbot — Gemini tự động gọi endpoint khi user hỏi "gợi sân phù hợp"

---

## Tác giả
SmashMate Team
