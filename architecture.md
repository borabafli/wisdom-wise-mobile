# WisdomWise Architecture Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Architecture Patterns](#architecture-patterns)
5. [Data Flow Analysis](#data-flow-analysis)
6. [AI Integration Architecture](#ai-integration-architecture)
7. [State Management](#state-management)
8. [Service Architecture](#service-architecture)
9. [Exercise Flow System](#exercise-flow-system)
10. [Chat & Conversation Management](#chat--conversation-management)
11. [Navigation & UI Patterns](#navigation--ui-patterns)
12. [Styling System](#styling-system)
13. [Backend Integration](#backend-integration)
14. [Data Storage & Persistence](#data-storage--persistence)
15. [Security & Authentication](#security--authentication)
16. [Performance Considerations](#performance-considerations)
17. [Technical Issues & Improvements](#technical-issues--improvements)

---

## Project Overview

**WisdomWise** is a sophisticated React Native mental health therapy app featuring an AI-powered therapeutic companion named **Anu** (a turtle therapist). The app provides guided therapy exercises, conversation management, insights generation, and personalized mental health support through advanced AI integration.

### Core Features
- **AI Therapy Sessions**: Dynamic conversation with GPT/Gemini-powered therapist
- **Exercise Library**: 14+ therapeutic exercises with AI-guided flows
- **Voice Integration**: Speech-to-text, text-to-speech, and voice conversations
- **Insights Dashboard**: AI-generated patterns, mood tracking, and progress analytics
- **Journal System**: Guided and free-form journaling with AI prompts
- **Goal Setting**: Therapy goal management with progress tracking
- **Anonymous Usage**: Optional authentication with full feature access

---

## Technology Stack

### Core Framework
- **React Native**: 0.74.x with Expo SDK 53
- **TypeScript**: Full type safety across codebase
- **Metro**: Custom bundler configuration with Node.js polyfills

### Navigation & UI
- **React Navigation v7**: Bottom tabs with modal overlay patterns
- **NativeWind**: Tailwind CSS for React Native styling
- **Lucide React Native**: Consistent icon system
- **Expo Linear Gradient**: Advanced gradient effects
- **Expo Blur**: Native blur effects for UI

### Voice & Audio
- **Expo Speech**: Text-to-speech functionality
- **React Native Voice**: Speech recognition
- **Expo Speech Recognition**: Alternative STT implementation
- **Custom Audio Waveform**: Real-time audio visualization

### Backend & AI
- **Supabase**: Backend-as-a-Service with Edge Functions
- **OpenRouter API**: Multi-model AI access (GPT-4, Gemini, Claude)
- **OpenAI Whisper**: Speech transcription via OpenAI API
- **Edge Functions**: Serverless AI processing in Deno runtime

### State Management
- **React Context**: Application and authentication state
- **Custom Hooks**: Business logic encapsulation
- **AsyncStorage**: Local data persistence
- **Service Pattern**: Modular data management

---

## Project Structure

```
wisdom-wise-mobile/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── chat/           # Chat-specific components
│   │   ├── audio/          # Audio visualization components
│   │   └── exercises/      # Exercise-specific components
│   ├── screens/            # Main application screens
│   │   └── auth/          # Authentication screens
│   ├── navigation/         # Navigation configuration
│   ├── hooks/             # Custom React hooks
│   │   └── chat/          # Chat-specific hooks
│   ├── services/          # Business logic services
│   ├── contexts/          # React Context providers
│   ├── data/              # Static data and exercise library
│   ├── styles/            # Design system and styling
│   │   ├── components/    # Component-specific styles
│   │   └── tokens/        # Design tokens
│   ├── types/             # TypeScript definitions
│   ├── utils/             # Utility functions
│   └── config/            # Configuration constants
├── supabase/
│   └── functions/         # Edge Functions
│       ├── ai-chat/       # Main AI endpoint
│       ├── extract-insights/ # Insights processing
│       └── generate-mood-insights/ # Mood analysis
├── assets/                # Images, fonts, icons
└── docs/                  # Design guides and documentation
```

---

## Architecture Patterns

### 1. Hybrid Navigation Pattern
WisdomWise uses a unique navigation pattern combining tab-based navigation with modal overlays:

```typescript
// App.tsx - Root component structure
<SafeAreaProvider>
  <AuthProvider>
    <AppProvider>
      <AppContent />
    </AppProvider>
  </AuthProvider>
</SafeAreaProvider>
```

**AppContent.tsx** conditionally renders:
- **Tab Navigator** (default): Home, Exercises, Journal, Insights, Profile
- **Chat Interface** (modal): Full-screen AI conversation
- **Breathing Screen** (modal): Dedicated breathing exercises
- **Therapy Goals** (modal): Goal setting interface

### 2. Service-Oriented Architecture
Business logic is separated into focused services:

```typescript
// Legacy API service delegates to specialized services
export { chatService } from './chatService';
export { transcriptionService } from './transcriptionService';
export { modelService } from './modelService';
```

### 3. Hook-Based State Management
Complex state logic is encapsulated in custom hooks:

```typescript
// useAppState.ts - Main application state
export const useAppState = () => {
  const [showChat, setShowChat] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(null);
  // ... state management logic
};
```

### 4. Context-Driven Data Flow
Application state flows through React Context:

```typescript
// AppContext.tsx
interface AppContextType {
  showChat: boolean;
  currentExercise: Exercise | null;
  handleStartSession: (exercise?: Exercise) => void;
  // ... other state and handlers
}
```

---

## Data Flow Analysis

### Primary Data Flows

#### 1. Chat Conversation Flow
```
User Input → ChatInterface → useChatSession → contextService → Edge Function → AI API → Response Processing → UI Update
```

**Detailed Steps:**
1. **User Input**: Text or voice input via ChatInput component
2. **Message Storage**: Local storage via storageService
3. **Context Assembly**: contextService builds conversation context
4. **AI Request**: Edge Function processes request with proper authentication
5. **Response Processing**: Parse JSON schema response or fallback parsing
6. **UI Update**: Messages, suggestions, and exercise cards updated

#### 2. Exercise Flow
```
Exercise Selection → useExerciseFlow → Dynamic Step Management → AI-Guided Progression → Completion & Insights
```

**Key Components:**
- **Exercise Library**: Static data with 14+ therapeutic exercises
- **Dynamic Flow Generation**: AI-driven step progression
- **Context Management**: Exercise-specific conversation context
- **Completion Tracking**: Mood ratings, summaries, and insights extraction

#### 3. Insights Generation
```
Message History → memoryService → Edge Function → AI Analysis → Structured Insights → Dashboard Display
```

**Insight Types:**
- **Memory Insights**: Long-term patterns and themes
- **Mood Insights**: Emotional state analysis
- **Values Reflection**: Personal values exploration
- **Thinking Patterns**: Cognitive behavior analysis

---

## AI Integration Architecture

### Edge Function Architecture
All AI interactions are processed through Supabase Edge Functions for security and scalability:

#### Main AI Chat Function (`/supabase/functions/ai-chat/index.ts`)

**Supported Actions:**
- `chat`: Therapeutic conversations with JSON schema
- `transcribe`: Whisper API integration for voice
- `generateSuggestions`: Contextual reply suggestions
- `generateSummary`: Session and insight summaries
- `healthCheck`: Connection testing

**Request Processing:**
```typescript
interface ChatCompletionRequest {
  action: 'chat' | 'transcribe' | 'healthCheck' | 'getModels';
  messages?: ChatMessage[];
  model?: string;
  maxTokens?: number;
  temperature?: number;
  bypassJsonSchema?: boolean; // For non-therapy requests
}
```

**JSON Schema for Therapy Responses:**
```typescript
{
  "message": "string",        // Therapeutic response
  "suggestions": ["string"],  // 2-4 user reply options
  "nextAction": "string",     // 'showExerciseCard' or 'none'
  "exerciseData": {           // Required when nextAction = 'showExerciseCard'
    "type": "string",
    "name": "string"
  },
  "nextStep": "boolean"       // For exercise progression
}
```

### AI Model Configuration
- **Primary Model**: `google/gemini-2.5-flash` via OpenRouter
- **Transcription**: OpenAI Whisper API
- **Fallback Models**: GPT-4o, Claude for specific use cases
- **Rate Limiting**: Built-in service with 300 requests per session

---

## State Management

### 1. Application Context (`AppContext.tsx`)
Manages navigation state and major app transitions:

```typescript
interface AppContextType {
  showChat: boolean;              // Chat modal visibility
  showBreathing: boolean;         // Breathing screen visibility
  showTherapyGoals: boolean;      // Goals screen visibility
  currentExercise: Exercise | null; // Active exercise
  chatWithActionPalette: boolean; // Action palette state
  // ... event handlers
}
```

### 2. Authentication Context (`AuthContext.tsx`)
Handles user authentication and anonymous usage:

```typescript
interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any;
  profile: any;
  isAnonymous: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  skipAuth: () => void; // Anonymous mode
}
```

### 3. Chat Session State (`useChatSession.ts`)
Manages conversation state and AI interactions:

```typescript
interface ChatSessionState {
  messages: Message[];
  suggestions: string[];
  isTyping: boolean;
  rateLimitStatus: RateLimitStatus;
  showExerciseCard: any;
  currentExerciseStep: number | null;
}
```

### 4. Exercise Flow State (`useExerciseFlow.ts`)
Handles therapeutic exercise progression:

```typescript
const useExerciseFlow = () => {
  const [exerciseMode, setExerciseMode] = useState(false);
  const [exerciseStep, setExerciseStep] = useState(0);
  const [exerciseData, setExerciseData] = useState({});
  // ... specialized exercise states
}
```

---

## Service Architecture

### Core Services

#### 1. ChatService (`chatService.ts`)
**Purpose**: AI conversation management
**Key Methods:**
- `getChatCompletionWithContext()`: Main AI communication
- `sendMessage()`: Simple message sending for journals
- `testConnection()`: Health checks

```typescript
class ChatService {
  async getChatCompletionWithContext(
    messages: any[],
    systemMessage?: string,
    bypassJsonSchema?: boolean
  ): Promise<AIResponse>
}
```

#### 2. ContextService (`contextService.ts`)
**Purpose**: Conversation context assembly and AI prompt management
**Key Responsibilities:**
- System prompt construction
- Message history management
- Exercise-specific context assembly
- Memory integration

#### 3. StorageService (`storageService.ts`)
**Purpose**: Local data persistence
**Data Types:**
- Chat messages
- Exercise completion data
- User preferences
- Session history

#### 4. MemoryService (`memoryService.ts`)
**Purpose**: Long-term insight extraction and pattern recognition
**Features:**
- Automatic insight extraction
- Memory consolidation
- Pattern identification
- Long-term theme tracking

#### 5. TranscriptionService (`transcriptionService.ts`)
**Purpose**: Voice-to-text conversion
**Implementation:**
- Expo Speech Recognition integration
- Audio file handling
- Error recovery and fallbacks

---

## Exercise Flow System

### Exercise Library Structure
The app includes 14+ therapeutic exercises organized by type:

```typescript
export const exerciseLibraryData: Record<string, any> = {
  'automatic-thoughts': {
    type: 'automatic-thoughts',
    name: 'Recognizing Automatic Thoughts',
    category: 'CBT',
    keywords: ['automatic thoughts', 'cognitive', 'cbt'],
    // ... exercise configuration
  },
  'breathing': {
    type: 'breathing',
    name: '4-7-8 Breathing',
    category: 'Breathing',
    // ... specialized breathing configuration
  }
  // ... 12+ more exercises
};
```

### Dynamic Flow Generation
Each exercise has a corresponding flow definition:

```typescript
export const exerciseFlows: Record<string, any> = {
  'automatic-thoughts': {
    name: 'Recognizing Automatic Thoughts',
    useAI: true,
    steps: [
      {
        title: 'Welcome & Awareness',
        stepNumber: 1,
        instruction: 'Guide the user to identify recent stressful situations...'
      }
      // ... additional steps
    ]
  }
};
```

### Exercise Progression Logic
- **AI-Guided**: Most exercises use AI for dynamic step progression
- **Custom Components**: Some exercises use specialized React components
- **Step Advancement**: AI determines when to progress to next step
- **Completion Handling**: Mood ratings, summaries, and insight extraction

### Special Exercise Types
1. **Reflection Exercises**: Values and thinking pattern reflections
2. **Custom Component Exercises**: Goal setting and storytelling
3. **Breathing Exercises**: Dedicated breathing screen
4. **Vision Exercises**: Future self journaling with specialized summaries

---

## Chat & Conversation Management

### Message Types
```typescript
interface Message {
  id: string;
  type: 'user' | 'system' | 'ai' | 'exercise' | 'welcome';
  text?: string;
  content?: string;
  title?: string; // For exercise messages
  exerciseType?: string;
  color?: string;
  timestamp: string;
  isAIGuided?: boolean;
  context?: any;
}
```

### Conversation Context Assembly
The `contextService` builds conversation context including:
- **System Prompts**: Therapeutic guidelines and response format
- **Memory Context**: Long-term insights and patterns
- **Exercise Context**: Step-specific instructions and progress
- **Recent Messages**: Conversation history

### AI Response Processing
1. **JSON Schema Responses**: Structured therapeutic responses
2. **Fallback Parsing**: Extract messages and suggestions from text
3. **Exercise Detection**: Identify when users confirm exercise participation
4. **Suggestion Generation**: Contextual reply options

### Voice Integration
- **Speech-to-Text**: Real-time transcription via Whisper API
- **Text-to-Speech**: Automatic AI response playback
- **Audio Waveforms**: Visual feedback during recording
- **Voice Command Processing**: Integration with chat flow

---

## Navigation & UI Patterns

### Custom Tab Bar
The app uses a custom tab bar with floating action button:

```typescript
// CustomTabBar.tsx
const CustomTabBar = ({ onNewSession, onActionSelect }) => {
  // Floating action button for quick access
  // Action palette integration
  // Custom tab styling
};
```

### Modal Overlay Pattern
Key screens are implemented as full-screen modals:
- **Chat Interface**: Complete conversation experience
- **Breathing Screen**: Dedicated breathing exercises
- **Therapy Goals**: Goal setting workflow

### Screen Architecture
```typescript
// Main screens structure
screens/
├── HomeScreen.tsx          # Dashboard with quick actions
├── ExerciseLibrary.tsx     # Browse exercises
├── InsightsDashboard.tsx   # Analytics and patterns
├── ProfileScreen.tsx       # User settings
├── ChatInterface.tsx       # AI conversation
├── BreathingScreen.tsx     # Breathing exercises
└── TherapyGoalsScreen.tsx  # Goal management
```

---

## Styling System

### Design Token Architecture
```typescript
src/styles/
├── tokens/
│   ├── colors.ts          # Color palette and semantic colors
│   ├── typography.ts      # Font families and text styles
│   ├── spacing.ts         # Spacing scale and layout tokens
│   └── shadows.ts         # Elevation and shadow presets
└── components/
    ├── Component.styles.ts # Component-specific styles
    └── ...
```

### Color System
- **Primary Colors**: Therapeutic blue and green palette
- **Semantic Colors**: Success, warning, error, info
- **Gradients**: Custom gradient combinations
- **Alpha Variants**: Transparency levels for overlays

### Typography System
- **Font Families**: Inter, Poppins, Nunito, Source Serif Pro, Lora, Crimson Text
- **Text Styles**: Predefined hierarchy (heading1, body1, caption, etc.)
- **Responsive Text**: Automatic scaling based on device size

### Component Styling Pattern
```typescript
// Component import pattern
import { componentStyles as styles } from '../styles/components/Component.styles';

// Usage in component
<View style={styles.container}>
  <Text style={styles.title}>...</Text>
</View>
```

---

## Backend Integration

### Supabase Edge Functions
All backend logic is implemented as serverless Edge Functions:

#### 1. AI Chat Function (`/supabase/functions/ai-chat/`)
- **Primary Endpoint**: All AI interactions
- **Multi-Action Support**: Chat, transcription, health checks
- **Security**: API key handling in secure environment
- **Error Handling**: Comprehensive error responses

#### 2. Extract Insights Function (`/supabase/functions/extract-insights/`)
- **Purpose**: Generate user insights and patterns
- **Data Processing**: Message history analysis
- **Insight Types**: Memory, mood, values, thinking patterns

#### 3. Generate Mood Insights (`/supabase/functions/generate-mood-insights/`)
- **Specialized Processing**: Mood data analysis
- **Trend Detection**: Emotional pattern recognition
- **Recommendation Generation**: Personalized suggestions

### API Configuration
```typescript
// config/constants.ts
export const API_CONFIG = {
  SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  AI_MODEL: 'google/gemini-2.5-flash',
  MAX_TOKENS: 500,
  TEMPERATURE: 0.7
};
```

---

## Data Storage & Persistence

### Local Storage Pattern
The app uses AsyncStorage for local data persistence:

```typescript
// storageService.ts
class StorageService {
  private async getStorage(key: string): Promise<any[]>
  private async setStorage(key: string, data: any[]): Promise<void>

  // Message management
  async addMessage(message: Message): Promise<void>
  async getMessages(): Promise<Message[]>
  async getLastMessages(count: number): Promise<Message[]>

  // User data
  async saveUserPreferences(preferences: any): Promise<void>
  async getUserPreferences(): Promise<any>
}
```

### Storage Keys
- `@chat_messages`: Conversation history
- `@exercise_completions`: Exercise completion data
- `@user_preferences`: App settings and preferences
- `@mood_ratings`: Mood tracking data
- `@therapy_goals`: User goals and progress

### Data Synchronization
- **Local-First**: All data stored locally first
- **Background Sync**: Optional cloud sync for authenticated users
- **Offline Support**: Full functionality without internet connection

---

## Security & Authentication

### Authentication Options
1. **Email/Password**: Traditional authentication
2. **Google OAuth**: Social login integration
3. **Anonymous Mode**: Full app access without registration

### Security Measures
- **API Key Protection**: Server-side handling in Edge Functions
- **Data Encryption**: Sensitive data encrypted in storage
- **Session Management**: Secure session handling
- **Rate Limiting**: Request throttling to prevent abuse

### Privacy Features
- **Anonymous Usage**: No required data collection
- **Local Data Storage**: User data remains on device
- **Optional Cloud Sync**: User-controlled data backup

---

## Performance Considerations

### Optimization Strategies

#### 1. Lazy Loading
- **Screen Components**: Loaded on demand
- **Exercise Components**: Dynamic imports
- **Image Assets**: Progressive loading

#### 2. Memory Management
- **Message Limits**: Conversation history trimming
- **Cache Management**: Intelligent data caching
- **Component Cleanup**: Proper useEffect cleanup

#### 3. AI Request Optimization
- **Context Trimming**: Relevant message selection
- **Token Management**: Efficient prompt construction
- **Rate Limiting**: Request throttling

#### 4. Audio Performance
- **Streaming**: Real-time audio processing
- **Compression**: Efficient audio encoding
- **Memory Cleanup**: Audio resource management

### Bundle Size Optimization
- **Metro Configuration**: Tree shaking and dead code elimination
- **Asset Optimization**: Image compression and format optimization
- **Code Splitting**: Dynamic imports for large components

---

## Technical Issues & Improvements

### Current Issues

#### 1. Architecture Concerns
- **Monolithic Hooks**: Some hooks handle too many responsibilities
- **Context Overuse**: Heavy reliance on React Context
- **Service Coupling**: Some services are tightly coupled
- **Type Safety**: Inconsistent TypeScript usage

#### 2. Performance Issues
- **Large Context Objects**: Heavy re-renders
- **Message Array Growth**: Unbounded message history
- **Audio Memory Leaks**: Inadequate cleanup
- **Excessive Re-renders**: Inefficient state updates

#### 3. Code Quality Issues
- **Error Handling**: Inconsistent error boundaries
- **Testing Coverage**: Limited test coverage
- **Documentation**: Incomplete component documentation
- **Naming Conventions**: Inconsistent naming patterns

#### 4. AI Integration Issues
- **JSON Schema Fallbacks**: Fragile response parsing
- **Context Window Limits**: Message history truncation
- **Rate Limiting**: Basic implementation
- **Error Recovery**: Limited AI failure handling

### Recommended Improvements

#### 1. Architecture Refactoring
```typescript
// Implement Redux Toolkit for complex state
import { configureStore, createSlice } from '@reduxjs/toolkit';

// Break down large hooks into smaller, focused hooks
const useChatMessages = () => { /* message management */ };
const useChatSuggestions = () => { /* suggestion handling */ };
const useChatTyping = () => { /* typing indicators */ };
```

#### 2. Performance Optimizations
```typescript
// Implement message virtualization for large histories
import { VirtualizedList } from 'react-native';

// Use React.memo for expensive components
const MessageItem = React.memo(({ message }) => {
  // Memoized message rendering
});

// Implement proper cleanup in effects
useEffect(() => {
  const subscription = service.subscribe(handler);
  return () => subscription.unsubscribe();
}, []);
```

#### 3. Enhanced Error Handling
```typescript
// Implement error boundaries for better UX
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to monitoring service
  }
}

// Add retry mechanisms for AI requests
const withRetry = async (fn, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await delay(1000 * (i + 1));
    }
  }
};
```

#### 4. Enhanced Type Safety
```typescript
// Implement stricter type definitions
interface StrictMessage {
  readonly id: string;
  readonly type: MessageType;
  readonly content: string;
  readonly timestamp: Date;
  readonly metadata?: MessageMetadata;
}

// Use discriminated unions for better type safety
type ExerciseType =
  | { type: 'breathing'; breathingConfig: BreathingConfig }
  | { type: 'mindfulness'; mindfulnessConfig: MindfulnessConfig }
  | { type: 'cbt'; cbtConfig: CBTConfig };
```

#### 5. Scalability Improvements
- **Database Integration**: Replace AsyncStorage with SQLite for complex queries
- **Offline Sync**: Implement robust offline-first architecture
- **Real-time Features**: Add WebSocket support for live interactions
- **Push Notifications**: Implement therapeutic reminders and insights
- **Analytics Integration**: Add comprehensive usage analytics

### Development Workflow Improvements
1. **Testing Strategy**: Implement comprehensive test coverage
2. **CI/CD Pipeline**: Automate testing and deployment
3. **Code Quality**: ESLint, Prettier, and TypeScript strict mode
4. **Documentation**: Comprehensive component and API documentation
5. **Performance Monitoring**: Real-time performance tracking

---

## Conclusion

WisdomWise represents a sophisticated React Native application with advanced AI integration, complex state management, and therapeutic-focused user experience. The architecture demonstrates strong separation of concerns with its service-oriented approach and modular hook system.

**Strengths:**
- Comprehensive AI integration with structured responses
- Flexible exercise system with dynamic flows
- Robust voice and audio features
- Anonymous usage support
- Modular service architecture

**Areas for Improvement:**
- State management complexity
- Performance optimization
- Error handling consistency
- Type safety enhancements
- Testing coverage

The codebase provides a solid foundation for a mental health application while offering clear paths for enhancement and scaling.

be water my friend, take care 🧘🏼‍♀️