export const TIME_SLOTS = [
  { value: 'SLOT_05_08', label: '05:00 - 08:00 (Sáng sớm)' },
  { value: 'SLOT_08_12', label: '08:00 - 12:00 (Sáng)' },
  { value: 'SLOT_12_14', label: '12:00 - 14:00 (Trưa)' },
  { value: 'SLOT_14_17', label: '14:00 - 17:00 (Chiều)' },
  { value: 'SLOT_17_20', label: '17:00 - 20:00 (Chiều tối)' },
  { value: 'SLOT_20_22', label: '20:00 - 22:00 (Tối)' },
];

export const TIME_MAP: Record<string, string> = Object.fromEntries(
  TIME_SLOTS.map(slot => [slot.value, slot.label])
);

/**
 * Hàm hỗ trợ lấy startTime và endTime từ key
 */
export const getTimeRangeByKey = (key: string) => {
  const mapping: Record<string, { start: string, end: string }> = {
    'SLOT_05_08': { start: '05:00:00', end: '08:00:00' },
    'SLOT_08_12': { start: '08:00:00', end: '12:00:00' },
    'SLOT_12_14': { start: '12:00:00', end: '14:00:00' },
    'SLOT_14_17': { start: '14:00:00', end: '17:00:00' },
    'SLOT_17_20': { start: '17:00:00', end: '20:00:00' },
    'SLOT_20_22': { start: '20:00:00', end: '22:00:00' },
  };
  return mapping[key] || { start: '00:00:00', end: '00:00:00' };
};

/**
 * Hàm tìm key dựa trên startTime và endTime (để map ngược từ API về Select)
 */
export const getTimeKeyByRange = (start: string, end: string) => {
  const s = start.substring(0, 5);
  const e = end.substring(0, 5);
  const range = `${s} - ${e}`;
  
  const found = TIME_SLOTS.find(slot => slot.label.startsWith(range));
  return found ? found.value : null;
};
