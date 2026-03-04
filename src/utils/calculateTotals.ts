// File: src/utils/calculateTotals.ts

import type { Account } from '@/types/account';

/**
 * Result of aggregating financial totals across all accounts.
 */
export interface Totals {
  totalCreditLimit: number;
  totalBalance: number;
  totalAvailableCredit: number;
}

/**
 * Calculates aggregate financial totals from a list of accounts.
 *
 * - `totalCreditLimit`: Sum of all `creditLimit` values.
 * - `totalBalance`: Sum of all `currentBalance` values.
 * - `totalAvailableCredit`: `totalCreditLimit - totalBalance`.
 *   Can be negative if balances exceed limits.
 *
 * Assumption: Bank accounts with creditLimit = 0 contribute 0 to the total
 * credit limit but still contribute their balance to totalBalance.
 *
 * @param accounts - Array of Account objects
 * @returns Aggregated totals
 */
export function calculateTotals(accounts: Account[]): Totals {
  const totalCreditLimit = accounts.reduce((sum, a) => sum + a.creditLimit, 0);
  const totalBalance = accounts.reduce((sum, a) => sum + a.currentBalance, 0);
  return {
    totalCreditLimit,
    totalBalance,
    totalAvailableCredit: totalCreditLimit - totalBalance,
  };
}

/**
 * Formats a number as USD currency string using locale formatting.
 * @param value - Numeric value to format
 * @returns Formatted currency string, e.g. "$10,000"
 */
export function formatCurrency(value: number): string {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}
