// File: src/types/account.ts

/**
 * Represents the type of financial account.
 */
export type AccountType = 'credit_card' | 'bank_account';

/**
 * Represents a single financial account (credit card or bank account).
 *
 * Assumption: For bank accounts, `creditLimit` is set to 0 since they don't
 * have a traditional credit limit. Available credit will display "N/A" for
 * bank accounts with a creditLimit of 0.
 */
export interface Account {
  /** Unique identifier generated via crypto.randomUUID() */
  id: string;
  /** Whether this is a credit card or bank account */
  type: AccountType;
  /** Display name, e.g. "Chase Sapphire" or "Wells Fargo Checking" */
  name: string;
  /** Total credit limit; 0 for bank accounts without a credit line */
  creditLimit: number;
  /** Current balance owed (credit card) or held (bank account) */
  currentBalance: number;
  /** Optional user notes */
  notes?: string;
}

/**
 * Application-level state shape.
 */
export interface AppState {
  accounts: Account[];
}

/**
 * Discriminated union of all reducer actions.
 */
export type AppAction =
  | { type: 'ADD_ACCOUNT'; payload: Account }
  | { type: 'UPDATE_ACCOUNT'; payload: Account }
  | { type: 'DELETE_ACCOUNT'; payload: { id: string } };
