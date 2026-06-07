const fs = require('fs');
const path = require('path');

// 50 real Hanoi venues data with coordinates
const venuesData = [
  { name: 'Sân cầu lông Đống Đa', address: '75 Đặng Văn Ngữ, Đống Đa, Hà Nội', lat: 21.0120, lng: 105.8280 },
  { name: 'Sân cầu lông Cầu Giấy', address: '35 Nguyễn Phong Sắc, Cầu Giấy, Hà Nội', lat: 21.0360, lng: 105.7900 },
  { name: 'Sân cầu lông Lê Văn Lương', address: '88 Lê Văn Lương, Thanh Xuân, Hà Nội', lat: 21.0090, lng: 105.8030 },
  { name: 'Sân cầu lông Đại học Y', address: '1 Tôn Thất Tùng, Đống Đa, Hà Nội', lat: 21.0020, lng: 105.8290 },
  { name: 'Sân cầu lông Ba Đình', address: '115 Hoàng Hoa Thám, Ba Đình, Hà Nội', lat: 21.0430, lng: 105.8200 },
  { name: 'Sân cầu lông Tây Hồ', address: '99 Xuân La, Tây Hồ, Hà Nội', lat: 21.0660, lng: 105.8040 },
  { name: 'Sân cầu lông Hoàn Kiếm', address: '2 Hàm Tử Quan, Hoàn Kiếm, Hà Nội', lat: 21.0260, lng: 105.8590 },
  { name: 'Sân cầu lông Hai Bà Trưng', address: '42 Tạ Quang Bửu, Hai Bà Trưng, Hà Nội', lat: 21.0050, lng: 105.8480 },
  { name: 'Sân cầu lông Thanh Xuân', address: '15 Nguyễn Quý Đức, Thanh Xuân, Hà Nội', lat: 20.9980, lng: 105.7990 },
  { name: 'Sân cầu lông Hà Đông', address: '8 Tô Hiệu, Hà Đông, Hà Nội', lat: 20.9670, lng: 105.7760 },
  { name: 'Sân cầu lông Mỹ Đình', address: '5 Trần Hữu Dực, Nam Từ Liêm, Hà Nội', lat: 21.0280, lng: 105.7640 },
  { name: 'Sân cầu lông Cầu Diễn', address: '12 Hồ Tùng Mậu, Bắc Từ Liêm, Hà Nội', lat: 21.0390, lng: 105.7650 },
  { name: 'Sân cầu lông Bách Khoa', address: '1 Tạ Quang Bửu, Hai Bà Trưng, Hà Nội', lat: 21.0040, lng: 105.8430 },
  { name: 'Sân cầu lông Long Biên', address: '33 Nguyễn Sơn, Long Biên, Hà Nội', lat: 21.0420, lng: 105.8820 },
  { name: 'Sân cầu lông Gia Lâm', address: '55 Cổ Linh, Long Biên, Hà Nội', lat: 21.0180, lng: 105.8950 },
  { name: 'Sân cầu lông Hoàng Mai', address: '10 Linh Đường, Hoàng Mai, Hà Nội', lat: 20.9660, lng: 105.8340 },
  { name: 'Sân cầu lông Linh Đàm', address: '22 Nguyễn Hữu Thọ, Hoàng Mai, Hà Nội', lat: 20.9690, lng: 105.8290 },
  { name: 'Sân cầu lông Thanh Trì', address: '5 Phan Trọng Tuệ, Thanh Trì, Hà Nội', lat: 20.9520, lng: 105.8190 },
  { name: 'Sân cầu lông Đông Anh', address: 'Tổ 5, Thị trấn Đông Anh, Hà Nội', lat: 21.1390, lng: 105.8450 },
  { name: 'Sân cầu lông Sóc Sơn', address: 'Khối 3, Thị trấn Sóc Sơn, Hà Nội', lat: 21.2580, lng: 105.8490 },
  { name: 'Sân cầu lông Hoài Đức', address: 'Khu 6, Thị trấn Trạm Trôi, Hoài Đức, Hà Nội', lat: 21.0740, lng: 105.7070 },
  { name: 'Sân cầu lông Đan Phượng', address: 'Tổ 2, Thị trấn Phùng, Đan Phượng, Hà Nội', lat: 21.0960, lng: 105.6780 },
  { name: 'Sân cầu lông Quốc Oai', address: 'Khu phố 1, Thị trấn Quốc Oai, Hà Nội', lat: 20.9890, lng: 105.6340 },
  { name: 'Sân cầu lông Thạch Thất', address: 'Khu Đồng Cam, Thị trấn Liên Quan, Thạch Thất, Hà Nội', lat: 21.0260, lng: 105.5780 },
  { name: 'Sân cầu lông Chương Mỹ', address: 'Khu Bắc Sơn, Thị trấn Chúc Sơn, Chương Mỹ, Hà Nội', lat: 20.9230, lng: 105.7120 },
  { name: 'Sân cầu lông Thanh Oai', address: 'Thị trấn Kim Bài, Thanh Oai, Hà Nội', lat: 20.8750, lng: 105.7820 },
  { name: 'Sân cầu lông Thường Tín', address: 'Thị trấn Thường Tín, Thường Tín, Hà Nội', lat: 20.8710, lng: 105.8560 },
  { name: 'Sân cầu lông Phú Xuyên', address: 'Thị trấn Phú Xuyên, Phú Xuyên, Hà Nội', lat: 20.7320, lng: 105.9020 },
  { name: 'Sân cầu lông Ứng Hòa', address: 'Thị trấn Vân Đình, Ứng Hòa, Hà Nội', lat: 20.7250, lng: 105.7650 },
  { name: 'Sân cầu lông Mỹ Đức', address: 'Thị trấn Đại Nghĩa, Mỹ Đức, Hà Nội', lat: 20.6980, lng: 105.7430 },
  { name: 'Sân cầu lông Sơn Tây', address: 'Phường Quang Trung, Sơn Tây, Hà Nội', lat: 21.1360, lng: 105.5020 },
  { name: 'Sân cầu lông Ba Vì', address: 'Thị trấn Tây Đằng, Ba Vì, Hà Nội', lat: 21.1980, lng: 105.3980 },
  { name: 'Sân cầu lông Phúc Thọ', address: 'Thị trấn Phúc Thọ, Phúc Thọ, Hà Nội', lat: 21.1070, lng: 105.5920 },
  { name: 'Sân cầu lông Mê Linh', address: 'Đại Thịnh, Mê Linh, Hà Nội', lat: 21.1890, lng: 105.7290 },
  { name: 'Sân cầu lông Nội Bài', address: 'Sân bay Nội Bài, Sóc Sơn, Hà Nội', lat: 21.2180, lng: 105.8040 },
  { name: 'Sân cầu lông Khương Đình', address: '450 Vũ Tông Phan, Thanh Xuân, Hà Nội', lat: 20.9870, lng: 105.8190 },
  { name: 'Sân cầu lông Định Công', address: '12 Trần Điền, Hoàng Mai, Hà Nội', lat: 20.9820, lng: 105.8340 },
  { name: 'Sân cầu lông Giáp Bát', address: '50 Kim Đồng, Hoàng Mai, Hà Nội', lat: 20.9780, lng: 105.8450 },
  { name: 'Sân cầu lông Mai Dịch', address: '7 Trần Bình, Cầu Giấy, Hà Nội', lat: 21.0380, lng: 105.7790 },
  { name: 'Sân cầu lông Nghĩa Tân', address: '14 Tô Hiệu, Cầu Giấy, Hà Nội', lat: 21.0440, lng: 105.7950 },
  { name: 'Sân cầu lông Trung Hòa', address: '32 Trung Kính, Cầu Giấy, Hà Nội', lat: 21.0180, lng: 105.7990 },
  { name: 'Sân cầu lông Yên Hòa', address: '110 Nguyễn Khang, Cầu Giấy, Hà Nội', lat: 21.0200, lng: 105.8010 },
  { name: 'Sân cầu lông Láng Hạ', address: '20 Huỳnh Thúc Kháng, Đống Đa, Hà Nội', lat: 21.0180, lng: 105.8150 },
  { name: 'Sân cầu lông Kim Liên', address: '1 Phạm Ngọc Thạch, Đống Đa, Hà Nội', lat: 21.0090, lng: 105.8320 },
  { name: 'Sân cầu lông Khương Thượng', address: '165 Chùa Bộc, Đống Đa, Hà Nội', lat: 21.0060, lng: 105.8280 },
  { name: 'Sân cầu lông Thành Công', address: '57 Láng Hạ, Đống Đa, Hà Nội', lat: 21.0190, lng: 105.8120 },
  { name: 'Sân cầu lông Giảng Võ', address: '140 Giảng Võ, Ba Đình, Hà Nội', lat: 21.0290, lng: 105.8230 },
  { name: 'Sân cầu lông Kim Mã', address: '290 Kim Mã, Ba Đình, Hà Nội', lat: 21.0310, lng: 105.8200 },
  { name: 'Sân cầu lông Trúc Bạch', address: '1 Đặng Dung, Ba Đình, Hà Nội', lat: 21.0450, lng: 105.8410 },
  { name: 'Sân cầu lông Yên Phụ', address: '11 Yên Phụ, Tây Hồ, Hà Nội', lat: 21.0490, lng: 105.8430 }
];

