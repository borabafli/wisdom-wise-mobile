# Translation Keys Audit Report

**Generated:** 2025-11-15

## Executive Summary

- ✅ **Total translation keys in use:** 860
- 📋 **Total keys defined in en.json:** 1,190
- ❌ **Missing keys (will show as raw text):** 20
- 📦 **Unused keys (defined but not used):** 352

## ⚠️ Critical Issues: Missing Translation Keys

These 20 keys are used in the code but **NOT defined in en.json**. They will appear as raw key names in the UI (e.g., `"exerciseLibrary.steps.breathing.step1.title"` instead of the actual text).

### 1. Exercise Library - Breathing Steps (9 keys)

**File:** `/src/data/exerciseLibrary.ts` (lines 273-288)

Missing keys:
```
exerciseLibrary.steps.breathing.step1.description
exerciseLibrary.steps.breathing.step1.instruction
exerciseLibrary.steps.breathing.step1.title
exerciseLibrary.steps.breathing.step2.description
exerciseLibrary.steps.breathing.step2.instruction
exerciseLibrary.steps.breathing.step2.title
exerciseLibrary.steps.breathing.step3.description
exerciseLibrary.steps.breathing.step3.instruction
exerciseLibrary.steps.breathing.step3.title
```

**Impact:** The 4-7-8 Breathing exercise will show raw translation keys instead of proper step titles, descriptions, and instructions.

**Recommendation:** Add these 9 keys to `/src/locales/en.json` under `exerciseLibrary.steps.breathing`.

---

### 2. Mood Insights - Empty States (10 keys)

**File:** `/src/components/MoodInsightsCard.tsx` (lines 567-767)

Missing keys:
```
insights.moodInsights.analyzingPatterns
insights.moodInsights.emptyStates.bothData.title
insights.moodInsights.emptyStates.fallback.title
insights.moodInsights.emptyStates.moodOnly.title
insights.moodInsights.emptyStates.noData.chatButton
insights.moodInsights.emptyStates.noData.description
insights.moodInsights.emptyStates.noData.exerciseButton
insights.moodInsights.emptyStates.noData.title
insights.moodInsights.emptyStates.sessionsOnly.exerciseButton
insights.moodInsights.emptyStates.sessionsOnly.title
```

**Impact:** When users have no mood data, empty data with sessions only, empty data with moods only, or while analyzing patterns, they'll see raw translation keys instead of helpful messages.

**Recommendation:** Add these 10 keys to `/src/locales/en.json` under `insights.moodInsights.emptyStates` and `insights.moodInsights`.

---

### 3. Other Missing Key (1 key)

Missing key:
```
window
```

**Note:** This appears to be a false positive (likely from `Dimensions.get('window')` which is not a translation key).

---

## 📊 Translation Keys by Namespace

### Heavily Used Namespaces

1. **exerciseLibrary** - 186 keys
   - Exercise names, descriptions, categories, difficulties
   - Step-by-step instructions for all exercises

2. **insights** - 165 keys
   - Journey tracking, mood insights, values, vision
   - Session summaries, therapy goals, thinking patterns

3. **profile** - 111 keys
   - User profile, settings, menu items
   - Edit profile, delete data, dev menu

4. **onboarding** - 86 keys
   - Welcome screens, personalization
   - Notifications, focus areas, age groups

5. **chat** - 49 keys
   - Chat interface, mood rating, session summaries
   - Exit confirmations, reflection spaces

6. **journal** - 30 keys
   - Journal prompts, entries, summaries
   - Writing interface elements

7. **auth** - 31 keys
   - Sign in, sign up, verification flows
   - Google authentication

8. **exercises** - 25 keys
   - Exercise filters, ratings, difficulty
   - Search and display elements

9. **paywall** - 23 keys
   - Subscription features, pricing
   - Limit reached messages

10. **quickActions** - 23 keys
    - Quick action tiles on home screen
    - Breathing, gratitude, meditation shortcuts

### Less Used Namespaces

- **visionDetails** - 12 keys
- **ttsSettings** - 17 keys
- **featureRequest** - 14 keys
- **helpSupport** - 14 keys
- **premium_limit** - 13 keys
- **common** - 8 keys
- **errors** - 10 keys
- **actionPalette** - 10 keys
- **navigation** - 5 keys
- **language** - 3 keys

---

## 📦 Unused Translation Keys (352 keys)

