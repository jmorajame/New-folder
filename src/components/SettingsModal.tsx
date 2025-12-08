import React, { useState, useEffect } from 'react';
import { AppState } from '../types';
import { useTranslations } from '../hooks/useTranslations';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: AppState;
  onUpdateConfig: (config: Partial<AppState['config']>) => void;
  onUpdateDays: (days: Partial<Pick<AppState, 'days1' | 'days2'>>) => void;
  onUpdateLanguage: (lang: 'th' | 'en') => void;
  onBulkAddMembers: (names: string[]) => void;
  onFactoryReset: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  state,
  onUpdateConfig,
  onUpdateDays,
  onUpdateLanguage,
  onBulkAddMembers,
  onFactoryReset,
}) => {
  const { t } = useTranslations(state);
  const [bossMaxHp, setBossMaxHp] = useState(state.config.bossMaxHp.toString());
  const [ocrKeywords, setOcrKeywords] = useState(state.config.ocrKeywords);
  const [tiers, setTiers] = useState(state.config.tiers);
  const [bulkNames, setBulkNames] = useState('');
  const [discordWebhook, setDiscordWebhook] = useState('');
  const [days1, setDays1] = useState(state.days1.toString());
  const [days2, setDays2] = useState(state.days2.toString());

  useEffect(() => {
    if (isOpen) {
      setBossMaxHp(state.config.bossMaxHp.toString());
      setOcrKeywords(state.config.ocrKeywords);
      setTiers({ ...state.config.tiers });
      setBulkNames('');
      setDays1(state.days1.toString());
      setDays2(state.days2.toString());
    }
  }, [isOpen, state.config, state.days1, state.days2]);

  const handleSave = () => {
    onUpdateDays({
      days1: parseInt(days1) || state.days1,
      days2: parseInt(days2) || state.days2,
    });
    onUpdateConfig({
      bossMaxHp: parseInt(bossMaxHp) || 100_000_000,
      ocrKeywords,
      tiers,
    });
    onClose();
  };

  const handleBulkAdd = () => {
    const names = bulkNames
      .split('\n')
      .map((n) => n.trim())
      .filter((n) => n.length > 0);
    if (names.length > 0) {
      onBulkAddMembers(names);
      setBulkNames('');
      onClose();
    }
  };

  const handleFactoryReset = () => {
    if (window.confirm('Are you sure? This will delete ALL data permanently!')) {
      onFactoryReset();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`modal-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}>
      <div className="modal max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-kanso-text dark:text-kansoDark-text">
            <i className="fas fa-cog mr-2"></i>
            {t('modal_settings')}
          </h2>
          <button
            onClick={onClose}
            className="text-kanso-muted hover:text-kanso-text dark:text-kansoDark-muted dark:hover:text-kansoDark-text"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <div className="space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Language */}
          <div>
            <label className="block text-sm font-medium text-kanso-text dark:text-kansoDark-text mb-2">
              {t('setting_language')}
            </label>
            <select
              value={state.language}
              onChange={(e) => onUpdateLanguage(e.target.value as 'th' | 'en')}
              className="w-full p-3 rounded-lg bg-kanso-bg dark:bg-kansoDark-bg border border-kanso-border dark:border-kansoDark-border text-kanso-text dark:text-kansoDark-text focus:outline-none focus:ring-2 focus:ring-clay-500"
            >
              <option value="th">ไทย (Thai)</option>
              <option value="en">English</option>
            </select>
          </div>

          {/* Event Days */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-kanso-text dark:text-kansoDark-text mb-2">
                {t('setting_days_shadow') || 'Days for Shadow bosses'}
              </label>
              <input
                type="number"
                value={days1}
                onChange={(e) => setDays1(e.target.value)}
                className="w-full p-3 rounded-lg bg-kanso-bg dark:bg-kansoDark-bg border border-kanso-border dark:border-kansoDark-border text-kanso-text dark:text-kansoDark-text focus:outline-none focus:ring-2 focus:ring-clay-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-kanso-text dark:text-kansoDark-text mb-2">
                {t('setting_days_god') || 'Days for God boss'}
              </label>
              <input
                type="number"
                value={days2}
                onChange={(e) => setDays2(e.target.value)}
                className="w-full p-3 rounded-lg bg-kanso-bg dark:bg-kansoDark-bg border border-kanso-border dark:border-kansoDark-border text-kanso-text dark:text-kansoDark-text focus:outline-none focus:ring-2 focus:ring-clay-500 font-mono"
              />
            </div>
          </div>

          {/* Max Boss HP */}
          <div>
            <label className="block text-sm font-medium text-kanso-text dark:text-kansoDark-text mb-2">
              {t('setting_max_hp')}
            </label>
            <input
              type="number"
              value={bossMaxHp}
              onChange={(e) => setBossMaxHp(e.target.value)}
              className="w-full p-3 rounded-lg bg-kanso-bg dark:bg-kansoDark-bg border border-kanso-border dark:border-kansoDark-border text-kanso-text dark:text-kansoDark-text focus:outline-none focus:ring-2 focus:ring-clay-500 font-mono"
              placeholder="100000000"
            />
          </div>

          {/* Tier Thresholds */}
          <div>
            <label className="block text-sm font-medium text-kanso-text dark:text-kansoDark-text mb-2">
              {t('setting_tiers')}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {(['s', 'a', 'b', 'c', 'd'] as const).map((tier) => (
                <div key={tier}>
                  <label className="block text-xs text-kanso-muted dark:text-kansoDark-muted mb-1">
                    Tier {tier.toUpperCase()}
                  </label>
                  <input
                    type="number"
                    value={tiers[tier]}
                    onChange={(e) =>
                      setTiers({ ...tiers, [tier]: parseInt(e.target.value) || 0 })
                    }
                    className="w-full p-2 rounded-lg bg-kanso-bg dark:bg-kansoDark-bg border border-kanso-border dark:border-kansoDark-border text-kanso-text dark:text-kansoDark-text focus:outline-none focus:ring-2 focus:ring-clay-500 font-mono text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* OCR Keywords */}
          <div>
            <label className="block text-sm font-medium text-kanso-text dark:text-kansoDark-text mb-2">
              {t('setting_ocr')}
            </label>
            <input
              type="text"
              value={ocrKeywords}
              onChange={(e) => setOcrKeywords(e.target.value)}
              className="w-full p-3 rounded-lg bg-kanso-bg dark:bg-kansoDark-bg border border-kanso-border dark:border-kansoDark-border text-kanso-text dark:text-kansoDark-text focus:outline-none focus:ring-2 focus:ring-clay-500"
              placeholder="Attack, Times, ครั้ง, โจมตี"
            />
            <p className="text-xs text-kanso-muted dark:text-kansoDark-muted mt-1">
              Comma-separated keywords for OCR recognition
            </p>
          </div>

          {/* Discord Webhook */}
          <div>
            <label className="block text-sm font-medium text-kanso-text dark:text-kansoDark-text mb-2">
              {t('setting_discord')}
            </label>
            <input
              type="url"
              value={discordWebhook}
              onChange={(e) => setDiscordWebhook(e.target.value)}
              className="w-full p-3 rounded-lg bg-kanso-bg dark:bg-kansoDark-bg border border-kanso-border dark:border-kansoDark-border text-kanso-text dark:text-kansoDark-text focus:outline-none focus:ring-2 focus:ring-clay-500"
              placeholder="https://discord.com/api/webhooks/..."
            />
          </div>

          {/* Bulk Add Members */}
          <div>
            <label className="block text-sm font-medium text-kanso-text dark:text-kansoDark-text mb-2">
              {t('setting_bulk')}
            </label>
            <textarea
              value={bulkNames}
              onChange={(e) => setBulkNames(e.target.value)}
              rows={5}
              className="w-full p-3 rounded-lg bg-kanso-bg dark:bg-kansoDark-bg border border-kanso-border dark:border-kansoDark-border text-kanso-text dark:text-kansoDark-text focus:outline-none focus:ring-2 focus:ring-clay-500"
              placeholder="Member 1&#10;Member 2&#10;Member 3"
            />
            <button
              onClick={handleBulkAdd}
              className="mt-2 px-4 py-2 bg-clay-500 hover:bg-clay-600 text-white rounded-lg transition-colors"
            >
              <i className="fas fa-users mr-2"></i>
              {t('btn_import_names')}
            </button>
          </div>

          {/* Save Config */}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-clay-500 hover:bg-clay-600 text-white rounded-lg transition-colors"
            >
              <i className="fas fa-save mr-2"></i>
              {t('btn_save_config')}
            </button>
          </div>

          {/* Danger Zone */}
          <div className="border-t border-red-300 dark:border-red-700 pt-4">
            <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-3">
              <i className="fas fa-exclamation-triangle mr-2"></i>
              {t('danger_zone')}
            </h3>
            <button
              onClick={handleFactoryReset}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              <i className="fas fa-trash mr-2"></i>
              {t('btn_factory_reset')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

