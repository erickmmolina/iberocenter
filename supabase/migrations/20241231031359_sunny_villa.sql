/*
  # Contacts Table Migration
  
  1. Changes
    - Safely create contacts table if it doesn't exist
    - Add RLS policies for user data protection
  
  2. Security
    - Enable RLS on contacts table
    - Add policy for authenticated users to manage their own contacts
*/

-- Contacts table
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

-- Only create policy if it doesn't exist
do $$
begin
    if not exists (
        select 1 from pg_policies 
        where schemaname = 'public' 
        and tablename = 'contacts' 
        and policyname = 'Users can manage their contacts'
    ) then
        alter table public.contacts enable row level security;
        
        create policy "Users can manage their contacts"
            on public.contacts for all
            to authenticated
            using (auth.uid() = user_id)
            with check (auth.uid() = user_id);
    end if;
end $$;