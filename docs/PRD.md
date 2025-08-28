# **PRD Work Packages (Open Items)**

### **1. Insights Tab**

- We need to **define the categories** (examples so far: Patterns, Thinking Habits, Values, Self-Kindness, Actions, Strengths).
- Labels and structure are **not fixed yet** → must be discussed, tested, and refined.
- We need to decide **how each category is displayed** (cards, charts, lists, word clouds, etc.).
- Must include a **motivational aspect** so users feel progress (streaks, milestones, growth summaries, etc.).
- Important: insights themselves may already feel motivating, but we should explore how to **combine insights + motivational cues** in one place.
- There can be 1 or 2 buttons:
    - View deeper insights with text and more analysis, how insight can be helpful
    - Do exercises to work on this insight more

---

### **2. Exercises**

- We need to **define the set of exercises** (6–7 pillars were given as examples, but this is not final).
- We need to decide the **labels/names of exercises** and how they’re communicated to the user.
- Each exercise will need:
    - A flow (intro → steps → close).
    - Defined AI interactions (how to ask, when to go deeper, when to move on).
    - Rules for **what data is captured** → how this connects to Insights.
- Open: whether data capture should follow a **general logic across all exercises** or be **custom per exercise**.

---

### **3. AI Guidance Logic**

- Needs definition of:
    - **Session entry:** ask if user has something specific vs. wants guidance.
        
        **Session start choice:**
        
        - Ask: “Do you have something on your mind, or would you like me to guide you?”
    - **Exercise suggestion logic:** based on recent insights, user input, or personalization rules.
    - **Journey feel:** phrasing that makes the user feel guided (“We’re building step by step…”).
- Must decide **when AI probes deeper vs. when it moves forward.**
- Must clarify how **context is always explained** (why exercise matters, how many steps, benefits).

---

### **4. Insights Extraction**

- Categories are not final — must be defined.
- Need to decide if extraction is:
    - **AI-assisted** (detects candidates and asks user “Save this?”), or
    - **Rule-based** (e.g., anything marked as “reframe” → goes into Thinking Habits).
- We must clarify the **mapping logic** → how each exercise or chat flow produces data that ends up in Insights.

---

### **5. Tone of Voice**

- Needs to be fully defined as guidelines:
    - Persona (Turtle therapist: wise, calm, slightly playful).
    - Guardrails (what to avoid, how to phrase things).
    - Consistency (intro, exercise steps, reflections, nudges).
- Still open: what balance of *therapist / coach / friend* tone to take.

---

### **6. Guided Session Structure**

- Start: option between *free topic* vs. *guided session*.
- Middle: AI suggests exercise(s) or follows user topic.
- Transition: must not feel like a hard UI switch, but still give **context** (“This is a 3-step exercise, here’s why it helps”).
- End: capture reflection, save to Insights, close with motivation.
- Still to decide:
    - How much UI change we want when starting an exercise.
    - How much context is given upfront.

---

### **7. Memory & Personalization**

- We need to define how **AI uses insights in future sessions** (referring back, suggesting continuity).
    - Refers back (“Last time you mentioned…”).
    - Suggests continuity (“Shall we build on that reframe from yesterday?”).
- Must map how **insights + personalization** feed into session guidance.
    - Insights Tab → informs next guided session.
    - Guided sessions → feed back into Insights Tab.
- Still open:
    - how much personalization is rule-based vs. AI-driven
    - when to adjust tone, depth, or exercise selection.

### **Memory & Personalization**

- Define **how AI uses past insights**:
    - Refers back (“Last time you mentioned…”).
    - Suggests continuity (“Shall we build on that reframe from yesterday?”).
- Define **data → guidance loop**:
    - Insights Tab → informs next guided session.
    - Guided sessions → feed back into Insights Tab.
- Define **personalization rules**: when to adjust tone, depth, or exercise selection.

---

### **8. User Motivation & Progress**

- Decide how to **show progress**: streaks, milestones, insights).
- Decide how to **keep engagement**: gentle nudges, reminders, weekly reflection summaries.
- Decide how to **balance structure with freedom** (guided plan + free exploration).
- Key: motivational aspects should tie into **insights** (so users see progress in self-knowledge, not just streaks).

# 📌 **Additional Items for Later Development**

### **1. Additional Tools**

- Breathing exercises (short calming tools).
- Micro-meditations, grounding techniques.
- Possibly journaling templates, affirmations, or relaxation exercises.

### **2. Onboarding Flow**

- Guided intro with Turtle.
- Ask about goals, struggles, focus areas.
- Set initial personalization (what to suggest first).
- Capture baseline mood / mental health state (optional short scale).

### **3. Tone of Voice Adjustment**

- Adapt tone based on user’s state:
    - Calmer when user is anxious.
    - More playful when mood is light.
- Could be rules-based + AI nuance.

### **4. Goals & Personalization**

- Allow user to define **goals** (e.g., “reduce stress,” “build confidence”).
- Goals link to exercise suggestions + insights categories.
- Adjust personalization logic to keep sessions aligned with goals.

1. Setting Reminders / Notifications
2. Payment plans & Marketing it in the app
3. Review Flow (happy? Leave review)