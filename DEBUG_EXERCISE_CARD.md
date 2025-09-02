# 🔍 Exercise Card Debugging Guide

## Current Debug Setup

I've added extensive logging and a test button to help debug why the exercise card isn't showing:

### 1. Debug Logs Added

**In `useChatSession.ts`:**
- `🔍 EXERCISE DEBUG - Response nextAction:` - Shows if AI returned exercise trigger
- `🔍 EXERCISE DEBUG - Response exerciseData:` - Shows exercise data from AI
- `🎯 EXERCISE DEBUG - Attempting to show exercise card` - Confirms trigger logic
- `🎯 EXERCISE DEBUG - Setting exercise card to:` - Shows exercise data being set

**In `ChatInterface.tsx`:**
- `🔍 RENDER DEBUG - showExerciseCard value:` - Shows current card state in render

### 2. Test Button Added

A red test button now appears in the chat that manually triggers the exercise card display. This helps verify:
- ✅ If exercise card rendering works at all
- ✅ If the card component displays properly
- ✅ If the card can be clicked and dismissed

## 🧪 Testing Steps

### Step 1: Test Manual Trigger
1. **Start app**: `npx expo start`
2. **Open chat interface**
3. **Click the red "🧪 TEST: Show Exercise Card" button**
4. **Verify**: Exercise card should appear immediately

**If card shows:** ✅ Rendering works, issue is with AI response
**If card doesn't show:** ❌ Rendering/component issue

### Step 2: Test AI Response
1. **Ask stress-related question**: "I'm feeling overwhelmed with work stress"
2. **Check console logs** for these patterns:
   ```
   🔍 EXERCISE DEBUG - Response nextAction: showExerciseCard
   🔍 EXERCISE DEBUG - Response exerciseData: {type: "breathing", name: "..."}
   🎯 EXERCISE DEBUG - Attempting to show exercise card
   ```

**If logs show exercise data:** ✅ AI responding correctly
**If no exercise data:** ❌ AI not triggering or Edge Function issue

### Step 3: Check Edge Function
- Go to: https://supabase.com/dashboard/project/tarwryruagxsoaljzoot/functions
- Click **"Logs"** tab on ai-chat function
- Look for console.log outputs showing exercise parsing

## 🔧 Possible Issues & Solutions

### Issue 1: Edge Function Not Updated
**Symptoms:** No `nextAction` in response logs
**Solution:** Verify deployment worked, check function logs

### Issue 2: AI Model Not Following Schema  
**Symptoms:** AI responses but no `nextAction` field
**Solution:** The model might not support the new schema fields

### Issue 3: Client-Side Parsing Issue
**Symptoms:** `nextAction` in logs but card doesn't set
**Solution:** Check exercise library key matching

### Issue 4: Render Issue
**Symptoms:** Test button doesn't show card
**Solution:** ExerciseCard component problem

## 🚨 Next Steps Based on Test Results

**Report what you see:**
1. Does the test button show the exercise card?
2. What console logs appear when asking about stress?
3. Any errors in the console?

This will help pinpoint exactly where the issue is occurring!