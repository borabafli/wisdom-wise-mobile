# Style Guide - Mental Health App

## 🎨 Color Palette

### Primary Colors
```css
--primary-blue-teal: #5BA3B8;      /* Main brand color */
--primary-dark: #357A8A;           /* Darker variant */
--primary-light: #A8D5E8;          /* Lighter variant */
--primary-muted: #4A95A8;          /* Muted variant */
```

### Neutral Colors
```css
--white: #FFFFFF;
--off-white: #FAFBFC;
--light-gray: #F5F7FA;
--medium-gray: #E1E8ED;
--text-gray: #64748B;
--dark-gray: #334155;
--near-black: #1A2332;
```

### Accent Colors
```css
--lavender: #B5A7E6;        /* Mindfulness */
--mint: #A0D5D3;           /* Growth */
--peach: #FFC4B0;          /* Warmth */
--soft-yellow: #FFE5B4;    /* Hope */
```

### Semantic Colors
```css
--success: #7DBDB5;
--warning: #F4B860;
--error: #E8A0A0;
--info: #B8D4E8;
```

## 📐 Typography

### Font Stack
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
```

### Font Sizes
```css
--text-xs: 12px;     /* Captions, labels */
--text-sm: 14px;     /* Secondary text */
--text-base: 16px;   /* Body text */
--text-lg: 18px;     /* Emphasized body */
--text-xl: 22px;     /* H3 headers */
--text-2xl: 26px;    /* H2 headers */
--text-3xl: 32px;    /* H1 headers */
```

### Font Weights
```css
--font-regular: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Line Heights
```css
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;  /* Default for body text */
```

## 📏 Spacing

### Base Unit: 8px
```css
--space-1: 8px;
--space-2: 16px;
--space-3: 24px;
--space-4: 32px;
--space-5: 40px;
--space-6: 48px;
--space-8: 64px;
```

## 🔲 Border Radius
```css
--radius-sm: 8px;     /* Input fields, small elements */
--radius-md: 12px;    /* Buttons, badges */
--radius-lg: 16px;    /* Cards, containers */
--radius-xl: 20px;    /* Modals, large cards */
--radius-full: 9999px; /* Pills, circular elements */
```

## 🎭 Shadows
```css
--shadow-sm: 0 2px 8px rgba(91, 163, 184, 0.08);
--shadow-md: 0 4px 16px rgba(91, 163, 184, 0.12);
--shadow-lg: 0 8px 24px rgba(91, 163, 184, 0.16);
--shadow-glow: 0 0 20px rgba(91, 163, 184, 0.2);
```

## ⚡ Animations
```css
--duration-fast: 200ms;
--duration-normal: 400ms;
--duration-slow: 600ms;
--duration-breathing: 4000ms;

--ease-default: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

## 🧩 Component Patterns

### Buttons
```css
/* Primary Button */
.btn-primary {
  background: var(--primary-blue-teal);
  color: white;
  padding: 12px 24px;
  border-radius: var(--radius-full);
  font-weight: var(--font-semibold);
  transition: all var(--duration-normal) var(--ease-default);
}

/* Ghost Button */
.btn-ghost {
  background: transparent;
  color: var(--primary-blue-teal);
  border: 2px solid var(--primary-blue-teal);
  padding: 10px 22px;
  border-radius: var(--radius-full);
}
```

### Cards
```css
.card {
  background: white;
  border-radius: var(--radius-lg);
  padding: var(--space-3);
  box-shadow: var(--shadow-sm);
  transition: transform var(--duration-normal) var(--ease-default);
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}
```

### Input Fields
```css
.input {
  background: var(--off-white);
  border: 2px solid transparent;
  border-radius: var(--radius-sm);
  padding: 12px 16px;
  font-size: var(--text-base);
  transition: all var(--duration-fast) var(--ease-default);
}

.input:focus {
  border-color: var(--primary-blue-teal);
  background: white;
  box-shadow: var(--shadow-glow);
}
```

## 📱 Breakpoints
```css
--mobile: 320px;
--tablet: 768px;
--desktop: 1024px;
--wide: 1280px;
```

## 🌙 Dark Mode
```css
[data-theme="dark"] {
  --bg-primary: #1A2332;
  --bg-secondary: #242B3A;
  --text-primary: #F0F4F8;
  --text-secondary: #B8C5D6;
  --primary-blue-teal: #3A7585;
}
```

## ✅ Quick Implementation Checklist

### Every Component Should Have:
- [ ] Soft, rounded corners (no sharp edges)
- [ ] Gentle shadows (never harsh)
- [ ] Smooth transitions (400-600ms)
- [ ] Ample padding/spacing
- [ ] Clear hover/focus states
- [ ] Accessible color contrast (WCAG AA minimum)

### Every Screen Should Have:
- [ ] Generous white space
- [ ] Clear visual hierarchy
- [ ] Obvious primary action
- [ ] Easy navigation back/exit
- [ ] Calming color usage (70% neutral, 20% primary, 10% accent)
- [ ] Mobile-responsive layout

### Every Interaction Should Be:
- [ ] Predictable and gentle
- [ ] Reversible or skippable
- [ ] Accompanied by subtle feedback
- [ ] Accessible via keyboard
- [ ] Touch-target minimum 48x48px

## 🎯 Usage Examples

### Calming Hero Section
```html
<div class="hero" style="
  background: linear-gradient(135deg, #A8D5E8 0%, #5BA3B8 100%);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
">
  <h1 style="
    font-size: var(--text-3xl);
    color: white;
    margin-bottom: var(--space-2);
  ">Good Morning, Sarah!</h1>
  <p style="
    font-size: var(--text-lg);
    color: rgba(255,255,255,0.9);
    line-height: var(--leading-relaxed);
  ">Let's take a moment for yourself today</p>
</div>
```

### Exercise Card
```html
<div class="card exercise-card">
  <div class="card-header">
    <span class="badge">5 min</span>
    <span class="category">Anxiety</span>
  </div>
  <h3>Breathing Exercise</h3>
  <p>Find calm through guided breathing</p>
  <button class="btn-primary">Start</button>
</div>
```

### Mood Tracker
```html
<div class="mood-selector" style="
  display: flex;
  gap: var(--space-2);
  padding: var(--space-3);
  background: var(--light-gray);
  border-radius: var(--radius-lg);
">
  <button class="mood-option">😊</button>
  <button class="mood-option">😐</button>
  <button class="mood-option">😔</button>
</div>
```

## 📝 Writing Style

### Voice & Tone
- **Encouraging:** "You're doing great" not "Good job"
- **Gentle:** "When you're ready" not "Start now"
- **Supportive:** "It's okay to pause" not "Don't quit"
- **Inclusive:** "Many people feel..." not "You might feel..."

### Button Labels
- ✅ "Continue when ready"
- ✅ "Take a break"
- ✅ "Explore exercises"
- ❌ "Submit"
- ❌ "Cancel"
- ❌ "Error"

### Messages
- **Success:** "Wonderful progress today! 🎉"
- **Reminder:** "Remember to be kind to yourself"
- **Error:** "Something went wrong. Let's try again together"
- **Empty State:** "Your journey starts here. Take your time."

---

*Remember: Every pixel should contribute to calm and clarity.*