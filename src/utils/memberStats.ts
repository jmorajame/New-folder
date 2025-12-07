import { Member, MemberStats, Tier, AppState } from '../types';
import { BOSS_NAMES } from '../constants';

export function getMemberStats(
  member: Member,
  state: Pick<AppState, 'page' | 'days1' | 'days2' | 'mode'>
): MemberStats {
  let total = 0;
  let avg = 0;
  const days = state.page === 1 ? state.days1 : state.days2;
  const expectedPerDay = state.page === 1 ? 4 : 1;

  if (state.page === 1) {
    if (state.mode === 'damage') {
      total = (member.d || []).reduce((a, b) => a + b, 0);
    } else {
      total = member.v.reduce((a, b) => a + b, 0);
    }
  } else {
    total = member.v2;
  }

  avg = days > 0 ? total / days : 0;
  const expectedTotal = days * expectedPerDay;
  const completion = expectedTotal > 0 ? (total / expectedTotal) * 100 : 0;
  const isRisk = completion < 80;
  const isPerfect = completion >= 100;

  return {
    total,
    avg: Number(avg.toFixed(1)),
    isRisk,
    isPerfect,
    completion: Number(completion.toFixed(1)),
  };
}

export function calculateTier(
  member: Member,
  state: Pick<AppState, 'page' | 'mode' | 'config'>
): Tier {
  const stats = getMemberStats(member, state);
  const avgDmg = stats.avg;

  if (state.page === 2 || state.mode === 'count') {
    return { label: '-', class: 'tier-none' };
  }

  const { tiers } = state.config;
  if (avgDmg >= tiers.s) {
    return { label: 'S', class: 'tier-s' };
  } else if (avgDmg >= tiers.a) {
    return { label: 'A', class: 'tier-a' };
  } else if (avgDmg >= tiers.b) {
    return { label: 'B', class: 'tier-b' };
  } else if (avgDmg >= tiers.c) {
    return { label: 'C', class: 'tier-c' };
  } else if (avgDmg >= tiers.d) {
    return { label: 'D', class: 'tier-d' };
  } else {
    return { label: 'F', class: 'tier-f' };
  }
}

export function getTotalPossibleAttempts(
  state: Pick<AppState, 'page' | 'days1' | 'days2' | 'members' | 'deadBosses'>
): number {
  const days = state.page === 1 ? state.days1 : state.days2;
  const membersCount = state.members.length;
  const attemptsPerDay = state.page === 1 ? 4 : 1;

  if (state.page === 1) {
    let total = 0;
    BOSS_NAMES.forEach((_, i) => {
      if (!(state.deadBosses[1]?.[i] ?? false)) {
        total += days * membersCount;
      }
    });
    return total;
  } else {
    if (state.deadBosses[2]?.[0] ?? false) return 0;
    return days * membersCount;
  }
}

