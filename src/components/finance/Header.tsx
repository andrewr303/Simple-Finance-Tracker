// File: src/components/finance/Header.tsx

import { CreditCard } from 'lucide-react';

/**
 * App header with title and branding.
 */
export function Header() {
  return (
    <header className="border-b border-border bg-card px-4 py-5 sm:px-6">
      <div className="mx-auto flex max-w-4xl items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
          <CreditCard className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-card-foreground sm:text-2xl">
            Credit Tracker
          </h1>
          <p className="text-sm text-muted-foreground">
            Track your credit cards &amp; bank accounts
          </p>
        </div>
      </div>
    </header>
  );
}
