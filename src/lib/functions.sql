-- Function to increment application count
create or replace function increment_application_count(job_id uuid)
returns void as $$
begin
  update jobs
  set applications_count = applications_count + 1
  where id = job_id;
end;
$$ language plpgsql security definer;

-- Function to increment view count
create or replace function increment_view_count(job_id uuid)
returns void as $$
begin
  update jobs
  set views_count = views_count + 1
  where id = job_id;
end;
$$ language plpgsql security definer;

-- Function to get job statistics
create or replace function get_job_statistics(days_back integer default 30)
returns table (
  total_jobs bigint,
  active_jobs bigint,
  total_applications bigint,
  total_views bigint,
  application_rate numeric,
  view_to_application_rate numeric
) as $$
begin
  return query
  select
    count(distinct j.id)::bigint as total_jobs,
    count(distinct case when j.status = 'active' then j.id end)::bigint as active_jobs,
    sum(j.applications_count)::bigint as total_applications,
    sum(j.views_count)::bigint as total_views,
    case
      when count(distinct j.id) = 0 then 0
      else (sum(j.applications_count)::numeric / count(distinct j.id)::numeric)
    end as application_rate,
    case
      when sum(j.views_count) = 0 then 0
      else (sum(j.applications_count)::numeric / sum(j.views_count)::numeric)
    end as view_to_application_rate
  from jobs j
  where j.created_at >= now() - (days_back || ' days')::interval;
end;
$$ language plpgsql security definer; 