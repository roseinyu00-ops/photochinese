-- PhotoChinese: облачное хранение профиля и прогресса
-- Выполни этот скрипт один раз в Supabase → SQL Editor → New query.

alter table public.profiles
  add column if not exists app_data jsonb not null default '{}'::jsonb;

alter table public.profiles enable row level security;

drop policy if exists "PhotoChinese users can update own profile" on public.profiles;

create policy "PhotoChinese users can update own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);
