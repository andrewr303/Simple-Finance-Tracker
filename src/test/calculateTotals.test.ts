// File: src/test/calculateTotals.test.ts

import { describe, it, expect } from 'vitest';
import { calculateTotals } from '@/utils/calculateTotals';
import type { Account } from '@/types/account';

describe('calculateTotals', () => {
  it('returns zeros for empty array', () => {
    const result = calculateTotals([]);
    expect(result).toEqual({
      totalCreditLimit: 0,
      totalBalance: 0,
      totalAvailableCredit: 0,
    });
  });

  it('calculates correctly for a single credit card', () => {
    const accounts: Account[] = [
      { id: '1', type: 'credit_card', name: 'Test', creditLimit: 10000, currentBalance: 3500 },
    ];
    const result = calculateTotals(accounts);
    expect(result).toEqual({
      totalCreditLimit: 10000,
      totalBalance: 3500,
      totalAvailableCredit: 6500,
    });
  });

  it('calculates correctly for mixed accounts', () => {
    const accounts: Account[] = [
      { id: '1', type: 'credit_card', name: 'Chase', creditLimit: 10000, currentBalance: 3500 },
      { id: '2', type: 'credit_card', name: 'Amex', creditLimit: 15000, currentBalance: 7200 },
      { id: '3', type: 'bank_account', name: 'Wells Fargo', creditLimit: 0, currentBalance: 4500 },
    ];
    const result = calculateTotals(accounts);
    expect(result).toEqual({
      totalCreditLimit: 25000,
      totalBalance: 15200,
      totalAvailableCredit: 9800,
    });
  });

  it('handles negative available credit when over limit', () => {
    const accounts: Account[] = [
      { id: '1', type: 'credit_card', name: 'Over', creditLimit: 5000, currentBalance: 7000 },
    ];
    const result = calculateTotals(accounts);
    expect(result.totalAvailableCredit).toBe(-2000);
  });
});
