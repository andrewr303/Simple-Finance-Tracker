export type AccountType = 'credit_card' | 'bank_account';

export interface Account {
  id: string;
  type: AccountType;
  name: string;
  creditLimit: number;
  currentBalance: number;
  notes?: string;
}

export interface AppState {
  accounts: Account[];
}

export type AppAction =
  | { type: 'SET_ACCOUNTS'; payload: Account[] }
  | { type: 'ADD_ACCOUNT'; payload: Account }
  | { type: 'UPDATE_ACCOUNT'; payload: Account }
  | { type: 'DELETE_ACCOUNT'; payload: { id: string } };
