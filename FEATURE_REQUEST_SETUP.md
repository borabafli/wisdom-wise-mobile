# Feature Request System - Setup Instructions

## Overview
A feature request submission system has been implemented that allows users to submit their ideas directly from the Profile screen. The requests are stored in a Supabase database table.

## What Was Implemented

### 1. Frontend Components
- **FeatureRequestModal**: A simple modal with a text input where users can type their feature requests (10-500 characters)
- **ProfileScreen Integration**: Added "Request Feature" menu item in the Profile screen
- **Multilingual Support**: Full translations across all 6 languages (English, German, French, Turkish, Spanish, Portuguese)

### 2. Backend Service
- **featureRequestService.ts**: Handles submission and validation of feature requests
- Direct Supabase integration (no edge function needed for basic functionality)

### 3. Database Table
- **Table Name**: `feature_requests`
- **Location**: Your Supabase project at tarwryruagxsoaljzoot.supabase.co

## IMPORTANT: You Need to Create the Supabase Table

The Supabase table has NOT been created yet. You need to run the SQL migration script in your Supabase dashboard.

### Steps to Create the Table:

1. **Go to your Supabase Dashboard**: https://supabase.com/dashboard/project/tarwryruagxsoaljzoot

2. **Navigate to SQL Editor**: Click on "SQL Editor" in the left sidebar

3. **Run the Migration Script**:
   - Click "New Query"
   - Copy the entire contents of `/supabase/migrations/create_feature_requests_table.sql`
   - Paste it into the SQL editor
   - Click "Run" or press Cmd/Ctrl + Enter

4. **Verify Table Creation**:
   - Go to "Table Editor" in the left sidebar
   - You should see a new table called `feature_requests`

### What the Migration Script Does:

```sql
-- Creates table with these columns:
- id (uuid, auto-generated primary key)
- user_id (uuid, linked to auth.users)
- feature_text (text, 10-500 characters, required)
- created_at (timestamp, auto-generated)
- status (text, default 'submitted')
- user_email (text, optional)
- platform (text, 'ios' or 'android', optional)

-- Security:
- Enables Row Level Security (RLS)
- Users can INSERT their own requests
- Users can SELECT (view) only their own requests

-- Performance:
- Indexes on user_id, created_at, and status for fast queries
```

## Files Created/Modified

### New Files:
1. `/src/components/modals/FeatureRequestModal.tsx` - Modal component
2. `/src/styles/components/FeatureRequestModal.styles.ts` - Styling
3. `/src/services/featureRequestService.ts` - Service layer
4. `/supabase/migrations/create_feature_requests_table.sql` - SQL migration script

### Modified Files:
1. `/src/screens/ProfileScreen.tsx` - Added menu item and modal
2. `/src/locales/en.json` - English translations
3. `/src/locales/de.json` - German translations
4. `/src/locales/fr.json` - French translations
5. `/src/locales/tr.json` - Turkish translations
6. `/src/locales/es.json` - Spanish translations
7. `/src/locales/pt.json` - Portuguese translations

## How It Works

1. User opens Profile screen
2. Taps on "Request Feature" menu item
3. Modal opens with a simple text input
4. User types their feature idea (10-500 characters)
5. Taps "Submit"
6. Request is saved to Supabase `feature_requests` table
7. Success message is shown

## Viewing Submitted Requests

### Option 1: Supabase Dashboard
1. Go to Supabase Dashboard > Table Editor
2. Select `feature_requests` table
3. View all submitted requests

### Option 2: Query in SQL Editor
```sql
SELECT
  id,
  feature_text,
  user_email,
  platform,
  status,
  created_at
FROM feature_requests
ORDER BY created_at DESC;
```

### Option 3: Export to CSV
1. In Table Editor, click the `feature_requests` table
2. Click "Download CSV" button
3. Open in Excel or Google Sheets

## Filtering and Management

You can update the status of requests:

```sql
-- Mark as reviewing
UPDATE feature_requests
SET status = 'reviewing'
WHERE id = 'some-uuid-here';

-- Mark as planned
UPDATE feature_requests
SET status = 'planned'
WHERE id = 'some-uuid-here';

-- Mark as completed
UPDATE feature_requests
SET status = 'completed'
WHERE id = 'some-uuid-here';
```

## Testing the Feature

1. **Run the SQL migration first** (see steps above)
2. Start your app: `npx expo start`
3. Navigate to Profile screen
4. Tap "Request Feature" (or localized equivalent)
5. Type a test feature request
6. Submit
7. Check Supabase dashboard to see the request

## Troubleshooting

### Error: "relation 'feature_requests' does not exist"
- **Solution**: You haven't run the SQL migration yet. Follow the steps in "IMPORTANT: You Need to Create the Supabase Table" above.

### Error: "Supabase not available"
- **Solution**: Check your `.env` file has the correct Supabase URL and anon key.

### Requests not showing in dashboard
- **Solution**: Make sure RLS policies are created correctly by re-running the migration script.

## Future Enhancements (Optional)

If you want to add more features later:

1. **Email Notifications**: Create a Supabase Edge Function to send you an email when a new request is submitted
2. **User View**: Allow users to see their past requests with status updates
3. **Voting System**: Let users upvote existing feature requests
4. **Admin Dashboard**: Create an admin panel to manage and respond to requests

## Security Notes

- Row Level Security (RLS) is enabled
- Users can only see their own requests
- You (as the project owner) can see all requests in the Supabase dashboard
- User emails are stored for follow-up communication
- Platform info helps you understand which platform users prefer

---

**Next Step**: Go to your Supabase dashboard and run the SQL migration script!

be water my friend, take care 🧘🏼‍♀️
