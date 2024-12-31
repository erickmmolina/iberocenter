/*
  # Notifications Table Migration
  
  1. Changes
    - Safely create notifications table if it doesn't exist
    - Add RLS policies for user data protection
  
  2. Security
    - Enable RLS on notifications table
    - Add policy for authenticated users to manage their own notifications
*/

-- Notifications table
create table if not exists public.notifications (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.profiles(id) on delete cascade,
    type text not null,
    contact_name text,
    contact_number text,
    read boolean default false,
    created_at timestamptz default now()
);

-- Only create policy if it doesn't exist
do $$
begin
    if not exists (
        select 1 from pg_policies 
        where schemaname = 'public' 
        and tablename = 'notifications' 
        and policyname = 'Users can manage their notifications'
    ) then
        alter table public.notifications enable row level security;
        
        create policy "Users can manage their notifications"
            on public.notifications for all
            to authenticated
            using (auth.uid() = user_id)
            with check (auth.uid() = user_id);
    end if;
end $$;