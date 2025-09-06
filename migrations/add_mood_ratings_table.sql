-- Migration: Add mood_ratings table to track user mood after exercises
-- This allows the app to track which exercises are most helpful for users
-- and monitor mood patterns over time

-- Create mood_ratings table
CREATE TABLE IF NOT EXISTS mood_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_type TEXT NOT NULL,
  exercise_name TEXT,
  mood_rating DECIMAL(3,1) NOT NULL CHECK (mood_rating >= 0 AND mood_rating <= 5),
  helpfulness_rating DECIMAL(3,1) CHECK (helpfulness_rating >= 0 AND helpfulness_rating <= 5),
  session_id TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_mood_ratings_user_id ON mood_ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_mood_ratings_exercise_type ON mood_ratings(exercise_type);
CREATE INDEX IF NOT EXISTS idx_mood_ratings_created_at ON mood_ratings(created_at);
CREATE INDEX IF NOT EXISTS idx_mood_ratings_user_exercise ON mood_ratings(user_id, exercise_type);

-- Enable RLS (Row Level Security)
ALTER TABLE mood_ratings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own mood ratings" ON mood_ratings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own mood ratings" ON mood_ratings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own mood ratings" ON mood_ratings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own mood ratings" ON mood_ratings
  FOR DELETE USING (auth.uid() = user_id);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_mood_ratings_updated_at 
    BEFORE UPDATE ON mood_ratings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();