-- Disable RLS on the original feature_requests table
-- Run this in Supabase SQL Editor

ALTER TABLE feature_requests DISABLE ROW LEVEL SECURITY;

-- Optional: Clean up the temporary table if you want
-- DROP TABLE IF EXISTS user_feature_requests;

