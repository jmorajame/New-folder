import React, { useState } from 'react';
import { Header } from './components/Header';
import { Toolbar } from './components/Toolbar';
import { Dashboard } from './components/Dashboard';
import { SearchBar } from './components/SearchBar';
import { MemberTable } from './components/MemberTable';
import { Toast } from './components/Toast';
import { useAppState } from './hooks/useAppState';
import { useTheme } from './hooks/useTheme';
import { useTranslations } from './hooks/useTranslations';
import './styles/index.css';

function App() {
  const {
    state,
    updateState,
    addMember,
    deleteMember,
    updateMemberValue,
    resetWeek,
    sortMembers,
  } = useAppState();
  
  const { toggleTheme } = useTheme();
  const { t } = useTranslations(state);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
  };

  const handleAddMember = (name: string) => {
    if (name.trim()) {
      addMember(name);
      showToast(t('toast_saved'), 'success');
    }
  };

  const handleDeleteMember = (index: number) => {
    if (window.confirm(t('confirm_delete'))) {
      deleteMember(index);
      showToast(t('toast_saved'), 'success');
    }
  };

  const handleResetWeek = () => {
    if (window.confirm(t('confirm_reset'))) {
      resetWeek();
      showToast(t('toast_reset'), 'success');
    }
  };

  const handleScan = () => {
    // TODO: Implement OCR scanning
    showToast('OCR feature coming soon', 'info');
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    showToast('Export feature coming soon', 'info');
  };

  const handleUndo = () => {
    // TODO: Implement undo functionality
    showToast('Undo feature coming soon', 'info');
  };

  const handleRename = (index: number) => {
    const newName = window.prompt(t('label_search'), state.members[index].name);
    if (newName && newName.trim()) {
      updateState({
        members: state.members.map((m, i) =>
          i === index ? { ...m, name: newName.trim() } : m
        ),
      });
      showToast(t('toast_saved'), 'success');
    }
  };

  const handleProfile = (index: number) => {
    // TODO: Open profile modal
    showToast('Profile feature coming soon', 'info');
  };

  return (
    <div className="min-h-screen bg-kanso-bg dark:bg-kansoDark-bg">
      <Header state={state} onThemeToggle={toggleTheme} />
      <Toolbar
        state={state}
        onPageChange={(page) => updateState({ page })}
        onFilterChange={(filter) => updateState({ filter })}
        onCompactToggle={() => updateState({ compact: !state.compact })}
        onModeToggle={() => updateState({ mode: state.mode === 'count' ? 'damage' : 'count' })}
        onScan={handleScan}
        onExport={handleExport}
        onReset={handleResetWeek}
        onUndo={handleUndo}
      />
      <SearchBar
        state={state}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddMember={handleAddMember}
      />
      <Dashboard state={state} />
      <div className="container mx-auto px-4 py-4">
        <MemberTable
          state={state}
          searchTerm={searchTerm}
          onUpdateValue={updateMemberValue}
          onSort={sortMembers}
          onDelete={handleDeleteMember}
          onRename={handleRename}
          onProfile={handleProfile}
        />
      </div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          show={!!toast}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default App;

