# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Install dependencies**: `npm install`
- **Start server**: `npx expo start`


## Project Architecture

### Technology Stack
- **Framework**: React Native with Expo SDK 53
- **Navigation**: React Navigation v7 with bottom tabs
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Typography**: Custom font system with 6 font families (Inter, Poppins, Nunito, Source Serif Pro, Lora, Crimson Text)
- **UI Components**: Lucide React Native icons, Expo Linear Gradient, Expo Blur
- **Platform**: Cross-platform (iOS, Android, Web)

### App Structure
WisdomWise is a mindfulness and mental health support app built around a therapeutic AI companion (turtle therapist). The app features:

- **4 Main Tabs**: Home, Exercises, Insights, Profile
- **Chat Interface**: AI-guided therapy sessions and exercises
- **Custom Tab Bar**: With floating action button for new sessions

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

**Custom Components**:
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

### Configuration Files
- **tailwind.config.js**: Extensive custom theme with therapeutic design tokens
- **app.json**: Expo configuration with permissions (RECORD_AUDIO for voice features)
- **metro.config.js**: Custom Metro config with Node.js polyfill for os.availableParallelism

### Project Status
This is an active development project with a detailed PRD (docs/PRD.md) outlining remaining work packages including AI guidance logic, insights extraction, and personalization features.

### Development Guides
- If requested functionality is too complex handle just within the code, you may advice other suggestions (eg. we should create a database for it in this way...)