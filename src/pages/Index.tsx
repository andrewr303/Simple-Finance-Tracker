import { AppProvider } from '@/context/AppProvider';
import { Header } from '@/components/finance/Header';
import { SummaryDashboard } from '@/components/finance/SummaryDashboard';
import { AccountList } from '@/components/finance/AccountList';
import { AddAccountForm } from '@/components/finance/AddAccountForm';
import type { User } from '@supabase/supabase-js';

const Index = ({ user }: { user: User }) => {
  return (
    <AppProvider user={user}>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
          <div className="space-y-6">
            <SummaryDashboard />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
              <div className="lg:col-span-3">
                <AccountList />
              </div>
              <div className="lg:col-span-2">
                <AddAccountForm />
              </div>
            </div>
          </div>
        </main>
      </div>
    </AppProvider>
  );
};

export default Index;
