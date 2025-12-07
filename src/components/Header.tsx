import React from 'react';
import { useTranslations } from '../hooks/useTranslations';
import { AppState } from '../types';

interface HeaderProps {
  state: Pick<AppState, 'language' | 'soundEnabled' | 'compact'>;
  onThemeToggle: () => void;
  onSettingsOpen: () => void;
  onUpdateState: (updates: Partial<AppState>) => void;
}

export const Header: React.FC<HeaderProps> = ({ state, onThemeToggle, onSettingsOpen, onUpdateState }) => {
  const { t } = useTranslations(state);

  return (
    <header className="sticky top-0 z-50 bg-kanso-bg dark:bg-kansoDark-bg border-b border-kanso-border dark:border-kansoDark-border backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-kanso-text dark:text-kansoDark-text">
                LeaderSongSimelz
              </h1>
              <span className="px-2 py-1 bg-clay-500 text-white text-xs font-bold rounded">
                copy pasta
              </span>
            </div>
            <p className="text-sm text-kanso-muted dark:text-kansoDark-muted">
              Seven Knights Re:Birth | {t('app_subtitle')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onUpdateState({ soundEnabled: !state.soundEnabled })}
            className="tool-btn"
            aria-label="Toggle sound"
            title="Sound"
          >
            <i className={`fas fa-volume-${state.soundEnabled ? 'up' : 'mute'}`}></i>
          </button>
          <button
            onClick={() => onUpdateState({ compact: !state.compact })}
            className="tool-btn"
            aria-label="Toggle layout"
            title="Layout"
          >
            <i className="fas fa-th"></i>
          </button>
          <button
            onClick={onSettingsOpen}
            className="tool-btn"
            aria-label="Settings"
            title={t('modal_settings')}
          >
            <i className="fas fa-cog"></i>
          </button>
          <button
            onClick={onThemeToggle}
            className="tool-btn"
            aria-label="Toggle theme"
          >
            <i className="fas fa-moon dark:hidden"></i>
            <i className="fas fa-sun hidden dark:inline"></i>
          </button>
        </div>
      </div>
    </header>
  );
};

