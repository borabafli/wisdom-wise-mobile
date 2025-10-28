-- Create feature_requests table
CREATE TABLE IF NOT EXISTS feature_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  feature_text text NOT NULL CHECK (char_length(feature_text) >= 10 AND char_length(feature_text) <= 500),
  created_at timestamptz DEFAULT now(),
  status text DEFAULT 'submitted' CHECK (status IN ('submitted', 'reviewing', 'planned', 'completed', 'declined')),
  user_email text,
  platform text CHECK (platform IN ('ios', 'android', 'web', null))
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_feature_requests_user_id ON feature_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_feature_requests_created_at ON feature_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feature_requests_status ON feature_requests(status);

-- Enable Row Level Security
ALTER TABLE feature_requests ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can insert their own feature requests" ON feature_requests;
DROP POLICY IF EXISTS "Users can view their own feature requests" ON feature_requests;
DROP POLICY IF EXISTS "Anyone can insert feature requests" ON feature_requests;

-- Policy: Anyone can insert feature requests (including anonymous users)
CREATE POLICY "Anyone can insert feature requests"
  ON feature_requests
  FOR INSERT
  WITH CHECK (true);

-- Policy: Users can view their own feature requests (if logged in)
CREATE POLICY "Users can view their own feature requests"
  ON feature_requests
  FOR SELECT
  USING (auth.uid() = user_id);

-- Optional: Admin policy (uncomment if you want admin access)
-- CREATE POLICY "Admins can view all feature requests"
--   ON feature_requests
--   FOR SELECT
--   USING (auth.jwt() ->> 'role' = 'admin');

COMMENT ON TABLE feature_requests IS 'User feature requests submitted through the app';
COMMENT ON COLUMN feature_requests.feature_text IS 'The feature request text (10-500 characters)';
COMMENT ON COLUMN feature_requests.status IS 'Request status: submitted, reviewing, planned, completed, declined';
COMMENT ON COLUMN feature_requests.platform IS 'Platform where request was submitted: ios, android, web';