These keys are defined in `en.json` but are **not currently used** in the codebase. They may be:
- Legacy keys from removed features
- Planned for future features
- Duplicates or alternatives

### Top Unused Namespaces

1. **insights** - 71 unused keys
   - Many alternative mood labels, reflection prompts
   - Unused session summary features

2. **onboarding** - 62 unused keys
   - Alternative onboarding flows
   - Unused age range options, motivation screens

3. **paywall** - 29 unused keys
   - Alternative pricing displays
   - Unused limit messages

4. **errors** - 29 unused keys
   - Error messages for edge cases
   - Form validation messages

5. **exercises** - 23 unused keys
   - Alternative duration labels
   - Unused filter options

6. **profile** - 20 unused keys
   - Alternative menu descriptions
   - Unused profile fields

7. **journal** - 18 keys
8. **auth** - 17 keys
9. **alerts** - 17 keys
10. **chat** - 15 keys

**Note:** Some of these may be intentionally kept for future use or as fallbacks.

---

## 🔧 Recommended Actions

### Priority 1: Fix Missing Keys (Urgent)

Add the following sections to `/src/locales/en.json`:

```json
{
  "exerciseLibrary": {
    "steps": {
      "breathing": {
        "step1": {
          "title": "Get Comfortable",
          "description": "Find a quiet space and settle in.",
          "instruction": "Invite the user to sit comfortably and close their eyes if they wish."
        },
        "step2": {
          "title": "Begin the Rhythm",
          "description": "Start the 4-7-8 breathing pattern.",
          "instruction": "Guide them: Breathe in through your nose for 4 counts, hold for 7, exhale slowly through your mouth for 8."
        },
        "step3": {
          "title": "Continue & Notice",
          "description": "Complete a few cycles and notice how you feel.",
          "instruction": "Encourage them to repeat the pattern 3-4 times, noticing any shifts in their body or mind."
        }
      }
    }
  },
  "insights": {
    "moodInsights": {
      "analyzingPatterns": "Analyzing your patterns...",
      "emptyStates": {
        "noData": {
          "title": "Start your wellness journey! ✨",
          "description": "Chat with Anu or track your mood after exercises to see personalized insights here",
          "chatButton": "Chat with Anu",
          "exerciseButton": "Try Exercise"
        },
        "moodOnly": {
          "title": "Great job tracking your mood! 📈",
          "description": "Nice to see you tracking your mood regularly! Chat with Anu to unlock deeper insights."
        },
        "sessionsOnly": {
          "title": "Nice progress with Anu! 💬",
          "exerciseButton": "Try Mood Exercise"
        },
        "bothData": {
          "title": "Keep building your insights! ⭐",
          "description": "Your patterns are emerging. Keep up the great work!"
        },
        "fallback": {
          "title": "Checking your data... ✨"
        }
      }
    }
  }
}
```

### Priority 2: Review Unused Keys (Low Priority)

- Review the 352 unused keys
- Determine which are legacy code vs. planned features
- Consider removing unused keys to reduce translation file size
- Keep keys that are planned for future features with comments

### Priority 3: Establish Translation Key Standards

1. **Always use translation keys** - Never hardcode strings
2. **Naming convention:**
   - Use camelCase for leaf keys
   - Use descriptive namespace hierarchy
   - Example: `screen.component.element.state`

3. **Before committing:**
   - Run `node check-translation-keys.js` to verify all keys exist
   - Add any missing keys to all language files (en, de, fr, tr, es, pt)

4. **Code review checklist:**
   - [ ] No hardcoded user-facing strings
   - [ ] All `t()` calls reference existing keys
   - [ ] New keys added to all language files

---

## 🛠️ Verification Script

A Node.js script has been created at `/check-translation-keys.js` that:
- Scans all `.ts` and `.tsx` files for translation key usage
- Compares against `en.json` to find missing/unused keys
- Groups keys by namespace for easy analysis
- Highlights any keys that will display as raw text

**Usage:**
```bash
node check-translation-keys.js
```

---

## 📝 Notes

- The "window" key is a false positive from React Native's `Dimensions.get('window')` API
- Some unused keys in `insights.moodInsights.emptyStates.*` exist in en.json but the code references different paths
- Translation interpolation (e.g., `{{count}}`) is used correctly in many places
- The codebase follows i18n best practices in most areas

---

**Last Updated:** 2025-11-15
**Next Review:** Before next production release
