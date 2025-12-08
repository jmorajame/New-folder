import React from 'react';
import { AppState } from '../types';
import { useTranslations } from '../hooks/useTranslations';

interface ToolbarProps {
  state: Pick<AppState, 'page' | 'filter' | 'compact' | 'mode' | 'language'>;
  onPageChange: (page: 1 | 2) => void;
  onFilterChange: (filter: 'all' | 'risk') => void;
  onCompactToggle: () => void;
  onModeToggle: () => void;
  onScan: () => void;
  onImport: () => void;
  onExport: () => void;
  onReset: () => void;
  onUndo: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  state,
  onPageChange,
  onFilterChange,
  onCompactToggle,
  onModeToggle,
  onScan,
  onImport,
  onExport,
  onReset,
  onUndo,
}) => {
  const { t } = useTranslations(state);

  return (
    <div className="toolbar flex items-center gap-2 px-4 py-3 overflow-x-auto bg-kanso-surface dark:bg-kansoDark-surface border-b border-kanso-border dark:border-kansoDark-border">
      <button
        className={`tool-btn ${state.page === 1 ? 'active' : ''}`}
        onClick={() => onPageChange(1)}
      >
        {t('tab_shadow')}
      </button>
      <button
        className={`tool-btn ${state.page === 2 ? 'active' : ''}`}
        onClick={() => onPageChange(2)}
      >
        {t('tab_god')}
      </button>
      
      <div className="divider"></div>
      <button
        className={`tool-btn ${state.mode === 'damage' ? 'active' : ''}`}
        onClick={onModeToggle}
        title={state.mode === 'damage' ? 'Damage mode (records damage numbers)' : 'Count mode (tracks attempts)'}
      >
        <i className="fas fa-calculator"></i>
        {state.mode === 'damage' ? 'Damage Mode' : 'Count Mode'}
      </button>
      <button
        className={`tool-btn ${state.filter === 'risk' ? 'active' : ''}`}
        onClick={() => onFilterChange(state.filter === 'risk' ? 'all' : 'risk')}
      >
        <i className="fas fa-exclamation-triangle"></i> {t('btn_filter_risk')}
      </button>
      
      <div className="divider"></div>
      <button className="tool-btn" onClick={onImport}>
        <i className="fas fa-file-import"></i> {t('exp_restore')}
      </button>
      <button className="tool-btn btn-smart" onClick={onExport}>
        <i className="fas fa-share"></i> {t('exp_backup')}
      </button>
      <button className="tool-btn" onClick={onReset}>
        <i className="fas fa-redo"></i> {t('btn_reset')}
      </button>
    </div>
  );
};

