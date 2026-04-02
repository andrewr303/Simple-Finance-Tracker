# Simple Finance Tracker

**One dashboard for every card and account you own.**

Track credit limits, live balances, available credit, and spend power across all your financial accounts — secured per-user with Supabase Auth and Postgres Row-Level Security.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-2.x-3FCF8E?logo=supabase&logoColor=white)](https://supabase.com)

---

## Overview

Simple Finance Tracker is a personal finance tracker that consolidates credit cards and bank accounts into a single, clean dashboard. After signing in, users see a live summary of total credit limits, current balances, and remaining available credit — updated instantly as accounts are added, edited, or removed.

Health indicators (color-coded green / yellow / red) surface accounts approaching their limit at a glance, and an optional **spend power** field lets users override the raw available-credit calculation when a card issuer reports a different figure.

---

## Features

- **Unified dashboard** — aggregate totals for limit, balance, and available credit shown as stat cards
- **Credit cards & bank accounts** — distinct account types with type-appropriate field handling (bank accounts have no credit limit)
- **Spend power override** — enter a card-issuer-reported spend power figure that takes precedence over the calculated available credit
- **Color-coded health indicators** — green (>50% available), yellow (20–50%), red (<20% or over limit)
- **Over-limit detection** — explicit warning when a balance exceeds the credit limit
- **Per-account notes** — freeform text field for storing card-specific context
- **Secure per-user data** — Supabase Auth with Postgres Row-Level Security; users can only access their own records
- **Responsive layout** — mobile-first design with drawer/sidebar patterns for small screens
- **Dark mode** — system-preference-aware theme via `next-themes`
- **Full CRUD** — add, edit, and delete accounts with optimistic UI updates and toast feedback

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript 5.8 |
| Build tool | Vite 5.4 (SWC compiler) |
| Styling | Tailwind CSS 3.4 + shadcn/ui (Radix UI primitives) |
| Forms | react-hook-form 7 + Zod validation |
| State | React Context + `useReducer` |
| Backend / DB | Supabase (Postgres + Auth) |
| Routing | React Router v6 |
| Icons | Lucide React |
| Notifications | Sonner |
| Testing | Vitest 3 + Testing Library + jsdom |
| Package manager | npm (Bun lock files also present) |

---

## Repository Structure

```
my-money-compass/
├── src/
│   ├── components/
│   │   ├── finance/            # Domain components
│   │   │   ├── AccountCard.tsx       # Individual account tile
│   │   │   ├── AccountList.tsx       # Account list with empty state
│   │   │   ├── AddAccountForm.tsx    # Validated add/edit form
│   │   │   ├── Header.tsx            # Top bar + logout
│   │   │   └── SummaryDashboard.tsx  # Aggregate stat cards
│   │   └── ui/                 # 50+ shadcn/ui primitives
│   ├── context/
│   │   └── AppProvider.tsx     # Global state (accounts CRUD + Supabase sync)
│   ├── integrations/
│   │   └── supabase/
│   │       ├── client.ts       # Supabase client init
│   │       └── types.ts        # Auto-generated DB types
│   ├── pages/
│   │   ├── Auth.tsx            # Sign in / sign up
│   │   ├── Index.tsx           # Main dashboard
│   │   └── NotFound.tsx        # 404
│   ├── test/
│   │   ├── calculateTotals.test.ts
│   │   ├── reducer.test.ts
│   │   └── setup.ts
│   ├── types/
│   │   └── account.ts          # Account, AppState, AppAction types
│   └── utils/
│       └── calculateTotals.ts  # Financial aggregation + formatCurrency
├── supabase/
│   ├── config.toml
│   └── migrations/             # SQL migrations
├── vite.config.ts
├── vitest.config.ts
├── tailwind.config.ts
└── components.json             # shadcn/ui config
```

---

## Architecture

```
Browser
  └─ React Router
       ├─ /auth    → Auth page (Supabase email/password)
       └─ /        → Index (protected)
                        └─ AppProvider (Context + useReducer)
                              ├─ Supabase client (reads/writes accounts table)
                              ├─ SummaryDashboard  ← calculateTotals()
                              ├─ AccountList
                              │    └─ AccountCard (edit / delete)
                              └─ AddAccountForm (react-hook-form + Zod)

Supabase (cloud)
  ├─ Auth  — JWT session management
  └─ Postgres
       └─ accounts table
            ├─ Row-Level Security: users see only their own rows
            └─ updated_at trigger (auto-timestamps)
```

State flows in one direction: Supabase mutations dispatch `AppAction` events into the reducer, which updates the context consumed by all components. No external state library is required.

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18 (recommend installing via [nvm](https://github.com/nvm-sh/nvm))
- A **Supabase** project (free tier works) with the schema applied (see [Database Schema](#database-schema))

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/andrewr303/my-money-compass.git
cd my-money-compass

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env   # then fill in your Supabase credentials
```

### Configuration

Create a `.env` file in the project root with the following variables:

```env
VITE_SUPABASE_URL=https://<your-project-id>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<your-supabase-anon-key>
```

Both values are available in your Supabase project under **Settings → API**.

> These are Vite public variables (prefixed `VITE_`). They use Supabase's anon key, which is safe to include in frontend builds — Row-Level Security enforces data isolation server-side.

### Run

```bash
npm run dev
# → http://localhost:8080
```

---

## Database Schema

Apply the migrations in `supabase/migrations/` to your Supabase project, or run the SQL below directly in the Supabase SQL editor.

```sql
create table accounts (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users(id) on delete cascade not null,
  type          text check (type in ('credit_card', 'bank_account')) not null,
  name          text not null,
  credit_limit  numeric default 0,
  current_balance numeric default 0,
  spend_power   numeric,         -- optional override
  notes         text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- Row-Level Security
alter table accounts enable row level security;

create policy "Users manage own accounts"
  on accounts for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

An `updated_at` trigger is included in the migration files.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server at `http://localhost:8080` with HMR |
| `npm run build` | Production build (output: `dist/`) |
| `npm run build:dev` | Development-mode build |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint across the codebase |
| `npm run test` | Run all tests once |
| `npm run test:watch` | Run tests in interactive watch mode |

---

## Testing

Tests live in `src/test/` and run with **Vitest** in a jsdom environment.

```bash
npm run test          # single pass
npm run test:watch    # watch mode (re-runs on file save)
```

Current coverage includes:

- **`calculateTotals.test.ts`** — financial aggregation logic: empty state, single credit card, mixed account types, over-limit scenarios
- **`reducer.test.ts`** — AppState reducer actions (SET, ADD, UPDATE, DELETE)

---

## Deployment

### Lovable (zero-config)

If the project was set up via [Lovable](https://lovable.dev), open your Lovable project and click **Share → Publish**. Custom domains can be connected under **Project → Settings → Domains**.

### Self-host / Any static host

```bash
npm run build
# Deploy the contents of dist/ to any static hosting provider
# (Vercel, Netlify, Cloudflare Pages, S3 + CloudFront, etc.)
```

The app is a fully static SPA — no server runtime required. Just point your host at `dist/` and configure it to serve `index.html` for all routes.

---

## Development Notes

- **Path alias:** `@` resolves to `src/` — use `@/components/...` instead of relative paths
- **Component library:** shadcn/ui components live in `src/components/ui/`. Add new ones with `npx shadcn@latest add <component>`
- **Supabase types:** Re-generate after schema changes with `npx supabase gen types typescript --project-id <id> > src/integrations/supabase/types.ts`
- **TypeScript strictness** is currently permissive (`strict: false`). Tightening this is a good first contribution

---

## Contributing

1. Fork the repository and create a feature branch (`git checkout -b feat/your-feature`)
2. Make your changes, add tests where appropriate
3. Run `npm run lint && npm run test` and ensure both pass
4. Open a pull request with a clear description of the change

Bug reports and feature requests are welcome via [GitHub Issues](https://github.com/andrewr303/my-money-compass/issues).

---

*Built with [React](https://react.dev), [Supabase](https://supabase.com), and [shadcn/ui](https://ui.shadcn.com).*
