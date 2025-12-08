import React, { useState } from 'react';
import { Header } from './components/Header';
import { Toolbar } from './components/Toolbar';
import { Dashboard } from './components/Dashboard';
import { SearchBar } from './components/SearchBar';
import { MemberTable } from './components/MemberTable';
import { Toast } from './components/Toast';
import { ProfileModal } from './components/ProfileModal';
import { OCRModal } from './components/OCRModal';
import { SettingsModal } from './components/SettingsModal';
import { BossHealthPanel } from './components/BossHealthPanel';
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
    toggleDeadBoss,
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
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

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

  const handleOCRResult = (bossIndex: number, value: number, plays?: number) => {
    if (ocrMemberIndex >= 0 && ocrMemberIndex < state.members.length) {
      const member = state.members[ocrMemberIndex];
      const newD = [...(member.d || [0, 0, 0, 0])];
      const newV = [...member.v];

      if (bossIndex >= 0) {
        newD[bossIndex] = value;
        if (typeof plays === 'number') {
          newV[bossIndex] = plays;
        }
        updateMember(ocrMemberIndex, { d: newD, v: newV });
      } else {
        updateMemberValue(ocrMemberIndex, bossIndex, value);
      }
      showToast(t('toast_saved'), 'success');
    } else {
      // OCR from toolbar - just show the result, user can manually enter
      const playsText = typeof plays === 'number' ? `, Plays: ${plays}` : '';
      showToast(`Detected: ${value.toLocaleString()}${playsText}`, 'info');
    }
    setOcrModalOpen(false);
  };

  const handleOCRBulkResults = (
    bossIndex: number,
    entries: { name: string; damage: number; plays?: number }[]
  ) => {
    const members = [...state.members];
    let updated = 0;
    const skipped: string[] = [];

    entries.forEach((entry) => {
      const idx = members.findIndex(
        (m) => m.name.trim().toLowerCase() === entry.name.trim().toLowerCase()
      );

      if (idx === -1) {
        skipped.push(entry.name.trim());
        return;
      }

      const member = members[idx];
      const newD = [...(member.d || [0, 0, 0, 0])];
      const newV = [...member.v];
      if (bossIndex >= 0) {
        newD[bossIndex] = entry.damage;
        if (typeof entry.plays === 'number') {
          newV[bossIndex] = entry.plays;
        }
        members[idx] = { ...member, d: newD, v: newV };
        updated += 1;
      } else {
        members[idx] = { ...member, v2: entry.damage };
        updated += 1;
      }
    });

    if (updated > 0) {
      updateState({ members });
      showToast(`Updated ${updated} member${updated > 1 ? 's' : ''} from scan`, 'success');
    } else {
      showToast('No matching members found to update', 'info');
    }

    if (skipped.length) {
      console.info('Skipped unknown members from OCR:', skipped.join(', '));
    }

    setOcrModalOpen(false);
  };

  const handleBulkAddMembers = (names: string[]) => {
    names.forEach((name) => {
      if (name.trim()) {
        addMember(name.trim());
      }
    });
    showToast(`Added ${names.length} members`, 'success');
  };

  const handleUpdateConfig = (config: Partial<typeof state.config>) => {
    updateState({ config: { ...state.config, ...config } });
    showToast(t('toast_saved'), 'success');
  };

  const handleUpdateDays = (days: Partial<Pick<typeof state, 'days1' | 'days2'>>) => {
    updateState({ ...days });
    showToast(t('toast_saved'), 'success');
  };

  const handleFactoryReset = () => {
    if (window.confirm('This will delete ALL data. Are you absolutely sure?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-kanso-bg dark:bg-kansoDark-bg">
      <Header 
        state={state} 
        onThemeToggle={toggleTheme} 
        onSettingsOpen={() => setSettingsModalOpen(true)}
        onUpdateState={updateState}
      />
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
      <div className="container mx-auto px-4 py-4 space-y-4">
        <MemberTable
          state={state}
          searchTerm={searchTerm}
          onUpdateValue={updateMemberValue}
          onSort={sortMembers}
          onDelete={handleDeleteMember}
          onRename={handleRename}
          onProfile={handleProfile}
          onToggleDeadBoss={toggleDeadBoss}
        />
        <BossHealthPanel state={state} />
        <Dashboard state={state} />
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
        onBulkResults={handleOCRBulkResults}
        state={state}
        memberIndex={ocrMemberIndex}
        bossIndex={ocrBossIndex}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        state={state}
        onUpdateConfig={handleUpdateConfig}
        onUpdateDays={handleUpdateDays}
        onUpdateLanguage={(lang) => updateState({ language: lang })}
        onBulkAddMembers={handleBulkAddMembers}
        onFactoryReset={handleFactoryReset}
      />
    </div>
  );
}

export default App;

