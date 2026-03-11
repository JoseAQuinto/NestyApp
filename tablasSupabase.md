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

# luego

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (
    id,
    email,
    display_name,
    created_at,
    updated_at
  )
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)),
    now(),
    now()
  );

  return new;
end;
$$;


# luego

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

# luego

create table if not exists public.shared_expense_splits (
  id uuid primary key default gen_random_uuid(),
  shared_expense_id uuid not null references public.shared_expenses(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  amount_owed numeric(10,2) not null check (amount_owed >= 0),
  created_at timestamptz not null default now(),
  unique (shared_expense_id, user_id)
);

create index if not exists idx_shared_expense_splits_shared_expense_id
  on public.shared_expense_splits(shared_expense_id);

create index if not exists idx_shared_expense_splits_user_id
  on public.shared_expense_splits(user_id);


--------------------------------------------------------------------
# ver usuarios sincronizados (igual no sale ninguno)
# CREAR UN USUARIO EN SUPABASE AUTH, y luego ejecutar:

select *
from public.profiles
order by created_at desc;

# creado:



### A TENER EN CUENTA
de momento:

Configuración recomendada en Supabase para desarrollo

En Authentication > Providers > Email:

Email provider: ON

Confirm email: OFF

Así el flujo será más simple:

usuario se registra

puede entrar directamente
--------------