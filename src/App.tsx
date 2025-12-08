import React, { useRef, useState } from 'react';
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
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
    const exportPayload = {
      version: 1,
      generatedAt: new Date().toISOString(),
      data: {
        members: state.members,
        config: state.config,
        days1: state.days1,
        days2: state.days2,
        deadBosses: state.deadBosses,
        language: state.language,
        mode: state.mode,
        filter: state.filter,
      },
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bossguild-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast(t('toast_exported'), 'success');
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const data = parsed.data || parsed;

      const normalizeArray = (arr: unknown[] | undefined, length = 4) =>
        Array.from({ length }, (_, idx) => {
          const val = arr?.[idx];
          return typeof val === 'number' ? val : 0;
        });

      if (!data || !Array.isArray(data.members)) {
        throw new Error('Invalid backup format');
      }

      const members = data.members.map((m: any) => ({
        name: typeof m.name === 'string' ? m.name : 'Unknown',
        v: normalizeArray(m.v),
        v2: typeof m.v2 === 'number' ? m.v2 : 0,
        d: normalizeArray(m.d),
        note: typeof m.note === 'string' ? m.note : undefined,
        avatar: typeof m.avatar === 'string' ? m.avatar : undefined,
      }));

      const deadBosses =
        data.deadBosses && typeof data.deadBosses === 'object'
          ? {
              1: Array.isArray(data.deadBosses[1])
                ? data.deadBosses[1].map((v: any) => Boolean(v))
                : state.deadBosses[1],
              2: Array.isArray(data.deadBosses[2])
                ? data.deadBosses[2].map((v: any) => Boolean(v))
                : state.deadBosses[2],
            }
          : state.deadBosses;

      const language = data.language === 'en' || data.language === 'th' ? data.language : state.language;
      const mode = data.mode === 'damage' || data.mode === 'count' ? data.mode : state.mode;
      const filter = data.filter === 'risk' ? 'risk' : 'all';

      const tiers = data.config?.tiers || state.config.tiers;

      updateState({
        members,
        config: {
          ...state.config,
          ...(data.config || {}),
          tiers: {
            s: typeof tiers.s === 'number' ? tiers.s : state.config.tiers.s,
            a: typeof tiers.a === 'number' ? tiers.a : state.config.tiers.a,
            b: typeof tiers.b === 'number' ? tiers.b : state.config.tiers.b,
            c: typeof tiers.c === 'number' ? tiers.c : state.config.tiers.c,
            d: typeof tiers.d === 'number' ? tiers.d : state.config.tiers.d,
          },
        },
        days1: typeof data.days1 === 'number' ? data.days1 : state.days1,
        days2: typeof data.days2 === 'number' ? data.days2 : state.days2,
        deadBosses,
        language,
        mode,
        filter,
      });

      showToast(t('toast_imported'), 'success');
    } catch (error) {
      console.error('Failed to import backup', error);
      showToast(t('toast_import_failed'), 'error');
    } finally {
      event.target.value = '';
    }
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
      <input
        type="file"
        accept="application/json"
        ref={fileInputRef}
        onChange={handleImportFile}
        className="hidden"
      />
      <Dashboard state={state} />
      <SearchBar
        state={state}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddMember={handleAddMember}
      />
      <Toolbar
        state={state}
        onPageChange={(page) => updateState({ page })}
        onFilterChange={(filter) => updateState({ filter })}
        onCompactToggle={() => updateState({ compact: !state.compact })}
        onModeToggle={() => updateState({ mode: state.mode === 'count' ? 'damage' : 'count' })}
        onScan={handleScan}
        onImport={handleImportClick}
        onExport={handleExport}
        onReset={handleResetWeek}
        onUndo={handleUndo}
      />
      <div className="container mx-auto px-4 py-4">
        <BossHealthPanel state={state} />
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

