// File: src/context/AppProvider.tsx

import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { Account, AppState, AppAction } from '@/types/account';

const STORAGE_KEY = 'credit-tracker-accounts';

/**
 * Attempts to read and parse accounts from localStorage.
 * Returns an empty array on failure (e.g., private browsing mode).
 */
function loadFromStorage(): Account[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // localStorage unavailable or corrupted — degrade gracefully
    return [];
  }
}

/**
 * Attempts to persist accounts to localStorage.
 * Silently fails if storage is unavailable.
 */
function saveToStorage(accounts: Account[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
  } catch {
    // Silently ignore — user will lose data on refresh but app won't crash
  }
}

/**
 * Reducer handling all account CRUD operations.
 */
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_ACCOUNT':
      return { accounts: [...state.accounts, action.payload] };
    case 'UPDATE_ACCOUNT':
      return {
        accounts: state.accounts.map((a) =>
          a.id === action.payload.id ? action.payload : a
        ),
      };
    case 'DELETE_ACCOUNT':
      return {
        accounts: state.accounts.filter((a) => a.id !== action.payload.id),
      };
    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

/**
 * Provides application state (accounts) and dispatch to all children.
 * Hydrates from localStorage on mount and syncs on every state change.
 */
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, { accounts: [] }, () => ({
    accounts: loadFromStorage(),
  }));

  // Sync state to localStorage whenever accounts change
  useEffect(() => {
    saveToStorage(state.accounts);
  }, [state.accounts]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

/**
 * Hook to access the app context. Must be used within an AppProvider.
 * @throws Error if used outside of AppProvider
 */
export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return ctx;
}