// Helper to format hex ID
function makeId(prefix, num) {
  return `${prefix}-${String(num).padStart(12, '0')}`;
}

const matchTitles = [
  "Giao lưu cầu lông tối thứ {day} vui vẻ",
  "Tìm kèo đôi nam nữ trình {level} giao lưu cọ xát",
  "Kèo giao lưu nhẹ nhàng cuối tuần cho {level}",
  "Tuyển thêm {num} tay vợt trình {level} lên sân",
  "Giao lưu cầu lông sáng sớm nâng cao sức khỏe",
  "Tìm đối thủ cứng tay đánh đơn/đôi trình {level}",
  "Kèo phủi giao lưu có nước uống và cầu sẵn",
  "Cần tuyển slot gấp cho nhóm cầu lông tối nay"
];

const matchDescriptions = [
  "Nhóm mình cần tuyển thêm {num} bạn trình {level} giao lưu đôi nam/nữ. Sân đã chuẩn bị đầy đủ cầu Hải Yến và nước uống. Chi phí chia đều cuối buổi.",
  "Kèo chất lượng cho anh em cọ xát trình {level}. Yêu cầu tinh thần vui vẻ, giao lưu học hỏi là chính, không cay cú. Có chỗ đỗ xe rộng rãi.",
  "Nhóm chơi phong trào tìm kiếm đồng đội cùng trình độ {level}. Đánh vui vẻ, vận động cơ thể sau giờ làm việc căng thẳng.",
  "Tìm các bạn đam mê cầu lông trình {level} tham gia giao lưu. Sân thảm mới, trần cao, ánh sáng tốt không lóa mắt. Lên sân là chiến ngay!"
];

