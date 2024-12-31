/*
  # Unified Database Schema Setup & Policies

  Este archivo unifica:
    - Creación de las tablas companies y profiles (+ políticas).
    - Creación de la tabla contacts (+ políticas).
    - Creación de la tabla notifications (+ políticas).
*/

/* -------------------------------------------------------------------------- */
/* EXTENSIONES NECESARIAS */
/* -------------------------------------------------------------------------- */
create extension if not exists "pgcrypto";

/* -------------------------------------------------------------------------- */
/* TABLA COMPANIES */
/* -------------------------------------------------------------------------- */
create table if not exists public.companies (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    tax_id text,
    address text,
    phone text,
    email text,
    website text,
    created_at timestamptz default now()
);

/* POLÍTICAS PARA COMPANIES */
do $$
begin
    -- Habilitar RLS si no está habilitado
    alter table public.companies enable row level security;
exception when others then
    -- ignorar error si ya está habilitado
end $$;

-- Política: Users can insert company
do $$
begin
    if not exists (
        select 1 from pg_policies
        where schemaname = 'public'
        and tablename = 'companies'
        and policyname = 'Users can insert company'
    ) then
        create policy "Users can insert company"
            on public.companies for insert
            to authenticated
            with check (true);
    end if;
end $$;

-- Política: Users can view their company
do $$
begin
    if not exists (
        select 1 from pg_policies
        where schemaname = 'public'
        and tablename = 'companies'
        and policyname = 'Users can view their company'
    ) then
        create policy "Users can view their company"
            on public.companies for select
            to authenticated
            using (
                id in (
                    select company_id from public.profiles
                    where id = auth.uid()
                )
            );
    end if;
end $$;

/* -------------------------------------------------------------------------- */
/* TABLA PROFILES */
/* -------------------------------------------------------------------------- */
create table if not exists public.profiles (
    id uuid primary key references auth.users on delete cascade,
    name text not null,
    email text not null,
    avatar_url text,
    company_id uuid references public.companies,
    role text,
    created_at timestamptz default now()
);

/* POLÍTICAS PARA PROFILES */
do $$
begin
    -- Habilitar RLS si no está habilitado
    alter table public.profiles enable row level security;
exception when others then
    -- ignorar error si ya está habilitado
end $$;

-- Política: Users can insert own profile
do $$
begin
    if not exists (
        select 1 from pg_policies
        where schemaname = 'public'
        and tablename = 'profiles'
        and policyname = 'Users can insert own profile'
    ) then
        create policy "Users can insert own profile"
            on public.profiles for insert
            to authenticated
            with check (auth.uid() = id);
    end if;
end $$;

-- Política: Users can view own profile
do $$
begin
    if not exists (
        select 1 from pg_policies
        where schemaname = 'public'
        and tablename = 'profiles'
        and policyname = 'Users can view own profile'
    ) then
        create policy "Users can view own profile"
            on public.profiles for select
            to authenticated
            using (auth.uid() = id);
    end if;
end $$;

-- Política: Users can update own profile
do $$
begin
    if not exists (
        select 1 from pg_policies
        where schemaname = 'public'
        and tablename = 'profiles'
        and policyname = 'Users can update own profile'
    ) then
        create policy "Users can update own profile"
            on public.profiles for update
            to authenticated
            using (auth.uid() = id);
    end if;
end $$;

/* -------------------------------------------------------------------------- */
/* TABLA CONTACTS */
/* -------------------------------------------------------------------------- */
create table if not exists public.contacts (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.profiles(id) on delete cascade,
    name text not null,
    phone text not null,
    email text,
    company text,
    city text,
    notes text,
    avatar_url text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

/* POLÍTICAS PARA CONTACTS */
do $$
begin
    alter table public.contacts enable row level security;
exception when others then
    -- ignorar error si ya está habilitado
end $$;

do $$
begin
    if not exists (
        select 1 from pg_policies
        where schemaname = 'public'
        and tablename = 'contacts'
        and policyname = 'Users can manage their contacts'
    ) then
        create policy "Users can manage their contacts"
            on public.contacts for all
            to authenticated
            using (auth.uid() = user_id)
            with check (auth.uid() = user_id);
    end if;
end $$;

/* -------------------------------------------------------------------------- */
/* TABLA NOTIFICATIONS */
/* -------------------------------------------------------------------------- */
create table if not exists public.notifications (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.profiles(id) on delete cascade,
    type text not null,
    contact_name text,
    contact_number text,
    read boolean default false,
    created_at timestamptz default now()
);

/* POLÍTICAS PARA NOTIFICATIONS */
do $$
begin
    alter table public.notifications enable row level security;
exception when others then
    -- ignorar error si ya está habilitado
end $$;

do $$
begin
    if not exists (
        select 1 from pg_policies
        where schemaname = 'public'
        and tablename = 'notifications'
        and policyname = 'Users can manage their notifications'
    ) then
        create policy "Users can manage their notifications"
            on public.notifications for all
            to authenticated
            using (auth.uid() = user_id)
            with check (auth.uid() = user_id);
    end if;
end $$;
