// File: src/test/reducer.test.ts

import { describe, it, expect } from 'vitest';
import type { AppState, AppAction, Account } from '@/types/account';

// Inline reducer for testing (same logic as AppProvider)
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

const mockAccount: Account = {
  id: 'test-1',
  type: 'credit_card',
  name: 'Test Card',
  creditLimit: 5000,
  currentBalance: 1000,
};

describe('appReducer', () => {
  it('ADD_ACCOUNT adds to the list', () => {
    const state = appReducer({ accounts: [] }, { type: 'ADD_ACCOUNT', payload: mockAccount });
    expect(state.accounts).toHaveLength(1);
    expect(state.accounts[0].name).toBe('Test Card');
  });

  it('UPDATE_ACCOUNT updates the matching account', () => {
    const updated = { ...mockAccount, name: 'Updated Card' };
    const state = appReducer(
      { accounts: [mockAccount] },
      { type: 'UPDATE_ACCOUNT', payload: updated }
    );
    expect(state.accounts[0].name).toBe('Updated Card');
  });

  it('DELETE_ACCOUNT removes the matching account', () => {
    const state = appReducer(
      { accounts: [mockAccount] },
      { type: 'DELETE_ACCOUNT', payload: { id: 'test-1' } }
    );
    expect(state.accounts).toHaveLength(0);
  });
});
