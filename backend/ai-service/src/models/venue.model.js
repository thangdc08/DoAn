export const DISTANCE_THRESHOLDS = [
  { maxKm: 2,  score: 100 },
  { maxKm: 5,  score: 70  },
  { maxKm: 10, score: 40  },
  { maxKm: Infinity, score: 10 },
];

export const SCORE_WEIGHTS = {
  distance:  0.30,
  level:     0.25,
  rating:    0.20,
  price:     0.15,
  history:   0.10,
};

export const DEFAULT_LEVEL = 'TB';
export const DEFAULT_LIMIT = 10;
export const MIN_SCORE_THRESHOLD = 50;
