# Fix Database Policy for Anonymous Feature Requests

## Problem
You're getting this error:
```
Error: new row violates row-level security policy for table "feature_requests"
```

This is because your Supabase database has Row Level Security (RLS) that only allows authenticated users to insert feature requests. We need to update it to allow anonymous submissions.

## Solution - Apply Database Migration

### Option 1: Using Supabase Dashboard (Easiest)

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Go to **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy and paste this SQL:

```sql
-- Drop existing restrictive policy
DROP POLICY IF EXISTS "Users can insert their own feature requests" ON feature_requests;
DROP POLICY IF EXISTS "Anyone can insert feature requests" ON feature_requests;

-- Create new policy that allows anyone to insert
CREATE POLICY "Anyone can insert feature requests"
  ON feature_requests
  FOR INSERT
  WITH CHECK (true);
```

6. Click **Run** or press `Ctrl+Enter` (Windows/Linux) or `Cmd+Enter` (Mac)
7. You should see "Success. No rows returned"

### Option 2: Using Supabase CLI

If you have Supabase CLI installed:

```bash
cd /Users/borabafli/Desktop/HelloWorld/StartUps/wisdomwise
supabase db push
```

This will apply the migration file: `supabase/migrations/fix_anonymous_feature_requests.sql`

## Verify It Works

1. Restart your app: `npm start`
2. Open the Feature Request modal
3. Type a message (at least 10 characters)
4. Click Submit
5. You should see the success screen with the turtle! 🐢

## What This Changes

**Before:**
- Only logged-in users could submit feature requests
- Anonymous users got security policy error

**After:**
- Anyone can submit feature requests (logged in or anonymous)
- Logged-in users: `user_id` and `email` are saved
- Anonymous users: `user_id` and `email` are saved as `NULL`
- You can still track which requests came from authenticated users

## Security Note

This is safe because:
- Feature requests are not sensitive data
- You're still tracking platform and timestamp
- You can still identify requests from logged-in users
- The table has validation (10-500 characters)
- There's no way to view other users' requests

