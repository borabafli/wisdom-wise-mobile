# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Install dependencies**: `npm install`
- **Start server**: `npx expo start`


## Project Architecture

### Technology Stack
- **Framework**: React Native with Expo SDK 53
- **Backend**: Supabase with Edge Functions for serverless AI processing
- **Navigation**: React Navigation v7 with bottom tabs
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Typography**: Custom font system with 6 font families (Inter, Poppins, Nunito, Source Serif Pro, Lora, Crimson Text)
- **UI Components**: Lucide React Native icons, Expo Linear Gradient, Expo Blur
- **Voice Features**: Expo Speech Recognition, Expo Speech (TTS), React Native Voice
- **Platform**: Cross-platform (iOS, Android, Web)

## Visual Development

### Design Principles
- Comprehensive design checklist in '/docs/design-principles.md'
- Brand style guide in '/docs/style-guide.md'
- When making visual (front-end, UI/UX) changes, always refer to these files for guidance

### Quick Visual Check
IMMEDIATELY after implementing any front-end change:
1. **Identify what changed** - Review the modified /src/components and src/screens, /styles
2. **Navigate to affected pages** - Use mcp_playwright_browser_navigate to visit each changed view
3. **Mobile-first viewport testing** - Test at key mobile breakpoints (375px, 390px, 414px) using mcp_playwright_browser_resize
4. **Verify responsive behavior** - Ensure no horizontal scrolling, proper touch targets (min 44px), and content reflow
5. **Check mobile interactions** - Test touch events, gestures, and mobile-specific UI patterns
6. **Verify design compliance** - Compare against '/docs/design-principles.md' and */docs/style-guide.md*
7. **Validate feature implementation** - Ensure the change fulfills the user's specific request on all tested viewports
8. **Check acceptance criteria** - Review any provided context files or requirements
9. **Capture mobile evidence** - Take screenshots at each mobile viewport size (375px, 390px, 414px) of each changed view
10. **Check for errors** - Run mcp_playwright_browser_console_messages and verify no mobile-specific issues


### App Structure
WisdomWise is a mindfulness and mental health support app built around a therapeutic AI companion (turtle therapist named Anu). The app features:

- **4 Main Tabs**: Home, Exercises, Insights, Profile
- **Chat Interface**: AI-guided therapy sessions with advanced exercise detection and flow management
- **Custom Tab Bar**: With floating action button for new sessions
- **Service Architecture**: Modular services for chat, transcription, and model management
- **Supabase Integration**: Edge Functions for secure AI processing and data management

### Key Components

**App.tsx**: Root component managing navigation state and chat modal overlay. Controls the flow between tab navigation and fullscreen chat interface.

**Navigation Pattern**: The app uses a unique hybrid approach:
- Tab navigator for main screens
- Modal-style chat overlay that completely replaces the tab navigator
- State management in App.tsx handles transitions between modes

**Screen Architecture**:
- `src/screens/HomeScreen.tsx`: Dashboard with quick actions and insights preview
- `src/screens/ExerciseLibrary.tsx`: Browse and select therapy exercises  
- `src/screens/InsightsDashboard.tsx`: User progress and patterns analysis
- `src/screens/ProfileScreen.tsx`: User settings and preferences
- `src/screens/ChatInterface.tsx`: Main AI conversation interface

**Core Services**:
- `src/services/chatService.ts`: AI conversation handling with context management
- `src/services/transcriptionService.ts`: Speech-to-text processing with context
- `src/services/modelService.ts`: AI model configuration and management
- `src/services/apiService.ts`: Legacy compatibility layer delegating to focused services
- `src/utils/apiErrorHandler.ts`: Centralized error handling and user feedback

**Advanced Hooks**:
- `src/hooks/chat/useChatSession.ts`: Core chat functionality with exercise detection
- `src/hooks/useExerciseFlow.ts`: Exercise progression and dynamic flow management
- `src/hooks/useSessionManagement.ts`: Session lifecycle and state management
- `src/hooks/useMessageFormatting.ts`: Message processing, formatting, and TTS integration

**Chat Components**:
- `src/components/chat/MessageItem.tsx`: Individual message rendering with TTS controls
- `src/components/chat/`: Specialized chat interface components
- `src/components/CustomTabBar.tsx`: Custom tab bar with action palette integration
- `src/components/ActionPalette.tsx`: Floating menu for starting therapy sessions

### Styling System
- **Architecture**: Modern design system with separated styles and design tokens
- **Design Tokens**: Centralized design tokens in `src/styles/tokens/` (colors, typography, spacing, shadows)
- **Component Styles**: Separated style files in `src/styles/components/` for better maintainability
- **Import Pattern**: Components import styles using `import { componentStyles as styles } from '../styles/components/Component.styles'`
- **Design Language**: Therapeutic, calming aesthetic with semantic color naming and consistent spacing
- **Color System**: Comprehensive palette with primary/secondary colors, semantic colors, gradients, and alpha variants
- **Typography**: Custom font families with predefined text styles for consistent hierarchy
- **Spacing**: Numeric scale (0-64px) plus component-specific and layout spacing tokens
- **Shadows**: Elevation system with component-specific shadow presets

### Backend Integration
- **Supabase Edge Functions**: Serverless functions in `/supabase/functions/` for AI processing
  - `ai-chat/`: Main AI conversation endpoint with context handling
  - `extract-insights/`: User data analysis and insights generation
- **Security**: API keys and sensitive operations handled securely server-side
- **Scalability**: Serverless architecture for dynamic scaling

### Configuration Files
- **tailwind.config.js**: Extensive custom theme with therapeutic design tokens
- **app.json**: Expo configuration with permissions (RECORD_AUDIO, microphone access for voice features)
- **metro.config.js**: Custom Metro config with Node.js polyfill for os.availableParallelism

### Architecture Patterns
- **Modular Services**: Decomposed monolithic API service into focused, single-responsibility services
- **Hook-Based State Management**: Complex state logic encapsulated in reusable hooks
- **Exercise Flow Management**: Dynamic exercise detection from AI responses with user confirmation patterns
- **Message Processing Pipeline**: Sophisticated formatting, typewriter effects, and TTS integration
- **Error Handling**: Centralized error handling with user-friendly fallback responses
- **Context Management**: Intelligent conversation context assembly for AI interactions

### Data Management
- **Exercise Library**: Comprehensive exercise data with keyword detection system (`src/data/exerciseLibrary.ts`)
- **Storage Service**: Local message persistence and conversation history
- **Rate Limiting**: Built-in rate limiting service for API usage management
- **Context Service**: Intelligent context assembly for AI conversations

### Project Status
This is an active development project with sophisticated AI-driven therapy features, advanced exercise flow management, and comprehensive voice interaction capabilities.

### Development Guides
- If the requested functionality is too complex to handle within the code alone, you may suggest alternative approaches (e.g., "we should create a database for this in the following way...").
- If a new edge function needs to be created, it should also be created within /supabase/functions. We must always have Supabase functions available locally. This is a MUST DO.
- Follow React Native best practices. Instead of creating large single components, check for opportunities to split them and improve reusability.
- Our system prompts and configuration of AI responses are highly important. We don't want you to make changes without asking permission for AI System Prompt modifications.
- End your last sentence with "be water my friend, take care 🧘🏼‍♀️".