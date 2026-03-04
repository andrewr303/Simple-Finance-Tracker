import { useState } from 'react';
import type { AccountType } from '@/types/account';
import { useAppContext } from '@/context/AppProvider';
import { Plus } from 'lucide-react';

export function AddAccountForm() {
  const { state, addAccount } = useAppContext();

  const [name, setName] = useState('');
  const [type, setType] = useState<AccountType>('credit_card');
  const [creditLimit, setCreditLimit] = useState('');
  const [currentBalance, setCurrentBalance] = useState('');
  const [spendPower, setSpendPower] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const hasSpendPower = spendPower !== '';

  const isDuplicate = state.accounts.some(
    (a) => a.name.toLowerCase() === name.trim().toLowerCase()
  );

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (name.trim().length > 50) newErrors.name = 'Max 50 characters';
    const limit = Number(creditLimit);
    const balance = Number(currentBalance);
    const sp = Number(spendPower);
    if (creditLimit !== '' && limit < 0) newErrors.creditLimit = 'Must be non-negative';
    if (!hasSpendPower && currentBalance !== '' && balance < 0) newErrors.currentBalance = 'Must be non-negative';
    if (hasSpendPower && sp < 0) newErrors.spendPower = 'Must be non-negative';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    const limitVal = Math.max(0, Number(creditLimit) || 0);
    const spVal = hasSpendPower ? Math.max(0, Number(spendPower) || 0) : null;
    // If spend power is provided, derive balance from limit - spend power
    const balanceVal = hasSpendPower
      ? Math.max(0, limitVal - (spVal ?? 0))
      : Math.max(0, Number(currentBalance) || 0);

    await addAccount({
      type,
      name: name.trim(),
      creditLimit: limitVal,
      currentBalance: balanceVal,
      spendPower: spVal,
      notes: notes.trim() || undefined,
    });
    setName('');
    setCreditLimit('');
    setCurrentBalance('');
    setSpendPower('');
    setNotes('');
    setErrors({});
    setSubmitting(false);
  }

  const limit = Number(creditLimit) || 0;
  const balance = Number(currentBalance) || 0;
  const isOverLimit = !hasSpendPower && limit > 0 && balance > limit;

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-card-foreground">Add Account</h2>
      <div className="space-y-3">
        <div>
          <label htmlFor="account-name" className="mb-1 block text-sm font-medium text-card-foreground">
            Account Name <span className="text-destructive">*</span>
          </label>
          <input id="account-name" type="text" maxLength={50} value={name} onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Chase Sapphire"
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            required aria-invalid={!!errors.name} />
          {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
          {isDuplicate && !errors.name && <p className="mt-1 text-xs text-warning">An account with this name already exists</p>}
        </div>

        <div>
          <label htmlFor="account-type" className="mb-1 block text-sm font-medium text-card-foreground">Account Type</label>
          <select id="account-type" value={type} onChange={(e) => setType(e.target.value as AccountType)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
            <option value="credit_card">Credit Card</option>
            <option value="bank_account">Bank Account</option>
          </select>
        </div>

        <div>
          <label htmlFor="credit-limit" className="mb-1 block text-sm font-medium text-card-foreground">Credit Limit ($)</label>
          <input id="credit-limit" type="number" min={0} value={creditLimit} onChange={(e) => setCreditLimit(e.target.value)} placeholder="0"
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          {errors.creditLimit && <p className="mt-1 text-xs text-destructive">{errors.creditLimit}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="current-balance" className="mb-1 block text-sm font-medium text-card-foreground">
              Current Balance ($)
            </label>
            <input id="current-balance" type="number" min={0} value={hasSpendPower ? '' : currentBalance}
              onChange={(e) => setCurrentBalance(e.target.value)} placeholder={hasSpendPower ? 'Auto' : '0'}
              disabled={hasSpendPower}
              className={`w-full rounded-lg border border-input px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
                hasSpendPower ? 'bg-muted text-muted-foreground cursor-not-allowed' : 'bg-background text-foreground'
              }`} />
            {errors.currentBalance && <p className="mt-1 text-xs text-destructive">{errors.currentBalance}</p>}
          </div>
          <div>
            <label htmlFor="spend-power" className="mb-1 block text-sm font-medium text-card-foreground">
              Spend Power ($)
            </label>
            <input id="spend-power" type="number" min={0} value={spendPower}
              onChange={(e) => setSpendPower(e.target.value)} placeholder="Optional"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            {errors.spendPower && <p className="mt-1 text-xs text-destructive">{errors.spendPower}</p>}
          </div>
        </div>
        {hasSpendPower && (
          <p className="text-xs text-muted-foreground">💡 Spend power provided — balance will be calculated automatically</p>
        )}
        {isOverLimit && <p className="text-xs text-warning">⚠️ Balance exceeds credit limit (over-limit)</p>}

        <div>
          <label htmlFor="account-notes" className="mb-1 block text-sm font-medium text-card-foreground">
            Notes <span className="text-muted-foreground">(optional)</span>
          </label>
          <input id="account-notes" type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any additional notes..."
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>

        <button type="submit" disabled={submitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
          <Plus className="h-4 w-4" /> {submitting ? 'Adding...' : 'Add Account'}
        </button>
      </div>
    </form>
  );
}
