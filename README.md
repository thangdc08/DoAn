# Badminton Platform (Hệ thống quản lý đặt sân cầu lông)

Dự án Microservices quản lý đặt sân và kết nối cộng đồng người chơi cầu lông.

## Cấu trúc dự án

- `backend/`: Chứa các dịch vụ Spring Boot 3.3.0 (Java 21).
  - `api-gateway`: Cổng kết nối chính (Port 8080).
  - `identity-service`: Quản lý người dùng, phân quyền (Port 8081).
  - `venue-service`: Quản lý sân bãi, bản đồ PostGIS (Port 8082).
  - `booking-service`: Quản lý đặt sân, lịch trình (Port 8083).
  - `payment-service`: Quản lý thanh toán (Port 8084).
  - `community-service`: Newfeed, kèo giao lưu (Port 8085).
  - `notification-service`: Thông báo MongoDB (Port 8086).
  - `recommendation-service`: Gợi ý thông minh (Port 8087).
- `frontend/`: Ứng dụng React + Vite + TypeScript + Ant Design + Tailwind CSS.
- `infrastructure/`: Cấu hình Docker Compose cho hạ tầng (DBs, Kafka, Redis).

## Yêu cầu hệ thống

- Java 21
- Node.js (v18+)
- Docker & Docker Compose
- Maven 3.9+

## Hướng dẫn chạy nhanh (Local)

### 1. Khởi chạy hạ tầng (Databases, Kafka, Redis)
```bash
cd infrastructure
docker-compose up -d
```

### 2. Chạy Backend
Mở từng thư mục trong `backend/` và chạy lệnh:
```bash
mvn spring-boot:run
```
*(Hoặc mở project parent trong IntelliJ/Eclipse và chạy các service)*

### 3. Chạy Frontend
```bash
cd frontend
npm install
npm run dev
```

## Tài liệu API (Swagger)
Mỗi dịch vụ (trừ Gateway) đều có Swagger UI tại:
`http://localhost:<PORT>/swagger-ui.html`

Ví dụ:
- Identity Service: `http://localhost:8081/swagger-ui.html`
- Venue Service: `http://localhost:8082/swagger-ui.html`

## Kafka UI
Quản lý Kafka tại: `http://localhost:8090`
