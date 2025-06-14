import { supabase } from '../services/supabase';

export const fetchUserProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return { data };
  } catch (error) {
    console.error('Error fetching profile:', error);
    return { error };
  }
};

export const fetchUserApplications = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('job_applications')
      .select(`
        *,
        jobs:jobs (*)
      `)
      .eq('applicant_id', userId);

    if (error) throw error;
    return { data };
  } catch (error) {
    console.error('Error fetching applications:', error);
    return { error };
  }
};

export const fetchJobs = async () => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data };
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return { error };
  }
};

export const fetchAnalytics = async () => {
  try {
    const { data, error } = await supabase
      .from('analytics')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data };
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return { error };
  }
}; 