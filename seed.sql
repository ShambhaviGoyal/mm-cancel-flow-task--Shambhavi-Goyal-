-- === Base tables ===
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  plan_name text not null default 'Pro',
  plan_price_cents integer not null default 2900, -- $29 default
  status text not null default 'active',          -- 'active' | 'canceled'
  pending_cancellation boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.cancellations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  downsell_variant text not null check (downsell_variant in ('A','B')),
  reason text,
  accepted_downsell boolean,                      -- null until decided
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_subscriptions_user on public.subscriptions (user_id);
create index if not exists idx_cancellations_user_created on public.cancellations (user_id, created_at desc);

-- RLS
alter table public.subscriptions enable row level security;
alter table public.cancellations enable row level security;

-- Basic "owner" policies for when real auth is used (auth.uid()).
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'subscriptions'
  ) then
    create policy subscriptions_owner_select
      on public.subscriptions for select
      using (auth.uid() = user_id);

    create policy subscriptions_owner_update
      on public.subscriptions for update
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'cancellations'
  ) then
    create policy cancellations_owner_all
      on public.cancellations for all
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;
end $$;

-- Seed a mock user’s active subscription so the UI has something to work with
-- MOCK_USER_ID must match your .env.local
insert into public.subscriptions (user_id, plan_name, plan_price_cents, status, pending_cancellation)
values ('11111111-1111-1111-1111-111111111111', 'Pro', 2900, 'active', false)
on conflict do nothing;
