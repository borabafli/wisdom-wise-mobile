# Profile Sync Setup Guide

## Problem Fixed
User profiles (names) were being lost after sign-out/sign-in because they were only stored in local AsyncStorage, which gets cleared during sign-out.

## Solution
Implemented a hybrid profile storage system:
- **Anonymous users**: Profiles stay in AsyncStorage only
- **Authenticated users**: Profiles sync to Supabase database and persist across sessions

## Setup Instructions

### 1. Apply Database Migration

Run the following command to create the `user_profiles` table in your Supabase database:

```bash
# If using Supabase CLI locally
npx supabase db reset

# OR apply migration manually via Supabase Dashboard
# Copy the SQL from: supabase/migrations/create_user_profiles_table.sql
# Run it in the SQL Editor at: https://app.supabase.com/project/YOUR_PROJECT/sql
```

### 2. Verify Migration

Check that the table was created successfully:

```sql
-- Run in Supabase SQL Editor
SELECT * FROM user_profiles LIMIT 1;
```

### 3. Test the Fix

1. **Update your profile** (while signed in):
   - Go to Profile → Edit Profile
   - Change your name (e.g., "Test User")
   - Save

2. **Sign out**:
   - Go to Profile → Sign Out
   - Confirm sign out

3. **Sign back in**:
   - Sign in with the same credentials
   - Navigate to Profile screen
   - ✅ Your name should still be "Test User" (not email username)

## How It Works

### For Authenticated Users:
1. **Profile Update** → Saves to AsyncStorage + Syncs to Supabase
2. **Sign Out** → Clears AsyncStorage (including profile)
3. **Sign In** → Loads profile from Supabase → Saves to AsyncStorage
4. **Result**: Profile persists across sign-out/sign-in cycles

### For Anonymous Users:
- Profile stays in AsyncStorage only (no Supabase sync)
- If they later create an account, first profile sync happens on next update

## Files Changed

### New Files:
- `supabase/migrations/create_user_profiles_table.sql` - Database schema
- `src/services/profileSyncService.ts` - Sync service
- `PROFILE_SYNC_SETUP.md` - This guide

### Modified Files:
- `src/contexts/AuthContext.tsx` - Load profile from Supabase on sign-in
- `src/hooks/useUserProfile.ts` - Sync profile to Supabase on update
- `src/services/authService.ts` - Already removes `user_profile` on sign-out (unchanged)

## Troubleshooting

### Profile still shows email after sign-in:
1. Check Supabase logs for errors
2. Verify the migration ran successfully
3. Update your profile again while signed in (triggers sync)
4. Sign out and sign back in

### "Profile not found" errors:
- This is normal for new users who haven't updated their profile yet
- The app will fall back to email username until they set their name

### Anonymous users:
- Profiles are NOT synced to Supabase (by design)
- If anonymous user creates account, they should update profile to trigger first sync

## Next Steps

After applying the migration:
1. Test with an existing authenticated user
2. Update profile → Sign out → Sign in → Verify name persists
3. Monitor Supabase logs for any sync errors
4. Consider adding a profile migration tool for existing users (optional)
