import { BossInfo } from '../types';

export const CONFIG = {
  ONE_MILLION: 1_000_000,
  MAX_ARCHIVES: 10,
  DEFAULT_DAYS: 11,
  MAX_COUNT: 50,
  MIN_SCORE_THRESHOLD: 1000,
  DEBOUNCE_MS: 300,
  TOAST_DURATION: 3000,
  DEBUG: {
    OCR: true,
    RENDER: false,
  },
} as const;

export const BOSS_NAMES = ['Teo', 'Kyle', 'Yeonhee', 'Karma'] as const;

export const BOSS_IMAGES = [
  'Teo.png',
  'Kyle.png',
  'Yeonhee.png',
  'Karma.png',
  'God.png',
] as const;

export const BOSS_MAX_HP = 100_000_000;

export const BOSS_INFO: BossInfo[] = [
  { name: 'Teo', image: BOSS_IMAGES[0], maxHp: BOSS_MAX_HP },
  { name: 'Kyle', image: BOSS_IMAGES[1], maxHp: BOSS_MAX_HP },
  { name: 'Yeonhee', image: BOSS_IMAGES[2], maxHp: BOSS_MAX_HP },
  { name: 'Karma', image: BOSS_IMAGES[3], maxHp: BOSS_MAX_HP },
  { name: 'God of Destruction', image: BOSS_IMAGES[4], maxHp: BOSS_MAX_HP },
];

export const ICONS = ['⚔️', '🏹', '🔮', '🗡️', '🐉'] as const;

export const DEFAULT_STATE = {
  page: 1 as const,
  days1: 11,
  days2: 11,
  deadBosses: {
    1: [false, false, false, false],
    2: [false],
  },
  members: [],
  history: [],
  archives: [],
  historyIndex: -1,
  filter: 'all' as const,
  compact: false,
  soundEnabled: true,
  selectedMember: null,
  mode: 'count' as const,
  sort: {
    key: null,
    order: 'desc' as const,
    index: -1,
  },
  config: {
    bossMaxHp: BOSS_MAX_HP,
    ocrKeywords: "โจมตี, ครั้ง, ครั้ง, ที, อัปเดต, Attack, Times",
    tiers: {
      s: 1_500_000,
      a: 1_200_000,
      b: 1_000_000,
      c: 800_000,
      d: 500_000,
    },
  },
  goalReached: false,
  language: 'th' as const,
};

