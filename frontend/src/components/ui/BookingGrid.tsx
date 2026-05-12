import React, { useMemo, useState } from 'react';
import { Badge, Button, Tooltip, Typography } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { courtNames, timeSlots } from '../../data/mockData';
import { useNotify } from '../../hooks/useNotify';
import { BRAND } from '../../theme/antdTheme';

const { Text } = Typography;

// ─── Types ─────────────────────────────────────────────────────────────

type SlotStatus = 'available' | 'booked' | 'locked' | 'selected';

type BookingGridProps = {
  /** Callback khi danh sách slot được chọn thay đổi */
  onSelectionChange?: (slots: string[]) => void;
  /** Giá mỗi slot (VNĐ) */
  pricePerSlot?: number;
  /** Chế độ xem chỉ đọc */
  readOnly?: boolean;
  /** Danh sách tên sân */
  courtNames?: string[];
  /** Danh sách khung giờ */
  timeSlots?: string[];
  /** Chế độ quản trị (Lock sân) */
  isAdmin?: boolean;
};

// ─── Mock data (sẽ thay bằng API) ──────────────────────────────────────

const BOOKED_SLOTS = new Set([
  'Sân 1-18:00', 'Sân 1-19:00', 'Sân 2-19:00',
  'Sân 4-08:00', 'Sân 5-20:00',
]);

const LOCKED_SLOTS = new Set(['Sân 3-17:00', 'Sân 6-18:00']);

// ─── Legend item ────────────────────────────────────────────────────────

type LegendItemProps = { color: string; label: string };

