import { memoryService } from '../services/memoryService';
import { Message } from '../services/storageService';

/**
 * Utility functions for testing the memory system
 */

export const testMemorySystem = async () => {
  console.log('🧠 Testing Memory System...');
  
  try {
    // Test 1: Get current memory context
    console.log('\n📋 Test 1: Getting memory context...');
    const memoryContext = await memoryService.getMemoryContext();
    console.log('Memory Context:', {
      insightCount: memoryContext.insights.length,
      summaryCount: memoryContext.summaries.length,
      hasConsolidated: !!memoryContext.consolidatedSummary
    });

    // Test 2: Format memory context for injection
    console.log('\n📝 Test 2: Formatting memory for context...');
    const formattedMemory = memoryService.formatMemoryForContext(memoryContext);
    console.log('Formatted memory length:', formattedMemory.length);
    console.log('Sample formatted memory:', formattedMemory.substring(0, 300) + '...');

    // Test 3: Check memory stats
    console.log('\n📊 Test 3: Memory statistics...');
    const stats = await memoryService.getMemoryStats();
    console.log('Memory Stats:', stats);

    // Test 4: Create sample messages and test extraction logic
    console.log('\n🔍 Test 4: Testing extraction logic with sample messages...');
    const sampleMessages: Message[] = [
      {
        id: '1',
        type: 'user',
        text: 'I always think I\'m going to fail at everything',
        timestamp: new Date().toISOString()
      },
      {
        id: '2', 
        type: 'system',
        text: 'That sounds like a difficult thought pattern to carry',
        timestamp: new Date().toISOString()
      },
      {
        id: '3',
        type: 'user', 
        text: 'Yes, and it makes me avoid trying new things because I assume the worst will happen',
        timestamp: new Date().toISOString()
      }
    ];

    const shouldExtract = await memoryService.shouldExtractInsights(sampleMessages);
    console.log('Should extract insights:', shouldExtract);

    console.log('\n✅ Memory system tests completed!');
    
    return {
      memoryContext,
      formattedMemory,
      stats,
      shouldExtract,
      testsPassed: true
    };

  } catch (error) {
    console.error('❌ Memory system test failed:', error);
    return {
      error: error.message,
      testsPassed: false
    };
  }
};

export const clearMemoryForTesting = async () => {
  console.log('🧹 Clearing memory for testing...');
  try {
    await memoryService.clearAllMemories();
    console.log('✅ Memory cleared successfully');
  } catch (error) {
    console.error('❌ Error clearing memory:', error);
    throw error;
  }
};

export const createSampleInsights = async () => {
  console.log('🌱 Creating sample insights for testing...');
  
  try {
    // Create sample insights for each category
    const sampleInsights = [
      {
        id: 'test_1',
        category: 'automatic_thoughts' as const,
        content: 'Tends to catastrophize about work performance and assume the worst outcomes',
        confidence: 0.85,
        date: new Date().toISOString(),
        sourceMessageIds: ['test_msg_1']
      },
      {
        id: 'test_2', 
        category: 'emotions' as const,
        content: 'Experiences anxiety when faced with uncertainty or new challenges',
        confidence: 0.78,
        date: new Date().toISOString(),
        sourceMessageIds: ['test_msg_2']
      },
      {
        id: 'test_3',
        category: 'strengths' as const,
        content: 'Shows strong self-awareness and willingness to explore difficult feelings',
        confidence: 0.82,
        date: new Date().toISOString(),
        sourceMessageIds: ['test_msg_3']
      }
    ];

    for (const insight of sampleInsights) {
      await memoryService.saveInsight(insight);
    }

    // Create a sample summary
    const sampleSummary = {
      id: 'test_summary_1',
      text: 'Session focused on exploring automatic thoughts about failure and performance anxiety. User demonstrated good insight into their thought patterns.',
      date: new Date().toISOString(),
      type: 'session' as const,
      messageCount: 15
    };

    await memoryService.saveSummary(sampleSummary);

    console.log('✅ Sample insights and summary created');
    return true;

  } catch (error) {
    console.error('❌ Error creating sample insights:', error);
    throw error;
  }
};

// Quick test function for manual debugging
export const quickMemoryTest = async () => {
  try {
    await clearMemoryForTesting();
    await createSampleInsights();
    const results = await testMemorySystem();
    return results;
  } catch (error) {
    console.error('Quick memory test failed:', error);
    return { error: error.message, testsPassed: false };
  }
};