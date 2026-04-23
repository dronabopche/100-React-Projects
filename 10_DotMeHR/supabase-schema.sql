-- ============================================================
-- HireFlow - Supabase Database Schema
-- Run this in your Supabase SQL editor to set up all tables
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── Jobs Table ──────────────────────────────────────────────
create table if not exists jobs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  fields jsonb not null default '[]',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger jobs_updated_at
  before update on jobs
  for each row execute function update_updated_at();

-- RLS Policies for jobs
alter table jobs enable row level security;

create policy "Users can view own jobs"
  on jobs for select
  using (auth.uid() = user_id);

create policy "Users can create jobs"
  on jobs for insert
  with check (auth.uid() = user_id);

create policy "Users can update own jobs"
  on jobs for update
  using (auth.uid() = user_id);

create policy "Users can delete own jobs"
  on jobs for delete
  using (auth.uid() = user_id);

-- Public read for application forms (no auth needed)
create policy "Anyone can view active job forms"
  on jobs for select
  using (is_active = true);

-- ─── Responses Table ─────────────────────────────────────────
create table if not exists responses (
  id uuid primary key default uuid_generate_v4(),
  job_id uuid not null references jobs(id) on delete cascade,
  
  -- Standard fields
  name text,
  email text,
  phone text,
  resume_url text,
  github text,
  linkedin text,
  portfolio text,
  cover_letter text,
  
  -- AI scoring results
  score integer check (score >= 0 and score <= 100),
  category text check (category in ('Highly Relevant', 'Medium', 'Not Relevant')),
  ai_summary text,
  recommendation text check (recommendation in ('Shortlist', 'Review', 'Reject')),
  
  -- Management
  status text not null default 'pending' 
    check (status in ('pending', 'shortlisted', 'rejected', 'interviewing')),
  notes text,
  
  -- Extra fields stored as jsonb
  extra_data jsonb default '{}',
  
  submitted_at timestamptz not null default now()
);

-- Index for faster lookups
create index responses_job_id_idx on responses(job_id);
create index responses_status_idx on responses(status);
create index responses_score_idx on responses(score desc);

-- RLS for responses
alter table responses enable row level security;

-- Anyone can insert (for public application forms)
create policy "Anyone can submit applications"
  on responses for insert
  with check (true);

-- HR can view responses for their jobs
create policy "HR can view responses for own jobs"
  on responses for select
  using (
    exists (
      select 1 from jobs
      where jobs.id = responses.job_id
      and jobs.user_id = auth.uid()
    )
  );

-- HR can update responses (scores, status, notes)
create policy "HR can update responses for own jobs"
  on responses for update
  using (
    exists (
      select 1 from jobs
      where jobs.id = responses.job_id
      and jobs.user_id = auth.uid()
    )
  );

-- ─── Schedules Table ─────────────────────────────────────────
create table if not exists schedules (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  response_id uuid references responses(id) on delete set null,
  job_id uuid references jobs(id) on delete set null,
  
  candidate_name text,
  candidate_email text not null,
  job_title text,
  
  scheduled_at timestamptz not null,
  duration_minutes integer not null default 45,
  format text not null default 'Video Call',
  notes text,
  email_sent boolean default false,
  
  created_at timestamptz not null default now()
);

create index schedules_user_id_idx on schedules(user_id);
create index schedules_scheduled_at_idx on schedules(scheduled_at);

-- RLS for schedules
alter table schedules enable row level security;

create policy "Users can manage own schedules"
  on schedules for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ─── Storage Bucket ──────────────────────────────────────────
-- Run this in Supabase Dashboard > Storage to create the bucket:
-- 1. Create a bucket named "resumes"
-- 2. Set it to Public (so HR can view resume links)
-- Or via SQL:

insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', true)
on conflict do nothing;

-- Storage policies
create policy "Anyone can upload resumes"
  on storage.objects for insert
  with check (bucket_id = 'resumes');

create policy "Anyone can view resumes"
  on storage.objects for select
  using (bucket_id = 'resumes');

create policy "HR can delete resumes"
  on storage.objects for delete
  using (bucket_id = 'resumes' and auth.role() = 'authenticated');
