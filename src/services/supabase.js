import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create and export the Supabase client with optimized configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storageKey: 'sb-hiring-agent-auth-token',
    storage: window.localStorage,
    debug: process.env.NODE_ENV !== 'production',
    flowType: 'pkce',
    // Add cookie options for better security
    cookieOptions: {
      name: 'sb-hiring-agent-auth-token',
      lifetime: 60 * 60 * 24 * 7, // 7 days
      domain: window.location.hostname,
      path: '/',
      sameSite: 'lax'
    }
  },
  global: {
    headers: {
      'X-Client-Info': 'hiring-agent/1.0.0',
      'apikey': supabaseAnonKey // Required for some Supabase endpoints
    },
    // Add retry logic for failed requests
    fetch: (url, options = {}) => {
      const retryCount = 3;
      let retries = 0;
      
      const attemptFetch = async () => {
        try {
          const response = await fetch(url, {
            ...options,
            headers: {
              ...options.headers,
              'apikey': supabaseAnonKey
            }
          });
          
          // If unauthorized, try to refresh the token
          if (response.status === 401 && retries < retryCount) {
            retries++;
            console.log(`Retrying request (${retries}/${retryCount})...`);
            return attemptFetch();
          }
          
          return response;
        } catch (error) {
          if (retries < retryCount) {
            retries++;
            console.log(`Retrying request after error (${retries}/${retryCount})...`, error);
            return attemptFetch();
          }
          throw error;
        }
      };
      
      return attemptFetch();
    }
  }
});

// Add global error handling for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Supabase auth state changed:', event, session);
  
  // Handle token refresh
  if (event === 'TOKEN_REFRESHED') {
    console.log('Token refreshed:', session);
  }
  
  // Handle sign out
  if (event === 'SIGNED_OUT') {
    console.log('User signed out');
    // Clear any stored data
    localStorage.removeItem('sb-hiring-agent-auth-token');
  }
});

// Debug: Log the current session on load
supabase.auth.getSession().then(({ data: { session } }) => {
  console.log('Initial session check:', session);
});

// Jobs
export const jobsService = {
  async getJobs() {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async createJob(jobData) {
    const { data, error } = await supabase
      .from('jobs')
      .insert([jobData])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateJob(jobId, jobData) {
    const { data, error } = await supabase
      .from('jobs')
      .update(jobData)
      .eq('id', jobId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteJob(jobId) {
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', jobId);
    if (error) throw error;
  }
};

// Applications
export const applicationsService = {
  async getApplications(userId = null) {
    let query = supabase
      .from('job_applications')
      .select(`
        *,
        jobs (
          title,
          company,
          location
        )
      `);
    
    if (userId) {
      query = query.eq('applicant_id', userId);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async createApplication(applicationData) {
    const { data, error } = await supabase
      .from('job_applications')
      .insert([applicationData])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateApplicationStatus(applicationId, status) {
    const { data, error } = await supabase
      .from('job_applications')
      .update({ status })
      .eq('id', applicationId)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};

// Users
export const usersService = {
  async getUsers() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async updateUser(userId, userData) {
    const { data, error } = await supabase
      .from('profiles')
      .update(userData)
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getUserProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) throw error;
    return data;
  }
};

// Analytics
export const analyticsService = {
  async getDashboardStats() {
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('count', { count: 'exact' });
    
    const { data: jobs, error: jobsError } = await supabase
      .from('jobs')
      .select('count', { count: 'exact' });
    
    const { data: applications, error: applicationsError } = await supabase
      .from('job_applications')
      .select('count', { count: 'exact' });

    if (usersError || jobsError || applicationsError) {
      throw new Error('Failed to fetch dashboard stats');
    }

    return {
      totalUsers: users[0]?.count || 0,
      totalJobs: jobs[0]?.count || 0,
      totalApplications: applications[0]?.count || 0
    };
  }
};