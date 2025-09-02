# Edge Function Deployment Instructions

## 🚨 Quick Deploy Options

### Option 1: Manual Dashboard Deploy
1. Go to your Supabase project dashboard
2. Navigate to **Edge Functions**  
3. Find the `ai-chat` function
4. Click **"Deploy new version"**
5. Copy-paste the updated `supabase/functions/ai-chat/index.ts` content
6. Deploy

### Option 2: CLI Deploy (after project setup)
```bash
# First, initialize/link the project
cd "E:\Mobile App Project\AI Therapy and Mental Health\Cursor AI Project\wisdom-wise-mobile"

# Link to your project (you'll need your project reference ID)
SUPABASE_ACCESS_TOKEN=sbp_f7414e48ddf7d2bd69b50d02698af37c3a8ce7ae npx supabase link --project-ref YOUR_PROJECT_REF

# Then deploy
SUPABASE_ACCESS_TOKEN=sbp_f7414e48ddf7d2bd69b50d02698af37c3a8ce7ae npx supabase functions deploy ai-chat
```

## 🔧 What Was Updated

The key changes to `ai-chat/index.ts`:

**1. Enhanced JSON Schema (Lines 212-230):**
```typescript
nextAction: {
  type: "string",
  description: "Optional: Set to 'showExerciseCard' when therapeutically suggesting an exercise to the user"
},
exerciseData: {
  type: "object",
  properties: {
    type: { type: "string" },
    name: { type: "string" }
  },
  required: ["type", "name"]
}
```

**2. Response Parsing (Lines 329-331, 355-357):**
```typescript
let nextAction: string | undefined;
let exerciseData: {type: string, name: string} | undefined;
// ... parsing logic ...
nextAction = jsonResponse.nextAction;
exerciseData = jsonResponse.exerciseData;
```

**3. Final Response (Lines 398-400):**
```typescript
nextAction: nextAction,
exerciseData: exerciseData,
nextStep: nextStep
```

## ✅ Test After Deploy

1. **Start the app**: `npx expo start`
2. **Open chat interface**
3. **Ask about stress/anxiety**: "I'm feeling really stressed about work"
4. **AI should suggest exercise** with card appearing
5. **Click card** → smooth transition

## 🐛 If Issues Persist

Check the Supabase Edge Function logs:
1. Go to Supabase Dashboard → Edge Functions → ai-chat
2. Click **"Logs"** tab  
3. Look for the console.log outputs showing exercise parsing

The fix ensures AI responses with `nextAction: 'showExerciseCard'` properly trigger the exercise card display!