// Run this script to apply database migrations
// Usage: node apply-migrations.js

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Configure dotenv
dotenv.config();

// ES modules equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

async function runMigrations() {
  try {
    console.log('Starting database migrations...');
    
    // Read all SQL files in the migrations directory
    const migrationsDir = path.join(__dirname, 'migrations');
    const files = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Sort to apply migrations in order
    
    console.log(`Found ${files.length} migration(s) to apply`);
    
    for (const file of files) {
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      
      console.log(`\nApplying migration: ${file}`);
      console.log('----------------------------------------');
      
      // Split the SQL file into individual statements
      const statements = sql
        .split(';')
        .map(statement => statement.trim())
        .filter(statement => statement.length > 0);
      
      // Execute each statement
      for (const [index, statement] of statements.entries()) {
        console.log(`Executing statement ${index + 1}/${statements.length}...`);
        const { error } = await supabase.rpc('pg_sql', { sql: statement });
        
        if (error) {
          console.error(`Error in statement ${index + 1}:`, error.message);
          console.error('Statement:', statement);
          throw error;
        }
      }
      
      console.log(`✅ Successfully applied migration: ${file}`);
    }
    
    console.log('\n✅ All migrations applied successfully!');
    
  } catch (error) {
    console.error('\n❌ Error running migrations:', error);
    process.exit(1);
  }
}

runMigrations();
