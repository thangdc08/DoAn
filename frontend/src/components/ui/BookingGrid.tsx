import React, { useMemo, useState, useEffect } from 'react';
import { Badge, Button, Tooltip, Typography } from 'antd';
import { ShoppingCartOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { courtNames, timeSlots } from '../../data/mockData';
import { useNotify } from '../../hooks/useNotify';
import { BRAND } from '../../theme/antdTheme';
import { venueApi } from '../../services/venueApi';
import { bookingApi } from '../../services/bookingApi';
import dayjs from 'dayjs';
import type { PriceRule } from '../../types/venue.types';
import { useQuery } from '@tanstack/react-query';

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
  /** Trạng thái đăng nhập */
  isAuthenticated?: boolean;
  venueId?: string;
  courts?: any[];
  selectedDate?: any;
  priceRules?: PriceRule[];
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
      return { ...base, background: '#fef3c7', color: '#d97706', cursor: 'pointer' };
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
    case 'locked': return 'Khóa';
    case 'selected': return '✓';
    default: return '';
  }
}

// Helper to calculate end time of 30-min slot
const getEndTime = (startTime: string): string => {
  const [hStr, mStr] = startTime.split(':');
  let h = parseInt(hStr);
  let m = parseInt(mStr);
  
  if (m === 30) {
    if (h === 23) {
      return '23:59';
    }
    return `${String(h + 1).padStart(2, '0')}:00`;
  } else {
    return `${String(h).padStart(2, '0')}:30`;
  }
};

// ─── Main component ─────────────────────────────────────────────────────

