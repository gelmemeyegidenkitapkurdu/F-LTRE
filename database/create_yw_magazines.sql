-- Dedicated magazines table (separate from other categories)
create table if not exists public.yw_magazines (
  id text primary key,
  title text not null default '',
  issue text,
  owner text,
  content text,
  description text,
  link text,
  photo text,
  cover text,
  pdf text,
  pdf_name text,
  participant1 text,
  participant2 text,
  dialogues jsonb default '[]'::jsonb,
  views integer default 0,
  downloads integer default 0,
  created_at text
);

-- Dedicated magazine pdf table
create table if not exists public.yw_magazine_pdfs (
  id text primary key,
  magazine_id text not null references public.yw_magazines(id) on delete cascade,
  pdf text not null default '',
  pdf_name text,
  created_at text,
  updated_at text,
  unique (magazine_id)
);

create index if not exists idx_yw_magazine_pdfs_magazine_id
  on public.yw_magazine_pdfs (magazine_id);

alter table public.yw_magazines enable row level security;
alter table public.yw_magazine_pdfs enable row level security;

-- drop old policies to keep migration idempotent
drop policy if exists yw_magazines_read on public.yw_magazines;
drop policy if exists yw_magazines_insert on public.yw_magazines;
drop policy if exists yw_magazines_update on public.yw_magazines;
drop policy if exists yw_magazines_delete on public.yw_magazines;

drop policy if exists yw_magazine_pdfs_read on public.yw_magazine_pdfs;
drop policy if exists yw_magazine_pdfs_insert on public.yw_magazine_pdfs;
drop policy if exists yw_magazine_pdfs_update on public.yw_magazine_pdfs;
drop policy if exists yw_magazine_pdfs_delete on public.yw_magazine_pdfs;

-- Keep read open for site visitors
create policy yw_magazines_read
  on public.yw_magazines
  for select
  using (true);

create policy yw_magazine_pdfs_read
  on public.yw_magazine_pdfs
  for select
  using (true);

-- Keep admin write flow unblocked in current project setup
create policy yw_magazines_insert
  on public.yw_magazines
  for insert
  with check (true);

create policy yw_magazines_update
  on public.yw_magazines
  for update
  using (true)
  with check (true);

create policy yw_magazines_delete
  on public.yw_magazines
  for delete
  using (true);

create policy yw_magazine_pdfs_insert
  on public.yw_magazine_pdfs
  for insert
  with check (true);

create policy yw_magazine_pdfs_update
  on public.yw_magazine_pdfs
  for update
  using (true)
  with check (true);

create policy yw_magazine_pdfs_delete
  on public.yw_magazine_pdfs
  for delete
  using (true);

-- migrate existing pdf links from magazine table into dedicated pdf table
insert into public.yw_magazine_pdfs (id, magazine_id, pdf, pdf_name, created_at, updated_at)
select
  concat('pdf-', m.id),
  m.id,
  coalesce(m.pdf, ''),
  nullif(m.pdf_name, ''),
  coalesce(m.created_at, now()::text),
  now()::text
from public.yw_magazines m
where coalesce(m.pdf, '') <> ''
on conflict (magazine_id) do update set
  pdf = excluded.pdf,
  pdf_name = excluded.pdf_name,
  updated_at = now()::text;