const firstNames = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Phan", "Vũ", "Đặng", "Bùi", "Đỗ", "Hồ", "Ngô"];
const middleNames = ["Văn", "Thị", "Minh", "Hữu", "Anh", "Đức", "Hoàng", "Tuấn", "Thành", "Quốc", "Khánh", "Ngọc"];
const lastNames = ["Anh", "Bình", "Cường", "Duy", "Giang", "Hải", "Hùng", "Hương", "Khánh", "Linh", "Nam", "Phúc", "Sơn", "Trang", "Tuấn", "Vy"];

function randomName(gender) {
  const f = firstNames[Math.floor(Math.random() * firstNames.length)];
  let m = middleNames[Math.floor(Math.random() * middleNames.length)];
  if (gender === 'MALE' && m === 'Thị') m = 'Văn';
  if (gender === 'FEMALE' && m === 'Văn') m = 'Thị';
  const l = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${f} ${m} ${l}`;
}

let sql = `-- Auto-generated seed data script
-- Created At: ${new Date().toISOString()}

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
`;

// 50 Owners and 50 Players
const owners = [];
const players = [];

for (let i = 1; i <= 50; i++) {
  const gender = Math.random() > 0.35 ? 'MALE' : 'FEMALE';
  const name = randomName(gender);
  const id = makeId('22222222-2222-2222-2222', i);
  const email = `owner${i}@badminton.com`;
  const phone = `098` + String(Math.floor(1000000 + Math.random() * 9000000)).slice(0, 7);
  const rating = (4.0 + Math.random() * 1.0).toFixed(1);
  const reviewCount = Math.floor(Math.random() * 20) + 2;
  const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=owner${i}`;
  
  owners.push({ id, name, email });

  sql += `
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('${id}', '${email}', '${phone}', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', '${name}', '${avatar}', '${gender}', 'INTERMEDIATE', 'Quản lý sân cầu lông chuyên nghiệp', 'Chủ sân cầu lông tại Hà Nội nhiệt tình, chào đón mọi tay vợt.', ${rating}, ${reviewCount}, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('${id}', 3);`;
}

