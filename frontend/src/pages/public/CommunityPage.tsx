import { useEffect, useState } from 'react';
import { Card, Button, Select, Pagination, Empty, Space, Typography, message, Spin, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { communityApi } from '../../services/communityApi';
import type { MatchPost } from '../../types/community.types';
import { useAuthStore } from '../../stores/authStore';

dayjs.extend(relativeTime);

const { Title, Text, Paragraph } = Typography;

export default function CommunityPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [level, setLevel] = useState<string>();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<MatchPost[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  const loadPosts = async () => {
    setLoading(true);
    try {
      const data = await communityApi.getMatchPosts({
        status: 'OPEN',
        level,
        page: page - 1,
        size: pageSize,
      });
      setPosts(data.content || []);
      setTotalElements(data.totalElements || 0);
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Khong the tai danh sach keo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [level, page]);

  const handleJoin = async (matchId: string) => {
    try {
      await communityApi.joinMatch(matchId);
      message.success('Dang ky tham gia thanh cong');
      await loadPosts();
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Khong the dang ky tham gia');
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <Title level={2} style={{ marginBottom: 4 }}>Cong dong keo cau long</Title>
          <Text type="secondary">Tai keo mo va dang ky tham gia truc tiep</Text>
        </div>
        <Button type="primary" onClick={() => navigate('/user/challenges/create')}>Tao keo moi</Button>
      </div>

      <Space style={{ marginBottom: 16 }}>
        <Select
          allowClear
          placeholder="Loc theo trinh do"
          style={{ minWidth: 220 }}
          value={level}
          onChange={(v) => {
            setPage(1);
            setLevel(v);
          }}
          options={[
            { value: 'BEGINNER', label: 'Beginner' },
            { value: 'INTERMEDIATE', label: 'Intermediate' },
            { value: 'ADVANCED', label: 'Advanced' },
          ]}
        />
      </Space>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}><Spin /></div>
      ) : posts.length === 0 ? (
        <Empty description="Khong co keo phu hop" />
      ) : (
        posts.map((match) => (
          <Card key={match.id} style={{ marginBottom: 12 }} hoverable onClick={() => navigate(`/community/matches/${match.id}`)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
              <div>
                <Title level={4} style={{ marginBottom: 6 }}>{match.title}</Title>
                <Space wrap>
                  <Tag>{match.level}</Tag>
                  <Tag color="blue">{match.joinMode}</Tag>
                  <Tag color={match.currentParticipants >= match.maxParticipants ? 'red' : 'green'}>
                    {match.currentParticipants}/{match.maxParticipants} nguoi
                  </Tag>
                </Space>
                <Paragraph style={{ margin: '8px 0 0 0' }}>{match.description || 'Khong co mo ta'}</Paragraph>
                <Text type="secondary">
                  {match.venueName || match.venueAddress || '-'} | {dayjs(match.startTime).format('DD/MM/YYYY HH:mm')} - {dayjs(match.endTime).format('HH:mm')} | Dang boi {match.hostName || 'Chu keo'} ({dayjs(match.createdAt).fromNow()})
                </Text>
              </div>
              <div>
                <Button
                  type="primary"
                  disabled={match.currentParticipants >= match.maxParticipants || match.hostId === user?.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleJoin(match.id);
                  }}
                >
                  Dang ky tham gia
                </Button>
              </div>
            </div>
          </Card>
        ))
      )}

      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <Pagination current={page} total={totalElements} pageSize={pageSize} onChange={setPage} showSizeChanger={false} />
      </div>
    </div>
  );
}
