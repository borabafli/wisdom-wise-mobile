# CBT Thought Pattern Extraction - Testing Guide

## ✅ Implementation Complete!

The CBT thought pattern extraction system has been successfully implemented with the following components:

### 🔧 **Components Created:**

1. **Supabase Edge Function** (`/supabase/functions/extract-insights/`)
   - LLM-powered analysis using Claude 3.5 Sonnet
   - Extracts automatic thoughts and cognitive distortions
   - Returns structured JSON with reframed thoughts

2. **Insight Service** (`src/services/insightService.ts`)
   - Client-side service for calling Supabase function
   - Manages extraction logic and storage
   - Configurable thresholds and batch processing

3. **Extended Storage Service** (`src/services/storageService.ts`)
   - Added ThoughtPattern data model
   - Storage methods for insights
   - Retrieval and statistics functions

4. **Updated Chat Interface** (`src/screens/ChatInterface.tsx`)
   - Integrated automatic extraction after AI responses
   - Background processing (non-blocking)
   - Triggered every 5 messages

5. **Enhanced Insights Dashboard** (`src/screens/InsightsDashboard.tsx`)
   - Real-time display of extracted patterns
   - Statistics and trend analysis
   - Fallback to mock data when no patterns exist

## 🧪 **How to Test:**

### **1. Deploy Supabase Function**
```bash
# From your project root
cd supabase
supabase functions deploy extract-insights
```

### **2. Test the Chat Interface**
1. Open your app and start a chat session
2. Share some thoughts that contain cognitive distortions:
   - "I'm terrible at everything I try"
   - "If I fail this test, my entire future is ruined"
   - "Everyone thinks I'm boring and annoying"
   - "I never do anything right"

3. After 5+ messages, check console for extraction logs:
   - Look for: "Extracting insights from conversation..."
   - Look for: "Extracted X thought patterns"

### **3. View Results in Insights Dashboard**
1. Navigate to Insights tab
2. Check "Thinking Patterns" section
3. Should display extracted patterns with:
   - Original automatic thought
   - Identified cognitive distortions
   - Reframed alternative thought
   - Confidence score

## 🔧 **Configuration:**

### **Insight Service Settings:**
```typescript
// Current configuration (can be modified)
batchSize: 5        // Extract after every 5 messages
minConfidence: 0.6  // Only store patterns with 60%+ confidence
autoExtract: true   // Automatic extraction enabled
```

### **Cognitive Distortions Detected:**
- All-or-Nothing Thinking
- Overgeneralization
- Mental Filter
- Catastrophizing
- Mind Reading
- Fortune Telling
- Emotional Reasoning
- Should Statements
- Labeling
- Personalization
- Blame

## 🐛 **Troubleshooting:**

### **If extraction isn't working:**

1. **Check Supabase Function Deployment:**
   ```bash
   supabase functions list
   ```

2. **Check API Keys:**
   - Verify `OPENROUTER_API_KEY` is set in Supabase secrets
   - Check `SUPABASE_URL` and `SUPABASE_ANON_KEY` in constants.ts

3. **Check Console Logs:**
   - Look for errors in chat interface
   - Check network requests to Supabase function

4. **Test Function Directly:**
   ```bash
   curl -X POST 'https://tarwryruagxsoaljzoot.supabase.co/functions/v1/extract-insights' \
     -H 'Authorization: Bearer YOUR_ANON_KEY' \
     -H 'Content-Type: application/json' \
     -d '{"messages":[{"id":"1","type":"user","text":"I am terrible at everything","timestamp":"now"}],"sessionId":"test"}'
   ```

### **If patterns aren't showing in dashboard:**

1. **Check AsyncStorage:**
   - Patterns are stored locally in `thought_patterns` key
   - Clear storage to reset: `insightService.clearAllPatterns()`

2. **Check Confidence Threshold:**
   - Patterns below 60% confidence are filtered out
   - Lower threshold: `insightService.updateConfig({ minConfidence: 0.3 })`

## 📊 **Expected Results:**

### **Sample Input:**
> "I completely messed up that presentation, I'm terrible at public speaking and everyone probably thinks I'm incompetent now"

### **Expected Output:**
```json
{
  "originalThought": "I completely messed up that presentation, I'm terrible at public speaking",
  "distortionTypes": ["All-or-Nothing Thinking", "Mind Reading"],
  "reframedThought": "The presentation had some difficult moments, but I also had good points. I'm still learning and improving.",
  "confidence": 0.87,
  "context": "Work-related anxiety discussion"
}
```

## 🚀 **Next Steps:**

1. **Test with real conversations**
2. **Fine-tune confidence thresholds**
3. **Add user preferences for extraction**
4. **Consider batch processing for performance**
5. **Add export functionality for insights**

The system is ready for testing and should start extracting thought patterns from your therapy conversations!