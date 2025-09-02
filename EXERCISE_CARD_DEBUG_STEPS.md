# 🔍 Exercise Card Debug Steps

## 🧪 **Test Setup Complete**

I've added debug logs and a test button to isolate the issue. Follow these steps:

### **Step 1: Test Manual Trigger**
1. **Start app**: `npx expo start`
2. **Open chat interface**
3. **Look for green "🧪 Test Exercise Card" button**
4. **Click the button**

**Expected Result:** Exercise card should appear immediately
- ✅ **If card shows:** Rendering works, issue is with AI response
- ❌ **If card doesn't show:** Problem with component/state management

### **Step 2: Test AI Response**
1. **Ask stress-related question**: "I'm feeling overwhelmed and anxious about work"
2. **Check console/developer tools** for these debug logs:
   ```
   🔍 Exercise card debug - nextAction: [value]
   🔍 Exercise card debug - exerciseData: [value]
   🎯 Checking exercise card trigger...
   🎯 No exercise card trigger. nextAction: [value] exerciseData: [value]
   ```

### **Step 3: Force AI Exercise Suggestion**
Try asking more directly:
- "I need help with my anxiety"
- "Can you suggest a breathing exercise?"
- "I'm having negative thoughts, what should I do?"

### **Step 4: Check Console Logs Pattern**

**Scenario A - AI Not Suggesting Exercises:**
```
🔍 Exercise card debug - nextAction: undefined
🔍 Exercise card debug - exerciseData: undefined
🎯 No exercise card trigger. nextAction: undefined exerciseData: undefined
```
**Issue:** AI model isn't following instructions to suggest exercises

**Scenario B - AI Suggesting But Card Not Setting:**
```
🔍 Exercise card debug - nextAction: showExerciseCard
🔍 Exercise card debug - exerciseData: {type: "breathing", name: "..."}
🎯 Exercise card should show! Type: breathing
🎯 Full exercise data found: [object]
🎯 Setting exercise card state...
🔍 Render check - showExerciseCard: [object]
```
**Issue:** Card should show but component might have rendering problem

**Scenario C - Edge Function Issue:**
```
🔍 Exercise card debug - nextAction: undefined
🔍 Exercise card debug - exerciseData: undefined
```
**Issue:** Edge Function not parsing/returning exercise fields

## 🚨 **What to Report**

Please tell me:
1. **Does the test button work?** (Does card show when you click it?)
2. **What console logs appear** when asking about stress/anxiety?
3. **Any errors** in console?
4. **Does AI respond normally** to stress questions?

This will tell us exactly where the issue is:
- **Test button works + no AI exercise data = AI/Edge Function issue**
- **Test button fails = Component/rendering issue**
- **AI returns exercise data but no card = State management issue**

## 🔧 **Potential Quick Fixes**

If test button works but AI doesn't suggest exercises, try:
1. **Be more specific**: "I need help with anxiety, can you suggest an exercise?"
2. **Use trigger words**: "stress", "anxiety", "negative thoughts", "overwhelmed"
3. **Ask directly**: "What breathing exercises can help me?"

The debug logs will show us exactly what's happening at each step!