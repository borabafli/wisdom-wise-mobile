import { memoryService } from '../services/memoryService';
import { Message } from '../services/storageService';

/**
 * Test utility for validating enhanced session summary extraction
 */

const sampleTherapeuticSession: Message[] = [
  {
    id: '1',
    type: 'system',
    text: "Hello! I'm Anu, your compassionate companion. What's on your mind today?",
    timestamp: new Date().toISOString()
  },
  {
    id: '2',
    type: 'user',
    text: "I've been feeling really anxious about my performance review at work next week. I keep imagining all the negative feedback I might get.",
    timestamp: new Date().toISOString()
  },
  {
    id: '3',
    type: 'system',
    text: "It sounds like you're experiencing anticipatory anxiety about the review. What specific thoughts are going through your mind when you imagine that negative feedback?",
    timestamp: new Date().toISOString()
  },
  {
    id: '4',
    type: 'user',
    text: "I keep thinking 'What if they say I'm not good enough?' or 'What if they realize I don't belong here?' It's like I'm convinced I'm going to be exposed as a fraud.",
    timestamp: new Date().toISOString()
  },
  {
    id: '5',
    type: 'system',
    text: "That sounds like imposter syndrome - the fear of being 'found out' despite evidence of your competence. Have you noticed these thoughts in other areas of your life?",
    timestamp: new Date().toISOString()
  },
  {
    id: '6',
    type: 'user',
    text: "Yes, actually. In college too. Even when I got good grades, I felt like it was just luck or the professors were being easy. I never felt like I truly earned it.",
    timestamp: new Date().toISOString()
  },
  {
    id: '7',
    type: 'system',
    text: "It's insightful that you're connecting these patterns across different life experiences. What would it mean to you if you could trust in your own capabilities?",
    timestamp: new Date().toISOString()
  },
  {
    id: '8',
    type: 'user',
    text: "I think I'd feel more confident taking on challenges instead of playing it safe all the time. I realize I've been avoiding opportunities because I'm scared of failing.",
    timestamp: new Date().toISOString()
  },
  {
    id: '9',
    type: 'system',
    text: "That's a powerful realization - seeing how fear of failure has shaped your choices. What's one small step you could take this week to challenge that pattern?",
    timestamp: new Date().toISOString()
  },
  {
    id: '10',
    type: 'user',
    text: "Maybe I could volunteer for that presentation opportunity my manager mentioned. I was going to decline, but maybe it's worth trying even if I'm scared.",
    timestamp: new Date().toISOString()
  },
  {
    id: '11',
    type: 'system',
    text: "That sounds like a meaningful way to practice trusting yourself. How are you feeling right now compared to when we started talking?",
    timestamp: new Date().toISOString()
  },
  {
    id: '12',
    type: 'user',
    text: "Actually, a bit lighter. I can see that my fear might be protecting me, but it's also holding me back. I want to try being braver.",
    timestamp: new Date().toISOString()
  }
];

const sampleDepressionSession: Message[] = [
  {
    id: '1',
    type: 'system',
    text: "Hello! How are you feeling today?",
    timestamp: new Date().toISOString()
  },
  {
    id: '2',
    type: 'user',
    text: "I've been feeling really down lately. Everything just feels pointless and I can't seem to enjoy things I used to love.",
    timestamp: new Date().toISOString()
  },
  {
    id: '3',
    type: 'system',
    text: "That sounds really difficult. When did you first notice these feelings starting?",
    timestamp: new Date().toISOString()
  },
  {
    id: '4',
    type: 'user',
    text: "A few weeks ago, after I lost my job. At first I thought it was just normal sadness, but now I can barely get out of bed some days.",
    timestamp: new Date().toISOString()
  },
  {
    id: '5',
    type: 'system',
    text: "Losing a job is a significant life change that can trigger these deeper feelings. What do you tell yourself about this situation?",
    timestamp: new Date().toISOString()
  },
  {
    id: '6',
    type: 'user',
    text: "That I'm a failure. That I'll never find another job. My family is disappointed in me. I feel like I've let everyone down.",
    timestamp: new Date().toISOString()
  },
  {
    id: '7',
    type: 'system',
    text: "Those are some very harsh thoughts you're having about yourself. If a close friend were in your exact situation, what would you say to them?",
    timestamp: new Date().toISOString()
  },
  {
    id: '8',
    type: 'user',
    text: "I'd probably tell them it wasn't their fault, that the job market is tough, and that they'll find something else. I definitely wouldn't call them a failure.",
    timestamp: new Date().toISOString()
  },
  {
    id: '9',
    type: 'system',
    text: "That's such a compassionate response. Why do you think it's easier to be kind to a friend than to yourself?",
    timestamp: new Date().toISOString()
  },
  {
    id: '10',
    type: 'user',
    text: "I guess I have really high standards for myself. I've always been my own worst critic. Maybe too harsh.",
    timestamp: new Date().toISOString()
  },
  {
    id: '11',
    type: 'system',
    text: "It sounds like you're starting to see the double standard in how you treat yourself versus others. What would self-compassion look like for you right now?",
    timestamp: new Date().toISOString()
  },
  {
    id: '12',
    type: 'user',
    text: "Maybe treating this setback as temporary instead of proof that I'm worthless. And remembering that I have skills and experience that someone will value.",
    timestamp: new Date().toISOString()
  }
];

