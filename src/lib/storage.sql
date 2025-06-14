-- Create a bucket for resumes
insert into storage.buckets (id, name, public) values ('resumes', 'resumes', false);

-- Enable RLS on the bucket
create policy "Resume access for owners and admins"
  on storage.objects for all using (
    -- Allow access if the user owns the resume (filename starts with their user ID)
    (storage.foldername(name))[1] = auth.uid()::text
    or
    -- Or if the user is an admin
    exists (
      select 1 from auth.users
      where auth.uid() = id
      and raw_user_meta_data->>'role' = 'admin'
    )
  ); 