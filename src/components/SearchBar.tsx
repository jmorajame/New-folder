import React, { useState } from 'react';
import { useTranslations } from '../hooks/useTranslations';
import { AppState } from '../types';

interface SearchBarProps {
  state: Pick<AppState, 'language'>;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onAddMember: (name: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  state,
  searchTerm,
  onSearchChange,
  onAddMember,
}) => {
  const { t } = useTranslations(state);
  const [newMemberName, setNewMemberName] = useState('');

  const handleAddMember = () => {
    if (newMemberName.trim()) {
      onAddMember(newMemberName.trim());
      setNewMemberName('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddMember();
    }
  };

  return (
    <div className="search-bar p-4 bg-kanso-surface dark:bg-kansoDark-surface border-b border-kanso-border dark:border-kansoDark-border">
      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-kanso-muted dark:text-kansoDark-muted"></i>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-kanso-bg dark:bg-kansoDark-bg border border-kanso-border dark:border-kansoDark-border text-kanso-text dark:text-kansoDark-text focus:outline-none focus:ring-2 focus:ring-clay-500"
            placeholder={t('search')}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            className="px-4 py-2 rounded-lg bg-kanso-bg dark:bg-kansoDark-bg border border-kanso-border dark:border-kansoDark-border text-kanso-text dark:text-kansoDark-text focus:outline-none focus:ring-2 focus:ring-clay-500"
            placeholder={t('add_new_placeholder')}
            value={newMemberName}
            onChange={(e) => setNewMemberName(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            className="px-4 py-2 bg-clay-500 hover:bg-clay-600 text-white rounded-lg transition-colors"
            onClick={handleAddMember}
          >
            <i className="fas fa-plus mr-2"></i>
            {t('btn_add_member')}
          </button>
        </div>
      </div>
    </div>
  );
};