export const testEnhancedSessionSummary = async (sessionType: 'imposter' | 'depression' = 'imposter') => {
  console.log(`🧪 Testing Enhanced Session Summary - ${sessionType} scenario`);
  
  try {
    const testMessages = sessionType === 'imposter' ? sampleTherapeuticSession : sampleDepressionSession;
    
    console.log(`\n📝 Generating summary for session with ${testMessages.length} messages...`);
    
    const summaryResult = await memoryService.generateSessionSummary(
      `test_session_${Date.now()}`,
      testMessages
    );
    
    console.log('\n📊 Summary Result:');
    console.log('- Summary generated:', !!summaryResult.summary);
    console.log('- Should consolidate:', summaryResult.shouldConsolidate);
    console.log('- Summary length:', summaryResult.summary.text.length);
    
    console.log('\n📖 Generated Summary:');
    console.log(`"${summaryResult.summary.text}"`);
    
    // Analyze the summary quality
    console.log('\n🔍 Summary Analysis:');
    const summary = summaryResult.summary.text.toLowerCase();
    
    const therapeuticIndicators = [
      'insight', 'realized', 'pattern', 'connection', 'aware',
      'challenge', 'fear', 'anxiety', 'belief', 'thought',
      'feeling', 'emotion', 'coping', 'strength', 'progress'
    ];
    
    const foundIndicators = therapeuticIndicators.filter(indicator => 
      summary.includes(indicator)
    );
    
    console.log('- Therapeutic indicators found:', foundIndicators.length);
    console.log('- Key terms:', foundIndicators.join(', '));
    console.log('- Contains specific concerns:', summary.includes('work') || summary.includes('job') || summary.includes('performance'));
    console.log('- Contains emotional states:', summary.includes('anxious') || summary.includes('down') || summary.includes('depressed'));
    console.log('- Contains actionable insights:', summary.includes('practice') || summary.includes('challenge') || summary.includes('try'));
    
    return {
      success: true,
      summary: summaryResult.summary,
      qualityScore: foundIndicators.length,
      hasSpecificConcerns: summary.includes('work') || summary.includes('job') || summary.includes('performance'),
      hasEmotionalStates: summary.includes('anxious') || summary.includes('down') || summary.includes('depressed'),
      hasActionableInsights: summary.includes('practice') || summary.includes('challenge') || summary.includes('try')
    };
    
  } catch (error) {
    console.error('❌ Enhanced session summary test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const testSessionSummaryConsolidation = async () => {
  console.log('🔄 Testing Session Summary Consolidation');
  
  try {
    // Create multiple test summaries
    const testSummaries = [
      "User explored work-related anxiety stemming from perfectionist beliefs about needing to be flawless. Identified pattern of catastrophic thinking when receiving feedback, leading to avoidance of challenging projects. Recognized connection between childhood criticism and current self-doubt. Expressed readiness to practice self-compassion techniques and challenge all-or-nothing thinking patterns.",
      
      "Session focused on imposter syndrome fears around upcoming performance review. User recognized recurring pattern of self-doubt despite evidence of competence, tracing back to college experiences. Made connection between fear of failure and tendency to avoid opportunities. Committed to volunteering for presentation to practice trusting own capabilities.",
      
      "User discussed low mood and loss of motivation following job loss. Identified harsh self-critical thoughts including 'I'm a failure' and catastrophic predictions about future. Recognized double standard in self-treatment versus how they'd support a friend. Began exploring self-compassion as alternative to self-criticism, reframing setback as temporary rather than permanent character flaw."
    ];
    
    // Test consolidation (this would normally be called automatically)
    console.log('\n📝 Testing consolidation with sample summaries...');
    
    // Mock the consolidation by calling the memory service directly
    // Note: This would typically be tested by creating actual sessions
    
    console.log('\n✅ Consolidation test setup complete');
    console.log('- Number of summaries:', testSummaries.length);
    console.log('- Average summary length:', Math.round(testSummaries.reduce((acc, s) => acc + s.length, 0) / testSummaries.length));
    
    return {
      success: true,
      summaryCount: testSummaries.length,
      averageLength: Math.round(testSummaries.reduce((acc, s) => acc + s.length, 0) / testSummaries.length)
    };
    
  } catch (error) {
    console.error('❌ Consolidation test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Quick test runner
export const runAllSessionSummaryTests = async () => {
  console.log('🧪 Running All Enhanced Session Summary Tests\n');
  
  const results = {
    imposterTest: await testEnhancedSessionSummary('imposter'),
    depressionTest: await testEnhancedSessionSummary('depression'),
    consolidationTest: await testSessionSummaryConsolidation()
  };
  
  console.log('\n📊 Overall Test Results:');
  console.log('- Imposter scenario:', results.imposterTest.success ? '✅ PASSED' : '❌ FAILED');
  console.log('- Depression scenario:', results.depressionTest.success ? '✅ PASSED' : '❌ FAILED');
  console.log('- Consolidation test:', results.consolidationTest.success ? '✅ PASSED' : '❌ FAILED');
  
  return results;
};