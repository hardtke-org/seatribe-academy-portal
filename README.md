# SeaTribe Skipper Academy Portal

Online course portal for the **Professional Delivery Skipper Foundations** course.

## Tech Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS**
- **Supabase** (Auth + Database)
- **Stripe** (Payments)

## Setup

1. Clone the repo
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local` and fill in the values
4. Set up Supabase: Create a `purchases` table (see below)
5. Configure Stripe webhook endpoint pointing to `/api/webhook`

### Supabase Schema

```sql
create table purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  course_id text not null,
  stripe_session_id text unique not null,
  status text not null default 'paid',
  amount numeric,
  currency text,
  created_at timestamptz default now()
);

alter table purchases enable row level security;

create policy "Users can view own purchases"
  on purchases for select
  using (auth.uid() = user_id);
```

## Development

```bash
npm run dev
```

## Deploy

Deploy on Vercel. Set environment variables in the Vercel dashboard.

Configure the Stripe webhook endpoint to `https://your-domain.vercel.app/api/webhook` with the `checkout.session.completed` event.
