# Anu App - Complete Onboarding Flow Specification

## 🎯 **Onboarding Strategy**
**Duration:** 60-90 seconds  
**Total Pages:** 8-10 screens  
**Core Philosophy:** Build trust → Capture minimal friction data → Deliver immediate value

---

## 📱 **Page-by-Page Onboarding Flow**

### **Page 1: Welcome & Introduction**
**Purpose:** Establish trust and warmth through Anu (turtle therapist persona)

**Visual Elements:**
- Animated Anu turtle character (gentle wave/smile animation)
- Soft, calming background gradient (teal to light blue)
- Progress indicator: 1/10

**Content:**
```
Headline: "Hi, I'm Anu 🐢"
Subtext: "Your personalized AI therapist, here to help you feel calmer and understand yourself better."

[Animated Anu character]
```

**Actions:**
- Primary Button: "Nice to meet you!"
- Secondary Link: "Learn about Anu" (opens modal)

**Modal Content (Learn about Anu):**
```
🐢 About Anu

I'm your personalized AI therapist powered by advanced AI models. Here's what makes me special:

✓ I remember our conversations and learn about you over time
✓ I provide personalized insights based on your unique patterns
✓ I suggest exercises tailored to your specific needs
✓ I'm available 24/7 whenever you need support

I combine evidence-based therapy techniques (CBT, ACT, Mindfulness) with AI to provide you with the most effective support possible.

[Close]
```

---

### **Page 2: Privacy & Consent**
**Purpose:** Legal compliance and trust building

**Visual Elements:**
- Shield icon with checkmark
- Clean, professional layout
- Progress indicator: 2/10

**Content:**
```
Headline: "Your Privacy Matters"

✓ End-to-end encryption protects your data
✓ We never share your personal information
✓ You can delete your data anytime

⚠️ Important: Anu is not a crisis service. 
In emergencies, please call:
• US: 988 (Suicide & Crisis Lifeline)
• UK: 116 123 (Samaritans)
• [Show local number based on location]
```

**Actions:**
- Checkbox: "□ I consent to processing of health-related data for personalization"
- Links: "Privacy Policy" | "Terms of Service"
- Primary Button: "I Understand & Agree" (enabled after checkbox)
- Secondary: "Skip personalization" (anonymous mode)

---

### **Page 3: Personalization Setup**
**Purpose:** Capture name and basic preferences

**Visual Elements:**
- Friendly Anu avatar at top
- Text input field with soft focus state
- Progress indicator: 3/10

**Content:**
```
Headline: "Let's personalize your experience"
Anu says: "What should I call you?"
```

**Fields:**
- Text Input: "Your preferred name" (optional)
- Caption: "You can always change this later in settings"

**Actions:**
- Primary Button: "Continue" 
- Secondary: "Skip for now"

**Backend Logic:**
- Save name to user profile
- Use throughout app for personalization
- Default to "there" if skipped

---

### **Page 4: Value Proposition**
**Purpose:** Communicate core benefits before asking for user data

**Visual Elements:**
- Swipeable cards.
- Icons for each benefit
- Progress indicator: 4/10

**Content:**
```
Headline: "Here's how Anu helps you grow"
```

**Card 1: Guided Conversations**
```
🗣️ Therapeutic Conversations
"I'll help you untangle complex thoughts and emotions through evidence-based techniques"
```

**Card 2: Personalized Exercises**
```
🎯 14+ Therapeutic Exercises
"From breathing techniques to CBT tools, all tailored to your specific needs"
```

**Card 3: Insights & Progress**
```
📊 Personal Insights Dashboard
"Discover patterns in your thinking, track your growth, and celebrate progress"
```

**Card 4: Always Learning**
```
🧠 AI That Remembers You
"I learn from our conversations to provide increasingly personalized support"
```

**Actions:**
- Dots indicator showing card position
- Primary Button: "Let's get started"

---

### **Page 5: Motivation Discovery**
**Purpose:** Understand user's immediate need (critical for personalization)

**Visual Elements:**
- Anu avatar with thoughtful expression
- Text area with example placeholder
- Quick selection chips below
- Progress indicator: 5/10

**Content:**
```
Anu asks: "What brought you here today?"
Subtitle: "This helps me understand how to best support you"
```

**Input Options:**
1. **Free Text Area:** 
   - Placeholder: "I've been feeling overwhelmed at work and..."
   - Character limit: 200

2. **Quick Chips (if no text entered):**
   - Feeling stressed
   - Overthinking everything
   - Relationship challenges
   - Work burnout
   - Low mood
   - Sleep issues
   - Just exploring

**Actions:**
- Primary Button: "Continue"
- Skip for now

**Backend Logic:**
- AI analyzes text for initial insight extraction
- Maps to relevant exercise categories
- Seeds first conversation topic

---

### **Page 6: Current State & Goals**
**Purpose:** Map struggles to outcomes for targeted support

**Visual Elements:**
- Two-section layout (Current/Desired)
- Selectable chips with subtle animations
- Progress indicator: 6/10

**Content:**
```
Headline: "Let's understand your journey"
```

**Section 1: Current Challenges**
```
"What are you struggling with? (select all that apply)"

□ Constant worry         □ Negative self-talk
□ Overthinking           □ Low energy
□ Stress                 □ Difficulty focusing
□ Relationship issues    □ Sleep problems
□ Work pressure          □ Lack of boundaries
```

**Section 2: Desired Outcomes**
```
"What would you like to achieve? (select top 2)"

○ Feel calmer daily
○ Stop overthinking
○ Build confidence
○ Improve relationships
○ Sleep better
○ Set healthy boundaries
○ Be kinder to myself
○ Find life direction
```

