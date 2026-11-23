-- PhotoChinese: облачное хранение профиля и прогресса
-- Выполни этот скрипт один раз в Supabase → SQL Editor → New query.

alter table public.profiles
  add column if not exists app_data jsonb not null default '{}'::jsonb;

alter table public.profiles enable row level security;

-- Пользователь может читать и создавать только собственную запись профиля.
-- Владелец сайта дополнительно может читать список профилей через проверку роли
-- на стороне базы данных (а не через скрытие кнопки в интерфейсе).
drop policy if exists "PhotoChinese users can read own profile" on public.profiles;
create policy "PhotoChinese users can read own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "PhotoChinese users can insert own profile" on public.profiles;
create policy "PhotoChinese users can insert own profile"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

drop policy if exists "PhotoChinese users can update own profile" on public.profiles;
create policy "PhotoChinese users can update own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

-- Безопасная проверка роли для политики чтения списка пользователей.
-- SECURITY DEFINER позволяет проверить admin_roles, даже если RLS включён
-- на этой таблице. Функция только возвращает true/false и не меняет данные.
create or replace function public.photochinese_is_owner()
returns boolean
language sql
stable
security definer
set search_path = public
as $
  select exists (
    select 1
    from public.admin_roles
    where user_id = auth.uid()
      and role = 'owner'
  );
$;

revoke all on function public.photochinese_is_owner() from public;
grant execute on function public.photochinese_is_owner() to authenticated;

drop policy if exists "PhotoChinese owner can read all profiles" on public.profiles;
create policy "PhotoChinese owner can read all profiles"
on public.profiles
for select
to authenticated
using (public.photochinese_is_owner());

-- Клиенту нужна возможность прочитать только собственную роль для показа
-- статуса владельца. Назначать и изменять роли через клиент нельзя.
alter table public.admin_roles enable row level security;
drop policy if exists "PhotoChinese users can read own admin role" on public.admin_roles;
create policy "PhotoChinese users can read own admin role"
on public.admin_roles
for select
to authenticated
using (auth.uid() = user_id);

-- Отдельное хранилище для баннеров профиля (изображения и видео до 50 МБ).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'profile-media',
  'profile-media',
  true,
  52428800,
  array['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm']
)
on conflict (id) do update
set public = true,
    file_size_limit = 52428800,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "PhotoChinese users upload own banner" on storage.objects;
create policy "PhotoChinese users upload own banner"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'profile-media'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "PhotoChinese users update own banner" on storage.objects;
create policy "PhotoChinese users update own banner"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'profile-media'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'profile-media'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "PhotoChinese users delete own banner" on storage.objects;
create policy "PhotoChinese users delete own banner"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'profile-media'
  and (storage.foldername(name))[1] = auth.uid()::text
);
