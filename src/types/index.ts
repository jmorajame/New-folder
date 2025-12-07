export interface Member {
  name: string;
  v: number[]; // Attempts for each boss (page 1)
  v2: number; // Attempts for God of Destruction (page 2)
  d?: number[]; // Damage for each boss (page 1)
  note?: string;
  avatar?: string;
}

export interface AppState {
  page: 1 | 2;
  days1: number;
  days2: number;
  deadBosses: {
    1: boolean[];
    2: boolean[];
  };
  members: Member[];
  history: Member[][];
  archives: any[];
  historyIndex: number;
  filter: 'all' | 'risk';
  compact: boolean;
  soundEnabled: boolean;
  selectedMember: number | null;
  mode: 'count' | 'damage';
  sort: {
    key: 'name' | 'total' | 'boss' | null;
    order: 'asc' | 'desc';
    index: number;
  };
  config: {
    bossMaxHp: number;
    ocrKeywords: string;
    tiers: {
      s: number;
      a: number;
      b: number;
      c: number;
      d: number;
    };
  };
  goalReached: boolean;
  language: 'th' | 'en';
}

export interface BossInfo {
  name: string;
  image: string;
  maxHp: number;
}

export interface MemberStats {
  total: number;
  avg: number;
  isRisk: boolean;
  isPerfect: boolean;
  completion: number;
}

export interface Tier {
  label: string;
  class: string;
}

export interface Translation {
  [key: string]: string;
}

export interface Translations {
  th: Translation;
  en: Translation;
}

