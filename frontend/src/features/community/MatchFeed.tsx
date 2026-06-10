import React, { useMemo, useState } from 'react';
import { Badge, Button, Col, DatePicker, Input, Row, Select, Tabs, Typography } from 'antd';
import {
EditOutlined,
FireOutlined,
PlusOutlined,
SearchOutlined,
} from '@ant-design/icons';
import { Tag } from 'antd';
import MatchCard from '../../components/ui/MatchCard';
import PageContainer from '../../components/ui/PageContainer';
import { matchPosts } from '../../data/mockData';
import { colors } from '../../styles/theme';
import { CreatePostModal } from './CreatePostModal';
import { ActivityFeed } from './ActivityFeed';
import { QuickFilterBar } from './QuickFilterBar';
import type { ActivityItem } from './ActivityFeed';
import type { QuickTag } from './QuickFilterBar';
import { LEVEL_OPTIONS } from '../../constants/levels';

const { Title, Text, Paragraph } = Typography;

// ── Static data ───────────────────────────────────────────────────────────

const ACTIVITIES: ActivityItem[] = [
{ id: 1, text: 'Minh Trần đã đăng ký kèo của bạn', time: '2 phút trước', dot: '🟢' },
{ id: 2, text: 'Booking sân Đào Duy Anh đã xác nhận', time: '15 phút trước', dot: '✅' },
{ id: 3, text: 'Bạn nhận được 1 đánh giá 5 sao', time: '1 giờ trước', dot: '⭐' },
{ id: 4, text: 'Linh Nguyễn đã thích bài đăng của bạn', time: '2 giờ trước', dot: '❤️' },
];

const QUICK_TAGS: QuickTag[] = [
{ label: 'Còn chỗ', value: 'available' },
{ label: 'Tối nay', value: 'tonight' },
{ label: 'Kèo kín', value: 'private' },
{ label: 'Đánh đôi', value: 'doubles' },
{ label: 'Người mới', value: 'beginner' },
{ label: 'Miễn phí', value: 'free' },
];

const COMMUNITY_STATS = [
{ label: 'Người chơi', value: '2.4K' },
{ label: 'Kèo hôm nay', value: '67' },
{ label: 'Sân đối tác', value: '310' },
{ label: 'Đánh giá ★', value: '4.8' },
];

// ── Hero Banner ────────────────────────────────────────────────────────────

interface HeroBannerProps {
onCreatePost: () => void;
}

const HeroBanner: React.FC<HeroBannerProps> = ({ onCreatePost }) => (
<div
style={{
borderRadius: 20,
background: 'linear-gradient(135deg, #0f2d1e 0%, #14532d 60%, #166534 100%)',
padding: '36px 40px',
marginBottom: 28,
display: 'grid',
gridTemplateColumns: '1fr auto',
gap: 24,
alignItems: 'center',
position: 'relative',
overflow: 'hidden',
}}
>
{/* Decorative circle */}
<div
style={{
position: 'absolute',
right: -40,
top: -40,
width: 200,
height: 200,
borderRadius: '50%',
background: 'rgba(22,163,74,0.15)',
pointerEvents: 'none',
}}
/>

{/* Left copy */}
<div>
<Tag color="green" style={{ marginBottom: 12, fontWeight: 700, borderRadius: 6 }}>
🏸 Cộng đồng người chơi
</Tag>
<Title level={2} style={{ color: '#fff', margin: '0 0 10px', fontWeight: 800, lineHeight: 1.3 }}>
Tìm kèo, giao lưu &amp; kết nối
</Title>
<Paragraph style={{ color: 'rgba(255,255,255,0.7)', margin: 0, fontSize: 15 }}>
Lọc kèo theo trình độ, khu vực và thời gian. Đăng ký hoặc tạo kèo mới chỉ trong vài giây.
</Paragraph>
</div>

{/* Right glass card */}
<div
style={{
background: 'rgba(255,255,255,0.1)',
backdropFilter: 'blur(8px)',
borderRadius: 16,
padding: 20,
minWidth: 220,
border: '1px solid rgba(255,255,255,0.15)',
}}
>
<div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
<div
style={{
width: 40,
height: 40,
borderRadius: 10,
background: colors.primary,
display: 'flex',
alignItems: 'center',
justifyContent: 'center',
fontSize: 18,
}}
>
<FireOutlined style={{ color: '#fff' }} />
</div>
<div>
<Text strong style={{ color: '#fff', display: 'block' }}>Gợi ý cho bạn</Text>
<Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>
5 kèo trong 4km, trình trung bình
</Text>
</div>
</div>
<Button
type="primary"
block
icon={<PlusOutlined />}
onClick={onCreatePost}
style={{ fontWeight: 700 }}
>
Tạo bài tìm kèo
</Button>
</div>
</div>
);

// ── Community Stats card ───────────────────────────────────────────────────

const CommunityStats: React.FC = () => (
<div
style={{
background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
borderRadius: 14,
padding: 20,
color: '#fff',
}}
>
<Text strong style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
Cộng đồng BadmintonHub
</Text>
<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 14 }}>
{COMMUNITY_STATS.map((stat) => (
<div key={stat.label}>
<div style={{ fontSize: 24, fontWeight: 800, lineHeight: 1 }}>{stat.value}</div>
<div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>{stat.label}</div>
</div>
))}
</div>
</div>
);

