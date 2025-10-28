import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tarwryruagxsoaljzoot.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhcndyeXJ1YWd4c29hbGp6b290Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNTc0NTY5OCwiZXhwIjoyMDUxMzIxNjk4fQ.Kl7B1lT-N4XgcqZjqVLlK1chyQGG2CrjPkxlHvCyTwU';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createFeatureRequestsTable() {
  console.log('Creating feature_requests table...');

  const createTableSQL = `
    -- Create the table
    CREATE TABLE IF NOT EXISTS feature_requests (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
      feature_text text NOT NULL,
      created_at timestamptz DEFAULT now(),
      status text DEFAULT 'submitted',
      user_email text,
      platform text
    );

    -- Enable RLS
    ALTER TABLE feature_requests ENABLE ROW LEVEL SECURITY;

    -- Create policies
    DROP POLICY IF EXISTS "Users can insert their own feature requests" ON feature_requests;
    CREATE POLICY "Users can insert their own feature requests"
      ON feature_requests
      FOR INSERT
      WITH CHECK (auth.uid() = user_id OR auth.uid() IS NOT NULL);

    DROP POLICY IF EXISTS "Users can view their own feature requests" ON feature_requests;
    CREATE POLICY "Users can view their own feature requests"
      ON feature_requests
      FOR SELECT
      USING (auth.uid() = user_id);
  `;

  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql: createTableSQL });

    if (error) {
      console.error('Error creating table:', error);
      process.exit(1);
    }

    console.log('✓ Table created successfully!');
    console.log('✓ RLS enabled');
    console.log('✓ Policies created');
    process.exit(0);
  } catch (err) {
    console.error('Unexpected error:', err);
    process.exit(1);
  }
}

createFeatureRequestsTable();
