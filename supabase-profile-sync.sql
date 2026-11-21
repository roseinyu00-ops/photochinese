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
