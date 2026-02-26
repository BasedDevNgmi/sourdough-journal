-- Run this in your Supabase SQL Editor

-- Create the loaves table
create table public.loaves (
  id uuid primary key,
  name text not null,
  date text not null,
  created_at bigint not null,
  math jsonb not null,
  flours jsonb not null,
  timeline jsonb not null,
  starter jsonb not null,
  ratings jsonb not null,
  notes text,
  images text[]
);

-- Create the starter_logs table
create table public.starter_logs (
  id uuid primary key,
  created_at bigint not null,
  feed_ratio text not null,
  starter_amount_g int not null,
  flour_fed_g int not null,
  water_fed_g int not null,
  notes text
);

-- Enable RLS (Optional for now, but good practice. We can leave it open for initial testing or secure it based on a user ID if auth is added)
alter table public.loaves enable row level security;
alter table public.starter_logs enable row level security;

-- Create policies to allow all operations (for prototyping phase)
create policy "Allow all operations for anon" on public.loaves for all using (true) with check (true);
create policy "Allow all operations for anon" on public.starter_logs for all using (true) with check (true);
