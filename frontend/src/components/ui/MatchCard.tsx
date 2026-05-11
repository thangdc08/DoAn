import React, { useState } from 'react';
import { Avatar, Button, Card, Progress, Space, Tag, Tooltip, Typography } from 'antd';
import {
  ClockCircleOutlined,
  EnvironmentOutlined,
  HeartFilled,
  HeartOutlined,
  MessageOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import type { MatchPost } from '../../data/mockData';
import StatusTag from './StatusTag';
import { useNotify } from '../../hooks/useNotify';
import { BRAND } from '../../theme/antdTheme';

const { Text, Title } = Typography;

// ─── Level config ────────────────────────────────────────────────────────

const LEVEL_TAG_COLOR: Record<MatchPost['level'], string> = {
  Yếu: 'blue',
  'Trung bình': 'cyan',
  'Trung bình khá': 'orange',
  Khá: 'volcano',
};

// ─── Sub-components ──────────────────────────────────────────────────────

type InfoRowProps = {
  icon: React.ReactNode;
  children: React.ReactNode;
};
const InfoRow: React.FC<InfoRowProps> = ({ icon, children }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#64748b', fontSize: 13 }}>
    {icon}
    <span style={{ flex: 1 }}>{children}</span>
  </div>
);

// ─── Main component ──────────────────────────────────────────────────────

type MatchCardProps = {
  post: MatchPost;
};

const MatchCard: React.FC<MatchCardProps> = ({ post }) => {
  const { confirm, success } = useNotify();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes ?? 0);

  const percent = Math.round((post.joined / post.capacity) * 100);
  const isFull = post.joined >= post.capacity;

  const handleJoin = () => {
    if (isFull) return;
    confirm({
      title: 'Đăng ký tham gia kèo',
      content: (
        <div>
          <p>
            Bạn sẽ đăng ký tham gia kèo{' '}
            <strong>"{post.title}"</strong>?
          </p>
          <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>
            {post.privacy === 'Nội bộ'
              ? 'Đây là kèo nội bộ — chủ kèo sẽ duyệt yêu cầu của bạn.'
              : 'Bạn sẽ được thêm ngay vào danh sách tham gia.'}
          </p>
        </div>
      ),
      okText: post.privacy === 'Nội bộ' ? 'Gửi yêu cầu' : 'Đăng ký',
      onOk: () => {
        success(
          post.privacy === 'Nội bộ'
            ? 'Đã gửi yêu cầu tham gia! Chủ kèo sẽ phản hồi sớm.'
            : `Đăng ký thành công! Hẹn gặp bạn tại ${post.venueName} 🏸`,
        );
      },
    });
  };

  const handleLike = () => {
    setLiked((prev) => {
      setLikeCount((c) => c + (prev ? -1 : 1));
      return !prev;
    });
  };

  return (
    <Card
      style={{
        borderRadius: 16,
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 4px rgba(15,23,42,0.06)',
        transition: 'box-shadow 0.2s, transform 0.2s',
      }}
      styles={{ body: { padding: 20 } }}
      hoverable
    >
      <div style={{ display: 'flex', gap: 16 }}>
        {/* ── Avatar ── */}
        <Avatar
          size={48}
          src={post.hostAvatar}
          style={{
            background: `linear-gradient(135deg, ${BRAND.primary}, ${BRAND.primaryDark})`,
            fontWeight: 700,
            fontSize: 18,
            flexShrink: 0,
          }}
        >
          {post.host[0]}
        </Avatar>

        {/* ── Body ── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Host + badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <Text strong style={{ fontSize: 14 }}>{post.host}</Text>
            <StatusTag status={post.privacy === 'Công khai' ? 'PUBLIC' : 'PRIVATE'} />
            <Tag color={LEVEL_TAG_COLOR[post.level]} style={{ fontWeight: 600 }}>
              Trình {post.level}
            </Tag>
          </div>

          {/* Title */}
          <Title
            level={5}
            style={{ margin: '0 0 10px', fontWeight: 700, lineHeight: 1.4 }}
            ellipsis={{ rows: 2 }}
          >
            {post.title}
          </Title>

          {/* Info rows */}
          <Space direction="vertical" size={4} style={{ width: '100%' }}>
            <InfoRow icon={<EnvironmentOutlined style={{ color: BRAND.primary }} />}>
              {post.venueName}
            </InfoRow>
            <InfoRow icon={<ClockCircleOutlined style={{ color: BRAND.primary }} />}>
              {post.time}
            </InfoRow>
          </Space>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {post.tags.map((tag) => (
                <Tag key={tag} style={{ margin: 0, borderRadius: 6 }}>
                  {tag}
                </Tag>
              ))}
            </div>
          )}
        </div>

        {/* ── Right panel ── */}
        <div
          style={{
            width: 180,
            flexShrink: 0,
            background: '#f8fafc',
            borderRadius: 12,
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            alignSelf: 'flex-start',
          }}
        >
          {/* Slot fill */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>Người tham gia</Text>
              <Text strong style={{ fontSize: 13 }}>
                {post.joined}/{post.capacity}
              </Text>
            </div>
            <Progress
              percent={percent}
              showInfo={false}
              strokeColor={
                isFull
                  ? '#ef4444'
                  : percent >= 70
                  ? '#f59e0b'
                  : BRAND.primary
              }
              trailColor="#e2e8f0"
              size="small"
            />
            {isFull && (
              <Text style={{ fontSize: 11, color: '#ef4444', fontWeight: 600, marginTop: 4, display: 'block' }}>
                Đã đủ người
              </Text>
            )}
          </div>

          {/* Price */}
          <Text style={{ fontSize: 14, fontWeight: 700, color: BRAND.primary }}>
            {post.price}
          </Text>

          {/* CTA */}
          <Tooltip title={isFull ? 'Kèo này đã đủ người' : ''}>
            <Button
              type="primary"
              block
              icon={<UserAddOutlined />}
              disabled={isFull}
              onClick={handleJoin}
              style={{ fontWeight: 700, borderRadius: 10 }}
            >
              {isFull ? 'Hết chỗ' : 'Đăng ký'}
            </Button>
          </Tooltip>

          {/* Like / Comment */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
            <Button
              size="small"
              type={liked ? 'primary' : 'default'}
              icon={liked ? <HeartFilled /> : <HeartOutlined />}
              onClick={handleLike}
              style={{
                color: liked ? '#fff' : '#64748b',
                background: liked ? '#ef4444' : undefined,
                borderColor: liked ? '#ef4444' : undefined,
                fontWeight: 600,
                fontSize: 12,
              }}
            >
              {likeCount > 0 ? likeCount : ''}
            </Button>
            <Button
              size="small"
              icon={<MessageOutlined />}
              style={{ color: '#64748b', fontSize: 12 }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MatchCard;
