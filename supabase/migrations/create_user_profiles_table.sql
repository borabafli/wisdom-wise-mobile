-- Create user_profiles table to persist user profile data across sessions
-- This table stores user names and preferences that should survive sign-out/sign-in

create table if not exists public.user_profiles (
  id uuid references auth.users on delete cascade primary key,
  first_name text not null,
  last_name text,
  display_name text,
  emoji_preference text check (emoji_preference in ('female', 'male', 'neutral')),
  motivation text,
  motivation_timestamp timestamptz,
  challenges text[],
  goals text[],
  onboarding_values text[],
  onboarding_focus_areas text[],
  onboarding_age_group text,
  values_timestamp timestamptz,
  focus_areas_timestamp timestamptz,
  challenges_timestamp timestamptz,
  baseline_mood integer check (baseline_mood between 1 and 10),
  baseline_mood_timestamp timestamptz,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Enable Row Level Security
alter table public.user_profiles enable row level security;

-- Create policies for user_profiles
-- Users can only read and update their own profile
create policy "Users can view their own profile"
  on public.user_profiles
  for select
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.user_profiles
  for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.user_profiles
  for update
  using (auth.uid() = id);

-- Create updated_at trigger function if it doesn't exist
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger to automatically update updated_at
create trigger set_updated_at
  before update on public.user_profiles
  for each row
  execute function public.handle_updated_at();

-- Create index for faster lookups
create index if not exists user_profiles_id_idx on public.user_profiles(id);

-- Grant necessary permissions
grant usage on schema public to anon, authenticated;
grant select, insert, update on public.user_profiles to authenticated;
