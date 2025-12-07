import React from 'react';
import { AppState } from '../types';
import { BOSS_NAMES, BOSS_IMAGES, BOSS_MAX_HP } from '../constants';

interface BossHealthPanelProps {
  state: Pick<AppState, 'page' | 'members' | 'deadBosses' | 'mode' | 'config'>;
}

export const BossHealthPanel: React.FC<BossHealthPanelProps> = ({ state }) => {
  if (state.page !== 1 || state.mode !== 'damage') return null;

  const bossDamage = [0, 0, 0, 0];
  state.members.forEach((member) => {
    (member.d || [0, 0, 0, 0]).forEach((dmg, i) => {
      bossDamage[i] += dmg;
    });
  });

  const maxHp = state.config.bossMaxHp || BOSS_MAX_HP;

  return (
    <div className="glass-panel p-6 mb-4">
      <h2 className="text-lg font-bold mb-4 text-kanso-text dark:text-kansoDark-text">
        Boss Health Status
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {BOSS_NAMES.map((name, i) => {
          const dmg = bossDamage[i];
          const percent = Math.min(100, (dmg / maxHp) * 100);
          const isDead = state.deadBosses[1]?.[i] ?? false;
          const barColor = percent >= 100 ? '#57534E' : '#D97706';

          return (
            <div
              key={i}
              className={`hp-card p-4 rounded-lg border ${
                isDead
                  ? 'opacity-50 grayscale bg-kanso-surface dark:bg-kansoDark-surface'
                  : 'bg-kanso-surface dark:bg-kansoDark-surface'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <img
                    src={BOSS_IMAGES[i] ?? BOSS_IMAGES[0]}
                    alt={name}
                    className="w-8 h-8 rounded-lg object-cover border border-stone-200 dark:border-stone-700"
                  />
                  <span className="font-bold text-sm text-kanso-text dark:text-kansoDark-text">
                    {name}
                  </span>
                </div>
                <span className="text-sm font-bold text-kanso-muted dark:text-kansoDark-muted">
                  {percent.toFixed(1)}%
                </span>
              </div>
              <div className="relative h-4 bg-kanso-bg dark:bg-kansoDark-bg rounded-full overflow-hidden mb-2">
                <div
                  className="h-full transition-all duration-300"
                  style={{
                    width: `${percent}%`,
                    background: barColor,
                  }}
                />
              </div>
              <div className="text-xs font-mono text-kanso-muted dark:text-kansoDark-muted text-center">
                {dmg.toLocaleString()} / {(maxHp / 1_000_000).toFixed(0)}M
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

