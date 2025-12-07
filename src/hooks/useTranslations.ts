import { useMemo } from 'react';
import { TRANSLATIONS } from '../constants/translations';
import { AppState } from '../types';

export function useTranslations(state: Pick<AppState, 'language'>) {
  const t = useMemo(
    () => (key: string): string => {
      const lang = state.language || 'th';
      return TRANSLATIONS[lang][key] || key;
    },
    [state.language]
  );

  return { t };
}

