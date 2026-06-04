# 🔑 Hướng Dẫn Tài Khoản Thử Nghiệm & Quản Trị (SmashMate Admin)

Tài liệu này chứa thông tin các tài khoản thử nghiệm của hệ thống để chạy kiểm thử tính năng và quản trị hệ thống.

---

## 🛡️ 1. Tài Khoản Quản Trị Hệ Thống (System Admin)

Tài khoản này được khởi tạo tự động thông qua cơ chế tự động tạo dữ liệu mẫu (`DataSeeder`) của `identity-service` khi khởi chạy dự án.

*   **Email:** `admin@badmintonhub.local`
*   **Mật khẩu:** `admin123`
*   **Vai trò (Role):** `ADMIN`
*   **Tính năng sử dụng:** 
    *   Quản lý danh sách người dùng hệ thống.
    *   Xem xét và phê duyệt các sân cầu lông mới đăng ký từ chủ sân.
    *   Khóa/mở khóa tài khoản người dùng vi phạm.
    *   Quản lý tất cả các lượt đặt sân và giao dịch thanh toán.

> [!NOTE]  
> Nếu tài khoản này đã tồn tại trong database nhưng mật khẩu bị thay đổi hoặc không thể đăng nhập, bạn chỉ cần khởi động lại dịch vụ `identity-service`. Cơ chế `DataSeeder` sẽ tự động phát hiện và khôi phục mật khẩu mặc định thành `admin123` cùng vai trò `ADMIN`.

---

## 🏟️ 2. Các Tài Khoản Mặc Định Khác (Để Test Luồng)

Hệ thống có các tài khoản mặc định được định cấu hình sẵn trong tài liệu triển khai:

### Chủ Sân (Venue Owner)
*   **Email:** `owner@badminton.com` *(hoặc tự đăng ký trên giao diện /register-owner)*
*   **Mật khẩu:** `Owner@123`
*   **Vai trò:** `OWNER`
*   **Tính năng:** Đăng ký sân bãi, thiết lập ca giờ, bảng giá, xem doanh thu và lịch đặt sân của khách.

### Khách Hàng (Customer)
*   **Email:** `user@badminton.com` *(hoặc tự đăng ký trên giao diện /register)*
*   **Mật khẩu:** `User@123`
*   **Vai trò:** `USER`
*   **Tính năng:** Tìm kiếm sân gần đây, xem chi tiết sân bãi, đặt sân thanh toán, tạo/tham gia các kèo giao lưu trên bản đồ PostGIS, đánh giá xếp hạng sân bãi/người chơi.

---

## 💾 3. Thông Tin Kết Nối Hạ Tầng (Database & Service Credentials)

### PostgreSQL (badminton_db)
*   **Host:** `localhost`
*   **Port:** `5432`
*   **Username:** `admin`
*   **Password:** `adminpassword`
*   **Schemas:** `identity`, `venue`, `booking`, `payment`, `community`

### MongoDB (notification_db, recommendation_db)
*   **Connection URI:** `mongodb://localhost:27017`

### Redis
*   **Connection:** `localhost:6379` (Không có mật khẩu ở môi trường dev)

### Apache Kafka (Event Bus)
*   **Bootstrap Server:** `localhost:9094`
