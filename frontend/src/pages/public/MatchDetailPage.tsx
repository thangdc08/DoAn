import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
Alert,
Avatar,
Button,
Card,
Col,
Descriptions,
Empty,
Input,
List,
Modal,
Rate,
Row,
Space,
Spin,
Tag,
Typography,
message,
} from 'antd';
import {
ArrowLeftOutlined,
CalendarOutlined,
ClockCircleOutlined,
EnvironmentOutlined,
MessageOutlined,
PhoneOutlined,
SendOutlined,
TeamOutlined,
UserOutlined,
EnvironmentFilled,
AimOutlined,
StarFilled,
MailOutlined,
CheckOutlined,
CloseOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { communityApi } from '../../services/communityApi';
import type { MatchParticipant, MatchPost } from '../../types/community.types';
import type { User } from '../../types/auth.types';
import { useAuthStore } from '../../stores/authStore';
import { useCommunityStore } from '../../stores/communityStore';
import { chatApi, type ChatMessage } from '../../services/chatApi';
import { chatSocket } from '../../services/chatSocket';
import { authApi } from '../../services/authApi';
import { useChatStore } from '../../stores/chatStore';
import { friendApi } from '../../services/friendApi';
import { getLevelLabel, getLevelColor } from '../../constants/levels';

const { Title, Text, Paragraph } = Typography;

const genderLabel: Record<string, string> = {
ANY: 'Nam & Nữ',
MALE: 'Chỉ Nam',
FEMALE: 'Chỉ Nữ',
};

const paymentLabel: Record<string, string> = {
SHARE: 'Chia sẻ',
FIXED: 'Cố định',
FREE: 'Miễn phí',
};

const participantStatusMeta: Record<string, { text: string; color: string }> = {
PENDING: { text: 'Chờ duyệt', color: 'gold' },
APPROVED: { text: 'Đã duyệt', color: 'green' },
REJECTED: { text: 'Từ chối', color: 'red' },
CANCELLED_BY_USER: { text: 'Đã hủy', color: 'default' },
REMOVED_BY_HOST: { text: 'Đã loại', color: 'default' },
};

type ChatMsg = { id: string; from: 'me' | 'host'; text: string; time: string };

const mapToUiMessage = (m: ChatMessage, myUserId?: string): ChatMsg => ({
id: m.id,
from: m.senderId === myUserId ? 'me' : 'host',
text: m.content,
time: dayjs(m.timestamp).format('HH:mm'),
});

const inflightMatchBundleRequests = new Map<
string,
Promise<{ matchData: MatchPost; participantData: MatchParticipant[] }>
>();

const fetchMatchBundle = (matchId: string) => {
const cached = inflightMatchBundleRequests.get(matchId);
if (cached) return cached;

const req = Promise.all([
communityApi.getMatchPostById(matchId),
communityApi.getMatchParticipants(matchId).catch(() => [] as MatchParticipant[]),
]).then(([matchData, participantData]) => ({ matchData, participantData }));

inflightMatchBundleRequests.set(matchId, req);
req.finally(() => {
inflightMatchBundleRequests.delete(matchId);
});
return req;
};

export default function MatchDetailPage() {
const { matchId } = useParams<{ matchId: string }>();
const navigate = useNavigate();
const user = useAuthStore((s) => s.user);
const { syncSelectedMatches } = useCommunityStore();

const [loading, setLoading] = useState(true);
const [joining, setJoining] = useState(false);
const [approvingId, setApprovingId] = useState<string | null>(null);
const [rejectingId, setRejectingId] = useState<string | null>(null);
const [match, setMatch] = useState<MatchPost | null>(null);
const [participants, setParticipants] = useState<MatchParticipant[]>([]);
const [participantProfiles, setParticipantProfiles] = useState<Record<string, Partial<User>>>({});
const [hostProfile, setHostProfile] = useState<User | null>(null);
const [friendStatus, setFriendStatus] = useState<string>('NONE');

const [joinModalOpen, setJoinModalOpen] = useState(false);
const [messageModalOpen, setMessageModalOpen] = useState(false);
const [groupModalOpen, setGroupModalOpen] = useState(false);
const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

const selectedRequest = useMemo(() => {
if (!selectedRequestId) return null;
return participants.find((p) => p.id === selectedRequestId) || null;
}, [participants, selectedRequestId]);

const selectedPlayerProfile = useMemo(() => {
if (!selectedRequest?.userId) return null;
return participantProfiles[selectedRequest.userId] || null;
}, [participantProfiles, selectedRequest]);

const isProfileLoading = useMemo(() => {
if (!selectedRequest?.userId) return false;
return !participantProfiles[selectedRequest.userId];
}, [participantProfiles, selectedRequest]);

const [quickMessage, setQuickMessage] = useState('');

const [chatLoading, setChatLoading] = useState(false);
const [chatConversationId, setChatConversationId] = useState<string | null>(null);
const [chatMessages, setChatMessages] = useState<ChatMsg[]>([]);
const chatBoxRef = useRef<HTMLDivElement | null>(null);

const [myLocation, setMyLocation] = useState<{ lat: number; lng: number } | null>(null);
const [distanceKm, setDistanceKm] = useState<number | null>(null);
const [geoError, setGeoError] = useState<string | null>(null);

const isOwner = useMemo(() => !!(match && user && match.hostId === user.id), [match, user]);
const displayedCurrentParticipants = useMemo(
() => (match ? Math.max((match.currentParticipants || 0) - 1, 0) : 0),
[match],
);
const isFull = useMemo(
() => !!(match && displayedCurrentParticipants >= match.maxParticipants),
[match, displayedCurrentParticipants],
);
const myParticipant = useMemo(
() => participants.find((p) => p.userId === user?.id) || null,
[participants, user?.id],
);
const pendingRequests = useMemo(
() => participants.filter((p) => p.status === 'PENDING'),
[participants],
);
const approvedParticipants = useMemo(
() => participants.filter((p) => p.status === 'APPROVED'),
[participants],
);
const rejectedParticipants = useMemo(
() => participants.filter((p) => p.status === 'REJECTED'),
[participants],
);

const getParticipantName = (p: any) => {
const profile = participantProfiles[p?.userId || ''];
return profile?.fullName || p?.userFullName || p?.userName || 'Người chơi';
};
const getParticipantTime = (p: any) => p?.joinedAt || p?.requestedAt;
const getParticipantStatus = (p: any) => participantStatusMeta[p?.status] || { text: p?.status || 'Không rõ', color: 'default' as const };
const getParticipantProfile = (p: any) => participantProfiles[p?.userId || ''] || {};

const mapUrl = useMemo(() => {
if (!match?.latitude || !match?.longitude) return '';
return `https://www.openstreetmap.org/export/embed.html?bbox=${match.longitude - 0.02}%2C${match.latitude - 0.015}%2C${match.longitude + 0.02}%2C${match.latitude + 0.015}&layer=mapnik&marker=${match.latitude}%2C${match.longitude}`;
}, [match]);

const directionUrl = useMemo(() => {
if (!match?.latitude || !match?.longitude) return '';
return `https://www.google.com/maps/dir/?api=1&destination=${match.latitude},${match.longitude}`;
}, [match]);

useEffect(() => {
if (!navigator.geolocation) {
setGeoError('Thiết bị không hỗ trợ định vị');
return;
}
navigator.geolocation.getCurrentPosition(
(pos) => {
setMyLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
setGeoError(null);
},
() => {
setGeoError('Chưa bật quyền vị trí');
},
{ enableHighAccuracy: true, timeout: 10000 },
);
}, []);

useEffect(() => {
if (!myLocation || !match?.latitude || !match?.longitude) {
setDistanceKm(null);
return;
}
const toRad = (v: number) => (v * Math.PI) / 180;
const R = 6371;
const dLat = toRad(match.latitude - myLocation.lat);
const dLng = toRad(match.longitude - myLocation.lng);
const a = Math.sin(dLat / 2) ** 2
+ Math.cos(toRad(myLocation.lat)) * Math.cos(toRad(match.latitude)) * Math.sin(dLng / 2) ** 2;
const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
setDistanceKm(Number((R * c).toFixed(1)));
}, [myLocation, match]);

const loadData = async () => {
if (!matchId) return;
setLoading(true);
try {
const { matchData, participantData } = await fetchMatchBundle(matchId);
setMatch(matchData);
setParticipants(participantData || []);

if (matchData.hostId) {
try {
const profile = await authApi.getUserById(matchData.hostId);
setHostProfile(profile);

if (user) {
const status = await friendApi.getRelationStatus(matchData.hostId);
setFriendStatus(status);
}
} catch (e) {
console.error('Failed to load host details', e);
}
}
} catch {
message.error('Không thể tải chi tiết kèo');
} finally {
setLoading(false);
}
};

useEffect(() => {
loadData();
}, [matchId]);

useEffect(() => {
if (participants.length === 0) return;
const queryParams = new URLSearchParams(window.location.search);
const userIdFromUrl = queryParams.get('userId');
if (userIdFromUrl) {
const req = participants.find((p) => p.userId === userIdFromUrl && p.status === 'PENDING')
|| participants.find((p) => p.userId === userIdFromUrl);
if (req) {
setSelectedRequestId(req.id);
const newUrl = window.location.pathname;
window.history.replaceState({}, '', newUrl);
}
}
}, [participants]);

useEffect(() => {
const userIds = Array.from(
new Set(
participants
.map((p: any) => p?.userId)
.filter((id): id is string => !!id && !participantProfiles[id]),
),
);
if (userIds.length === 0) return;

let cancelled = false;
Promise.all(
userIds.map(async (id) => {
try {
const profile = await authApi.getUserById(id);
return [id, profile] as const;
} catch {
return [id, {}] as const;
}
}),
).then((entries) => {
if (cancelled) return;
setParticipantProfiles((prev) => {
const next = { ...prev };
entries.forEach(([id, profile]) => {
next[id] = profile;
});
return next;
});
});

return () => {
cancelled = true;
};
}, [participants, participantProfiles]);

useEffect(() => {
if (!messageModalOpen || !chatConversationId || !user?.id) return;

chatSocket.connect();
chatSocket.subscribeToConversation(chatConversationId, (newMsg) => {
const mapped: ChatMsg = {
id: newMsg.id,
from: newMsg.senderId === user.id ? 'me' : 'host',
text: newMsg.content,
time: dayjs(newMsg.timestamp).format('HH:mm'),
};

setChatMessages((prev) => {
if (prev.some((m) => m.id === mapped.id)) return prev;
return [...prev, mapped];
});
});

return () => {
chatSocket.unsubscribeFromConversation(chatConversationId);
};
}, [messageModalOpen, chatConversationId, user?.id]);

useEffect(() => {
if (!messageModalOpen || !chatConversationId || !user?.id) return;

const syncMessages = async () => {
try {
const msgs = await chatApi.getMessages(chatConversationId);
const mapped = (msgs || []).map((m) => mapToUiMessage(m, user.id));
setChatMessages((prev) => {
const merged = new Map<string, ChatMsg>();
prev.forEach((m) => merged.set(m.id, m));
mapped.forEach((m) => merged.set(m.id, m));
return mapped.length > 0 ? mapped : Array.from(merged.values());
});
} catch {
// keep silent for background sync
}
};

syncMessages();
const intervalId = window.setInterval(syncMessages, 1200);
return () => window.clearInterval(intervalId);
}, [messageModalOpen, chatConversationId, user?.id]);

useEffect(() => {
if (!messageModalOpen) return;
const el = chatBoxRef.current;
if (el) {
el.scrollTop = el.scrollHeight;
}
}, [chatMessages, messageModalOpen]);

const handleConfirmJoin = async () => {
if (!matchId) return;
setJoining(true);
try {
await communityApi.joinMatch(matchId);

if (match?.joinMode === 'APPROVAL') {
message.info('Bạn đã yêu cầu tham gia kèo thành công. Vui lòng đợi chủ kèo xác nhận');
} else {
message.success('Đăng ký tham gia thành công');
}

setJoinModalOpen(false);
if (match?.joinMode !== 'APPROVAL') {
setGroupModalOpen(true);
}
await syncSelectedMatches();
await loadData();
} catch (error: any) {
message.error(error?.response?.data?.message || 'Không thể tham gia kèo');
} finally {
setJoining(false);
}
};

const handleApproveParticipant = async (participantId: string) => {
if (!matchId) return;
setApprovingId(participantId);
try {
await communityApi.approveParticipant(matchId, participantId);
message.success('Đã duyệt yêu cầu tham gia');
await loadData();
} catch (error: any) {
message.error(error?.response?.data?.message || 'Không thể duyệt yêu cầu');
} finally {
setApprovingId(null);
}
};

const handleRejectParticipant = async (participantId: string) => {
if (!matchId) return;
setRejectingId(participantId);
try {
await communityApi.rejectParticipant(matchId, participantId);
message.success('Đã từ chối yêu cầu tham gia');
await loadData();
} catch (error: any) {
message.error(error?.response?.data?.message || 'Không thể từ chối yêu cầu');
} finally {
setRejectingId(null);
}
};

const handleApproveInModal = async (participantId: string) => {
await handleApproveParticipant(participantId);
setSelectedRequestId(null);
};

const handleRejectInModal = async (participantId: string) => {
await handleRejectParticipant(participantId);
setSelectedRequestId(null);
};

const handleFriendAction = async () => {
if (!user) {
message.info('Vui lòng đăng nhập để kết bạn');
navigate('/login');
return;
}
if (!match?.hostId) return;

try {
if (friendStatus === 'NONE') {
await friendApi.sendRequest(match.hostId);
message.success('Đã gửi yêu cầu kết bạn');
setFriendStatus('PENDING_SENT');
} else if (friendStatus === 'PENDING_RECEIVED') {
await friendApi.acceptRequest(match.hostId);
message.success('Đã chấp nhận kết bạn');
setFriendStatus('ACCEPTED');
} else if (friendStatus === 'ACCEPTED') {
Modal.confirm({
title: 'Hủy kết bạn',
content: `Bạn có chắc chắn muốn hủy kết bạn với ${hostProfile?.fullName || match.hostName || 'chủ kèo'}?`,
okText: 'Hủy kết bạn',
okType: 'danger',
cancelText: 'Hủy bỏ',
onOk: async () => {
await friendApi.removeFriend(match.hostId);
message.success('Đã hủy kết bạn');
setFriendStatus('NONE');
}
});
}
} catch (error: any) {
message.error(error?.response?.data?.message || 'Thao tác kết bạn thất bại');
}
};

const openHostChat = async () => {
if (!user) {
message.info('Vui lòng đăng nhập để nhắn tin');
navigate('/login');
return;
}
if (!match?.hostId || !user?.id) return;
if (match.hostId === user.id) {
message.info('Bạn là chủ kèo');
return;
}

setMessageModalOpen(true);
setChatLoading(true);
try {
const allConvs = await chatApi.getConversations();
const existingPrivate = (allConvs || []).find((c: any) =>
c.type === 'PRIVATE' && Array.isArray(c.participants) && c.participants.some((p: any) => p?.id === match.hostId || p?.userId === match.hostId),
);

const conv = existingPrivate || await chatApi.createPrivateConversation(match.hostId);
const convId = conv?.id || conv?._id;
if (!convId) throw new Error('Không thể tạo hội thoại');

setChatConversationId(convId);
const msgs: ChatMessage[] = await chatApi.getMessages(convId);
setChatMessages((msgs || []).map((m) => mapToUiMessage(m, user.id)));
} catch (error: any) {
message.error(error?.response?.data?.message || 'Không thể mở hội thoại với chủ kèo');
setMessageModalOpen(false);
} finally {
setChatLoading(false);
}
};

const handleSendQuickMessage = () => {
if (!quickMessage.trim()) {
message.warning('Nhập nội dung tin nhắn trước khi gửi');
return;
}
if (!chatConversationId || !user?.id) return;

const content = quickMessage.trim();
const optimistic: ChatMsg = {
id: `temp-${Date.now()}`,
from: 'me',
text: content,
time: dayjs().format('HH:mm'),
};
setChatMessages((prev) => [...prev, optimistic]);
setQuickMessage('');

const sentByWs = chatSocket.sendChatMessage(chatConversationId, content, 'TEXT');
if (sentByWs) return;

chatApi.sendMessage({
conversationId: chatConversationId,
content,
type: 'TEXT',
}).then((saved) => {
setChatMessages((prev) => prev.map((m) =>
m.id === optimistic.id
? { ...m, id: saved.id, time: dayjs(saved.timestamp).format('HH:mm') }
: m,
));
}).catch(() => {
message.error('Gửi tin nhắn thất bại');
setChatMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
});
};

if (loading) {
return <div style={{ padding: 48, textAlign: 'center' }}><Spin size="large" /></div>;
}

if (!match) {
return (
<div style={{ maxWidth: 900, margin: '40px auto', padding: 16 }}>
<Empty description="Không tìm thấy kèo" />
<div style={{ marginTop: 16, textAlign: 'center' }}>
<Button onClick={() => navigate('/community')}>Quay lại cộng đồng</Button>
</div>
</div>
);
}

return (
<div style={{ maxWidth: 1240, margin: '0 auto', padding: 24 }}>
<Space style={{ marginBottom: 16 }}>
<Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>Quay lại</Button>
<Tag color={match.status === 'OPEN' ? 'green' : 'default'}>{match.status}</Tag>
</Space>

<Row gutter={[18, 18]}>
<Col xs={24} lg={16}>
<Card style={{ borderRadius: 20 }}>
<Title level={2} style={{ marginTop: 0, marginBottom: 8 }}>{match.title}</Title>
<Space wrap style={{ marginBottom: 14 }}>
{(match.levels || [match.level]).map((lv) => (
        <Tag key={lv} color={getLevelColor(lv)} style={{ fontWeight: 600 }}>
          Trình {getLevelLabel(lv)}
        </Tag>
      ))}
<Tag color="orange">{genderLabel[match.genderPreference || 'ANY']}</Tag>
<Tag>{paymentLabel[match.paymentType || 'SHARE']}</Tag>
</Space>
<Paragraph style={{ color: '#475569' }}>{match.description || 'Không có mô tả.'}</Paragraph>

<Row gutter={[10, 10]}>
<Col xs={24} md={12}><Text><EnvironmentOutlined /> {match.venueName || match.venueAddress || 'Chưa có địa điểm'}</Text></Col>
<Col xs={24} md={12}><Text><CalendarOutlined /> {dayjs(match.startTime).format('DD/MM/YYYY')}</Text></Col>
<Col xs={24} md={12}><Text><ClockCircleOutlined /> {dayjs(match.startTime).format('HH:mm')} - {dayjs(match.endTime).format('HH:mm')}</Text></Col>
<Col xs={24} md={12}><Text><TeamOutlined /> {displayedCurrentParticipants}/{match.maxParticipants} người</Text></Col>
<Col xs={24}><Text><PhoneOutlined /> {match.contactPhone || 'Chưa có số liên hệ'}</Text></Col>
<Col xs={24}>
<Text>
<AimOutlined /> {distanceKm !== null
? ` Cách bạn khoảng ${distanceKm} km`
: ` ${geoError || 'Đang lấy vị trí hiện tại...'}`}
</Text>
</Col>
</Row>
</Card>

<Card
title="Bản đồ địa điểm sân"
style={{ marginTop: 16, borderRadius: 20 }}
extra={(
<Button
type="link"
icon={<EnvironmentFilled />}
disabled={!directionUrl}
onClick={() => {
if (directionUrl) window.open(directionUrl, '_blank', 'noopener,noreferrer');
}}
>
Chỉ đường
</Button>
)}
>
{mapUrl ? (
<div style={{ height: 320, borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
<iframe title="match-map" src={mapUrl} style={{ width: '100%', height: '100%', border: 0 }} />
</div>
) : (
<Empty description="Kèo chưa có tọa độ sân" />
)}
</Card>

<Card
title={<span style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.01em' }}>{`Người tham gia (${approvedParticipants.length})`}</span>}
style={{ marginTop: 16, borderRadius: 20, border: '1px solid #e5e7eb', boxShadow: '0 8px 24px rgba(15, 23, 42, 0.05)' }}
>
{approvedParticipants.length === 0 ? (
<Empty description="Chưa có người tham gia" />
) : (
<List
dataSource={approvedParticipants}
renderItem={(p) => (
<List.Item style={{ borderRadius: 14, padding: 14, background: '#fafafa', marginBottom: 10, border: '1px solid #f1f5f9' }}>
<div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
<div
style={{
display: 'flex',
gap: 12,
minWidth: 260,
cursor: 'pointer',
padding: '6px 10px',
borderRadius: '10px',
transition: 'all 0.2s',
}}
onClick={() => setSelectedRequestId(p.id)}
onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
>
<Avatar style={{ background: '#16a34a', flexShrink: 0 }} icon={<UserOutlined />} />
<div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
<Space size={8} wrap>
<Text strong style={{ fontSize: 16 }}>{getParticipantName(p as any)}</Text>
<Tag color={getParticipantStatus(p as any).color} style={{ borderRadius: 999 }}>
{getParticipantStatus(p as any).text}
</Tag>
{getParticipantProfile(p as any).rating ? (
<Tag color="gold" style={{ borderRadius: 999 }}>
<StarFilled /> {Number(getParticipantProfile(p as any).rating).toFixed(1)}
</Tag>
) : null}
</Space>
<Space size={[8, 8]} wrap>
<Text type="secondary" copyable={{ text: (p as any).userId, tooltips: ['Sao chép ID', 'Đã sao chép!'] }}>
ID: {(p as any).userId?.slice?.(0, 8) || '---'}
</Text>
<Text type="secondary">Tham gia: {dayjs(getParticipantTime(p as any)).format('DD/MM HH:mm')}</Text>
<Text type="secondary">Trình độ: {getLevelLabel(getParticipantProfile(p as any).level)}</Text>
<Text type="secondary">
Giới tính: {getParticipantProfile(p as any).gender === 'MALE'
? 'Nam'
: getParticipantProfile(p as any).gender === 'FEMALE'
? 'Nữ'
: getParticipantProfile(p as any).gender === 'OTHER'
? 'Khác'
: 'Chưa cập nhật'}
</Text>
</Space>
</div>
</div>

{user && (p as any).userId !== user.id && (
<Button
type="primary"
ghost
shape="round"
icon={<MessageOutlined />}
style={{ borderRadius: 10, fontWeight: 700 }}
onClick={async (e) => {
e.stopPropagation();
try {
const allConvs = await chatApi.getConversations();
const existingPrivate = (allConvs || []).find((c: any) =>
c.type === 'PRIVATE' && Array.isArray(c.participants) && c.participants.some((part: any) => part?.id === p.userId || part?.userId === p.userId)
);

let conv = existingPrivate;
if (!conv) {
conv = await chatApi.createPrivateConversation(p.userId);
}
const convId = conv?.id || conv?._id;
if (convId) {
useChatStore.getState().setActiveConversation(convId);
navigate('/chat');
}
} catch (err) {
message.error('Không thể nhắn tin với người chơi này');
}
}}
>
Nhắn tin
</Button>
)}
</div>
</List.Item>
)}
/>
)}
</Card>
</Col>

<Col xs={24} lg={8}>
{match.hostId && (
<Card
title={<span style={{ fontSize: 18, fontWeight: 800 }}>Chủ kèo</span>}
style={{ borderRadius: 20, marginBottom: 16, border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)' }}
>
<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 12 }}>
<Avatar
size={80}
src={hostProfile?.avatarUrl || match.hostAvatar}
icon={<UserOutlined />}
style={{ background: '#16a34a', border: '3px solid #f1f5f9', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
/>
<div>
<Title level={4} style={{ margin: 0, fontWeight: 700 }}>
{hostProfile?.fullName || match.hostName || 'Chủ kèo'}
</Title>
{hostProfile?.email && <Text type="secondary" style={{ fontSize: 13 }}>{hostProfile.email}</Text>}
</div>

<Space size={6} wrap style={{ justifyContent: 'center' }}>
{hostProfile?.level && (
<Tag color="blue" style={{ borderRadius: 8, fontWeight: 600 }}>
{getLevelLabel(hostProfile.level)}
</Tag>
)}
{hostProfile?.gender && (
<Tag color="orange" style={{ borderRadius: 8, fontWeight: 600 }}>
{hostProfile.gender === 'MALE' ? 'Nam' : hostProfile.gender === 'FEMALE' ? 'Nữ' : 'Nam & Nữ'}
</Tag>
)}
{hostProfile?.rating !== undefined && hostProfile.rating > 0 && (
<Tag color="gold" style={{ borderRadius: 8, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
<StarFilled /> {hostProfile.rating.toFixed(1)}
</Tag>
)}
</Space>

{hostProfile?.bio && (
<Paragraph
ellipsis={{ rows: 2, expandable: true, symbol: 'Xem thêm' }}
style={{ color: '#64748b', fontSize: 13, margin: '4px 0 0 0', width: '100%' }}
>
{hostProfile.bio}
</Paragraph>
)}

<div style={{ width: '100%', height: '1px', background: '#f1f5f9', margin: '4px 0' }} />

<Space direction="vertical" style={{ width: '100%' }} size={8}>
{friendStatus !== 'SELF' && (
<>
<div style={{ width: '100%' }}>
{friendStatus === 'NONE' && (
<Button type="primary" block icon={<UserOutlined />} onClick={handleFriendAction} style={{ borderRadius: 10, fontWeight: 600 }}>
Kết bạn
</Button>
)}
{friendStatus === 'PENDING_SENT' && (
<Button block disabled style={{ borderRadius: 10, fontWeight: 600 }}>
Đã gửi yêu cầu kết bạn
</Button>
)}
{friendStatus === 'PENDING_RECEIVED' && (
<Row gutter={8}>
<Col span={12}>
<Button type="primary" block onClick={handleFriendAction} style={{ borderRadius: 10, fontWeight: 600 }}>
Đồng ý
</Button>
</Col>
<Col span={12}>
<Button danger block onClick={async () => {
try {
await friendApi.declineRequest(match.hostId!);
message.success('Đã từ chối yêu cầu kết bạn');
setFriendStatus('NONE');
} catch (err: any) {
message.error(err?.response?.data?.message || 'Từ chối thất bại');
}
}} style={{ borderRadius: 10, fontWeight: 600 }}>
Từ chối
</Button>
</Col>
</Row>
)}
{friendStatus === 'ACCEPTED' && (
<Button block onClick={handleFriendAction} style={{ borderRadius: 10, fontWeight: 600, borderColor: '#52c41a', color: '#52c41a' }}>
✓ Bạn bè (Hủy kết bạn)
</Button>
)}
</div>

<Button icon={<MessageOutlined />} block onClick={openHostChat} style={{ borderRadius: 10, fontWeight: 600 }}>
Nhắn tin
</Button>
</>
)}

{friendStatus === 'SELF' && (
<Alert type="success" message="Bạn là chủ kèo này" showIcon style={{ textAlign: 'left', width: '100%', borderRadius: 10 }} />
)}
</Space>
</div>
</Card>
)}

<Card title="Tham gia kèo đấu" style={{ borderRadius: 20, border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)' }}>
{isOwner ? (
<Alert type="info" showIcon message="Bạn là chủ kèo" style={{ marginBottom: 12, borderRadius: 10 }} />
) : null}

<Space direction="vertical" style={{ width: '100%' }} size={10}>
<Button
type="primary"
icon={<TeamOutlined />}
block
size="large"
style={{ borderRadius: 10, fontWeight: 700 }}
disabled={
isOwner ||
isFull ||
match.status !== 'OPEN' ||
myParticipant?.status === 'PENDING' ||
myParticipant?.status === 'APPROVED'
}
onClick={() => {
if (!user) {
message.info('Vui lòng đăng nhập để tham gia kèo');
navigate('/login');
return;
}
setJoinModalOpen(true);
}}
>
{myParticipant?.status === 'PENDING'
? 'Đã yêu cầu tham gia'
: myParticipant?.status === 'APPROVED'
? 'Đã tham gia kèo'
: isFull
? 'Kèo đã đủ người'
: 'Tham gia kèo'}
</Button>
</Space>
</Card>

{isOwner ? (
<Card
title={<span style={{ fontSize: 20, fontWeight: 800 }}>{`Quản lý yêu cầu (${pendingRequests.length} chờ duyệt)`}</span>}
style={{ borderRadius: 20, marginTop: 16, border: '1px solid #e5e7eb', boxShadow: '0 8px 24px rgba(15, 23, 42, 0.05)' }}
>
{pendingRequests.length === 0 ? (
<Empty description="Hiện chưa có yêu cầu tham gia mới" />
) : (
<List
dataSource={pendingRequests}
renderItem={(p) => (
<List.Item style={{ borderRadius: 14, padding: 14, background: '#fafafa', marginBottom: 10, border: '1px solid #f1f5f9' }}>
<div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
<div
style={{
display: 'flex',
alignItems: 'center',
gap: 12,
minWidth: 240,
cursor: 'pointer',
padding: '6px 10px',
borderRadius: '10px',
transition: 'all 0.2s',
}}
onClick={() => setSelectedRequestId(p.id)}
onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
>
<Avatar style={{ background: '#f59e0b', flexShrink: 0 }} icon={<UserOutlined />} />
<div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
<Space size={8} wrap>
<Text strong style={{ fontSize: 16 }}>{getParticipantName(p as any)}</Text>
<Tag color="gold" style={{ borderRadius: 999 }}>Chờ duyệt</Tag>
</Space>
<Text type="secondary">ID: {(p as any).userId?.slice?.(0, 8) || '---'}</Text>
<Text type="secondary">Yêu cầu lúc: {dayjs(getParticipantTime(p as any)).format('DD/MM HH:mm')}</Text>
</div>
</div>
<Space>
<Button
key="approve"
type="primary"
onClick={() => handleApproveParticipant(p.id)}
loading={approvingId === p.id}
style={{ borderRadius: 10, fontWeight: 700 }}
>
Duyệt
</Button>
<Button
key="reject"
danger
onClick={() => handleRejectParticipant(p.id)}
loading={rejectingId === p.id}
style={{ borderRadius: 10, fontWeight: 700 }}
>
Từ chối
</Button>
</Space>
</div>
</List.Item>
)}
/>
)}

{rejectedParticipants.length > 0 ? (
<div style={{ marginTop: 12 }}>
<Text type="secondary">Đã từ chối gần đây: {rejectedParticipants.length}</Text>
</div>
) : null}
</Card>
) : null}
</Col>
</Row>

<Modal
title="Xác nhận tham gia kèo"
open={joinModalOpen}
onCancel={() => setJoinModalOpen(false)}
onOk={handleConfirmJoin}
confirmLoading={joining}
okText="Tham gia ngay"
cancelText="Để sau"
>
<Paragraph style={{ marginBottom: 0 }}>
Bạn sắp tham gia kèo <Text strong>{match.title}</Text>. Sau khi tham gia thành công, bạn sẽ được đưa vào nhóm tin nhắn của kèo.
</Paragraph>
</Modal>

<Modal
title="Nhắn tin với chủ kèo"
open={messageModalOpen}
onCancel={() => setMessageModalOpen(false)}
footer={null}
width={620}
>
<div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
<Text type="secondary">Chủ kèo: {match.hostName || 'Người tạo kèo'}</Text>

<div
ref={chatBoxRef}
style={{ maxHeight: 340, overflowY: 'auto', padding: 10, background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0' }}
>
{chatLoading ? (
<div style={{ padding: 24, textAlign: 'center' }}><Spin /></div>
) : chatMessages.length === 0 ? (
<div style={{ padding: 24, textAlign: 'center', color: '#64748b' }}>Chưa có tin nhắn. Hãy bắt đầu cuộc trò chuyện.</div>
) : null}

<Space direction="vertical" style={{ width: '100%' }} size={10}>
{chatMessages.map((m) => (
<div key={m.id} style={{ display: 'flex', justifyContent: m.from === 'me' ? 'flex-end' : 'flex-start' }}>
<div
style={{
maxWidth: '78%',
background: m.from === 'me' ? '#16a34a' : '#ffffff',
color: m.from === 'me' ? '#fff' : '#0f172a',
border: m.from === 'me' ? 'none' : '1px solid #e2e8f0',
borderRadius: 14,
padding: '8px 10px',
}}
>
<div>{m.text}</div>
<div style={{ marginTop: 4, fontSize: 11, opacity: 0.75, textAlign: 'right' }}>{m.time}</div>
</div>
</div>
))}
</Space>
</div>

<Space.Compact style={{ width: '100%' }}>
<Input
value={quickMessage}
onChange={(e) => setQuickMessage(e.target.value)}
placeholder="Nhập tin nhắn..."
onPressEnter={handleSendQuickMessage}
disabled={chatLoading || !chatConversationId}
/>
<Button type="primary" icon={<SendOutlined />} onClick={handleSendQuickMessage} disabled={chatLoading || !chatConversationId}>
Gửi
</Button>
</Space.Compact>
</div>
</Modal>

<Modal
title="Tham gia thành công"
open={groupModalOpen}
onCancel={() => setGroupModalOpen(false)}
footer={[
<Button key="close" onClick={() => setGroupModalOpen(false)}>Đóng</Button>,
<Button
key="chat"
type="primary"
icon={<SendOutlined />}
onClick={async () => {
if (matchId) {
try {
await chatApi.createGroupForMatch(matchId);
} catch {
// ignore if exists
}
}
setGroupModalOpen(false);
navigate('/chat');
}}
>
Vào nhóm tin nhắn kèo
</Button>,
]}
>
<Paragraph style={{ marginBottom: 0 }}>
Bạn đã tham gia kèo thành công. Hãy vào nhóm tin nhắn của kèo để trao đổi lịch chơi với mọi người.
</Paragraph>
</Modal>

<Modal
title={
<div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 10, borderBottom: '1px solid #f1f5f9' }}>
<UserOutlined style={{ color: '#16a34a' }} />
<span>Thông tin người chơi</span>
</div>
}
open={!!selectedRequestId}
onCancel={() => setSelectedRequestId(null)}
footer={
selectedRequest?.status === 'PENDING' ? (
<div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, padding: '10px 0 0 0' }}>
<Button
danger
icon={<CloseOutlined />}
onClick={() => selectedRequest && handleRejectInModal(selectedRequest.id)}
loading={rejectingId === selectedRequest?.id}
style={{ borderRadius: 10, fontWeight: 700 }}
>
Từ chối
</Button>
<Button
type="primary"
icon={<CheckOutlined />}
onClick={() => selectedRequest && handleApproveInModal(selectedRequest.id)}
loading={approvingId === selectedRequest?.id}
style={{ borderRadius: 10, fontWeight: 700, backgroundColor: '#16a34a', borderColor: '#16a34a' }}
>
Duyệt tham gia
</Button>
</div>
) : (
<Button onClick={() => setSelectedRequestId(null)} style={{ borderRadius: 10 }}>
Đóng
</Button>
)
}
width={550}
style={{ borderRadius: 20, overflow: 'hidden' }}
>
{selectedRequest ? (
<div style={{ padding: '10px 0' }}>
{selectedRequest.status !== 'PENDING' && (
<Alert
type={selectedRequest.status === 'APPROVED' ? 'success' : 'warning'}
message={
<span>
Yêu cầu này đã được xử lý: <strong>{getParticipantStatus(selectedRequest).text}</strong>
</span>
}
showIcon
style={{ marginBottom: 16, borderRadius: 10 }}
/>
)}

<div style={{ display: 'flex', gap: 20, marginBottom: 24, alignItems: 'center', background: '#f8fafc', padding: 16, borderRadius: 16 }}>
<Avatar
size={72}
src={selectedPlayerProfile?.avatarUrl}
style={{
background: selectedRequest.status === 'APPROVED' ? '#16a34a' : '#f59e0b',
boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
}}
icon={<UserOutlined />}
/>
<div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
<Title level={4} style={{ margin: 0, fontSize: 20 }}>
{getParticipantName(selectedRequest)}
</Title>
<Space wrap size={6}>
<Tag color={getParticipantStatus(selectedRequest).color} style={{ borderRadius: 999 }}>
{getParticipantStatus(selectedRequest).text}
</Tag>
{selectedPlayerProfile?.level && (
<Tag color="blue" style={{ borderRadius: 999 }}>
{getLevelLabel(selectedPlayerProfile.level)}
</Tag>
)}
{selectedPlayerProfile?.gender && (
<Tag color="purple" style={{ borderRadius: 999 }}>
{selectedPlayerProfile.gender === 'MALE'
? 'Nam'
: selectedPlayerProfile.gender === 'FEMALE'
? 'Nữ'
: 'Khác'}
</Tag>
)}
</Space>
{selectedPlayerProfile?.rating ? (
<div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
<Rate disabled allowHalf defaultValue={selectedPlayerProfile.rating} style={{ fontSize: 14 }} />
<span style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>
{Number(selectedPlayerProfile.rating).toFixed(1)} ({selectedPlayerProfile.reviewCount || 0} đánh giá)
</span>
</div>
) : (
<span style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>Chưa có đánh giá</span>
)}
</div>
</div>

<Descriptions column={1} bordered size="small" layout="horizontal" labelStyle={{ width: 140, fontWeight: 600, background: '#f8fafc' }}>
<Descriptions.Item label="Mã người chơi">
<Text copyable type="secondary">{selectedRequest.userId}</Text>
</Descriptions.Item>
<Descriptions.Item label="Số điện thoại">
{isProfileLoading ? (
<Spin size="small" />
) : selectedPlayerProfile?.phone ? (
<Space>
<PhoneOutlined style={{ color: '#16a34a' }} />
<Text strong>{selectedPlayerProfile.phone}</Text>
</Space>
) : (
<Text type="secondary">Chưa cung cấp</Text>
)}
</Descriptions.Item>
<Descriptions.Item label="Email">
{isProfileLoading ? (
<Spin size="small" />
) : selectedPlayerProfile?.email ? (
<Space>
<MailOutlined style={{ color: '#0284c7'}} />
<Text>{selectedPlayerProfile.email}</Text>
</Space>
) : (
<Text type="secondary">Chưa cung cấp</Text>
)}
</Descriptions.Item>
<Descriptions.Item label="Trình độ">
{isProfileLoading ? (
<Spin size="small" />
) : selectedPlayerProfile?.level ? (
<Tag color="blue" style={{ borderRadius: 999 }}>
{getLevelLabel(selectedPlayerProfile.level)}
</Tag>
) : (
<Text type="secondary">Chưa cập nhật</Text>
)}
</Descriptions.Item>
<Descriptions.Item label="Đánh giá">
{isProfileLoading ? (
<Spin size="small" />
) : selectedPlayerProfile?.rating != null && selectedPlayerProfile.rating > 0 ? (
<Space>
<Rate disabled allowHalf defaultValue={selectedPlayerProfile.rating} style={{ fontSize: 14 }} />
<Text strong>{Number(selectedPlayerProfile.rating).toFixed(1)}</Text>
<Text type="secondary">({selectedPlayerProfile.reviewCount || 0} đánh giá)</Text>
</Space>
) : (
<Text type="secondary">Chưa có đánh giá</Text>
)}
</Descriptions.Item>
<Descriptions.Item label="Thời gian yêu cầu">
<Space>
<ClockCircleOutlined style={{ color: '#64748b' }} />
<Text>{dayjs(getParticipantTime(selectedRequest)).format('DD/MM/YYYY HH:mm:ss')}</Text>
</Space>
</Descriptions.Item>
{selectedPlayerProfile?.preferredAreas && selectedPlayerProfile.preferredAreas.length > 0 && (
<Descriptions.Item label="Khu vực chơi">
<Space wrap size={4}>
{selectedPlayerProfile.preferredAreas.map((area: string, idx: number) => (
<Tag key={idx} color="cyan">{area}</Tag>
))}
</Space>
</Descriptions.Item>
)}
</Descriptions>

{selectedPlayerProfile?.bio && (
<div style={{ marginTop: 20 }}>
<Text strong style={{ display: 'block', marginBottom: 6 }}>Giới thiệu bản thân:</Text>
<div style={{ padding: '10px 14px', background: '#f1f5f9', borderRadius: 10, fontStyle: 'italic', color: '#475569' }}>
"{selectedPlayerProfile.bio}"
</div>
</div>
)}

{selectedPlayerProfile?.availabilities && selectedPlayerProfile.availabilities.length > 0 && (
<div style={{ marginTop: 16 }}>
<Text strong style={{ display: 'block', marginBottom: 6 }}>Thời gian hoạt động:</Text>
<Space wrap size={6}>
{selectedPlayerProfile.availabilities.map((av: any, idx: number) => (
<Tag key={idx} color="geekblue" style={{ borderRadius: 6 }}>
{av.dayOfWeek}: {av.startTime} - {av.endTime}
</Tag>
))}
</Space>
</div>
)}
</div>
) : (
<div style={{ textAlign: 'center', padding: 20 }}><Spin size="large" /></div>
)}
</Modal>
</div>
);
}
