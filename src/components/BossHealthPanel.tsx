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
          const maxHpLabel =
            maxHp >= 1_000_000 ? `${(maxHp / 1_000_000).toFixed(0)}M` : maxHp.toLocaleString();

          return (
            <div
              key={i}
              className={`hp-card p-4 rounded-2xl border transition-all duration-200 ${
                isDead ? 'is-dead' : ''
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative boss-avatar">
                    <img
                      src={BOSS_IMAGES[i] ?? BOSS_IMAGES[0]}
                      alt={name}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    {isDead && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/50">
                        <i className="fas fa-skull text-white text-sm"></i>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-kanso-text dark:text-kansoDark-text">
                      {name}
                    </div>
                    <div className="text-[11px] text-kanso-muted dark:text-kansoDark-muted">
                      Shadow Boss
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-kanso-text dark:text-kansoDark-text">
                    {percent.toFixed(1)}%
                  </div>
                  <div className="text-[11px] text-kanso-muted dark:text-kansoDark-muted">
                    Progress
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <div className="relative h-2 bg-kanso-bg dark:bg-[#262626] rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full boss-bar"
                    style={{
                      width: `${percent}%`,
                      background: barColor,
                    }}
                  />
                </div>
                <div className="text-[11px] font-mono text-kanso-muted dark:text-kansoDark-muted flex items-center justify-between">
                  <span>{dmg.toLocaleString()}</span>
                  <span>/ {maxHpLabel}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