// ── Main component ─────────────────────────────────────────────────────────

const MatchFeed: React.FC = () => {
const [createOpen, setCreateOpen] = useState(false);
const [activeQuickTag, setActiveQuickTag] = useState<string | null>(null);
const [searchText, setSearchText] = useState('');
const [selectedDate, setSelectedDate] = useState<any>(null);
const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

const filteredPosts = useMemo(() => {
let posts = matchPosts;

if (activeQuickTag) {
switch (activeQuickTag) {
case 'available':
posts = posts.filter((p) => p.joined < p.capacity);
break;
case 'tonight':
posts = posts.filter((p) => p.time.includes('Hôm nay'));
break;
case 'private':
posts = posts.filter((p) => p.privacy === 'Nội bộ');
break;
case 'doubles':
posts = posts.filter((p) => p.tags.some((t) => t.includes('Đôi') || t.includes('đôi')));
break;
case 'beginner':
posts = posts.filter((p) => ['Y', 'Y+', 'TBY'].includes(p.level));
break;
case 'free':
posts = posts.filter((p) => p.price.includes('Miễn phí'));
break;
}
}

if (searchText.trim()) {
const q = searchText.trim().toLowerCase();
posts = posts.filter(
(p) =>
p.title.toLowerCase().includes(q) ||
p.venueName.toLowerCase().includes(q) ||
p.tags.some((t) => t.toLowerCase().includes(q)),
);
}

if (selectedLevel) {
posts = posts.filter((p) => p.level === selectedLevel);
}

return posts;
}, [activeQuickTag, searchText, selectedLevel]);

return (
<>
<PageContainer padding="24px 32px">
{/* Hero */}
<HeroBanner onCreatePost={() => setCreateOpen(true)} />

<Row gutter={[24, 24]}>
{/* ── Main feed column ── */}
<Col xs={24} lg={16}>
{/* Search + filter bar */}
<div
style={{
background: '#fff',
borderRadius: 14,
padding: 16,
border: '1px solid #e2e8f0',
marginBottom: 16,
boxShadow: '0 1px 4px rgba(15,23,42,0.05)',
}}
>
<Row gutter={[10, 10]}>
<Col flex="1">
<Input
size="large"
prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
placeholder="Tìm kèo theo tên sân, khu vực..."
style={{ borderRadius: 10 }}
value={searchText}
onChange={(e) => setSearchText(e.target.value)}
/>
</Col>
<Col>
<DatePicker
size="large"
placeholder="Ngày chơi"
style={{ borderRadius: 10, width: 160 }}
onChange={(_, dateStr) => setSelectedDate(dateStr)}
/>
</Col>
<Col>
<Select
size="large"
placeholder="Trình độ"
options={LEVEL_OPTIONS}
style={{ width: 160 }}
allowClear
value={selectedLevel}
onChange={(val) => setSelectedLevel(val)}
/>
</Col>
</Row>
</div>

{/* Tabs */}
<Tabs
defaultActiveKey="open"
style={{
background: '#fff',
borderRadius: 14,
padding: '0 16px',
border: '1px solid #e2e8f0',
boxShadow: '0 1px 4px rgba(15,23,42,0.05)',
}}
items={[
{
key: 'open',
label: (
<span>
Đang mở&nbsp;
<Badge count={filteredPosts.length} color={colors.primary} />
</span>
),
children: (
<div style={{ paddingBottom: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
{filteredPosts.map((post) => <MatchCard key={post.id} post={post} />)}
{filteredPosts.length === 0 && (
<div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>
Không tìm thấy kèo phù hợp
</div>
)}
</div>
),
},
{
key: 'nearby',
label: 'Gần bạn',
children: (
<div style={{ paddingBottom: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
{filteredPosts.map((post) => <MatchCard key={post.id} post={post} />)}
{filteredPosts.length === 0 && (
<div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>
Không tìm thấy kèo phù hợp
</div>
)}
</div>
),
},
{
key: 'mine',
label: 'Bài của tôi',
children: (
<div style={{ padding: '24px 0', textAlign: 'center' }}>
<div style={{ fontSize: 48, marginBottom: 12 }}>🏸</div>
<Title level={4} style={{ color: '#64748b' }}>
Bạn chưa đăng bài tìm kèo nào
</Title>
<Paragraph type="secondary">
Tạo bài đăng để tìm người chơi cùng hoặc nhượng slot còn dư.
</Paragraph>
<Button type="primary" icon={<EditOutlined />} onClick={() => setCreateOpen(true)}>
Tạo bài đầu tiên
</Button>
</div>
),
},
]}
/>
</Col>

{/* ── Sidebar column ── */}
<Col xs={24} lg={8}>
<div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
<QuickFilterBar
tags={QUICK_TAGS}
activeValue={activeQuickTag}
onChange={setActiveQuickTag}
/>
<ActivityFeed items={ACTIVITIES} />
<CommunityStats />
</div>
</Col>
</Row>
</PageContainer>

{/* Create Post Modal */}
<CreatePostModal
open={createOpen}
onClose={() => setCreateOpen(false)}
/>
</>
);
};

export default MatchFeed;
