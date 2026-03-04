// File: src/components/finance/AccountList.tsx

import { useAppContext } from '@/context/AppProvider';
import { AccountCard } from './AccountCard';
import { Inbox } from 'lucide-react';

/**
 * Renders the list of all accounts, or an empty-state message.
 */
export function AccountList() {
  const { state } = useAppContext();

  if (state.accounts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-16 text-center">
        <Inbox className="mb-3 h-10 w-10 text-muted-foreground/50" aria-hidden="true" />
        <p className="text-lg font-medium text-muted-foreground">No accounts yet</p>
        <p className="text-sm text-muted-foreground/70">Add a credit card or bank account to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3" role="list" aria-label="Account list">
      {state.accounts.map((account) => (
        <div key={account.id} role="listitem">
          <AccountCard account={account} />
        </div>
      ))}
    </div>
  );
}
