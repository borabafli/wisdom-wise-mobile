# Mental Wellness App Design Guide

## Design Philosophy
**"Gentle Growth Through Mindful Moments"**

A therapeutic digital companion that creates a safe, nurturing space for emotional exploration and personal growth. Every design decision prioritizes psychological safety, accessibility, and the user's sense of agency in their wellness journey.

## Brand Character

### Visual Personality
- **Serene & Calming**: Like a peaceful meditation garden
- **Approachable & Friendly**: Never clinical or intimidating  
- **Supportive & Encouraging**: A gentle companion, not an authority
- **Organic & Natural**: Flowing, soft forms inspired by nature
- **Trustworthy & Safe**: Professional yet warm

## Color System

### Primary Palette
- **Hero Teal** (#4A9B8E): Primary brand color for CTAs and key elements
- **Soft Sage** (#6BB3A5): Secondary teal for interactive elements
- **Mint Whisper** (#E8F4F1): Light backgrounds and cards
- **Ocean Mist** (#D4E8E4): Subtle accents and dividers

### Background Colors
- **Cloud White** (#F8FAFB): Primary background
- **Morning Sky** (#E8F2F4): Secondary sections
- **Soft Pearl** (#F5F5F5): Neutral card backgrounds

### Accent Colors
- **Warm Peach** (#FFD4C4): Mascot's shell and warm touches
- **Sunset Coral** (#FFB5A0): Illustrations and energy points
- **Sky Blue** (#87CEEB): Complementary highlights
- **Gentle Yellow** (#FFF4E6): Optimistic accents in illustrations

### Text Colors
- **Deep Charcoal** (#2D3436): Primary text
- **Soft Gray** (#6B7280): Secondary text and labels
- **Muted Teal** (#5A8A7F): Links and interactive text
- **Light Gray** (#9CA3AF): Disabled states and hints

### Semantic Colors
- **Success**: #4ADE80 (Soft green)
- **Warning**: #FBBF24 (Gentle amber)
- **Error**: #F87171 (Soft red, used sparingly)
- **Info**: #60A5FA (Sky blue)

## Typography

### Type Scale & Usage

#### Display
- **Extra Large**: 32-36px, Ubuntu Bold
  - Welcome screens and major milestones
- **Large**: 28-30px, Ubuntu Bold  
  - Section headers like "How are you feeling?"

#### Headlines
- **H1**: 24px, Ubuntu Bold
  - Primary page titles
- **H2**: 20px, Ubuntu Medium
  - Section headers like "YOUR NEXT STEPS"
- **H3**: 18px, Ubuntu Medium
  - Card titles and subsections

#### Body
- **Large Body**: 16px, Ubuntu Regular
  - Primary content and descriptions
- **Regular Body**: 14px, Ubuntu Regular
  - Standard interface text
- **Small Body**: 13px, Ubuntu Light
  - Supporting text and timestamps

#### Interface
- **Button**: 14-16px, Ubuntu Medium
  - All caps or sentence case depending on hierarchy
- **Caption**: 12px, Ubuntu Light
  - Labels, hints, and metadata
- **Micro**: 11px, Ubuntu Light
  - Badges and indicators

### Font Characteristics
- **Line Height**: 1.5x for body text, 1.2x for headers
- **Letter Spacing**: Slightly increased (0.02em) for readability
- **Font Weight Range**: 300 (Light) to 700 (Bold)

## Visual Elements

### Mascot Design
- **Character**: Friendly turtle with meditation pose
- **Color Palette**: Soft sage green with peach accents
- **Expression**: Peaceful, content, approachable
- **Usage**: Onboarding, empty states, achievements
- **Personality**: Wise, patient, encouraging companion

### Illustration Style
**"Organic Watercolor Minimalism"**

Key characteristics:
- **Technique**: Soft watercolor with visible texture and organic flow
- **Color Application**: Monochromatic teal gradients with occasional warm accents
- **Composition**: Generous white space with floating elements
- **Forms**: Nature-inspired silhouettes and abstract organic shapes
- **Texture**: Mottled paint effects with natural pooling
- **Edges**: Soft, bleeding boundaries that dissolve gently
- **Mood**: Contemplative, serene, naturally elegant

### Background Patterns
- **Floating Clouds**: Soft, amorphous shapes in pale teal
- **Gradient Washes**: Subtle teal-to-mint transitions
- **Organic Waves**: Flowing lines suggesting water or air
- **Negative Space**: Always 40-60% empty space for breathing room

### Icons
- **Style**: Outline with 2px stroke weight
- **Corner Radius**: Rounded terminals
- **Size Grid**: 24x24px base, scalable to 16px and 32px
- **Active State**: Filled version with teal color
- **Inactive**: Light gray outline (#9CA3AF)

## Component Specifications

### Cards & Containers

#### Primary Card
- **Background**: White (#FFFFFF)
- **Border Radius**: 16px
- **Padding**: 20px (mobile), 24px (tablet)
- **Shadow**: 0 2px 8px rgba(74, 155, 142, 0.08)
- **Border**: Optional 1px solid #E8F4F1

#### Floating Card (Featured)
- **Background**: Linear gradient (#E8F4F1 to #FFFFFF)
- **Border Radius**: 20px
- **Padding**: 24px all sides
- **Shadow**: 0 4px 16px rgba(74, 155, 142, 0.12)
- **Illustration**: Integrated watercolor elements

### Buttons

#### Primary Button
- **Background**: #4A9B8E
- **Text**: White, 14px Ubuntu Medium
- **Border Radius**: 24px (pill-shaped)
- **Height**: 48px
- **Padding**: 16px 32px
- **Shadow**: 0 2px 8px rgba(74, 155, 142, 0.2)
- **Hover**: Darken 10%, scale(1.02)
- **Active**: Scale(0.98)

#### Secondary Button
- **Background**: #E8F4F1
- **Text**: #4A9B8E, 14px Ubuntu Medium
- **Border**: 2px solid #4A9B8E
- **Border Radius**: 24px
- **Height**: 44px

#### Text Button
- **Text**: #5A8A7F, 14px Ubuntu Regular
- **Underline on hover**
- **No background**

### Input Fields

#### Text Input
- **Height**: 48px minimum
- **Border**: 1px solid #D4E8E4
- **Border Radius**: 12px
- **Padding**: 12px 16px
- **Focus Border**: 2px solid #4A9B8E
- **Placeholder**: #9CA3AF, Ubuntu Light

#### Voice Input Field
- **Microphone Icon**: Right-aligned, teal when active
- **Recording Indicator**: Pulsing teal circle
- **Waveform**: Optional visualization in teal gradient

### Navigation

#### Bottom Tab Bar
- **Height**: 64px
- **Background**: White with top border (#E8F4F1)
- **Icons**: 24px, centered with 8px label gap
- **Active Color**: #4A9B8E (filled icon + text)
- **Inactive**: #9CA3AF (outline icon + text)
- **Selection Indicator**: 4px teal bar above icon

### Progress Indicators
- **Linear**: 4px height, rounded ends, teal fill
- **Circular**: 3px stroke, teal progress on light gray track
- **Step Indicators**: Connected dots, filled when complete

## Layout & Spacing

### Grid System
- **Mobile**: 16px margins, 8px gutters
- **Tablet**: 24px margins, 16px gutters  
- **Desktop**: 32px margins, 24px gutters
- **Max Content Width**: 1200px centered

### Spacing Scale
- **Base Unit**: 8px
- **Micro**: 4px (tight grouping)
- **Small**: 8px (related elements)
- **Medium**: 16px (standard gap)
- **Large**: 24px (section breaks)
- **XL**: 32px (major sections)
- **XXL**: 48px (page sections)

### Component Spacing
- **Card Internal**: 16-20px padding
- **Between Cards**: 16px gap
- **Section Headers**: 24px margin bottom
- **Paragraph Spacing**: 12px
- **List Items**: 12px gap

## Motion & Interaction

### Animation Principles
- **Duration**: 250-400ms for most transitions
- **Easing**: ease-in-out for natural movement
- **Stagger**: 50ms delay between list items
- **Spring**: Subtle bounce for delightful moments

### Transition Types
- **Fade In**: Opacity 0 to 1, 300ms
- **Slide Up**: TranslateY(20px) to 0, 350ms
- **Scale**: 0.95 to 1 for cards appearing
- **Morphing**: Smooth shape transitions for buttons

### Micro-interactions
- **Button Press**: Scale(0.98) with 150ms duration
- **Card Hover**: Subtle shadow increase, 250ms
- **Tab Switch**: Slide animation, 300ms
- **Loading States**: Pulsing teal skeleton screens

### Feedback Patterns
- **Success**: Checkmark animation with gentle bounce
- **Input Focus**: Border color transition + slight scale
- **Progress**: Smooth fill animations
- **Scroll**: Parallax effects on illustrations (subtle)

## Accessibility Standards


### Interactive Accessibility
- **Keyboard Navigation**: Full support, visible focus states
- **Screen Readers**: Semantic HTML, ARIA labels
- **Motion Preferences**: Respect reduced-motion settings
- **Color Independence**: Never rely solely on color

### Content Accessibility
- **Clear Labels**: Descriptive, action-oriented
- **Error Messages**: Helpful, specific guidance
- **Alternative Text**: Meaningful descriptions for images
- **Consistent Patterns**: Predictable interactions

## Content Guidelines

### Voice & Tone

#### Characteristics
- **Warm & Encouraging**: "You're doing great"
- **Non-judgmental**: "There's no wrong answer"
- **Empowering**: "You have the tools within you"
- **Gentle**: "Take your time"
- **Professional yet Friendly**: Knowledgeable but approachable

#### Language Patterns
- Use "you" and "your" for personalization
- Prefer questions over commands
- Offer choices, not prescriptions
- Celebrate small victories
- Acknowledge feelings without judgment

### Writing Principles
- **Clarity First**: Simple, clear language
- **Brevity**: Concise without being terse
- **Positivity**: Frame things constructively
- **Inclusivity**: Gender-neutral, culturally sensitive
- **Empathy**: Acknowledge the user's experience


## Platform-Specific Considerations

### iOS
- **Safe Areas**: Respect notch and home indicator
- **Haptics**: Subtle feedback on interactions
- **Dark Mode**: Full theme support with adjusted colors
- **Dynamic Type**: Support system font sizing

### Android
- **Material Design**: Respect platform conventions where appropriate
- **Back Navigation**: Predictable behavior
- **Edge-to-edge**: Utilize full screen real estate
- **Adaptive Icons**: Proper icon masks

### Responsive Web
- **Breakpoints**: 
  - Mobile: 320-768px
  - Tablet: 768-1024px
  - Desktop: 1024px+
- **Touch-friendly**: Even on desktop
- **Progressive Enhancement**: Core features work everywhere
