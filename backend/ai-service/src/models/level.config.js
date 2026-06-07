const LEVEL_ORDER = ['Y+', 'Y', 'TBY+', 'TBY', 'TB+', 'TB', 'TB-', 'TBK'];
const LEVEL_TO_CATEGORY = {
  'Y+': 'ADVANCED',
  'Y':  'ADVANCED',
  'TBY+': 'INTERMEDIATE',
  'TBY':  'INTERMEDIATE',
  'TB+': 'INTERMEDIATE',
  'TB':  'BEGINNER',
  'TB-': 'BEGINNER',
  'TBK': 'BEGINNER',
};

export function getLevelIndex(level) {
  if (!level) return -1;
  const upper = level.toUpperCase();
  return LEVEL_ORDER.indexOf(upper);
}

export function getLevelDistance(a, b) {
  const idxA = getLevelIndex(a);
  const idxB = getLevelIndex(b);
  if (idxA === -1 || idxB === -1) return 99;
  return Math.abs(idxA - idxB);
}

export function getLevelScore(userLevel, targetLevel) {
  const dist = getLevelDistance(userLevel, targetLevel);
  if (dist === 0) return 100;
  if (dist === 1) return 70;
  if (dist === 2) return 40;
  return 10;
}

export { LEVEL_ORDER, LEVEL_TO_CATEGORY };
