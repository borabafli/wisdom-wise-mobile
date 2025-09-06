## Data Management Overview

This document maps what data we store, where we store it, and for which use cases. It also includes a high-level diagram of the flows between the mobile app, local storage, and Supabase Edge Functions.

### Architecture Diagram

```mermaid
flowchart TD
  subgraph App[React Native App]
    UI[UI Screens & Components]
    Hooks[Hooks (chat, sessions, quotes)]
    Services[Client Services]
  end

  subgraph Local[Local Persistence (AsyncStorage)]
    CHAT_CURRENT[chat_current_session]
    CHAT_HISTORY[chat_history]
    USER_SETTINGS[user_settings]
    USER_PROFILE[user_profile]
    THOUGHT_PATTERNS[thought_patterns]
    INSIGHTS[\"memory_insights\"]
    SUMMARIES[\"memory_summaries\"]
    MOOD_ENTRIES[mood_entries]
    MOOD_RATINGS[wisdom_wise_mood_ratings]
    EX_RATINGS[exercise_ratings]
    USER_VALUES[user_values]
    VALUE_INSIGHTS[value_insights]
    DAILY_QUOTE[dailyQuote & dailyQuoteDate]
  end

  subgraph Edge[Supabase Edge Functions]
    AI_CHAT[/ai-chat/]
    EXTRACT_INSIGHTS[/extract-insights/]
    GEN_MOOD_INSIGHTS[/generate-mood-insights/]
    STORY_REFLECTION[/story-reflection/]
  end

  UI --> Hooks --> Services
  Services -->|get/set| Local
  Services -->|POST| Edge
  Edge -->|AI JSON| Services
  Services -->|save derived| Local
```

### Local Storage (AsyncStorage) Keys and Schemas

- chat_current_session (managed by `storageService`)
  - ChatSession: { id, messages[Message], createdAt, updatedAt, thoughtPatterns? }
  - Message: { id, type('user'|'system'|'exercise'|'welcome'|'exercise-intro'), text?, content?, timestamp, ... }

- chat_history (managed by `storageService`)
  - Array of past ChatSession with metadata: messageCount, userMessageCount, duration, firstMessage, savedAt

- user_settings (managed by `storageService`; used by `rateLimitService`)
  - { dailyRequestCount, dailyRequestLimit, lastRequestDate }

- user_profile (managed by `storageService`)
  - { firstName, lastName, displayName?, createdAt, updatedAt }

- thought_patterns (written via `insightService` through `storageService`)
  - ThoughtPattern: { id, originalThought, distortionTypes[], reframedThought, confidence, extractedFrom{messageId, sessionId}, timestamp, context? }

- memory_insights (managed by `memoryService`)
  - Insight: { id, category('automatic_thoughts'|'emotions'|'behaviors'|'values_goals'|'strengths'|'life_context'), content, date, sourceMessageIds[], confidence }

- memory_summaries (managed by `memoryService`)
  - Summary: { id, text, date, type('session'|'consolidated'), messageCount?, sessionIds?[] }

- mood_entries (managed by `moodService`)
  - MoodEntry: { date(YYYY-MM-DD), rating(1-5), note?, sessionId? }

- wisdom_wise_mood_ratings (managed by `moodRatingService`)
  - MoodRating: { id, userId?, exerciseType, exerciseName, moodRating(0-5), helpfulnessRating?, sessionId?, notes?, timestamp(ISO) }

- exercise_ratings (managed by `exerciseRatingService`)
  - ExerciseRating: { id, exerciseId, exerciseName, rating(1-5), timestamp(ms), duration?, category? }

- user_values, value_insights (managed by `valuesService`)
  - UserValue: { id, name, userDescription, importance(1-5), createdDate, updatedDate, sourceSessionId?, tags[] }
  - ValueInsight: { id, valueId, insight, date, sessionId, confidence }

- dailyQuote, dailyQuoteDate (managed by `useQuote` hook)
  - Quote object stored as JSON, plus a plain date string

### Remote Services (Supabase Edge Functions)

- /ai-chat
  - Input: { action: 'chat'|'transcribe'|'healthCheck'|'getModels'|'generateSuggestions', messages?, audioData?, ... }
  - Use: `chatService.getChatCompletionWithContext` sends chat context; returns structured AI response

- /extract-insights
  - Actions: 'extract_patterns' | 'extract_insights' | 'generate_summary' | 'consolidate_summaries'
  - Used by `memoryService` and `insightService` to analyze session messages, generate insights/summaries; results stored locally in AsyncStorage keys above

- /generate-mood-insights
  - Input: session summaries; returns uplifting insights; currently results are used at runtime (no direct local persistence identified here)

- /story-reflection
  - Input: a story payload; returns a structured reflection; currently used transiently (no direct local persistence identified here)

Note: The repo includes a SQL migration for a `mood_ratings` table (Supabase), but the mobile app currently persists mood ratings locally (`wisdom_wise_mood_ratings`). Remote sync is not implemented in the client.

### Use Cases → Where Data Lives

- Chat session runtime
  - Current messages: `chat_current_session`
  - On end/save: session copied to `chat_history`

- Rate limiting
  - Counters and lastRequestDate: `user_settings`

- User profile and greeting
  - Names/displayName: `user_profile`; helpers derive display name

- Thought patterns (CBT) and insights memory
  - Patterns: `thought_patterns` (extracted via Edge Function, saved locally)
  - Long-term insights: `memory_insights`
  - Session/consolidated summaries: `memory_summaries`

- Mood tracking and insights
  - Daily mood entries: `mood_entries`
  - Post-exercise mood ratings: `wisdom_wise_mood_ratings`

- Exercise ratings
  - Ratings and insights: `exercise_ratings`

- Values
  - User values: `user_values`
  - Value insights: `value_insights`

- Daily quote
  - Current quote/date: `dailyQuote`, `dailyQuoteDate`

### Data Flow Notes

- The client is offline-first: all primary artifacts are stored in AsyncStorage. Supabase Edge Functions provide AI processing, not durable storage, in the current client code.
- Migrations folder defines server tables (e.g., `mood_ratings`), but client-side sync is not wired up.
- Cleanup/limits exist (e.g., chat history capped at 20 sessions; memory pruning in `memoryService.pruneOldData`).

### Quick Reference Table

| Feature | Service/Hook | Storage Keys |
|---|---|---|
| Chat | `storageService`, `chatService`, `contextService` | `chat_current_session`, `chat_history` |
| Rate Limit | `rateLimitService` | `user_settings` |
| Profile | `storageService` | `user_profile` |
| Thought Patterns | `insightService` + `storageService` | `thought_patterns` |
| Memory Insights | `memoryService` | `memory_insights`, `memory_summaries` |
| Mood Tracking | `moodService` | `mood_entries` |
| Mood Ratings | `moodRatingService` | `wisdom_wise_mood_ratings` |
| Exercise Ratings | `exerciseRatingService` | `exercise_ratings` |
| Values | `valuesService` | `user_values`, `value_insights` |
| Daily Quote | `useQuote` | `dailyQuote`, `dailyQuoteDate` |


