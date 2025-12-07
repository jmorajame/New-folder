import React, { useState, useEffect } from 'react';
import { Member, AppState } from '../types';
import { useTranslations } from '../hooks/useTranslations';
import { getMemberStats, calculateTier } from '../utils/memberStats';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ProfileModalProps {
  member: Member | null;
  memberIndex: number;
  state: Pick<AppState, 'page' | 'days1' | 'days2' | 'mode' | 'config' | 'language'>;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (index: number, updates: Partial<Member>) => void;
  onScanScore: (index: number, bossIndex: number) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  member,
  memberIndex,
  state,
  isOpen,
  onClose,
  onUpdate,
  onScanScore,
}) => {
  const { t } = useTranslations(state);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (member) {
      setNote(member.note || '');
    }
  }, [member]);

  if (!isOpen || !member) return null;

  const stats = getMemberStats(member, state);
  const tier = calculateTier(member, state);

  const handleSave = () => {
    onUpdate(memberIndex, { note: note.trim() || undefined });
    onClose();
  };

  const chartData = {
    labels: state.page === 1 
      ? ['Teo', 'Kyle', 'Yeonhee', 'Karma']
      : ['God'],
    datasets: [
      {
        label: state.mode === 'damage' ? 'Damage' : 'Attempts',
        data: state.page === 1
          ? state.mode === 'damage'
            ? member.d || [0, 0, 0, 0]
            : member.v
          : [member.v2],
        borderColor: '#CC6E43',
        backgroundColor: 'rgba(204, 110, 67, 0.1)',
        tension: 0.4,
      },
    ],
  };

  return (
    <div className={`modal-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-kanso-text dark:text-kansoDark-text">
            {member.name}
          </h2>
          <button
            onClick={onClose}
            className="text-kanso-muted hover:text-kanso-text dark:text-kansoDark-muted dark:hover:text-kansoDark-text"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="metric-card">
              <div className="metric-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <div>
                <div className="text-xs text-kanso-muted dark:text-kansoDark-muted">
                  {t('th_total')}
                </div>
                <div className="text-lg font-bold text-kanso-text dark:text-kansoDark-text">
                  {stats.total.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">
                <i className="fas fa-calculator"></i>
              </div>
              <div>
                <div className="text-xs text-kanso-muted dark:text-kansoDark-muted">
                  {t('profile_avg')}
                </div>
                <div className="text-lg font-bold text-kanso-text dark:text-kansoDark-text">
                  {stats.avg}
                </div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">
                <i className="fas fa-percentage"></i>
              </div>
              <div>
                <div className="text-xs text-kanso-muted dark:text-kansoDark-muted">
                  {t('profile_completion')}
                </div>
                <div className="text-lg font-bold text-kanso-text dark:text-kansoDark-text">
                  {stats.completion.toFixed(1)}%
                </div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">
                <i className="fas fa-trophy"></i>
              </div>
              <div>
                <div className="text-xs text-kanso-muted dark:text-kansoDark-muted">
                  Tier
                </div>
                <div className="text-lg font-bold">
                  {tier.label !== '-' ? (
                    <span className={`tier-badge ${tier.class}`}>{tier.label}</span>
                  ) : (
                    <span className="text-kanso-muted">-</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="glass-panel p-4">
            <h3 className="text-lg font-bold mb-4 text-kanso-text dark:text-kansoDark-text">
              Performance
            </h3>
            <div className="h-64">
              <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>

          {/* Note Section */}
          <div>
            <label className="block text-sm font-medium text-kanso-text dark:text-kansoDark-text mb-2">
              <i className="fas fa-sticky-note mr-2"></i>
              Notes
            </label>
            <textarea
              className="w-full p-3 rounded-lg bg-kanso-bg dark:bg-kansoDark-bg border border-kanso-border dark:border-kansoDark-border text-kanso-text dark:text-kansoDark-text focus:outline-none focus:ring-2 focus:ring-clay-500"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add notes about this member..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              className="flex-1 px-4 py-2 bg-clay-500 hover:bg-clay-600 text-white rounded-lg transition-colors"
              onClick={handleSave}
            >
              <i className="fas fa-save mr-2"></i>
              {t('btn_save_details')}
            </button>
            {state.page === 1 && (
              <button
                className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors"
                onClick={() => {
                  // Will trigger OCR modal
                  onScanScore(memberIndex, 0);
                }}
              >
                <i className="fas fa-camera mr-2"></i>
                {t('btn_scan_score')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