const LegendItem: React.FC<LegendItemProps> = ({ color, label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
    <div
      style={{
        width: 14,
        height: 14,
        borderRadius: 4,
        background: color,
        border: '1.5px solid rgba(0,0,0,0.08)',
        flexShrink: 0,
      }}
    />
    <Text style={{ fontSize: 12, color: '#64748b' }}>{label}</Text>
  </div>
);

// ─── Slot cell styles ───────────────────────────────────────────────────

function getSlotStyle(status: SlotStatus): React.CSSProperties {
  const base: React.CSSProperties = {
    width: 48,
    height: 38,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 10,
    fontWeight: 700,
    borderRight: '1px solid #f1f5f9',
    transition: 'all 0.15s ease',
    flexShrink: 0,
    cursor: 'pointer',
  };

  switch (status) {
    case 'booked':
      return { ...base, background: '#fee2e2', color: '#dc2626', cursor: 'not-allowed' };
    case 'locked':
      return { ...base, background: '#fef3c7', color: '#d97706', cursor: 'not-allowed' };
    case 'selected':
      return {
        ...base,
        background: BRAND.primary,
        color: '#fff',
        boxShadow: `inset 0 2px 4px rgba(0,0,0,0.15)`,
      };
    default:
      return { ...base, background: '#fff' };
  }
}

function getSlotLabel(status: SlotStatus): string {
  switch (status) {
    case 'booked': return 'Đặt';
    case 'locked': return 'Giữ';
    case 'selected': return '✓';
    default: return '';
  }
}

// ─── Main component ─────────────────────────────────────────────────────

const BookingGrid: React.FC<BookingGridProps> = ({
  onSelectionChange,
  pricePerSlot = 120_000,
  readOnly = false,
  courtNames: propsCourtNames,
  timeSlots: propsTimeSlots,
  isAdmin = false,
}) => {
  const { confirm, success, notify } = useNotify();
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [lockedByAdmin, setLockedByAdmin] = useState<Set<string>>(new Set(LOCKED_SLOTS));

  const finalCourtNames = propsCourtNames || courtNames;
  const finalTimeSlots = propsTimeSlots || timeSlots;

  const totalPrice = useMemo(
    () => selectedSlots.length * pricePerSlot,
    [selectedSlots.length, pricePerSlot],
  );

  const getStatus = (court: string, time: string): SlotStatus => {
    const id = `${court}-${time}`;
    if (BOOKED_SLOTS.has(id)) return 'booked';
    if (lockedByAdmin.has(id)) return 'locked';
    if (selectedSlots.includes(id)) return 'selected';
    return 'available';
  };

  const toggleSlot = (court: string, time: string) => {
    if (readOnly && !isAdmin) return;
    const id = `${court}-${time}`;

    if (isAdmin) {
      const newLocked = new Set(lockedByAdmin);
      if (newLocked.has(id)) {
        newLocked.delete(id);
        notify('info', 'Đã mở khóa sân', `Sân ${court} khung giờ ${time} đã sẵn sàng cho khách.`);
      } else {
        newLocked.add(id);
        notify('warning', 'Đã khóa sân', `Sân ${court} khung giờ ${time} đã được ẩn khỏi khách.`);
      }
      setLockedByAdmin(newLocked);
      return;
    }

    if (BOOKED_SLOTS.has(id) || lockedByAdmin.has(id)) return;

    setSelectedSlots((prev) => {
      const next = prev.includes(id)
        ? prev.filter((s) => s !== id)
        : [...prev, id];
      onSelectionChange?.(next);
      return next;
    });
  };

  const handleConfirmBooking = () => {
    if (selectedSlots.length === 0) return;

    confirm({
      title: 'Xác nhận đặt sân',
      content: (
        <div>
          <p>
            Bạn đang đặt{' '}
            <strong style={{ color: BRAND.primary }}>
              {selectedSlots.length} slot
            </strong>{' '}
            với tổng tiền{' '}
            <strong style={{ color: BRAND.primary }}>
              {totalPrice.toLocaleString('vi-VN')}đ
            </strong>
            .
          </p>
          <p style={{ color: '#64748b', fontSize: 13 }}>
            Slot sẽ được giữ trong 10 phút để bạn hoàn tất thanh toán.
          </p>
        </div>
      ),
      okText: 'Đặt sân',
      onOk: () => {
        success(`Đặt sân thành công! ${selectedSlots.length} slot đang được giữ chờ thanh toán.`);
        setSelectedSlots([]);
        onSelectionChange?.([]);
      },
    });
  };

  return (
    <div>
      {/* ── Grid ───────────────────────────────────────────── */}
      <div className="overflow-x-auto pb-4 custom-scrollbar">
        <div
          style={{
            minWidth: 2000,
            borderRadius: 16,
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            background: '#fff',
            boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
          }}
        >
          {/* Header row */}
          <div
            style={{
              display: 'flex',
              borderBottom: '1px solid #e2e8f0',
              background: '#f8fafc',
            }}
          >
            <div
              style={{
                width: 96,
                flexShrink: 0,
                padding: '10px 12px',
                fontSize: 12,
                fontWeight: 700,
                color: '#475569',
                borderRight: '1px solid #e2e8f0',
                position: 'sticky',
                left: 0,
                background: '#f8fafc',
                zIndex: 10,
              }}
            >
              Sân / Giờ
            </div>
            {finalTimeSlots.map((time) => (
              <div
                key={time}
                style={{
                  width: 48,
                  flexShrink: 0,
                  padding: '10px 4px',
                  textAlign: 'center',
                  fontSize: 10,
                  fontWeight: 600,
                  color: '#64748b',
                  borderRight: '1px solid #f1f5f9',
                }}
              >
                {time}
              </div>
            ))}
          </div>

          {/* Court rows */}
          {finalCourtNames.map((court) => (
            <div
              key={court}
              style={{
                display: 'flex',
                borderBottom: '1px solid #f1f5f9',
              }}
            >
              {/* Court label */}
              <div
                style={{
                  width: 96,
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 12px',
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#374151',
                  borderRight: '1px solid #e2e8f0',
                  position: 'sticky',
                  left: 0,
                  background: '#fff',
                  zIndex: 10,
                  boxShadow: '2px 0 6px rgba(15,23,42,0.04)',
                }}
              >
                {court}
              </div>

              {/* Slot cells */}
              {finalTimeSlots.map((time) => {
                const status = getStatus(court, time);
                const label = getSlotLabel(status);
                const tooltipTitle = `${court} · ${time} — ${
                  status === 'booked' ? 'Đã được đặt'
                  : status === 'locked' ? 'Đang được giữ tạm'
                  : status === 'selected' ? 'Đang chọn'
                  : 'Còn trống, nhấn để chọn'
                }`;

                return (
                  <Tooltip key={`${court}-${time}`} title={tooltipTitle} mouseEnterDelay={0.3}>
                    <button
                      type="button"
                      style={getSlotStyle(status)}
                      onClick={() => toggleSlot(court, time)}
                      aria-label={tooltipTitle}
                      onMouseEnter={(e) => {
                        if (status === 'available') {
                          (e.currentTarget as HTMLElement).style.background = '#dcfce7';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (status === 'available') {
                          (e.currentTarget as HTMLElement).style.background = '#fff';
                        }
                      }}
                    >
                      {label}
                    </button>
                  </Tooltip>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer: Legend + Summary ────────────────────────── */}
      {!readOnly && (
        <div
        style={{
          marginTop: 16,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          padding: '14px 18px',
          background: '#f8fafc',
          borderRadius: 12,
          border: '1px solid #f1f5f9',
        }}
      >
        {/* Legend */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
          <LegendItem color="#fff" label="Còn trống" />
          <LegendItem color={BRAND.primary} label="Đang chọn" />
          <LegendItem color="#fef3c7" label="Đang giữ" />
          <LegendItem color="#fee2e2" label="Đã đặt" />
        </div>

        {/* Summary + CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {selectedSlots.length > 0 && (
            <div style={{ textAlign: 'right' }}>
              <Text style={{ fontSize: 13, color: '#64748b' }}>
                Đã chọn{' '}
                <strong style={{ color: BRAND.text }}>
                  {selectedSlots.length}
                </strong>{' '}
                slot
              </Text>
              <div style={{ fontSize: 15, fontWeight: 700, color: BRAND.primary }}>
                {totalPrice.toLocaleString('vi-VN')}đ
              </div>
            </div>
          )}
          <Badge count={selectedSlots.length} showZero={false} color={BRAND.primary}>
            <Button
              type="primary"
              size="large"
              icon={<ShoppingCartOutlined />}
              disabled={selectedSlots.length === 0}
              onClick={handleConfirmBooking}
              style={{ fontWeight: 700 }}
            >
              Đặt sân
            </Button>
          </Badge>
        </div>
      </div>
      )}
    </div>
  );
};

export default BookingGrid;
