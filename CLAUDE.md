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
- **Design Language**: Therapeutic, calming aesthetic with soft colors
- **Color Palette**: Therapy grays, calm blues, warm oranges, soft neutrals
- **Typography Hierarchy**: 6 specialized font families for different content types
- **Spacing**: Extended Tailwind spacing scale with therapy-focused measurements
- **Border Radius**: Custom "soft", "medium", "large" radius tokens

### Configuration Files
- **tailwind.config.js**: Extensive custom theme with therapeutic design tokens
- **app.json**: Expo configuration with permissions (RECORD_AUDIO for voice features)
- **metro.config.js**: Custom Metro config with Node.js polyfill for os.availableParallelism

### Project Status
This is an active development project with a detailed PRD (docs/PRD.md) outlining remaining work packages including AI guidance logic, insights extraction, and personalization features.

### Development Guides
- If requested functionality is too complex handle just within the code, you may advice other suggestions (eg. we should create a database for it in this way...)