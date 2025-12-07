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
              className={`hp-card p-4 rounded-xl border border-kanso-border dark:border-kansoDark-border ${
                isDead
                  ? 'opacity-50 grayscale bg-kanso-surface dark:bg-kansoDark-surface'
                  : 'bg-kanso-surface dark:bg-kansoDark-surface'
              }`}
            >
              <div className="flex flex-col items-center gap-3">
                {/* Avatar */}
                <div className="relative">
                  <img
                    src={BOSS_IMAGES[i] ?? BOSS_IMAGES[0]}
                    alt={name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-kanso-border dark:border-kansoDark-border shadow-lg"
                  />
                  {isDead && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                      <i className="fas fa-skull text-white text-xl"></i>
                    </div>
                  )}
                </div>
                
                {/* Name */}
                <span className="font-bold text-sm text-kanso-text dark:text-kansoDark-text">
                  {name}
                </span>
                
                {/* Progress Percentage */}
                <span className="text-lg font-bold text-kanso-text dark:text-kansoDark-text">
                  {percent.toFixed(1)}%
                </span>
                
                {/* Progress Bar */}
                <div className="w-full">
                  <div className="relative h-2 bg-kanso-bg dark:bg-kansoDark-bg rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full transition-all duration-300 rounded-full"
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
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

