### Tablas para generar en supabase

# sin crear:

create extension if not exists pgcrypto;

-- =========================================
-- 1. GASTOS PERSONALES
-- =========================================
create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  amount numeric(10,2) not null check (amount > 0),
  category text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_expenses_user_id on public.expenses(user_id);
create index if not exists idx_expenses_created_at on public.expenses(created_at desc);

-- =========================================
-- 2. PERFILES
-- =========================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_profiles_email on public.profiles(email);

-- =========================================
-- 3. GRUPOS COMPARTIDOS
-- =========================================
create table if not exists public.shared_groups (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  invite_code text not null unique,
  created_at timestamptz not null default now()
);

create index if not exists idx_shared_groups_owner_user_id on public.shared_groups(owner_user_id);
create index if not exists idx_shared_groups_invite_code on public.shared_groups(invite_code);

-- =========================================
-- 4. MIEMBROS DEL GRUPO
-- =========================================
create table if not exists public.shared_group_members (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.shared_groups(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'member')),
  joined_at timestamptz not null default now(),
  unique (group_id, user_id)
);

create index if not exists idx_shared_group_members_group_id on public.shared_group_members(group_id);
create index if not exists idx_shared_group_members_user_id on public.shared_group_members(user_id);

-- =========================================
-- 5. GASTOS COMPARTIDOS
-- =========================================
create table if not exists public.shared_expenses (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.shared_groups(id) on delete cascade,
  created_by_user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  amount numeric(10,2) not null check (amount > 0),
  category text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_shared_expenses_group_id on public.shared_expenses(group_id);
create index if not exists idx_shared_expenses_created_by_user_id on public.shared_expenses(created_by_user_id);
create index if not exists idx_shared_expenses_created_at on public.shared_expenses(created_at desc);
# creado:
