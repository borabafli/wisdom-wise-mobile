# First Message System Documentation

## Overview

The First Message System generates personalized, AI-powered greeting messages when users start a new chat session. It analyzes available user context (reframes, thought patterns, values, goals, onboarding data) and generates contextually appropriate opening messages with suggestion chips.

## Architecture

### Core Service: `firstMessageService.ts`

Located at: `src/services/firstMessageService.ts`

**Key responsibilities:**
- Gather context from multiple services (memory, goals, thinking patterns, values, onboarding)
- Determine routing priority based on available data and recency
- Generate AI-powered personalized greetings via system prompts
- Return message + 4 contextual suggestion chips

### Integration Points

1. **useSessionManagement.ts** - Modified `initializeSession()` to call `firstMessageService.generateFirstMessage()`
2. **useChatSession.ts** - Updated to handle the new response format with messages + suggestions

## Routing Logic (Flexible Priority)

The system uses a **flexible routing** approach - it provides hints to the AI, not strict rules. The AI can deviate if context suggests it.

### Priority Order:

1. **Reframe Followup** (< 72h since last session)
   - User has recent thinking pattern reflection
   - References the distorted thought and reframe
   - Example: "Hey Alex. Last time you worked on reframing that 'I always mess up' thought. Has that pattern shown up again?"

2. **Thought Pattern Followup** (< 1 week)
   - User has automatic thoughts in memory insights
   - Asks if pattern has been present recently
   - Example: "I've noticed catastrophizing in our conversations. Has that been showing up for you recently?"

3. **Values Check** (< 1 week)
   - User has identified personal values
   - References top value and asks about living it out
   - Example: "You've shared that Connection is important to you. Was there a moment recently where you felt connected to that?"

4. **Goal Check** (any time)
   - User has active therapy goals
   - Asks about progress, highlights, or challenges
   - Example: "You've been working on managing anxiety in social situations. Want to share a highlight or something that's felt hard?"

5. **Onboarding Reference** (new users or little data)
   - References initial focus areas, challenges, or motivation
   - Keeps it open for them to pivot
   - Example: "You mentioned stress management was something you wanted to explore. Has that been on your mind, or is there something else today?"

6. **Neutral Open** (default fallback)
   - Simple, warm, welcoming
   - Asks what would help most
   - Example: "Hey Sam. What's on your mind today?"

## Context Data Sources

### Available Context:

| Data | Source | Usage |
|------|--------|-------|
| Recent reframes | `thinkingPatternsService.getReflectionSummaries()` | Highest priority - references specific work |
| Memory insights | `memoryService.getMemoryContext()` | Identifies thought patterns, emotions, behaviors |
| Personal values | `valuesService.getTopValues()` | References what matters to user |
| Active goals | `goalService.getActiveGoals()` | Checks progress on therapy goals |
| Onboarding data | `storageService.getUserProfile()` | Focus areas, challenges, motivation |
| Last session | Calculated from session timestamps | Determines recency factor |

### Example Context Object:

```typescript
{
  firstName: "Alex",
  memory: {
    insights: [
      { category: 'automatic_thoughts', content: 'Often catastrophizes...' }
    ],
    summaries: [...]
  },
  goals: [
    { mainGoal: 'Manage anxiety in social situations', progress: 45 }
  ],
  recentReflections: [
    {
      originalThought: "I always mess things up",
      distortionType: "All-or-nothing thinking",
      reframedThought: "Sometimes I make mistakes, and that's okay"
    }
  ],
  topValues: [
    { name: "Connection", description: "Being present with loved ones" }
  ],
  lastSession: { date: "2025-01-15T10:30:00Z", hoursSince: 36 }
}
```

## AI System Prompt Structure

The service builds a specialized system prompt with:

1. **Task description** - Generate warm opening + 4 chips
2. **Language instruction** - From i18nService (multi-language support)
3. **Routing hint** - Priority guidance based on context analysis
4. **Formatted context** - Structured, relevant data only
5. **Routing guidelines** - Specific examples and approach for each variant
6. **Style rules** - Natural, flexible, client-perspective chips

### Response Format:

```json
{
  "message": "Hey Alex. Last time you worked on reframing that 'I always mess up' thought into **something more balanced**. Has that pattern shown up again since we talked?",
  "chips": [
    "Yes, several times",
    "A bit",
    "Not really",
    "I want to explore something new"
  ]
}
```

## Key Design Principles

### 1. **Flexibility Over Rigidity**
- AI receives routing **hints**, not commands
- Can deviate if context feels forced
- Acts like a real therapist - adaptive and intuitive

### 2. **Variety Through Temperature**
- Uses temperature 0.85 for diverse responses
- Same context won't produce identical greetings
- Prevents repetitive feel

### 3. **Fast Model for Speed**
- Uses Gemini Flash 2.5 (not Pro)
- Cost-effective for simple task
- ~250 tokens max

### 4. **Graceful Fallbacks**
- If AI generation fails → neutral greeting
- If no context available → warm open greeting
- Never crashes the session

### 5. **Multi-Language Ready**
- Uses `getLanguageInstruction()` from i18nService
- Works across all 6 supported languages
- AI generates in user's preferred language

## Usage Example

```typescript
// In useSessionManagement.ts
const sessionData = await firstMessageService.generateFirstMessage();

// Returns:
// {
//   messages: [{ type: 'system', content: "Hey Alex...", ... }],
//   suggestions: ["Yes, several times", "A bit", "Not really", "New topic"]
// }
```

## Testing Scenarios

### Scenario 1: Recent Reframe (< 72h)
**Context:** User did thinking pattern reflection 24h ago
**Expected:** References the reframe, asks if pattern came up again
**Chips:** Progress check, apply to new situation, new topic

### Scenario 2: Thought Patterns (< 1 week)
**Context:** User has "catastrophizing" in memory insights
**Expected:** Asks if that pattern has been present recently
**Chips:** Yes/No/A bit/New topic

### Scenario 3: Values Focus
**Context:** User has "Connection" as top value
**Expected:** Asks about moments living it out or wanting to
**Chips:** I lived it/I wanted to/New topic/Plan action

### Scenario 4: Active Goals
**Context:** User working on social anxiety goal
**Expected:** Asks about progress, highlight, or challenge
**Chips:** Highlight/Challenge/Show progress/Something else

### Scenario 5: New User (Onboarding Only)
**Context:** User has focus areas but no session history
**Expected:** References focus area, stays very open
**Chips:** That topic/Something else/Guide me/Quick exercise

### Scenario 6: No Context (Neutral)
**Context:** First-time user or no data
**Expected:** Simple, warm, open greeting
**Chips:** Something specific/Guide me/Quick breathing/Just talk

## Performance Considerations

- **Latency:** ~1-2 seconds for AI generation (acceptable for session start)
- **Token cost:** ~200 tokens per session start (~$0.0002 with Gemini Flash)
- **Caching:** Could cache greetings if context hasn't changed (future optimization)
- **Parallel loading:** Runs during session init, doesn't block other operations

## Future Enhancements

1. **Streak tracking** - "I see a 7-day streak..."
2. **Mood trends** - "Your mood has been trending upward..."
3. **Exercise completion history** - "Last time you did the breathing exercise..."
4. **Time of day variations** - Morning vs evening greetings
5. **Emotional state detection** - Adapt tone based on recent mood logs
6. **A/B testing** - Test different routing strategies
7. **Caching layer** - Cache greetings when context is unchanged

## Troubleshooting

### Issue: AI returns invalid JSON
**Solution:** Fallback greeting is used automatically

### Issue: First message feels too generic
**Check:** Is context being gathered correctly? Review logs for context data

### Issue: Wrong routing variant selected
**Review:** Routing logic in `determineRouting()` - adjust thresholds

### Issue: Chips not showing
**Check:** useChatSession is correctly setting `setSuggestions(sessionData.suggestions)`

### Issue: Multi-language not working
**Verify:** `getLanguageInstruction()` is being called and included in prompt

## Code Quality

- ✅ Type-safe interfaces
- ✅ Comprehensive error handling
- ✅ Detailed logging for debugging
- ✅ Graceful fallbacks
- ✅ Separation of concerns
- ✅ Production-ready architecture

---

**Last Updated:** 2025-01-15
**Maintained By:** WisdomWise Development Team