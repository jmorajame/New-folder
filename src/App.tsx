import React, { useState } from 'react';
import { Header } from './components/Header';
import { Toolbar } from './components/Toolbar';
import { Dashboard } from './components/Dashboard';
import { SearchBar } from './components/SearchBar';
import { MemberTable } from './components/MemberTable';
import { Toast } from './components/Toast';
import { ProfileModal } from './components/ProfileModal';
import { OCRModal } from './components/OCRModal';
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
    updateMember,
  } = useAppState();
  
  const { toggleTheme } = useTheme();
  const { t } = useTranslations(state);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [selectedMemberIndex, setSelectedMemberIndex] = useState(-1);
  const [ocrModalOpen, setOcrModalOpen] = useState(false);
  const [ocrBossIndex, setOcrBossIndex] = useState(0);
  const [ocrMemberIndex, setOcrMemberIndex] = useState(-1);

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
    setOcrBossIndex(0);
    setOcrMemberIndex(-1);
    setOcrModalOpen(true);
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
    setSelectedMemberIndex(index);
    setProfileModalOpen(true);
  };

  const handleScanScore = (memberIndex: number, bossIndex: number) => {
    setOcrMemberIndex(memberIndex);
    setOcrBossIndex(bossIndex);
    setOcrModalOpen(true);
  };

  const handleOCRResult = (bossIndex: number, value: number) => {
    if (ocrMemberIndex >= 0 && ocrMemberIndex < state.members.length) {
      updateMemberValue(ocrMemberIndex, bossIndex, value);
      showToast(t('toast_saved'), 'success');
    } else {
      // OCR from toolbar - just show the result, user can manually enter
      showToast(`Detected: ${value.toLocaleString()}`, 'info');
    }
    setOcrModalOpen(false);
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

      {/* Profile Modal */}
      {selectedMemberIndex >= 0 && state.members[selectedMemberIndex] && (
        <ProfileModal
          member={state.members[selectedMemberIndex]}
          memberIndex={selectedMemberIndex}
          state={state}
          isOpen={profileModalOpen}
          onClose={() => {
            setProfileModalOpen(false);
            setSelectedMemberIndex(-1);
          }}
          onUpdate={updateMember}
          onScanScore={handleScanScore}
        />
      )}

      {/* OCR Modal */}
      <OCRModal
        isOpen={ocrModalOpen}
        onClose={() => {
          setOcrModalOpen(false);
          setOcrMemberIndex(-1);
        }}
        onResult={handleOCRResult}
        state={state}
        memberIndex={ocrMemberIndex}
        bossIndex={ocrBossIndex}
      />
    </div>
  );
}

export default App;

