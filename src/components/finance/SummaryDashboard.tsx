// File: src/components/finance/SummaryDashboard.tsx

import { useAppContext } from '@/context/AppProvider';
import { calculateTotals, formatCurrency } from '@/utils/calculateTotals';
import { DollarSign, TrendingDown, Wallet } from 'lucide-react';

/**
 * Returns a Tailwind color class based on the available-credit-to-limit ratio.
 * - > 50%: success (green)
 * - 20–50%: warning (yellow)
 * - < 20%: danger (red)
 * - If limit is 0, returns muted (no meaningful ratio).
 */
function getHealthColor(available: number, limit: number): string {
  if (limit <= 0) return 'text-muted-foreground';
  const ratio = available / limit;
  if (ratio > 0.5) return 'text-success';
  if (ratio >= 0.2) return 'text-warning';
  return 'text-danger';
}

/**
 * Displays three summary stat cards: Total Limit, Total Balance, Available Credit.
 * Color-codes available credit based on utilization ratio.
 */
export function SummaryDashboard() {
  const { state } = useAppContext();
  const { totalCreditLimit, totalBalance, totalAvailableCredit } = calculateTotals(state.accounts);
  const healthColor = getHealthColor(totalAvailableCredit, totalCreditLimit);

  const stats = [
    {
      label: 'Total Credit Limit',
      value: formatCurrency(totalCreditLimit),
      icon: Wallet,
      color: 'text-primary',
    },
    {
      label: 'Total Balance',
      value: formatCurrency(totalBalance),
      icon: TrendingDown,
      color: 'text-foreground',
    },
    {
      label: 'Available Credit',
      value: formatCurrency(totalAvailableCredit),
      icon: DollarSign,
      color: healthColor,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3" role="region" aria-label="Financial summary">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-xl border border-stat-card-border bg-stat-card p-5 shadow-sm"
        >
          <div className="mb-2 flex items-center gap-2">
            <s.icon className={`h-4 w-4 ${s.color}`} aria-hidden="true" />
            <span className="text-sm font-medium text-muted-foreground">{s.label}</span>
          </div>
          <p className={`text-2xl font-bold tracking-tight ${s.color}`}>{s.value}</p>
        </div>
      ))}
    </div>
  );
}
