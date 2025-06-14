-- Drop existing tables if they exist
drop table if exists jobs cascade;
drop table if exists job_applications cascade;
drop table if exists settings cascade;
drop table if exists analytics cascade;
drop table if exists profiles cascade;

-- Create settings table for admin configuration
create table settings (
  id uuid default uuid_generate_v4() primary key,
  setting_key text not null unique,
  setting_value jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create jobs table with enhanced structure
create table jobs (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  company text not null,
  location text not null,
  type text not null,
  salary_range text,
  basic_requirements text not null,
  job_description text not null,
  skills text[] not null default '{}',
  experience_level text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  status text default 'active' check (status in ('active', 'closed', 'draft')) not null,
  posted_by uuid references auth.users(id),
  views_count integer default 0,
  applications_count integer default 0
);

-- Create job applications table for tracking candidates
create table job_applications (
  id uuid default uuid_generate_v4() primary key,
  job_id uuid references jobs(id) on delete cascade,
  applicant_id uuid references auth.users(id),
  status text default 'pending' check (status in ('pending', 'reviewed', 'shortlisted', 'rejected', 'hired')) not null,
  resume_url text,
  cover_letter text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(job_id, applicant_id)
);

-- Create analytics table for tracking metrics
create table analytics (
  id uuid default uuid_generate_v4() primary key,
  metric_name text not null,
  metric_value jsonb not null,
  timestamp timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(metric_name, timestamp)
);

-- Create profiles table
create table profiles (
  id uuid references auth.users(id) primary key,
  email text not null unique,
  full_name text,
  role text default 'candidate' check (role in ('candidate', 'employer', 'admin')) not null,
  avatar_url text,
  resume_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table jobs enable row level security;
alter table job_applications enable row level security;
alter table settings enable row level security;
alter table analytics enable row level security;
alter table profiles enable row level security;

-- Drop existing RLS policies that need correction before recreating them
drop policy if exists "Jobs can be updated by the poster or admin" on jobs;
drop policy if exists "Applications are viewable by the applicant and job poster" on job_applications;
drop policy if exists "Applications can be updated by admin or job poster" on job_applications;
drop policy if exists "Settings are viewable by admin" on settings;
drop policy if exists "Settings can be modified by admin" on settings;
drop policy if exists "Analytics are viewable by admin" on analytics;
drop policy if exists "Analytics can be modified by admin" on analytics;

-- RLS Policies for jobs
create policy "Jobs are viewable by everyone" 
  on jobs for select 
  using (true);

create policy "Jobs can be inserted by authenticated users" 
  on jobs for insert 
  with check (auth.role() = 'authenticated');

create policy "Jobs can be updated by the poster or admin" 
  on jobs for update 
  using (auth.uid() = posted_by or exists (
    select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin'
  ));

-- RLS Policies for job applications
create policy "Applications are viewable by the applicant and job poster" 
  on job_applications for select 
  using (
    auth.uid() = applicant_id 
    or exists (
      select 1 from jobs 
      where jobs.id = job_applications.job_id 
      and jobs.posted_by = auth.uid()
    )
    or exists (
      select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

create policy "Applications can be inserted by authenticated users" 
  on job_applications for insert 
  with check (auth.uid() = applicant_id);

create policy "Applications can be updated by admin or job poster" 
  on job_applications for update 
  using (
    exists (
      select 1 from jobs 
      where jobs.id = job_applications.job_id 
      and jobs.posted_by = auth.uid()
    )
    or exists (
      select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- RLS Policies for settings
create policy "Settings are viewable by admin" 
  on settings for select 
  using (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin'));

create policy "Settings can be modified by admin" 
  on settings for all 
  using (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin'));

-- RLS Policies for analytics
create policy "Analytics are viewable by admin" 
  on analytics for select 
  using (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin'));

create policy "Analytics can be modified by admin" 
  on analytics for all 
  using (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin'));

-- RLS Policies for profiles
create policy "Profiles are viewable by everyone"
  on profiles for select
  using (true);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = id);

-- Insert default settings
insert into settings (setting_key, setting_value) values
  ('job_posting_settings', '{"require_company_verification": false, "max_active_jobs": 10, "allowed_job_types": ["full-time", "part-time", "contract", "internship"]}'::jsonb),
  ('application_settings', '{"allow_multiple_applications": false, "require_resume": true, "require_cover_letter": false}'::jsonb),
  ('notification_settings', '{"email_notifications": true, "application_updates": true, "job_alerts": true}'::jsonb); 