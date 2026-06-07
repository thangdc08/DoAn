-- Auto-generated seed data script
-- Created At: 2026-06-06T19:53:40.174Z

BEGIN;

-- 1. Truncate all tables in all schemas
TRUNCATE TABLE identity.user_roles CASCADE;
TRUNCATE TABLE identity.users CASCADE;
TRUNCATE TABLE identity.roles CASCADE;

TRUNCATE TABLE venue.price_rules CASCADE;
TRUNCATE TABLE venue.venue_utilities CASCADE;
TRUNCATE TABLE venue.venue_images CASCADE;
TRUNCATE TABLE venue.venue_ratings CASCADE;
TRUNCATE TABLE venue.courts CASCADE;
TRUNCATE TABLE venue.venues CASCADE;

TRUNCATE TABLE booking.booking_items CASCADE;
TRUNCATE TABLE booking.bookings CASCADE;
TRUNCATE TABLE booking.slot_locks CASCADE;

TRUNCATE TABLE payment.payment_transactions CASCADE;
TRUNCATE TABLE payment.owner_wallets CASCADE;
TRUNCATE TABLE payment.payout_requests CASCADE;

TRUNCATE TABLE community.match_post_levels CASCADE;
TRUNCATE TABLE community.participants CASCADE;
TRUNCATE TABLE community.player_ratings CASCADE;
TRUNCATE TABLE community.match_comments CASCADE;
TRUNCATE TABLE community.match_posts CASCADE;

-- 2. Seed Roles
INSERT INTO identity.roles (id, code, name) VALUES
(1, 'ADMIN', 'System Administrator'),
(2, 'USER', 'Regular User'),
(3, 'OWNER', 'Venue Owner');

