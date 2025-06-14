import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key are required. Please check your .env file');
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