# Mental Health Guidance App Design Principles

## I. Core Design Philosophy

### Emotional Foundation
*   **Calm & Supportive First:** Every design decision prioritizes creating a safe, calming environment that reduces anxiety rather than adding to it
*   **Non-judgmental Space:** Design elements communicate acceptance and understanding without pressure or expectations
*   **Gentle Guidance:** Lead users through their wellness journey with soft suggestions rather than demands
*   **Progress, Not Perfection:** Celebrate small wins and normalize the non-linear nature of mental health journeys

### User-Centered Approach
*   **Accessibility as Priority:** WCAG AAA compliance for mental health contexts - considering users may be in distress
*   **Cognitive Load Minimization:** Reduce decision fatigue through thoughtful defaults and progressive disclosure
*   **Privacy & Trust:** Communicate data safety and user privacy through design, not just words
*   **Inclusive Design:** Consider diverse mental health experiences, cultural backgrounds, and comfort levels with technology

## II. Visual Language & Emotion

### Color Psychology
*   **Primary Palette:**
    *   **Soft Purple/Lavender (#8B7FD8):** Primary brand color - conveys creativity, mindfulness, and calm
    *   **Muted Blues (#A8C8EC):** Trust, stability, and tranquility
    *   **Warm Neutrals:** Cream, soft grays for backgrounds - avoiding stark whites that can feel clinical
    
*   **Accent Colors:**
    *   **Gentle Teal/Mint (#7FC4C4):** Growth and renewal
    *   **Soft Coral/Peach (#FFB5A0):** Warmth and compassion
    *   **Pale Yellow (#FFF4D6):** Hope and positivity (used sparingly)

*   **Semantic Colors (Softened):**
    *   **Success:** Soft sage green (#9DC88D) - growth achieved
    *   **Warning:** Warm amber (#F4B860) - gentle attention needed
    *   **Error:** Muted rose (#E8A0A0) - supportive correction
    *   **Information:** Sky blue (#87CEEB) - helpful insights

*   **Mood Indicators:**
    *   Gradient transitions between emotional states
    *   Emoji faces with soft, rounded features
    *   Color-coded but never harsh or jarring

### Typography for Readability & Comfort
*   **Font Selection:**
    *   **Primary:** Clean, humanist sans-serif (e.g., Inter, Manrope, SF Pro)
    *   **Display:** Slightly rounded for friendliness in headers
    *   **Body Text:** Optimal legibility at 16px minimum on mobile

*   **Hierarchy:**
    *   **H1:** 28-32px - Welcoming headlines
    *   **H2:** 22-24px - Section headers
    *   **Body:** 16-18px - Comfortable reading
    *   **Caption:** 14px - Supplementary information
    *   **Line Height:** 1.6-1.8 for maximum readability during distress

### Spatial Design & Breathing Room
*   **Generous White Space:** Create visual breathing room - literally helping users feel less overwhelmed
*   **Base Unit:** 8px grid system
*   **Padding Scale:** 16px, 24px, 32px, 48px - more space than typical apps
*   **Content Margins:** Wide margins on text blocks (max-width: 600-650px)
*   **Touch Targets:** Minimum 48x48px for accessibility during tremors or distress

## III. Component Design Language

### Soft Geometry
*   **Border Radius:**
    *   **Cards:** 16-20px - soft, approachable containers
    *   **Buttons:** 12-24px - pill-shaped for primary actions
    *   **Input Fields:** 8-12px - gentle corners
    *   **Modals:** 20-24px - floating, cloud-like appearance

### Interactive Elements
*   **Buttons:**
    *   Primary: Soft gradient or solid with subtle shadow
    *   Secondary: Ghost buttons with gentle borders
    *   States: Smooth transitions (300-400ms) with scale transforms
    *   Disabled: Lower opacity, never grayed out completely

*   **Cards & Containers:**
    *   Soft shadows (box-shadow: 0 4px 20px rgba(0,0,0,0.08))
    *   Subtle borders or gradient backgrounds
    *   Float effect on hover (transform: translateY(-2px))

*   **Progress Indicators:**
    *   Circular progress rings for exercises
    *   Soft gradient progress bars
    *   Celebratory micro-animations for completions

## IV. Motion & Micro-interactions

### Calming Animations
*   **Timing:** Slower, more deliberate (400-600ms default)
*   **Easing:** ease-in-out for natural, organic movement
*   **Breathing Animations:** 4-7-8 second cycles for guided exercises
*   **Loading States:** Gentle pulsing or morphing shapes, never aggressive spinners

### Feedback Patterns
*   **Success:** Gentle bloom or ripple effect
*   **Error:** Soft shake or pulse, never harsh
*   **Progress:** Smooth fills and gentle celebrations
*   **Transitions:** Cross-fade between screens, avoid jarring slides

## V. Content & Communication

### Voice & Tone
*   **Compassionate:** "Let's explore this together" vs. "You must complete"
*   **Encouraging:** "Great progress today!" vs. "Task completed"
*   **Non-directive:** "When you're ready" vs. "Start now"
*   **Normalizing:** "Many people find..." vs. "You should..."

### Information Architecture
*   **Progressive Disclosure:** Start simple, reveal complexity as needed
*   **Clear Wayfinding:** Always show where user is in their journey
*   **Escape Hatches:** Easy ways to pause, skip, or return home
*   **Contextual Help:** Inline tips rather than separate help sections

## VI. Specific Module Patterns

### Exercise Library
*   **Visual Categorization:** Color-coded by benefit type (Anxiety, Mood, Self-exploration)
*   **Duration Badges:** Clear time commitments upfront
*   **Preview Cards:** Soft gradient backgrounds with abstract, calming imagery
*   **Filter Pills:** Rounded, easy-tap filters with multi-select
*   **Smooth Scroll:** Momentum scrolling with rubber-band effect

### Home Dashboard
*   **Personalized Greeting:** Time-aware, using user's name
*   **Community Connection:** "X people thriving today" - reducing isolation
*   **Quick Actions:** Large, inviting cards with icons
*   **Daily Quote:** Inspirational but not toxic positivity
*   **Progress Celebration:** Subtle tracker without pressure

### Mood Tracking
*   **Emotion Faces:** Soft, approachable expressions
*   **Color Gradients:** Smooth transitions between mood states
*   **Data Visualization:** Gentle curves, never sharp angles
*   **Historical View:** Focus on patterns, not judgment
*   **Privacy First:** Clear data handling explanations


## VII. Accessibility & Inclusivity

### Technical Accessibility
*   **Color Contrast:** WCAG AAA where possible (7:1 for body text)
*   **Focus Indicators:** Soft glow rather than harsh outlines
*   **Screen Reader:** Comprehensive ARIA labels and landmarks
*   **Reduced Motion:** Respect prefers-reduced-motion settings
*   **Text Scaling:** Support up to 200% zoom without breaking

### Emotional Accessibility
*   **Crisis Resources:** Always accessible but not alarming
*   **Skip Options:** Never force completion of exercises
*   **Customization:** Theme options (light/dark/high contrast)
*   **Language:** Simple, clear, jargon-free
*   **Cultural Sensitivity:** Diverse imagery and examples

## VIII. Dark Mode Considerations

### Calming Night Theme
*   **Background:** Deep blue-gray (#1A2332) not pure black
*   **Cards:** Slightly lighter with blue tint (#242B3A) with subtle borders
*   **Text:** Soft white (#F0F4F8) with slight blue tint
*   **Accents:** Muted versions of the blue-teal palette
*   **Primary Blue:** Darker teal (#3A7585) for dark mode
*   **Shadows:** Subtle blue glow effects instead of drop shadows

## IX. Performance & Reliability

### Trust Through Speed
*   **Instant Feedback:** < 100ms response to user actions
*   **Smooth Scrolling:** 60fps maintained always
*   **Offline Support:** Core exercises cached locally
*   **Progressive Enhancement:** Basic features work everywhere
*   **Error Recovery:** Graceful degradation, never data loss

## X. Implementation Guidelines

### Component States
Each interactive element must have clearly defined states:
*   **Default:** Resting state, inviting interaction
*   **Hover:** Subtle elevation or glow
*   **Active:** Gentle depression or color shift
*   **Focus:** Soft outline for keyboard navigation
*   **Disabled:** Reduced opacity with helpful tooltip
*   **Loading:** Skeleton screens or gentle shimmer

### Responsive Breakpoints
*   **Mobile First:** 320px - 767px (thumb-friendly)
*   **Tablet:** 768px - 1023px (comfortable reading)
*   **Desktop:** 1024px+ (focused experience)
*   **Fluid Scaling:** Use rem/em units for accessibility

### Testing Checklist
*   [ ] User can complete core task in distressed state
*   [ ] All actions reversible or skippable
*   [ ] Works with one hand on mobile
*   [ ] Readable in bright sunlight and dark rooms
*   [ ] No triggering imagery or language
*   [ ] Loading states never exceed 3 seconds
*   [ ] Error messages are helpful, not blaming

## XI. Measuring Success

### Wellness Metrics (Not Just Engagement)
*   **Completion Comfort:** Users finish exercises without stress
*   **Return Rate:** Sustainable daily use without burnout
*   **Mood Improvement:** Tracked progress over time
*   **Accessibility Usage:** High screen reader/keyboard navigation use
*   **Crisis Intervention:** Successful connection to resources when needed

---

*"Design is not just what it looks like and feels like. Design is how it helps."*

These principles should guide every design decision, always asking: **"Does this reduce suffering and increase wellbeing?"**