for (let i = 1; i <= 50; i++) {
  const gender = Math.random() > 0.4 ? 'MALE' : 'FEMALE';
  const name = randomName(gender);
  const id = makeId('33333333-3333-3333-3333', i);
  const email = `player${i}@badminton.com`;
  const phone = `091` + String(Math.floor(1000000 + Math.random() * 9000000)).slice(0, 7);
  const levels = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];
  const level = levels[Math.floor(Math.random() * levels.length)];
  const rating = (3.8 + Math.random() * 1.2).toFixed(1);
  const reviewCount = Math.floor(Math.random() * 15) + 1;
  const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=player${i}`;

  players.push({ id, name, email, level });

  sql += `
INSERT INTO identity.users (id, email, phone, password_hash, full_name, avatar_url, gender, level, goal, bio, rating, review_count, status, created_at, updated_at) VALUES
('${id}', '${email}', '${phone}', '$2a$10$JhESD7zvXccL4TFSskFZwOAdIB.dZN7hu8gERLhJupv0W1JCLq.xq', '${name}', '${avatar}', '${gender}', '${level}', 'Nâng cao trình độ và kết bạn', 'Đam mê cầu lông phong trào, muốn tìm nhóm chơi giao lưu hàng tuần.', ${rating}, ${reviewCount}, 'ACTIVE', NOW(), NOW());
INSERT INTO identity.user_roles (user_id, role_id) VALUES ('${id}', 2);`;
}

// 50 Venues
sql += `\n-- 5. Seed 50 Venues`;
const venues = [];
venuesData.forEach((vData, idx) => {
  const id = makeId('44444444-4444-4444-4444', idx + 1);
  const owner = owners[idx]; // 50 owners, so each owner has exactly 1 venue
  const slug = vData.name.toLowerCase().replace(/đ/g, 'd').replace(/á/g, 'a').replace(/ạ/g, 'a').replace(/ả/g, 'a').replace(/ấ/g, 'a').replace(/ệ/g, 'e').replace(/ĩ/g, 'i').replace(/ò/g, 'o').replace(/ộ/g, 'o').replace(/ù/g, 'u').replace(/ý/g, 'y').replace(/ô/g, 'o').replace(/ê/g, 'e').replace(/ư/g, 'u').replace(/í/g, 'i').replace(/ /g, '-').replace(/,/g, '').replace(/[^a-z0-9-]/g, '');
  const rating = (4.2 + Math.random() * 0.8).toFixed(1);
  const reviewCount = Math.floor(Math.random() * 25) + 3;
  const phone = `024` + String(Math.floor(1000000 + Math.random() * 9000000)).slice(0, 7);
  const email = `${slug.substring(0, 15)}@gmail.com`;

  venues.push({ id, name: vData.name, address: vData.address, lat: vData.lat, lng: vData.lng });

  sql += `
INSERT INTO venue.venues (id, owner_id, name, slug, description, address, city, latitude, longitude, location, phone, status, rating_avg, rating_count, email, open_time, close_time, policy, court_count, created_at, updated_at) VALUES
('${id}', '${owner.id}', '${vData.name}', '${slug}', 'Hệ thống sân cầu lông ${vData.name} được trang bị thảm PVC tiêu chuẩn cao cấp, hệ thống đèn led chống lóa chuyên nghiệp, không gian thoáng đãng sạch sẽ.', '${vData.address}', 'Hà Nội', ${vData.lat}, ${vData.lng}, ST_SetSRID(ST_MakePoint(${vData.lng}, ${vData.lat}), 4326)::geography, '${phone}', 'APPROVED', ${rating}, ${reviewCount}, '${email}', '05:00:00', '22:00:00', 'Huỷ sân trước 24h được hoàn tiền 100%. Huỷ trước 12h hoàn tiền 50%.', 2, NOW(), NOW());`;
});

// Courts & Price Rules & Wallets
sql += `\n-- 6. Seed Courts and Price Rules`;
venues.forEach((v, idx) => {
  const court1Id = makeId('55555555-5555-5555-5555', idx * 2 + 1);
  const court2Id = makeId('55555555-5555-5555-5555', idx * 2 + 2);

  sql += `
