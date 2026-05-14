export const DAY_MAP: Record<string, string> = {
  'MONDAY': 'Thứ 2',
  'TUESDAY': 'Thứ 3',
  'WEDNESDAY': 'Thứ 4',
  'THURSDAY': 'Thứ 5',
  'FRIDAY': 'Thứ 6',
  'SATURDAY': 'Thứ 7',
  'SUNDAY': 'Chủ nhật',
};

export const REVERSE_DAY_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(DAY_MAP).map(([en, vi]) => [vi, en])
);

export const DAYS_OF_WEEK = [
  'Thứ 2',
  'Thứ 3',
  'Thứ 4',
  'Thứ 5',
  'Thứ 6',
  'Thứ 7',
  'Chủ nhật',
];