const BookingGrid: React.FC<BookingGridProps> = ({
  onSelectionChange,
  pricePerSlot,
  readOnly = false,
  courtNames: propsCourtNames,
  timeSlots: propsTimeSlots,
  isAdmin = false,
  isAuthenticated = false,
  venueId,
  courts,
  selectedDate,
  priceRules = [],
}) => {
  const navigate = useNavigate();
  const { confirm, success, notify } = useNotify();
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [lockedByAdmin, setLockedByAdmin] = useState<Set<string>>(new Set(LOCKED_SLOTS));

  // States for Admin API operations
  const [dbSlots, setDbSlots] = useState<{ [key: string]: { status: string; price: number } }>({});
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { data: venue } = useQuery({
    queryKey: ['venue', venueId],
    queryFn: () => venueApi.getVenueById(venueId || ''),
    enabled: !!venueId,
  });

  const finalCourtNames = propsCourtNames || (courts && courts.length > 0 ? courts.map(c => c.name) : courtNames);
  const finalTimeSlots = propsTimeSlots || timeSlots;

  const openTimeStr = venue?.openTime ? venue.openTime.substring(0, 5) : '05:00';
  const closeTimeStr = venue?.closeTime ? venue.closeTime.substring(0, 5) : '22:00';

  const filteredTimeSlots = useMemo(() => {
    return finalTimeSlots.filter(time => {
      return time >= openTimeStr && time < closeTimeStr;
    });
  }, [finalTimeSlots, openTimeStr, closeTimeStr]);

  const selectedDayOfWeek = selectedDate
    ? ((selectedDate.day() + 6) % 7) + 1
    : (((dayjs().day() + 6) % 7) + 1);

  const getHourlyPriceByRule = (time: string, courtId?: string) => {
    const slotStart = `${time}:00`;
    const exactCourtRule = courtId
      ? priceRules.find((rule) =>
          rule.status === 'ACTIVE' &&
          rule.dayOfWeek === selectedDayOfWeek &&
          rule.courtId === courtId &&
          slotStart >= rule.startTime &&
          slotStart < rule.endTime
        )
      : undefined;

    if (exactCourtRule) return exactCourtRule.pricePerHour;

    const venueRule = priceRules.find((rule) =>
      rule.status === 'ACTIVE' &&
      rule.dayOfWeek === selectedDayOfWeek &&
      !rule.courtId &&
      slotStart >= rule.startTime &&
      slotStart < rule.endTime
    );
    return venueRule?.pricePerHour;
  };

  const getSlotPrice = (courtName: string, time: string) => {
    const courtObj = courts?.find(c => c.name === courtName);
    const selectionId = courtObj ? `${courtObj.id}_${time}` : '';
    const slotDetail = selectionId ? dbSlots[selectionId] : undefined;
    if (slotDetail?.price !== undefined) return slotDetail.price;

    const hourlyRulePrice = getHourlyPriceByRule(time, courtObj?.id);
    if (hourlyRulePrice !== undefined) return hourlyRulePrice / 2;

    const hourlyDefault = courtObj?.defaultPrice ?? pricePerSlot ?? 80000;
    return hourlyDefault / 2;
  };

  const displayPriceByTime = useMemo(() => {
    const firstActiveCourt = courts?.find(c => c.status !== 'INACTIVE');
    return filteredTimeSlots.map((time) => {
      if (firstActiveCourt?.id) {
        const slotDetail = dbSlots[`${firstActiveCourt.id}_${time}`];
        if (slotDetail?.price !== undefined) return slotDetail.price;
      }

      const hourlyRulePrice = getHourlyPriceByRule(time, firstActiveCourt?.id);
      if (hourlyRulePrice !== undefined) return hourlyRulePrice / 2;

      const hourlyDefault = firstActiveCourt?.defaultPrice ?? pricePerSlot ?? 80000;
      return hourlyDefault / 2;
    });
  }, [courts, dbSlots, filteredTimeSlots, pricePerSlot, priceRules, selectedDayOfWeek]);

  const totalPrice = useMemo(() => {
    if (selectedSlots.length === 0) return 0;
    return selectedSlots.reduce((sum, key) => {
      const slot = dbSlots[key];
      if (slot?.price !== undefined) {
        return sum + slot.price;
      }
      // Fallback: use price rules first, then default court price.
      const [courtId, time] = key.split('_');
      const hourlyRulePrice = getHourlyPriceByRule(time, courtId);
      if (hourlyRulePrice !== undefined) {
        return sum + (hourlyRulePrice / 2);
      }
      const court = courts?.find(c => c.id === courtId);
      const hourlyPrice = court?.defaultPrice || 80000;
      return sum + (hourlyPrice / 2);
    }, 0);
  }, [selectedSlots, dbSlots, courts, priceRules, selectedDayOfWeek]);

  // Fetch slots data from DB for BOTH Admin and User modes
  useEffect(() => {
    if (venueId && courts && courts.length > 0 && selectedDate) {
      const fetchAllAvailabilities = async () => {
        setLoading(true);
        try {
          const dateStr = selectedDate.format('YYYY-MM-DD');
          const results = await Promise.all(
            courts.map(async (court) => {
              // Skip API call for maintenance or inactive courts
              if (court.status === 'INACTIVE' || court.status === 'MAINTENANCE') {
                return { courtId: court.id, slots: [], activeLocks: [] };
              }
              const [slots, activeLocks] = await Promise.all([
                venueApi.getCourtAvailability(venueId, court.id, dateStr),
                bookingApi.getActiveLocks({ courtId: court.id, date: dateStr }),
              ]);
              return { courtId: court.id, slots, activeLocks };
            })
          );

          const newMap: { [key: string]: { status: string; price: number } } = {};
          results.forEach(({ courtId, slots, activeLocks = [] }) => {
            slots.forEach((slot: any) => {
              const [h, m] = slot.startTime.split(':');
              const timeKey = `${h.padStart(2, '0')}:${m.padStart(2, '0')}`;
              const courtDefaultPrice = courts.find((court) => court.id === courtId)?.defaultPrice ?? 80000;
              newMap[`${courtId}_${timeKey}`] = {
                status: slot.status,
                price: slot.price ?? (courtDefaultPrice / 2),
              };
            });
            activeLocks.forEach((lock: any) => {
              const timeKey = dayjs(lock.startTime).format('HH:mm');
              const key = `${courtId}_${timeKey}`;
              const courtDefaultPrice = courts.find((court) => court.id === courtId)?.defaultPrice ?? 80000;
              newMap[key] = {
                ...(newMap[key] || { price: courtDefaultPrice / 2 }),
                status: lock.status === 'BOOKED' ? 'BOOKED' : 'LOCKED',
              };
            });
          });
          setDbSlots(newMap);
          setSelectedSlots((prev) => {
            const next = prev.filter((slotKey) => !['LOCKED', 'BOOKED'].includes(newMap[slotKey]?.status));
            if (next.length !== prev.length) onSelectionChange?.(next);
            return next;
          });
        } catch (error) {
          console.error("Failed to fetch slots availability:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchAllAvailabilities();
    }
  }, [venueId, courts, selectedDate, refreshTrigger]);

  const getStatus = (courtName: string, time: string): SlotStatus => {
    // Check if slot time is in the past
    if (selectedDate) {
      const dateStr = selectedDate.format('YYYY-MM-DD');
      const slotDateTime = dayjs(`${dateStr}T${time}:00`);
      if (slotDateTime.isBefore(dayjs())) {
        return 'locked';
      }
    }

    if (courts && courts.length > 0) {
      const courtObj = courts.find(c => c.name === courtName);
      if (courtObj) {
        // If court is undergoing maintenance or inactive, lock all its slots
        if (courtObj.status === 'MAINTENANCE' || courtObj.status === 'INACTIVE') {
          return 'locked';
        }

        const selectionId = `${courtObj.id}_${time}`;
        if (selectedSlots.includes(selectionId)) return 'selected';
        
        const dbStatus = dbSlots[selectionId]?.status;
        if (dbStatus === 'BOOKED') return 'booked';
        if (dbStatus === 'LOCKED') return 'locked';
        return 'available';
      }
    }

    const id = `${courtName}-${time}`;
    if (BOOKED_SLOTS.has(id)) return 'booked';
    if (lockedByAdmin.has(id)) return 'locked';
    if (selectedSlots.includes(id)) return 'selected';
    return 'available';
  };

  const toggleSlot = (courtName: string, time: string) => {
    if (readOnly && !isAdmin) return;

    // Check if slot time is in the past
    if (selectedDate) {
      const dateStr = selectedDate.format('YYYY-MM-DD');
      const slotDateTime = dayjs(`${dateStr}T${time}:00`);
      if (slotDateTime.isBefore(dayjs()) && !isAdmin) {
        notify('error', 'Không thể chọn slot này', 'Khung giờ này đã trôi qua.');
        return;
      }
    }

    if (courts && courts.length > 0) {
      const courtObj = courts.find(c => c.name === courtName);
      if (!courtObj) return;

      if (courtObj.status === 'MAINTENANCE' || courtObj.status === 'INACTIVE') {
        notify('warning', 'Không thể chọn slot', `Sân ${courtName} hiện tại đang bảo trì hoặc ngừng hoạt động.`);
        return;
      }
      
      const key = `${courtObj.id}_${time}`;
      const dbStatus = dbSlots[key]?.status;
      
      if (dbStatus === 'BOOKED') {
        notify('error', 'Không thể chọn slot này', `Sân ${courtName} lúc ${time} đã có khách đặt lịch.`);
        return;
      }
      if (dbStatus === 'LOCKED' && !isAdmin) {
        notify('error', 'Không thể chọn slot này', `Sân ${courtName} lúc ${time} đã bị khóa.`);
        return;
      }

      setSelectedSlots((prev) => {
        const next = prev.includes(key)
          ? prev.filter((s) => s !== key)
          : [...prev, key];
        onSelectionChange?.(next);
        return next;
      });
      return;
    }

    const id = `${courtName}-${time}`;
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
    if (selectedSlots.length === 0 || !venueId) return;

    // Check authentication first
    if (!isAuthenticated) {
      notify('error', 'Yêu cầu đăng nhập', 'Vui lòng đăng nhập để đặt sân.');
      navigate('/login');
      return;
    }

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
            Slot sẽ được giữ trong 15 phút để bạn hoàn tất thanh toán.
          </p>
        </div>
      ),
      okText: 'Đặt sân',
      onOk: async () => {
        setLoading(true);
        try {
          // Group selected slots by courtId
          const slotsByCourt: { [courtId: string]: { startTime: string; endTime: string }[] } = {};
          selectedSlots.forEach((slotKey) => {
            const [courtId, startTime] = slotKey.split('_');
            const endTime = getEndTime(startTime);
            if (!slotsByCourt[courtId]) {
              slotsByCourt[courtId] = [];
            }

            // Format to LocalDateTime ISO format (YYYY-MM-DDTHH:mm:00)
            const dateStr = selectedDate.format('YYYY-MM-DD');
            const startIso = `${dateStr}T${startTime}:00`;
            const endIso = `${dateStr}T${endTime}:00`;
            slotsByCourt[courtId].push({ startTime: startIso, endTime: endIso });
          });

          // Call lock API for each court in parallel
          const lockPromises = Object.entries(slotsByCourt).map(([courtId, slots]) =>
            bookingApi.lockSlots({
              venueId,
              courtId,
              slots,
            })
          );
          const lockResponses = await Promise.all(lockPromises);
          const allLockIds = lockResponses.flatMap((res) => res.lockIds);

          success(`Chọn sân thành công! Đang chuyển đến trang thanh toán...`);
          setSelectedSlots([]);
          onSelectionChange?.([]);

          // Redirect to checkout with lockIds
          navigate(`/checkout?lockIds=${allLockIds.join(',')}`);
        } catch (error: any) {
          console.error("Lock slots failed:", error);
          notify('error', 'Lỗi đặt sân', error.response?.data?.message || 'Không thể giữ chỗ sân lúc này. Vui lòng thử lại.');
          setDbSlots((prev) => {
            const next = { ...prev };
            selectedSlots.forEach((slotKey) => {
              next[slotKey] = {
                ...(next[slotKey] || { price: 0 }),
                status: 'LOCKED',
              };
            });
            return next;
          });
          setSelectedSlots([]);
          onSelectionChange?.([]);
          setRefreshTrigger(prev => prev + 1);
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleToggleLockBulk = async (shouldLock: boolean) => {
    if (selectedSlots.length === 0 || !venueId) return;

    confirm({
      title: shouldLock ? 'Xác nhận Khóa sân' : 'Xác nhận Mở khóa sân',
      content: `Bạn có chắc chắn muốn ${shouldLock ? 'KHÓA' : 'MỞ KHÓA'} ${selectedSlots.length} slot đã chọn?`,
      okText: 'Xác nhận',
      onOk: async () => {
        try {
          const dateStr = selectedDate.format('YYYY-MM-DD');
          
          await Promise.all(
            selectedSlots.map(async (slotKey) => {
              const [courtId, time] = slotKey.split('_');
              return venueApi.toggleSlotLock(venueId, courtId, {
                slotDate: dateStr,
                startTime: time,
                endTime: getEndTime(time),
                lock: shouldLock
              });
            })
          );

          success(`${shouldLock ? 'Khóa' : 'Mở khóa'} sân thành công!`);
          setSelectedSlots([]);
          setRefreshTrigger(prev => prev + 1);
        } catch (error: any) {
          console.error("Failed to toggle slot locks:", error);
          const errorMsg = error?.response?.data?.message || "Không thể thực hiện yêu cầu.";
          notify('error', 'Lỗi thực hiện', errorMsg);
        }
      }
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
            {filteredTimeSlots.map((time) => (
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
                padding: '8px 12px',
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
              Giá
            </div>
            {displayPriceByTime.map((slotPrice, idx) => (
              <div
                key={`price-${filteredTimeSlots[idx]}`}
                style={{
                  width: 48,
                  flexShrink: 0,
                  padding: '8px 2px',
                  textAlign: 'center',
                  fontSize: 9,
                  fontWeight: 700,
                  color: '#16a34a',
                  borderRight: '1px solid #f1f5f9',
                  lineHeight: 1.2,
                }}
                title={`${slotPrice.toLocaleString('vi-VN')}đ / slot 30 phút`}
              >
                {(slotPrice / 1000).toFixed(0)}k
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
              {filteredTimeSlots.map((time) => {
                const status = getStatus(court, time);
                const label = getSlotLabel(status);
                const price = getSlotPrice(court, time);
                const tooltipTitle = `${court} · ${time} · Giá: ${price.toLocaleString('vi-VN')}đ — ${
                  status === 'booked' ? 'Đã có khách đặt'
                  : status === 'locked' ? (isAdmin ? 'Đã khóa' : 'Đang được giữ tạm')
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
      {isAdmin ? (
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
            <LegendItem color="#fef3c7" label="Đã khóa" />
            <LegendItem color="#fee2e2" label="Đã đặt" />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {selectedSlots.length > 0 && (
              <span style={{ fontSize: 13, color: '#64748b', marginRight: 8 }}>
                Đã chọn <strong>{selectedSlots.length}</strong> slot
              </span>
            )}
            <Button
              type="primary"
              danger
              icon={<LockOutlined />}
              disabled={selectedSlots.length === 0 || loading}
              onClick={() => handleToggleLockBulk(true)}
              style={{ fontWeight: 700, borderRadius: 8 }}
            >
              Khóa sân
            </Button>
            <Button
              type="default"
              icon={<UnlockOutlined />}
              disabled={selectedSlots.length === 0 || loading}
              onClick={() => handleToggleLockBulk(false)}
              style={{ fontWeight: 700, borderRadius: 8, borderColor: BRAND.primary, color: BRAND.primary }}
            >
              Mở khóa sân
            </Button>
          </div>
        </div>
      ) : (
        !readOnly && (
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
        )
      )}
    </div>
  );
};

export default BookingGrid;
