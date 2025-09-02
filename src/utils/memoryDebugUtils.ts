import { memoryService } from '../services/memoryService';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Debug utilities to diagnose memory system issues
 */

export const debugMemorySystem = async () => {
  console.log('🔍 === MEMORY SYSTEM DEBUG ===');
  
  try {
    // 1. Check raw storage
    console.log('\n📦 1. CHECKING RAW STORAGE:');
    const insightsRaw = await AsyncStorage.getItem('memory_insights');
    const summariesRaw = await AsyncStorage.getItem('memory_summaries');
    const metadataRaw = await AsyncStorage.getItem('memory_extraction_metadata');
    
    console.log('- Raw insights data exists:', !!insightsRaw);
    console.log('- Raw summaries data exists:', !!summariesRaw);
    console.log('- Raw metadata exists:', !!metadataRaw);
    
    if (insightsRaw) {
      console.log('- Raw insights length:', insightsRaw.length);
      console.log('- Raw insights preview:', insightsRaw.substring(0, 100));
    }
    
    if (summariesRaw) {
      console.log('- Raw summaries length:', summariesRaw.length);
      console.log('- Raw summaries preview:', summariesRaw.substring(0, 100));
    }

    // 2. Check memory service methods
    console.log('\n🧠 2. CHECKING MEMORY SERVICE:');
    const insights = await memoryService.getInsights();
    const summaries = await memoryService.getSummaries();
    const memoryContext = await memoryService.getMemoryContext();
    
    console.log('- Insights from service:', insights.length);
    console.log('- Summaries from service:', summaries.length);
    console.log('- Memory context insights:', memoryContext.insights.length);
    console.log('- Memory context summaries:', memoryContext.summaries.length);
    
    // 3. Check memory stats
    console.log('\n📊 3. MEMORY STATS:');
    const stats = await memoryService.getMemoryStats();
    console.log('- Memory stats:', stats);
    
    // 4. Test context formatting
    console.log('\n📝 4. CONTEXT FORMATTING TEST:');
    const formattedContext = memoryService.formatMemoryForContext(memoryContext);
    console.log('- Formatted context length:', formattedContext.length);
    console.log('- Formatted context preview:', formattedContext.substring(0, 300));
    
    // 5. Check storage keys
    console.log('\n🔑 5. ALL STORAGE KEYS:');
    const allKeys = await AsyncStorage.getAllKeys();
    const memoryKeys = allKeys.filter(key => key.startsWith('memory_'));
    console.log('- All memory-related keys:', memoryKeys);
    
    return {
      success: true,
      hasRawInsights: !!insightsRaw,
      hasRawSummaries: !!summariesRaw,
      insightCount: insights.length,
      summaryCount: summaries.length,
      contextLength: formattedContext.length,
      memoryKeys
    };
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const createTestMemoryData = async () => {
  console.log('🌱 Creating test memory data...');
  
  try {
    // Create test insights
    const testInsights = [
      {
        id: 'debug_insight_1',
        category: 'automatic_thoughts' as const,
        content: 'DEBUG: User tends to catastrophize about work performance and assume worst outcomes',
        confidence: 0.85,
        date: new Date().toISOString(),
        sourceMessageIds: ['debug_msg_1', 'debug_msg_2']
      },
      {
        id: 'debug_insight_2',
        category: 'emotions' as const,
        content: 'DEBUG: Experiences high anxiety when facing uncertainty or new challenges',
        confidence: 0.78,
        date: new Date().toISOString(),
        sourceMessageIds: ['debug_msg_3', 'debug_msg_4']
      },
      {
        id: 'debug_insight_3',
        category: 'strengths' as const,
        content: 'DEBUG: Shows strong self-awareness and willingness to explore difficult patterns',
        confidence: 0.92,
        date: new Date().toISOString(),
        sourceMessageIds: ['debug_msg_5', 'debug_msg_6']
      }
    ];
    
    // Create test summary
    const testSummary = {
      id: 'debug_summary_1',
      text: 'DEBUG: User explored work-related anxiety stemming from perfectionist beliefs. Identified catastrophic thinking patterns and made connection to childhood experiences. Expressed readiness to practice self-compassion techniques.',
      date: new Date().toISOString(),
      type: 'session' as const,
      messageCount: 12
    };
    
    // Save test data
    for (const insight of testInsights) {
      await memoryService.saveInsight(insight);
    }
    await memoryService.saveSummary(testSummary);
    
    console.log('✅ Test memory data created');
    console.log('- Created insights:', testInsights.length);
    console.log('- Created summaries: 1');
    
    return true;
    
  } catch (error) {
    console.error('❌ Failed to create test memory data:', error);
    return false;
  }
};

export const clearAllMemoryData = async () => {
  console.log('🧹 Clearing all memory data...');
  
  try {
    await memoryService.clearAllMemories();
    console.log('✅ All memory data cleared');
    return true;
  } catch (error) {
    console.error('❌ Failed to clear memory data:', error);
    return false;
  }
};

export const testMemoryFlow = async () => {
  console.log('🔄 === TESTING COMPLETE MEMORY FLOW ===');
  
  try {
    // 1. Clear existing data
    await clearAllMemoryData();
    
    // 2. Create test data
    await createTestMemoryData();
    
    // 3. Test retrieval
    const debugResult = await debugMemorySystem();
    
    // 4. Test context injection simulation
    console.log('\n🎯 SIMULATING CONTEXT INJECTION:');
    const memoryContext = await memoryService.getMemoryContext();
    const formattedContext = memoryService.formatMemoryForContext(memoryContext);
    
    console.log('Final context that would be injected:');
    console.log('=====================================');
    console.log(formattedContext);
    console.log('=====================================');
    
    return {
      success: true,
      debugResult,
      contextPreview: formattedContext.substring(0, 500)
    };
    
  } catch (error) {
    console.error('❌ Memory flow test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Quick test - can be called from console
export const quickMemoryDebug = async () => {
  return await testMemoryFlow();
};