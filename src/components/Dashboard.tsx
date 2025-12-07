import React, { useMemo } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import { AppState } from '../types';
import { useTranslations } from '../hooks/useTranslations';
import { getMemberStats, getTotalPossibleAttempts } from '../utils/memberStats';
import { BOSS_NAMES } from '../constants';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

interface DashboardProps {
  state: Pick<AppState, 'page' | 'days1' | 'days2' | 'members' | 'deadBosses' | 'mode' | 'language'>;
}

export const Dashboard: React.FC<DashboardProps> = ({ state }) => {
  const { t } = useTranslations(state);

  const analytics = useMemo(() => {
    const days = state.page === 1 ? state.days1 : state.days2;
    const totalPossible = getTotalPossibleAttempts(state);
    
    let grandTotal = 0;
    const bossTotals = [0, 0, 0, 0];
    const bossDamage = [0, 0, 0, 0];

    state.members.forEach((member) => {
      if (state.page === 1) {
        if (state.mode === 'damage') {
          const dmg = (member.d || [0, 0, 0, 0]).reduce((a, b) => a + b, 0);
          grandTotal += dmg;
          (member.d || [0, 0, 0, 0]).forEach((d, i) => {
            bossDamage[i] += d;
          });
        } else {
          const total = member.v.reduce((a, b) => a + b, 0);
          grandTotal += total;
          member.v.forEach((v, i) => {
            bossTotals[i] += v;
          });
        }
      } else {
        grandTotal += member.v2;
      }
    });

    const percent = totalPossible > 0 ? Math.round((grandTotal / totalPossible) * 100) : 0;
    const missingCount = Math.max(0, totalPossible - grandTotal);
    const dailyAvg = state.members.length > 0 ? (grandTotal / state.members.length) : 0;

    return {
      totalPossible,
      grandTotal,
      percent,
      missingCount,
      dailyAvg: Number(dailyAvg.toFixed(1)),
      bossTotals,
      bossDamage,
    };
  }, [state]);

  const chartData = useMemo(() => ({
    labels: [t('metric_done'), t('metric_left')],
    datasets: [
      {
        data: [analytics.grandTotal, Math.max(0, analytics.totalPossible - analytics.grandTotal)],
        backgroundColor: ['#D97706', '#E7E5E4'],
        borderWidth: 0,
      },
    ],
  }), [analytics, t]);

  const barChartData = useMemo(() => {
    if (state.page === 1) {
      return {
        labels: [...BOSS_NAMES] as string[],
        datasets: [
          {
            label: t('th_total'),
            data: state.mode === 'damage' ? analytics.bossDamage : analytics.bossTotals,
            backgroundColor: '#A8A29E',
          },
        ],
      };
    } else {
      return {
        labels: [t('tab_god')],
        datasets: [
          {
            label: t('th_total'),
            data: [analytics.grandTotal],
            backgroundColor: '#A8A29E',
          },
        ],
      };
    }
  }, [state, analytics, t]);

  return (
    <div className="dashboard p-4 space-y-4">
      <div className="glass-panel p-6">
        <h2 className="text-lg font-bold mb-4 text-kanso-text dark:text-kansoDark-text">
          {t('guild_progress')}
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="metric-card">
            <div className="metric-icon">
              <i className="fas fa-bullseye"></i>
            </div>
            <div>
              <div className="text-xs text-kanso-muted dark:text-kansoDark-muted">
                {t('metric_total_goal')}
              </div>
              <div className="text-lg font-bold text-kanso-text dark:text-kansoDark-text">
                {analytics.totalPossible.toLocaleString()}
              </div>
            </div>
          </div>
          
          <div className="metric-card metric-used">
            <div className="metric-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <div>
              <div className="text-xs text-kanso-muted dark:text-kansoDark-muted">
                {t('metric_done')}
              </div>
              <div className="text-lg font-bold value">
                {analytics.grandTotal.toLocaleString()}
              </div>
            </div>
          </div>
          
          <div className="metric-card metric-remain">
            <div className="metric-icon">
              <i className="fas fa-hourglass-half"></i>
            </div>
            <div>
              <div className="text-xs text-kanso-muted dark:text-kansoDark-muted">
                {t('metric_left')}
              </div>
              <div className="text-lg font-bold value">
                {Math.max(0, analytics.totalPossible - analytics.grandTotal).toLocaleString()}
              </div>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-icon">
              <i className="fas fa-chart-line"></i>
            </div>
            <div>
              <div className="text-xs text-kanso-muted dark:text-kansoDark-muted">
                {t('metric_daily_avg')}
              </div>
              <div className="text-lg font-bold text-kanso-text dark:text-kansoDark-text">
                {analytics.dailyAvg}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center mb-4">
          <div className="w-48 h-48">
            <Doughnut data={chartData} options={{ responsive: true, maintainAspectRatio: true }} />
          </div>
          <div className="ml-6">
            <div className="text-3xl font-bold text-kanso-text dark:text-kansoDark-text">
              {analytics.percent}%
            </div>
            <div className="text-sm text-kanso-muted dark:text-kansoDark-muted">
              {t('chart_percent')}
            </div>
          </div>
        </div>
      </div>

      <div className="glass-panel p-6">
        <h2 className="text-lg font-bold mb-4 text-kanso-text dark:text-kansoDark-text">
          {t('boss_breakdown')}
        </h2>
        <div className="h-64">
          <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>
    </div>
  );
};

