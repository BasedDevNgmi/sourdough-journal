-- Run this in your Supabase SQL Editor to secure your data by user!

-- 1. Add user_id column to existing tables
alter table public.loaves add column if not exists user_id uuid references auth.users not null default auth.uid();
alter table public.starter_logs add column if not exists user_id uuid references auth.users not null default auth.uid();

-- 2. Drop the old insecure prototyping policies
drop policy if exists "Allow all operations for anon" on public.loaves;
drop policy if exists "Allow all operations for anon" on public.starter_logs;

-- 3. Ensure RLS is active
alter table public.loaves enable row level security;
alter table public.starter_logs enable row level security;

-- 4. Create secure policies tied to auth.uid()
-- Loaves Policies
create policy "Users can view their own loaves" on public.loaves for select using (auth.uid() = user_id);
create policy "Users can insert their own loaves" on public.loaves for insert with check (auth.uid() = user_id);
create policy "Users can update their own loaves" on public.loaves for update using (auth.uid() = user_id);
create policy "Users can delete their own loaves" on public.loaves for delete using (auth.uid() = user_id);

-- Starter Logs Policies
create policy "Users can view their own starter logs" on public.starter_logs for select using (auth.uid() = user_id);
create policy "Users can insert their own starter logs" on public.starter_logs for insert with check (auth.uid() = user_id);
create policy "Users can update their own starter logs" on public.starter_logs for update using (auth.uid() = user_id);
create policy "Users can delete their own starter logs" on public.starter_logs for delete using (auth.uid() = user_id);