**Actions:**
- Primary Button: "Continue" (enabled after at least 1 selection)
- Secondary: "Not sure yet"

**Backend Logic:**
- Map struggles → relevant exercises
- Map goals → progress tracking metrics
- Influence AI conversation style

---

### **Page 7: Baseline Check-in**
**Purpose:** Establish measurable baseline for progress tracking

**Visual Elements:**
- Clean slider interface
- Emoji indicators at scale endpoints
- Progress indicator: 7/10

**Content:**
```
Headline: "Quick check-in"
Subtitle: "This helps me track your progress over time"
```

**Measurements:**
1. **Mood Right Now**
   - Slider: 1-10 (😔 to 😊)
   - Label: "How's your mood today?"

2. **Stress Level**
   - Slider: 1-10 (😌 to 😰)
   - Label: "How stressed do you feel?"

3. **Optional Quick Scales:**
   ```
   Over the past 2 weeks, how often have you:
   
   Felt down or hopeless?
   ○ Not at all  ○ Several days  ○ Most days  ○ Every day
   
   Felt nervous or on edge?
   ○ Not at all  ○ Several days  ○ Most days  ○ Every day
   ```

**Actions:**
- Primary Button: "Continue"
- Secondary: "Skip scales" (only for optional section)

---

### **Page 9: Engagement Setup** (Optional)
**Purpose:** Optimize engagement through timely nudges

**Visual Elements:**
- Clock icon with notification preview
- Time selector interface
- Progress indicator: 9/10

**Content:**
```
Headline: "When should I check in?"
Subtitle: "Gentle reminders help build healthy habits"
```

**Options:**
1. **Daily Check-in Time**
   - Morning (7-9 AM)
   - Afternoon (12-2 PM)
   - Evening (6-8 PM)
   - Before bed (9-11 PM)
   - No reminders

2. **Notification Preferences**
   - □ Daily mood check-ins
   - □ Exercise suggestions
   - □ Weekly progress summaries
   - □ Insights updates

**Actions:**
- Primary Button: "Continue"
- Secondary: "Set up later"

---

### **Page 10: First Win - Immediate Value**
**Purpose:** Convert onboarding into immediate therapeutic value

**Visual Elements:**
- Celebratory Anu animation
- Personalized recommendation card
- Two clear action paths
- Progress indicator: Complete! ✓

**Content:**
```
Headline: "Perfect, [Name]! Let's begin 🎉"

[Personalized message based on inputs]
Example: "Based on your goal to reduce overthinking and feel calmer, 
I've prepared something special for you."
```

**Recommended First Action (Dynamic):**

**Option A: If high stress/anxiety detected:**
```
🫁 3-Minute Calming Exercise
"Let's start with a quick breathing exercise to help you feel grounded"
[Start Exercise]
```

**Option B: If overthinking selected:**
```
🧠 Thought Sorting Exercise
"A gentle CBT technique to organize those racing thoughts"
[Start Exercise]
```

**Option C: If general exploration:**
```
💬 Guided First Session
"Let's have a conversation about what's on your mind"
[Start Chat]
```

**Actions:**
- Primary Button: [Dynamic based on recommendation]
- Secondary: "Explore on my own"
- Skip: "Maybe later" (goes to main dashboard)

---

## 🔄 **Post-Onboarding Immediate Actions**

### **If Exercise Selected:**
1. Launch directly into exercise flow
2. Simplified first exercise (shorter than normal)
3. Post-exercise: Show first insight extracted
4. Transition to main dashboard with "Great start!" message

### **If Chat Selected:**
1. Open chat with Anu
2. Anu references onboarding inputs
3. First message: "I remember you mentioned [user's concern]. Would you like to talk about that, or is there something else on your mind right now?"

### **If Skipped:**
1. Land on dashboard
2. Show feature hints/tooltips
3. Anu available in corner: "I'm here when you're ready"

---

## 📊 **Data Captured for Personalization**

### **Essential Data (Required):**
- Privacy consent
- Primary reason for joining
- At least one current struggle OR goal

### **Valuable Data (Encouraged):**
- Name
- Baseline mood/stress
- Interaction preferences
- Notification preferences

### **Optional Data:**
- PHQ-2/GAD-2 responses
- Detailed free-text responses
- Attribution source

---

## 🎯 **Success Metrics**

### **Onboarding Completion:**
- Target: >85% complete full flow
- <90 seconds average completion time
- <10% skip to dashboard

### **First Session Engagement:**
- >70% complete first exercise/chat within 5 minutes
- >60% return within 24 hours
- >50% complete 3+ sessions in first week

### **Personalization Effectiveness:**
- >80% of suggested exercises marked helpful
- Mood improvement in first session: Average +1.5 points
- First insight extraction: 100% of users who complete exercise

---

## 🔧 **Technical Implementation Notes**

### **Progressive Disclosure:**
- Load next screen while user completes current
- Smooth transitions between pages
- Save progress locally (in case of app crash)

### **AI Processing:**
- Begin processing user inputs immediately
- Pre-generate first exercise/conversation by page 8
- Have personalized content ready by final screen

### **Fallback Handling:**
- If user skips most screens: Use safe defaults
- Minimum viable personalization: Just consent + one data point
- Anonymous mode: Full features minus personalization

### **A/B Testing Opportunities:**
- Number of screens (8 vs 10)
- Required vs optional fields
- First action (exercise vs chat vs explore)
- Onboarding completion incentive (badge/achievement)