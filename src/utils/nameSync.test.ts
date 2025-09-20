/**
 * Test file to verify name synchronization between systems
 * This is a temporary file to test the name consistency
 */

import { storageService } from '../services/storageService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const testNameSynchronization = async () => {
  console.log('🧪 Testing Name Synchronization...');
  
  try {
    // Test 1: Save name via onboarding flow (StorageService)
    console.log('1. Testing onboarding name save...');
    await storageService.updateUserProfile({
      firstName: 'TestUser',
      lastName: 'FromOnboarding'
    });
    
    // Test 2: Retrieve name via different methods
    console.log('2. Testing name retrieval...');
    const profile = await storageService.getUserProfile();
    const displayName = await storageService.getDisplayName();
    const firstName = await storageService.getFirstName();
    
    console.log('Profile:', profile);
    console.log('Display Name:', displayName);
    console.log('First Name:', firstName);
    
    // Test 3: Verify consistency
    const isConsistent = 
      profile?.firstName === 'TestUser' &&
      profile?.lastName === 'FromOnboarding' &&
      displayName === 'TestUser FromOnboarding' &&
      firstName === 'TestUser';
    
    console.log('✅ Name consistency test:', isConsistent ? 'PASSED' : 'FAILED');
    
    // Test 4: Test profile update (like from settings)
    console.log('3. Testing profile settings update...');
    await storageService.updateUserProfile({
      firstName: 'UpdatedUser',
      lastName: 'FromSettings'
    });
    
    const updatedDisplayName = await storageService.getDisplayName();
    const updatedFirstName = await storageService.getFirstName();
    
    console.log('Updated Display Name:', updatedDisplayName);
    console.log('Updated First Name:', updatedFirstName);
    
    // Test 5: Verify updates work
    const isUpdateConsistent = 
      updatedDisplayName === 'UpdatedUser FromSettings' &&
      updatedFirstName === 'UpdatedUser';
    
    console.log('✅ Update consistency test:', isUpdateConsistent ? 'PASSED' : 'FAILED');
    
    // Cleanup
    await AsyncStorage.removeItem('user_profile');
    console.log('🧹 Test cleanup completed');
    
    return isConsistent && isUpdateConsistent;
    
  } catch (error) {
    console.error('❌ Name synchronization test failed:', error);
    return false;
  }
};