INSERT INTO venue.courts (id, venue_id, name, court_type, status, created_at, updated_at) VALUES
('${court1Id}', '${v.id}', 'Sân 1 - ${v.name.replace('Sân cầu lông ', '')}', 'PREMIUM', 'ACTIVE', NOW(), NOW()),
('${court2Id}', '${v.id}', 'Sân 2 - ${v.name.replace('Sân cầu lông ', '')}', 'STANDARD', 'ACTIVE', NOW(), NOW());`;

  // Standard prices
  const basePrice = idx % 2 === 0 ? 80000.00 : 90000.00;
  const peakPrice = basePrice + 30000.00;

  for (let dow = 1; dow <= 7; dow++) {
    sql += `
INSERT INTO venue.price_rules (id, venue_id, court_id, day_of_week, start_time, end_time, price_per_hour, effective_from, effective_to, status, created_at) VALUES
(gen_random_uuid(), '${v.id}', '${court1Id}', ${dow}, '05:00:00', '17:00:00', ${basePrice}, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '${v.id}', '${court1Id}', ${dow}, '17:00:00', '22:00:00', ${peakPrice}, '2026-01-01', '2026-12-31', 'ACTIVE', NOW()),
(gen_random_uuid(), '${v.id}', '${court2Id}', ${dow}, '05:00:00', '22:00:00', ${basePrice - 10000.00}, '2026-01-01', '2026-12-31', 'ACTIVE', NOW());`;
  }
});

// Seed Utilities
sql += `\n-- 8. Seed Venue Utilities`;
const utilities = ['Wifi', 'Canteen', 'Free Parking', 'Shower', 'Locker Room', 'Net Shop'];
venues.forEach(v => {
  const count = Math.floor(Math.random() * 3) + 2;
  const shuffled = [...utilities].sort(() => 0.5 - Math.random());
  for (let i = 0; i < count; i++) {
    sql += `\nINSERT INTO venue.venue_utilities (venue_id, utility) VALUES ('${v.id}', '${shuffled[i]}');`;
  }
});

// Seed Venue Images
sql += `\n-- 9. Seed Venue Images`;
const images = [
  'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=600',
  'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=600',
  'https://images.unsplash.com/photo-1521537634211-13da4df068b5?q=80&w=600'
];
venues.forEach(v => {
  sql += `\nINSERT INTO venue.venue_images (id, venue_id, image_url, display_order, created_at) VALUES (gen_random_uuid(), '${v.id}', '${images[Math.floor(Math.random() * images.length)]}', 0, NOW());`;
});

// Seed Owner Wallets
sql += `\n-- 10. Seed Owner Wallets`;
owners.forEach(o => {
  sql += `\nINSERT INTO payment.owner_wallets (id, owner_id, balance, total_earned, total_withdrawn, created_at, updated_at) VALUES (gen_random_uuid(), '${o.id}', 0.00, 0.00, 0.00, NOW(), NOW());`;
});

// Seed 50 Match Posts
sql += `\n-- 11. Seed 50 Match Posts`;
for (let i = 1; i <= 50; i++) {
  const id = makeId('77777777-7777-7777-7777', i);
  // Alternate players as hosts
  const host = players[(i - 1) % 50];
  const venue = venues[(i - 1) % 50];

  // Random time displacement
  // 15 matches in the past, 35 in the future
  const isPast = i <= 15;
  const daysOffset = isPast ? -Math.floor(Math.random() * 5 + 1) : Math.floor(Math.random() * 7 + 1);
  const hourOffset = Math.floor(Math.random() * 4) + 14; // e.g. 14:00 to 18:00
  
  const level = host.level;
  
  const titleTpl = matchTitles[Math.floor(Math.random() * matchTitles.length)];
  const title = titleTpl
    .replace('{day}', daysOffset === 0 ? 'nay' : (daysOffset > 0 ? `tới (+${daysOffset}d)` : `trước (-${daysOffset}d)`))
    .replace('{level}', level === 'BEGINNER' ? 'Yếu/Mới chơi' : (level === 'INTERMEDIATE' ? 'Trung Bình' : 'Khá/Mạnh'))
    .replace('{num}', Math.floor(Math.random() * 3) + 1);

  const descTpl = matchDescriptions[Math.floor(Math.random() * matchDescriptions.length)];
  const desc = descTpl
    .replace('{level}', level === 'BEGINNER' ? 'phong trào mới chơi' : (level === 'INTERMEDIATE' ? 'trung bình phong trào' : 'trung bình khá trở lên'))
    .replace('{num}', Math.floor(Math.random() * 3) + 1);

  const startStr = `CURRENT_DATE + INTERVAL '${daysOffset} days' + INTERVAL '${hourOffset} hours'`;
  const endStr = `CURRENT_DATE + INTERVAL '${daysOffset} days' + INTERVAL '${hourOffset + 2} hours'`;

  const maxPlayers = idx => (idx % 3 === 0 ? 6 : 4);
  const max = maxPlayers(i);
  const current = isPast ? max : Math.floor(Math.random() * (max - 1)) + 1;
  const status = isPast ? 'FINISHED' : (current === max ? 'FULL' : 'OPEN');
  const joinMode = i % 2 === 0 ? 'OPEN' : 'APPROVAL';
  const likeCount = Math.floor(Math.random() * 10);
  const commentCount = Math.floor(Math.random() * 4);

  sql += `
