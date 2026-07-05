-- Competition snapshots store the complete CompetitionData document.
-- This migration is intentionally small because the application uses one
-- shared document identified by the slug "main".

create extension if not exists pgcrypto;

create table if not exists public.competition_snapshots (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.competition_snapshots is
  'Shared competition data documents. The application currently uses slug main.';

create or replace function public.set_competition_snapshot_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_competition_snapshot_updated_at
  on public.competition_snapshots;

create trigger set_competition_snapshot_updated_at
before update on public.competition_snapshots
for each row
execute function public.set_competition_snapshot_updated_at();

-- The placeholder is deliberately not a complete CompetitionData document.
-- The Supabase repository replaces it with validated default data on its
-- first successful read.
insert into public.competition_snapshots (slug, data)
values ('main', '{}'::jsonb)
on conflict (slug) do nothing;

alter table public.competition_snapshots enable row level security;

grant usage on schema public to anon, authenticated;
grant select, insert, update
  on table public.competition_snapshots
  to anon, authenticated;

drop policy if exists "Public can read competition snapshots"
  on public.competition_snapshots;
create policy "Public can read competition snapshots"
on public.competition_snapshots
for select
to anon, authenticated
using (true);

-- WARNING: These public write policies are for controlled testing only.
-- Anyone with the public client key can insert or update snapshot data.
-- Replace them with authenticated, device-specific, or server-controlled
-- policies before production if the deployment is not fully trusted.
drop policy if exists "Temporary public insert for competition snapshots"
  on public.competition_snapshots;
create policy "Temporary public insert for competition snapshots"
on public.competition_snapshots
for insert
to anon, authenticated
with check (true);

drop policy if exists "Temporary public update for competition snapshots"
  on public.competition_snapshots;
create policy "Temporary public update for competition snapshots"
on public.competition_snapshots
for update
to anon, authenticated
using (true)
with check (true);

-- Postgres Changes only emits events for tables in the Supabase Realtime
-- publication. This block is safe to run again after the table is enabled.
do $$
begin
  if exists (
    select 1
    from pg_publication
    where pubname = 'supabase_realtime'
  ) and not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'competition_snapshots'
  ) then
    alter publication supabase_realtime
      add table public.competition_snapshots;
  end if;
end;
$$;
