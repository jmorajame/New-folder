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

  const topPerformers = BOSS_NAMES.map((_, bossIndex) => {
    const entries = state.members
      .map((m) => ({
        name: m.name,
        avg: m.d && m.d[bossIndex] ? m.d[bossIndex] / Math.max(1, m.v[bossIndex] || 0) : 0,
        dmg: m.d?.[bossIndex] || 0,
        plays: m.v[bossIndex] || 0,
      }))
      .filter((e) => e.dmg > 0 && e.plays > 0)
      .sort((a, b) => b.avg - a.avg)
      .slice(0, 5);
    return entries;
  });

  const maxHp = state.config.bossMaxHp || BOSS_MAX_HP;

  return (
    <div className="glass-panel p-6 mb-4 space-y-6">
      <div>
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

      <div>
        <h3 className="text-md font-bold mb-3 text-kanso-text dark:text-kansoDark-text">
          Top 5 Damage per Attempt (by Boss)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {BOSS_NAMES.map((name, i) => (
            <div key={name} className="rounded-xl border border-kanso-border dark:border-kansoDark-border bg-kanso-bg dark:bg-kansoDark-bg p-3 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <img src={BOSS_IMAGES[i] ?? BOSS_IMAGES[0]} alt={name} className="w-8 h-8 rounded-lg object-cover" />
                <div className="font-semibold text-sm text-kanso-text dark:text-kansoDark-text">{name}</div>
              </div>
              {topPerformers[i].length === 0 ? (
                <div className="text-xs text-kanso-muted dark:text-kansoDark-muted">No data yet</div>
              ) : (
                <ul className="space-y-2">
                  {topPerformers[i].map((entry, idx) => (
                    <li key={idx} className="flex items-center justify-between text-xs bg-white/40 dark:bg-black/10 rounded-lg px-2 py-1">
                      <div className="flex items-center gap-2 min-w-0">
                        {idx < 3 && (
                          <img
                            src={`/rank${idx + 1}.png`}
                            alt={`Rank ${idx + 1}`}
                            className="w-4 h-4 shrink-0"
                          />
                        )}
                        <span className="font-medium text-kanso-text dark:text-kansoDark-text truncate">
                          {entry.name}
                        </span>
                      </div>
                      <span className="text-right text-kanso-muted dark:text-kansoDark-muted ml-2">
                        {Math.round(entry.avg || 0).toLocaleString()} dmg/att | {entry.plays} plays
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
