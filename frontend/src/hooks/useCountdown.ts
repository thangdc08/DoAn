/**
 * useCountdown — đếm ngược từ `seconds` khi `active = true`.
 * Reset về giá trị ban đầu khi `active` chuyển sang false.
 *
 * @example
 * const { display, urgent } = useCountdown(600, hasSelectedSlots);
 * // display = "09:58", urgent = true khi còn < 2 phút
 */
import { useEffect, useState } from 'react';

export interface CountdownResult {
  /** Chuỗi hiển thị dạng "MM:SS" */
  display: string;
  /** true khi còn ít hơn 2 phút */
  urgent: boolean;
  /** Số giây còn lại */
  remaining: number;
}

export function useCountdown(totalSeconds: number, active: boolean): CountdownResult {
  const [remaining, setRemaining] = useState(totalSeconds);

  useEffect(() => {
    if (!active) {
      setRemaining(totalSeconds);
      return;
    }
    if (remaining <= 0) return;

    const timer = setInterval(() => {
      setRemaining((s) => Math.max(0, s - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [active, totalSeconds]); // eslint-disable-line react-hooks/exhaustive-deps

  const mm = String(Math.floor(remaining / 60)).padStart(2, '0');
  const ss = String(remaining % 60).padStart(2, '0');

  return {
    display: `${mm}:${ss}`,
    urgent: remaining < 120,
    remaining,
  };
}
