import { CreditCard, LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export function Header() {
  async function handleLogout() {
    await supabase.auth.signOut();
  }

  return (
    <header className="border-b border-border bg-card px-4 py-5 sm:px-6">
      <div className="mx-auto flex max-w-4xl items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <CreditCard className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-card-foreground sm:text-2xl">Credit Tracker</h1>
            <p className="text-sm text-muted-foreground">Track your credit cards &amp; bank accounts</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          aria-label="Sign out"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
}
