/*
  # Database Schema Update
  
  1. Changes
    - Safely create companies and profiles tables if they don't exist
    - Add RLS policies for security
    - Add proper references and constraints
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- Companies table
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

-- Only create policy if it doesn't exist
do $$
begin
    if not exists (
        select 1 from pg_policies 
        where schemaname = 'public' 
        and tablename = 'companies' 
        and policyname = 'Users can view their company'
    ) then
        alter table public.companies enable row level security;
        
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

-- Profiles table
create table if not exists public.profiles (
    id uuid primary key references auth.users on delete cascade,
    name text not null,
    email text not null,
    avatar_url text,
    company_id uuid references public.companies,
    role text,
    created_at timestamptz default now()
);

-- Only create policies if they don't exist
do $$
begin
    if not exists (
        select 1 from pg_policies 
        where schemaname = 'public' 
        and tablename = 'profiles'
    ) then
        alter table public.profiles enable row level security;
        
        create policy "Users can view own profile"
            on public.profiles for select
            to authenticated
            using (auth.uid() = id);

        create policy "Users can update own profile"
            on public.profiles for update
            to authenticated
            using (auth.uid() = id);
    end if;
end $$;