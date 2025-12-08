import React, { useState } from 'react';
import { AppState, Member } from '../types';
import { useTranslations } from '../hooks/useTranslations';
import { getMemberStats, calculateTier } from '../utils/memberStats';
import { parseNumericInput, highlightText } from '../utils';
import { BOSS_NAMES, BOSS_IMAGES } from '../constants';

interface MemberTableProps {
  state: Pick<AppState, 'page' | 'days1' | 'days2' | 'members' | 'deadBosses' | 'mode' | 'filter' | 'sort' | 'language'>;
  searchTerm: string;
  onUpdateValue: (memberIndex: number, bossIndex: number, value: number) => void;
  onSort: (key: 'name' | 'total' | 'boss', bossIndex?: number) => void;
  onDelete: (index: number) => void;
  onRename: (index: number) => void;
  onProfile: (index: number) => void;
  onToggleDeadBoss: (page: 1 | 2, bossIndex: number) => void;
}

export const MemberTable: React.FC<MemberTableProps> = ({
  state,
  searchTerm,
  onUpdateValue,
  onSort,
  onDelete,
  onRename,
  onProfile,
  onToggleDeadBoss,
}) => {
  const { t } = useTranslations(state);

  const filteredMembers = state.members.filter((member) => {
    if (searchTerm && !member.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (state.filter === 'risk') {
      const stats = getMemberStats(member, state);
      return stats.isRisk;
    }
    return true;
  });

  const getSortIcon = (key: 'name' | 'total' | 'boss', index: number = -1) => {
    if (state.sort.key === key && state.sort.index === index) {
      return state.sort.order === 'asc' ? (
        <i className="fas fa-sort-up text-kanso-muted"></i>
      ) : (
        <i className="fas fa-sort-down text-kanso-muted"></i>
      );
    }
    return <i className="fas fa-sort opacity-20 text-xs"></i>;
  };

  const handleInputChange = (memberIndex: number, bossIndex: number, value: string) => {
    const numValue = state.mode === 'damage' 
      ? parseNumericInput(value.replace(/,/g, ''))
      : parseNumericInput(value);
    onUpdateValue(memberIndex, bossIndex, numValue);
  };

  return (
    <div className="member-table overflow-x-auto max-h-[600px] overflow-y-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-kanso-surface dark:bg-kansoDark-surface">
            <th className="w-8 p-2"></th>
            <th
              className="p-3 text-left cursor-pointer select-none"
              onClick={() => onSort('name')}
            >
              {t('th_name')} {getSortIcon('name')}
            </th>
            {state.page === 1 ? (
              <>
                {BOSS_NAMES.map((name, i) => {
                  const isDead = state.deadBosses[1]?.[i] ?? false;
                  const imageSrc = BOSS_IMAGES[i] ?? BOSS_IMAGES[0];
                  return (
                    <th
                      key={i}
                      className="p-3 text-center cursor-pointer select-none"
                      onClick={() => onSort('boss', i)}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <img
                          src={imageSrc}
                          alt={name}
                          className={`w-12 h-12 rounded-xl object-cover border border-stone-200 dark:border-stone-700 ${
                            isDead ? 'opacity-50 grayscale' : ''
                          }`}
                        />
                        <span className={`text-xs font-bold ${isDead ? 'opacity-50' : ''}`}>
                          {name}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleDeadBoss(1, i);
                          }}
                          className={`text-xs px-2 py-1 rounded transition-colors ${
                            isDead
                              ? 'bg-red-500 text-white'
                              : 'bg-emerald-500 text-white hover:bg-emerald-600'
                          }`}
                        >
                          {isDead ? 'DEAD' : 'ALIVE'}
                        </button>
                        {getSortIcon('boss', i)}
                      </div>
                    </th>
                  );
                })}
              </>
            ) : (
              <th
                className="p-3 text-center cursor-pointer select-none"
                onClick={() => onSort('boss', 0)}
              >
                <div className="flex flex-col items-center gap-1">
                  <img
                    src={BOSS_IMAGES[4] ?? BOSS_IMAGES[0]}
                    alt="God"
                    className={`w-12 h-12 rounded-xl object-cover border border-stone-200 dark:border-stone-700 ${
                      state.deadBosses[2]?.[0] ? 'opacity-50 grayscale' : ''
                    }`}
                  />
                  <span
                    className={`text-xs font-bold ${
                      state.deadBosses[2]?.[0] ? 'opacity-50' : ''
                    }`}
                  >
                    {t('tab_god')}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleDeadBoss(2, 0);
                    }}
                    className={`text-xs px-2 py-1 rounded transition-colors ${
                      state.deadBosses[2]?.[0]
                        ? 'bg-red-500 text-white'
                        : 'bg-emerald-500 text-white hover:bg-emerald-600'
                    }`}
                  >
                    {state.deadBosses[2]?.[0] ? 'DEAD' : 'ALIVE'}
                  </button>
                  {getSortIcon('boss', 0)}
                </div>
              </th>
            )}
            <th
              className="p-3 text-center cursor-pointer select-none"
              onClick={() => onSort('total')}
            >
              {t('th_total')} {getSortIcon('total')}
            </th>
            <th className="p-3 text-center">{t('th_action')}</th>
          </tr>
        </thead>
        <tbody>
          {filteredMembers.length === 0 ? (
            <tr>
              <td colSpan={state.page === 1 ? 8 : 5} className="p-8 text-center">
                <div className="text-kanso-muted dark:text-kansoDark-muted">
                  <i className="fas fa-users text-4xl mb-4 opacity-30"></i>
                  <div className="text-lg font-bold">{t('empty_state_title')}</div>
                  <div className="text-sm">{t('empty_state_desc')}</div>
                </div>
              </td>
            </tr>
          ) : (
            filteredMembers.map((member, idx) => {
              const originalIndex = state.members.indexOf(member);
              const stats = getMemberStats(member, state);
              const tier = calculateTier(member, state);
              const rowClass = stats.isRisk
                ? 'status-risk bg-red-50 dark:bg-red-900/10'
                : stats.isPerfect
                ? 'status-god bg-emerald-50 dark:bg-emerald-900/10'
                : '';

              let totalDisplay = stats.total;
              if (state.page === 1 && state.mode === 'damage') {
                totalDisplay = (member.d || [0, 0, 0, 0]).reduce((a, b) => a + b, 0);
              }

              return (
                <tr key={originalIndex} className={rowClass}>
                  <td className="p-2 text-kanso-muted">
                    <i className="fas fa-grip-vertical cursor-grab"></i>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      {tier.label !== '-' && (
                        <span className={`tier-badge ${tier.class}`}>{tier.label}</span>
                      )}
                      <span
                        className="member-name font-medium cursor-pointer hover:text-clay-500"
                        onClick={() => onProfile(originalIndex)}
                        dangerouslySetInnerHTML={{
                          __html: highlightText(member.name, searchTerm),
                        }}
                      ></span>
                      <i
                        className="fas fa-pen text-kanso-muted hover:text-kanso-text cursor-pointer text-xs opacity-30 hover:opacity-100 transition-opacity"
                        onClick={() => onRename(originalIndex)}
                        title="Rename"
                      ></i>
                      {member.note && (
                        <i className="fas fa-sticky-note text-yellow-500 text-xs"></i>
                      )}
                    </div>
                  </td>
                  {state.page === 1 ? (
                    member.v.map((val, i) => {
                      const isDead = state.deadBosses[1]?.[i] ?? false;
                      const displayVal =
                        state.mode === 'damage'
                          ? (member.d?.[i] || 0).toLocaleString()
                          : val;
                      return (
                        <td
                          key={i}
                          className={`p-2 ${isDead ? 'opacity-50' : ''}`}
                        >
                          <input
                            type={state.mode === 'damage' ? 'text' : 'number'}
                            className="input-minimal"
                            value={displayVal}
                            onChange={(e) => handleInputChange(originalIndex, i, e.target.value)}
                            placeholder="0"
                          />
                        </td>
                      );
                    })
                  ) : (
                    <td className="p-2">
                      <input
                        type="number"
                        className="input-minimal"
                        value={member.v2}
                        onChange={(e) => {
                          const numValue = parseNumericInput(e.target.value);
                          onUpdateValue(originalIndex, -1, numValue);
                        }}
                        placeholder="0"
                      />
                    </td>
                  )}
                  <td className="p-3 text-center font-bold font-mono text-kanso-text dark:text-kansoDark-text">
                    {state.mode === 'damage' ? totalDisplay.toLocaleString() : totalDisplay}
                  </td>
                  <td className="p-3 text-center">
                    <i
                      className="fas fa-trash text-kanso-muted hover:text-red-400 cursor-pointer transition-colors"
                      onClick={() => onDelete(originalIndex)}
                    ></i>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
        <tfoot>
          <tr className="bg-kanso-surface dark:bg-kansoDark-surface font-bold">
            <td colSpan={2} className="p-3 text-right font-mono">
              {t('th_total')}
            </td>
            {state.page === 1 ? (
              <>
                {[0, 1, 2, 3].map((i) => {
                  const sum = state.members.reduce((acc, m) => {
                    if (state.mode === 'damage') {
                      return acc + (m.d?.[i] || 0);
                    }
                    return acc + m.v[i];
                  }, 0);
                  return (
                    <td key={i} className="p-3 text-center font-mono">
                      {state.mode === 'damage' ? sum.toLocaleString() : sum}
                    </td>
                  );
                })}
              </>
            ) : (
              <td className="p-3 text-center font-mono">
                {state.members.reduce((acc, m) => acc + m.v2, 0)}
              </td>
            )}
            <td className="p-3 text-center font-mono text-lg">
              {state.page === 1
                ? state.mode === 'damage'
                  ? state.members
                      .reduce(
                        (acc, m) =>
                          acc + (m.d || [0, 0, 0, 0]).reduce((a, b) => a + b, 0),
                        0
                      )
                      .toLocaleString()
                  : state.members.reduce(
                      (acc, m) => acc + m.v.reduce((a, b) => a + b, 0),
                      0
                    )
                : state.members.reduce((acc, m) => acc + m.v2, 0)}
            </td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

