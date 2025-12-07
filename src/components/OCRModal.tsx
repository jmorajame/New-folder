import React, { useState, useRef, useEffect } from 'react';
import { AppState } from '../types';
import { useTranslations } from '../hooks/useTranslations';
import { BOSS_NAMES, BOSS_IMAGES } from '../constants';
import { createWorker } from 'tesseract.js';

interface OCRModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResult: (bossIndex: number, value: number) => void;
  onBulkResults: (bossIndex: number, entries: { name: string; damage: number; plays?: number }[]) => void;
  state: Pick<AppState, 'page' | 'config' | 'language'>;
  memberIndex: number;
  bossIndex: number;
}

export const OCRModal: React.FC<OCRModalProps> = ({
  isOpen,
  onClose,
  onResult,
  onBulkResults,
  state,
  memberIndex,
  bossIndex,
}) => {
  const { t } = useTranslations(state);
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedBoss, setSelectedBoss] = useState(bossIndex);

  const parseEntries = (text: string) => {
    const lines = text
      .split(/\n+/)
      .map((l) => l.trim())
      .filter(Boolean);

    const entries: { name: string; damage: number; plays?: number }[] = [];
    for (let i = 0; i < lines.length; i++) {
      const scoreMatch = lines[i].match(/(\d{1,3}(?:[,\s]\d{3})+|\d{4,})/);
      if (!scoreMatch) continue;
      const damage = parseInt(scoreMatch[1].replace(/[,\s]/g, ''), 10);
      if (!damage || Number.isNaN(damage)) continue;

      const playsMatch =
        lines[i].match(/(\d+)\s*Play/i) || lines[i + 1]?.match(/(\d+)\s*Play/i);
      const nameLine = lines[i - 1] && !/\d/.test(lines[i - 1]) ? lines[i - 1] : lines[i - 2] || '';
      const name = nameLine || `Member ${entries.length + 1}`;

      entries.push({
        name,
        damage,
        plays: playsMatch ? parseInt(playsMatch[1], 10) : undefined,
      });
    }
    return entries;
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    setLoading(true);
    setStatus(t('ocr_status_init'));

    try {
      const worker = await createWorker('eng+tha');
      setStatus(t('ocr_status_recog'));

      const { data } = await worker.recognize(file);
      await worker.terminate();

      const text = data.text;
      const entries = parseEntries(text);
      if (entries.length > 1) {
        onBulkResults(selectedBoss, entries);
        setStatus(`Updated ${entries.length} members`);
        setTimeout(() => {
          handleClose();
        }, 800);
      } else {
        // fallback to single value detection
        const numbers = text.match(/\d{1,3}(?:[,\s]\d{3})*(?:\.\d+)?/g) || [];
        
        if (numbers.length > 0) {
          const largestNumber = numbers
            .map(n => parseFloat(n.replace(/[,\s]/g, '')))
            .reduce((a, b) => Math.max(a, b), 0);
          
          if (largestNumber > 0) {
            onResult(selectedBoss, Math.floor(largestNumber));
            setStatus(`Found: ${largestNumber.toLocaleString()}`);
            setTimeout(() => {
              onClose();
              setPreview(null);
              setStatus('');
              if (fileInputRef.current) {
                fileInputRef.current.value = '';
              }
            }, 1500);
          } else {
            setStatus('No valid number found');
          }
        } else {
          setStatus('No numbers detected');
        }
      }
    } catch (error) {
      console.error('OCR Error:', error);
      setStatus('Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPreview(null);
    setStatus('');
    setLoading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  // Handle paste from clipboard
  useEffect(() => {
    if (!isOpen) return;

    const handlePaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf('image') !== -1) {
          e.preventDefault();
          const blob = item.getAsFile();
          if (!blob) continue;

          // Show preview
          const reader = new FileReader();
          reader.onload = (e) => {
            setPreview(e.target?.result as string);
          };
          reader.readAsDataURL(blob);

          setLoading(true);
          setStatus(t('ocr_status_init'));

          try {
            const worker = await createWorker('eng+tha');
            setStatus(t('ocr_status_recog'));

            const { data } = await worker.recognize(blob);
            await worker.terminate();

            const text = data.text;
            const entries = parseEntries(text);
            if (entries.length > 1) {
              onBulkResults(selectedBoss, entries);
              setStatus(`Updated ${entries.length} members`);
              setTimeout(() => {
                handleClose();
              }, 800);
            } else {
              const numbers = text.match(/\d{1,3}(?:[,\s]\d{3})*(?:\.\d+)?/g) || [];
              
              if (numbers.length > 0) {
                const largestNumber = numbers
                  .map(n => parseFloat(n.replace(/[,\s]/g, '')))
                  .reduce((a, b) => Math.max(a, b), 0);
                
                if (largestNumber > 0) {
                  onResult(selectedBoss, Math.floor(largestNumber));
                  setStatus(`Found: ${largestNumber.toLocaleString()}`);
                  setTimeout(() => {
                    onClose();
                    setPreview(null);
                    setStatus('');
                  }, 1500);
                } else {
                  setStatus('No valid number found');
                }
              } else {
                setStatus('No numbers detected');
              }
            }
          } catch (error) {
            console.error('OCR Error:', error);
            setStatus('Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
          } finally {
            setLoading(false);
          }
          break;
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, [isOpen, selectedBoss, onResult, onClose, t]);

  if (!isOpen) return null;

  return (
    <div className={`modal-overlay ${isOpen ? 'active' : ''}`} onClick={handleClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-kanso-text dark:text-kansoDark-text">
            <i className="fas fa-camera mr-2"></i>
            {t('modal_scanning')}
          </h2>
          <button
            onClick={handleClose}
            className="text-kanso-muted hover:text-kanso-text dark:text-kansoDark-muted dark:hover:text-kansoDark-text"
            disabled={loading}
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <div className="space-y-6">
          {/* Boss Selection (only for page 1) */}
          {state.page === 1 && (
            <div>
              <label className="block text-sm font-medium text-kanso-text dark:text-kansoDark-text mb-3">
                {t('modal_select_boss')}
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {BOSS_NAMES.map((name, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedBoss(i)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedBoss === i
                        ? 'border-clay-500 bg-clay-50 dark:bg-clay-900/20'
                        : 'border-kanso-border dark:border-kansoDark-border bg-kanso-bg dark:bg-kansoDark-bg'
                    }`}
                  >
                    <img
                      src={BOSS_IMAGES[i] ?? BOSS_IMAGES[0]}
                      alt={name}
                      className="w-16 h-16 mx-auto mb-2 rounded-lg object-cover"
                    />
                    <div className="text-xs font-bold text-kanso-text dark:text-kansoDark-text">
                      {name}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* File Input */}
          <div>
            <label className="block text-sm font-medium text-kanso-text dark:text-kansoDark-text mb-2">
              Select Image
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={loading}
              className="w-full p-3 rounded-lg bg-kanso-bg dark:bg-kansoDark-bg border border-kanso-border dark:border-kansoDark-border text-kanso-text dark:text-kansoDark-text focus:outline-none focus:ring-2 focus:ring-clay-500"
            />
          </div>

          {/* Preview */}
          {preview && (
            <div>
              <label className="block text-sm font-medium text-kanso-text dark:text-kansoDark-text mb-2">
                Preview
              </label>
              <img
                src={preview}
                alt="Preview"
                className="w-full max-h-64 object-contain rounded-lg border border-kanso-border dark:border-kansoDark-border"
              />
            </div>
          )}

          {/* Status */}
          {status && (
            <div className={`p-4 rounded-lg ${
              status.includes('Error') || status.includes('No')
                ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                : status.includes('Found')
                ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
            }`}>
              <div className="flex items-center gap-2">
                {loading && <i className="fas fa-spinner fa-spin"></i>}
                {!loading && status.includes('Found') && <i className="fas fa-check-circle"></i>}
                {!loading && (status.includes('Error') || status.includes('No')) && (
                  <i className="fas fa-exclamation-circle"></i>
                )}
                <span>{status}</span>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="p-4 bg-kanso-surface dark:bg-kansoDark-surface rounded-lg text-sm text-kanso-muted dark:text-kansoDark-muted">
            <p className="font-medium mb-2">Instructions:</p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Quick way:</strong> Press <kbd className="px-2 py-1 bg-kanso-bg dark:bg-kansoDark-bg border border-kanso-border dark:border-kansoDark-border rounded">Ctrl+V</kbd> to paste an image from clipboard</li>
              <li>Or select an image file using the file input above</li>
              <li>Make sure the numbers are clear and readable</li>
              <li>The OCR will automatically detect and extract the largest number</li>
              <li>Supported formats: PNG, JPG, JPEG</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

