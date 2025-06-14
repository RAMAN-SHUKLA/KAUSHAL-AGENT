// Run this script to reset your Supabase database
// Usage: node reset-db.js

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Configure dotenv
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase URL or key in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function resetDatabase() {
  try {
    console.log('Resetting database...');
    
    // Disable RLS on all tables
    const disableRls = await supabase.rpc('disable_rls_on_all_tables');
    if (disableRls.error) throw disableRls.error;
    
    // Drop all tables
    const dropTables = await supabase.rpc('drop_all_tables_in_schema', { schema_name: 'public' });
    if (dropTables.error) throw dropTables.error;
    
    console.log('Database reset successfully!');
    console.log('Run your migrations to recreate the schema.');
    
  } catch (error) {
    console.error('Error resetting database:', error);
    process.exit(1);
  }
}

resetDatabase();
