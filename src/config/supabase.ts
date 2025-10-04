import { createClient, SupabaseClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Don't throw errors in production - log and create null client
let supabase: SupabaseClient | null = null;
let supabaseInitError: string | null = null;

try {
  if (!supabaseUrl || !supabaseAnonKey) {
    supabaseInitError = 'Missing Supabase environment variables';
    console.error('[Supabase] INIT FAILED:', supabaseInitError);
    console.error('[Supabase] URL present:', !!supabaseUrl);
    console.error('[Supabase] KEY present:', !!supabaseAnonKey);
  } else {
    console.log("[Supabase] Initializing with URL:", supabaseUrl);
    console.log("[Supabase] KEY (first 6 chars):", supabaseAnonKey.slice(0, 6));

    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });

    console.log('[Supabase] Client created successfully');
  }
} catch (error) {
  supabaseInitError = `Supabase initialization error: ${error}`;
  console.error('[Supabase] INIT ERROR:', error);
}

// Export supabase client (can be null if init failed)
export { supabase, supabaseInitError };

// Helper to check if Supabase is available
export const isSupabaseAvailable = (): boolean => {
  return supabase !== null && supabaseInitError === null;
};

// Types
export interface User {
  id: string;
  email: string;
  user_metadata?: {
    first_name?: string;
    last_name?: string;
  };
}

export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  privacy_accepted: boolean;
  privacy_accepted_at?: string;
  created_at: string;
  updated_at: string;
}