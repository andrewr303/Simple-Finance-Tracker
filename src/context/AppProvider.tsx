import React, { createContext, useContext, useReducer, useEffect, useCallback, type ReactNode } from 'react';
import type { Account, AppState, AppAction } from '@/types/account';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_ACCOUNTS':
      return { accounts: action.payload };
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
  addAccount: (account: Omit<Account, 'id'>) => Promise<void>;
  updateAccount: (account: Account) => Promise<void>;
  deleteAccount: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children, user }: { children: ReactNode; user: User }) {
  const [state, dispatch] = useReducer(appReducer, { accounts: [] });

  // Load accounts from database
  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .order('created_at', { ascending: true });
      if (!error && data) {
        dispatch({
          type: 'SET_ACCOUNTS',
          payload: data.map((row) => ({
            id: row.id,
            type: row.type as Account['type'],
            name: row.name,
            creditLimit: Number(row.credit_limit),
            currentBalance: Number(row.current_balance),
            notes: row.notes ?? undefined,
          })),
        });
      }
    }
    load();
  }, [user.id]);

  const addAccount = useCallback(async (account: Omit<Account, 'id'>) => {
    const { data, error } = await supabase
      .from('accounts')
      .insert({
        user_id: user.id,
        type: account.type,
        name: account.name,
        credit_limit: account.creditLimit,
        current_balance: account.currentBalance,
        notes: account.notes ?? null,
      })
      .select()
      .single();
    if (!error && data) {
      dispatch({
        type: 'ADD_ACCOUNT',
        payload: {
          id: data.id,
          type: data.type as Account['type'],
          name: data.name,
          creditLimit: Number(data.credit_limit),
          currentBalance: Number(data.current_balance),
          notes: data.notes ?? undefined,
        },
      });
    }
  }, [user.id]);

  const updateAccount = useCallback(async (account: Account) => {
    const { error } = await supabase
      .from('accounts')
      .update({
        name: account.name,
        type: account.type,
        credit_limit: account.creditLimit,
        current_balance: account.currentBalance,
        notes: account.notes ?? null,
      })
      .eq('id', account.id);
    if (!error) {
      dispatch({ type: 'UPDATE_ACCOUNT', payload: account });
    }
  }, []);

  const deleteAccount = useCallback(async (id: string) => {
    const { error } = await supabase.from('accounts').delete().eq('id', id);
    if (!error) {
      dispatch({ type: 'DELETE_ACCOUNT', payload: { id } });
    }
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch, addAccount, updateAccount, deleteAccount }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return ctx;
}