INSERT INTO community.match_posts (id, host_id, author_id, title, description, level, start_time, end_time, venue_name, venue_address, latitude, longitude, location, max_players, current_participants, join_mode, status, like_count, comment_count, created_at, updated_at) VALUES
('${id}', '${host.id}', '${host.id}', '${title}', '${desc}', '${level}', ${startStr}, ${endStr}, '${venue.name}', '${venue.address}', ${venue.lat}, ${venue.lng}, ST_SetSRID(ST_MakePoint(${venue.lng}, ${venue.lat}), 4326)::geography, ${max}, ${current}, '${joinMode}', '${status}', ${likeCount}, ${commentCount}, NOW() - INTERVAL '1 day', NOW());`;

  sql += `\nINSERT INTO community.match_post_levels (match_post_id, level) VALUES ('${id}', '${level}');`;

  // Participants
  // Always add the host
  sql += `\nINSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '${id}', '${host.id}', '${host.name}', 'APPROVED', NOW() - INTERVAL '2 hours');`;
  
  // Add other random players as participants up to current_participants
  const addedPlayers = new Set([host.id]);
  for (let pIdx = 1; pIdx < current; pIdx++) {
    let randomPlayer = players[Math.floor(Math.random() * 50)];
    let attempts = 0;
    while (addedPlayers.has(randomPlayer.id) && attempts < 10) {
      randomPlayer = players[Math.floor(Math.random() * 50)];
      attempts++;
    }
    addedPlayers.add(randomPlayer.id);
    const pStatus = pIdx === current - 1 && joinMode === 'APPROVAL' && Math.random() > 0.5 ? 'PENDING' : 'APPROVED';
    sql += `\nINSERT INTO community.participants (id, match_post_id, user_id, user_full_name, status, joined_at) VALUES (gen_random_uuid(), '${id}', '${randomPlayer.id}', '${randomPlayer.name}', '${pStatus}', NOW() - INTERVAL '1 hour');`;
  }

  // Add a comment to some posts
  if (commentCount > 0) {
    const commenter = players[Math.floor(Math.random() * 50)];
    sql += `\nINSERT INTO community.match_comments (id, match_post_id, user_id, user_full_name, content, created_at) VALUES (gen_random_uuid(), '${id}', '${commenter.id}', '${commenter.name}', 'Chào mọi người, mình xin 1 slot nhé!', NOW() - INTERVAL '30 minutes');`;
  }
}

sql += `\nCOMMIT;\n`;

fs.writeFileSync(path.join(__dirname, '..', '..', 'infrastructure', 'init-db', 'seed-data.sql'), sql);
console.log("Seed data successfully written to seed-data.sql!");
