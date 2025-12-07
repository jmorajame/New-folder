import React from 'react';
import { useTranslations } from '../hooks/useTranslations';
import { AppState } from '../types';

interface HeaderProps {
  state: Pick<AppState, 'language'>;
  onThemeToggle: () => void;
  onSettingsOpen: () => void;
}

export const Header: React.FC<HeaderProps> = ({ state, onThemeToggle, onSettingsOpen }) => {
  const { t } = useTranslations(state);

  return (
    <header className="sticky top-0 z-50 bg-kanso-bg dark:bg-kansoDark-bg border-b border-kanso-border dark:border-kansoDark-border backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-kanso-text dark:text-kansoDark-text">
            BossGuild
          </h1>
          <p className="text-sm text-kanso-muted dark:text-kansoDark-muted">
            {t('app_subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-4">
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

