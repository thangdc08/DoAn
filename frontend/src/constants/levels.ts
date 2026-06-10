/**
 * SINGLE SOURCE OF TRUTH cho trình độ cầu lông trong toàn hệ thống.
 * Cả backend (lưu DB) và frontend đều dùng chung các code này.
 *
 * Thứ tự từ thấp đến cao: Y → Y+ → TBY → TBY+ → TB- → TB → TB+ → TB++ → TBK
 */

export const LEVELS = [
  'Y',
  'Y+',
  'TBY',
  'TBY+',
  'TB-',
  'TB',
  'TB+',
  'TB++',
  'TBK',
] as const;

export type Level = (typeof LEVELS)[number];

/** Nhãn hiển thị đầy đủ cho từng cấp độ */
export const LEVEL_LABEL: Record<Level, string> = {
  'Y':    'Yếu',
  'Y+':   'Yếu+',
  'TBY':  'Trung bình yếu',
  'TBY+': 'Trung bình yếu+',
  'TB-':  'Trung bình-',
  'TB':   'Trung bình',
  'TB+':  'Trung bình+',
  'TB++': 'Trung bình++',
  'TBK':  'Trung bình khá',
};

/** Màu Ant Design Tag tương ứng với từng cấp */
export const LEVEL_COLOR: Record<Level, string> = {
  'Y':    'default',
  'Y+':   'default',
  'TBY':  'blue',
  'TBY+': 'blue',
  'TB-':  'cyan',
  'TB':   'green',
  'TB+':  'lime',
  'TB++': 'orange',
  'TBK':  'volcano',
};

/** Options cho Select / Checkbox của Ant Design */
export const LEVEL_OPTIONS: { value: string; label: string }[] = LEVELS.map((lv) => ({
  value: lv,
  label: lv,
}));

export function getLevelLabel(value: string | undefined | null): string {
  if (!value) return 'Chưa cập nhật';
  return LEVEL_LABEL[value as Level] ?? value;
}

/**
 * Trả về màu Ant Design Tag hoặc 'default' nếu không có trong bảng.
 */
export function getLevelColor(value: string | undefined | null): string {
  if (!value) return 'default';
  return LEVEL_COLOR[value as Level] ?? 'default';
}