-- 3. Seed Users
-- Passwords are all 'password123' (hash: $2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq)
-- Admin
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('11111111-1111-1111-1111-111111111111', 'admin@badmintonhub.local', '0999999999', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'SmashMate Admin', 'https://api.dicebear.com/7.x/bottts/svg?seed=admin', 'OTHER', 'ADVANCED', 'Maintain the platform', 'Platform administrator and moderator.', 5.0, 1, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES
('11111111-1111-1111-1111-111111111111', 1);

INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('22222222-2222-2222-2222-000000000001', 'owner1@badminton.com', '0981235080', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Phan Tuấn Vy', 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner1', 'MALE', 'INTERMEDIATE', 'Quản lý sân cầu lông chuyên nghiệp', 'Chủ sân cầu lông tại Hà Nội nhiệt tình, chào đón mọi tay vợt.', 4.2, 8, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('22222222-2222-2222-2222-000000000001', 3);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('22222222-2222-2222-2222-000000000002', 'owner2@badminton.com', '0983717026', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Bùi Minh Linh', 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner2', 'FEMALE', 'INTERMEDIATE', 'Quản lý sân cầu lông chuyên nghiệp', 'Chủ sân cầu lông tại Hà Nội nhiệt tình, chào đón mọi tay vợt.', 4.8, 10, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('22222222-2222-2222-2222-000000000002', 3);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('22222222-2222-2222-2222-000000000003', 'owner3@badminton.com', '0984757726', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Ngô Thị Anh', 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner3', 'FEMALE', 'INTERMEDIATE', 'Quản lý sân cầu lông chuyên nghiệp', 'Chủ sân cầu lông tại Hà Nội nhiệt tình, chào đón mọi tay vợt.', 5.0, 16, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('22222222-2222-2222-2222-000000000003', 3);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('22222222-2222-2222-2222-000000000004', 'owner4@badminton.com', '0982522663', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Vũ Thành Nam', 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner4', 'MALE', 'INTERMEDIATE', 'Quản lý sân cầu lông chuyên nghiệp', 'Chủ sân cầu lông tại Hà Nội nhiệt tình, chào đón mọi tay vợt.', 4.8, 7, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('22222222-2222-2222-2222-000000000004', 3);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('22222222-2222-2222-2222-000000000005', 'owner5@badminton.com', '0989709928', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Vũ Minh Phúc', 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner5', 'FEMALE', 'INTERMEDIATE', 'Quản lý sân cầu lông chuyên nghiệp', 'Chủ sân cầu lông tại Hà Nội nhiệt tình, chào đón mọi tay vợt.', 4.4, 4, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('22222222-2222-2222-2222-000000000005', 3);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('22222222-2222-2222-2222-000000000006', 'owner6@badminton.com', '0981446550', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Đỗ Anh Nam', 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner6', 'FEMALE', 'INTERMEDIATE', 'Quản lý sân cầu lông chuyên nghiệp', 'Chủ sân cầu lông tại Hà Nội nhiệt tình, chào đón mọi tay vợt.', 4.2, 9, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('22222222-2222-2222-2222-000000000006', 3);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('22222222-2222-2222-2222-000000000007', 'owner7@badminton.com', '0985491424', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Phạm Thị Cường', 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner7', 'FEMALE', 'INTERMEDIATE', 'Quản lý sân cầu lông chuyên nghiệp', 'Chủ sân cầu lông tại Hà Nội nhiệt tình, chào đón mọi tay vợt.', 4.1, 11, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('22222222-2222-2222-2222-000000000007', 3);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('22222222-2222-2222-2222-000000000008', 'owner8@badminton.com', '0981152590', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Lê Tuấn Anh', 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner8', 'FEMALE', 'INTERMEDIATE', 'Quản lý sân cầu lông chuyên nghiệp', 'Chủ sân cầu lông tại Hà Nội nhiệt tình, chào đón mọi tay vợt.', 4.8, 16, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('22222222-2222-2222-2222-000000000008', 3);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('22222222-2222-2222-2222-000000000009', 'owner9@badminton.com', '0984926605', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Ngô Hữu Cường', 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner9', 'MALE', 'INTERMEDIATE', 'Quản lý sân cầu lông chuyên nghiệp', 'Chủ sân cầu lông tại Hà Nội nhiệt tình, chào đón mọi tay vợt.', 4.6, 16, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('22222222-2222-2222-2222-000000000009', 3);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('22222222-2222-2222-2222-000000000010', 'owner10@badminton.com', '0981606324', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Đỗ Hữu Trang', 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner10', 'MALE', 'INTERMEDIATE', 'Quản lý sân cầu lông chuyên nghiệp', 'Chủ sân cầu lông tại Hà Nội nhiệt tình, chào đón mọi tay vợt.', 4.9, 15, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('22222222-2222-2222-2222-000000000010', 3);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('22222222-2222-2222-2222-000000000011', 'owner11@badminton.com', '0981961836', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Lê Anh Duy', 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner11', 'MALE', 'INTERMEDIATE', 'Quản lý sân cầu lông chuyên nghiệp', 'Chủ sân cầu lông tại Hà Nội nhiệt tình, chào đón mọi tay vợt.', 4.5, 21, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('22222222-2222-2222-2222-000000000011', 3);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('22222222-2222-2222-2222-000000000012', 'owner12@badminton.com', '0983304592', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Hồ Đức Trang', 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner12', 'FEMALE', 'INTERMEDIATE', 'Quản lý sân cầu lông chuyên nghiệp', 'Chủ sân cầu lông tại Hà Nội nhiệt tình, chào đón mọi tay vợt.', 4.7, 10, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('22222222-2222-2222-2222-000000000012', 3);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('22222222-2222-2222-2222-000000000013', 'owner13@badminton.com', '0983631243', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Đặng Văn Phúc', 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner13', 'MALE', 'INTERMEDIATE', 'Quản lý sân cầu lông chuyên nghiệp', 'Chủ sân cầu lông tại Hà Nội nhiệt tình, chào đón mọi tay vợt.', 4.5, 5, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('22222222-2222-2222-2222-000000000013', 3);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('22222222-2222-2222-2222-000000000014', 'owner14@badminton.com', '0984225502', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Ngô Khánh Tuấn', 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner14', 'MALE', 'INTERMEDIATE', 'Quản lý sân cầu lông chuyên nghiệp', 'Chủ sân cầu lông tại Hà Nội nhiệt tình, chào đón mọi tay vợt.', 4.6, 17, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('22222222-2222-2222-2222-000000000014', 3);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('22222222-2222-2222-2222-000000000015', 'owner15@badminton.com', '0981333414', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Đỗ Ngọc Giang', 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner15', 'MALE', 'INTERMEDIATE', 'Quản lý sân cầu lông chuyên nghiệp', 'Chủ sân cầu lông tại Hà Nội nhiệt tình, chào đón mọi tay vợt.', 4.5, 8, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('22222222-2222-2222-2222-000000000015', 3);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('22222222-2222-2222-2222-000000000016', 'owner16@badminton.com', '0982785126', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Trần Hoàng Tuấn', 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner16', 'FEMALE', 'INTERMEDIATE', 'Quản lý sân cầu lông chuyên nghiệp', 'Chủ sân cầu lông tại Hà Nội nhiệt tình, chào đón mọi tay vợt.', 4.1, 10, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('22222222-2222-2222-2222-000000000016', 3);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('22222222-2222-2222-2222-000000000017', 'owner17@badminton.com', '0989682104', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Trần Tuấn Hùng', 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner17', 'FEMALE', 'INTERMEDIATE', 'Quản lý sân cầu lông chuyên nghiệp', 'Chủ sân cầu lông tại Hà Nội nhiệt tình, chào đón mọi tay vợt.', 4.6, 16, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('22222222-2222-2222-2222-000000000017', 3);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('22222222-2222-2222-2222-000000000018', 'owner18@badminton.com', '0985287180', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Hoàng Khánh Trang', 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner18', 'MALE', 'INTERMEDIATE', 'Quản lý sân cầu lông chuyên nghiệp', 'Chủ sân cầu lông tại Hà Nội nhiệt tình, chào đón mọi tay vợt.', 4.8, 13, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('22222222-2222-2222-2222-000000000018', 3);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('22222222-2222-2222-2222-000000000019', 'owner19@badminton.com', '0982029143', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Phan Minh Nam', 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner19', 'MALE', 'INTERMEDIATE', 'Quản lý sân cầu lông chuyên nghiệp', 'Chủ sân cầu lông tại Hà Nội nhiệt tình, chào đón mọi tay vợt.', 4.4, 15, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('22222222-2222-2222-2222-000000000019', 3);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('22222222-2222-2222-2222-000000000020', 'owner20@badminton.com', '0987124803', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Phan Hữu Tuấn', 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner20', 'FEMALE', 'INTERMEDIATE', 'Quản lý sân cầu lông chuyên nghiệp', 'Chủ sân cầu lông tại Hà Nội nhiệt tình, chào đón mọi tay vợt.', 4.6, 4, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('22222222-2222-2222-2222-000000000020', 3);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('22222222-2222-2222-2222-000000000021', 'owner21@badminton.com', '0989090498', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Lê Ngọc Khánh', 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner21', 'FEMALE', 'INTERMEDIATE', 'Quản lý sân cầu lông chuyên nghiệp', 'Chủ sân cầu lông tại Hà Nội nhiệt tình, chào đón mọi tay vợt.', 4.0, 12, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('22222222-2222-2222-2222-000000000021', 3);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('22222222-2222-2222-2222-000000000022', 'owner22@badminton.com', '0981828754', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Đặng Anh Duy', 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner22', 'MALE', 'INTERMEDIATE', 'Quản lý sân cầu lông chuyên nghiệp', 'Chủ sân cầu lông tại Hà Nội nhiệt tình, chào đón mọi tay vợt.', 4.7, 18, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('22222222-2222-2222-2222-000000000022', 3);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('22222222-2222-2222-2222-000000000023', 'owner23@badminton.com', '0983228283', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Đỗ Văn Hải', 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner23', 'MALE', 'INTERMEDIATE', 'Quản lý sân cầu lông chuyên nghiệp', 'Chủ sân cầu lông tại Hà Nội nhiệt tình, chào đón mọi tay vợt.', 4.7, 15, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('22222222-2222-2222-2222-000000000023', 3);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('22222222-2222-2222-2222-000000000024', 'owner24@badminton.com', '0986514290', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Đỗ Thị Trang', 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner24', 'FEMALE', 'INTERMEDIATE', 'Quản lý sân cầu lông chuyên nghiệp', 'Chủ sân cầu lông tại Hà Nội nhiệt tình, chào đón mọi tay vợt.', 4.1, 12, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('22222222-2222-2222-2222-000000000024', 3);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('22222222-2222-2222-2222-000000000025', 'owner25@badminton.com', '0986961555', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Bùi Hữu Nam', 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner25', 'MALE', 'INTERMEDIATE', 'Quản lý sân cầu lông chuyên nghiệp', 'Chủ sân cầu lông tại Hà Nội nhiệt tình, chào đón mọi tay vợt.', 4.3, 7, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('22222222-2222-2222-2222-000000000025', 3);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('22222222-2222-2222-2222-000000000026', 'owner26@badminton.com', '0989722961', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Bùi Đức Anh', 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner26', 'MALE', 'INTERMEDIATE', 'Quản lý sân cầu lông chuyên nghiệp', 'Chủ sân cầu lông tại Hà Nội nhiệt tình, chào đón mọi tay vợt.', 4.5, 10, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('22222222-2222-2222-2222-000000000026', 3);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('22222222-2222-2222-2222-000000000027', 'owner27@badminton.com', '0982466485', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Đặng Hoàng Sơn', 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner27', 'FEMALE', 'INTERMEDIATE', 'Quản lý sân cầu lông chuyên nghiệp', 'Chủ sân cầu lông tại Hà Nội nhiệt tình, chào đón mọi tay vợt.', 4.9, 6, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('22222222-2222-2222-2222-000000000027', 3);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('22222222-2222-2222-2222-000000000028', 'owner28@badminton.com', '0987257481', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Trần Khánh Giang', 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner28', 'MALE', 'INTERMEDIATE', 'Quản lý sân cầu lông chuyên nghiệp', 'Chủ sân cầu lông tại Hà Nội nhiệt tình, chào đón mọi tay vợt.', 4.6, 20, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('22222222-2222-2222-2222-000000000028', 3);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('22222222-2222-2222-2222-000000000029', 'owner29@badminton.com', '0988855456', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Vũ Tuấn Vy', 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner29', 'FEMALE', 'INTERMEDIATE', 'Quản lý sân cầu lông chuyên nghiệp', 'Chủ sân cầu lông tại Hà Nội nhiệt tình, chào đón mọi tay vợt.', 5.0, 18, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('22222222-2222-2222-2222-000000000029', 3);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('22222222-2222-2222-2222-000000000030', 'owner30@badminton.com', '0985788000', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Nguyễn Hoàng Anh', 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner30', 'MALE', 'INTERMEDIATE', 'Quản lý sân cầu lông chuyên nghiệp', 'Chủ sân cầu lông tại Hà Nội nhiệt tình, chào đón mọi tay vợt.', 5.0, 21, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('22222222-2222-2222-2222-000000000030', 3);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('22222222-2222-2222-2222-000000000031', 'owner31@badminton.com', '0988275342', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Nguyễn Thành Vy', 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner31', 'MALE', 'INTERMEDIATE', 'Quản lý sân cầu lông chuyên nghiệp', 'Chủ sân cầu lông tại Hà Nội nhiệt tình, chào đón mọi tay vợt.', 4.1, 8, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('22222222-2222-2222-2222-000000000031', 3);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('22222222-2222-2222-2222-000000000032', 'owner32@badminton.com', '0984155693', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Lê Anh Anh', 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner32', 'MALE', 'INTERMEDIATE', 'Quản lý sân cầu lông chuyên nghiệp', 'Chủ sân cầu lông tại Hà Nội nhiệt tình, chào đón mọi tay vợt.', 4.3, 4, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('22222222-2222-2222-2222-000000000032', 3);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('22222222-2222-2222-2222-000000000033', 'owner33@badminton.com', '0981213523', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Phạm Anh Khánh', 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner33', 'MALE', 'INTERMEDIATE', 'Quản lý sân cầu lông chuyên nghiệp', 'Chủ sân cầu lông tại Hà Nội nhiệt tình, chào đón mọi tay vợt.', 4.9, 12, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('22222222-2222-2222-2222-000000000033', 3);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('22222222-2222-2222-2222-000000000034', 'owner34@badminton.com', '0987339756', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Lê Thành Bình', 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner34', 'MALE', 'INTERMEDIATE', 'Quản lý sân cầu lông chuyên nghiệp', 'Chủ sân cầu lông tại Hà Nội nhiệt tình, chào đón mọi tay vợt.', 4.8, 11, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('22222222-2222-2222-2222-000000000034', 3);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('22222222-2222-2222-2222-000000000035', 'owner35@badminton.com', '0985780686', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Phan Thị Trang', 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner35', 'FEMALE', 'INTERMEDIATE', 'Quản lý sân cầu lông chuyên nghiệp', 'Chủ sân cầu lông tại Hà Nội nhiệt tình, chào đón mọi tay vợt.', 4.7, 21, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('22222222-2222-2222-2222-000000000035', 3);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('22222222-2222-2222-2222-000000000036', 'owner36@badminton.com', '0985709882', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Đặng Anh Cường', 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner36', 'MALE', 'INTERMEDIATE', 'Quản lý sân cầu lông chuyên nghiệp', 'Chủ sân cầu lông tại Hà Nội nhiệt tình, chào đón mọi tay vợt.', 4.9, 8, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('22222222-2222-2222-2222-000000000036', 3);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('22222222-2222-2222-2222-000000000037', 'owner37@badminton.com', '0984150935', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Ngô Minh Hương', 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner37', 'MALE', 'INTERMEDIATE', 'Quản lý sân cầu lông chuyên nghiệp', 'Chủ sân cầu lông tại Hà Nội nhiệt tình, chào đón mọi tay vợt.', 4.5, 10, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('22222222-2222-2222-2222-000000000037', 3);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('22222222-2222-2222-2222-000000000038', 'owner38@badminton.com', '0988649203', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Phan Hoàng Duy', 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner38', 'MALE', 'INTERMEDIATE', 'Quản lý sân cầu lông chuyên nghiệp', 'Chủ sân cầu lông tại Hà Nội nhiệt tình, chào đón mọi tay vợt.', 4.1, 9, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('22222222-2222-2222-2222-000000000038', 3);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('22222222-2222-2222-2222-000000000039', 'owner39@badminton.com', '0983391958', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Hồ Tuấn Hùng', 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner39', 'MALE', 'INTERMEDIATE', 'Quản lý sân cầu lông chuyên nghiệp', 'Chủ sân cầu lông tại Hà Nội nhiệt tình, chào đón mọi tay vợt.', 4.2, 20, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('22222222-2222-2222-2222-000000000039', 3);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('22222222-2222-2222-2222-000000000040', 'owner40@badminton.com', '0985651674', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Hoàng Văn Linh', 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner40', 'MALE', 'INTERMEDIATE', 'Quản lý sân cầu lông chuyên nghiệp', 'Chủ sân cầu lông tại Hà Nội nhiệt tình, chào đón mọi tay vợt.', 4.2, 5, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('22222222-2222-2222-2222-000000000040', 3);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('22222222-2222-2222-2222-000000000041', 'owner41@badminton.com', '0985337732', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Phạm Hữu Hương', 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner41', 'FEMALE', 'INTERMEDIATE', 'Quản lý sân cầu lông chuyên nghiệp', 'Chủ sân cầu lông tại Hà Nội nhiệt tình, chào đón mọi tay vợt.', 4.3, 4, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('22222222-2222-2222-2222-000000000041', 3);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('22222222-2222-2222-2222-000000000042', 'owner42@badminton.com', '0982011240', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Lê Tuấn Linh', 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner42', 'MALE', 'INTERMEDIATE', 'Quản lý sân cầu lông chuyên nghiệp', 'Chủ sân cầu lông tại Hà Nội nhiệt tình, chào đón mọi tay vợt.', 4.7, 5, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('22222222-2222-2222-2222-000000000042', 3);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('22222222-2222-2222-2222-000000000043', 'owner43@badminton.com', '0984603810', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Phạm Ngọc Tuấn', 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner43', 'MALE', 'INTERMEDIATE', 'Quản lý sân cầu lông chuyên nghiệp', 'Chủ sân cầu lông tại Hà Nội nhiệt tình, chào đón mọi tay vợt.', 4.1, 18, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('22222222-2222-2222-2222-000000000043', 3);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('22222222-2222-2222-2222-000000000044', 'owner44@badminton.com', '0986372663', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Hồ Thành Sơn', 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner44', 'FEMALE', 'INTERMEDIATE', 'Quản lý sân cầu lông chuyên nghiệp', 'Chủ sân cầu lông tại Hà Nội nhiệt tình, chào đón mọi tay vợt.', 4.5, 19, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('22222222-2222-2222-2222-000000000044', 3);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('22222222-2222-2222-2222-000000000045', 'owner45@badminton.com', '0989937284', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Trần Thành Cường', 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner45', 'MALE', 'INTERMEDIATE', 'Quản lý sân cầu lông chuyên nghiệp', 'Chủ sân cầu lông tại Hà Nội nhiệt tình, chào đón mọi tay vợt.', 4.8, 9, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('22222222-2222-2222-2222-000000000045', 3);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('22222222-2222-2222-2222-000000000046', 'owner46@badminton.com', '0983679775', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Phan Minh Vy', 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner46', 'MALE', 'INTERMEDIATE', 'Quản lý sân cầu lông chuyên nghiệp', 'Chủ sân cầu lông tại Hà Nội nhiệt tình, chào đón mọi tay vợt.', 4.7, 6, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('22222222-2222-2222-2222-000000000046', 3);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('22222222-2222-2222-2222-000000000047', 'owner47@badminton.com', '0987190351', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Vũ Minh Nam', 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner47', 'MALE', 'INTERMEDIATE', 'Quản lý sân cầu lông chuyên nghiệp', 'Chủ sân cầu lông tại Hà Nội nhiệt tình, chào đón mọi tay vợt.', 4.4, 12, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('22222222-2222-2222-2222-000000000047', 3);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('22222222-2222-2222-2222-000000000048', 'owner48@badminton.com', '0987828330', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Hồ Quốc Bình', 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner48', 'MALE', 'INTERMEDIATE', 'Quản lý sân cầu lông chuyên nghiệp', 'Chủ sân cầu lông tại Hà Nội nhiệt tình, chào đón mọi tay vợt.', 4.8, 4, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('22222222-2222-2222-2222-000000000048', 3);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('22222222-2222-2222-2222-000000000049', 'owner49@badminton.com', '0985168557', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Phan Ngọc Phúc', 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner49', 'MALE', 'INTERMEDIATE', 'Quản lý sân cầu lông chuyên nghiệp', 'Chủ sân cầu lông tại Hà Nội nhiệt tình, chào đón mọi tay vợt.', 4.3, 5, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('22222222-2222-2222-2222-000000000049', 3);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('22222222-2222-2222-2222-000000000050', 'owner50@badminton.com', '0981246031', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Bùi Đức Linh', 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner50', 'MALE', 'INTERMEDIATE', 'Quản lý sân cầu lông chuyên nghiệp', 'Chủ sân cầu lông tại Hà Nội nhiệt tình, chào đón mọi tay vợt.', 4.4, 2, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('22222222-2222-2222-2222-000000000050', 3);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('33333333-3333-3333-3333-000000000001', 'player1@badminton.com', '0916563391', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Lê Quốc Trang', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player1', 'MALE', 'INTERMEDIATE', 'Nâng cao trình độ và kết bạn', 'Đam mê cầu lông phong trào, muốn tìm nhóm chơi giao lưu hàng tuần.', 4.5, 10, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('33333333-3333-3333-3333-000000000001', 2);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('33333333-3333-3333-3333-000000000002', 'player2@badminton.com', '0918233978', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Trần Minh Bình', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player2', 'FEMALE', 'BEGINNER', 'Nâng cao trình độ và kết bạn', 'Đam mê cầu lông phong trào, muốn tìm nhóm chơi giao lưu hàng tuần.', 4.3, 10, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('33333333-3333-3333-3333-000000000002', 2);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('33333333-3333-3333-3333-000000000003', 'player3@badminton.com', '0911181884', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Trần Minh Hùng', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player3', 'MALE', 'INTERMEDIATE', 'Nâng cao trình độ và kết bạn', 'Đam mê cầu lông phong trào, muốn tìm nhóm chơi giao lưu hàng tuần.', 4.7, 15, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('33333333-3333-3333-3333-000000000003', 2);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('33333333-3333-3333-3333-000000000004', 'player4@badminton.com', '0916087436', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Ngô Hoàng Linh', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player4', 'MALE', 'ADVANCED', 'Nâng cao trình độ và kết bạn', 'Đam mê cầu lông phong trào, muốn tìm nhóm chơi giao lưu hàng tuần.', 4.3, 1, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('33333333-3333-3333-3333-000000000004', 2);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('33333333-3333-3333-3333-000000000005', 'player5@badminton.com', '0918682840', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Phan Thành Linh', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player5', 'MALE', 'BEGINNER', 'Nâng cao trình độ và kết bạn', 'Đam mê cầu lông phong trào, muốn tìm nhóm chơi giao lưu hàng tuần.', 4.2, 6, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('33333333-3333-3333-3333-000000000005', 2);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('33333333-3333-3333-3333-000000000006', 'player6@badminton.com', '0918563334', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Nguyễn Đức Vy', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player6', 'FEMALE', 'BEGINNER', 'Nâng cao trình độ và kết bạn', 'Đam mê cầu lông phong trào, muốn tìm nhóm chơi giao lưu hàng tuần.', 4.1, 11, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('33333333-3333-3333-3333-000000000006', 2);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('33333333-3333-3333-3333-000000000007', 'player7@badminton.com', '0918965476', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Hoàng Tuấn Duy', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player7', 'MALE', 'BEGINNER', 'Nâng cao trình độ và kết bạn', 'Đam mê cầu lông phong trào, muốn tìm nhóm chơi giao lưu hàng tuần.', 4.3, 6, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('33333333-3333-3333-3333-000000000007', 2);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('33333333-3333-3333-3333-000000000008', 'player8@badminton.com', '0919234718', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Phan Đức Hương', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player8', 'MALE', 'INTERMEDIATE', 'Nâng cao trình độ và kết bạn', 'Đam mê cầu lông phong trào, muốn tìm nhóm chơi giao lưu hàng tuần.', 3.9, 3, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('33333333-3333-3333-3333-000000000008', 2);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('33333333-3333-3333-3333-000000000009', 'player9@badminton.com', '0916972598', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Ngô Thị Giang', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player9', 'FEMALE', 'ADVANCED', 'Nâng cao trình độ và kết bạn', 'Đam mê cầu lông phong trào, muốn tìm nhóm chơi giao lưu hàng tuần.', 4.0, 1, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('33333333-3333-3333-3333-000000000009', 2);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('33333333-3333-3333-3333-000000000010', 'player10@badminton.com', '0917956467', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Hoàng Quốc Bình', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player10', 'MALE', 'INTERMEDIATE', 'Nâng cao trình độ và kết bạn', 'Đam mê cầu lông phong trào, muốn tìm nhóm chơi giao lưu hàng tuần.', 4.1, 13, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('33333333-3333-3333-3333-000000000010', 2);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('33333333-3333-3333-3333-000000000011', 'player11@badminton.com', '0912595394', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Hoàng Thành Bình', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player11', 'FEMALE', 'BEGINNER', 'Nâng cao trình độ và kết bạn', 'Đam mê cầu lông phong trào, muốn tìm nhóm chơi giao lưu hàng tuần.', 5.0, 1, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('33333333-3333-3333-3333-000000000011', 2);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('33333333-3333-3333-3333-000000000012', 'player12@badminton.com', '0916419865', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Trần Minh Sơn', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player12', 'MALE', 'INTERMEDIATE', 'Nâng cao trình độ và kết bạn', 'Đam mê cầu lông phong trào, muốn tìm nhóm chơi giao lưu hàng tuần.', 4.7, 4, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('33333333-3333-3333-3333-000000000012', 2);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('33333333-3333-3333-3333-000000000013', 'player13@badminton.com', '0912711944', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Đỗ Minh Linh', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player13', 'FEMALE', 'INTERMEDIATE', 'Nâng cao trình độ và kết bạn', 'Đam mê cầu lông phong trào, muốn tìm nhóm chơi giao lưu hàng tuần.', 4.6, 9, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('33333333-3333-3333-3333-000000000013', 2);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('33333333-3333-3333-3333-000000000014', 'player14@badminton.com', '0918555644', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Ngô Khánh Giang', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player14', 'FEMALE', 'INTERMEDIATE', 'Nâng cao trình độ và kết bạn', 'Đam mê cầu lông phong trào, muốn tìm nhóm chơi giao lưu hàng tuần.', 4.3, 14, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('33333333-3333-3333-3333-000000000014', 2);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('33333333-3333-3333-3333-000000000015', 'player15@badminton.com', '0912389153', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Phạm Thị Linh', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player15', 'FEMALE', 'BEGINNER', 'Nâng cao trình độ và kết bạn', 'Đam mê cầu lông phong trào, muốn tìm nhóm chơi giao lưu hàng tuần.', 4.4, 3, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('33333333-3333-3333-3333-000000000015', 2);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('33333333-3333-3333-3333-000000000016', 'player16@badminton.com', '0918507030', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Đỗ Văn Hải', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player16', 'MALE', 'INTERMEDIATE', 'Nâng cao trình độ và kết bạn', 'Đam mê cầu lông phong trào, muốn tìm nhóm chơi giao lưu hàng tuần.', 4.8, 11, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('33333333-3333-3333-3333-000000000016', 2);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('33333333-3333-3333-3333-000000000017', 'player17@badminton.com', '0912059642', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Đỗ Ngọc Phúc', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player17', 'MALE', 'INTERMEDIATE', 'Nâng cao trình độ và kết bạn', 'Đam mê cầu lông phong trào, muốn tìm nhóm chơi giao lưu hàng tuần.', 4.5, 8, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('33333333-3333-3333-3333-000000000017', 2);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('33333333-3333-3333-3333-000000000018', 'player18@badminton.com', '0914057194', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Lê Minh Anh', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player18', 'MALE', 'INTERMEDIATE', 'Nâng cao trình độ và kết bạn', 'Đam mê cầu lông phong trào, muốn tìm nhóm chơi giao lưu hàng tuần.', 4.3, 3, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('33333333-3333-3333-3333-000000000018', 2);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('33333333-3333-3333-3333-000000000019', 'player19@badminton.com', '0911263314', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Phan Văn Anh', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player19', 'MALE', 'BEGINNER', 'Nâng cao trình độ và kết bạn', 'Đam mê cầu lông phong trào, muốn tìm nhóm chơi giao lưu hàng tuần.', 4.1, 5, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('33333333-3333-3333-3333-000000000019', 2);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('33333333-3333-3333-3333-000000000020', 'player20@badminton.com', '0916887530', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Nguyễn Văn Vy', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player20', 'MALE', 'BEGINNER', 'Nâng cao trình độ và kết bạn', 'Đam mê cầu lông phong trào, muốn tìm nhóm chơi giao lưu hàng tuần.', 4.8, 5, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('33333333-3333-3333-3333-000000000020', 2);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('33333333-3333-3333-3333-000000000021', 'player21@badminton.com', '0917255267', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Ngô Văn Khánh', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player21', 'MALE', 'INTERMEDIATE', 'Nâng cao trình độ và kết bạn', 'Đam mê cầu lông phong trào, muốn tìm nhóm chơi giao lưu hàng tuần.', 5.0, 5, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('33333333-3333-3333-3333-000000000021', 2);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('33333333-3333-3333-3333-000000000022', 'player22@badminton.com', '0911732183', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Lê Anh Giang', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player22', 'MALE', 'ADVANCED', 'Nâng cao trình độ và kết bạn', 'Đam mê cầu lông phong trào, muốn tìm nhóm chơi giao lưu hàng tuần.', 3.9, 7, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('33333333-3333-3333-3333-000000000022', 2);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('33333333-3333-3333-3333-000000000023', 'player23@badminton.com', '0912230632', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Hoàng Hữu Bình', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player23', 'MALE', 'ADVANCED', 'Nâng cao trình độ và kết bạn', 'Đam mê cầu lông phong trào, muốn tìm nhóm chơi giao lưu hàng tuần.', 3.9, 2, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('33333333-3333-3333-3333-000000000023', 2);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('33333333-3333-3333-3333-000000000024', 'player24@badminton.com', '0916663177', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Lê Tuấn Hương', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player24', 'FEMALE', 'BEGINNER', 'Nâng cao trình độ và kết bạn', 'Đam mê cầu lông phong trào, muốn tìm nhóm chơi giao lưu hàng tuần.', 4.5, 9, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('33333333-3333-3333-3333-000000000024', 2);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('33333333-3333-3333-3333-000000000025', 'player25@badminton.com', '0913154829', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Trần Tuấn Bình', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player25', 'MALE', 'INTERMEDIATE', 'Nâng cao trình độ và kết bạn', 'Đam mê cầu lông phong trào, muốn tìm nhóm chơi giao lưu hàng tuần.', 4.5, 6, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('33333333-3333-3333-3333-000000000025', 2);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('33333333-3333-3333-3333-000000000026', 'player26@badminton.com', '0916733997', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Hoàng Văn Bình', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player26', 'MALE', 'INTERMEDIATE', 'Nâng cao trình độ và kết bạn', 'Đam mê cầu lông phong trào, muốn tìm nhóm chơi giao lưu hàng tuần.', 4.8, 9, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('33333333-3333-3333-3333-000000000026', 2);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('33333333-3333-3333-3333-000000000027', 'player27@badminton.com', '0913520648', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Vũ Tuấn Giang', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player27', 'FEMALE', 'BEGINNER', 'Nâng cao trình độ và kết bạn', 'Đam mê cầu lông phong trào, muốn tìm nhóm chơi giao lưu hàng tuần.', 4.8, 3, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('33333333-3333-3333-3333-000000000027', 2);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('33333333-3333-3333-3333-000000000028', 'player28@badminton.com', '0919181930', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Lê Văn Vy', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player28', 'MALE', 'INTERMEDIATE', 'Nâng cao trình độ và kết bạn', 'Đam mê cầu lông phong trào, muốn tìm nhóm chơi giao lưu hàng tuần.', 4.7, 12, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('33333333-3333-3333-3333-000000000028', 2);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('33333333-3333-3333-3333-000000000029', 'player29@badminton.com', '0915136892', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Vũ Tuấn Khánh', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player29', 'MALE', 'BEGINNER', 'Nâng cao trình độ và kết bạn', 'Đam mê cầu lông phong trào, muốn tìm nhóm chơi giao lưu hàng tuần.', 4.9, 15, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('33333333-3333-3333-3333-000000000029', 2);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('33333333-3333-3333-3333-000000000030', 'player30@badminton.com', '0917092564', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Nguyễn Khánh Bình', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player30', 'FEMALE', 'ADVANCED', 'Nâng cao trình độ và kết bạn', 'Đam mê cầu lông phong trào, muốn tìm nhóm chơi giao lưu hàng tuần.', 4.4, 8, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('33333333-3333-3333-3333-000000000030', 2);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('33333333-3333-3333-3333-000000000031', 'player31@badminton.com', '0914102369', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Ngô Anh Phúc', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player31', 'MALE', 'INTERMEDIATE', 'Nâng cao trình độ và kết bạn', 'Đam mê cầu lông phong trào, muốn tìm nhóm chơi giao lưu hàng tuần.', 4.1, 1, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('33333333-3333-3333-3333-000000000031', 2);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('33333333-3333-3333-3333-000000000032', 'player32@badminton.com', '0911682177', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Phạm Anh Hương', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player32', 'MALE', 'BEGINNER', 'Nâng cao trình độ và kết bạn', 'Đam mê cầu lông phong trào, muốn tìm nhóm chơi giao lưu hàng tuần.', 4.3, 3, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('33333333-3333-3333-3333-000000000032', 2);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('33333333-3333-3333-3333-000000000033', 'player33@badminton.com', '0915027720', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Đặng Minh Tuấn', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player33', 'MALE', 'INTERMEDIATE', 'Nâng cao trình độ và kết bạn', 'Đam mê cầu lông phong trào, muốn tìm nhóm chơi giao lưu hàng tuần.', 4.1, 10, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('33333333-3333-3333-3333-000000000033', 2);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('33333333-3333-3333-3333-000000000034', 'player34@badminton.com', '0917127859', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Hoàng Hữu Giang', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player34', 'MALE', 'INTERMEDIATE', 'Nâng cao trình độ và kết bạn', 'Đam mê cầu lông phong trào, muốn tìm nhóm chơi giao lưu hàng tuần.', 4.0, 9, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('33333333-3333-3333-3333-000000000034', 2);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('33333333-3333-3333-3333-000000000035', 'player35@badminton.com', '0915178877', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Hồ Văn Linh', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player35', 'MALE', 'ADVANCED', 'Nâng cao trình độ và kết bạn', 'Đam mê cầu lông phong trào, muốn tìm nhóm chơi giao lưu hàng tuần.', 3.9, 1, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('33333333-3333-3333-3333-000000000035', 2);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('33333333-3333-3333-3333-000000000036', 'player36@badminton.com', '0914354359', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Hoàng Thị Phúc', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player36', 'FEMALE', 'BEGINNER', 'Nâng cao trình độ và kết bạn', 'Đam mê cầu lông phong trào, muốn tìm nhóm chơi giao lưu hàng tuần.', 4.6, 15, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('33333333-3333-3333-3333-000000000036', 2);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('33333333-3333-3333-3333-000000000037', 'player37@badminton.com', '0914898118', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Bùi Văn Anh', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player37', 'MALE', 'ADVANCED', 'Nâng cao trình độ và kết bạn', 'Đam mê cầu lông phong trào, muốn tìm nhóm chơi giao lưu hàng tuần.', 4.2, 12, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('33333333-3333-3333-3333-000000000037', 2);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('33333333-3333-3333-3333-000000000038', 'player38@badminton.com', '0917209381', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Bùi Anh Anh', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player38', 'FEMALE', 'INTERMEDIATE', 'Nâng cao trình độ và kết bạn', 'Đam mê cầu lông phong trào, muốn tìm nhóm chơi giao lưu hàng tuần.', 5.0, 2, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('33333333-3333-3333-3333-000000000038', 2);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('33333333-3333-3333-3333-000000000039', 'player39@badminton.com', '0914642889', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Lê Ngọc Trang', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player39', 'MALE', 'ADVANCED', 'Nâng cao trình độ và kết bạn', 'Đam mê cầu lông phong trào, muốn tìm nhóm chơi giao lưu hàng tuần.', 3.8, 14, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('33333333-3333-3333-3333-000000000039', 2);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('33333333-3333-3333-3333-000000000040', 'player40@badminton.com', '0919245395', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Nguyễn Quốc Trang', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player40', 'FEMALE', 'BEGINNER', 'Nâng cao trình độ và kết bạn', 'Đam mê cầu lông phong trào, muốn tìm nhóm chơi giao lưu hàng tuần.', 4.2, 10, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('33333333-3333-3333-3333-000000000040', 2);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('33333333-3333-3333-3333-000000000041', 'player41@badminton.com', '0911105808', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Hồ Khánh Cường', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player41', 'MALE', 'BEGINNER', 'Nâng cao trình độ và kết bạn', 'Đam mê cầu lông phong trào, muốn tìm nhóm chơi giao lưu hàng tuần.', 4.0, 3, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('33333333-3333-3333-3333-000000000041', 2);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('33333333-3333-3333-3333-000000000042', 'player42@badminton.com', '0917660469', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Phan Văn Vy', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player42', 'MALE', 'ADVANCED', 'Nâng cao trình độ và kết bạn', 'Đam mê cầu lông phong trào, muốn tìm nhóm chơi giao lưu hàng tuần.', 4.7, 10, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('33333333-3333-3333-3333-000000000042', 2);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('33333333-3333-3333-3333-000000000043', 'player43@badminton.com', '0916424103', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Phan Hoàng Khánh', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player43', 'FEMALE', 'ADVANCED', 'Nâng cao trình độ và kết bạn', 'Đam mê cầu lông phong trào, muốn tìm nhóm chơi giao lưu hàng tuần.', 4.3, 10, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('33333333-3333-3333-3333-000000000043', 2);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('33333333-3333-3333-3333-000000000044', 'player44@badminton.com', '0915081106', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Hoàng Khánh Hùng', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player44', 'FEMALE', 'INTERMEDIATE', 'Nâng cao trình độ và kết bạn', 'Đam mê cầu lông phong trào, muốn tìm nhóm chơi giao lưu hàng tuần.', 4.8, 8, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('33333333-3333-3333-3333-000000000044', 2);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('33333333-3333-3333-3333-000000000045', 'player45@badminton.com', '0919793740', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Ngô Minh Duy', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player45', 'MALE', 'INTERMEDIATE', 'Nâng cao trình độ và kết bạn', 'Đam mê cầu lông phong trào, muốn tìm nhóm chơi giao lưu hàng tuần.', 4.7, 9, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('33333333-3333-3333-3333-000000000045', 2);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('33333333-3333-3333-3333-000000000046', 'player46@badminton.com', '0911337927', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Đặng Hoàng Phúc', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player46', 'MALE', 'INTERMEDIATE', 'Nâng cao trình độ và kết bạn', 'Đam mê cầu lông phong trào, muốn tìm nhóm chơi giao lưu hàng tuần.', 4.8, 7, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('33333333-3333-3333-3333-000000000046', 2);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('33333333-3333-3333-3333-000000000047', 'player47@badminton.com', '0915848644', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Phan Thị Hùng', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player47', 'FEMALE', 'BEGINNER', 'Nâng cao trình độ và kết bạn', 'Đam mê cầu lông phong trào, muốn tìm nhóm chơi giao lưu hàng tuần.', 4.4, 10, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('33333333-3333-3333-3333-000000000047', 2);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('33333333-3333-3333-3333-000000000048', 'player48@badminton.com', '0915453803', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Hồ Văn Tuấn', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player48', 'MALE', 'BEGINNER', 'Nâng cao trình độ và kết bạn', 'Đam mê cầu lông phong trào, muốn tìm nhóm chơi giao lưu hàng tuần.', 3.8, 11, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('33333333-3333-3333-3333-000000000048', 2);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('33333333-3333-3333-3333-000000000049', 'player49@badminton.com', '0919976016', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Hoàng Ngọc Trang', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player49', 'MALE', 'BEGINNER', 'Nâng cao trình độ và kết bạn', 'Đam mê cầu lông phong trào, muốn tìm nhóm chơi giao lưu hàng tuần.', 4.9, 5, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('33333333-3333-3333-3333-000000000049', 2);
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('33333333-3333-3333-3333-000000000050', 'player50@badminton.com', '0917585766', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', 'Phan Hoàng Trang', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player50', 'MALE', 'BEGINNER', 'Nâng cao trình độ và kết bạn', 'Đam mê cầu lông phong trào, muốn tìm nhóm chơi giao lưu hàng tuần.', 3.9, 11, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('33333333-3333-3333-3333-000000000050', 2);
-- 5. Seed 50 Venues
INSERT INTO venue.venues (id, owner_id, name, slug, description, address, city, latitude, longitude, location, phone, status, rating_avg, rating_count, email, open_time, close_time, policy, court_count, created_at, updated_at) VALUES
('44444444-4444-4444-4444-000000000001', '22222222-2222-2222-2222-000000000001', 'Sân cầu lông Đống Đa', 'sn-cu-long-dng-da', 'Hệ thống sân cầu lông Sân cầu lông Đống Đa được trang bị thảm PVC tiêu chuẩn cao cấp, hệ thống đèn led chống lóa chuyên nghiệp, không gian thoáng đãng sạch sẽ.', '75 Đặng Văn Ngữ, Đống Đa, Hà Nội', 'Hà Nội', 21.012, 105.828, ST_SetSRID(ST_MakePoint(105.828, 21.012), 4326)::geography, '0242765021', 'APPROVED', 4.2, 21, 'sn-cu-long-dng-@gmail.com', '05:00:00', '22:00:00', 'Huỷ sân trước 24h được hoàn tiền 100%. Huỷ trước 12h hoàn tiền 50%.', 2, NOW(), NOW());
INSERT INTO venue.venues (id, owner_id, name, slug, description, address, city, latitude, longitude, location, phone, status, rating_avg, rating_count, email, open_time, close_time, policy, court_count, created_at, updated_at) VALUES
('44444444-4444-4444-4444-000000000002', '22222222-2222-2222-2222-000000000002', 'Sân cầu lông Cầu Giấy', 'sn-cu-long-cu-giay', 'Hệ thống sân cầu lông Sân cầu lông Cầu Giấy được trang bị thảm PVC tiêu chuẩn cao cấp, hệ thống đèn led chống lóa chuyên nghiệp, không gian thoáng đãng sạch sẽ.', '35 Nguyễn Phong Sắc, Cầu Giấy, Hà Nội', 'Hà Nội', 21.036, 105.79, ST_SetSRID(ST_MakePoint(105.79, 21.036), 4326)::geography, '0245296426', 'APPROVED', 4.4, 20, 'sn-cu-long-cu-g@gmail.com', '05:00:00', '22:00:00', 'Huỷ sân trước 24h được hoàn tiền 100%. Huỷ trước 12h hoàn tiền 50%.', 2, NOW(), NOW());
INSERT INTO venue.venues (id, owner_id, name, slug, description, address, city, latitude, longitude, location, phone, status, rating_avg, rating_count, email, open_time, close_time, policy, court_count, created_at, updated_at) VALUES
('44444444-4444-4444-4444-000000000003', '22222222-2222-2222-2222-000000000003', 'Sân cầu lông Lê Văn Lương', 'sn-cu-long-le-vn-lung', 'Hệ thống sân cầu lông Sân cầu lông Lê Văn Lương được trang bị thảm PVC tiêu chuẩn cao cấp, hệ thống đèn led chống lóa chuyên nghiệp, không gian thoáng đãng sạch sẽ.', '88 Lê Văn Lương, Thanh Xuân, Hà Nội', 'Hà Nội', 21.009, 105.803, ST_SetSRID(ST_MakePoint(105.803, 21.009), 4326)::geography, '0241714183', 'APPROVED', 4.5, 21, 'sn-cu-long-le-v@gmail.com', '05:00:00', '22:00:00', 'Huỷ sân trước 24h được hoàn tiền 100%. Huỷ trước 12h hoàn tiền 50%.', 2, NOW(), NOW());
INSERT INTO venue.venues (id, owner_id, name, slug, description, address, city, latitude, longitude, location, phone, status, rating_avg, rating_count, email, open_time, close_time, policy, court_count, created_at, updated_at) VALUES
('44444444-4444-4444-4444-000000000004', '22222222-2222-2222-2222-000000000004', 'Sân cầu lông Đại học Y', 'sn-cu-long-dai-hc-y', 'Hệ thống sân cầu lông Sân cầu lông Đại học Y được trang bị thảm PVC tiêu chuẩn cao cấp, hệ thống đèn led chống lóa chuyên nghiệp, không gian thoáng đãng sạch sẽ.', '1 Tôn Thất Tùng, Đống Đa, Hà Nội', 'Hà Nội', 21.002, 105.829, ST_SetSRID(ST_MakePoint(105.829, 21.002), 4326)::geography, '0246679356', 'APPROVED', 4.9, 14, 'sn-cu-long-dai-@gmail.com', '05:00:00', '22:00:00', 'Huỷ sân trước 24h được hoàn tiền 100%. Huỷ trước 12h hoàn tiền 50%.', 2, NOW(), NOW());
INSERT INTO venue.venues (id, owner_id, name, slug, description, address, city, latitude, longitude, location, phone, status, rating_avg, rating_count, email, open_time, close_time, policy, court_count, created_at, updated_at) VALUES
('44444444-4444-4444-4444-000000000005', '22222222-2222-2222-2222-000000000005', 'Sân cầu lông Ba Đình', 'sn-cu-long-ba-dnh', 'Hệ thống sân cầu lông Sân cầu lông Ba Đình được trang bị thảm PVC tiêu chuẩn cao cấp, hệ thống đèn led chống lóa chuyên nghiệp, không gian thoáng đãng sạch sẽ.', '115 Hoàng Hoa Thám, Ba Đình, Hà Nội', 'Hà Nội', 21.043, 105.82, ST_SetSRID(ST_MakePoint(105.82, 21.043), 4326)::geography, '0245339278', 'APPROVED', 4.8, 25, 'sn-cu-long-ba-d@gmail.com', '05:00:00', '22:00:00', 'Huỷ sân trước 24h được hoàn tiền 100%. Huỷ trước 12h hoàn tiền 50%.', 2, NOW(), NOW());
INSERT INTO venue.venues (id, owner_id, name, slug, description, address, city, latitude, longitude, location, phone, status, rating_avg, rating_count, email, open_time, close_time, policy, court_count, created_at, updated_at) VALUES
('44444444-4444-4444-4444-000000000006', '22222222-2222-2222-2222-000000000006', 'Sân cầu lông Tây Hồ', 'sn-cu-long-ty-h', 'Hệ thống sân cầu lông Sân cầu lông Tây Hồ được trang bị thảm PVC tiêu chuẩn cao cấp, hệ thống đèn led chống lóa chuyên nghiệp, không gian thoáng đãng sạch sẽ.', '99 Xuân La, Tây Hồ, Hà Nội', 'Hà Nội', 21.066, 105.804, ST_SetSRID(ST_MakePoint(105.804, 21.066), 4326)::geography, '0244459744', 'APPROVED', 4.6, 11, 'sn-cu-long-ty-h@gmail.com', '05:00:00', '22:00:00', 'Huỷ sân trước 24h được hoàn tiền 100%. Huỷ trước 12h hoàn tiền 50%.', 2, NOW(), NOW());
INSERT INTO venue.venues (id, owner_id, name, slug, description, address, city, latitude, longitude, location, phone, status, rating_avg, rating_count, email, open_time, close_time, policy, court_count, created_at, updated_at) VALUES
('44444444-4444-4444-4444-000000000007', '22222222-2222-2222-2222-000000000007', 'Sân cầu lông Hoàn Kiếm', 'sn-cu-long-hon-kim', 'Hệ thống sân cầu lông Sân cầu lông Hoàn Kiếm được trang bị thảm PVC tiêu chuẩn cao cấp, hệ thống đèn led chống lóa chuyên nghiệp, không gian thoáng đãng sạch sẽ.', '2 Hàm Tử Quan, Hoàn Kiếm, Hà Nội', 'Hà Nội', 21.026, 105.859, ST_SetSRID(ST_MakePoint(105.859, 21.026), 4326)::geography, '0243531252', 'APPROVED', 4.5, 17, 'sn-cu-long-hon-@gmail.com', '05:00:00', '22:00:00', 'Huỷ sân trước 24h được hoàn tiền 100%. Huỷ trước 12h hoàn tiền 50%.', 2, NOW(), NOW());
INSERT INTO venue.venues (id, owner_id, name, slug, description, address, city, latitude, longitude, location, phone, status, rating_avg, rating_count, email, open_time, close_time, policy, court_count, created_at, updated_at) VALUES
('44444444-4444-4444-4444-000000000008', '22222222-2222-2222-2222-000000000008', 'Sân cầu lông Hai Bà Trưng', 'sn-cu-long-hai-b-trung', 'Hệ thống sân cầu lông Sân cầu lông Hai Bà Trưng được trang bị thảm PVC tiêu chuẩn cao cấp, hệ thống đèn led chống lóa chuyên nghiệp, không gian thoáng đãng sạch sẽ.', '42 Tạ Quang Bửu, Hai Bà Trưng, Hà Nội', 'Hà Nội', 21.005, 105.848, ST_SetSRID(ST_MakePoint(105.848, 21.005), 4326)::geography, '0245940882', 'APPROVED', 4.9, 4, 'sn-cu-long-hai-@gmail.com', '05:00:00', '22:00:00', 'Huỷ sân trước 24h được hoàn tiền 100%. Huỷ trước 12h hoàn tiền 50%.', 2, NOW(), NOW());
INSERT INTO venue.venues (id, owner_id, name, slug, description, address, city, latitude, longitude, location, phone, status, rating_avg, rating_count, email, open_time, close_time, policy, court_count, created_at, updated_at) VALUES
('44444444-4444-4444-4444-000000000009', '22222222-2222-2222-2222-000000000009', 'Sân cầu lông Thanh Xuân', 'sn-cu-long-thanh-xun', 'Hệ thống sân cầu lông Sân cầu lông Thanh Xuân được trang bị thảm PVC tiêu chuẩn cao cấp, hệ thống đèn led chống lóa chuyên nghiệp, không gian thoáng đãng sạch sẽ.', '15 Nguyễn Quý Đức, Thanh Xuân, Hà Nội', 'Hà Nội', 20.998, 105.799, ST_SetSRID(ST_MakePoint(105.799, 20.998), 4326)::geography, '0245848569', 'APPROVED', 4.9, 14, 'sn-cu-long-than@gmail.com', '05:00:00', '22:00:00', 'Huỷ sân trước 24h được hoàn tiền 100%. Huỷ trước 12h hoàn tiền 50%.', 2, NOW(), NOW());
INSERT INTO venue.venues (id, owner_id, name, slug, description, address, city, latitude, longitude, location, phone, status, rating_avg, rating_count, email, open_time, close_time, policy, court_count, created_at, updated_at) VALUES
('44444444-4444-4444-4444-000000000010', '22222222-2222-2222-2222-000000000010', 'Sân cầu lông Hà Đông', 'sn-cu-long-h-dong', 'Hệ thống sân cầu lông Sân cầu lông Hà Đông được trang bị thảm PVC tiêu chuẩn cao cấp, hệ thống đèn led chống lóa chuyên nghiệp, không gian thoáng đãng sạch sẽ.', '8 Tô Hiệu, Hà Đông, Hà Nội', 'Hà Nội', 20.967, 105.776, ST_SetSRID(ST_MakePoint(105.776, 20.967), 4326)::geography, '0247154677', 'APPROVED', 4.7, 8, 'sn-cu-long-h-do@gmail.com', '05:00:00', '22:00:00', 'Huỷ sân trước 24h được hoàn tiền 100%. Huỷ trước 12h hoàn tiền 50%.', 2, NOW(), NOW());
INSERT INTO venue.venues (id, owner_id, name, slug, description, address, city, latitude, longitude, location, phone, status, rating_avg, rating_count, email, open_time, close_time, policy, court_count, created_at, updated_at) VALUES
('44444444-4444-4444-4444-000000000011', '22222222-2222-2222-2222-000000000011', 'Sân cầu lông Mỹ Đình', 'sn-cu-long-m-dnh', 'Hệ thống sân cầu lông Sân cầu lông Mỹ Đình được trang bị thảm PVC tiêu chuẩn cao cấp, hệ thống đèn led chống lóa chuyên nghiệp, không gian thoáng đãng sạch sẽ.', '5 Trần Hữu Dực, Nam Từ Liêm, Hà Nội', 'Hà Nội', 21.028, 105.764, ST_SetSRID(ST_MakePoint(105.764, 21.028), 4326)::geography, '0249624650', 'APPROVED', 5.0, 15, 'sn-cu-long-m-dn@gmail.com', '05:00:00', '22:00:00', 'Huỷ sân trước 24h được hoàn tiền 100%. Huỷ trước 12h hoàn tiền 50%.', 2, NOW(), NOW());
INSERT INTO venue.venues (id, owner_id, name, slug, description, address, city, latitude, longitude, location, phone, status, rating_avg, rating_count, email, open_time, close_time, policy, court_count, created_at, updated_at) VALUES
('44444444-4444-4444-4444-000000000012', '22222222-2222-2222-2222-000000000012', 'Sân cầu lông Cầu Diễn', 'sn-cu-long-cu-din', 'Hệ thống sân cầu lông Sân cầu lông Cầu Diễn được trang bị thảm PVC tiêu chuẩn cao cấp, hệ thống đèn led chống lóa chuyên nghiệp, không gian thoáng đãng sạch sẽ.', '12 Hồ Tùng Mậu, Bắc Từ Liêm, Hà Nội', 'Hà Nội', 21.039, 105.765, ST_SetSRID(ST_MakePoint(105.765, 21.039), 4326)::geography, '0248837445', 'APPROVED', 4.2, 3, 'sn-cu-long-cu-d@gmail.com', '05:00:00', '22:00:00', 'Huỷ sân trước 24h được hoàn tiền 100%. Huỷ trước 12h hoàn tiền 50%.', 2, NOW(), NOW());
INSERT INTO venue.venues (id, owner_id, name, slug, description, address, city, latitude, longitude, location, phone, status, rating_avg, rating_count, email, open_time, close_time, policy, court_count, created_at, updated_at) VALUES
('44444444-4444-4444-4444-000000000013', '22222222-2222-2222-2222-000000000013', 'Sân cầu lông Bách Khoa', 'sn-cu-long-bach-khoa', 'Hệ thống sân cầu lông Sân cầu lông Bách Khoa được trang bị thảm PVC tiêu chuẩn cao cấp, hệ thống đèn led chống lóa chuyên nghiệp, không gian thoáng đãng sạch sẽ.', '1 Tạ Quang Bửu, Hai Bà Trưng, Hà Nội', 'Hà Nội', 21.004, 105.843, ST_SetSRID(ST_MakePoint(105.843, 21.004), 4326)::geography, '0242596495', 'APPROVED', 4.7, 22, 'sn-cu-long-bach@gmail.com', '05:00:00', '22:00:00', 'Huỷ sân trước 24h được hoàn tiền 100%. Huỷ trước 12h hoàn tiền 50%.', 2, NOW(), NOW());
INSERT INTO venue.venues (id, owner_id, name, slug, description, address, city, latitude, longitude, location, phone, status, rating_avg, rating_count, email, open_time, close_time, policy, court_count, created_at, updated_at) VALUES
('44444444-4444-4444-4444-000000000014', '22222222-2222-2222-2222-000000000014', 'Sân cầu lông Long Biên', 'sn-cu-long-long-bien', 'Hệ thống sân cầu lông Sân cầu lông Long Biên được trang bị thảm PVC tiêu chuẩn cao cấp, hệ thống đèn led chống lóa chuyên nghiệp, không gian thoáng đãng sạch sẽ.', '33 Nguyễn Sơn, Long Biên, Hà Nội', 'Hà Nội', 21.042, 105.882, ST_SetSRID(ST_MakePoint(105.882, 21.042), 4326)::geography, '0245212706', 'APPROVED', 4.7, 19, 'sn-cu-long-long@gmail.com', '05:00:00', '22:00:00', 'Huỷ sân trước 24h được hoàn tiền 100%. Huỷ trước 12h hoàn tiền 50%.', 2, NOW(), NOW());
INSERT INTO venue.venues (id, owner_id, name, slug, description, address, city, latitude, longitude, location, phone, status, rating_avg, rating_count, email, open_time, close_time, policy, court_count, created_at, updated_at) VALUES
('44444444-4444-4444-4444-000000000015', '22222222-2222-2222-2222-000000000015', 'Sân cầu lông Gia Lâm', 'sn-cu-long-gia-lm', 'Hệ thống sân cầu lông Sân cầu lông Gia Lâm được trang bị thảm PVC tiêu chuẩn cao cấp, hệ thống đèn led chống lóa chuyên nghiệp, không gian thoáng đãng sạch sẽ.', '55 Cổ Linh, Long Biên, Hà Nội', 'Hà Nội', 21.018, 105.895, ST_SetSRID(ST_MakePoint(105.895, 21.018), 4326)::geography, '0243897118', 'APPROVED', 4.8, 26, 'sn-cu-long-gia-@gmail.com', '05:00:00', '22:00:00', 'Huỷ sân trước 24h được hoàn tiền 100%. Huỷ trước 12h hoàn tiền 50%.', 2, NOW(), NOW());
INSERT INTO venue.venues (id, owner_id, name, slug, description, address, city, latitude, longitude, location, phone, status, rating_avg, rating_count, email, open_time, close_time, policy, court_count, created_at, updated_at) VALUES
('44444444-4444-4444-4444-000000000016', '22222222-2222-2222-2222-000000000016', 'Sân cầu lông Hoàng Mai', 'sn-cu-long-hong-mai', 'Hệ thống sân cầu lông Sân cầu lông Hoàng Mai được trang bị thảm PVC tiêu chuẩn cao cấp, hệ thống đèn led chống lóa chuyên nghiệp, không gian thoáng đãng sạch sẽ.', '10 Linh Đường, Hoàng Mai, Hà Nội', 'Hà Nội', 20.966, 105.834, ST_SetSRID(ST_MakePoint(105.834, 20.966), 4326)::geography, '0248241969', 'APPROVED', 4.4, 17, 'sn-cu-long-hong@gmail.com', '05:00:00', '22:00:00', 'Huỷ sân trước 24h được hoàn tiền 100%. Huỷ trước 12h hoàn tiền 50%.', 2, NOW(), NOW());
INSERT INTO venue.venues (id, owner_id, name, slug, description, address, city, latitude, longitude, location, phone, status, rating_avg, rating_count, email, open_time, close_time, policy, court_count, created_at, updated_at) VALUES
('44444444-4444-4444-4444-000000000017', '22222222-2222-2222-2222-000000000017', 'Sân cầu lông Linh Đàm', 'sn-cu-long-linh-dm', 'Hệ thống sân cầu lông Sân cầu lông Linh Đàm được trang bị thảm PVC tiêu chuẩn cao cấp, hệ thống đèn led chống lóa chuyên nghiệp, không gian thoáng đãng sạch sẽ.', '22 Nguyễn Hữu Thọ, Hoàng Mai, Hà Nội', 'Hà Nội', 20.969, 105.829, ST_SetSRID(ST_MakePoint(105.829, 20.969), 4326)::geography, '0243797042', 'APPROVED', 4.9, 7, 'sn-cu-long-linh@gmail.com', '05:00:00', '22:00:00', 'Huỷ sân trước 24h được hoàn tiền 100%. Huỷ trước 12h hoàn tiền 50%.', 2, NOW(), NOW());
INSERT INTO venue.venues (id, owner_id, name, slug, description, address, city, latitude, longitude, location, phone, status, rating_avg, rating_count, email, open_time, close_time, policy, court_count, created_at, updated_at) VALUES
('44444444-4444-4444-4444-000000000018', '22222222-2222-2222-2222-000000000018', 'Sân cầu lông Thanh Trì', 'sn-cu-long-thanh-tr', 'Hệ thống sân cầu lông Sân cầu lông Thanh Trì được trang bị thảm PVC tiêu chuẩn cao cấp, hệ thống đèn led chống lóa chuyên nghiệp, không gian thoáng đãng sạch sẽ.', '5 Phan Trọng Tuệ, Thanh Trì, Hà Nội', 'Hà Nội', 20.952, 105.819, ST_SetSRID(ST_MakePoint(105.819, 20.952), 4326)::geography, '0249051146', 'APPROVED', 4.7, 15, 'sn-cu-long-than@gmail.com', '05:00:00', '22:00:00', 'Huỷ sân trước 24h được hoàn tiền 100%. Huỷ trước 12h hoàn tiền 50%.', 2, NOW(), NOW());
INSERT INTO venue.venues (id, owner_id, name, slug, description, address, city, latitude, longitude, location, phone, status, rating_avg, rating_count, email, open_time, close_time, policy, court_count, created_at, updated_at) VALUES
('44444444-4444-4444-4444-000000000019', '22222222-2222-2222-2222-000000000019', 'Sân cầu lông Đông Anh', 'sn-cu-long-dong-anh', 'Hệ thống sân cầu lông Sân cầu lông Đông Anh được trang bị thảm PVC tiêu chuẩn cao cấp, hệ thống đèn led chống lóa chuyên nghiệp, không gian thoáng đãng sạch sẽ.', 'Tổ 5, Thị trấn Đông Anh, Hà Nội', 'Hà Nội', 21.139, 105.845, ST_SetSRID(ST_MakePoint(105.845, 21.139), 4326)::geography, '0245601080', 'APPROVED', 4.3, 21, 'sn-cu-long-dong@gmail.com', '05:00:00', '22:00:00', 'Huỷ sân trước 24h được hoàn tiền 100%. Huỷ trước 12h hoàn tiền 50%.', 2, NOW(), NOW());
INSERT INTO venue.venues (id, owner_id, name, slug, description, address, city, latitude, longitude, location, phone, status, rating_avg, rating_count, email, open_time, close_time, policy, court_count, created_at, updated_at) VALUES
('44444444-4444-4444-4444-000000000020', '22222222-2222-2222-2222-000000000020', 'Sân cầu lông Sóc Sơn', 'sn-cu-long-sc-sn', 'Hệ thống sân cầu lông Sân cầu lông Sóc Sơn được trang bị thảm PVC tiêu chuẩn cao cấp, hệ thống đèn led chống lóa chuyên nghiệp, không gian thoáng đãng sạch sẽ.', 'Khối 3, Thị trấn Sóc Sơn, Hà Nội', 'Hà Nội', 21.258, 105.849, ST_SetSRID(ST_MakePoint(105.849, 21.258), 4326)::geography, '0244180738', 'APPROVED', 4.8, 6, 'sn-cu-long-sc-s@gmail.com', '05:00:00', '22:00:00', 'Huỷ sân trước 24h được hoàn tiền 100%. Huỷ trước 12h hoàn tiền 50%.', 2, NOW(), NOW());
INSERT INTO venue.venues (id, owner_id, name, slug, description, address, city, latitude, longitude, location, phone, status, rating_avg, rating_count, email, open_time, close_time, policy, court_count, created_at, updated_at) VALUES
('44444444-4444-4444-4444-000000000021', '22222222-2222-2222-2222-000000000021', 'Sân cầu lông Hoài Đức', 'sn-cu-long-hoi-dc', 'Hệ thống sân cầu lông Sân cầu lông Hoài Đức được trang bị thảm PVC tiêu chuẩn cao cấp, hệ thống đèn led chống lóa chuyên nghiệp, không gian thoáng đãng sạch sẽ.', 'Khu 6, Thị trấn Trạm Trôi, Hoài Đức, Hà Nội', 'Hà Nội', 21.074, 105.707, ST_SetSRID(ST_MakePoint(105.707, 21.074), 4326)::geography, '0245619320', 'APPROVED', 4.6, 11, 'sn-cu-long-hoi-@gmail.com', '05:00:00', '22:00:00', 'Huỷ sân trước 24h được hoàn tiền 100%. Huỷ trước 12h hoàn tiền 50%.', 2, NOW(), NOW());
INSERT INTO venue.venues (id, owner_id, name, slug, description, address, city, latitude, longitude, location, phone, status, rating_avg, rating_count, email, open_time, close_time, policy, court_count, created_at, updated_at) VALUES
('44444444-4444-4444-4444-000000000022', '22222222-2222-2222-2222-000000000022', 'Sân cầu lông Đan Phượng', 'sn-cu-long-dan-phung', 'Hệ thống sân cầu lông Sân cầu lông Đan Phượng được trang bị thảm PVC tiêu chuẩn cao cấp, hệ thống đèn led chống lóa chuyên nghiệp, không gian thoáng đãng sạch sẽ.', 'Tổ 2, Thị trấn Phùng, Đan Phượng, Hà Nội', 'Hà Nội', 21.096, 105.678, ST_SetSRID(ST_MakePoint(105.678, 21.096), 4326)::geography, '0242944251', 'APPROVED', 4.6, 17, 'sn-cu-long-dan-@gmail.com', '05:00:00', '22:00:00', 'Huỷ sân trước 24h được hoàn tiền 100%. Huỷ trước 12h hoàn tiền 50%.', 2, NOW(), NOW());
INSERT INTO venue.venues (id, owner_id, name, slug, description, address, city, latitude, longitude, location, phone, status, rating_avg, rating_count, email, open_time, close_time, policy, court_count, created_at, updated_at) VALUES
('44444444-4444-4444-4444-000000000023', '22222222-2222-2222-2222-000000000023', 'Sân cầu lông Quốc Oai', 'sn-cu-long-quc-oai', 'Hệ thống sân cầu lông Sân cầu lông Quốc Oai được trang bị thảm PVC tiêu chuẩn cao cấp, hệ thống đèn led chống lóa chuyên nghiệp, không gian thoáng đãng sạch sẽ.', 'Khu phố 1, Thị trấn Quốc Oai, Hà Nội', 'Hà Nội', 20.989, 105.634, ST_SetSRID(ST_MakePoint(105.634, 20.989), 4326)::geography, '0245399293', 'APPROVED', 4.9, 3, 'sn-cu-long-quc-@gmail.com', '05:00:00', '22:00:00', 'Huỷ sân trước 24h được hoàn tiền 100%. Huỷ trước 12h hoàn tiền 50%.', 2, NOW(), NOW());
INSERT INTO venue.venues (id, owner_id, name, slug, description, address, city, latitude, longitude, location, phone, status, rating_avg, rating_count, email, open_time, close_time, policy, court_count, created_at, updated_at) VALUES
('44444444-4444-4444-4444-000000000024', '22222222-2222-2222-2222-000000000024', 'Sân cầu lông Thạch Thất', 'sn-cu-long-thach-that', 'Hệ thống sân cầu lông Sân cầu lông Thạch Thất được trang bị thảm PVC tiêu chuẩn cao cấp, hệ thống đèn led chống lóa chuyên nghiệp, không gian thoáng đãng sạch sẽ.', 'Khu Đồng Cam, Thị trấn Liên Quan, Thạch Thất, Hà Nội', 'Hà Nội', 21.026, 105.578, ST_SetSRID(ST_MakePoint(105.578, 21.026), 4326)::geography, '0244417923', 'APPROVED', 4.3, 19, 'sn-cu-long-thac@gmail.com', '05:00:00', '22:00:00', 'Huỷ sân trước 24h được hoàn tiền 100%. Huỷ trước 12h hoàn tiền 50%.', 2, NOW(), NOW());
INSERT INTO venue.venues (id, owner_id, name, slug, description, address, city, latitude, longitude, location, phone, status, rating_avg, rating_count, email, open_time, close_time, policy, court_count, created_at, updated_at) VALUES
('44444444-4444-4444-4444-000000000025', '22222222-2222-2222-2222-000000000025', 'Sân cầu lông Chương Mỹ', 'sn-cu-long-chung-m', 'Hệ thống sân cầu lông Sân cầu lông Chương Mỹ được trang bị thảm PVC tiêu chuẩn cao cấp, hệ thống đèn led chống lóa chuyên nghiệp, không gian thoáng đãng sạch sẽ.', 'Khu Bắc Sơn, Thị trấn Chúc Sơn, Chương Mỹ, Hà Nội', 'Hà Nội', 20.923, 105.712, ST_SetSRID(ST_MakePoint(105.712, 20.923), 4326)::geography, '0243407864', 'APPROVED', 4.2, 24, 'sn-cu-long-chun@gmail.com', '05:00:00', '22:00:00', 'Huỷ sân trước 24h được hoàn tiền 100%. Huỷ trước 12h hoàn tiền 50%.', 2, NOW(), NOW());
INSERT INTO venue.venues (id, owner_id, name, slug, description, address, city, latitude, longitude, location, phone, status, rating_avg, rating_count, email, open_time, close_time, policy, court_count, created_at, updated_at) VALUES
('44444444-4444-4444-4444-000000000026', '22222222-2222-2222-2222-000000000026', 'Sân cầu lông Thanh Oai', 'sn-cu-long-thanh-oai', 'Hệ thống sân cầu lông Sân cầu lông Thanh Oai được trang bị thảm PVC tiêu chuẩn cao cấp, hệ thống đèn led chống lóa chuyên nghiệp, không gian thoáng đãng sạch sẽ.', 'Thị trấn Kim Bài, Thanh Oai, Hà Nội', 'Hà Nội', 20.875, 105.782, ST_SetSRID(ST_MakePoint(105.782, 20.875), 4326)::geography, '0241390044', 'APPROVED', 4.3, 26, 'sn-cu-long-than@gmail.com', '05:00:00', '22:00:00', 'Huỷ sân trước 24h được hoàn tiền 100%. Huỷ trước 12h hoàn tiền 50%.', 2, NOW(), NOW());
INSERT INTO venue.venues (id, owner_id, name, slug, description, address, city, latitude, longitude, location, phone, status, rating_avg, rating_count, email, open_time, close_time, policy, court_count, created_at, updated_at) VALUES
('44444444-4444-4444-4444-000000000027', '22222222-2222-2222-2222-000000000027', 'Sân cầu lông Thường Tín', 'sn-cu-long-thung-tin', 'Hệ thống sân cầu lông Sân cầu lông Thường Tín được trang bị thảm PVC tiêu chuẩn cao cấp, hệ thống đèn led chống lóa chuyên nghiệp, không gian thoáng đãng sạch sẽ.', 'Thị trấn Thường Tín, Thường Tín, Hà Nội', 'Hà Nội', 20.871, 105.856, ST_SetSRID(ST_MakePoint(105.856, 20.871), 4326)::geography, '0244808969', 'APPROVED', 4.9, 8, 'sn-cu-long-thun@gmail.com', '05:00:00', '22:00:00', 'Huỷ sân trước 24h được hoàn tiền 100%. Huỷ trước 12h hoàn tiền 50%.', 2, NOW(), NOW());
INSERT INTO venue.venues (id, owner_id, name, slug, description, address, city, latitude, longitude, location, phone, status, rating_avg, rating_count, email, open_time, close_time, policy, court_count, created_at, updated_at) VALUES
('44444444-4444-4444-4444-000000000028', '22222222-2222-2222-2222-000000000028', 'Sân cầu lông Phú Xuyên', 'sn-cu-long-ph-xuyen', 'Hệ thống sân cầu lông Sân cầu lông Phú Xuyên được trang bị thảm PVC tiêu chuẩn cao cấp, hệ thống đèn led chống lóa chuyên nghiệp, không gian thoáng đãng sạch sẽ.', 'Thị trấn Phú Xuyên, Phú Xuyên, Hà Nội', 'Hà Nội', 20.732, 105.902, ST_SetSRID(ST_MakePoint(105.902, 20.732), 4326)::geography, '0249098844', 'APPROVED', 4.5, 15, 'sn-cu-long-ph-x@gmail.com', '05:00:00', '22:00:00', 'Huỷ sân trước 24h được hoàn tiền 100%. Huỷ trước 12h hoàn tiền 50%.', 2, NOW(), NOW());
INSERT INTO venue.venues (id, owner_id, name, slug, description, address, city, latitude, longitude, location, phone, status, rating_avg, rating_count, email, open_time, close_time, policy, court_count, created_at, updated_at) VALUES
('44444444-4444-4444-4444-000000000029', '22222222-2222-2222-2222-000000000029', 'Sân cầu lông Ứng Hòa', 'sn-cu-long-ng-hoa', 'Hệ thống sân cầu lông Sân cầu lông Ứng Hòa được trang bị thảm PVC tiêu chuẩn cao cấp, hệ thống đèn led chống lóa chuyên nghiệp, không gian thoáng đãng sạch sẽ.', 'Thị trấn Vân Đình, Ứng Hòa, Hà Nội', 'Hà Nội', 20.725, 105.765, ST_SetSRID(ST_MakePoint(105.765, 20.725), 4326)::geography, '0243945047', 'APPROVED', 4.6, 6, 'sn-cu-long-ng-h@gmail.com', '05:00:00', '22:00:00', 'Huỷ sân trước 24h được hoàn tiền 100%. Huỷ trước 12h hoàn tiền 50%.', 2, NOW(), NOW());
INSERT INTO venue.venues (id, owner_id, name, slug, description, address, city, latitude, longitude, location, phone, status, rating_avg, rating_count, email, open_time, close_time, policy, court_count, created_at, updated_at) VALUES
('44444444-4444-4444-4444-000000000030', '22222222-2222-2222-2222-000000000030', 'Sân cầu lông Mỹ Đức', 'sn-cu-long-m-dc', 'Hệ thống sân cầu lông Sân cầu lông Mỹ Đức được trang bị thảm PVC tiêu chuẩn cao cấp, hệ thống đèn led chống lóa chuyên nghiệp, không gian thoáng đãng sạch sẽ.', 'Thị trấn Đại Nghĩa, Mỹ Đức, Hà Nội', 'Hà Nội', 20.698, 105.743, ST_SetSRID(ST_MakePoint(105.743, 20.698), 4326)::geography, '0249233826', 'APPROVED', 4.3, 22, 'sn-cu-long-m-dc@gmail.com', '05:00:00', '22:00:00', 'Huỷ sân trước 24h được hoàn tiền 100%. Huỷ trước 12h hoàn tiền 50%.', 2, NOW(), NOW());
INSERT INTO venue.venues (id, owner_id, name, slug, description, address, city, latitude, longitude, location, phone, status, rating_avg, rating_count, email, open_time, close_time, policy, court_count, created_at, updated_at) VALUES
('44444444-4444-4444-4444-000000000031', '22222222-2222-2222-2222-000000000031', 'Sân cầu lông Sơn Tây', 'sn-cu-long-sn-ty', 'Hệ thống sân cầu lông Sân cầu lông Sơn Tây được trang bị thảm PVC tiêu chuẩn cao cấp, hệ thống đèn led chống lóa chuyên nghiệp, không gian thoáng đãng sạch sẽ.', 'Phường Quang Trung, Sơn Tây, Hà Nội', 'Hà Nội', 21.136, 105.502, ST_SetSRID(ST_MakePoint(105.502, 21.136), 4326)::geography, '0245731073', 'APPROVED', 4.7, 5, 'sn-cu-long-sn-t@gmail.com', '05:00:00', '22:00:00', 'Huỷ sân trước 24h được hoàn tiền 100%. Huỷ trước 12h hoàn tiền 50%.', 2, NOW(), NOW());
INSERT INTO venue.venues (id, owner_id, name, slug, description, address, city, latitude, longitude, location, phone, status, rating_avg, rating_count, email, open_time, close_time, policy, court_count, created_at, updated_at) VALUES
('44444444-4444-4444-4444-000000000032', '22222222-2222-2222-2222-000000000032', 'Sân cầu lông Ba Vì', 'sn-cu-long-ba-v', 'Hệ thống sân cầu lông Sân cầu lông Ba Vì được trang bị thảm PVC tiêu chuẩn cao cấp, hệ thống đèn led chống lóa chuyên nghiệp, không gian thoáng đãng sạch sẽ.', 'Thị trấn Tây Đằng, Ba Vì, Hà Nội', 'Hà Nội', 21.198, 105.398, ST_SetSRID(ST_MakePoint(105.398, 21.198), 4326)::geography, '0245857246', 'APPROVED', 4.8, 21, 'sn-cu-long-ba-v@gmail.com', '05:00:00', '22:00:00', 'Huỷ sân trước 24h được hoàn tiền 100%. Huỷ trước 12h hoàn tiền 50%.', 2, NOW(), NOW());
INSERT INTO venue.venues (id, owner_id, name, slug, description, address, city, latitude, longitude, location, phone, status, rating_avg, rating_count, email, open_time, close_time, policy, court_count, created_at, updated_at) VALUES
('44444444-4444-4444-4444-000000000033', '22222222-2222-2222-2222-000000000033', 'Sân cầu lông Phúc Thọ', 'sn-cu-long-phc-th', 'Hệ thống sân cầu lông Sân cầu lông Phúc Thọ được trang bị thảm PVC tiêu chuẩn cao cấp, hệ thống đèn led chống lóa chuyên nghiệp, không gian thoáng đãng sạch sẽ.', 'Thị trấn Phúc Thọ, Phúc Thọ, Hà Nội', 'Hà Nội', 21.107, 105.592, ST_SetSRID(ST_MakePoint(105.592, 21.107), 4326)::geography, '0245608559', 'APPROVED', 4.8, 3, 'sn-cu-long-phc-@gmail.com', '05:00:00', '22:00:00', 'Huỷ sân trước 24h được hoàn tiền 100%. Huỷ trước 12h hoàn tiền 50%.', 2, NOW(), NOW());
INSERT INTO venue.venues (id, owner_id, name, slug, description, address, city, latitude, longitude, location, phone, status, rating_avg, rating_count, email, open_time, close_time, policy, court_count, created_at, updated_at) VALUES
('44444444-4444-4444-4444-000000000034', '22222222-2222-2222-2222-000000000034', 'Sân cầu lông Mê Linh', 'sn-cu-long-me-linh', 'Hệ thống sân cầu lông Sân cầu lông Mê Linh được trang bị thảm PVC tiêu chuẩn cao cấp, hệ thống đèn led chống lóa chuyên nghiệp, không gian thoáng đãng sạch sẽ.', 'Đại Thịnh, Mê Linh, Hà Nội', 'Hà Nội', 21.189, 105.729, ST_SetSRID(ST_MakePoint(105.729, 21.189), 4326)::geography, '0249995101', 'APPROVED', 4.6, 27, 'sn-cu-long-me-l@gmail.com', '05:00:00', '22:00:00', 'Huỷ sân trước 24h được hoàn tiền 100%. Huỷ trước 12h hoàn tiền 50%.', 2, NOW(), NOW());
INSERT INTO venue.venues (id, owner_id, name, slug, description, address, city, latitude, longitude, location, phone, status, rating_avg, rating_count, email, open_time, close_time, policy, court_count, created_at, updated_at) VALUES
('44444444-4444-4444-4444-000000000035', '22222222-2222-2222-2222-000000000035', 'Sân cầu lông Nội Bài', 'sn-cu-long-noi-bi', 'Hệ thống sân cầu lông Sân cầu lông Nội Bài được trang bị thảm PVC tiêu chuẩn cao cấp, hệ thống đèn led chống lóa chuyên nghiệp, không gian thoáng đãng sạch sẽ.', 'Sân bay Nội Bài, Sóc Sơn, Hà Nội', 'Hà Nội', 21.218, 105.804, ST_SetSRID(ST_MakePoint(105.804, 21.218), 4326)::geography, '0243407245', 'APPROVED', 4.8, 18, 'sn-cu-long-noi-@gmail.com', '05:00:00', '22:00:00', 'Huỷ sân trước 24h được hoàn tiền 100%. Huỷ trước 12h hoàn tiền 50%.', 2, NOW(), NOW());
INSERT INTO venue.venues (id, owner_id, name, slug, description, address, city, latitude, longitude, location, phone, status, rating_avg, rating_count, email, open_time, close_time, policy, court_count, created_at, updated_at) VALUES
('44444444-4444-4444-4444-000000000036', '22222222-2222-2222-2222-000000000036', 'Sân cầu lông Khương Đình', 'sn-cu-long-khung-dnh', 'Hệ thống sân cầu lông Sân cầu lông Khương Đình được trang bị thảm PVC tiêu chuẩn cao cấp, hệ thống đèn led chống lóa chuyên nghiệp, không gian thoáng đãng sạch sẽ.', '450 Vũ Tông Phan, Thanh Xuân, Hà Nội', 'Hà Nội', 20.987, 105.819, ST_SetSRID(ST_MakePoint(105.819, 20.987), 4326)::geography, '0246599859', 'APPROVED', 5.0, 19, 'sn-cu-long-khun@gmail.com', '05:00:00', '22:00:00', 'Huỷ sân trước 24h được hoàn tiền 100%. Huỷ trước 12h hoàn tiền 50%.', 2, NOW(), NOW());
INSERT INTO venue.venues (id, owner_id, name, slug, description, address, city, latitude, longitude, location, phone, status, rating_avg, rating_count, email, open_time, close_time, policy, court_count, created_at, updated_at) VALUES
('44444444-4444-4444-4444-000000000037', '22222222-2222-2222-2222-000000000037', 'Sân cầu lông Định Công', 'sn-cu-long-dnh-cong', 'Hệ thống sân cầu lông Sân cầu lông Định Công được trang bị thảm PVC tiêu chuẩn cao cấp, hệ thống đèn led chống lóa chuyên nghiệp, không gian thoáng đãng sạch sẽ.', '12 Trần Điền, Hoàng Mai, Hà Nội', 'Hà Nội', 20.982, 105.834, ST_SetSRID(ST_MakePoint(105.834, 20.982), 4326)::geography, '0249140058', 'APPROVED', 4.5, 16, 'sn-cu-long-dnh-@gmail.com', '05:00:00', '22:00:00', 'Huỷ sân trước 24h được hoàn tiền 100%. Huỷ trước 12h hoàn tiền 50%.', 2, NOW(), NOW());
INSERT INTO venue.venues (id, owner_id, name, slug, description, address, city, latitude, longitude, location, phone, status, rating_avg, rating_count, email, open_time, close_time, policy, court_count, created_at, updated_at) VALUES
('44444444-4444-4444-4444-000000000038', '22222222-2222-2222-2222-000000000038', 'Sân cầu lông Giáp Bát', 'sn-cu-long-giap-bat', 'Hệ thống sân cầu lông Sân cầu lông Giáp Bát được trang bị thảm PVC tiêu chuẩn cao cấp, hệ thống đèn led chống lóa chuyên nghiệp, không gian thoáng đãng sạch sẽ.', '50 Kim Đồng, Hoàng Mai, Hà Nội', 'Hà Nội', 20.978, 105.845, ST_SetSRID(ST_MakePoint(105.845, 20.978), 4326)::geography, '0244777831', 'APPROVED', 4.5, 17, 'sn-cu-long-giap@gmail.com', '05:00:00', '22:00:00', 'Huỷ sân trước 24h được hoàn tiền 100%. Huỷ trước 12h hoàn tiền 50%.', 2, NOW(), NOW());
INSERT INTO venue.venues (id, owner_id, name, slug, description, address, city, latitude, longitude, location, phone, status, rating_avg, rating_count, email, open_time, close_time, policy, court_count, created_at, updated_at) VALUES
('44444444-4444-4444-4444-000000000039', '22222222-2222-2222-2222-000000000039', 'Sân cầu lông Mai Dịch', 'sn-cu-long-mai-dch', 'Hệ thống sân cầu lông Sân cầu lông Mai Dịch được trang bị thảm PVC tiêu chuẩn cao cấp, hệ thống đèn led chống lóa chuyên nghiệp, không gian thoáng đãng sạch sẽ.', '7 Trần Bình, Cầu Giấy, Hà Nội', 'Hà Nội', 21.038, 105.779, ST_SetSRID(ST_MakePoint(105.779, 21.038), 4326)::geography, '0249916149', 'APPROVED', 4.2, 16, 'sn-cu-long-mai-@gmail.com', '05:00:00', '22:00:00', 'Huỷ sân trước 24h được hoàn tiền 100%. Huỷ trước 12h hoàn tiền 50%.', 2, NOW(), NOW());
INSERT INTO venue.venues (id, owner_id, name, slug, description, address, city, latitude, longitude, location, phone, status, rating_avg, rating_count, email, open_time, close_time, policy, court_count, created_at, updated_at) VALUES
('44444444-4444-4444-4444-000000000040', '22222222-2222-2222-2222-000000000040', 'Sân cầu lông Nghĩa Tân', 'sn-cu-long-nghia-tn', 'Hệ thống sân cầu lông Sân cầu lông Nghĩa Tân được trang bị thảm PVC tiêu chuẩn cao cấp, hệ thống đèn led chống lóa chuyên nghiệp, không gian thoáng đãng sạch sẽ.', '14 Tô Hiệu, Cầu Giấy, Hà Nội', 'Hà Nội', 21.044, 105.795, ST_SetSRID(ST_MakePoint(105.795, 21.044), 4326)::geography, '0248673429', 'APPROVED', 4.8, 10, 'sn-cu-long-nghi@gmail.com', '05:00:00', '22:00:00', 'Huỷ sân trước 24h được hoàn tiền 100%. Huỷ trước 12h hoàn tiền 50%.', 2, NOW(), NOW());
INSERT INTO venue.venues (id, owner_id, name, slug, description, address, city, latitude, longitude, location, phone, status, rating_avg, rating_count, email, open_time, close_time, policy, court_count, created_at, updated_at) VALUES
('44444444-4444-4444-4444-000000000041', '22222222-2222-2222-2222-000000000041', 'Sân cầu lông Trung Hòa', 'sn-cu-long-trung-hoa', 'Hệ thống sân cầu lông Sân cầu lông Trung Hòa được trang bị thảm PVC tiêu chuẩn cao cấp, hệ thống đèn led chống lóa chuyên nghiệp, không gian thoáng đãng sạch sẽ.', '32 Trung Kính, Cầu Giấy, Hà Nội', 'Hà Nội', 21.018, 105.799, ST_SetSRID(ST_MakePoint(105.799, 21.018), 4326)::geography, '0244759796', 'APPROVED', 4.3, 15, 'sn-cu-long-trun@gmail.com', '05:00:00', '22:00:00', 'Huỷ sân trước 24h được hoàn tiền 100%. Huỷ trước 12h hoàn tiền 50%.', 2, NOW(), NOW());
INSERT INTO venue.venues (id, owner_id, name, slug, description, address, city, latitude, longitude, location, phone, status, rating_avg, rating_count, email, open_time, close_time, policy, court_count, created_at, updated_at) VALUES
('44444444-4444-4444-4444-000000000042', '22222222-2222-2222-2222-000000000042', 'Sân cầu lông Yên Hòa', 'sn-cu-long-yen-hoa', 'Hệ thống sân cầu lông Sân cầu lông Yên Hòa được trang bị thảm PVC tiêu chuẩn cao cấp, hệ thống đèn led chống lóa chuyên nghiệp, không gian thoáng đãng sạch sẽ.', '110 Nguyễn Khang, Cầu Giấy, Hà Nội', 'Hà Nội', 21.02, 105.801, ST_SetSRID(ST_MakePoint(105.801, 21.02), 4326)::geography, '0243089315', 'APPROVED', 4.6, 18, 'sn-cu-long-yen-@gmail.com', '05:00:00', '22:00:00', 'Huỷ sân trước 24h được hoàn tiền 100%. Huỷ trước 12h hoàn tiền 50%.', 2, NOW(), NOW());
INSERT INTO venue.venues (id, owner_id, name, slug, description, address, city, latitude, longitude, location, phone, status, rating_avg, rating_count, email, open_time, close_time, policy, court_count, created_at, updated_at) VALUES
('44444444-4444-4444-4444-000000000043', '22222222-2222-2222-2222-000000000043', 'Sân cầu lông Láng Hạ', 'sn-cu-long-lang-ha', 'Hệ thống sân cầu lông Sân cầu lông Láng Hạ được trang bị thảm PVC tiêu chuẩn cao cấp, hệ thống đèn led chống lóa chuyên nghiệp, không gian thoáng đãng sạch sẽ.', '20 Huỳnh Thúc Kháng, Đống Đa, Hà Nội', 'Hà Nội', 21.018, 105.815, ST_SetSRID(ST_MakePoint(105.815, 21.018), 4326)::geography, '0243013135', 'APPROVED', 4.4, 24, 'sn-cu-long-lang@gmail.com', '05:00:00', '22:00:00', 'Huỷ sân trước 24h được hoàn tiền 100%. Huỷ trước 12h hoàn tiền 50%.', 2, NOW(), NOW());
INSERT INTO venue.venues (id, owner_id, name, slug, description, address, city, latitude, longitude, location, phone, status, rating_avg, rating_count, email, open_time, close_time, policy, court_count, created_at, updated_at) VALUES
('44444444-4444-4444-4444-000000000044', '22222222-2222-2222-2222-000000000044', 'Sân cầu lông Kim Liên', 'sn-cu-long-kim-lien', 'Hệ thống sân cầu lông Sân cầu lông Kim Liên được trang bị thảm PVC tiêu chuẩn cao cấp, hệ thống đèn led chống lóa chuyên nghiệp, không gian thoáng đãng sạch sẽ.', '1 Phạm Ngọc Thạch, Đống Đa, Hà Nội', 'Hà Nội', 21.009, 105.832, ST_SetSRID(ST_MakePoint(105.832, 21.009), 4326)::geography, '0247628641', 'APPROVED', 4.9, 19, 'sn-cu-long-kim-@gmail.com', '05:00:00', '22:00:00', 'Huỷ sân trước 24h được hoàn tiền 100%. Huỷ trước 12h hoàn tiền 50%.', 2, NOW(), NOW());
INSERT INTO venue.venues (id, owner_id, name, slug, description, address, city, latitude, longitude, location, phone, status, rating_avg, rating_count, email, open_time, close_time, policy, court_count, created_at, updated_at) VALUES
('44444444-4444-4444-4444-000000000045', '22222222-2222-2222-2222-000000000045', 'Sân cầu lông Khương Thượng', 'sn-cu-long-khung-thung', 'Hệ thống sân cầu lông Sân cầu lông Khương Thượng được trang bị thảm PVC tiêu chuẩn cao cấp, hệ thống đèn led chống lóa chuyên nghiệp, không gian thoáng đãng sạch sẽ.', '165 Chùa Bộc, Đống Đa, Hà Nội', 'Hà Nội', 21.006, 105.828, ST_SetSRID(ST_MakePoint(105.828, 21.006), 4326)::geography, '0248390163', 'APPROVED', 4.8, 18, 'sn-cu-long-khun@gmail.com', '05:00:00', '22:00:00', 'Huỷ sân trước 24h được hoàn tiền 100%. Huỷ trước 12h hoàn tiền 50%.', 2, NOW(), NOW());
INSERT INTO venue.venues (id, owner_id, name, slug, description, address, city, latitude, longitude, location, phone, status, rating_avg, rating_count, email, open_time, close_time, policy, court_count, created_at, updated_at) VALUES
('44444444-4444-4444-4444-000000000046', '22222222-2222-2222-2222-000000000046', 'Sân cầu lông Thành Công', 'sn-cu-long-thnh-cong', 'Hệ thống sân cầu lông Sân cầu lông Thành Công được trang bị thảm PVC tiêu chuẩn cao cấp, hệ thống đèn led chống lóa chuyên nghiệp, không gian thoáng đãng sạch sẽ.', '57 Láng Hạ, Đống Đa, Hà Nội', 'Hà Nội', 21.019, 105.812, ST_SetSRID(ST_MakePoint(105.812, 21.019), 4326)::geography, '0243903978', 'APPROVED', 5.0, 22, 'sn-cu-long-thnh@gmail.com', '05:00:00', '22:00:00', 'Huỷ sân trước 24h được hoàn tiền 100%. Huỷ trước 12h hoàn tiền 50%.', 2, NOW(), NOW());
INSERT INTO venue.venues (id, owner_id, name, slug, description, address, city, latitude, longitude, location, phone, status, rating_avg, rating_count, email, open_time, close_time, policy, court_count, created_at, updated_at) VALUES
('44444444-4444-4444-4444-000000000047', '22222222-2222-2222-2222-000000000047', 'Sân cầu lông Giảng Võ', 'sn-cu-long-giang-v', 'Hệ thống sân cầu lông Sân cầu lông Giảng Võ được trang bị thảm PVC tiêu chuẩn cao cấp, hệ thống đèn led chống lóa chuyên nghiệp, không gian thoáng đãng sạch sẽ.', '140 Giảng Võ, Ba Đình, Hà Nội', 'Hà Nội', 21.029, 105.823, ST_SetSRID(ST_MakePoint(105.823, 21.029), 4326)::geography, '0245774685', 'APPROVED', 4.3, 5, 'sn-cu-long-gian@gmail.com', '05:00:00', '22:00:00', 'Huỷ sân trước 24h được hoàn tiền 100%. Huỷ trước 12h hoàn tiền 50%.', 2, NOW(), NOW());
INSERT INTO venue.venues (id, owner_id, name, slug, description, address, city, latitude, longitude, location, phone, status, rating_avg, rating_count, email, open_time, close_time, policy, court_count, created_at, updated_at) VALUES
('44444444-4444-4444-4444-000000000048', '22222222-2222-2222-2222-000000000048', 'Sân cầu lông Kim Mã', 'sn-cu-long-kim-m', 'Hệ thống sân cầu lông Sân cầu lông Kim Mã được trang bị thảm PVC tiêu chuẩn cao cấp, hệ thống đèn led chống lóa chuyên nghiệp, không gian thoáng đãng sạch sẽ.', '290 Kim Mã, Ba Đình, Hà Nội', 'Hà Nội', 21.031, 105.82, ST_SetSRID(ST_MakePoint(105.82, 21.031), 4326)::geography, '0246455270', 'APPROVED', 4.9, 25, 'sn-cu-long-kim-@gmail.com', '05:00:00', '22:00:00', 'Huỷ sân trước 24h được hoàn tiền 100%. Huỷ trước 12h hoàn tiền 50%.', 2, NOW(), NOW());
INSERT INTO venue.venues (id, owner_id, name, slug, description, address, city, latitude, longitude, location, phone, status, rating_avg, rating_count, email, open_time, close_time, policy, court_count, created_at, updated_at) VALUES
('44444444-4444-4444-4444-000000000049', '22222222-2222-2222-2222-000000000049', 'Sân cầu lông Trúc Bạch', 'sn-cu-long-trc-bach', 'Hệ thống sân cầu lông Sân cầu lông Trúc Bạch được trang bị thảm PVC tiêu chuẩn cao cấp, hệ thống đèn led chống lóa chuyên nghiệp, không gian thoáng đãng sạch sẽ.', '1 Đặng Dung, Ba Đình, Hà Nội', 'Hà Nội', 21.045, 105.841, ST_SetSRID(ST_MakePoint(105.841, 21.045), 4326)::geography, '0244677972', 'APPROVED', 4.5, 21, 'sn-cu-long-trc-@gmail.com', '05:00:00', '22:00:00', 'Huỷ sân trước 24h được hoàn tiền 100%. Huỷ trước 12h hoàn tiền 50%.', 2, NOW(), NOW());
INSERT INTO venue.venues (id, owner_id, name, slug, description, address, city, latitude, longitude, location, phone, status, rating_avg, rating_count, email, open_time, close_time, policy, court_count, created_at, updated_at) VALUES
('44444444-4444-4444-4444-000000000050', '22222222-2222-2222-2222-000000000050', 'Sân cầu lông Yên Phụ', 'sn-cu-long-yen-ph', 'Hệ thống sân cầu lông Sân cầu lông Yên Phụ được trang bị thảm PVC tiêu chuẩn cao cấp, hệ thống đèn led chống lóa chuyên nghiệp, không gian thoáng đãng sạch sẽ.', '11 Yên Phụ, Tây Hồ, Hà Nội', 'Hà Nội', 21.049, 105.843, ST_SetSRID(ST_MakePoint(105.843, 21.049), 4326)::geography, '0242551681', 'APPROVED', 4.9, 22, 'sn-cu-long-yen-@gmail.com', '05:00:00', '22:00:00', 'Huỷ sân trước 24h được hoàn tiền 100%. Huỷ trước 12h hoàn tiền 50%.', 2, NOW(), NOW());
-- 6. Seed Courts and Price Rules
INSERT INTO venue.courts (id, venue_id, name, court_type, status, created_at, updated_at) VALUES
('55555555-5555-5555-5555-000000000001', '44444444-4444-4444-4444-000000000001', 'Sân 1 - Đống Đa', 'PREMIUM', 'ACTIVE', NOW(), NOW()),
('55555555-5555-5555-5555-000000000002', '44444444-4444-4444-4444-000000000001', 'Sân 2 - Đống Đa', 'STANDARD', 'ACTIVE', NOW(), NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000001', '55555555-5555-5555-5555-000000000001', 1, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000001', '55555555-5555-5555-5555-000000000001', 1, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000001', '55555555-5555-5555-5555-000000000002', 1, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000001', '55555555-5555-5555-5555-000000000001', 2, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000001', '55555555-5555-5555-5555-000000000001', 2, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000001', '55555555-5555-5555-5555-000000000002', 2, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000001', '55555555-5555-5555-5555-000000000001', 3, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000001', '55555555-5555-5555-5555-000000000001', 3, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000001', '55555555-5555-5555-5555-000000000002', 3, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000001', '55555555-5555-5555-5555-000000000001', 4, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000001', '55555555-5555-5555-5555-000000000001', 4, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000001', '55555555-5555-5555-5555-000000000002', 4, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000001', '55555555-5555-5555-5555-000000000001', 5, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000001', '55555555-5555-5555-5555-000000000001', 5, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000001', '55555555-5555-5555-5555-000000000002', 5, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000001', '55555555-5555-5555-5555-000000000001', 6, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000001', '55555555-5555-5555-5555-000000000001', 6, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000001', '55555555-5555-5555-5555-000000000002', 6, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000001', '55555555-5555-5555-5555-000000000001', 7, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000001', '55555555-5555-5555-5555-000000000001', 7, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000001', '55555555-5555-5555-5555-000000000002', 7, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.courts (id, venue_id, name, court_type, status, created_at, updated_at) VALUES
('55555555-5555-5555-5555-000000000003', '44444444-4444-4444-4444-000000000002', 'Sân 1 - Cầu Giấy', 'PREMIUM', 'ACTIVE', NOW(), NOW()),
('55555555-5555-5555-5555-000000000004', '44444444-4444-4444-4444-000000000002', 'Sân 2 - Cầu Giấy', 'STANDARD', 'ACTIVE', NOW(), NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000002', '55555555-5555-5555-5555-000000000003', 1, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000002', '55555555-5555-5555-5555-000000000003', 1, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000002', '55555555-5555-5555-5555-000000000004', 1, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000002', '55555555-5555-5555-5555-000000000003', 2, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000002', '55555555-5555-5555-5555-000000000003', 2, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000002', '55555555-5555-5555-5555-000000000004', 2, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000002', '55555555-5555-5555-5555-000000000003', 3, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000002', '55555555-5555-5555-5555-000000000003', 3, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000002', '55555555-5555-5555-5555-000000000004', 3, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000002', '55555555-5555-5555-5555-000000000003', 4, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000002', '55555555-5555-5555-5555-000000000003', 4, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000002', '55555555-5555-5555-5555-000000000004', 4, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000002', '55555555-5555-5555-5555-000000000003', 5, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000002', '55555555-5555-5555-5555-000000000003', 5, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000002', '55555555-5555-5555-5555-000000000004', 5, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000002', '55555555-5555-5555-5555-000000000003', 6, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000002', '55555555-5555-5555-5555-000000000003', 6, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000002', '55555555-5555-5555-5555-000000000004', 6, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000002', '55555555-5555-5555-5555-000000000003', 7, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000002', '55555555-5555-5555-5555-000000000003', 7, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000002', '55555555-5555-5555-5555-000000000004', 7, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.courts (id, venue_id, name, court_type, status, created_at, updated_at) VALUES
('55555555-5555-5555-5555-000000000005', '44444444-4444-4444-4444-000000000003', 'Sân 1 - Lê Văn Lương', 'PREMIUM', 'ACTIVE', NOW(), NOW()),
('55555555-5555-5555-5555-000000000006', '44444444-4444-4444-4444-000000000003', 'Sân 2 - Lê Văn Lương', 'STANDARD', 'ACTIVE', NOW(), NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000003', '55555555-5555-5555-5555-000000000005', 1, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000003', '55555555-5555-5555-5555-000000000005', 1, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000003', '55555555-5555-5555-5555-000000000006', 1, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000003', '55555555-5555-5555-5555-000000000005', 2, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000003', '55555555-5555-5555-5555-000000000005', 2, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000003', '55555555-5555-5555-5555-000000000006', 2, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000003', '55555555-5555-5555-5555-000000000005', 3, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000003', '55555555-5555-5555-5555-000000000005', 3, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000003', '55555555-5555-5555-5555-000000000006', 3, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000003', '55555555-5555-5555-5555-000000000005', 4, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000003', '55555555-5555-5555-5555-000000000005', 4, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000003', '55555555-5555-5555-5555-000000000006', 4, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000003', '55555555-5555-5555-5555-000000000005', 5, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000003', '55555555-5555-5555-5555-000000000005', 5, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000003', '55555555-5555-5555-5555-000000000006', 5, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000003', '55555555-5555-5555-5555-000000000005', 6, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000003', '55555555-5555-5555-5555-000000000005', 6, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000003', '55555555-5555-5555-5555-000000000006', 6, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000003', '55555555-5555-5555-5555-000000000005', 7, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000003', '55555555-5555-5555-5555-000000000005', 7, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000003', '55555555-5555-5555-5555-000000000006', 7, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.courts (id, venue_id, name, court_type, status, created_at, updated_at) VALUES
('55555555-5555-5555-5555-000000000007', '44444444-4444-4444-4444-000000000004', 'Sân 1 - Đại học Y', 'PREMIUM', 'ACTIVE', NOW(), NOW()),
('55555555-5555-5555-5555-000000000008', '44444444-4444-4444-4444-000000000004', 'Sân 2 - Đại học Y', 'STANDARD', 'ACTIVE', NOW(), NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000004', '55555555-5555-5555-5555-000000000007', 1, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000004', '55555555-5555-5555-5555-000000000007', 1, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000004', '55555555-5555-5555-5555-000000000008', 1, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000004', '55555555-5555-5555-5555-000000000007', 2, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000004', '55555555-5555-5555-5555-000000000007', 2, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000004', '55555555-5555-5555-5555-000000000008', 2, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000004', '55555555-5555-5555-5555-000000000007', 3, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000004', '55555555-5555-5555-5555-000000000007', 3, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000004', '55555555-5555-5555-5555-000000000008', 3, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000004', '55555555-5555-5555-5555-000000000007', 4, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000004', '55555555-5555-5555-5555-000000000007', 4, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000004', '55555555-5555-5555-5555-000000000008', 4, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000004', '55555555-5555-5555-5555-000000000007', 5, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000004', '55555555-5555-5555-5555-000000000007', 5, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000004', '55555555-5555-5555-5555-000000000008', 5, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000004', '55555555-5555-5555-5555-000000000007', 6, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000004', '55555555-5555-5555-5555-000000000007', 6, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000004', '55555555-5555-5555-5555-000000000008', 6, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000004', '55555555-5555-5555-5555-000000000007', 7, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000004', '55555555-5555-5555-5555-000000000007', 7, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000004', '55555555-5555-5555-5555-000000000008', 7, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.courts (id, venue_id, name, court_type, status, created_at, updated_at) VALUES
('55555555-5555-5555-5555-000000000009', '44444444-4444-4444-4444-000000000005', 'Sân 1 - Ba Đình', 'PREMIUM', 'ACTIVE', NOW(), NOW()),
('55555555-5555-5555-5555-000000000010', '44444444-4444-4444-4444-000000000005', 'Sân 2 - Ba Đình', 'STANDARD', 'ACTIVE', NOW(), NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000005', '55555555-5555-5555-5555-000000000009', 1, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000005', '55555555-5555-5555-5555-000000000009', 1, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000005', '55555555-5555-5555-5555-000000000010', 1, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000005', '55555555-5555-5555-5555-000000000009', 2, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000005', '55555555-5555-5555-5555-000000000009', 2, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000005', '55555555-5555-5555-5555-000000000010', 2, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000005', '55555555-5555-5555-5555-000000000009', 3, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000005', '55555555-5555-5555-5555-000000000009', 3, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000005', '55555555-5555-5555-5555-000000000010', 3, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000005', '55555555-5555-5555-5555-000000000009', 4, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000005', '55555555-5555-5555-5555-000000000009', 4, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000005', '55555555-5555-5555-5555-000000000010', 4, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000005', '55555555-5555-5555-5555-000000000009', 5, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000005', '55555555-5555-5555-5555-000000000009', 5, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000005', '55555555-5555-5555-5555-000000000010', 5, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000005', '55555555-5555-5555-5555-000000000009', 6, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000005', '55555555-5555-5555-5555-000000000009', 6, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000005', '55555555-5555-5555-5555-000000000010', 6, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000005', '55555555-5555-5555-5555-000000000009', 7, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000005', '55555555-5555-5555-5555-000000000009', 7, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000005', '55555555-5555-5555-5555-000000000010', 7, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.courts (id, venue_id, name, court_type, status, created_at, updated_at) VALUES
('55555555-5555-5555-5555-000000000011', '44444444-4444-4444-4444-000000000006', 'Sân 1 - Tây Hồ', 'PREMIUM', 'ACTIVE', NOW(), NOW()),
('55555555-5555-5555-5555-000000000012', '44444444-4444-4444-4444-000000000006', 'Sân 2 - Tây Hồ', 'STANDARD', 'ACTIVE', NOW(), NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000006', '55555555-5555-5555-5555-000000000011', 1, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000006', '55555555-5555-5555-5555-000000000011', 1, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000006', '55555555-5555-5555-5555-000000000012', 1, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000006', '55555555-5555-5555-5555-000000000011', 2, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000006', '55555555-5555-5555-5555-000000000011', 2, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000006', '55555555-5555-5555-5555-000000000012', 2, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000006', '55555555-5555-5555-5555-000000000011', 3, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000006', '55555555-5555-5555-5555-000000000011', 3, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000006', '55555555-5555-5555-5555-000000000012', 3, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000006', '55555555-5555-5555-5555-000000000011', 4, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000006', '55555555-5555-5555-5555-000000000011', 4, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000006', '55555555-5555-5555-5555-000000000012', 4, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000006', '55555555-5555-5555-5555-000000000011', 5, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000006', '55555555-5555-5555-5555-000000000011', 5, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000006', '55555555-5555-5555-5555-000000000012', 5, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000006', '55555555-5555-5555-5555-000000000011', 6, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000006', '55555555-5555-5555-5555-000000000011', 6, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000006', '55555555-5555-5555-5555-000000000012', 6, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000006', '55555555-5555-5555-5555-000000000011', 7, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000006', '55555555-5555-5555-5555-000000000011', 7, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000006', '55555555-5555-5555-5555-000000000012', 7, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.courts (id, venue_id, name, court_type, status, created_at, updated_at) VALUES
('55555555-5555-5555-5555-000000000013', '44444444-4444-4444-4444-000000000007', 'Sân 1 - Hoàn Kiếm', 'PREMIUM', 'ACTIVE', NOW(), NOW()),
('55555555-5555-5555-5555-000000000014', '44444444-4444-4444-4444-000000000007', 'Sân 2 - Hoàn Kiếm', 'STANDARD', 'ACTIVE', NOW(), NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000007', '55555555-5555-5555-5555-000000000013', 1, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000007', '55555555-5555-5555-5555-000000000013', 1, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000007', '55555555-5555-5555-5555-000000000014', 1, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000007', '55555555-5555-5555-5555-000000000013', 2, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000007', '55555555-5555-5555-5555-000000000013', 2, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000007', '55555555-5555-5555-5555-000000000014', 2, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000007', '55555555-5555-5555-5555-000000000013', 3, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000007', '55555555-5555-5555-5555-000000000013', 3, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000007', '55555555-5555-5555-5555-000000000014', 3, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000007', '55555555-5555-5555-5555-000000000013', 4, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000007', '55555555-5555-5555-5555-000000000013', 4, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000007', '55555555-5555-5555-5555-000000000014', 4, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000007', '55555555-5555-5555-5555-000000000013', 5, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000007', '55555555-5555-5555-5555-000000000013', 5, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000007', '55555555-5555-5555-5555-000000000014', 5, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000007', '55555555-5555-5555-5555-000000000013', 6, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000007', '55555555-5555-5555-5555-000000000013', 6, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000007', '55555555-5555-5555-5555-000000000014', 6, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000007', '55555555-5555-5555-5555-000000000013', 7, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000007', '55555555-5555-5555-5555-000000000013', 7, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000007', '55555555-5555-5555-5555-000000000014', 7, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.courts (id, venue_id, name, court_type, status, created_at, updated_at) VALUES
('55555555-5555-5555-5555-000000000015', '44444444-4444-4444-4444-000000000008', 'Sân 1 - Hai Bà Trưng', 'PREMIUM', 'ACTIVE', NOW(), NOW()),
('55555555-5555-5555-5555-000000000016', '44444444-4444-4444-4444-000000000008', 'Sân 2 - Hai Bà Trưng', 'STANDARD', 'ACTIVE', NOW(), NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000008', '55555555-5555-5555-5555-000000000015', 1, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000008', '55555555-5555-5555-5555-000000000015', 1, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000008', '55555555-5555-5555-5555-000000000016', 1, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000008', '55555555-5555-5555-5555-000000000015', 2, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000008', '55555555-5555-5555-5555-000000000015', 2, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000008', '55555555-5555-5555-5555-000000000016', 2, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000008', '55555555-5555-5555-5555-000000000015', 3, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000008', '55555555-5555-5555-5555-000000000015', 3, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000008', '55555555-5555-5555-5555-000000000016', 3, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000008', '55555555-5555-5555-5555-000000000015', 4, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000008', '55555555-5555-5555-5555-000000000015', 4, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000008', '55555555-5555-5555-5555-000000000016', 4, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000008', '55555555-5555-5555-5555-000000000015', 5, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000008', '55555555-5555-5555-5555-000000000015', 5, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000008', '55555555-5555-5555-5555-000000000016', 5, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000008', '55555555-5555-5555-5555-000000000015', 6, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000008', '55555555-5555-5555-5555-000000000015', 6, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000008', '55555555-5555-5555-5555-000000000016', 6, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000008', '55555555-5555-5555-5555-000000000015', 7, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000008', '55555555-5555-5555-5555-000000000015', 7, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000008', '55555555-5555-5555-5555-000000000016', 7, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.courts (id, venue_id, name, court_type, status, created_at, updated_at) VALUES
('55555555-5555-5555-5555-000000000017', '44444444-4444-4444-4444-000000000009', 'Sân 1 - Thanh Xuân', 'PREMIUM', 'ACTIVE', NOW(), NOW()),
('55555555-5555-5555-5555-000000000018', '44444444-4444-4444-4444-000000000009', 'Sân 2 - Thanh Xuân', 'STANDARD', 'ACTIVE', NOW(), NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000009', '55555555-5555-5555-5555-000000000017', 1, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000009', '55555555-5555-5555-5555-000000000017', 1, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000009', '55555555-5555-5555-5555-000000000018', 1, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000009', '55555555-5555-5555-5555-000000000017', 2, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000009', '55555555-5555-5555-5555-000000000017', 2, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000009', '55555555-5555-5555-5555-000000000018', 2, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000009', '55555555-5555-5555-5555-000000000017', 3, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000009', '55555555-5555-5555-5555-000000000017', 3, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000009', '55555555-5555-5555-5555-000000000018', 3, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000009', '55555555-5555-5555-5555-000000000017', 4, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000009', '55555555-5555-5555-5555-000000000017', 4, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000009', '55555555-5555-5555-5555-000000000018', 4, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000009', '55555555-5555-5555-5555-000000000017', 5, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000009', '55555555-5555-5555-5555-000000000017', 5, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000009', '55555555-5555-5555-5555-000000000018', 5, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000009', '55555555-5555-5555-5555-000000000017', 6, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000009', '55555555-5555-5555-5555-000000000017', 6, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000009', '55555555-5555-5555-5555-000000000018', 6, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000009', '55555555-5555-5555-5555-000000000017', 7, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000009', '55555555-5555-5555-5555-000000000017', 7, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000009', '55555555-5555-5555-5555-000000000018', 7, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.courts (id, venue_id, name, court_type, status, created_at, updated_at) VALUES
('55555555-5555-5555-5555-000000000019', '44444444-4444-4444-4444-000000000010', 'Sân 1 - Hà Đông', 'PREMIUM', 'ACTIVE', NOW(), NOW()),
('55555555-5555-5555-5555-000000000020', '44444444-4444-4444-4444-000000000010', 'Sân 2 - Hà Đông', 'STANDARD', 'ACTIVE', NOW(), NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000010', '55555555-5555-5555-5555-000000000019', 1, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000010', '55555555-5555-5555-5555-000000000019', 1, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000010', '55555555-5555-5555-5555-000000000020', 1, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000010', '55555555-5555-5555-5555-000000000019', 2, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000010', '55555555-5555-5555-5555-000000000019', 2, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000010', '55555555-5555-5555-5555-000000000020', 2, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000010', '55555555-5555-5555-5555-000000000019', 3, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000010', '55555555-5555-5555-5555-000000000019', 3, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000010', '55555555-5555-5555-5555-000000000020', 3, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000010', '55555555-5555-5555-5555-000000000019', 4, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000010', '55555555-5555-5555-5555-000000000019', 4, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000010', '55555555-5555-5555-5555-000000000020', 4, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000010', '55555555-5555-5555-5555-000000000019', 5, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000010', '55555555-5555-5555-5555-000000000019', 5, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000010', '55555555-5555-5555-5555-000000000020', 5, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000010', '55555555-5555-5555-5555-000000000019', 6, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000010', '55555555-5555-5555-5555-000000000019', 6, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000010', '55555555-5555-5555-5555-000000000020', 6, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000010', '55555555-5555-5555-5555-000000000019', 7, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000010', '55555555-5555-5555-5555-000000000019', 7, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000010', '55555555-5555-5555-5555-000000000020', 7, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.courts (id, venue_id, name, court_type, status, created_at, updated_at) VALUES
('55555555-5555-5555-5555-000000000021', '44444444-4444-4444-4444-000000000011', 'Sân 1 - Mỹ Đình', 'PREMIUM', 'ACTIVE', NOW(), NOW()),
('55555555-5555-5555-5555-000000000022', '44444444-4444-4444-4444-000000000011', 'Sân 2 - Mỹ Đình', 'STANDARD', 'ACTIVE', NOW(), NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000011', '55555555-5555-5555-5555-000000000021', 1, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000011', '55555555-5555-5555-5555-000000000021', 1, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000011', '55555555-5555-5555-5555-000000000022', 1, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000011', '55555555-5555-5555-5555-000000000021', 2, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000011', '55555555-5555-5555-5555-000000000021', 2, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000011', '55555555-5555-5555-5555-000000000022', 2, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000011', '55555555-5555-5555-5555-000000000021', 3, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000011', '55555555-5555-5555-5555-000000000021', 3, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000011', '55555555-5555-5555-5555-000000000022', 3, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000011', '55555555-5555-5555-5555-000000000021', 4, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000011', '55555555-5555-5555-5555-000000000021', 4, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000011', '55555555-5555-5555-5555-000000000022', 4, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000011', '55555555-5555-5555-5555-000000000021', 5, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000011', '55555555-5555-5555-5555-000000000021', 5, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000011', '55555555-5555-5555-5555-000000000022', 5, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000011', '55555555-5555-5555-5555-000000000021', 6, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000011', '55555555-5555-5555-5555-000000000021', 6, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000011', '55555555-5555-5555-5555-000000000022', 6, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000011', '55555555-5555-5555-5555-000000000021', 7, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000011', '55555555-5555-5555-5555-000000000021', 7, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000011', '55555555-5555-5555-5555-000000000022', 7, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.courts (id, venue_id, name, court_type, status, created_at, updated_at) VALUES
('55555555-5555-5555-5555-000000000023', '44444444-4444-4444-4444-000000000012', 'Sân 1 - Cầu Diễn', 'PREMIUM', 'ACTIVE', NOW(), NOW()),
('55555555-5555-5555-5555-000000000024', '44444444-4444-4444-4444-000000000012', 'Sân 2 - Cầu Diễn', 'STANDARD', 'ACTIVE', NOW(), NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000012', '55555555-5555-5555-5555-000000000023', 1, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000012', '55555555-5555-5555-5555-000000000023', 1, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000012', '55555555-5555-5555-5555-000000000024', 1, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000012', '55555555-5555-5555-5555-000000000023', 2, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000012', '55555555-5555-5555-5555-000000000023', 2, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000012', '55555555-5555-5555-5555-000000000024', 2, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000012', '55555555-5555-5555-5555-000000000023', 3, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000012', '55555555-5555-5555-5555-000000000023', 3, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000012', '55555555-5555-5555-5555-000000000024', 3, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000012', '55555555-5555-5555-5555-000000000023', 4, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000012', '55555555-5555-5555-5555-000000000023', 4, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000012', '55555555-5555-5555-5555-000000000024', 4, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000012', '55555555-5555-5555-5555-000000000023', 5, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000012', '55555555-5555-5555-5555-000000000023', 5, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000012', '55555555-5555-5555-5555-000000000024', 5, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000012', '55555555-5555-5555-5555-000000000023', 6, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000012', '55555555-5555-5555-5555-000000000023', 6, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000012', '55555555-5555-5555-5555-000000000024', 6, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000012', '55555555-5555-5555-5555-000000000023', 7, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000012', '55555555-5555-5555-5555-000000000023', 7, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000012', '55555555-5555-5555-5555-000000000024', 7, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.courts (id, venue_id, name, court_type, status, created_at, updated_at) VALUES
('55555555-5555-5555-5555-000000000025', '44444444-4444-4444-4444-000000000013', 'Sân 1 - Bách Khoa', 'PREMIUM', 'ACTIVE', NOW(), NOW()),
('55555555-5555-5555-5555-000000000026', '44444444-4444-4444-4444-000000000013', 'Sân 2 - Bách Khoa', 'STANDARD', 'ACTIVE', NOW(), NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000013', '55555555-5555-5555-5555-000000000025', 1, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000013', '55555555-5555-5555-5555-000000000025', 1, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000013', '55555555-5555-5555-5555-000000000026', 1, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000013', '55555555-5555-5555-5555-000000000025', 2, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000013', '55555555-5555-5555-5555-000000000025', 2, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000013', '55555555-5555-5555-5555-000000000026', 2, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000013', '55555555-5555-5555-5555-000000000025', 3, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000013', '55555555-5555-5555-5555-000000000025', 3, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000013', '55555555-5555-5555-5555-000000000026', 3, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000013', '55555555-5555-5555-5555-000000000025', 4, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000013', '55555555-5555-5555-5555-000000000025', 4, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000013', '55555555-5555-5555-5555-000000000026', 4, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000013', '55555555-5555-5555-5555-000000000025', 5, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000013', '55555555-5555-5555-5555-000000000025', 5, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000013', '55555555-5555-5555-5555-000000000026', 5, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000013', '55555555-5555-5555-5555-000000000025', 6, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000013', '55555555-5555-5555-5555-000000000025', 6, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000013', '55555555-5555-5555-5555-000000000026', 6, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000013', '55555555-5555-5555-5555-000000000025', 7, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000013', '55555555-5555-5555-5555-000000000025', 7, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000013', '55555555-5555-5555-5555-000000000026', 7, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.courts (id, venue_id, name, court_type, status, created_at, updated_at) VALUES
('55555555-5555-5555-5555-000000000027', '44444444-4444-4444-4444-000000000014', 'Sân 1 - Long Biên', 'PREMIUM', 'ACTIVE', NOW(), NOW()),
('55555555-5555-5555-5555-000000000028', '44444444-4444-4444-4444-000000000014', 'Sân 2 - Long Biên', 'STANDARD', 'ACTIVE', NOW(), NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000014', '55555555-5555-5555-5555-000000000027', 1, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000014', '55555555-5555-5555-5555-000000000027', 1, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000014', '55555555-5555-5555-5555-000000000028', 1, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000014', '55555555-5555-5555-5555-000000000027', 2, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000014', '55555555-5555-5555-5555-000000000027', 2, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000014', '55555555-5555-5555-5555-000000000028', 2, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000014', '55555555-5555-5555-5555-000000000027', 3, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000014', '55555555-5555-5555-5555-000000000027', 3, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000014', '55555555-5555-5555-5555-000000000028', 3, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000014', '55555555-5555-5555-5555-000000000027', 4, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000014', '55555555-5555-5555-5555-000000000027', 4, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000014', '55555555-5555-5555-5555-000000000028', 4, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000014', '55555555-5555-5555-5555-000000000027', 5, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000014', '55555555-5555-5555-5555-000000000027', 5, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000014', '55555555-5555-5555-5555-000000000028', 5, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000014', '55555555-5555-5555-5555-000000000027', 6, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000014', '55555555-5555-5555-5555-000000000027', 6, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000014', '55555555-5555-5555-5555-000000000028', 6, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000014', '55555555-5555-5555-5555-000000000027', 7, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000014', '55555555-5555-5555-5555-000000000027', 7, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000014', '55555555-5555-5555-5555-000000000028', 7, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.courts (id, venue_id, name, court_type, status, created_at, updated_at) VALUES
('55555555-5555-5555-5555-000000000029', '44444444-4444-4444-4444-000000000015', 'Sân 1 - Gia Lâm', 'PREMIUM', 'ACTIVE', NOW(), NOW()),
('55555555-5555-5555-5555-000000000030', '44444444-4444-4444-4444-000000000015', 'Sân 2 - Gia Lâm', 'STANDARD', 'ACTIVE', NOW(), NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000015', '55555555-5555-5555-5555-000000000029', 1, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000015', '55555555-5555-5555-5555-000000000029', 1, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000015', '55555555-5555-5555-5555-000000000030', 1, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000015', '55555555-5555-5555-5555-000000000029', 2, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000015', '55555555-5555-5555-5555-000000000029', 2, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000015', '55555555-5555-5555-5555-000000000030', 2, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000015', '55555555-5555-5555-5555-000000000029', 3, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000015', '55555555-5555-5555-5555-000000000029', 3, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000015', '55555555-5555-5555-5555-000000000030', 3, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000015', '55555555-5555-5555-5555-000000000029', 4, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000015', '55555555-5555-5555-5555-000000000029', 4, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000015', '55555555-5555-5555-5555-000000000030', 4, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000015', '55555555-5555-5555-5555-000000000029', 5, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000015', '55555555-5555-5555-5555-000000000029', 5, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000015', '55555555-5555-5555-5555-000000000030', 5, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000015', '55555555-5555-5555-5555-000000000029', 6, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000015', '55555555-5555-5555-5555-000000000029', 6, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000015', '55555555-5555-5555-5555-000000000030', 6, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000015', '55555555-5555-5555-5555-000000000029', 7, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000015', '55555555-5555-5555-5555-000000000029', 7, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000015', '55555555-5555-5555-5555-000000000030', 7, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.courts (id, venue_id, name, court_type, status, created_at, updated_at) VALUES
('55555555-5555-5555-5555-000000000031', '44444444-4444-4444-4444-000000000016', 'Sân 1 - Hoàng Mai', 'PREMIUM', 'ACTIVE', NOW(), NOW()),
('55555555-5555-5555-5555-000000000032', '44444444-4444-4444-4444-000000000016', 'Sân 2 - Hoàng Mai', 'STANDARD', 'ACTIVE', NOW(), NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000016', '55555555-5555-5555-5555-000000000031', 1, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000016', '55555555-5555-5555-5555-000000000031', 1, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000016', '55555555-5555-5555-5555-000000000032', 1, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000016', '55555555-5555-5555-5555-000000000031', 2, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000016', '55555555-5555-5555-5555-000000000031', 2, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000016', '55555555-5555-5555-5555-000000000032', 2, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000016', '55555555-5555-5555-5555-000000000031', 3, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000016', '55555555-5555-5555-5555-000000000031', 3, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000016', '55555555-5555-5555-5555-000000000032', 3, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000016', '55555555-5555-5555-5555-000000000031', 4, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000016', '55555555-5555-5555-5555-000000000031', 4, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000016', '55555555-5555-5555-5555-000000000032', 4, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000016', '55555555-5555-5555-5555-000000000031', 5, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000016', '55555555-5555-5555-5555-000000000031', 5, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000016', '55555555-5555-5555-5555-000000000032', 5, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000016', '55555555-5555-5555-5555-000000000031', 6, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000016', '55555555-5555-5555-5555-000000000031', 6, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000016', '55555555-5555-5555-5555-000000000032', 6, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000016', '55555555-5555-5555-5555-000000000031', 7, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000016', '55555555-5555-5555-5555-000000000031', 7, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000016', '55555555-5555-5555-5555-000000000032', 7, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.courts (id, venue_id, name, court_type, status, created_at, updated_at) VALUES
('55555555-5555-5555-5555-000000000033', '44444444-4444-4444-4444-000000000017', 'Sân 1 - Linh Đàm', 'PREMIUM', 'ACTIVE', NOW(), NOW()),
('55555555-5555-5555-5555-000000000034', '44444444-4444-4444-4444-000000000017', 'Sân 2 - Linh Đàm', 'STANDARD', 'ACTIVE', NOW(), NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000017', '55555555-5555-5555-5555-000000000033', 1, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000017', '55555555-5555-5555-5555-000000000033', 1, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000017', '55555555-5555-5555-5555-000000000034', 1, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000017', '55555555-5555-5555-5555-000000000033', 2, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000017', '55555555-5555-5555-5555-000000000033', 2, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000017', '55555555-5555-5555-5555-000000000034', 2, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000017', '55555555-5555-5555-5555-000000000033', 3, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000017', '55555555-5555-5555-5555-000000000033', 3, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000017', '55555555-5555-5555-5555-000000000034', 3, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000017', '55555555-5555-5555-5555-000000000033', 4, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000017', '55555555-5555-5555-5555-000000000033', 4, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000017', '55555555-5555-5555-5555-000000000034', 4, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000017', '55555555-5555-5555-5555-000000000033', 5, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000017', '55555555-5555-5555-5555-000000000033', 5, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000017', '55555555-5555-5555-5555-000000000034', 5, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000017', '55555555-5555-5555-5555-000000000033', 6, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000017', '55555555-5555-5555-5555-000000000033', 6, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000017', '55555555-5555-5555-5555-000000000034', 6, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000017', '55555555-5555-5555-5555-000000000033', 7, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000017', '55555555-5555-5555-5555-000000000033', 7, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000017', '55555555-5555-5555-5555-000000000034', 7, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.courts (id, venue_id, name, court_type, status, created_at, updated_at) VALUES
('55555555-5555-5555-5555-000000000035', '44444444-4444-4444-4444-000000000018', 'Sân 1 - Thanh Trì', 'PREMIUM', 'ACTIVE', NOW(), NOW()),
('55555555-5555-5555-5555-000000000036', '44444444-4444-4444-4444-000000000018', 'Sân 2 - Thanh Trì', 'STANDARD', 'ACTIVE', NOW(), NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000018', '55555555-5555-5555-5555-000000000035', 1, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000018', '55555555-5555-5555-5555-000000000035', 1, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000018', '55555555-5555-5555-5555-000000000036', 1, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000018', '55555555-5555-5555-5555-000000000035', 2, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000018', '55555555-5555-5555-5555-000000000035', 2, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000018', '55555555-5555-5555-5555-000000000036', 2, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000018', '55555555-5555-5555-5555-000000000035', 3, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000018', '55555555-5555-5555-5555-000000000035', 3, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000018', '55555555-5555-5555-5555-000000000036', 3, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000018', '55555555-5555-5555-5555-000000000035', 4, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000018', '55555555-5555-5555-5555-000000000035', 4, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000018', '55555555-5555-5555-5555-000000000036', 4, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000018', '55555555-5555-5555-5555-000000000035', 5, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000018', '55555555-5555-5555-5555-000000000035', 5, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000018', '55555555-5555-5555-5555-000000000036', 5, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000018', '55555555-5555-5555-5555-000000000035', 6, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000018', '55555555-5555-5555-5555-000000000035', 6, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000018', '55555555-5555-5555-5555-000000000036', 6, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000018', '55555555-5555-5555-5555-000000000035', 7, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000018', '55555555-5555-5555-5555-000000000035', 7, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000018', '55555555-5555-5555-5555-000000000036', 7, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.courts (id, venue_id, name, court_type, status, created_at, updated_at) VALUES
('55555555-5555-5555-5555-000000000037', '44444444-4444-4444-4444-000000000019', 'Sân 1 - Đông Anh', 'PREMIUM', 'ACTIVE', NOW(), NOW()),
('55555555-5555-5555-5555-000000000038', '44444444-4444-4444-4444-000000000019', 'Sân 2 - Đông Anh', 'STANDARD', 'ACTIVE', NOW(), NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000019', '55555555-5555-5555-5555-000000000037', 1, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000019', '55555555-5555-5555-5555-000000000037', 1, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000019', '55555555-5555-5555-5555-000000000038', 1, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000019', '55555555-5555-5555-5555-000000000037', 2, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000019', '55555555-5555-5555-5555-000000000037', 2, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000019', '55555555-5555-5555-5555-000000000038', 2, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000019', '55555555-5555-5555-5555-000000000037', 3, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000019', '55555555-5555-5555-5555-000000000037', 3, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000019', '55555555-5555-5555-5555-000000000038', 3, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000019', '55555555-5555-5555-5555-000000000037', 4, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000019', '55555555-5555-5555-5555-000000000037', 4, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000019', '55555555-5555-5555-5555-000000000038', 4, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000019', '55555555-5555-5555-5555-000000000037', 5, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000019', '55555555-5555-5555-5555-000000000037', 5, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000019', '55555555-5555-5555-5555-000000000038', 5, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000019', '55555555-5555-5555-5555-000000000037', 6, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000019', '55555555-5555-5555-5555-000000000037', 6, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000019', '55555555-5555-5555-5555-000000000038', 6, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000019', '55555555-5555-5555-5555-000000000037', 7, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000019', '55555555-5555-5555-5555-000000000037', 7, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000019', '55555555-5555-5555-5555-000000000038', 7, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.courts (id, venue_id, name, court_type, status, created_at, updated_at) VALUES
('55555555-5555-5555-5555-000000000039', '44444444-4444-4444-4444-000000000020', 'Sân 1 - Sóc Sơn', 'PREMIUM', 'ACTIVE', NOW(), NOW()),
('55555555-5555-5555-5555-000000000040', '44444444-4444-4444-4444-000000000020', 'Sân 2 - Sóc Sơn', 'STANDARD', 'ACTIVE', NOW(), NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000020', '55555555-5555-5555-5555-000000000039', 1, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000020', '55555555-5555-5555-5555-000000000039', 1, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000020', '55555555-5555-5555-5555-000000000040', 1, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000020', '55555555-5555-5555-5555-000000000039', 2, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000020', '55555555-5555-5555-5555-000000000039', 2, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000020', '55555555-5555-5555-5555-000000000040', 2, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000020', '55555555-5555-5555-5555-000000000039', 3, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000020', '55555555-5555-5555-5555-000000000039', 3, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000020', '55555555-5555-5555-5555-000000000040', 3, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000020', '55555555-5555-5555-5555-000000000039', 4, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000020', '55555555-5555-5555-5555-000000000039', 4, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000020', '55555555-5555-5555-5555-000000000040', 4, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000020', '55555555-5555-5555-5555-000000000039', 5, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000020', '55555555-5555-5555-5555-000000000039', 5, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000020', '55555555-5555-5555-5555-000000000040', 5, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000020', '55555555-5555-5555-5555-000000000039', 6, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000020', '55555555-5555-5555-5555-000000000039', 6, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000020', '55555555-5555-5555-5555-000000000040', 6, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000020', '55555555-5555-5555-5555-000000000039', 7, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000020', '55555555-5555-5555-5555-000000000039', 7, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000020', '55555555-5555-5555-5555-000000000040', 7, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.courts (id, venue_id, name, court_type, status, created_at, updated_at) VALUES
('55555555-5555-5555-5555-000000000041', '44444444-4444-4444-4444-000000000021', 'Sân 1 - Hoài Đức', 'PREMIUM', 'ACTIVE', NOW(), NOW()),
('55555555-5555-5555-5555-000000000042', '44444444-4444-4444-4444-000000000021', 'Sân 2 - Hoài Đức', 'STANDARD', 'ACTIVE', NOW(), NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000021', '55555555-5555-5555-5555-000000000041', 1, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000021', '55555555-5555-5555-5555-000000000041', 1, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000021', '55555555-5555-5555-5555-000000000042', 1, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000021', '55555555-5555-5555-5555-000000000041', 2, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000021', '55555555-5555-5555-5555-000000000041', 2, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000021', '55555555-5555-5555-5555-000000000042', 2, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000021', '55555555-5555-5555-5555-000000000041', 3, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000021', '55555555-5555-5555-5555-000000000041', 3, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000021', '55555555-5555-5555-5555-000000000042', 3, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000021', '55555555-5555-5555-5555-000000000041', 4, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000021', '55555555-5555-5555-5555-000000000041', 4, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000021', '55555555-5555-5555-5555-000000000042', 4, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000021', '55555555-5555-5555-5555-000000000041', 5, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000021', '55555555-5555-5555-5555-000000000041', 5, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000021', '55555555-5555-5555-5555-000000000042', 5, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000021', '55555555-5555-5555-5555-000000000041', 6, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000021', '55555555-5555-5555-5555-000000000041', 6, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000021', '55555555-5555-5555-5555-000000000042', 6, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000021', '55555555-5555-5555-5555-000000000041', 7, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000021', '55555555-5555-5555-5555-000000000041', 7, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000021', '55555555-5555-5555-5555-000000000042', 7, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.courts (id, venue_id, name, court_type, status, created_at, updated_at) VALUES
('55555555-5555-5555-5555-000000000043', '44444444-4444-4444-4444-000000000022', 'Sân 1 - Đan Phượng', 'PREMIUM', 'ACTIVE', NOW(), NOW()),
('55555555-5555-5555-5555-000000000044', '44444444-4444-4444-4444-000000000022', 'Sân 2 - Đan Phượng', 'STANDARD', 'ACTIVE', NOW(), NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000022', '55555555-5555-5555-5555-000000000043', 1, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000022', '55555555-5555-5555-5555-000000000043', 1, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000022', '55555555-5555-5555-5555-000000000044', 1, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000022', '55555555-5555-5555-5555-000000000043', 2, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000022', '55555555-5555-5555-5555-000000000043', 2, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000022', '55555555-5555-5555-5555-000000000044', 2, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000022', '55555555-5555-5555-5555-000000000043', 3, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000022', '55555555-5555-5555-5555-000000000043', 3, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000022', '55555555-5555-5555-5555-000000000044', 3, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000022', '55555555-5555-5555-5555-000000000043', 4, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000022', '55555555-5555-5555-5555-000000000043', 4, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000022', '55555555-5555-5555-5555-000000000044', 4, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000022', '55555555-5555-5555-5555-000000000043', 5, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000022', '55555555-5555-5555-5555-000000000043', 5, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000022', '55555555-5555-5555-5555-000000000044', 5, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000022', '55555555-5555-5555-5555-000000000043', 6, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000022', '55555555-5555-5555-5555-000000000043', 6, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000022', '55555555-5555-5555-5555-000000000044', 6, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000022', '55555555-5555-5555-5555-000000000043', 7, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000022', '55555555-5555-5555-5555-000000000043', 7, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000022', '55555555-5555-5555-5555-000000000044', 7, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.courts (id, venue_id, name, court_type, status, created_at, updated_at) VALUES
('55555555-5555-5555-5555-000000000045', '44444444-4444-4444-4444-000000000023', 'Sân 1 - Quốc Oai', 'PREMIUM', 'ACTIVE', NOW(), NOW()),
('55555555-5555-5555-5555-000000000046', '44444444-4444-4444-4444-000000000023', 'Sân 2 - Quốc Oai', 'STANDARD', 'ACTIVE', NOW(), NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000023', '55555555-5555-5555-5555-000000000045', 1, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000023', '55555555-5555-5555-5555-000000000045', 1, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000023', '55555555-5555-5555-5555-000000000046', 1, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000023', '55555555-5555-5555-5555-000000000045', 2, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000023', '55555555-5555-5555-5555-000000000045', 2, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000023', '55555555-5555-5555-5555-000000000046', 2, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000023', '55555555-5555-5555-5555-000000000045', 3, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000023', '55555555-5555-5555-5555-000000000045', 3, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000023', '55555555-5555-5555-5555-000000000046', 3, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000023', '55555555-5555-5555-5555-000000000045', 4, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000023', '55555555-5555-5555-5555-000000000045', 4, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000023', '55555555-5555-5555-5555-000000000046', 4, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000023', '55555555-5555-5555-5555-000000000045', 5, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000023', '55555555-5555-5555-5555-000000000045', 5, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000023', '55555555-5555-5555-5555-000000000046', 5, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000023', '55555555-5555-5555-5555-000000000045', 6, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000023', '55555555-5555-5555-5555-000000000045', 6, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000023', '55555555-5555-5555-5555-000000000046', 6, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000023', '55555555-5555-5555-5555-000000000045', 7, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000023', '55555555-5555-5555-5555-000000000045', 7, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000023', '55555555-5555-5555-5555-000000000046', 7, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.courts (id, venue_id, name, court_type, status, created_at, updated_at) VALUES
('55555555-5555-5555-5555-000000000047', '44444444-4444-4444-4444-000000000024', 'Sân 1 - Thạch Thất', 'PREMIUM', 'ACTIVE', NOW(), NOW()),
('55555555-5555-5555-5555-000000000048', '44444444-4444-4444-4444-000000000024', 'Sân 2 - Thạch Thất', 'STANDARD', 'ACTIVE', NOW(), NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000024', '55555555-5555-5555-5555-000000000047', 1, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000024', '55555555-5555-5555-5555-000000000047', 1, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000024', '55555555-5555-5555-5555-000000000048', 1, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000024', '55555555-5555-5555-5555-000000000047', 2, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000024', '55555555-5555-5555-5555-000000000047', 2, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000024', '55555555-5555-5555-5555-000000000048', 2, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000024', '55555555-5555-5555-5555-000000000047', 3, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000024', '55555555-5555-5555-5555-000000000047', 3, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000024', '55555555-5555-5555-5555-000000000048', 3, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000024', '55555555-5555-5555-5555-000000000047', 4, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000024', '55555555-5555-5555-5555-000000000047', 4, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000024', '55555555-5555-5555-5555-000000000048', 4, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000024', '55555555-5555-5555-5555-000000000047', 5, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000024', '55555555-5555-5555-5555-000000000047', 5, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000024', '55555555-5555-5555-5555-000000000048', 5, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000024', '55555555-5555-5555-5555-000000000047', 6, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000024', '55555555-5555-5555-5555-000000000047', 6, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000024', '55555555-5555-5555-5555-000000000048', 6, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000024', '55555555-5555-5555-5555-000000000047', 7, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000024', '55555555-5555-5555-5555-000000000047', 7, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000024', '55555555-5555-5555-5555-000000000048', 7, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.courts (id, venue_id, name, court_type, status, created_at, updated_at) VALUES
('55555555-5555-5555-5555-000000000049', '44444444-4444-4444-4444-000000000025', 'Sân 1 - Chương Mỹ', 'PREMIUM', 'ACTIVE', NOW(), NOW()),
('55555555-5555-5555-5555-000000000050', '44444444-4444-4444-4444-000000000025', 'Sân 2 - Chương Mỹ', 'STANDARD', 'ACTIVE', NOW(), NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000025', '55555555-5555-5555-5555-000000000049', 1, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000025', '55555555-5555-5555-5555-000000000049', 1, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000025', '55555555-5555-5555-5555-000000000050', 1, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000025', '55555555-5555-5555-5555-000000000049', 2, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000025', '55555555-5555-5555-5555-000000000049', 2, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000025', '55555555-5555-5555-5555-000000000050', 2, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000025', '55555555-5555-5555-5555-000000000049', 3, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000025', '55555555-5555-5555-5555-000000000049', 3, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000025', '55555555-5555-5555-5555-000000000050', 3, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000025', '55555555-5555-5555-5555-000000000049', 4, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000025', '55555555-5555-5555-5555-000000000049', 4, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000025', '55555555-5555-5555-5555-000000000050', 4, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000025', '55555555-5555-5555-5555-000000000049', 5, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000025', '55555555-5555-5555-5555-000000000049', 5, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000025', '55555555-5555-5555-5555-000000000050', 5, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000025', '55555555-5555-5555-5555-000000000049', 6, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000025', '55555555-5555-5555-5555-000000000049', 6, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000025', '55555555-5555-5555-5555-000000000050', 6, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000025', '55555555-5555-5555-5555-000000000049', 7, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000025', '55555555-5555-5555-5555-000000000049', 7, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000025', '55555555-5555-5555-5555-000000000050', 7, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.courts (id, venue_id, name, court_type, status, created_at, updated_at) VALUES
('55555555-5555-5555-5555-000000000051', '44444444-4444-4444-4444-000000000026', 'Sân 1 - Thanh Oai', 'PREMIUM', 'ACTIVE', NOW(), NOW()),
('55555555-5555-5555-5555-000000000052', '44444444-4444-4444-4444-000000000026', 'Sân 2 - Thanh Oai', 'STANDARD', 'ACTIVE', NOW(), NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000026', '55555555-5555-5555-5555-000000000051', 1, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000026', '55555555-5555-5555-5555-000000000051', 1, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000026', '55555555-5555-5555-5555-000000000052', 1, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000026', '55555555-5555-5555-5555-000000000051', 2, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000026', '55555555-5555-5555-5555-000000000051', 2, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000026', '55555555-5555-5555-5555-000000000052', 2, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000026', '55555555-5555-5555-5555-000000000051', 3, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000026', '55555555-5555-5555-5555-000000000051', 3, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000026', '55555555-5555-5555-5555-000000000052', 3, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000026', '55555555-5555-5555-5555-000000000051', 4, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000026', '55555555-5555-5555-5555-000000000051', 4, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000026', '55555555-5555-5555-5555-000000000052', 4, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000026', '55555555-5555-5555-5555-000000000051', 5, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000026', '55555555-5555-5555-5555-000000000051', 5, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000026', '55555555-5555-5555-5555-000000000052', 5, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000026', '55555555-5555-5555-5555-000000000051', 6, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000026', '55555555-5555-5555-5555-000000000051', 6, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000026', '55555555-5555-5555-5555-000000000052', 6, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000026', '55555555-5555-5555-5555-000000000051', 7, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000026', '55555555-5555-5555-5555-000000000051', 7, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000026', '55555555-5555-5555-5555-000000000052', 7, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.courts (id, venue_id, name, court_type, status, created_at, updated_at) VALUES
('55555555-5555-5555-5555-000000000053', '44444444-4444-4444-4444-000000000027', 'Sân 1 - Thường Tín', 'PREMIUM', 'ACTIVE', NOW(), NOW()),
('55555555-5555-5555-5555-000000000054', '44444444-4444-4444-4444-000000000027', 'Sân 2 - Thường Tín', 'STANDARD', 'ACTIVE', NOW(), NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000027', '55555555-5555-5555-5555-000000000053', 1, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000027', '55555555-5555-5555-5555-000000000053', 1, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000027', '55555555-5555-5555-5555-000000000054', 1, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000027', '55555555-5555-5555-5555-000000000053', 2, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000027', '55555555-5555-5555-5555-000000000053', 2, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000027', '55555555-5555-5555-5555-000000000054', 2, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000027', '55555555-5555-5555-5555-000000000053', 3, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000027', '55555555-5555-5555-5555-000000000053', 3, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000027', '55555555-5555-5555-5555-000000000054', 3, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000027', '55555555-5555-5555-5555-000000000053', 4, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000027', '55555555-5555-5555-5555-000000000053', 4, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000027', '55555555-5555-5555-5555-000000000054', 4, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000027', '55555555-5555-5555-5555-000000000053', 5, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000027', '55555555-5555-5555-5555-000000000053', 5, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000027', '55555555-5555-5555-5555-000000000054', 5, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000027', '55555555-5555-5555-5555-000000000053', 6, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000027', '55555555-5555-5555-5555-000000000053', 6, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000027', '55555555-5555-5555-5555-000000000054', 6, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000027', '55555555-5555-5555-5555-000000000053', 7, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000027', '55555555-5555-5555-5555-000000000053', 7, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000027', '55555555-5555-5555-5555-000000000054', 7, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.courts (id, venue_id, name, court_type, status, created_at, updated_at) VALUES
('55555555-5555-5555-5555-000000000055', '44444444-4444-4444-4444-000000000028', 'Sân 1 - Phú Xuyên', 'PREMIUM', 'ACTIVE', NOW(), NOW()),
('55555555-5555-5555-5555-000000000056', '44444444-4444-4444-4444-000000000028', 'Sân 2 - Phú Xuyên', 'STANDARD', 'ACTIVE', NOW(), NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000028', '55555555-5555-5555-5555-000000000055', 1, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000028', '55555555-5555-5555-5555-000000000055', 1, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000028', '55555555-5555-5555-5555-000000000056', 1, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000028', '55555555-5555-5555-5555-000000000055', 2, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000028', '55555555-5555-5555-5555-000000000055', 2, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000028', '55555555-5555-5555-5555-000000000056', 2, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000028', '55555555-5555-5555-5555-000000000055', 3, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000028', '55555555-5555-5555-5555-000000000055', 3, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000028', '55555555-5555-5555-5555-000000000056', 3, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000028', '55555555-5555-5555-5555-000000000055', 4, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000028', '55555555-5555-5555-5555-000000000055', 4, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000028', '55555555-5555-5555-5555-000000000056', 4, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000028', '55555555-5555-5555-5555-000000000055', 5, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000028', '55555555-5555-5555-5555-000000000055', 5, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000028', '55555555-5555-5555-5555-000000000056', 5, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000028', '55555555-5555-5555-5555-000000000055', 6, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000028', '55555555-5555-5555-5555-000000000055', 6, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000028', '55555555-5555-5555-5555-000000000056', 6, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000028', '55555555-5555-5555-5555-000000000055', 7, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000028', '55555555-5555-5555-5555-000000000055', 7, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000028', '55555555-5555-5555-5555-000000000056', 7, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.courts (id, venue_id, name, court_type, status, created_at, updated_at) VALUES
('55555555-5555-5555-5555-000000000057', '44444444-4444-4444-4444-000000000029', 'Sân 1 - Ứng Hòa', 'PREMIUM', 'ACTIVE', NOW(), NOW()),
('55555555-5555-5555-5555-000000000058', '44444444-4444-4444-4444-000000000029', 'Sân 2 - Ứng Hòa', 'STANDARD', 'ACTIVE', NOW(), NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000029', '55555555-5555-5555-5555-000000000057', 1, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000029', '55555555-5555-5555-5555-000000000057', 1, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000029', '55555555-5555-5555-5555-000000000058', 1, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000029', '55555555-5555-5555-5555-000000000057', 2, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000029', '55555555-5555-5555-5555-000000000057', 2, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000029', '55555555-5555-5555-5555-000000000058', 2, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000029', '55555555-5555-5555-5555-000000000057', 3, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000029', '55555555-5555-5555-5555-000000000057', 3, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000029', '55555555-5555-5555-5555-000000000058', 3, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000029', '55555555-5555-5555-5555-000000000057', 4, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000029', '55555555-5555-5555-5555-000000000057', 4, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000029', '55555555-5555-5555-5555-000000000058', 4, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000029', '55555555-5555-5555-5555-000000000057', 5, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000029', '55555555-5555-5555-5555-000000000057', 5, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000029', '55555555-5555-5555-5555-000000000058', 5, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000029', '55555555-5555-5555-5555-000000000057', 6, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000029', '55555555-5555-5555-5555-000000000057', 6, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000029', '55555555-5555-5555-5555-000000000058', 6, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000029', '55555555-5555-5555-5555-000000000057', 7, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000029', '55555555-5555-5555-5555-000000000057', 7, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000029', '55555555-5555-5555-5555-000000000058', 7, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.courts (id, venue_id, name, court_type, status, created_at, updated_at) VALUES
('55555555-5555-5555-5555-000000000059', '44444444-4444-4444-4444-000000000030', 'Sân 1 - Mỹ Đức', 'PREMIUM', 'ACTIVE', NOW(), NOW()),
('55555555-5555-5555-5555-000000000060', '44444444-4444-4444-4444-000000000030', 'Sân 2 - Mỹ Đức', 'STANDARD', 'ACTIVE', NOW(), NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000030', '55555555-5555-5555-5555-000000000059', 1, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000030', '55555555-5555-5555-5555-000000000059', 1, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000030', '55555555-5555-5555-5555-000000000060', 1, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000030', '55555555-5555-5555-5555-000000000059', 2, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000030', '55555555-5555-5555-5555-000000000059', 2, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000030', '55555555-5555-5555-5555-000000000060', 2, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000030', '55555555-5555-5555-5555-000000000059', 3, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000030', '55555555-5555-5555-5555-000000000059', 3, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000030', '55555555-5555-5555-5555-000000000060', 3, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000030', '55555555-5555-5555-5555-000000000059', 4, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000030', '55555555-5555-5555-5555-000000000059', 4, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000030', '55555555-5555-5555-5555-000000000060', 4, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000030', '55555555-5555-5555-5555-000000000059', 5, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000030', '55555555-5555-5555-5555-000000000059', 5, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000030', '55555555-5555-5555-5555-000000000060', 5, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000030', '55555555-5555-5555-5555-000000000059', 6, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000030', '55555555-5555-5555-5555-000000000059', 6, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000030', '55555555-5555-5555-5555-000000000060', 6, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000030', '55555555-5555-5555-5555-000000000059', 7, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000030', '55555555-5555-5555-5555-000000000059', 7, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000030', '55555555-5555-5555-5555-000000000060', 7, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.courts (id, venue_id, name, court_type, status, created_at, updated_at) VALUES
('55555555-5555-5555-5555-000000000061', '44444444-4444-4444-4444-000000000031', 'Sân 1 - Sơn Tây', 'PREMIUM', 'ACTIVE', NOW(), NOW()),
('55555555-5555-5555-5555-000000000062', '44444444-4444-4444-4444-000000000031', 'Sân 2 - Sơn Tây', 'STANDARD', 'ACTIVE', NOW(), NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000031', '55555555-5555-5555-5555-000000000061', 1, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000031', '55555555-5555-5555-5555-000000000061', 1, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000031', '55555555-5555-5555-5555-000000000062', 1, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000031', '55555555-5555-5555-5555-000000000061', 2, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000031', '55555555-5555-5555-5555-000000000061', 2, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000031', '55555555-5555-5555-5555-000000000062', 2, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000031', '55555555-5555-5555-5555-000000000061', 3, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000031', '55555555-5555-5555-5555-000000000061', 3, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000031', '55555555-5555-5555-5555-000000000062', 3, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000031', '55555555-5555-5555-5555-000000000061', 4, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000031', '55555555-5555-5555-5555-000000000061', 4, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000031', '55555555-5555-5555-5555-000000000062', 4, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000031', '55555555-5555-5555-5555-000000000061', 5, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000031', '55555555-5555-5555-5555-000000000061', 5, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000031', '55555555-5555-5555-5555-000000000062', 5, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000031', '55555555-5555-5555-5555-000000000061', 6, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000031', '55555555-5555-5555-5555-000000000061', 6, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000031', '55555555-5555-5555-5555-000000000062', 6, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000031', '55555555-5555-5555-5555-000000000061', 7, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000031', '55555555-5555-5555-5555-000000000061', 7, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000031', '55555555-5555-5555-5555-000000000062', 7, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.courts (id, venue_id, name, court_type, status, created_at, updated_at) VALUES
('55555555-5555-5555-5555-000000000063', '44444444-4444-4444-4444-000000000032', 'Sân 1 - Ba Vì', 'PREMIUM', 'ACTIVE', NOW(), NOW()),
('55555555-5555-5555-5555-000000000064', '44444444-4444-4444-4444-000000000032', 'Sân 2 - Ba Vì', 'STANDARD', 'ACTIVE', NOW(), NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000032', '55555555-5555-5555-5555-000000000063', 1, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000032', '55555555-5555-5555-5555-000000000063', 1, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000032', '55555555-5555-5555-5555-000000000064', 1, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000032', '55555555-5555-5555-5555-000000000063', 2, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000032', '55555555-5555-5555-5555-000000000063', 2, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000032', '55555555-5555-5555-5555-000000000064', 2, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000032', '55555555-5555-5555-5555-000000000063', 3, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000032', '55555555-5555-5555-5555-000000000063', 3, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000032', '55555555-5555-5555-5555-000000000064', 3, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000032', '55555555-5555-5555-5555-000000000063', 4, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000032', '55555555-5555-5555-5555-000000000063', 4, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000032', '55555555-5555-5555-5555-000000000064', 4, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000032', '55555555-5555-5555-5555-000000000063', 5, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000032', '55555555-5555-5555-5555-000000000063', 5, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000032', '55555555-5555-5555-5555-000000000064', 5, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000032', '55555555-5555-5555-5555-000000000063', 6, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000032', '55555555-5555-5555-5555-000000000063', 6, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000032', '55555555-5555-5555-5555-000000000064', 6, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000032', '55555555-5555-5555-5555-000000000063', 7, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000032', '55555555-5555-5555-5555-000000000063', 7, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000032', '55555555-5555-5555-5555-000000000064', 7, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.courts (id, venue_id, name, court_type, status, created_at, updated_at) VALUES
('55555555-5555-5555-5555-000000000065', '44444444-4444-4444-4444-000000000033', 'Sân 1 - Phúc Thọ', 'PREMIUM', 'ACTIVE', NOW(), NOW()),
('55555555-5555-5555-5555-000000000066', '44444444-4444-4444-4444-000000000033', 'Sân 2 - Phúc Thọ', 'STANDARD', 'ACTIVE', NOW(), NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000033', '55555555-5555-5555-5555-000000000065', 1, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000033', '55555555-5555-5555-5555-000000000065', 1, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000033', '55555555-5555-5555-5555-000000000066', 1, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000033', '55555555-5555-5555-5555-000000000065', 2, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000033', '55555555-5555-5555-5555-000000000065', 2, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000033', '55555555-5555-5555-5555-000000000066', 2, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000033', '55555555-5555-5555-5555-000000000065', 3, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000033', '55555555-5555-5555-5555-000000000065', 3, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000033', '55555555-5555-5555-5555-000000000066', 3, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000033', '55555555-5555-5555-5555-000000000065', 4, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000033', '55555555-5555-5555-5555-000000000065', 4, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000033', '55555555-5555-5555-5555-000000000066', 4, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000033', '55555555-5555-5555-5555-000000000065', 5, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000033', '55555555-5555-5555-5555-000000000065', 5, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000033', '55555555-5555-5555-5555-000000000066', 5, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000033', '55555555-5555-5555-5555-000000000065', 6, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000033', '55555555-5555-5555-5555-000000000065', 6, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000033', '55555555-5555-5555-5555-000000000066', 6, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000033', '55555555-5555-5555-5555-000000000065', 7, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000033', '55555555-5555-5555-5555-000000000065', 7, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000033', '55555555-5555-5555-5555-000000000066', 7, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.courts (id, venue_id, name, court_type, status, created_at, updated_at) VALUES
('55555555-5555-5555-5555-000000000067', '44444444-4444-4444-4444-000000000034', 'Sân 1 - Mê Linh', 'PREMIUM', 'ACTIVE', NOW(), NOW()),
('55555555-5555-5555-5555-000000000068', '44444444-4444-4444-4444-000000000034', 'Sân 2 - Mê Linh', 'STANDARD', 'ACTIVE', NOW(), NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000034', '55555555-5555-5555-5555-000000000067', 1, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000034', '55555555-5555-5555-5555-000000000067', 1, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000034', '55555555-5555-5555-5555-000000000068', 1, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000034', '55555555-5555-5555-5555-000000000067', 2, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000034', '55555555-5555-5555-5555-000000000067', 2, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000034', '55555555-5555-5555-5555-000000000068', 2, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000034', '55555555-5555-5555-5555-000000000067', 3, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000034', '55555555-5555-5555-5555-000000000067', 3, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000034', '55555555-5555-5555-5555-000000000068', 3, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000034', '55555555-5555-5555-5555-000000000067', 4, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000034', '55555555-5555-5555-5555-000000000067', 4, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000034', '55555555-5555-5555-5555-000000000068', 4, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000034', '55555555-5555-5555-5555-000000000067', 5, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000034', '55555555-5555-5555-5555-000000000067', 5, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000034', '55555555-5555-5555-5555-000000000068', 5, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000034', '55555555-5555-5555-5555-000000000067', 6, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000034', '55555555-5555-5555-5555-000000000067', 6, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000034', '55555555-5555-5555-5555-000000000068', 6, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000034', '55555555-5555-5555-5555-000000000067', 7, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000034', '55555555-5555-5555-5555-000000000067', 7, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000034', '55555555-5555-5555-5555-000000000068', 7, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.courts (id, venue_id, name, court_type, status, created_at, updated_at) VALUES
('55555555-5555-5555-5555-000000000069', '44444444-4444-4444-4444-000000000035', 'Sân 1 - Nội Bài', 'PREMIUM', 'ACTIVE', NOW(), NOW()),
('55555555-5555-5555-5555-000000000070', '44444444-4444-4444-4444-000000000035', 'Sân 2 - Nội Bài', 'STANDARD', 'ACTIVE', NOW(), NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000035', '55555555-5555-5555-5555-000000000069', 1, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000035', '55555555-5555-5555-5555-000000000069', 1, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000035', '55555555-5555-5555-5555-000000000070', 1, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000035', '55555555-5555-5555-5555-000000000069', 2, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000035', '55555555-5555-5555-5555-000000000069', 2, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000035', '55555555-5555-5555-5555-000000000070', 2, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000035', '55555555-5555-5555-5555-000000000069', 3, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000035', '55555555-5555-5555-5555-000000000069', 3, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000035', '55555555-5555-5555-5555-000000000070', 3, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000035', '55555555-5555-5555-5555-000000000069', 4, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000035', '55555555-5555-5555-5555-000000000069', 4, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000035', '55555555-5555-5555-5555-000000000070', 4, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000035', '55555555-5555-5555-5555-000000000069', 5, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000035', '55555555-5555-5555-5555-000000000069', 5, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000035', '55555555-5555-5555-5555-000000000070', 5, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000035', '55555555-5555-5555-5555-000000000069', 6, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000035', '55555555-5555-5555-5555-000000000069', 6, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000035', '55555555-5555-5555-5555-000000000070', 6, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000035', '55555555-5555-5555-5555-000000000069', 7, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000035', '55555555-5555-5555-5555-000000000069', 7, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000035', '55555555-5555-5555-5555-000000000070', 7, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.courts (id, venue_id, name, court_type, status, created_at, updated_at) VALUES
('55555555-5555-5555-5555-000000000071', '44444444-4444-4444-4444-000000000036', 'Sân 1 - Khương Đình', 'PREMIUM', 'ACTIVE', NOW(), NOW()),
('55555555-5555-5555-5555-000000000072', '44444444-4444-4444-4444-000000000036', 'Sân 2 - Khương Đình', 'STANDARD', 'ACTIVE', NOW(), NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000036', '55555555-5555-5555-5555-000000000071', 1, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000036', '55555555-5555-5555-5555-000000000071', 1, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000036', '55555555-5555-5555-5555-000000000072', 1, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000036', '55555555-5555-5555-5555-000000000071', 2, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000036', '55555555-5555-5555-5555-000000000071', 2, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000036', '55555555-5555-5555-5555-000000000072', 2, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000036', '55555555-5555-5555-5555-000000000071', 3, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000036', '55555555-5555-5555-5555-000000000071', 3, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000036', '55555555-5555-5555-5555-000000000072', 3, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000036', '55555555-5555-5555-5555-000000000071', 4, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000036', '55555555-5555-5555-5555-000000000071', 4, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000036', '55555555-5555-5555-5555-000000000072', 4, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000036', '55555555-5555-5555-5555-000000000071', 5, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000036', '55555555-5555-5555-5555-000000000071', 5, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000036', '55555555-5555-5555-5555-000000000072', 5, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000036', '55555555-5555-5555-5555-000000000071', 6, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000036', '55555555-5555-5555-5555-000000000071', 6, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000036', '55555555-5555-5555-5555-000000000072', 6, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000036', '55555555-5555-5555-5555-000000000071', 7, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000036', '55555555-5555-5555-5555-000000000071', 7, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000036', '55555555-5555-5555-5555-000000000072', 7, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.courts (id, venue_id, name, court_type, status, created_at, updated_at) VALUES
('55555555-5555-5555-5555-000000000073', '44444444-4444-4444-4444-000000000037', 'Sân 1 - Định Công', 'PREMIUM', 'ACTIVE', NOW(), NOW()),
('55555555-5555-5555-5555-000000000074', '44444444-4444-4444-4444-000000000037', 'Sân 2 - Định Công', 'STANDARD', 'ACTIVE', NOW(), NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000037', '55555555-5555-5555-5555-000000000073', 1, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000037', '55555555-5555-5555-5555-000000000073', 1, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000037', '55555555-5555-5555-5555-000000000074', 1, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000037', '55555555-5555-5555-5555-000000000073', 2, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000037', '55555555-5555-5555-5555-000000000073', 2, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000037', '55555555-5555-5555-5555-000000000074', 2, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000037', '55555555-5555-5555-5555-000000000073', 3, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000037', '55555555-5555-5555-5555-000000000073', 3, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000037', '55555555-5555-5555-5555-000000000074', 3, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000037', '55555555-5555-5555-5555-000000000073', 4, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000037', '55555555-5555-5555-5555-000000000073', 4, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000037', '55555555-5555-5555-5555-000000000074', 4, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000037', '55555555-5555-5555-5555-000000000073', 5, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000037', '55555555-5555-5555-5555-000000000073', 5, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000037', '55555555-5555-5555-5555-000000000074', 5, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000037', '55555555-5555-5555-5555-000000000073', 6, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000037', '55555555-5555-5555-5555-000000000073', 6, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000037', '55555555-5555-5555-5555-000000000074', 6, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000037', '55555555-5555-5555-5555-000000000073', 7, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000037', '55555555-5555-5555-5555-000000000073', 7, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000037', '55555555-5555-5555-5555-000000000074', 7, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.courts (id, venue_id, name, court_type, status, created_at, updated_at) VALUES
('55555555-5555-5555-5555-000000000075', '44444444-4444-4444-4444-000000000038', 'Sân 1 - Giáp Bát', 'PREMIUM', 'ACTIVE', NOW(), NOW()),
('55555555-5555-5555-5555-000000000076', '44444444-4444-4444-4444-000000000038', 'Sân 2 - Giáp Bát', 'STANDARD', 'ACTIVE', NOW(), NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000038', '55555555-5555-5555-5555-000000000075', 1, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000038', '55555555-5555-5555-5555-000000000075', 1, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000038', '55555555-5555-5555-5555-000000000076', 1, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000038', '55555555-5555-5555-5555-000000000075', 2, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000038', '55555555-5555-5555-5555-000000000075', 2, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000038', '55555555-5555-5555-5555-000000000076', 2, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000038', '55555555-5555-5555-5555-000000000075', 3, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000038', '55555555-5555-5555-5555-000000000075', 3, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000038', '55555555-5555-5555-5555-000000000076', 3, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000038', '55555555-5555-5555-5555-000000000075', 4, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000038', '55555555-5555-5555-5555-000000000075', 4, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000038', '55555555-5555-5555-5555-000000000076', 4, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000038', '55555555-5555-5555-5555-000000000075', 5, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000038', '55555555-5555-5555-5555-000000000075', 5, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000038', '55555555-5555-5555-5555-000000000076', 5, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000038', '55555555-5555-5555-5555-000000000075', 6, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000038', '55555555-5555-5555-5555-000000000075', 6, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000038', '55555555-5555-5555-5555-000000000076', 6, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000038', '55555555-5555-5555-5555-000000000075', 7, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000038', '55555555-5555-5555-5555-000000000075', 7, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000038', '55555555-5555-5555-5555-000000000076', 7, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.courts (id, venue_id, name, court_type, status, created_at, updated_at) VALUES
('55555555-5555-5555-5555-000000000077', '44444444-4444-4444-4444-000000000039', 'Sân 1 - Mai Dịch', 'PREMIUM', 'ACTIVE', NOW(), NOW()),
('55555555-5555-5555-5555-000000000078', '44444444-4444-4444-4444-000000000039', 'Sân 2 - Mai Dịch', 'STANDARD', 'ACTIVE', NOW(), NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000039', '55555555-5555-5555-5555-000000000077', 1, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000039', '55555555-5555-5555-5555-000000000077', 1, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000039', '55555555-5555-5555-5555-000000000078', 1, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000039', '55555555-5555-5555-5555-000000000077', 2, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000039', '55555555-5555-5555-5555-000000000077', 2, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000039', '55555555-5555-5555-5555-000000000078', 2, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000039', '55555555-5555-5555-5555-000000000077', 3, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000039', '55555555-5555-5555-5555-000000000077', 3, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000039', '55555555-5555-5555-5555-000000000078', 3, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000039', '55555555-5555-5555-5555-000000000077', 4, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000039', '55555555-5555-5555-5555-000000000077', 4, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000039', '55555555-5555-5555-5555-000000000078', 4, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000039', '55555555-5555-5555-5555-000000000077', 5, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000039', '55555555-5555-5555-5555-000000000077', 5, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000039', '55555555-5555-5555-5555-000000000078', 5, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000039', '55555555-5555-5555-5555-000000000077', 6, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000039', '55555555-5555-5555-5555-000000000077', 6, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000039', '55555555-5555-5555-5555-000000000078', 6, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000039', '55555555-5555-5555-5555-000000000077', 7, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000039', '55555555-5555-5555-5555-000000000077', 7, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000039', '55555555-5555-5555-5555-000000000078', 7, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.courts (id, venue_id, name, court_type, status, created_at, updated_at) VALUES
('55555555-5555-5555-5555-000000000079', '44444444-4444-4444-4444-000000000040', 'Sân 1 - Nghĩa Tân', 'PREMIUM', 'ACTIVE', NOW(), NOW()),
('55555555-5555-5555-5555-000000000080', '44444444-4444-4444-4444-000000000040', 'Sân 2 - Nghĩa Tân', 'STANDARD', 'ACTIVE', NOW(), NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000040', '55555555-5555-5555-5555-000000000079', 1, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000040', '55555555-5555-5555-5555-000000000079', 1, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000040', '55555555-5555-5555-5555-000000000080', 1, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000040', '55555555-5555-5555-5555-000000000079', 2, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000040', '55555555-5555-5555-5555-000000000079', 2, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000040', '55555555-5555-5555-5555-000000000080', 2, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000040', '55555555-5555-5555-5555-000000000079', 3, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000040', '55555555-5555-5555-5555-000000000079', 3, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000040', '55555555-5555-5555-5555-000000000080', 3, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000040', '55555555-5555-5555-5555-000000000079', 4, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000040', '55555555-5555-5555-5555-000000000079', 4, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000040', '55555555-5555-5555-5555-000000000080', 4, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000040', '55555555-5555-5555-5555-000000000079', 5, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000040', '55555555-5555-5555-5555-000000000079', 5, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000040', '55555555-5555-5555-5555-000000000080', 5, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000040', '55555555-5555-5555-5555-000000000079', 6, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000040', '55555555-5555-5555-5555-000000000079', 6, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000040', '55555555-5555-5555-5555-000000000080', 6, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000040', '55555555-5555-5555-5555-000000000079', 7, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000040', '55555555-5555-5555-5555-000000000079', 7, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000040', '55555555-5555-5555-5555-000000000080', 7, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.courts (id, venue_id, name, court_type, status, created_at, updated_at) VALUES
('55555555-5555-5555-5555-000000000081', '44444444-4444-4444-4444-000000000041', 'Sân 1 - Trung Hòa', 'PREMIUM', 'ACTIVE', NOW(), NOW()),
('55555555-5555-5555-5555-000000000082', '44444444-4444-4444-4444-000000000041', 'Sân 2 - Trung Hòa', 'STANDARD', 'ACTIVE', NOW(), NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000041', '55555555-5555-5555-5555-000000000081', 1, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000041', '55555555-5555-5555-5555-000000000081', 1, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000041', '55555555-5555-5555-5555-000000000082', 1, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000041', '55555555-5555-5555-5555-000000000081', 2, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000041', '55555555-5555-5555-5555-000000000081', 2, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000041', '55555555-5555-5555-5555-000000000082', 2, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000041', '55555555-5555-5555-5555-000000000081', 3, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000041', '55555555-5555-5555-5555-000000000081', 3, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000041', '55555555-5555-5555-5555-000000000082', 3, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000041', '55555555-5555-5555-5555-000000000081', 4, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000041', '55555555-5555-5555-5555-000000000081', 4, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000041', '55555555-5555-5555-5555-000000000082', 4, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000041', '55555555-5555-5555-5555-000000000081', 5, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000041', '55555555-5555-5555-5555-000000000081', 5, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000041', '55555555-5555-5555-5555-000000000082', 5, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000041', '55555555-5555-5555-5555-000000000081', 6, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000041', '55555555-5555-5555-5555-000000000081', 6, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000041', '55555555-5555-5555-5555-000000000082', 6, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000041', '55555555-5555-5555-5555-000000000081', 7, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000041', '55555555-5555-5555-5555-000000000081', 7, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000041', '55555555-5555-5555-5555-000000000082', 7, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.courts (id, venue_id, name, court_type, status, created_at, updated_at) VALUES
('55555555-5555-5555-5555-000000000083', '44444444-4444-4444-4444-000000000042', 'Sân 1 - Yên Hòa', 'PREMIUM', 'ACTIVE', NOW(), NOW()),
('55555555-5555-5555-5555-000000000084', '44444444-4444-4444-4444-000000000042', 'Sân 2 - Yên Hòa', 'STANDARD', 'ACTIVE', NOW(), NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000042', '55555555-5555-5555-5555-000000000083', 1, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000042', '55555555-5555-5555-5555-000000000083', 1, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000042', '55555555-5555-5555-5555-000000000084', 1, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000042', '55555555-5555-5555-5555-000000000083', 2, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000042', '55555555-5555-5555-5555-000000000083', 2, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000042', '55555555-5555-5555-5555-000000000084', 2, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000042', '55555555-5555-5555-5555-000000000083', 3, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000042', '55555555-5555-5555-5555-000000000083', 3, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000042', '55555555-5555-5555-5555-000000000084', 3, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000042', '55555555-5555-5555-5555-000000000083', 4, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000042', '55555555-5555-5555-5555-000000000083', 4, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000042', '55555555-5555-5555-5555-000000000084', 4, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000042', '55555555-5555-5555-5555-000000000083', 5, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000042', '55555555-5555-5555-5555-000000000083', 5, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000042', '55555555-5555-5555-5555-000000000084', 5, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000042', '55555555-5555-5555-5555-000000000083', 6, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000042', '55555555-5555-5555-5555-000000000083', 6, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000042', '55555555-5555-5555-5555-000000000084', 6, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000042', '55555555-5555-5555-5555-000000000083', 7, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000042', '55555555-5555-5555-5555-000000000083', 7, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000042', '55555555-5555-5555-5555-000000000084', 7, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.courts (id, venue_id, name, court_type, status, created_at, updated_at) VALUES
('55555555-5555-5555-5555-000000000085', '44444444-4444-4444-4444-000000000043', 'Sân 1 - Láng Hạ', 'PREMIUM', 'ACTIVE', NOW(), NOW()),
('55555555-5555-5555-5555-000000000086', '44444444-4444-4444-4444-000000000043', 'Sân 2 - Láng Hạ', 'STANDARD', 'ACTIVE', NOW(), NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000043', '55555555-5555-5555-5555-000000000085', 1, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000043', '55555555-5555-5555-5555-000000000085', 1, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000043', '55555555-5555-5555-5555-000000000086', 1, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000043', '55555555-5555-5555-5555-000000000085', 2, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000043', '55555555-5555-5555-5555-000000000085', 2, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000043', '55555555-5555-5555-5555-000000000086', 2, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000043', '55555555-5555-5555-5555-000000000085', 3, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000043', '55555555-5555-5555-5555-000000000085', 3, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000043', '55555555-5555-5555-5555-000000000086', 3, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000043', '55555555-5555-5555-5555-000000000085', 4, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000043', '55555555-5555-5555-5555-000000000085', 4, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000043', '55555555-5555-5555-5555-000000000086', 4, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000043', '55555555-5555-5555-5555-000000000085', 5, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000043', '55555555-5555-5555-5555-000000000085', 5, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000043', '55555555-5555-5555-5555-000000000086', 5, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000043', '55555555-5555-5555-5555-000000000085', 6, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000043', '55555555-5555-5555-5555-000000000085', 6, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000043', '55555555-5555-5555-5555-000000000086', 6, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000043', '55555555-5555-5555-5555-000000000085', 7, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000043', '55555555-5555-5555-5555-000000000085', 7, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000043', '55555555-5555-5555-5555-000000000086', 7, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.courts (id, venue_id, name, court_type, status, created_at, updated_at) VALUES
('55555555-5555-5555-5555-000000000087', '44444444-4444-4444-4444-000000000044', 'Sân 1 - Kim Liên', 'PREMIUM', 'ACTIVE', NOW(), NOW()),
('55555555-5555-5555-5555-000000000088', '44444444-4444-4444-4444-000000000044', 'Sân 2 - Kim Liên', 'STANDARD', 'ACTIVE', NOW(), NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000044', '55555555-5555-5555-5555-000000000087', 1, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000044', '55555555-5555-5555-5555-000000000087', 1, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000044', '55555555-5555-5555-5555-000000000088', 1, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000044', '55555555-5555-5555-5555-000000000087', 2, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000044', '55555555-5555-5555-5555-000000000087', 2, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000044', '55555555-5555-5555-5555-000000000088', 2, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000044', '55555555-5555-5555-5555-000000000087', 3, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000044', '55555555-5555-5555-5555-000000000087', 3, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000044', '55555555-5555-5555-5555-000000000088', 3, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000044', '55555555-5555-5555-5555-000000000087', 4, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000044', '55555555-5555-5555-5555-000000000087', 4, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000044', '55555555-5555-5555-5555-000000000088', 4, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000044', '55555555-5555-5555-5555-000000000087', 5, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000044', '55555555-5555-5555-5555-000000000087', 5, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000044', '55555555-5555-5555-5555-000000000088', 5, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000044', '55555555-5555-5555-5555-000000000087', 6, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000044', '55555555-5555-5555-5555-000000000087', 6, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000044', '55555555-5555-5555-5555-000000000088', 6, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000044', '55555555-5555-5555-5555-000000000087', 7, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000044', '55555555-5555-5555-5555-000000000087', 7, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000044', '55555555-5555-5555-5555-000000000088', 7, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.courts (id, venue_id, name, court_type, status, created_at, updated_at) VALUES
('55555555-5555-5555-5555-000000000089', '44444444-4444-4444-4444-000000000045', 'Sân 1 - Khương Thượng', 'PREMIUM', 'ACTIVE', NOW(), NOW()),
('55555555-5555-5555-5555-000000000090', '44444444-4444-4444-4444-000000000045', 'Sân 2 - Khương Thượng', 'STANDARD', 'ACTIVE', NOW(), NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000045', '55555555-5555-5555-5555-000000000089', 1, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000045', '55555555-5555-5555-5555-000000000089', 1, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000045', '55555555-5555-5555-5555-000000000090', 1, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000045', '55555555-5555-5555-5555-000000000089', 2, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000045', '55555555-5555-5555-5555-000000000089', 2, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000045', '55555555-5555-5555-5555-000000000090', 2, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000045', '55555555-5555-5555-5555-000000000089', 3, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000045', '55555555-5555-5555-5555-000000000089', 3, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000045', '55555555-5555-5555-5555-000000000090', 3, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000045', '55555555-5555-5555-5555-000000000089', 4, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000045', '55555555-5555-5555-5555-000000000089', 4, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000045', '55555555-5555-5555-5555-000000000090', 4, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000045', '55555555-5555-5555-5555-000000000089', 5, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000045', '55555555-5555-5555-5555-000000000089', 5, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000045', '55555555-5555-5555-5555-000000000090', 5, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000045', '55555555-5555-5555-5555-000000000089', 6, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000045', '55555555-5555-5555-5555-000000000089', 6, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000045', '55555555-5555-5555-5555-000000000090', 6, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000045', '55555555-5555-5555-5555-000000000089', 7, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000045', '55555555-5555-5555-5555-000000000089', 7, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000045', '55555555-5555-5555-5555-000000000090', 7, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.courts (id, venue_id, name, court_type, status, created_at, updated_at) VALUES
('55555555-5555-5555-5555-000000000091', '44444444-4444-4444-4444-000000000046', 'Sân 1 - Thành Công', 'PREMIUM', 'ACTIVE', NOW(), NOW()),
('55555555-5555-5555-5555-000000000092', '44444444-4444-4444-4444-000000000046', 'Sân 2 - Thành Công', 'STANDARD', 'ACTIVE', NOW(), NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000046', '55555555-5555-5555-5555-000000000091', 1, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000046', '55555555-5555-5555-5555-000000000091', 1, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000046', '55555555-5555-5555-5555-000000000092', 1, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000046', '55555555-5555-5555-5555-000000000091', 2, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000046', '55555555-5555-5555-5555-000000000091', 2, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000046', '55555555-5555-5555-5555-000000000092', 2, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000046', '55555555-5555-5555-5555-000000000091', 3, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000046', '55555555-5555-5555-5555-000000000091', 3, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000046', '55555555-5555-5555-5555-000000000092', 3, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000046', '55555555-5555-5555-5555-000000000091', 4, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000046', '55555555-5555-5555-5555-000000000091', 4, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000046', '55555555-5555-5555-5555-000000000092', 4, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000046', '55555555-5555-5555-5555-000000000091', 5, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000046', '55555555-5555-5555-5555-000000000091', 5, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000046', '55555555-5555-5555-5555-000000000092', 5, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000046', '55555555-5555-5555-5555-000000000091', 6, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000046', '55555555-5555-5555-5555-000000000091', 6, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000046', '55555555-5555-5555-5555-000000000092', 6, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000046', '55555555-5555-5555-5555-000000000091', 7, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000046', '55555555-5555-5555-5555-000000000091', 7, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000046', '55555555-5555-5555-5555-000000000092', 7, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.courts (id, venue_id, name, court_type, status, created_at, updated_at) VALUES
('55555555-5555-5555-5555-000000000093', '44444444-4444-4444-4444-000000000047', 'Sân 1 - Giảng Võ', 'PREMIUM', 'ACTIVE', NOW(), NOW()),
('55555555-5555-5555-5555-000000000094', '44444444-4444-4444-4444-000000000047', 'Sân 2 - Giảng Võ', 'STANDARD', 'ACTIVE', NOW(), NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000047', '55555555-5555-5555-5555-000000000093', 1, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000047', '55555555-5555-5555-5555-000000000093', 1, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000047', '55555555-5555-5555-5555-000000000094', 1, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000047', '55555555-5555-5555-5555-000000000093', 2, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000047', '55555555-5555-5555-5555-000000000093', 2, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000047', '55555555-5555-5555-5555-000000000094', 2, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000047', '55555555-5555-5555-5555-000000000093', 3, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000047', '55555555-5555-5555-5555-000000000093', 3, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000047', '55555555-5555-5555-5555-000000000094', 3, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000047', '55555555-5555-5555-5555-000000000093', 4, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000047', '55555555-5555-5555-5555-000000000093', 4, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000047', '55555555-5555-5555-5555-000000000094', 4, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000047', '55555555-5555-5555-5555-000000000093', 5, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000047', '55555555-5555-5555-5555-000000000093', 5, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000047', '55555555-5555-5555-5555-000000000094', 5, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000047', '55555555-5555-5555-5555-000000000093', 6, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000047', '55555555-5555-5555-5555-000000000093', 6, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000047', '55555555-5555-5555-5555-000000000094', 6, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000047', '55555555-5555-5555-5555-000000000093', 7, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000047', '55555555-5555-5555-5555-000000000093', 7, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000047', '55555555-5555-5555-5555-000000000094', 7, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.courts (id, venue_id, name, court_type, status, created_at, updated_at) VALUES
('55555555-5555-5555-5555-000000000095', '44444444-4444-4444-4444-000000000048', 'Sân 1 - Kim Mã', 'PREMIUM', 'ACTIVE', NOW(), NOW()),
('55555555-5555-5555-5555-000000000096', '44444444-4444-4444-4444-000000000048', 'Sân 2 - Kim Mã', 'STANDARD', 'ACTIVE', NOW(), NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000048', '55555555-5555-5555-5555-000000000095', 1, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000048', '55555555-5555-5555-5555-000000000095', 1, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000048', '55555555-5555-5555-5555-000000000096', 1, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000048', '55555555-5555-5555-5555-000000000095', 2, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000048', '55555555-5555-5555-5555-000000000095', 2, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000048', '55555555-5555-5555-5555-000000000096', 2, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000048', '55555555-5555-5555-5555-000000000095', 3, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000048', '55555555-5555-5555-5555-000000000095', 3, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000048', '55555555-5555-5555-5555-000000000096', 3, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000048', '55555555-5555-5555-5555-000000000095', 4, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000048', '55555555-5555-5555-5555-000000000095', 4, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000048', '55555555-5555-5555-5555-000000000096', 4, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000048', '55555555-5555-5555-5555-000000000095', 5, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000048', '55555555-5555-5555-5555-000000000095', 5, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000048', '55555555-5555-5555-5555-000000000096', 5, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000048', '55555555-5555-5555-5555-000000000095', 6, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000048', '55555555-5555-5555-5555-000000000095', 6, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000048', '55555555-5555-5555-5555-000000000096', 6, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000048', '55555555-5555-5555-5555-000000000095', 7, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000048', '55555555-5555-5555-5555-000000000095', 7, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000048', '55555555-5555-5555-5555-000000000096', 7, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.courts (id, venue_id, name, court_type, status, created_at, updated_at) VALUES
('55555555-5555-5555-5555-000000000097', '44444444-4444-4444-4444-000000000049', 'Sân 1 - Trúc Bạch', 'PREMIUM', 'ACTIVE', NOW(), NOW()),
('55555555-5555-5555-5555-000000000098', '44444444-4444-4444-4444-000000000049', 'Sân 2 - Trúc Bạch', 'STANDARD', 'ACTIVE', NOW(), NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000049', '55555555-5555-5555-5555-000000000097', 1, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000049', '55555555-5555-5555-5555-000000000097', 1, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000049', '55555555-5555-5555-5555-000000000098', 1, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000049', '55555555-5555-5555-5555-000000000097', 2, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000049', '55555555-5555-5555-5555-000000000097', 2, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000049', '55555555-5555-5555-5555-000000000098', 2, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000049', '55555555-5555-5555-5555-000000000097', 3, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000049', '55555555-5555-5555-5555-000000000097', 3, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000049', '55555555-5555-5555-5555-000000000098', 3, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000049', '55555555-5555-5555-5555-000000000097', 4, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000049', '55555555-5555-5555-5555-000000000097', 4, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000049', '55555555-5555-5555-5555-000000000098', 4, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000049', '55555555-5555-5555-5555-000000000097', 5, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000049', '55555555-5555-5555-5555-000000000097', 5, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000049', '55555555-5555-5555-5555-000000000098', 5, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000049', '55555555-5555-5555-5555-000000000097', 6, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000049', '55555555-5555-5555-5555-000000000097', 6, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000049', '55555555-5555-5555-5555-000000000098', 6, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000049', '55555555-5555-5555-5555-000000000097', 7, '05:00:00', '17:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000049', '55555555-5555-5555-5555-000000000097', 7, '17:00:00', '22:00:00', 110000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000049', '55555555-5555-5555-5555-000000000098', 7, '05:00:00', '22:00:00', 70000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.courts (id, venue_id, name, court_type, status, created_at, updated_at) VALUES
('55555555-5555-5555-5555-000000000099', '44444444-4444-4444-4444-000000000050', 'Sân 1 - Yên Phụ', 'PREMIUM', 'ACTIVE', NOW(), NOW()),
('55555555-5555-5555-5555-000000000100', '44444444-4444-4444-4444-000000000050', 'Sân 2 - Yên Phụ', 'STANDARD', 'ACTIVE', NOW(), NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000050', '55555555-5555-5555-5555-000000000099', 1, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000050', '55555555-5555-5555-5555-000000000099', 1, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000050', '55555555-5555-5555-5555-000000000100', 1, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000050', '55555555-5555-5555-5555-000000000099', 2, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000050', '55555555-5555-5555-5555-000000000099', 2, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000050', '55555555-5555-5555-5555-000000000100', 2, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000050', '55555555-5555-5555-5555-000000000099', 3, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000050', '55555555-5555-5555-5555-000000000099', 3, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000050', '55555555-5555-5555-5555-000000000100', 3, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000050', '55555555-5555-5555-5555-000000000099', 4, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000050', '55555555-5555-5555-5555-000000000099', 4, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000050', '55555555-5555-5555-5555-000000000100', 4, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000050', '55555555-5555-5555-5555-000000000099', 5, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000050', '55555555-5555-5555-5555-000000000099', 5, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000050', '55555555-5555-5555-5555-000000000100', 5, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000050', '55555555-5555-5555-5555-000000000099', 6, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000050', '55555555-5555-5555-5555-000000000099', 6, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000050', '55555555-5555-5555-5555-000000000100', 6, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '44444444-4444-4444-4444-000000000050', '55555555-5555-5555-5555-000000000099', 7, '05:00:00', '17:00:00', 90000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000050', '55555555-5555-5555-5555-000000000099', 7, '17:00:00', '22:00:00', 120000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '44444444-4444-4444-4444-000000000050', '55555555-5555-5555-5555-000000000100', 7, '05:00:00', '22:00:00', 80000, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());
-- 8. Seed Venue Utilities
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000001', 'Wifi');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000001', 'Canteen');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000001', 'Locker Room');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000001', 'Shower');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000002', 'Canteen');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000002', 'Shower');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000003', 'Net Shop');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000003', 'Free Parking');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000003', 'Locker Room');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000004', 'Canteen');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000004', 'Net Shop');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000005', 'Canteen');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000005', 'Wifi');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000005', 'Net Shop');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000005', 'Free Parking');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000006', 'Canteen');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000006', 'Locker Room');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000006', 'Wifi');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000007', 'Locker Room');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000007', 'Shower');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000007', 'Free Parking');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000008', 'Shower');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000008', 'Free Parking');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000009', 'Wifi');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000009', 'Canteen');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000009', 'Net Shop');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000010', 'Free Parking');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000010', 'Canteen');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000010', 'Shower');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000011', 'Free Parking');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000011', 'Canteen');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000012', 'Wifi');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000012', 'Shower');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000012', 'Locker Room');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000012', 'Canteen');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000013', 'Free Parking');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000013', 'Canteen');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000013', 'Net Shop');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000014', 'Wifi');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000014', 'Canteen');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000015', 'Wifi');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000015', 'Canteen');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000015', 'Free Parking');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000016', 'Wifi');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000016', 'Canteen');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000016', 'Locker Room');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000016', 'Net Shop');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000017', 'Free Parking');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000017', 'Shower');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000018', 'Canteen');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000018', 'Wifi');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000019', 'Net Shop');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000019', 'Free Parking');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000020', 'Wifi');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000020', 'Net Shop');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000021', 'Shower');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000021', 'Canteen');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000022', 'Net Shop');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000022', 'Locker Room');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000022', 'Shower');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000023', 'Net Shop');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000023', 'Shower');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000023', 'Free Parking');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000023', 'Locker Room');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000024', 'Wifi');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000024', 'Net Shop');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000024', 'Canteen');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000025', 'Canteen');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000025', 'Wifi');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000025', 'Free Parking');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000025', 'Locker Room');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000026', 'Free Parking');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000026', 'Net Shop');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000027', 'Shower');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000027', 'Canteen');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000027', 'Wifi');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000027', 'Locker Room');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000028', 'Locker Room');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000028', 'Shower');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000029', 'Net Shop');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000029', 'Locker Room');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000029', 'Shower');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000029', 'Free Parking');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000030', 'Shower');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000030', 'Locker Room');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000030', 'Free Parking');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000031', 'Locker Room');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000031', 'Shower');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000031', 'Free Parking');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000031', 'Canteen');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000032', 'Shower');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000032', 'Locker Room');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000032', 'Canteen');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000032', 'Wifi');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000033', 'Free Parking');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000033', 'Net Shop');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000034', 'Shower');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000034', 'Wifi');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000034', 'Canteen');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000034', 'Free Parking');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000035', 'Wifi');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000035', 'Locker Room');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000036', 'Wifi');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000036', 'Canteen');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000036', 'Shower');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000037', 'Wifi');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000037', 'Canteen');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000038', 'Free Parking');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000038', 'Canteen');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000039', 'Free Parking');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000039', 'Canteen');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000039', 'Shower');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000039', 'Net Shop');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000040', 'Shower');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000040', 'Canteen');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000041', 'Wifi');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000041', 'Canteen');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000041', 'Free Parking');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000042', 'Net Shop');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000042', 'Wifi');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000042', 'Canteen');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000043', 'Net Shop');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000043', 'Locker Room');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000044', 'Net Shop');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000044', 'Canteen');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000044', 'Shower');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000045', 'Shower');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000045', 'Free Parking');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000046', 'Wifi');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000046', 'Canteen');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000046', 'Free Parking');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000047', 'Free Parking');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000047', 'Canteen');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000047', 'Shower');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000047', 'Locker Room');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000048', 'Wifi');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000048', 'Shower');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000048', 'Net Shop');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000048', 'Free Parking');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000049', 'Free Parking');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000049', 'Net Shop');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000049', 'Shower');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000050', 'Shower');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000050', 'Free Parking');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000050', 'Net Shop');
INSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('44444444-4444-4444-4444-000000000050', 'Locker Room');
-- 9. Seed Venue Images
INSERT INTO venue.venue_images (id, venue_id, image_url, display_order, created_at) VALUES (gen_random_uuid(), '44444444-4444-4444-4444-000000000001', 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=600', 0, NOW());
INSERT INTO venue.venue_images (id, venue_id, image_url, display_order, created_at) VALUES (gen_random_uuid(), '44444444-4444-4444-4444-000000000002', 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=600', 0, NOW());
INSERT INTO venue.venue_images (id, venue_id, image_url, display_order, created_at) VALUES (gen_random_uuid(), '44444444-4444-4444-4444-000000000003', 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=600', 0, NOW());
INSERT INTO venue.venue_images (id, venue_id, image_url, display_order, created_at) VALUES (gen_random_uuid(), '44444444-4444-4444-4444-000000000004', 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=600', 0, NOW());
INSERT INTO venue.venue_images (id, venue_id, image_url, display_order, created_at) VALUES (gen_random_uuid(), '44444444-4444-4444-4444-000000000005', 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=600', 0, NOW());
INSERT INTO venue.venue_images (id, venue_id, image_url, display_order, created_at) VALUES (gen_random_uuid(), '44444444-4444-4444-4444-000000000006', 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=600', 0, NOW());
INSERT INTO venue.venue_images (id, venue_id, image_url, display_order, created_at) VALUES (gen_random_uuid(), '44444444-4444-4444-4444-000000000007', 'https://images.unsplash.com/photo-1521537634211-13da4df068b5?q=80&w=600', 0, NOW());
INSERT INTO venue.venue_images (id, venue_id, image_url, display_order, created_at) VALUES (gen_random_uuid(), '44444444-4444-4444-4444-000000000008', 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=600', 0, NOW());
INSERT INTO venue.venue_images (id, venue_id, image_url, display_order, created_at) VALUES (gen_random_uuid(), '44444444-4444-4444-4444-000000000009', 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=600', 0, NOW());
INSERT INTO venue.venue_images (id, venue_id, image_url, display_order, created_at) VALUES (gen_random_uuid(), '44444444-4444-4444-4444-000000000010', 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=600', 0, NOW());
INSERT INTO venue.venue_images (id, venue_id, image_url, display_order, created_at) VALUES (gen_random_uuid(), '44444444-4444-4444-4444-000000000011', 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=600', 0, NOW());
INSERT INTO venue.venue_images (id, venue_id, image_url, display_order, created_at) VALUES (gen_random_uuid(), '44444444-4444-4444-4444-000000000012', 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=600', 0, NOW());
INSERT INTO venue.venue_images (id, venue_id, image_url, display_order, created_at) VALUES (gen_random_uuid(), '44444444-4444-4444-4444-000000000013', 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=600', 0, NOW());
INSERT INTO venue.venue_images (id, venue_id, image_url, display_order, created_at) VALUES (gen_random_uuid(), '44444444-4444-4444-4444-000000000014', 'https://images.unsplash.com/photo-1521537634211-13da4df068b5?q=80&w=600', 0, NOW());
INSERT INTO venue.venue_images (id, venue_id, image_url, display_order, created_at) VALUES (gen_random_uuid(), '44444444-4444-4444-4444-000000000015', 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=600', 0, NOW());
INSERT INTO venue.venue_images (id, venue_id, image_url, display_order, created_at) VALUES (gen_random_uuid(), '44444444-4444-4444-4444-000000000016', 'https://images.unsplash.com/photo-1521537634211-13da4df068b5?q=80&w=600', 0, NOW());
INSERT INTO venue.venue_images (id, venue_id, image_url, display_order, created_at) VALUES (gen_random_uuid(), '44444444-4444-4444-4444-000000000017', 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=600', 0, NOW());
INSERT INTO venue.venue_images (id, venue_id, image_url, display_order, created_at) VALUES (gen_random_uuid(), '44444444-4444-4444-4444-000000000018', 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=600', 0, NOW());
INSERT INTO venue.venue_images (id, venue_id, image_url, display_order, created_at) VALUES (gen_random_uuid(), '44444444-4444-4444-4444-000000000019', 'https://images.unsplash.com/photo-1521537634211-13da4df068b5?q=80&w=600', 0, NOW());
INSERT INTO venue.venue_images (id, venue_id, image_url, display_order, created_at) VALUES (gen_random_uuid(), '44444444-4444-4444-4444-000000000020', 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=600', 0, NOW());
INSERT INTO venue.venue_images (id, venue_id, image_url, display_order, created_at) VALUES (gen_random_uuid(), '44444444-4444-4444-4444-000000000021', 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=600', 0, NOW());
INSERT INTO venue.venue_images (id, venue_id, image_url, display_order, created_at) VALUES (gen_random_uuid(), '44444444-4444-4444-4444-000000000022', 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=600', 0, NOW());
INSERT INTO venue.venue_images (id, venue_id, image_url, display_order, created_at) VALUES (gen_random_uuid(), '44444444-4444-4444-4444-000000000023', 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=600', 0, NOW());
INSERT INTO venue.venue_images (id, venue_id, image_url, display_order, created_at) VALUES (gen_random_uuid(), '44444444-4444-4444-4444-000000000024', 'https://images.unsplash.com/photo-1521537634211-13da4df068b5?q=80&w=600', 0, NOW());
INSERT INTO venue.venue_images (id, venue_id, image_url, display_order, created_at) VALUES (gen_random_uuid(), '44444444-4444-4444-4444-000000000025', 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=600', 0, NOW());
INSERT INTO venue.venue_images (id, venue_id, image_url, display_order, created_at) VALUES (gen_random_uuid(), '44444444-4444-4444-4444-000000000026', 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=600', 0, NOW());
INSERT INTO venue.venue_images (id, venue_id, image_url, display_order, created_at) VALUES (gen_random_uuid(), '44444444-4444-4444-4444-000000000027', 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=600', 0, NOW());
INSERT INTO venue.venue_images (id, venue_id, image_url, display_order, created_at) VALUES (gen_random_uuid(), '44444444-4444-4444-4444-000000000028', 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=600', 0, NOW());
INSERT INTO venue.venue_images (id, venue_id, image_url, display_order, created_at) VALUES (gen_random_uuid(), '44444444-4444-4444-4444-000000000029', 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=600', 0, NOW());
INSERT INTO venue.venue_images (id, venue_id, image_url, display_order, created_at) VALUES (gen_random_uuid(), '44444444-4444-4444-4444-000000000030', 'https://images.unsplash.com/photo-1521537634211-13da4df068b5?q=80&w=600', 0, NOW());
INSERT INTO venue.venue_images (id, venue_id, image_url, display_order, created_at) VALUES (gen_random_uuid(), '44444444-4444-4444-4444-000000000031', 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=600', 0, NOW());
INSERT INTO venue.venue_images (id, venue_id, image_url, display_order, created_at) VALUES (gen_random_uuid(), '44444444-4444-4444-4444-000000000032', 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=600', 0, NOW());
INSERT INTO venue.venue_images (id, venue_id, image_url, display_order, created_at) VALUES (gen_random_uuid(), '44444444-4444-4444-4444-000000000033', 'https://images.unsplash.com/photo-1521537634211-13da4df068b5?q=80&w=600', 0, NOW());
INSERT INTO venue.venue_images (id, venue_id, image_url, display_order, created_at) VALUES (gen_random_uuid(), '44444444-4444-4444-4444-000000000034', 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=600', 0, NOW());
INSERT INTO venue.venue_images (id, venue_id, image_url, display_order, created_at) VALUES (gen_random_uuid(), '44444444-4444-4444-4444-000000000035', 'https://images.unsplash.com/photo-1521537634211-13da4df068b5?q=80&w=600', 0, NOW());
INSERT INTO venue.venue_images (id, venue_id, image_url, display_order, created_at) VALUES (gen_random_uuid(), '44444444-4444-4444-4444-000000000036', 'https://images.unsplash.com/photo-1521537634211-13da4df068b5?q=80&w=600', 0, NOW());
INSERT INTO venue.venue_images (id, venue_id, image_url, display_order, created_at) VALUES (gen_random_uuid(), '44444444-4444-4444-4444-000000000037', 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=600', 0, NOW());
INSERT INTO venue.venue_images (id, venue_id, image_url, display_order, created_at) VALUES (gen_random_uuid(), '44444444-4444-4444-4444-000000000038', 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=600', 0, NOW());
INSERT INTO venue.venue_images (id, venue_id, image_url, display_order, created_at) VALUES (gen_random_uuid(), '44444444-4444-4444-4444-000000000039', 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=600', 0, NOW());
INSERT INTO venue.venue_images (id, venue_id, image_url, display_order, created_at) VALUES (gen_random_uuid(), '44444444-4444-4444-4444-000000000040', 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=600', 0, NOW());
INSERT INTO venue.venue_images (id, venue_id, image_url, display_order, created_at) VALUES (gen_random_uuid(), '44444444-4444-4444-4444-000000000041', 'https://images.unsplash.com/photo-1521537634211-13da4df068b5?q=80&w=600', 0, NOW());
INSERT INTO venue.venue_images (id, venue_id, image_url, display_order, created_at) VALUES (gen_random_uuid(), '44444444-4444-4444-4444-000000000042', 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=600', 0, NOW());
INSERT INTO venue.venue_images (id, venue_id, image_url, display_order, created_at) VALUES (gen_random_uuid(), '44444444-4444-4444-4444-000000000043', 'https://images.unsplash.com/photo-1521537634211-13da4df068b5?q=80&w=600', 0, NOW());
INSERT INTO venue.venue_images (id, venue_id, image_url, display_order, created_at) VALUES (gen_random_uuid(), '44444444-4444-4444-4444-000000000044', 'https://images.unsplash.com/photo-1521537634211-13da4df068b5?q=80&w=600', 0, NOW());
INSERT INTO venue.venue_images (id, venue_id, image_url, display_order, created_at) VALUES (gen_random_uuid(), '44444444-4444-4444-4444-000000000045', 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=600', 0, NOW());
INSERT INTO venue.venue_images (id, venue_id, image_url, display_order, created_at) VALUES (gen_random_uuid(), '44444444-4444-4444-4444-000000000046', 'https://images.unsplash.com/photo-1521537634211-13da4df068b5?q=80&w=600', 0, NOW());
INSERT INTO venue.venue_images (id, venue_id, image_url, display_order, created_at) VALUES (gen_random_uuid(), '44444444-4444-4444-4444-000000000047', 'https://images.unsplash.com/photo-1521537634211-13da4df068b5?q=80&w=600', 0, NOW());
INSERT INTO venue.venue_images (id, venue_id, image_url, display_order, created_at) VALUES (gen_random_uuid(), '44444444-4444-4444-4444-000000000048', 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=600', 0, NOW());
INSERT INTO venue.venue_images (id, venue_id, image_url, display_order, created_at) VALUES (gen_random_uuid(), '44444444-4444-4444-4444-000000000049', 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=600', 0, NOW());
INSERT INTO venue.venue_images (id, venue_id, image_url, display_order, created_at) VALUES (gen_random_uuid(), '44444444-4444-4444-4444-000000000050', 'https://images.unsplash.com/photo-1521537634211-13da4df068b5?q=80&w=600', 0, NOW());
-- 10. Seed Owner Wallets
INSERT INTO payment.owner_wallets (id, owner_id, balance, total_earned, total_withdrawn, created_at, updated_at) VALUES (gen_random_uuid(), '22222222-2222-2222-2222-000000000001', 0.00, 0.00, 0.00, NOW(), NOW());
INSERT INTO payment.owner_wallets (id, owner_id, balance, total_earned, total_withdrawn, created_at, updated_at) VALUES (gen_random_uuid(), '22222222-2222-2222-2222-000000000002', 0.00, 0.00, 0.00, NOW(), NOW());
INSERT INTO payment.owner_wallets (id, owner_id, balance, total_earned, total_withdrawn, created_at, updated_at) VALUES (gen_random_uuid(), '22222222-2222-2222-2222-000000000003', 0.00, 0.00, 0.00, NOW(), NOW());
INSERT INTO payment.owner_wallets (id, owner_id, balance, total_earned, total_withdrawn, created_at, updated_at) VALUES (gen_random_uuid(), '22222222-2222-2222-2222-000000000004', 0.00, 0.00, 0.00, NOW(), NOW());
INSERT INTO payment.owner_wallets (id, owner_id, balance, total_earned, total_withdrawn, created_at, updated_at) VALUES (gen_random_uuid(), '22222222-2222-2222-2222-000000000005', 0.00, 0.00, 0.00, NOW(), NOW());
INSERT INTO payment.owner_wallets (id, owner_id, balance, total_earned, total_withdrawn, created_at, updated_at) VALUES (gen_random_uuid(), '22222222-2222-2222-2222-000000000006', 0.00, 0.00, 0.00, NOW(), NOW());
INSERT INTO payment.owner_wallets (id, owner_id, balance, total_earned, total_withdrawn, created_at, updated_at) VALUES (gen_random_uuid(), '22222222-2222-2222-2222-000000000007', 0.00, 0.00, 0.00, NOW(), NOW());
INSERT INTO payment.owner_wallets (id, owner_id, balance, total_earned, total_withdrawn, created_at, updated_at) VALUES (gen_random_uuid(), '22222222-2222-2222-2222-000000000008', 0.00, 0.00, 0.00, NOW(), NOW());
INSERT INTO payment.owner_wallets (id, owner_id, balance, total_earned, total_withdrawn, created_at, updated_at) VALUES (gen_random_uuid(), '22222222-2222-2222-2222-000000000009', 0.00, 0.00, 0.00, NOW(), NOW());
INSERT INTO payment.owner_wallets (id, owner_id, balance, total_earned, total_withdrawn, created_at, updated_at) VALUES (gen_random_uuid(), '22222222-2222-2222-2222-000000000010', 0.00, 0.00, 0.00, NOW(), NOW());
INSERT INTO payment.owner_wallets (id, owner_id, balance, total_earned, total_withdrawn, created_at, updated_at) VALUES (gen_random_uuid(), '22222222-2222-2222-2222-000000000011', 0.00, 0.00, 0.00, NOW(), NOW());
INSERT INTO payment.owner_wallets (id, owner_id, balance, total_earned, total_withdrawn, created_at, updated_at) VALUES (gen_random_uuid(), '22222222-2222-2222-2222-000000000012', 0.00, 0.00, 0.00, NOW(), NOW());
INSERT INTO payment.owner_wallets (id, owner_id, balance, total_earned, total_withdrawn, created_at, updated_at) VALUES (gen_random_uuid(), '22222222-2222-2222-2222-000000000013', 0.00, 0.00, 0.00, NOW(), NOW());
INSERT INTO payment.owner_wallets (id, owner_id, balance, total_earned, total_withdrawn, created_at, updated_at) VALUES (gen_random_uuid(), '22222222-2222-2222-2222-000000000014', 0.00, 0.00, 0.00, NOW(), NOW());
INSERT INTO payment.owner_wallets (id, owner_id, balance, total_earned, total_withdrawn, created_at, updated_at) VALUES (gen_random_uuid(), '22222222-2222-2222-2222-000000000015', 0.00, 0.00, 0.00, NOW(), NOW());
INSERT INTO payment.owner_wallets (id, owner_id, balance, total_earned, total_withdrawn, created_at, updated_at) VALUES (gen_random_uuid(), '22222222-2222-2222-2222-000000000016', 0.00, 0.00, 0.00, NOW(), NOW());
INSERT INTO payment.owner_wallets (id, owner_id, balance, total_earned, total_withdrawn, created_at, updated_at) VALUES (gen_random_uuid(), '22222222-2222-2222-2222-000000000017', 0.00, 0.00, 0.00, NOW(), NOW());
INSERT INTO payment.owner_wallets (id, owner_id, balance, total_earned, total_withdrawn, created_at, updated_at) VALUES (gen_random_uuid(), '22222222-2222-2222-2222-000000000018', 0.00, 0.00, 0.00, NOW(), NOW());
INSERT INTO payment.owner_wallets (id, owner_id, balance, total_earned, total_withdrawn, created_at, updated_at) VALUES (gen_random_uuid(), '22222222-2222-2222-2222-000000000019', 0.00, 0.00, 0.00, NOW(), NOW());
INSERT INTO payment.owner_wallets (id, owner_id, balance, total_earned, total_withdrawn, created_at, updated_at) VALUES (gen_random_uuid(), '22222222-2222-2222-2222-000000000020', 0.00, 0.00, 0.00, NOW(), NOW());
INSERT INTO payment.owner_wallets (id, owner_id, balance, total_earned, total_withdrawn, created_at, updated_at) VALUES (gen_random_uuid(), '22222222-2222-2222-2222-000000000021', 0.00, 0.00, 0.00, NOW(), NOW());
INSERT INTO payment.owner_wallets (id, owner_id, balance, total_earned, total_withdrawn, created_at, updated_at) VALUES (gen_random_uuid(), '22222222-2222-2222-2222-000000000022', 0.00, 0.00, 0.00, NOW(), NOW());
INSERT INTO payment.owner_wallets (id, owner_id, balance, total_earned, total_withdrawn, created_at, updated_at) VALUES (gen_random_uuid(), '22222222-2222-2222-2222-000000000023', 0.00, 0.00, 0.00, NOW(), NOW());
INSERT INTO payment.owner_wallets (id, owner_id, balance, total_earned, total_withdrawn, created_at, updated_at) VALUES (gen_random_uuid(), '22222222-2222-2222-2222-000000000024', 0.00, 0.00, 0.00, NOW(), NOW());
INSERT INTO payment.owner_wallets (id, owner_id, balance, total_earned, total_withdrawn, created_at, updated_at) VALUES (gen_random_uuid(), '22222222-2222-2222-2222-000000000025', 0.00, 0.00, 0.00, NOW(), NOW());
INSERT INTO payment.owner_wallets (id, owner_id, balance, total_earned, total_withdrawn, created_at, updated_at) VALUES (gen_random_uuid(), '22222222-2222-2222-2222-000000000026', 0.00, 0.00, 0.00, NOW(), NOW());
INSERT INTO payment.owner_wallets (id, owner_id, balance, total_earned, total_withdrawn, created_at, updated_at) VALUES (gen_random_uuid(), '22222222-2222-2222-2222-000000000027', 0.00, 0.00, 0.00, NOW(), NOW());
INSERT INTO payment.owner_wallets (id, owner_id, balance, total_earned, total_withdrawn, created_at, updated_at) VALUES (gen_random_uuid(), '22222222-2222-2222-2222-000000000028', 0.00, 0.00, 0.00, NOW(), NOW());
INSERT INTO payment.owner_wallets (id, owner_id, balance, total_earned, total_withdrawn, created_at, updated_at) VALUES (gen_random_uuid(), '22222222-2222-2222-2222-000000000029', 0.00, 0.00, 0.00, NOW(), NOW());
INSERT INTO payment.owner_wallets (id, owner_id, balance, total_earned, total_withdrawn, created_at, updated_at) VALUES (gen_random_uuid(), '22222222-2222-2222-2222-000000000030', 0.00, 0.00, 0.00, NOW(), NOW());
INSERT INTO payment.owner_wallets (id, owner_id, balance, total_earned, total_withdrawn, created_at, updated_at) VALUES (gen_random_uuid(), '22222222-2222-2222-2222-000000000031', 0.00, 0.00, 0.00, NOW(), NOW());
INSERT INTO payment.owner_wallets (id, owner_id, balance, total_earned, total_withdrawn, created_at, updated_at) VALUES (gen_random_uuid(), '22222222-2222-2222-2222-000000000032', 0.00, 0.00, 0.00, NOW(), NOW());
INSERT INTO payment.owner_wallets (id, owner_id, balance, total_earned, total_withdrawn, created_at, updated_at) VALUES (gen_random_uuid(), '22222222-2222-2222-2222-000000000033', 0.00, 0.00, 0.00, NOW(), NOW());
INSERT INTO payment.owner_wallets (id, owner_id, balance, total_earned, total_withdrawn, created_at, updated_at) VALUES (gen_random_uuid(), '22222222-2222-2222-2222-000000000034', 0.00, 0.00, 0.00, NOW(), NOW());
INSERT INTO payment.owner_wallets (id, owner_id, balance, total_earned, total_withdrawn, created_at, updated_at) VALUES (gen_random_uuid(), '22222222-2222-2222-2222-000000000035', 0.00, 0.00, 0.00, NOW(), NOW());
INSERT INTO payment.owner_wallets (id, owner_id, balance, total_earned, total_withdrawn, created_at, updated_at) VALUES (gen_random_uuid(), '22222222-2222-2222-2222-000000000036', 0.00, 0.00, 0.00, NOW(), NOW());
INSERT INTO payment.owner_wallets (id, owner_id, balance, total_earned, total_withdrawn, created_at, updated_at) VALUES (gen_random_uuid(), '22222222-2222-2222-2222-000000000037', 0.00, 0.00, 0.00, NOW(), NOW());
INSERT INTO payment.owner_wallets (id, owner_id, balance, total_earned, total_withdrawn, created_at, updated_at) VALUES (gen_random_uuid(), '22222222-2222-2222-2222-000000000038', 0.00, 0.00, 0.00, NOW(), NOW());
INSERT INTO payment.owner_wallets (id, owner_id, balance, total_earned, total_withdrawn, created_at, updated_at) VALUES (gen_random_uuid(), '22222222-2222-2222-2222-000000000039', 0.00, 0.00, 0.00, NOW(), NOW());
INSERT INTO payment.owner_wallets (id, owner_id, balance, total_earned, total_withdrawn, created_at, updated_at) VALUES (gen_random_uuid(), '22222222-2222-2222-2222-000000000040', 0.00, 0.00, 0.00, NOW(), NOW());
INSERT INTO payment.owner_wallets (id, owner_id, balance, total_earned, total_withdrawn, created_at, updated_at) VALUES (gen_random_uuid(), '22222222-2222-2222-2222-000000000041', 0.00, 0.00, 0.00, NOW(), NOW());
INSERT INTO payment.owner_wallets (id, owner_id, balance, total_earned, total_withdrawn, created_at, updated_at) VALUES (gen_random_uuid(), '22222222-2222-2222-2222-000000000042', 0.00, 0.00, 0.00, NOW(), NOW());
INSERT INTO payment.owner_wallets (id, owner_id, balance, total_earned, total_withdrawn, created_at, updated_at) VALUES (gen_random_uuid(), '22222222-2222-2222-2222-000000000043', 0.00, 0.00, 0.00, NOW(), NOW());
INSERT INTO payment.owner_wallets (id, owner_id, balance, total_earned, total_withdrawn, created_at, updated_at) VALUES (gen_random_uuid(), '22222222-2222-2222-2222-000000000044', 0.00, 0.00, 0.00, NOW(), NOW());
INSERT INTO payment.owner_wallets (id, owner_id, balance, total_earned, total_withdrawn, created_at, updated_at) VALUES (gen_random_uuid(), '22222222-2222-2222-2222-000000000045', 0.00, 0.00, 0.00, NOW(), NOW());
INSERT INTO payment.owner_wallets (id, owner_id, balance, total_earned, total_withdrawn, created_at, updated_at) VALUES (gen_random_uuid(), '22222222-2222-2222-2222-000000000046', 0.00, 0.00, 0.00, NOW(), NOW());
INSERT INTO payment.owner_wallets (id, owner_id, balance, total_earned, total_withdrawn, created_at, updated_at) VALUES (gen_random_uuid(), '22222222-2222-2222-2222-000000000047', 0.00, 0.00, 0.00, NOW(), NOW());
INSERT INTO payment.owner_wallets (id, owner_id, balance, total_earned, total_withdrawn, created_at, updated_at) VALUES (gen_random_uuid(), '22222222-2222-2222-2222-000000000048', 0.00, 0.00, 0.00, NOW(), NOW());
INSERT INTO payment.owner_wallets (id, owner_id, balance, total_earned, total_withdrawn, created_at, updated_at) VALUES (gen_random_uuid(), '22222222-2222-2222-2222-000000000049', 0.00, 0.00, 0.00, NOW(), NOW());
INSERT INTO payment.owner_wallets (id, owner_id, balance, total_earned, total_withdrawn, created_at, updated_at) VALUES (gen_random_uuid(), '22222222-2222-2222-2222-000000000050', 0.00, 0.00, 0.00, NOW(), NOW());
-- 11. Seed 50 Match Posts
INSERT INTO community.match_posts (id, host_id, author_id, title, description, level, start_time, end_time, venue_name, venue_address, latitude, longitude, location, max_players, current_participants, join_mode, status, like_count, comment_count, created_at, updated_at) VALUES
('77777777-7777-7777-7777-000000000001', '33333333-3333-3333-3333-000000000001', '33333333-3333-3333-3333-000000000001', 'Kèo phủi giao lưu có nước uống và cầu sẵn', 'Nhóm chơi phong trào tìm kiếm đồng đội cùng trình độ trung bình phong trào. Đánh vui vẻ, vận động cơ thể sau giờ làm việc căng thẳng.', 'INTERMEDIATE', CURRENT_DATE + INTERVAL '-3 days' + INTERVAL '14 hours', CURRENT_DATE + INTERVAL '-3 days' + INTERVAL '16 hours', 'Sân cầu lông Đống Đa', '75 Đặng Văn Ngữ, Đống Đa, Hà Nội', 21.012, 105.828, ST_SetSRID(ST_MakePoint(105.828, 21.012), 4326)::geography, 4, 4, 'APPROVAL', 'FINISHED', 7, 1, NOW() - INTERVAL '1 day', NOW());
INSERT INTO community.match_post_levels (match_post_id, level) VALUES ('77777777-7777-7777-7777-000000000001', 'INTERMEDIATE');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000001', '33333333-3333-3333-3333-000000000001', 'Lê Quốc Trang', 'APPROVED', NOW() - INTERVAL '2 hours');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000001', '33333333-3333-3333-3333-000000000036', 'Hoàng Thị Phúc', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000001', '33333333-3333-3333-3333-000000000032', 'Phạm Anh Hương', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000001', '33333333-3333-3333-3333-000000000008', 'Phan Đức Hương', 'PENDING', NOW() - INTERVAL '1 hour');
INSERT INTO community.match_comments (id, match_post_id, user_id, user_full_name, content, created_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000001', '33333333-3333-3333-3333-000000000039', 'Lê Ngọc Trang', 'Chào mọi người, mình xin 1 slot nhé!', NOW() - INTERVAL '30 minutes');
INSERT INTO community.match_posts (id, host_id, author_id, title, description, level, start_time, end_time, venue_name, venue_address, latitude, longitude, location, max_players, current_participants, join_mode, status, like_count, comment_count, created_at, updated_at) VALUES
('77777777-7777-7777-7777-000000000002', '33333333-3333-3333-3333-000000000002', '33333333-3333-3333-3333-000000000002', 'Tìm kèo đôi nam nữ trình Yếu/Mới chơi giao lưu cọ xát', 'Tìm các bạn đam mê cầu lông trình phong trào mới chơi tham gia giao lưu. Sân thảm mới, trần cao, ánh sáng tốt không lóa mắt. Lên sân là chiến ngay!', 'BEGINNER', CURRENT_DATE + INTERVAL '-1 days' + INTERVAL '15 hours', CURRENT_DATE + INTERVAL '-1 days' + INTERVAL '17 hours', 'Sân cầu lông Cầu Giấy', '35 Nguyễn Phong Sắc, Cầu Giấy, Hà Nội', 21.036, 105.79, ST_SetSRID(ST_MakePoint(105.79, 21.036), 4326)::geography, 4, 4, 'OPEN', 'FINISHED', 8, 1, NOW() - INTERVAL '1 day', NOW());
INSERT INTO community.match_post_levels (match_post_id, level) VALUES ('77777777-7777-7777-7777-000000000002', 'BEGINNER');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000002', '33333333-3333-3333-3333-000000000002', 'Trần Minh Bình', 'APPROVED', NOW() - INTERVAL '2 hours');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000002', '33333333-3333-3333-3333-000000000031', 'Ngô Anh Phúc', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000002', '33333333-3333-3333-3333-000000000034', 'Hoàng Hữu Giang', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000002', '33333333-3333-3333-3333-000000000017', 'Đỗ Ngọc Phúc', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.match_comments (id, match_post_id, user_id, user_full_name, content, created_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000002', '33333333-3333-3333-3333-000000000033', 'Đặng Minh Tuấn', 'Chào mọi người, mình xin 1 slot nhé!', NOW() - INTERVAL '30 minutes');
INSERT INTO community.match_posts (id, host_id, author_id, title, description, level, start_time, end_time, venue_name, venue_address, latitude, longitude, location, max_players, current_participants, join_mode, status, like_count, comment_count, created_at, updated_at) VALUES
('77777777-7777-7777-7777-000000000003', '33333333-3333-3333-3333-000000000003', '33333333-3333-3333-3333-000000000003', 'Cần tuyển slot gấp cho nhóm cầu lông tối nay', 'Tìm các bạn đam mê cầu lông trình trung bình phong trào tham gia giao lưu. Sân thảm mới, trần cao, ánh sáng tốt không lóa mắt. Lên sân là chiến ngay!', 'INTERMEDIATE', CURRENT_DATE + INTERVAL '-1 days' + INTERVAL '16 hours', CURRENT_DATE + INTERVAL '-1 days' + INTERVAL '18 hours', 'Sân cầu lông Lê Văn Lương', '88 Lê Văn Lương, Thanh Xuân, Hà Nội', 21.009, 105.803, ST_SetSRID(ST_MakePoint(105.803, 21.009), 4326)::geography, 6, 6, 'APPROVAL', 'FINISHED', 8, 1, NOW() - INTERVAL '1 day', NOW());
INSERT INTO community.match_post_levels (match_post_id, level) VALUES ('77777777-7777-7777-7777-000000000003', 'INTERMEDIATE');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000003', '33333333-3333-3333-3333-000000000003', 'Trần Minh Hùng', 'APPROVED', NOW() - INTERVAL '2 hours');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000003', '33333333-3333-3333-3333-000000000048', 'Hồ Văn Tuấn', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000003', '33333333-3333-3333-3333-000000000045', 'Ngô Minh Duy', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000003', '33333333-3333-3333-3333-000000000026', 'Hoàng Văn Bình', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000003', '33333333-3333-3333-3333-000000000027', 'Vũ Tuấn Giang', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000003', '33333333-3333-3333-3333-000000000001', 'Lê Quốc Trang', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.match_comments (id, match_post_id, user_id, user_full_name, content, created_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000003', '33333333-3333-3333-3333-000000000005', 'Phan Thành Linh', 'Chào mọi người, mình xin 1 slot nhé!', NOW() - INTERVAL '30 minutes');
INSERT INTO community.match_posts (id, host_id, author_id, title, description, level, start_time, end_time, venue_name, venue_address, latitude, longitude, location, max_players, current_participants, join_mode, status, like_count, comment_count, created_at, updated_at) VALUES
('77777777-7777-7777-7777-000000000004', '33333333-3333-3333-3333-000000000004', '33333333-3333-3333-3333-000000000004', 'Kèo giao lưu nhẹ nhàng cuối tuần cho Khá/Mạnh', 'Kèo chất lượng cho anh em cọ xát trình trung bình khá trở lên. Yêu cầu tinh thần vui vẻ, giao lưu học hỏi là chính, không cay cú. Có chỗ đỗ xe rộng rãi.', 'ADVANCED', CURRENT_DATE + INTERVAL '-1 days' + INTERVAL '16 hours', CURRENT_DATE + INTERVAL '-1 days' + INTERVAL '18 hours', 'Sân cầu lông Đại học Y', '1 Tôn Thất Tùng, Đống Đa, Hà Nội', 21.002, 105.829, ST_SetSRID(ST_MakePoint(105.829, 21.002), 4326)::geography, 4, 4, 'OPEN', 'FINISHED', 8, 3, NOW() - INTERVAL '1 day', NOW());
INSERT INTO community.match_post_levels (match_post_id, level) VALUES ('77777777-7777-7777-7777-000000000004', 'ADVANCED');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000004', '33333333-3333-3333-3333-000000000004', 'Ngô Hoàng Linh', 'APPROVED', NOW() - INTERVAL '2 hours');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000004', '33333333-3333-3333-3333-000000000031', 'Ngô Anh Phúc', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000004', '33333333-3333-3333-3333-000000000042', 'Phan Văn Vy', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000004', '33333333-3333-3333-3333-000000000046', 'Đặng Hoàng Phúc', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.match_comments (id, match_post_id, user_id, user_full_name, content, created_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000004', '33333333-3333-3333-3333-000000000032', 'Phạm Anh Hương', 'Chào mọi người, mình xin 1 slot nhé!', NOW() - INTERVAL '30 minutes');
INSERT INTO community.match_posts (id, host_id, author_id, title, description, level, start_time, end_time, venue_name, venue_address, latitude, longitude, location, max_players, current_participants, join_mode, status, like_count, comment_count, created_at, updated_at) VALUES
('77777777-7777-7777-7777-000000000005', '33333333-3333-3333-3333-000000000005', '33333333-3333-3333-3333-000000000005', 'Tìm đối thủ cứng tay đánh đơn/đôi trình Yếu/Mới chơi', 'Nhóm mình cần tuyển thêm 2 bạn trình phong trào mới chơi giao lưu đôi nam/nữ. Sân đã chuẩn bị đầy đủ cầu Hải Yến và nước uống. Chi phí chia đều cuối buổi.', 'BEGINNER', CURRENT_DATE + INTERVAL '-4 days' + INTERVAL '15 hours', CURRENT_DATE + INTERVAL '-4 days' + INTERVAL '17 hours', 'Sân cầu lông Ba Đình', '115 Hoàng Hoa Thám, Ba Đình, Hà Nội', 21.043, 105.82, ST_SetSRID(ST_MakePoint(105.82, 21.043), 4326)::geography, 4, 4, 'APPROVAL', 'FINISHED', 7, 1, NOW() - INTERVAL '1 day', NOW());
INSERT INTO community.match_post_levels (match_post_id, level) VALUES ('77777777-7777-7777-7777-000000000005', 'BEGINNER');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000005', '33333333-3333-3333-3333-000000000005', 'Phan Thành Linh', 'APPROVED', NOW() - INTERVAL '2 hours');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000005', '33333333-3333-3333-3333-000000000002', 'Trần Minh Bình', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000005', '33333333-3333-3333-3333-000000000034', 'Hoàng Hữu Giang', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000005', '33333333-3333-3333-3333-000000000027', 'Vũ Tuấn Giang', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.match_comments (id, match_post_id, user_id, user_full_name, content, created_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000005', '33333333-3333-3333-3333-000000000008', 'Phan Đức Hương', 'Chào mọi người, mình xin 1 slot nhé!', NOW() - INTERVAL '30 minutes');
INSERT INTO community.match_posts (id, host_id, author_id, title, description, level, start_time, end_time, venue_name, venue_address, latitude, longitude, location, max_players, current_participants, join_mode, status, like_count, comment_count, created_at, updated_at) VALUES
('77777777-7777-7777-7777-000000000006', '33333333-3333-3333-3333-000000000006', '33333333-3333-3333-3333-000000000006', 'Tìm đối thủ cứng tay đánh đơn/đôi trình Yếu/Mới chơi', 'Nhóm mình cần tuyển thêm 1 bạn trình phong trào mới chơi giao lưu đôi nam/nữ. Sân đã chuẩn bị đầy đủ cầu Hải Yến và nước uống. Chi phí chia đều cuối buổi.', 'BEGINNER', CURRENT_DATE + INTERVAL '-4 days' + INTERVAL '16 hours', CURRENT_DATE + INTERVAL '-4 days' + INTERVAL '18 hours', 'Sân cầu lông Tây Hồ', '99 Xuân La, Tây Hồ, Hà Nội', 21.066, 105.804, ST_SetSRID(ST_MakePoint(105.804, 21.066), 4326)::geography, 6, 6, 'OPEN', 'FINISHED', 1, 2, NOW() - INTERVAL '1 day', NOW());
INSERT INTO community.match_post_levels (match_post_id, level) VALUES ('77777777-7777-7777-7777-000000000006', 'BEGINNER');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000006', '33333333-3333-3333-3333-000000000006', 'Nguyễn Đức Vy', 'APPROVED', NOW() - INTERVAL '2 hours');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000006', '33333333-3333-3333-3333-000000000033', 'Đặng Minh Tuấn', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000006', '33333333-3333-3333-3333-000000000038', 'Bùi Anh Anh', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000006', '33333333-3333-3333-3333-000000000036', 'Hoàng Thị Phúc', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000006', '33333333-3333-3333-3333-000000000012', 'Trần Minh Sơn', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000006', '33333333-3333-3333-3333-000000000048', 'Hồ Văn Tuấn', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.match_comments (id, match_post_id, user_id, user_full_name, content, created_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000006', '33333333-3333-3333-3333-000000000045', 'Ngô Minh Duy', 'Chào mọi người, mình xin 1 slot nhé!', NOW() - INTERVAL '30 minutes');
INSERT INTO community.match_posts (id, host_id, author_id, title, description, level, start_time, end_time, venue_name, venue_address, latitude, longitude, location, max_players, current_participants, join_mode, status, like_count, comment_count, created_at, updated_at) VALUES
('77777777-7777-7777-7777-000000000007', '33333333-3333-3333-3333-000000000007', '33333333-3333-3333-3333-000000000007', 'Tìm đối thủ cứng tay đánh đơn/đôi trình Yếu/Mới chơi', 'Tìm các bạn đam mê cầu lông trình phong trào mới chơi tham gia giao lưu. Sân thảm mới, trần cao, ánh sáng tốt không lóa mắt. Lên sân là chiến ngay!', 'BEGINNER', CURRENT_DATE + INTERVAL '-3 days' + INTERVAL '16 hours', CURRENT_DATE + INTERVAL '-3 days' + INTERVAL '18 hours', 'Sân cầu lông Hoàn Kiếm', '2 Hàm Tử Quan, Hoàn Kiếm, Hà Nội', 21.026, 105.859, ST_SetSRID(ST_MakePoint(105.859, 21.026), 4326)::geography, 4, 4, 'APPROVAL', 'FINISHED', 8, 1, NOW() - INTERVAL '1 day', NOW());
INSERT INTO community.match_post_levels (match_post_id, level) VALUES ('77777777-7777-7777-7777-000000000007', 'BEGINNER');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000007', '33333333-3333-3333-3333-000000000007', 'Hoàng Tuấn Duy', 'APPROVED', NOW() - INTERVAL '2 hours');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000007', '33333333-3333-3333-3333-000000000043', 'Phan Hoàng Khánh', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000007', '33333333-3333-3333-3333-000000000033', 'Đặng Minh Tuấn', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000007', '33333333-3333-3333-3333-000000000031', 'Ngô Anh Phúc', 'PENDING', NOW() - INTERVAL '1 hour');
INSERT INTO community.match_comments (id, match_post_id, user_id, user_full_name, content, created_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000007', '33333333-3333-3333-3333-000000000036', 'Hoàng Thị Phúc', 'Chào mọi người, mình xin 1 slot nhé!', NOW() - INTERVAL '30 minutes');
INSERT INTO community.match_posts (id, host_id, author_id, title, description, level, start_time, end_time, venue_name, venue_address, latitude, longitude, location, max_players, current_participants, join_mode, status, like_count, comment_count, created_at, updated_at) VALUES
('77777777-7777-7777-7777-000000000008', '33333333-3333-3333-3333-000000000008', '33333333-3333-3333-3333-000000000008', 'Tìm đối thủ cứng tay đánh đơn/đôi trình Trung Bình', 'Nhóm mình cần tuyển thêm 1 bạn trình trung bình phong trào giao lưu đôi nam/nữ. Sân đã chuẩn bị đầy đủ cầu Hải Yến và nước uống. Chi phí chia đều cuối buổi.', 'INTERMEDIATE', CURRENT_DATE + INTERVAL '-5 days' + INTERVAL '17 hours', CURRENT_DATE + INTERVAL '-5 days' + INTERVAL '19 hours', 'Sân cầu lông Hai Bà Trưng', '42 Tạ Quang Bửu, Hai Bà Trưng, Hà Nội', 21.005, 105.848, ST_SetSRID(ST_MakePoint(105.848, 21.005), 4326)::geography, 4, 4, 'OPEN', 'FINISHED', 7, 2, NOW() - INTERVAL '1 day', NOW());
INSERT INTO community.match_post_levels (match_post_id, level) VALUES ('77777777-7777-7777-7777-000000000008', 'INTERMEDIATE');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000008', '33333333-3333-3333-3333-000000000008', 'Phan Đức Hương', 'APPROVED', NOW() - INTERVAL '2 hours');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000008', '33333333-3333-3333-3333-000000000026', 'Hoàng Văn Bình', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000008', '33333333-3333-3333-3333-000000000047', 'Phan Thị Hùng', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000008', '33333333-3333-3333-3333-000000000012', 'Trần Minh Sơn', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.match_comments (id, match_post_id, user_id, user_full_name, content, created_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000008', '33333333-3333-3333-3333-000000000047', 'Phan Thị Hùng', 'Chào mọi người, mình xin 1 slot nhé!', NOW() - INTERVAL '30 minutes');
INSERT INTO community.match_posts (id, host_id, author_id, title, description, level, start_time, end_time, venue_name, venue_address, latitude, longitude, location, max_players, current_participants, join_mode, status, like_count, comment_count, created_at, updated_at) VALUES
('77777777-7777-7777-7777-000000000009', '33333333-3333-3333-3333-000000000009', '33333333-3333-3333-3333-000000000009', 'Tìm kèo đôi nam nữ trình Khá/Mạnh giao lưu cọ xát', 'Tìm các bạn đam mê cầu lông trình trung bình khá trở lên tham gia giao lưu. Sân thảm mới, trần cao, ánh sáng tốt không lóa mắt. Lên sân là chiến ngay!', 'ADVANCED', CURRENT_DATE + INTERVAL '-5 days' + INTERVAL '17 hours', CURRENT_DATE + INTERVAL '-5 days' + INTERVAL '19 hours', 'Sân cầu lông Thanh Xuân', '15 Nguyễn Quý Đức, Thanh Xuân, Hà Nội', 20.998, 105.799, ST_SetSRID(ST_MakePoint(105.799, 20.998), 4326)::geography, 6, 6, 'APPROVAL', 'FINISHED', 5, 2, NOW() - INTERVAL '1 day', NOW());
INSERT INTO community.match_post_levels (match_post_id, level) VALUES ('77777777-7777-7777-7777-000000000009', 'ADVANCED');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000009', '33333333-3333-3333-3333-000000000009', 'Ngô Thị Giang', 'APPROVED', NOW() - INTERVAL '2 hours');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000009', '33333333-3333-3333-3333-000000000006', 'Nguyễn Đức Vy', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000009', '33333333-3333-3333-3333-000000000012', 'Trần Minh Sơn', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000009', '33333333-3333-3333-3333-000000000031', 'Ngô Anh Phúc', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000009', '33333333-3333-3333-3333-000000000004', 'Ngô Hoàng Linh', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000009', '33333333-3333-3333-3333-000000000050', 'Phan Hoàng Trang', 'PENDING', NOW() - INTERVAL '1 hour');
INSERT INTO community.match_comments (id, match_post_id, user_id, user_full_name, content, created_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000009', '33333333-3333-3333-3333-000000000033', 'Đặng Minh Tuấn', 'Chào mọi người, mình xin 1 slot nhé!', NOW() - INTERVAL '30 minutes');
INSERT INTO community.match_posts (id, host_id, author_id, title, description, level, start_time, end_time, venue_name, venue_address, latitude, longitude, location, max_players, current_participants, join_mode, status, like_count, comment_count, created_at, updated_at) VALUES
('77777777-7777-7777-7777-000000000010', '33333333-3333-3333-3333-000000000010', '33333333-3333-3333-3333-000000000010', 'Tìm đối thủ cứng tay đánh đơn/đôi trình Trung Bình', 'Nhóm chơi phong trào tìm kiếm đồng đội cùng trình độ trung bình phong trào. Đánh vui vẻ, vận động cơ thể sau giờ làm việc căng thẳng.', 'INTERMEDIATE', CURRENT_DATE + INTERVAL '-3 days' + INTERVAL '15 hours', CURRENT_DATE + INTERVAL '-3 days' + INTERVAL '17 hours', 'Sân cầu lông Hà Đông', '8 Tô Hiệu, Hà Đông, Hà Nội', 20.967, 105.776, ST_SetSRID(ST_MakePoint(105.776, 20.967), 4326)::geography, 4, 4, 'OPEN', 'FINISHED', 2, 0, NOW() - INTERVAL '1 day', NOW());
INSERT INTO community.match_post_levels (match_post_id, level) VALUES ('77777777-7777-7777-7777-000000000010', 'INTERMEDIATE');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000010', '33333333-3333-3333-3333-000000000010', 'Hoàng Quốc Bình', 'APPROVED', NOW() - INTERVAL '2 hours');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000010', '33333333-3333-3333-3333-000000000036', 'Hoàng Thị Phúc', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000010', '33333333-3333-3333-3333-000000000043', 'Phan Hoàng Khánh', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000010', '33333333-3333-3333-3333-000000000032', 'Phạm Anh Hương', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.match_posts (id, host_id, author_id, title, description, level, start_time, end_time, venue_name, venue_address, latitude, longitude, location, max_players, current_participants, join_mode, status, like_count, comment_count, created_at, updated_at) VALUES
('77777777-7777-7777-7777-000000000011', '33333333-3333-3333-3333-000000000011', '33333333-3333-3333-3333-000000000011', 'Tìm kèo đôi nam nữ trình Yếu/Mới chơi giao lưu cọ xát', 'Nhóm chơi phong trào tìm kiếm đồng đội cùng trình độ phong trào mới chơi. Đánh vui vẻ, vận động cơ thể sau giờ làm việc căng thẳng.', 'BEGINNER', CURRENT_DATE + INTERVAL '-4 days' + INTERVAL '15 hours', CURRENT_DATE + INTERVAL '-4 days' + INTERVAL '17 hours', 'Sân cầu lông Mỹ Đình', '5 Trần Hữu Dực, Nam Từ Liêm, Hà Nội', 21.028, 105.764, ST_SetSRID(ST_MakePoint(105.764, 21.028), 4326)::geography, 4, 4, 'APPROVAL', 'FINISHED', 7, 3, NOW() - INTERVAL '1 day', NOW());
INSERT INTO community.match_post_levels (match_post_id, level) VALUES ('77777777-7777-7777-7777-000000000011', 'BEGINNER');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000011', '33333333-3333-3333-3333-000000000011', 'Hoàng Thành Bình', 'APPROVED', NOW() - INTERVAL '2 hours');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000011', '33333333-3333-3333-3333-000000000019', 'Phan Văn Anh', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000011', '33333333-3333-3333-3333-000000000008', 'Phan Đức Hương', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000011', '33333333-3333-3333-3333-000000000041', 'Hồ Khánh Cường', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.match_comments (id, match_post_id, user_id, user_full_name, content, created_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000011', '33333333-3333-3333-3333-000000000024', 'Lê Tuấn Hương', 'Chào mọi người, mình xin 1 slot nhé!', NOW() - INTERVAL '30 minutes');
INSERT INTO community.match_posts (id, host_id, author_id, title, description, level, start_time, end_time, venue_name, venue_address, latitude, longitude, location, max_players, current_participants, join_mode, status, like_count, comment_count, created_at, updated_at) VALUES
('77777777-7777-7777-7777-000000000012', '33333333-3333-3333-3333-000000000012', '33333333-3333-3333-3333-000000000012', 'Tuyển thêm 1 tay vợt trình Trung Bình lên sân', 'Tìm các bạn đam mê cầu lông trình trung bình phong trào tham gia giao lưu. Sân thảm mới, trần cao, ánh sáng tốt không lóa mắt. Lên sân là chiến ngay!', 'INTERMEDIATE', CURRENT_DATE + INTERVAL '-3 days' + INTERVAL '14 hours', CURRENT_DATE + INTERVAL '-3 days' + INTERVAL '16 hours', 'Sân cầu lông Cầu Diễn', '12 Hồ Tùng Mậu, Bắc Từ Liêm, Hà Nội', 21.039, 105.765, ST_SetSRID(ST_MakePoint(105.765, 21.039), 4326)::geography, 6, 6, 'OPEN', 'FINISHED', 6, 3, NOW() - INTERVAL '1 day', NOW());
INSERT INTO community.match_post_levels (match_post_id, level) VALUES ('77777777-7777-7777-7777-000000000012', 'INTERMEDIATE');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000012', '33333333-3333-3333-3333-000000000012', 'Trần Minh Sơn', 'APPROVED', NOW() - INTERVAL '2 hours');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000012', '33333333-3333-3333-3333-000000000031', 'Ngô Anh Phúc', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000012', '33333333-3333-3333-3333-000000000028', 'Lê Văn Vy', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000012', '33333333-3333-3333-3333-000000000021', 'Ngô Văn Khánh', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000012', '33333333-3333-3333-3333-000000000047', 'Phan Thị Hùng', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000012', '33333333-3333-3333-3333-000000000043', 'Phan Hoàng Khánh', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.match_comments (id, match_post_id, user_id, user_full_name, content, created_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000012', '33333333-3333-3333-3333-000000000046', 'Đặng Hoàng Phúc', 'Chào mọi người, mình xin 1 slot nhé!', NOW() - INTERVAL '30 minutes');
INSERT INTO community.match_posts (id, host_id, author_id, title, description, level, start_time, end_time, venue_name, venue_address, latitude, longitude, location, max_players, current_participants, join_mode, status, like_count, comment_count, created_at, updated_at) VALUES
('77777777-7777-7777-7777-000000000013', '33333333-3333-3333-3333-000000000013', '33333333-3333-3333-3333-000000000013', 'Kèo giao lưu nhẹ nhàng cuối tuần cho Trung Bình', 'Nhóm mình cần tuyển thêm 2 bạn trình trung bình phong trào giao lưu đôi nam/nữ. Sân đã chuẩn bị đầy đủ cầu Hải Yến và nước uống. Chi phí chia đều cuối buổi.', 'INTERMEDIATE', CURRENT_DATE + INTERVAL '-5 days' + INTERVAL '16 hours', CURRENT_DATE + INTERVAL '-5 days' + INTERVAL '18 hours', 'Sân cầu lông Bách Khoa', '1 Tạ Quang Bửu, Hai Bà Trưng, Hà Nội', 21.004, 105.843, ST_SetSRID(ST_MakePoint(105.843, 21.004), 4326)::geography, 4, 4, 'APPROVAL', 'FINISHED', 1, 3, NOW() - INTERVAL '1 day', NOW());
INSERT INTO community.match_post_levels (match_post_id, level) VALUES ('77777777-7777-7777-7777-000000000013', 'INTERMEDIATE');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000013', '33333333-3333-3333-3333-000000000013', 'Đỗ Minh Linh', 'APPROVED', NOW() - INTERVAL '2 hours');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000013', '33333333-3333-3333-3333-000000000014', 'Ngô Khánh Giang', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000013', '33333333-3333-3333-3333-000000000002', 'Trần Minh Bình', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000013', '33333333-3333-3333-3333-000000000019', 'Phan Văn Anh', 'PENDING', NOW() - INTERVAL '1 hour');
INSERT INTO community.match_comments (id, match_post_id, user_id, user_full_name, content, created_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000013', '33333333-3333-3333-3333-000000000045', 'Ngô Minh Duy', 'Chào mọi người, mình xin 1 slot nhé!', NOW() - INTERVAL '30 minutes');
INSERT INTO community.match_posts (id, host_id, author_id, title, description, level, start_time, end_time, venue_name, venue_address, latitude, longitude, location, max_players, current_participants, join_mode, status, like_count, comment_count, created_at, updated_at) VALUES
('77777777-7777-7777-7777-000000000014', '33333333-3333-3333-3333-000000000014', '33333333-3333-3333-3333-000000000014', 'Tìm đối thủ cứng tay đánh đơn/đôi trình Trung Bình', 'Kèo chất lượng cho anh em cọ xát trình trung bình phong trào. Yêu cầu tinh thần vui vẻ, giao lưu học hỏi là chính, không cay cú. Có chỗ đỗ xe rộng rãi.', 'INTERMEDIATE', CURRENT_DATE + INTERVAL '-5 days' + INTERVAL '15 hours', CURRENT_DATE + INTERVAL '-5 days' + INTERVAL '17 hours', 'Sân cầu lông Long Biên', '33 Nguyễn Sơn, Long Biên, Hà Nội', 21.042, 105.882, ST_SetSRID(ST_MakePoint(105.882, 21.042), 4326)::geography, 4, 4, 'OPEN', 'FINISHED', 5, 1, NOW() - INTERVAL '1 day', NOW());
INSERT INTO community.match_post_levels (match_post_id, level) VALUES ('77777777-7777-7777-7777-000000000014', 'INTERMEDIATE');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000014', '33333333-3333-3333-3333-000000000014', 'Ngô Khánh Giang', 'APPROVED', NOW() - INTERVAL '2 hours');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000014', '33333333-3333-3333-3333-000000000010', 'Hoàng Quốc Bình', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000014', '33333333-3333-3333-3333-000000000045', 'Ngô Minh Duy', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000014', '33333333-3333-3333-3333-000000000037', 'Bùi Văn Anh', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.match_comments (id, match_post_id, user_id, user_full_name, content, created_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000014', '33333333-3333-3333-3333-000000000050', 'Phan Hoàng Trang', 'Chào mọi người, mình xin 1 slot nhé!', NOW() - INTERVAL '30 minutes');
INSERT INTO community.match_posts (id, host_id, author_id, title, description, level, start_time, end_time, venue_name, venue_address, latitude, longitude, location, max_players, current_participants, join_mode, status, like_count, comment_count, created_at, updated_at) VALUES
('77777777-7777-7777-7777-000000000015', '33333333-3333-3333-3333-000000000015', '33333333-3333-3333-3333-000000000015', 'Giao lưu cầu lông tối thứ trước (--1d) vui vẻ', 'Nhóm chơi phong trào tìm kiếm đồng đội cùng trình độ phong trào mới chơi. Đánh vui vẻ, vận động cơ thể sau giờ làm việc căng thẳng.', 'BEGINNER', CURRENT_DATE + INTERVAL '-1 days' + INTERVAL '14 hours', CURRENT_DATE + INTERVAL '-1 days' + INTERVAL '16 hours', 'Sân cầu lông Gia Lâm', '55 Cổ Linh, Long Biên, Hà Nội', 21.018, 105.895, ST_SetSRID(ST_MakePoint(105.895, 21.018), 4326)::geography, 6, 6, 'APPROVAL', 'FINISHED', 8, 3, NOW() - INTERVAL '1 day', NOW());
INSERT INTO community.match_post_levels (match_post_id, level) VALUES ('77777777-7777-7777-7777-000000000015', 'BEGINNER');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000015', '33333333-3333-3333-3333-000000000015', 'Phạm Thị Linh', 'APPROVED', NOW() - INTERVAL '2 hours');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000015', '33333333-3333-3333-3333-000000000049', 'Hoàng Ngọc Trang', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000015', '33333333-3333-3333-3333-000000000033', 'Đặng Minh Tuấn', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000015', '33333333-3333-3333-3333-000000000037', 'Bùi Văn Anh', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000015', '33333333-3333-3333-3333-000000000048', 'Hồ Văn Tuấn', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000015', '33333333-3333-3333-3333-000000000034', 'Hoàng Hữu Giang', 'PENDING', NOW() - INTERVAL '1 hour');
INSERT INTO community.match_comments (id, match_post_id, user_id, user_full_name, content, created_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000015', '33333333-3333-3333-3333-000000000009', 'Ngô Thị Giang', 'Chào mọi người, mình xin 1 slot nhé!', NOW() - INTERVAL '30 minutes');
INSERT INTO community.match_posts (id, host_id, author_id, title, description, level, start_time, end_time, venue_name, venue_address, latitude, longitude, location, max_players, current_participants, join_mode, status, like_count, comment_count, created_at, updated_at) VALUES
('77777777-7777-7777-7777-000000000016', '33333333-3333-3333-3333-000000000016', '33333333-3333-3333-3333-000000000016', 'Cần tuyển slot gấp cho nhóm cầu lông tối nay', 'Nhóm chơi phong trào tìm kiếm đồng đội cùng trình độ trung bình phong trào. Đánh vui vẻ, vận động cơ thể sau giờ làm việc căng thẳng.', 'INTERMEDIATE', CURRENT_DATE + INTERVAL '6 days' + INTERVAL '15 hours', CURRENT_DATE + INTERVAL '6 days' + INTERVAL '17 hours', 'Sân cầu lông Hoàng Mai', '10 Linh Đường, Hoàng Mai, Hà Nội', 20.966, 105.834, ST_SetSRID(ST_MakePoint(105.834, 20.966), 4326)::geography, 4, 2, 'OPEN', 'OPEN', 8, 1, NOW() - INTERVAL '1 day', NOW());
INSERT INTO community.match_post_levels (match_post_id, level) VALUES ('77777777-7777-7777-7777-000000000016', 'INTERMEDIATE');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000016', '33333333-3333-3333-3333-000000000016', 'Đỗ Văn Hải', 'APPROVED', NOW() - INTERVAL '2 hours');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000016', '33333333-3333-3333-3333-000000000050', 'Phan Hoàng Trang', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.match_comments (id, match_post_id, user_id, user_full_name, content, created_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000016', '33333333-3333-3333-3333-000000000004', 'Ngô Hoàng Linh', 'Chào mọi người, mình xin 1 slot nhé!', NOW() - INTERVAL '30 minutes');
INSERT INTO community.match_posts (id, host_id, author_id, title, description, level, start_time, end_time, venue_name, venue_address, latitude, longitude, location, max_players, current_participants, join_mode, status, like_count, comment_count, created_at, updated_at) VALUES
('77777777-7777-7777-7777-000000000017', '33333333-3333-3333-3333-000000000017', '33333333-3333-3333-3333-000000000017', 'Tìm đối thủ cứng tay đánh đơn/đôi trình Trung Bình', 'Nhóm mình cần tuyển thêm 1 bạn trình trung bình phong trào giao lưu đôi nam/nữ. Sân đã chuẩn bị đầy đủ cầu Hải Yến và nước uống. Chi phí chia đều cuối buổi.', 'INTERMEDIATE', CURRENT_DATE + INTERVAL '3 days' + INTERVAL '16 hours', CURRENT_DATE + INTERVAL '3 days' + INTERVAL '18 hours', 'Sân cầu lông Linh Đàm', '22 Nguyễn Hữu Thọ, Hoàng Mai, Hà Nội', 20.969, 105.829, ST_SetSRID(ST_MakePoint(105.829, 20.969), 4326)::geography, 4, 1, 'APPROVAL', 'OPEN', 1, 3, NOW() - INTERVAL '1 day', NOW());
INSERT INTO community.match_post_levels (match_post_id, level) VALUES ('77777777-7777-7777-7777-000000000017', 'INTERMEDIATE');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000017', '33333333-3333-3333-3333-000000000017', 'Đỗ Ngọc Phúc', 'APPROVED', NOW() - INTERVAL '2 hours');
INSERT INTO community.match_comments (id, match_post_id, user_id, user_full_name, content, created_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000017', '33333333-3333-3333-3333-000000000046', 'Đặng Hoàng Phúc', 'Chào mọi người, mình xin 1 slot nhé!', NOW() - INTERVAL '30 minutes');
INSERT INTO community.match_posts (id, host_id, author_id, title, description, level, start_time, end_time, venue_name, venue_address, latitude, longitude, location, max_players, current_participants, join_mode, status, like_count, comment_count, created_at, updated_at) VALUES
('77777777-7777-7777-7777-000000000018', '33333333-3333-3333-3333-000000000018', '33333333-3333-3333-3333-000000000018', 'Tìm đối thủ cứng tay đánh đơn/đôi trình Trung Bình', 'Kèo chất lượng cho anh em cọ xát trình trung bình phong trào. Yêu cầu tinh thần vui vẻ, giao lưu học hỏi là chính, không cay cú. Có chỗ đỗ xe rộng rãi.', 'INTERMEDIATE', CURRENT_DATE + INTERVAL '1 days' + INTERVAL '15 hours', CURRENT_DATE + INTERVAL '1 days' + INTERVAL '17 hours', 'Sân cầu lông Thanh Trì', '5 Phan Trọng Tuệ, Thanh Trì, Hà Nội', 20.952, 105.819, ST_SetSRID(ST_MakePoint(105.819, 20.952), 4326)::geography, 6, 1, 'OPEN', 'OPEN', 0, 0, NOW() - INTERVAL '1 day', NOW());
INSERT INTO community.match_post_levels (match_post_id, level) VALUES ('77777777-7777-7777-7777-000000000018', 'INTERMEDIATE');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000018', '33333333-3333-3333-3333-000000000018', 'Lê Minh Anh', 'APPROVED', NOW() - INTERVAL '2 hours');
INSERT INTO community.match_posts (id, host_id, author_id, title, description, level, start_time, end_time, venue_name, venue_address, latitude, longitude, location, max_players, current_participants, join_mode, status, like_count, comment_count, created_at, updated_at) VALUES
('77777777-7777-7777-7777-000000000019', '33333333-3333-3333-3333-000000000019', '33333333-3333-3333-3333-000000000019', 'Giao lưu cầu lông sáng sớm nâng cao sức khỏe', 'Tìm các bạn đam mê cầu lông trình phong trào mới chơi tham gia giao lưu. Sân thảm mới, trần cao, ánh sáng tốt không lóa mắt. Lên sân là chiến ngay!', 'BEGINNER', CURRENT_DATE + INTERVAL '7 days' + INTERVAL '15 hours', CURRENT_DATE + INTERVAL '7 days' + INTERVAL '17 hours', 'Sân cầu lông Đông Anh', 'Tổ 5, Thị trấn Đông Anh, Hà Nội', 21.139, 105.845, ST_SetSRID(ST_MakePoint(105.845, 21.139), 4326)::geography, 4, 1, 'APPROVAL', 'OPEN', 9, 2, NOW() - INTERVAL '1 day', NOW());
INSERT INTO community.match_post_levels (match_post_id, level) VALUES ('77777777-7777-7777-7777-000000000019', 'BEGINNER');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000019', '33333333-3333-3333-3333-000000000019', 'Phan Văn Anh', 'APPROVED', NOW() - INTERVAL '2 hours');
INSERT INTO community.match_comments (id, match_post_id, user_id, user_full_name, content, created_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000019', '33333333-3333-3333-3333-000000000005', 'Phan Thành Linh', 'Chào mọi người, mình xin 1 slot nhé!', NOW() - INTERVAL '30 minutes');
INSERT INTO community.match_posts (id, host_id, author_id, title, description, level, start_time, end_time, venue_name, venue_address, latitude, longitude, location, max_players, current_participants, join_mode, status, like_count, comment_count, created_at, updated_at) VALUES
('77777777-7777-7777-7777-000000000020', '33333333-3333-3333-3333-000000000020', '33333333-3333-3333-3333-000000000020', 'Tìm đối thủ cứng tay đánh đơn/đôi trình Yếu/Mới chơi', 'Kèo chất lượng cho anh em cọ xát trình phong trào mới chơi. Yêu cầu tinh thần vui vẻ, giao lưu học hỏi là chính, không cay cú. Có chỗ đỗ xe rộng rãi.', 'BEGINNER', CURRENT_DATE + INTERVAL '3 days' + INTERVAL '16 hours', CURRENT_DATE + INTERVAL '3 days' + INTERVAL '18 hours', 'Sân cầu lông Sóc Sơn', 'Khối 3, Thị trấn Sóc Sơn, Hà Nội', 21.258, 105.849, ST_SetSRID(ST_MakePoint(105.849, 21.258), 4326)::geography, 4, 1, 'OPEN', 'OPEN', 4, 2, NOW() - INTERVAL '1 day', NOW());
INSERT INTO community.match_post_levels (match_post_id, level) VALUES ('77777777-7777-7777-7777-000000000020', 'BEGINNER');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000020', '33333333-3333-3333-3333-000000000020', 'Nguyễn Văn Vy', 'APPROVED', NOW() - INTERVAL '2 hours');
INSERT INTO community.match_comments (id, match_post_id, user_id, user_full_name, content, created_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000020', '33333333-3333-3333-3333-000000000023', 'Hoàng Hữu Bình', 'Chào mọi người, mình xin 1 slot nhé!', NOW() - INTERVAL '30 minutes');
INSERT INTO community.match_posts (id, host_id, author_id, title, description, level, start_time, end_time, venue_name, venue_address, latitude, longitude, location, max_players, current_participants, join_mode, status, like_count, comment_count, created_at, updated_at) VALUES
('77777777-7777-7777-7777-000000000021', '33333333-3333-3333-3333-000000000021', '33333333-3333-3333-3333-000000000021', 'Tìm kèo đôi nam nữ trình Trung Bình giao lưu cọ xát', 'Tìm các bạn đam mê cầu lông trình trung bình phong trào tham gia giao lưu. Sân thảm mới, trần cao, ánh sáng tốt không lóa mắt. Lên sân là chiến ngay!', 'INTERMEDIATE', CURRENT_DATE + INTERVAL '7 days' + INTERVAL '15 hours', CURRENT_DATE + INTERVAL '7 days' + INTERVAL '17 hours', 'Sân cầu lông Hoài Đức', 'Khu 6, Thị trấn Trạm Trôi, Hoài Đức, Hà Nội', 21.074, 105.707, ST_SetSRID(ST_MakePoint(105.707, 21.074), 4326)::geography, 6, 5, 'APPROVAL', 'OPEN', 8, 2, NOW() - INTERVAL '1 day', NOW());
INSERT INTO community.match_post_levels (match_post_id, level) VALUES ('77777777-7777-7777-7777-000000000021', 'INTERMEDIATE');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000021', '33333333-3333-3333-3333-000000000021', 'Ngô Văn Khánh', 'APPROVED', NOW() - INTERVAL '2 hours');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000021', '33333333-3333-3333-3333-000000000005', 'Phan Thành Linh', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000021', '33333333-3333-3333-3333-000000000009', 'Ngô Thị Giang', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000021', '33333333-3333-3333-3333-000000000026', 'Hoàng Văn Bình', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000021', '33333333-3333-3333-3333-000000000043', 'Phan Hoàng Khánh', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.match_comments (id, match_post_id, user_id, user_full_name, content, created_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000021', '33333333-3333-3333-3333-000000000002', 'Trần Minh Bình', 'Chào mọi người, mình xin 1 slot nhé!', NOW() - INTERVAL '30 minutes');
INSERT INTO community.match_posts (id, host_id, author_id, title, description, level, start_time, end_time, venue_name, venue_address, latitude, longitude, location, max_players, current_participants, join_mode, status, like_count, comment_count, created_at, updated_at) VALUES
('77777777-7777-7777-7777-000000000022', '33333333-3333-3333-3333-000000000022', '33333333-3333-3333-3333-000000000022', 'Kèo giao lưu nhẹ nhàng cuối tuần cho Khá/Mạnh', 'Nhóm mình cần tuyển thêm 3 bạn trình trung bình khá trở lên giao lưu đôi nam/nữ. Sân đã chuẩn bị đầy đủ cầu Hải Yến và nước uống. Chi phí chia đều cuối buổi.', 'ADVANCED', CURRENT_DATE + INTERVAL '3 days' + INTERVAL '14 hours', CURRENT_DATE + INTERVAL '3 days' + INTERVAL '16 hours', 'Sân cầu lông Đan Phượng', 'Tổ 2, Thị trấn Phùng, Đan Phượng, Hà Nội', 21.096, 105.678, ST_SetSRID(ST_MakePoint(105.678, 21.096), 4326)::geography, 4, 1, 'OPEN', 'OPEN', 7, 2, NOW() - INTERVAL '1 day', NOW());
INSERT INTO community.match_post_levels (match_post_id, level) VALUES ('77777777-7777-7777-7777-000000000022', 'ADVANCED');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000022', '33333333-3333-3333-3333-000000000022', 'Lê Anh Giang', 'APPROVED', NOW() - INTERVAL '2 hours');
INSERT INTO community.match_comments (id, match_post_id, user_id, user_full_name, content, created_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000022', '33333333-3333-3333-3333-000000000038', 'Bùi Anh Anh', 'Chào mọi người, mình xin 1 slot nhé!', NOW() - INTERVAL '30 minutes');
INSERT INTO community.match_posts (id, host_id, author_id, title, description, level, start_time, end_time, venue_name, venue_address, latitude, longitude, location, max_players, current_participants, join_mode, status, like_count, comment_count, created_at, updated_at) VALUES
('77777777-7777-7777-7777-000000000023', '33333333-3333-3333-3333-000000000023', '33333333-3333-3333-3333-000000000023', 'Kèo giao lưu nhẹ nhàng cuối tuần cho Khá/Mạnh', 'Kèo chất lượng cho anh em cọ xát trình trung bình khá trở lên. Yêu cầu tinh thần vui vẻ, giao lưu học hỏi là chính, không cay cú. Có chỗ đỗ xe rộng rãi.', 'ADVANCED', CURRENT_DATE + INTERVAL '2 days' + INTERVAL '14 hours', CURRENT_DATE + INTERVAL '2 days' + INTERVAL '16 hours', 'Sân cầu lông Quốc Oai', 'Khu phố 1, Thị trấn Quốc Oai, Hà Nội', 20.989, 105.634, ST_SetSRID(ST_MakePoint(105.634, 20.989), 4326)::geography, 4, 1, 'APPROVAL', 'OPEN', 8, 2, NOW() - INTERVAL '1 day', NOW());
INSERT INTO community.match_post_levels (match_post_id, level) VALUES ('77777777-7777-7777-7777-000000000023', 'ADVANCED');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000023', '33333333-3333-3333-3333-000000000023', 'Hoàng Hữu Bình', 'APPROVED', NOW() - INTERVAL '2 hours');
INSERT INTO community.match_comments (id, match_post_id, user_id, user_full_name, content, created_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000023', '33333333-3333-3333-3333-000000000024', 'Lê Tuấn Hương', 'Chào mọi người, mình xin 1 slot nhé!', NOW() - INTERVAL '30 minutes');
INSERT INTO community.match_posts (id, host_id, author_id, title, description, level, start_time, end_time, venue_name, venue_address, latitude, longitude, location, max_players, current_participants, join_mode, status, like_count, comment_count, created_at, updated_at) VALUES
('77777777-7777-7777-7777-000000000024', '33333333-3333-3333-3333-000000000024', '33333333-3333-3333-3333-000000000024', 'Tìm kèo đôi nam nữ trình Yếu/Mới chơi giao lưu cọ xát', 'Kèo chất lượng cho anh em cọ xát trình phong trào mới chơi. Yêu cầu tinh thần vui vẻ, giao lưu học hỏi là chính, không cay cú. Có chỗ đỗ xe rộng rãi.', 'BEGINNER', CURRENT_DATE + INTERVAL '1 days' + INTERVAL '16 hours', CURRENT_DATE + INTERVAL '1 days' + INTERVAL '18 hours', 'Sân cầu lông Thạch Thất', 'Khu Đồng Cam, Thị trấn Liên Quan, Thạch Thất, Hà Nội', 21.026, 105.578, ST_SetSRID(ST_MakePoint(105.578, 21.026), 4326)::geography, 6, 5, 'OPEN', 'OPEN', 3, 3, NOW() - INTERVAL '1 day', NOW());
INSERT INTO community.match_post_levels (match_post_id, level) VALUES ('77777777-7777-7777-7777-000000000024', 'BEGINNER');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000024', '33333333-3333-3333-3333-000000000024', 'Lê Tuấn Hương', 'APPROVED', NOW() - INTERVAL '2 hours');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000024', '33333333-3333-3333-3333-000000000003', 'Trần Minh Hùng', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000024', '33333333-3333-3333-3333-000000000021', 'Ngô Văn Khánh', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000024', '33333333-3333-3333-3333-000000000015', 'Phạm Thị Linh', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000024', '33333333-3333-3333-3333-000000000044', 'Hoàng Khánh Hùng', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.match_comments (id, match_post_id, user_id, user_full_name, content, created_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000024', '33333333-3333-3333-3333-000000000009', 'Ngô Thị Giang', 'Chào mọi người, mình xin 1 slot nhé!', NOW() - INTERVAL '30 minutes');
INSERT INTO community.match_posts (id, host_id, author_id, title, description, level, start_time, end_time, venue_name, venue_address, latitude, longitude, location, max_players, current_participants, join_mode, status, like_count, comment_count, created_at, updated_at) VALUES
('77777777-7777-7777-7777-000000000025', '33333333-3333-3333-3333-000000000025', '33333333-3333-3333-3333-000000000025', 'Tìm kèo đôi nam nữ trình Trung Bình giao lưu cọ xát', 'Tìm các bạn đam mê cầu lông trình trung bình phong trào tham gia giao lưu. Sân thảm mới, trần cao, ánh sáng tốt không lóa mắt. Lên sân là chiến ngay!', 'INTERMEDIATE', CURRENT_DATE + INTERVAL '7 days' + INTERVAL '17 hours', CURRENT_DATE + INTERVAL '7 days' + INTERVAL '19 hours', 'Sân cầu lông Chương Mỹ', 'Khu Bắc Sơn, Thị trấn Chúc Sơn, Chương Mỹ, Hà Nội', 20.923, 105.712, ST_SetSRID(ST_MakePoint(105.712, 20.923), 4326)::geography, 4, 1, 'APPROVAL', 'OPEN', 1, 2, NOW() - INTERVAL '1 day', NOW());
INSERT INTO community.match_post_levels (match_post_id, level) VALUES ('77777777-7777-7777-7777-000000000025', 'INTERMEDIATE');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000025', '33333333-3333-3333-3333-000000000025', 'Trần Tuấn Bình', 'APPROVED', NOW() - INTERVAL '2 hours');
INSERT INTO community.match_comments (id, match_post_id, user_id, user_full_name, content, created_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000025', '33333333-3333-3333-3333-000000000010', 'Hoàng Quốc Bình', 'Chào mọi người, mình xin 1 slot nhé!', NOW() - INTERVAL '30 minutes');
INSERT INTO community.match_posts (id, host_id, author_id, title, description, level, start_time, end_time, venue_name, venue_address, latitude, longitude, location, max_players, current_participants, join_mode, status, like_count, comment_count, created_at, updated_at) VALUES
('77777777-7777-7777-7777-000000000026', '33333333-3333-3333-3333-000000000026', '33333333-3333-3333-3333-000000000026', 'Tìm kèo đôi nam nữ trình Trung Bình giao lưu cọ xát', 'Nhóm mình cần tuyển thêm 3 bạn trình trung bình phong trào giao lưu đôi nam/nữ. Sân đã chuẩn bị đầy đủ cầu Hải Yến và nước uống. Chi phí chia đều cuối buổi.', 'INTERMEDIATE', CURRENT_DATE + INTERVAL '3 days' + INTERVAL '17 hours', CURRENT_DATE + INTERVAL '3 days' + INTERVAL '19 hours', 'Sân cầu lông Thanh Oai', 'Thị trấn Kim Bài, Thanh Oai, Hà Nội', 20.875, 105.782, ST_SetSRID(ST_MakePoint(105.782, 20.875), 4326)::geography, 4, 1, 'OPEN', 'OPEN', 2, 2, NOW() - INTERVAL '1 day', NOW());
INSERT INTO community.match_post_levels (match_post_id, level) VALUES ('77777777-7777-7777-7777-000000000026', 'INTERMEDIATE');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000026', '33333333-3333-3333-3333-000000000026', 'Hoàng Văn Bình', 'APPROVED', NOW() - INTERVAL '2 hours');
INSERT INTO community.match_comments (id, match_post_id, user_id, user_full_name, content, created_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000026', '33333333-3333-3333-3333-000000000004', 'Ngô Hoàng Linh', 'Chào mọi người, mình xin 1 slot nhé!', NOW() - INTERVAL '30 minutes');
INSERT INTO community.match_posts (id, host_id, author_id, title, description, level, start_time, end_time, venue_name, venue_address, latitude, longitude, location, max_players, current_participants, join_mode, status, like_count, comment_count, created_at, updated_at) VALUES
('77777777-7777-7777-7777-000000000027', '33333333-3333-3333-3333-000000000027', '33333333-3333-3333-3333-000000000027', 'Giao lưu cầu lông tối thứ tới (+5d) vui vẻ', 'Kèo chất lượng cho anh em cọ xát trình phong trào mới chơi. Yêu cầu tinh thần vui vẻ, giao lưu học hỏi là chính, không cay cú. Có chỗ đỗ xe rộng rãi.', 'BEGINNER', CURRENT_DATE + INTERVAL '5 days' + INTERVAL '15 hours', CURRENT_DATE + INTERVAL '5 days' + INTERVAL '17 hours', 'Sân cầu lông Thường Tín', 'Thị trấn Thường Tín, Thường Tín, Hà Nội', 20.871, 105.856, ST_SetSRID(ST_MakePoint(105.856, 20.871), 4326)::geography, 6, 3, 'APPROVAL', 'OPEN', 2, 1, NOW() - INTERVAL '1 day', NOW());
INSERT INTO community.match_post_levels (match_post_id, level) VALUES ('77777777-7777-7777-7777-000000000027', 'BEGINNER');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000027', '33333333-3333-3333-3333-000000000027', 'Vũ Tuấn Giang', 'APPROVED', NOW() - INTERVAL '2 hours');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000027', '33333333-3333-3333-3333-000000000048', 'Hồ Văn Tuấn', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000027', '33333333-3333-3333-3333-000000000003', 'Trần Minh Hùng', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.match_comments (id, match_post_id, user_id, user_full_name, content, created_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000027', '33333333-3333-3333-3333-000000000032', 'Phạm Anh Hương', 'Chào mọi người, mình xin 1 slot nhé!', NOW() - INTERVAL '30 minutes');
INSERT INTO community.match_posts (id, host_id, author_id, title, description, level, start_time, end_time, venue_name, venue_address, latitude, longitude, location, max_players, current_participants, join_mode, status, like_count, comment_count, created_at, updated_at) VALUES
('77777777-7777-7777-7777-000000000028', '33333333-3333-3333-3333-000000000028', '33333333-3333-3333-3333-000000000028', 'Kèo giao lưu nhẹ nhàng cuối tuần cho Trung Bình', 'Nhóm mình cần tuyển thêm 2 bạn trình trung bình phong trào giao lưu đôi nam/nữ. Sân đã chuẩn bị đầy đủ cầu Hải Yến và nước uống. Chi phí chia đều cuối buổi.', 'INTERMEDIATE', CURRENT_DATE + INTERVAL '7 days' + INTERVAL '15 hours', CURRENT_DATE + INTERVAL '7 days' + INTERVAL '17 hours', 'Sân cầu lông Phú Xuyên', 'Thị trấn Phú Xuyên, Phú Xuyên, Hà Nội', 20.732, 105.902, ST_SetSRID(ST_MakePoint(105.902, 20.732), 4326)::geography, 4, 1, 'OPEN', 'OPEN', 7, 2, NOW() - INTERVAL '1 day', NOW());
INSERT INTO community.match_post_levels (match_post_id, level) VALUES ('77777777-7777-7777-7777-000000000028', 'INTERMEDIATE');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000028', '33333333-3333-3333-3333-000000000028', 'Lê Văn Vy', 'APPROVED', NOW() - INTERVAL '2 hours');
INSERT INTO community.match_comments (id, match_post_id, user_id, user_full_name, content, created_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000028', '33333333-3333-3333-3333-000000000001', 'Lê Quốc Trang', 'Chào mọi người, mình xin 1 slot nhé!', NOW() - INTERVAL '30 minutes');
INSERT INTO community.match_posts (id, host_id, author_id, title, description, level, start_time, end_time, venue_name, venue_address, latitude, longitude, location, max_players, current_participants, join_mode, status, like_count, comment_count, created_at, updated_at) VALUES
('77777777-7777-7777-7777-000000000029', '33333333-3333-3333-3333-000000000029', '33333333-3333-3333-3333-000000000029', 'Kèo giao lưu nhẹ nhàng cuối tuần cho Yếu/Mới chơi', 'Kèo chất lượng cho anh em cọ xát trình phong trào mới chơi. Yêu cầu tinh thần vui vẻ, giao lưu học hỏi là chính, không cay cú. Có chỗ đỗ xe rộng rãi.', 'BEGINNER', CURRENT_DATE + INTERVAL '3 days' + INTERVAL '14 hours', CURRENT_DATE + INTERVAL '3 days' + INTERVAL '16 hours', 'Sân cầu lông Ứng Hòa', 'Thị trấn Vân Đình, Ứng Hòa, Hà Nội', 20.725, 105.765, ST_SetSRID(ST_MakePoint(105.765, 20.725), 4326)::geography, 4, 1, 'APPROVAL', 'OPEN', 1, 2, NOW() - INTERVAL '1 day', NOW());
INSERT INTO community.match_post_levels (match_post_id, level) VALUES ('77777777-7777-7777-7777-000000000029', 'BEGINNER');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000029', '33333333-3333-3333-3333-000000000029', 'Vũ Tuấn Khánh', 'APPROVED', NOW() - INTERVAL '2 hours');
INSERT INTO community.match_comments (id, match_post_id, user_id, user_full_name, content, created_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000029', '33333333-3333-3333-3333-000000000043', 'Phan Hoàng Khánh', 'Chào mọi người, mình xin 1 slot nhé!', NOW() - INTERVAL '30 minutes');
INSERT INTO community.match_posts (id, host_id, author_id, title, description, level, start_time, end_time, venue_name, venue_address, latitude, longitude, location, max_players, current_participants, join_mode, status, like_count, comment_count, created_at, updated_at) VALUES
('77777777-7777-7777-7777-000000000030', '33333333-3333-3333-3333-000000000030', '33333333-3333-3333-3333-000000000030', 'Tuyển thêm 2 tay vợt trình Khá/Mạnh lên sân', 'Kèo chất lượng cho anh em cọ xát trình trung bình khá trở lên. Yêu cầu tinh thần vui vẻ, giao lưu học hỏi là chính, không cay cú. Có chỗ đỗ xe rộng rãi.', 'ADVANCED', CURRENT_DATE + INTERVAL '1 days' + INTERVAL '15 hours', CURRENT_DATE + INTERVAL '1 days' + INTERVAL '17 hours', 'Sân cầu lông Mỹ Đức', 'Thị trấn Đại Nghĩa, Mỹ Đức, Hà Nội', 20.698, 105.743, ST_SetSRID(ST_MakePoint(105.743, 20.698), 4326)::geography, 6, 1, 'OPEN', 'OPEN', 9, 3, NOW() - INTERVAL '1 day', NOW());
INSERT INTO community.match_post_levels (match_post_id, level) VALUES ('77777777-7777-7777-7777-000000000030', 'ADVANCED');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000030', '33333333-3333-3333-3333-000000000030', 'Nguyễn Khánh Bình', 'APPROVED', NOW() - INTERVAL '2 hours');
INSERT INTO community.match_comments (id, match_post_id, user_id, user_full_name, content, created_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000030', '33333333-3333-3333-3333-000000000014', 'Ngô Khánh Giang', 'Chào mọi người, mình xin 1 slot nhé!', NOW() - INTERVAL '30 minutes');
INSERT INTO community.match_posts (id, host_id, author_id, title, description, level, start_time, end_time, venue_name, venue_address, latitude, longitude, location, max_players, current_participants, join_mode, status, like_count, comment_count, created_at, updated_at) VALUES
('77777777-7777-7777-7777-000000000031', '33333333-3333-3333-3333-000000000031', '33333333-3333-3333-3333-000000000031', 'Kèo giao lưu nhẹ nhàng cuối tuần cho Trung Bình', 'Tìm các bạn đam mê cầu lông trình trung bình phong trào tham gia giao lưu. Sân thảm mới, trần cao, ánh sáng tốt không lóa mắt. Lên sân là chiến ngay!', 'INTERMEDIATE', CURRENT_DATE + INTERVAL '7 days' + INTERVAL '17 hours', CURRENT_DATE + INTERVAL '7 days' + INTERVAL '19 hours', 'Sân cầu lông Sơn Tây', 'Phường Quang Trung, Sơn Tây, Hà Nội', 21.136, 105.502, ST_SetSRID(ST_MakePoint(105.502, 21.136), 4326)::geography, 4, 3, 'APPROVAL', 'OPEN', 3, 1, NOW() - INTERVAL '1 day', NOW());
INSERT INTO community.match_post_levels (match_post_id, level) VALUES ('77777777-7777-7777-7777-000000000031', 'INTERMEDIATE');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000031', '33333333-3333-3333-3333-000000000031', 'Ngô Anh Phúc', 'APPROVED', NOW() - INTERVAL '2 hours');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000031', '33333333-3333-3333-3333-000000000027', 'Vũ Tuấn Giang', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000031', '33333333-3333-3333-3333-000000000038', 'Bùi Anh Anh', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.match_comments (id, match_post_id, user_id, user_full_name, content, created_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000031', '33333333-3333-3333-3333-000000000039', 'Lê Ngọc Trang', 'Chào mọi người, mình xin 1 slot nhé!', NOW() - INTERVAL '30 minutes');
INSERT INTO community.match_posts (id, host_id, author_id, title, description, level, start_time, end_time, venue_name, venue_address, latitude, longitude, location, max_players, current_participants, join_mode, status, like_count, comment_count, created_at, updated_at) VALUES
('77777777-7777-7777-7777-000000000032', '33333333-3333-3333-3333-000000000032', '33333333-3333-3333-3333-000000000032', 'Giao lưu cầu lông tối thứ tới (+5d) vui vẻ', 'Kèo chất lượng cho anh em cọ xát trình phong trào mới chơi. Yêu cầu tinh thần vui vẻ, giao lưu học hỏi là chính, không cay cú. Có chỗ đỗ xe rộng rãi.', 'BEGINNER', CURRENT_DATE + INTERVAL '5 days' + INTERVAL '16 hours', CURRENT_DATE + INTERVAL '5 days' + INTERVAL '18 hours', 'Sân cầu lông Ba Vì', 'Thị trấn Tây Đằng, Ba Vì, Hà Nội', 21.198, 105.398, ST_SetSRID(ST_MakePoint(105.398, 21.198), 4326)::geography, 4, 2, 'OPEN', 'OPEN', 8, 1, NOW() - INTERVAL '1 day', NOW());
INSERT INTO community.match_post_levels (match_post_id, level) VALUES ('77777777-7777-7777-7777-000000000032', 'BEGINNER');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000032', '33333333-3333-3333-3333-000000000032', 'Phạm Anh Hương', 'APPROVED', NOW() - INTERVAL '2 hours');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000032', '33333333-3333-3333-3333-000000000036', 'Hoàng Thị Phúc', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.match_comments (id, match_post_id, user_id, user_full_name, content, created_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000032', '33333333-3333-3333-3333-000000000048', 'Hồ Văn Tuấn', 'Chào mọi người, mình xin 1 slot nhé!', NOW() - INTERVAL '30 minutes');
INSERT INTO community.match_posts (id, host_id, author_id, title, description, level, start_time, end_time, venue_name, venue_address, latitude, longitude, location, max_players, current_participants, join_mode, status, like_count, comment_count, created_at, updated_at) VALUES
('77777777-7777-7777-7777-000000000033', '33333333-3333-3333-3333-000000000033', '33333333-3333-3333-3333-000000000033', 'Tuyển thêm 3 tay vợt trình Trung Bình lên sân', 'Nhóm mình cần tuyển thêm 3 bạn trình trung bình phong trào giao lưu đôi nam/nữ. Sân đã chuẩn bị đầy đủ cầu Hải Yến và nước uống. Chi phí chia đều cuối buổi.', 'INTERMEDIATE', CURRENT_DATE + INTERVAL '3 days' + INTERVAL '16 hours', CURRENT_DATE + INTERVAL '3 days' + INTERVAL '18 hours', 'Sân cầu lông Phúc Thọ', 'Thị trấn Phúc Thọ, Phúc Thọ, Hà Nội', 21.107, 105.592, ST_SetSRID(ST_MakePoint(105.592, 21.107), 4326)::geography, 6, 4, 'APPROVAL', 'OPEN', 2, 2, NOW() - INTERVAL '1 day', NOW());
INSERT INTO community.match_post_levels (match_post_id, level) VALUES ('77777777-7777-7777-7777-000000000033', 'INTERMEDIATE');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000033', '33333333-3333-3333-3333-000000000033', 'Đặng Minh Tuấn', 'APPROVED', NOW() - INTERVAL '2 hours');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000033', '33333333-3333-3333-3333-000000000008', 'Phan Đức Hương', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000033', '33333333-3333-3333-3333-000000000039', 'Lê Ngọc Trang', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000033', '33333333-3333-3333-3333-000000000037', 'Bùi Văn Anh', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.match_comments (id, match_post_id, user_id, user_full_name, content, created_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000033', '33333333-3333-3333-3333-000000000007', 'Hoàng Tuấn Duy', 'Chào mọi người, mình xin 1 slot nhé!', NOW() - INTERVAL '30 minutes');
INSERT INTO community.match_posts (id, host_id, author_id, title, description, level, start_time, end_time, venue_name, venue_address, latitude, longitude, location, max_players, current_participants, join_mode, status, like_count, comment_count, created_at, updated_at) VALUES
('77777777-7777-7777-7777-000000000034', '33333333-3333-3333-3333-000000000034', '33333333-3333-3333-3333-000000000034', 'Tuyển thêm 1 tay vợt trình Trung Bình lên sân', 'Nhóm chơi phong trào tìm kiếm đồng đội cùng trình độ trung bình phong trào. Đánh vui vẻ, vận động cơ thể sau giờ làm việc căng thẳng.', 'INTERMEDIATE', CURRENT_DATE + INTERVAL '7 days' + INTERVAL '15 hours', CURRENT_DATE + INTERVAL '7 days' + INTERVAL '17 hours', 'Sân cầu lông Mê Linh', 'Đại Thịnh, Mê Linh, Hà Nội', 21.189, 105.729, ST_SetSRID(ST_MakePoint(105.729, 21.189), 4326)::geography, 4, 1, 'OPEN', 'OPEN', 2, 1, NOW() - INTERVAL '1 day', NOW());
INSERT INTO community.match_post_levels (match_post_id, level) VALUES ('77777777-7777-7777-7777-000000000034', 'INTERMEDIATE');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000034', '33333333-3333-3333-3333-000000000034', 'Hoàng Hữu Giang', 'APPROVED', NOW() - INTERVAL '2 hours');
INSERT INTO community.match_comments (id, match_post_id, user_id, user_full_name, content, created_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000034', '33333333-3333-3333-3333-000000000027', 'Vũ Tuấn Giang', 'Chào mọi người, mình xin 1 slot nhé!', NOW() - INTERVAL '30 minutes');
INSERT INTO community.match_posts (id, host_id, author_id, title, description, level, start_time, end_time, venue_name, venue_address, latitude, longitude, location, max_players, current_participants, join_mode, status, like_count, comment_count, created_at, updated_at) VALUES
('77777777-7777-7777-7777-000000000035', '33333333-3333-3333-3333-000000000035', '33333333-3333-3333-3333-000000000035', 'Giao lưu cầu lông sáng sớm nâng cao sức khỏe', 'Nhóm mình cần tuyển thêm 1 bạn trình trung bình khá trở lên giao lưu đôi nam/nữ. Sân đã chuẩn bị đầy đủ cầu Hải Yến và nước uống. Chi phí chia đều cuối buổi.', 'ADVANCED', CURRENT_DATE + INTERVAL '6 days' + INTERVAL '15 hours', CURRENT_DATE + INTERVAL '6 days' + INTERVAL '17 hours', 'Sân cầu lông Nội Bài', 'Sân bay Nội Bài, Sóc Sơn, Hà Nội', 21.218, 105.804, ST_SetSRID(ST_MakePoint(105.804, 21.218), 4326)::geography, 4, 3, 'APPROVAL', 'OPEN', 4, 3, NOW() - INTERVAL '1 day', NOW());
INSERT INTO community.match_post_levels (match_post_id, level) VALUES ('77777777-7777-7777-7777-000000000035', 'ADVANCED');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000035', '33333333-3333-3333-3333-000000000035', 'Hồ Văn Linh', 'APPROVED', NOW() - INTERVAL '2 hours');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000035', '33333333-3333-3333-3333-000000000004', 'Ngô Hoàng Linh', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000035', '33333333-3333-3333-3333-000000000003', 'Trần Minh Hùng', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.match_comments (id, match_post_id, user_id, user_full_name, content, created_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000035', '33333333-3333-3333-3333-000000000013', 'Đỗ Minh Linh', 'Chào mọi người, mình xin 1 slot nhé!', NOW() - INTERVAL '30 minutes');
INSERT INTO community.match_posts (id, host_id, author_id, title, description, level, start_time, end_time, venue_name, venue_address, latitude, longitude, location, max_players, current_participants, join_mode, status, like_count, comment_count, created_at, updated_at) VALUES
('77777777-7777-7777-7777-000000000036', '33333333-3333-3333-3333-000000000036', '33333333-3333-3333-3333-000000000036', 'Tìm kèo đôi nam nữ trình Yếu/Mới chơi giao lưu cọ xát', 'Tìm các bạn đam mê cầu lông trình phong trào mới chơi tham gia giao lưu. Sân thảm mới, trần cao, ánh sáng tốt không lóa mắt. Lên sân là chiến ngay!', 'BEGINNER', CURRENT_DATE + INTERVAL '6 days' + INTERVAL '15 hours', CURRENT_DATE + INTERVAL '6 days' + INTERVAL '17 hours', 'Sân cầu lông Khương Đình', '450 Vũ Tông Phan, Thanh Xuân, Hà Nội', 20.987, 105.819, ST_SetSRID(ST_MakePoint(105.819, 20.987), 4326)::geography, 6, 1, 'OPEN', 'OPEN', 3, 2, NOW() - INTERVAL '1 day', NOW());
INSERT INTO community.match_post_levels (match_post_id, level) VALUES ('77777777-7777-7777-7777-000000000036', 'BEGINNER');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000036', '33333333-3333-3333-3333-000000000036', 'Hoàng Thị Phúc', 'APPROVED', NOW() - INTERVAL '2 hours');
INSERT INTO community.match_comments (id, match_post_id, user_id, user_full_name, content, created_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000036', '33333333-3333-3333-3333-000000000017', 'Đỗ Ngọc Phúc', 'Chào mọi người, mình xin 1 slot nhé!', NOW() - INTERVAL '30 minutes');
INSERT INTO community.match_posts (id, host_id, author_id, title, description, level, start_time, end_time, venue_name, venue_address, latitude, longitude, location, max_players, current_participants, join_mode, status, like_count, comment_count, created_at, updated_at) VALUES
('77777777-7777-7777-7777-000000000037', '33333333-3333-3333-3333-000000000037', '33333333-3333-3333-3333-000000000037', 'Kèo giao lưu nhẹ nhàng cuối tuần cho Khá/Mạnh', 'Kèo chất lượng cho anh em cọ xát trình trung bình khá trở lên. Yêu cầu tinh thần vui vẻ, giao lưu học hỏi là chính, không cay cú. Có chỗ đỗ xe rộng rãi.', 'ADVANCED', CURRENT_DATE + INTERVAL '7 days' + INTERVAL '14 hours', CURRENT_DATE + INTERVAL '7 days' + INTERVAL '16 hours', 'Sân cầu lông Định Công', '12 Trần Điền, Hoàng Mai, Hà Nội', 20.982, 105.834, ST_SetSRID(ST_MakePoint(105.834, 20.982), 4326)::geography, 4, 3, 'APPROVAL', 'OPEN', 1, 2, NOW() - INTERVAL '1 day', NOW());
INSERT INTO community.match_post_levels (match_post_id, level) VALUES ('77777777-7777-7777-7777-000000000037', 'ADVANCED');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000037', '33333333-3333-3333-3333-000000000037', 'Bùi Văn Anh', 'APPROVED', NOW() - INTERVAL '2 hours');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000037', '33333333-3333-3333-3333-000000000047', 'Phan Thị Hùng', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000037', '33333333-3333-3333-3333-000000000001', 'Lê Quốc Trang', 'PENDING', NOW() - INTERVAL '1 hour');
INSERT INTO community.match_comments (id, match_post_id, user_id, user_full_name, content, created_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000037', '33333333-3333-3333-3333-000000000003', 'Trần Minh Hùng', 'Chào mọi người, mình xin 1 slot nhé!', NOW() - INTERVAL '30 minutes');
INSERT INTO community.match_posts (id, host_id, author_id, title, description, level, start_time, end_time, venue_name, venue_address, latitude, longitude, location, max_players, current_participants, join_mode, status, like_count, comment_count, created_at, updated_at) VALUES
('77777777-7777-7777-7777-000000000038', '33333333-3333-3333-3333-000000000038', '33333333-3333-3333-3333-000000000038', 'Giao lưu cầu lông sáng sớm nâng cao sức khỏe', 'Tìm các bạn đam mê cầu lông trình trung bình phong trào tham gia giao lưu. Sân thảm mới, trần cao, ánh sáng tốt không lóa mắt. Lên sân là chiến ngay!', 'INTERMEDIATE', CURRENT_DATE + INTERVAL '2 days' + INTERVAL '14 hours', CURRENT_DATE + INTERVAL '2 days' + INTERVAL '16 hours', 'Sân cầu lông Giáp Bát', '50 Kim Đồng, Hoàng Mai, Hà Nội', 20.978, 105.845, ST_SetSRID(ST_MakePoint(105.845, 20.978), 4326)::geography, 4, 2, 'OPEN', 'OPEN', 9, 0, NOW() - INTERVAL '1 day', NOW());
INSERT INTO community.match_post_levels (match_post_id, level) VALUES ('77777777-7777-7777-7777-000000000038', 'INTERMEDIATE');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000038', '33333333-3333-3333-3333-000000000038', 'Bùi Anh Anh', 'APPROVED', NOW() - INTERVAL '2 hours');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000038', '33333333-3333-3333-3333-000000000011', 'Hoàng Thành Bình', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.match_posts (id, host_id, author_id, title, description, level, start_time, end_time, venue_name, venue_address, latitude, longitude, location, max_players, current_participants, join_mode, status, like_count, comment_count, created_at, updated_at) VALUES
('77777777-7777-7777-7777-000000000039', '33333333-3333-3333-3333-000000000039', '33333333-3333-3333-3333-000000000039', 'Tìm kèo đôi nam nữ trình Khá/Mạnh giao lưu cọ xát', 'Tìm các bạn đam mê cầu lông trình trung bình khá trở lên tham gia giao lưu. Sân thảm mới, trần cao, ánh sáng tốt không lóa mắt. Lên sân là chiến ngay!', 'ADVANCED', CURRENT_DATE + INTERVAL '7 days' + INTERVAL '17 hours', CURRENT_DATE + INTERVAL '7 days' + INTERVAL '19 hours', 'Sân cầu lông Mai Dịch', '7 Trần Bình, Cầu Giấy, Hà Nội', 21.038, 105.779, ST_SetSRID(ST_MakePoint(105.779, 21.038), 4326)::geography, 6, 2, 'APPROVAL', 'OPEN', 9, 3, NOW() - INTERVAL '1 day', NOW());
INSERT INTO community.match_post_levels (match_post_id, level) VALUES ('77777777-7777-7777-7777-000000000039', 'ADVANCED');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000039', '33333333-3333-3333-3333-000000000039', 'Lê Ngọc Trang', 'APPROVED', NOW() - INTERVAL '2 hours');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000039', '33333333-3333-3333-3333-000000000049', 'Hoàng Ngọc Trang', 'PENDING', NOW() - INTERVAL '1 hour');
INSERT INTO community.match_comments (id, match_post_id, user_id, user_full_name, content, created_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000039', '33333333-3333-3333-3333-000000000038', 'Bùi Anh Anh', 'Chào mọi người, mình xin 1 slot nhé!', NOW() - INTERVAL '30 minutes');
INSERT INTO community.match_posts (id, host_id, author_id, title, description, level, start_time, end_time, venue_name, venue_address, latitude, longitude, location, max_players, current_participants, join_mode, status, like_count, comment_count, created_at, updated_at) VALUES
('77777777-7777-7777-7777-000000000040', '33333333-3333-3333-3333-000000000040', '33333333-3333-3333-3333-000000000040', 'Giao lưu cầu lông sáng sớm nâng cao sức khỏe', 'Kèo chất lượng cho anh em cọ xát trình phong trào mới chơi. Yêu cầu tinh thần vui vẻ, giao lưu học hỏi là chính, không cay cú. Có chỗ đỗ xe rộng rãi.', 'BEGINNER', CURRENT_DATE + INTERVAL '6 days' + INTERVAL '15 hours', CURRENT_DATE + INTERVAL '6 days' + INTERVAL '17 hours', 'Sân cầu lông Nghĩa Tân', '14 Tô Hiệu, Cầu Giấy, Hà Nội', 21.044, 105.795, ST_SetSRID(ST_MakePoint(105.795, 21.044), 4326)::geography, 4, 2, 'OPEN', 'OPEN', 9, 0, NOW() - INTERVAL '1 day', NOW());
INSERT INTO community.match_post_levels (match_post_id, level) VALUES ('77777777-7777-7777-7777-000000000040', 'BEGINNER');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000040', '33333333-3333-3333-3333-000000000040', 'Nguyễn Quốc Trang', 'APPROVED', NOW() - INTERVAL '2 hours');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000040', '33333333-3333-3333-3333-000000000005', 'Phan Thành Linh', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.match_posts (id, host_id, author_id, title, description, level, start_time, end_time, venue_name, venue_address, latitude, longitude, location, max_players, current_participants, join_mode, status, like_count, comment_count, created_at, updated_at) VALUES
('77777777-7777-7777-7777-000000000041', '33333333-3333-3333-3333-000000000041', '33333333-3333-3333-3333-000000000041', 'Tìm đối thủ cứng tay đánh đơn/đôi trình Yếu/Mới chơi', 'Tìm các bạn đam mê cầu lông trình phong trào mới chơi tham gia giao lưu. Sân thảm mới, trần cao, ánh sáng tốt không lóa mắt. Lên sân là chiến ngay!', 'BEGINNER', CURRENT_DATE + INTERVAL '6 days' + INTERVAL '17 hours', CURRENT_DATE + INTERVAL '6 days' + INTERVAL '19 hours', 'Sân cầu lông Trung Hòa', '32 Trung Kính, Cầu Giấy, Hà Nội', 21.018, 105.799, ST_SetSRID(ST_MakePoint(105.799, 21.018), 4326)::geography, 4, 1, 'APPROVAL', 'OPEN', 1, 0, NOW() - INTERVAL '1 day', NOW());
INSERT INTO community.match_post_levels (match_post_id, level) VALUES ('77777777-7777-7777-7777-000000000041', 'BEGINNER');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000041', '33333333-3333-3333-3333-000000000041', 'Hồ Khánh Cường', 'APPROVED', NOW() - INTERVAL '2 hours');
INSERT INTO community.match_posts (id, host_id, author_id, title, description, level, start_time, end_time, venue_name, venue_address, latitude, longitude, location, max_players, current_participants, join_mode, status, like_count, comment_count, created_at, updated_at) VALUES
('77777777-7777-7777-7777-000000000042', '33333333-3333-3333-3333-000000000042', '33333333-3333-3333-3333-000000000042', 'Tuyển thêm 2 tay vợt trình Khá/Mạnh lên sân', 'Nhóm mình cần tuyển thêm 3 bạn trình trung bình khá trở lên giao lưu đôi nam/nữ. Sân đã chuẩn bị đầy đủ cầu Hải Yến và nước uống. Chi phí chia đều cuối buổi.', 'ADVANCED', CURRENT_DATE + INTERVAL '7 days' + INTERVAL '16 hours', CURRENT_DATE + INTERVAL '7 days' + INTERVAL '18 hours', 'Sân cầu lông Yên Hòa', '110 Nguyễn Khang, Cầu Giấy, Hà Nội', 21.02, 105.801, ST_SetSRID(ST_MakePoint(105.801, 21.02), 4326)::geography, 6, 1, 'OPEN', 'OPEN', 9, 2, NOW() - INTERVAL '1 day', NOW());
INSERT INTO community.match_post_levels (match_post_id, level) VALUES ('77777777-7777-7777-7777-000000000042', 'ADVANCED');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000042', '33333333-3333-3333-3333-000000000042', 'Phan Văn Vy', 'APPROVED', NOW() - INTERVAL '2 hours');
INSERT INTO community.match_comments (id, match_post_id, user_id, user_full_name, content, created_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000042', '33333333-3333-3333-3333-000000000007', 'Hoàng Tuấn Duy', 'Chào mọi người, mình xin 1 slot nhé!', NOW() - INTERVAL '30 minutes');
INSERT INTO community.match_posts (id, host_id, author_id, title, description, level, start_time, end_time, venue_name, venue_address, latitude, longitude, location, max_players, current_participants, join_mode, status, like_count, comment_count, created_at, updated_at) VALUES
('77777777-7777-7777-7777-000000000043', '33333333-3333-3333-3333-000000000043', '33333333-3333-3333-3333-000000000043', 'Tuyển thêm 3 tay vợt trình Khá/Mạnh lên sân', 'Tìm các bạn đam mê cầu lông trình trung bình khá trở lên tham gia giao lưu. Sân thảm mới, trần cao, ánh sáng tốt không lóa mắt. Lên sân là chiến ngay!', 'ADVANCED', CURRENT_DATE + INTERVAL '7 days' + INTERVAL '14 hours', CURRENT_DATE + INTERVAL '7 days' + INTERVAL '16 hours', 'Sân cầu lông Láng Hạ', '20 Huỳnh Thúc Kháng, Đống Đa, Hà Nội', 21.018, 105.815, ST_SetSRID(ST_MakePoint(105.815, 21.018), 4326)::geography, 4, 1, 'APPROVAL', 'OPEN', 6, 2, NOW() - INTERVAL '1 day', NOW());
INSERT INTO community.match_post_levels (match_post_id, level) VALUES ('77777777-7777-7777-7777-000000000043', 'ADVANCED');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000043', '33333333-3333-3333-3333-000000000043', 'Phan Hoàng Khánh', 'APPROVED', NOW() - INTERVAL '2 hours');
INSERT INTO community.match_comments (id, match_post_id, user_id, user_full_name, content, created_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000043', '33333333-3333-3333-3333-000000000039', 'Lê Ngọc Trang', 'Chào mọi người, mình xin 1 slot nhé!', NOW() - INTERVAL '30 minutes');
INSERT INTO community.match_posts (id, host_id, author_id, title, description, level, start_time, end_time, venue_name, venue_address, latitude, longitude, location, max_players, current_participants, join_mode, status, like_count, comment_count, created_at, updated_at) VALUES
('77777777-7777-7777-7777-000000000044', '33333333-3333-3333-3333-000000000044', '33333333-3333-3333-3333-000000000044', 'Tìm kèo đôi nam nữ trình Trung Bình giao lưu cọ xát', 'Nhóm chơi phong trào tìm kiếm đồng đội cùng trình độ trung bình phong trào. Đánh vui vẻ, vận động cơ thể sau giờ làm việc căng thẳng.', 'INTERMEDIATE', CURRENT_DATE + INTERVAL '2 days' + INTERVAL '16 hours', CURRENT_DATE + INTERVAL '2 days' + INTERVAL '18 hours', 'Sân cầu lông Kim Liên', '1 Phạm Ngọc Thạch, Đống Đa, Hà Nội', 21.009, 105.832, ST_SetSRID(ST_MakePoint(105.832, 21.009), 4326)::geography, 4, 1, 'OPEN', 'OPEN', 7, 1, NOW() - INTERVAL '1 day', NOW());
INSERT INTO community.match_post_levels (match_post_id, level) VALUES ('77777777-7777-7777-7777-000000000044', 'INTERMEDIATE');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000044', '33333333-3333-3333-3333-000000000044', 'Hoàng Khánh Hùng', 'APPROVED', NOW() - INTERVAL '2 hours');
INSERT INTO community.match_comments (id, match_post_id, user_id, user_full_name, content, created_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000044', '33333333-3333-3333-3333-000000000035', 'Hồ Văn Linh', 'Chào mọi người, mình xin 1 slot nhé!', NOW() - INTERVAL '30 minutes');
INSERT INTO community.match_posts (id, host_id, author_id, title, description, level, start_time, end_time, venue_name, venue_address, latitude, longitude, location, max_players, current_participants, join_mode, status, like_count, comment_count, created_at, updated_at) VALUES
('77777777-7777-7777-7777-000000000045', '33333333-3333-3333-3333-000000000045', '33333333-3333-3333-3333-000000000045', 'Giao lưu cầu lông sáng sớm nâng cao sức khỏe', 'Kèo chất lượng cho anh em cọ xát trình trung bình phong trào. Yêu cầu tinh thần vui vẻ, giao lưu học hỏi là chính, không cay cú. Có chỗ đỗ xe rộng rãi.', 'INTERMEDIATE', CURRENT_DATE + INTERVAL '1 days' + INTERVAL '17 hours', CURRENT_DATE + INTERVAL '1 days' + INTERVAL '19 hours', 'Sân cầu lông Khương Thượng', '165 Chùa Bộc, Đống Đa, Hà Nội', 21.006, 105.828, ST_SetSRID(ST_MakePoint(105.828, 21.006), 4326)::geography, 6, 1, 'APPROVAL', 'OPEN', 8, 3, NOW() - INTERVAL '1 day', NOW());
INSERT INTO community.match_post_levels (match_post_id, level) VALUES ('77777777-7777-7777-7777-000000000045', 'INTERMEDIATE');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000045', '33333333-3333-3333-3333-000000000045', 'Ngô Minh Duy', 'APPROVED', NOW() - INTERVAL '2 hours');
INSERT INTO community.match_comments (id, match_post_id, user_id, user_full_name, content, created_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000045', '33333333-3333-3333-3333-000000000039', 'Lê Ngọc Trang', 'Chào mọi người, mình xin 1 slot nhé!', NOW() - INTERVAL '30 minutes');
INSERT INTO community.match_posts (id, host_id, author_id, title, description, level, start_time, end_time, venue_name, venue_address, latitude, longitude, location, max_players, current_participants, join_mode, status, like_count, comment_count, created_at, updated_at) VALUES
('77777777-7777-7777-7777-000000000046', '33333333-3333-3333-3333-000000000046', '33333333-3333-3333-3333-000000000046', 'Cần tuyển slot gấp cho nhóm cầu lông tối nay', 'Kèo chất lượng cho anh em cọ xát trình trung bình phong trào. Yêu cầu tinh thần vui vẻ, giao lưu học hỏi là chính, không cay cú. Có chỗ đỗ xe rộng rãi.', 'INTERMEDIATE', CURRENT_DATE + INTERVAL '5 days' + INTERVAL '16 hours', CURRENT_DATE + INTERVAL '5 days' + INTERVAL '18 hours', 'Sân cầu lông Thành Công', '57 Láng Hạ, Đống Đa, Hà Nội', 21.019, 105.812, ST_SetSRID(ST_MakePoint(105.812, 21.019), 4326)::geography, 4, 1, 'OPEN', 'OPEN', 2, 0, NOW() - INTERVAL '1 day', NOW());
INSERT INTO community.match_post_levels (match_post_id, level) VALUES ('77777777-7777-7777-7777-000000000046', 'INTERMEDIATE');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000046', '33333333-3333-3333-3333-000000000046', 'Đặng Hoàng Phúc', 'APPROVED', NOW() - INTERVAL '2 hours');
INSERT INTO community.match_posts (id, host_id, author_id, title, description, level, start_time, end_time, venue_name, venue_address, latitude, longitude, location, max_players, current_participants, join_mode, status, like_count, comment_count, created_at, updated_at) VALUES
('77777777-7777-7777-7777-000000000047', '33333333-3333-3333-3333-000000000047', '33333333-3333-3333-3333-000000000047', 'Kèo giao lưu nhẹ nhàng cuối tuần cho Yếu/Mới chơi', 'Kèo chất lượng cho anh em cọ xát trình phong trào mới chơi. Yêu cầu tinh thần vui vẻ, giao lưu học hỏi là chính, không cay cú. Có chỗ đỗ xe rộng rãi.', 'BEGINNER', CURRENT_DATE + INTERVAL '7 days' + INTERVAL '15 hours', CURRENT_DATE + INTERVAL '7 days' + INTERVAL '17 hours', 'Sân cầu lông Giảng Võ', '140 Giảng Võ, Ba Đình, Hà Nội', 21.029, 105.823, ST_SetSRID(ST_MakePoint(105.823, 21.029), 4326)::geography, 4, 3, 'APPROVAL', 'OPEN', 8, 2, NOW() - INTERVAL '1 day', NOW());
INSERT INTO community.match_post_levels (match_post_id, level) VALUES ('77777777-7777-7777-7777-000000000047', 'BEGINNER');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000047', '33333333-3333-3333-3333-000000000047', 'Phan Thị Hùng', 'APPROVED', NOW() - INTERVAL '2 hours');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000047', '33333333-3333-3333-3333-000000000011', 'Hoàng Thành Bình', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000047', '33333333-3333-3333-3333-000000000007', 'Hoàng Tuấn Duy', 'PENDING', NOW() - INTERVAL '1 hour');
INSERT INTO community.match_comments (id, match_post_id, user_id, user_full_name, content, created_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000047', '33333333-3333-3333-3333-000000000023', 'Hoàng Hữu Bình', 'Chào mọi người, mình xin 1 slot nhé!', NOW() - INTERVAL '30 minutes');
INSERT INTO community.match_posts (id, host_id, author_id, title, description, level, start_time, end_time, venue_name, venue_address, latitude, longitude, location, max_players, current_participants, join_mode, status, like_count, comment_count, created_at, updated_at) VALUES
('77777777-7777-7777-7777-000000000048', '33333333-3333-3333-3333-000000000048', '33333333-3333-3333-3333-000000000048', 'Kèo giao lưu nhẹ nhàng cuối tuần cho Yếu/Mới chơi', 'Nhóm chơi phong trào tìm kiếm đồng đội cùng trình độ phong trào mới chơi. Đánh vui vẻ, vận động cơ thể sau giờ làm việc căng thẳng.', 'BEGINNER', CURRENT_DATE + INTERVAL '6 days' + INTERVAL '15 hours', CURRENT_DATE + INTERVAL '6 days' + INTERVAL '17 hours', 'Sân cầu lông Kim Mã', '290 Kim Mã, Ba Đình, Hà Nội', 21.031, 105.82, ST_SetSRID(ST_MakePoint(105.82, 21.031), 4326)::geography, 6, 4, 'OPEN', 'OPEN', 1, 1, NOW() - INTERVAL '1 day', NOW());
INSERT INTO community.match_post_levels (match_post_id, level) VALUES ('77777777-7777-7777-7777-000000000048', 'BEGINNER');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000048', '33333333-3333-3333-3333-000000000048', 'Hồ Văn Tuấn', 'APPROVED', NOW() - INTERVAL '2 hours');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000048', '33333333-3333-3333-3333-000000000037', 'Bùi Văn Anh', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000048', '33333333-3333-3333-3333-000000000013', 'Đỗ Minh Linh', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000048', '33333333-3333-3333-3333-000000000007', 'Hoàng Tuấn Duy', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.match_comments (id, match_post_id, user_id, user_full_name, content, created_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000048', '33333333-3333-3333-3333-000000000006', 'Nguyễn Đức Vy', 'Chào mọi người, mình xin 1 slot nhé!', NOW() - INTERVAL '30 minutes');
INSERT INTO community.match_posts (id, host_id, author_id, title, description, level, start_time, end_time, venue_name, venue_address, latitude, longitude, location, max_players, current_participants, join_mode, status, like_count, comment_count, created_at, updated_at) VALUES
('77777777-7777-7777-7777-000000000049', '33333333-3333-3333-3333-000000000049', '33333333-3333-3333-3333-000000000049', 'Kèo phủi giao lưu có nước uống và cầu sẵn', 'Nhóm mình cần tuyển thêm 2 bạn trình phong trào mới chơi giao lưu đôi nam/nữ. Sân đã chuẩn bị đầy đủ cầu Hải Yến và nước uống. Chi phí chia đều cuối buổi.', 'BEGINNER', CURRENT_DATE + INTERVAL '2 days' + INTERVAL '15 hours', CURRENT_DATE + INTERVAL '2 days' + INTERVAL '17 hours', 'Sân cầu lông Trúc Bạch', '1 Đặng Dung, Ba Đình, Hà Nội', 21.045, 105.841, ST_SetSRID(ST_MakePoint(105.841, 21.045), 4326)::geography, 4, 3, 'APPROVAL', 'OPEN', 3, 3, NOW() - INTERVAL '1 day', NOW());
INSERT INTO community.match_post_levels (match_post_id, level) VALUES ('77777777-7777-7777-7777-000000000049', 'BEGINNER');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000049', '33333333-3333-3333-3333-000000000049', 'Hoàng Ngọc Trang', 'APPROVED', NOW() - INTERVAL '2 hours');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000049', '33333333-3333-3333-3333-000000000030', 'Nguyễn Khánh Bình', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000049', '33333333-3333-3333-3333-000000000035', 'Hồ Văn Linh', 'APPROVED', NOW() - INTERVAL '1 hour');
INSERT INTO community.match_comments (id, match_post_id, user_id, user_full_name, content, created_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000049', '33333333-3333-3333-3333-000000000043', 'Phan Hoàng Khánh', 'Chào mọi người, mình xin 1 slot nhé!', NOW() - INTERVAL '30 minutes');
INSERT INTO community.match_posts (id, host_id, author_id, title, description, level, start_time, end_time, venue_name, venue_address, latitude, longitude, location, max_players, current_participants, join_mode, status, like_count, comment_count, created_at, updated_at) VALUES
('77777777-7777-7777-7777-000000000050', '33333333-3333-3333-3333-000000000050', '33333333-3333-3333-3333-000000000050', 'Tìm kèo đôi nam nữ trình Yếu/Mới chơi giao lưu cọ xát', 'Tìm các bạn đam mê cầu lông trình phong trào mới chơi tham gia giao lưu. Sân thảm mới, trần cao, ánh sáng tốt không lóa mắt. Lên sân là chiến ngay!', 'BEGINNER', CURRENT_DATE + INTERVAL '1 days' + INTERVAL '17 hours', CURRENT_DATE + INTERVAL '1 days' + INTERVAL '19 hours', 'Sân cầu lông Yên Phụ', '11 Yên Phụ, Tây Hồ, Hà Nội', 21.049, 105.843, ST_SetSRID(ST_MakePoint(105.843, 21.049), 4326)::geography, 4, 1, 'OPEN', 'OPEN', 6, 0, NOW() - INTERVAL '1 day', NOW());
INSERT INTO community.match_post_levels (match_post_id, level) VALUES ('77777777-7777-7777-7777-000000000050', 'BEGINNER');
INSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '77777777-7777-7777-7777-000000000050', '33333333-3333-3333-3333-000000000050', 'Phan Hoàng Trang', 'APPROVED', NOW() - INTERVAL '2 hours');
COMMIT;
