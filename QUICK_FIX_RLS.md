# Quick Fix - Disable RLS for Feature Requests

Run this in Supabase SQL Editor:

```sql
-- Disable RLS entirely for user_feature_requests
ALTER TABLE user_feature_requests DISABLE ROW LEVEL SECURITY;
```

This will allow anyone to submit feature requests without any restrictions.

