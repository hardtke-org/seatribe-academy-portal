-- SeaTribe Skipper Academy – Supabase Schema
-- Run this in the Supabase SQL Editor

create table if not exists purchases (
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

-- Users can only see their own purchases
create policy "Users can view own purchases"
  on purchases for select
  using (auth.uid() = user_id);

-- Service role can insert/upsert (used by webhook)
-- The webhook uses the service role key, which bypasses RLS
