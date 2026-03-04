// File: src/components/finance/AccountCard.tsx

import { useState } from 'react';
import type { Account } from '@/types/account';
import { useAppContext } from '@/context/AppProvider';
import { formatCurrency } from '@/utils/calculateTotals';
import { CreditCard, Landmark, Pencil, Trash2, Check, X } from 'lucide-react';

interface AccountCardProps {
  account: Account;
}

/**
 * Displays a single account with name, type, financial details, and edit/delete controls.
 * Supports inline editing and deletion with confirmation.
 */
export function AccountCard({ account }: AccountCardProps) {
  const { dispatch } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState(account.name);
  const [editLimit, setEditLimit] = useState(account.creditLimit.toString());
  const [editBalance, setEditBalance] = useState(account.currentBalance.toString());
  const [editNotes, setEditNotes] = useState(account.notes ?? '');

  const available = account.creditLimit - account.currentBalance;
  const isOverLimit = account.currentBalance > account.creditLimit && account.creditLimit > 0;
  const isBankWithNoLimit = account.type === 'bank_account' && account.creditLimit === 0;

  function handleSave() {
    const limit = Math.max(0, Number(editLimit) || 0);
    const balance = Math.max(0, Number(editBalance) || 0);
    dispatch({
      type: 'UPDATE_ACCOUNT',
      payload: {
        ...account,
        name: editName.trim() || account.name,
        creditLimit: limit,
        currentBalance: balance,
        notes: editNotes.trim() || undefined,
      },
    });
    setIsEditing(false);
  }

  function handleDelete() {
    dispatch({ type: 'DELETE_ACCOUNT', payload: { id: account.id } });
  }

  function handleCancelEdit() {
    setEditName(account.name);
    setEditLimit(account.creditLimit.toString());
    setEditBalance(account.currentBalance.toString());
    setEditNotes(account.notes ?? '');
    setIsEditing(false);
  }

  const TypeIcon = account.type === 'credit_card' ? CreditCard : Landmark;

  if (isEditing) {
    return (
      <div className="rounded-xl border border-primary/30 bg-card p-4 shadow-sm">
        <div className="space-y-3">
          <div>
            <label htmlFor={`edit-name-${account.id}`} className="mb-1 block text-sm font-medium text-card-foreground">
              Name
            </label>
            <input
              id={`edit-name-${account.id}`}
              type="text"
              maxLength={50}
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`edit-limit-${account.id}`} className="mb-1 block text-sm font-medium text-card-foreground">
                Credit Limit
              </label>
              <input
                id={`edit-limit-${account.id}`}
                type="number"
                min={0}
                value={editLimit}
                onChange={(e) => setEditLimit(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label htmlFor={`edit-balance-${account.id}`} className="mb-1 block text-sm font-medium text-card-foreground">
                Balance
              </label>
              <input
                id={`edit-balance-${account.id}`}
                type="number"
                min={0}
                value={editBalance}
                onChange={(e) => setEditBalance(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
          <div>
            <label htmlFor={`edit-notes-${account.id}`} className="mb-1 block text-sm font-medium text-card-foreground">
              Notes
            </label>
            <input
              id={`edit-notes-${account.id}`}
              type="text"
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90"
              aria-label="Save changes"
            >
              <Check className="h-4 w-4" /> Save
            </button>
            <button
              onClick={handleCancelEdit}
              className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground hover:opacity-90"
              aria-label="Cancel editing"
            >
              <X className="h-4 w-4" /> Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent">
            <TypeIcon className="h-4 w-4 text-accent-foreground" aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground">{account.name}</h3>
            <span className="inline-block rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
              {account.type === 'credit_card' ? 'Credit Card' : 'Bank Account'}
            </span>
            {account.notes && (
              <p className="mt-1 text-xs text-muted-foreground">{account.notes}</p>
            )}
          </div>
        </div>

        <div className="flex gap-1">
          <button
            onClick={() => setIsEditing(true)}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            aria-label={`Edit ${account.name}`}
          >
            <Pencil className="h-4 w-4" />
          </button>
          {confirmDelete ? (
            <div className="flex items-center gap-1">
              <button
                onClick={handleDelete}
                className="rounded-lg bg-destructive px-2 py-1 text-xs font-medium text-destructive-foreground"
                aria-label={`Confirm delete ${account.name}`}
              >
                Delete
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="rounded-lg px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-accent"
                aria-label="Cancel delete"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              aria-label={`Delete ${account.name}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Financial details */}
      <div className="mt-4 grid grid-cols-3 gap-2 rounded-lg bg-muted/50 p-3">
        <div>
          <p className="text-xs text-muted-foreground">Limit</p>
          <p className="text-sm font-semibold text-card-foreground">
            {account.creditLimit === 0 && account.type === 'bank_account'
              ? 'N/A'
              : formatCurrency(account.creditLimit)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Balance</p>
          <p className={`text-sm font-semibold ${isOverLimit ? 'text-danger' : 'text-card-foreground'}`}>
            {formatCurrency(account.currentBalance)}
            {isOverLimit && <span className="ml-1 text-xs">⚠️</span>}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Available</p>
          <p className={`text-sm font-semibold ${
            isBankWithNoLimit
              ? 'text-muted-foreground'
              : available < 0
                ? 'text-danger'
                : 'text-success'
          }`}>
            {isBankWithNoLimit ? 'N/A' : formatCurrency(available)}
          </p>
        </div>
      </div>
    </div>
  );
}
