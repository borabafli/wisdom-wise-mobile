import { useState, useEffect, useCallback } from 'react';
import { storageService, UserProfile } from '../services/storageService';

interface UseUserProfileReturn {
  profile: UserProfile | null;
  displayName: string;
  firstName: string;
  isLoading: boolean;
  error: string | null;
  updateProfile: (updates: Partial<Omit<UserProfile, 'createdAt' | 'updatedAt'>>) => Promise<boolean>;
  refreshProfile: () => Promise<void>;
}

export const useUserProfile = (): UseUserProfileReturn => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [displayName, setDisplayName] = useState<string>('Friend');
  const [firstName, setFirstName] = useState<string>('Friend');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load profile from storage
  const loadProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [profileData, displayNameData, firstNameData] = await Promise.all([
        storageService.getUserProfile(),
        storageService.getDisplayName(),
        storageService.getFirstName()
      ]);
      
      setProfile(profileData);
      setDisplayName(displayNameData);
      setFirstName(firstNameData);
    } catch (err) {
      console.error('Error loading user profile:', err);
      setError('Failed to load profile');
      // Set fallbacks
      setProfile(null);
      setDisplayName('Friend');
      setFirstName('Friend');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update profile
  const updateProfile = useCallback(async (
    updates: Partial<Omit<UserProfile, 'createdAt' | 'updatedAt'>>
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      // Validate inputs
      if (updates.firstName !== undefined && updates.firstName.length < 1) {
        setError('First name cannot be empty');
        return false;
      }
      
      if (updates.lastName !== undefined && updates.lastName.length < 1) {
        setError('Last name cannot be empty');
        return false;
      }

      // Check for reasonable length limits
      if (updates.firstName && updates.firstName.length > 50) {
        setError('First name must be 50 characters or less');
        return false;
      }
      
      if (updates.lastName && updates.lastName.length > 50) {
        setError('Last name must be 50 characters or less');
        return false;
      }

      // Basic validation for special characters (allow letters, spaces, hyphens, apostrophes)
      const namePattern = /^[a-zA-Z\s\-']+$/;
      if (updates.firstName && !namePattern.test(updates.firstName)) {
        setError('First name can only contain letters, spaces, hyphens, and apostrophes');
        return false;
      }
      
      if (updates.lastName && !namePattern.test(updates.lastName)) {
        setError('Last name can only contain letters, spaces, hyphens, and apostrophes');
        return false;
      }

      const updatedProfile = await storageService.updateUserProfile(updates);
      
      // Refresh all profile-related state
      const [newDisplayName, newFirstName] = await Promise.all([
        storageService.getDisplayName(),
        storageService.getFirstName()
      ]);
      
      setProfile(updatedProfile);
      setDisplayName(newDisplayName);
      setFirstName(newFirstName);
      
      return true;
    } catch (err) {
      console.error('Error updating user profile:', err);
      setError('Failed to update profile');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refresh profile data
  const refreshProfile = useCallback(async () => {
    await loadProfile();
  }, [loadProfile]);

  // Load profile on mount
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return {
    profile,
    displayName,
    firstName,
    isLoading,
    error,
    updateProfile,
    refreshProfile
  };
};

export default useUserProfile;