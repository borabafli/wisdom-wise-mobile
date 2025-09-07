/**
 * Sample Values Data Generator
 * Creates realistic values data for testing and demo purposes
 */

import { valuesService, type UserValue } from '../services/valuesService';

export const generateSampleValuesData = async (): Promise<boolean> => {
  try {
    // Clear existing values first to ensure clean generation
    await valuesService.clearAllValues();
    console.log('🧹 Cleared existing values data');
    
    const sampleValues: Omit<UserValue, 'id' | 'createdDate' | 'updatedDate'>[] = [
      {
        name: 'Connection',
        userDescription: 'Being close to my family and friends gives me strength. I feel most alive when I\'m sharing meaningful moments with people I care about.',
        importance: 5,
        sourceSessionId: 'sample-session-1',
        tags: ['family', 'friendship', 'relationships', 'love']
      },
      {
        name: 'Growth',
        userDescription: 'I love learning new things and becoming a better version of myself. Every challenge is an opportunity to grow stronger.',
        importance: 5,
        sourceSessionId: 'sample-session-2',
        tags: ['learning', 'development', 'improvement', 'progress']
      },
      {
        name: 'Creativity',
        userDescription: 'Expressing myself through art, writing, and creative projects brings me deep joy. It\'s how I process my emotions and share my unique perspective.',
        importance: 4,
        sourceSessionId: 'sample-session-3',
        tags: ['art', 'expression', 'originality', 'imagination']
      },
      {
        name: 'Health',
        userDescription: 'Taking care of my body and mind is essential for everything else I want to do. When I feel physically strong, I feel mentally resilient.',
        importance: 4,
        sourceSessionId: 'sample-session-4',
        tags: ['fitness', 'wellness', 'energy', 'vitality']
      },
      {
        name: 'Freedom',
        userDescription: 'Having the ability to make my own choices and live life on my terms is incredibly important. I value independence and flexibility.',
        importance: 4,
        sourceSessionId: 'sample-session-5',
        tags: ['independence', 'choice', 'autonomy', 'flexibility']
      },
      {
        name: 'Compassion',
        userDescription: 'Being kind and understanding toward others, especially when they\'re struggling, feels like my purpose. Small acts of kindness make a big difference.',
        importance: 3,
        sourceSessionId: 'sample-session-6',
        tags: ['kindness', 'empathy', 'service', 'understanding']
      },
      {
        name: 'Adventure',
        userDescription: 'Exploring new places, trying new experiences, and stepping outside my comfort zone keeps life exciting and meaningful.',
        importance: 3,
        sourceSessionId: 'sample-session-7',
        tags: ['exploration', 'travel', 'novelty', 'excitement']
      },
      {
        name: 'Achievement',
        userDescription: 'Working hard toward meaningful goals and seeing the results of my efforts gives me a sense of purpose and pride.',
        importance: 3,
        sourceSessionId: 'sample-session-8',
        tags: ['goals', 'success', 'accomplishment', 'progress']
      }
    ];

    console.log('🎯 Generating sample values data...');
    console.log('- Total values to create:', sampleValues.length);
    
    // Save all sample values
    for (const valueData of sampleValues) {
      await valuesService.saveValue(valueData);
    }

    // Verify what was actually saved
    const savedValues = await valuesService.getAllValues();
    console.log('✅ Sample values data generated successfully:');
    console.log('- Total saved values:', savedValues.length);
    console.log('- Sample values:', savedValues.slice(0, 3).map(v => `${v.name} (${v.importance}/5)`));

    return true;
  } catch (error) {
    console.error('Error generating sample values data:', error);
    return false;
  }
};

export const clearSampleValuesData = async (): Promise<boolean> => {
  try {
    await valuesService.clearAllValues();
    console.log('Sample values data cleared');
    return true;
  } catch (error) {
    console.error('Error clearing sample values data:', error);
    return false;
  }
};