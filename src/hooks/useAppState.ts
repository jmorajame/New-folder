import { useState, useEffect, useCallback } from 'react';
import { AppState, Member } from '../types';
import { DEFAULT_STATE } from '../constants';
import { saveToLocalStorage, loadFromLocalStorage } from '../utils';

const STORAGE_KEY = 'bossguild_state';

export function useAppState() {
  const [state, setState] = useState<AppState>(() => {
    return loadFromLocalStorage<AppState>(STORAGE_KEY, DEFAULT_STATE);
  });

  // Auto-save to localStorage whenever state changes
  useEffect(() => {
    saveToLocalStorage(STORAGE_KEY, state);
  }, [state]);

  const updateState = useCallback((updates: Partial<AppState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const addMember = useCallback((name: string) => {
    const newMember: Member = {
      name: name.trim(),
      v: [0, 0, 0, 0],
      v2: 0,
      d: [0, 0, 0, 0],
    };
    setState((prev) => ({
      ...prev,
      members: [...prev.members, newMember],
    }));
  }, []);

  const deleteMember = useCallback((index: number) => {
    setState((prev) => {
      const newMembers = prev.members.filter((_, i) => i !== index);
      return { ...prev, members: newMembers };
    });
  }, []);

  const updateMemberValue = useCallback(
    (memberIndex: number, bossIndex: number, value: number) => {
      setState((prev) => {
        const newMembers = [...prev.members];
        const member = newMembers[memberIndex];
        
        if (prev.page === 1 && bossIndex >= 0) {
          if (prev.mode === 'damage') {
            const newD = [...(member.d || [0, 0, 0, 0])];
            newD[bossIndex] = value;
            newMembers[memberIndex] = { ...member, d: newD };
          } else {
            const newV = [...member.v];
            newV[bossIndex] = value;
            newMembers[memberIndex] = { ...member, v: newV };
          }
        } else if (prev.page === 2 || bossIndex === -1) {
          newMembers[memberIndex] = { ...member, v2: value };
        }
        
        return { ...prev, members: newMembers };
      });
    },
    []
  );

  const resetWeek = useCallback(() => {
    setState((prev) => {
      const history = [...prev.history, prev.members];
      const resetMembers = prev.members.map((m) => ({
        ...m,
        v: [0, 0, 0, 0],
        v2: 0,
        d: [0, 0, 0, 0],
      }));
      return {
        ...prev,
        members: resetMembers,
        history,
        historyIndex: history.length - 1,
        deadBosses: {
          1: [false, false, false, false],
          2: [false],
        },
      };
    });
  }, []);

  const toggleDeadBoss = useCallback((page: 1 | 2, bossIndex: number) => {
    setState((prev) => {
      const newDeadBosses = { ...prev.deadBosses };
      newDeadBosses[page] = [...newDeadBosses[page]];
      newDeadBosses[page][bossIndex] = !newDeadBosses[page][bossIndex];
      return { ...prev, deadBosses: newDeadBosses };
    });
  }, []);

  const sortMembers = useCallback(
    (
      key: 'name' | 'total' | 'boss',
      bossIndex: number = -1,
      order?: 'asc' | 'desc'
    ) => {
      setState((prev) => {
        const newSort = { ...prev.sort };
        
        if (prev.sort.key === key && prev.sort.index === bossIndex) {
          newSort.order = prev.sort.order === 'asc' ? 'desc' : 'asc';
        } else {
          newSort.key = key;
          newSort.index = bossIndex;
          newSort.order = key === 'name' ? 'asc' : 'desc';
        }
        
        if (order) newSort.order = order;

        const sortedMembers = [...prev.members].sort((a, b) => {
          let valA: string | number;
          let valB: string | number;

          if (key === 'name') {
            valA = a.name.toLowerCase();
            valB = b.name.toLowerCase();
          } else if (key === 'total') {
            if (prev.page === 1 && prev.mode === 'damage') {
              valA = (a.d || []).reduce((acc, v) => acc + v, 0);
              valB = (b.d || []).reduce((acc, v) => acc + v, 0);
            } else if (prev.page === 1) {
              valA = a.v.reduce((acc, v) => acc + v, 0);
              valB = b.v.reduce((acc, v) => acc + v, 0);
            } else {
              valA = a.v2;
              valB = b.v2;
            }
          } else if (key === 'boss') {
            if (prev.page === 1) {
              const arrA = prev.mode === 'damage' ? (a.d || [0, 0, 0, 0]) : a.v;
              const arrB = prev.mode === 'damage' ? (b.d || [0, 0, 0, 0]) : b.v;
              valA = arrA[bossIndex] || 0;
              valB = arrB[bossIndex] || 0;
            } else {
              valA = a.v2;
              valB = b.v2;
            }
          }

          if (valA < valB) return newSort.order === 'asc' ? -1 : 1;
          if (valA > valB) return newSort.order === 'asc' ? 1 : -1;
          return 0;
        });

        return { ...prev, members: sortedMembers, sort: newSort };
      });
    },
    []
  );

  const updateMember = useCallback(
    (index: number, updates: Partial<Member>) => {
      setState((prev) => {
        const newMembers = [...prev.members];
        newMembers[index] = { ...newMembers[index], ...updates };
        return { ...prev, members: newMembers };
      });
    },
    []
  );

  return {
    state,
    updateState,
    addMember,
    deleteMember,
    updateMember,
    updateMemberValue,
    resetWeek,
    toggleDeadBoss,
    sortMembers,
  };
}

