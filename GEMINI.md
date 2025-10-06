# GEMINI.md: AI-Powered Project Context

This file provides a comprehensive overview of the Wisdom Wise (ZenMind) mobile application codebase. It is intended to be used as a primary context source for AI-driven development, analysis, and maintenance tasks.

## 1. Project Overview

**Wisdom Wise** (display name: **ZenMind**) is a cross-platform mobile application for AI-powered therapy and mental wellness. It is built with **React Native** and the **Expo** framework, written entirely in **TypeScript**.

The application provides a rich, interactive experience including conversational AI sessions, guided exercises, journaling, mood tracking, and personalized insights. It leverages a variety of services for features like speech-to-text, text-to-speech, and notifications.

### Core Technologies

- **Framework:** React Native (Expo)
- **Language:** TypeScript
- **Styling:** NativeWind (Tailwind CSS for React Native) with a custom design system.
- **Navigation:** React Navigation (Bottom Tab, Stack)
- **State Management:** React Context API (`AppContext`, `AuthContext`)
- **Backend/Services:** Supabase (inferred from dependencies), and numerous internal services for business logic.

### Architectural Highlights

- **Component-Based:** The UI is built from a large library of reusable components located in `src/components`.
- **Service-Oriented:** Business logic is cleanly separated into a comprehensive set of services in `src/services`. This includes modules for authentication, API communication, chat logic, notifications, and more.
- **State-Driven Navigation:** The root `AppContent` component conditionally renders different navigators (`Onboarding`, `Auth`, `Main Tab`) based on application state (e.g., `isAuthenticated`, `isOnboardingComplete`).
- **Context for Global State:** `AuthContext` manages user authentication, while `AppContext` manages global UI state, such as the visibility of overlay screens (chat, breathing exercises).

## 2. Building and Running

The following commands are available in `package.json` to run and build the application.

### Development

- **Start Metro Bundler:**
  ```bash
  npm start
  ```
- **Run on iOS Simulator/Device:**
  ```bash
  npm run ios
  ```
- **Run on Android Emulator/Device:**
  ```bash
  npm run android
  ```
- **Run on Web:**
  ```bash
  npm run start:web
  ```

### Build

- **Create a development build:**
  ```bash
  # iOS
  npm run dev:ios

  # Android
  npm run dev:android
  ```
- **Create a web build:**
  ```bash
  npm run build:web
  ```
- **Prebuild native code (for custom native modules):**
  ```bash
  npm run prebuild
  ```

## 3. Development Conventions

### File Structure

- **`src/`**: Contains all core application source code.
  - **`components/`**: Reusable React components.
  - **`screens/`**: Top-level components representing a full screen in the app.
  - **`navigation/`**: React Navigation navigators (Stack, Tab).
  - **`contexts/`**: Global state providers (e.g., `AuthContext`, `AppContext`).
  - **`services/`**: Business logic, API calls, and utility functions.
  - **`config/`**: Application configuration, such as font loading.
  - **`styles/`**: Global styles and design tokens (though most styling is via NativeWind).
  - **`types/`**: TypeScript type definitions.

### Styling

- **NativeWind:** Styling is done primarily using the NativeWind library, which implements Tailwind CSS for React Native. Utility classes are used directly in the `className` prop of components.
- **Custom Theme:** A detailed custom theme is defined in `tailwind.config.js`, including a specific color palette, font families, and sizing scale, ensuring a consistent and therapeutic aesthetic.

### Navigation

- The app uses a main **Bottom Tab Navigator** for primary sections: `Home`, `Exercises`, `Journal`, `Insights`, and `Profile`.
- **Stack Navigators** are nested for flows that require a linear sequence of screens, such as `AuthNavigator`, `OnboardingNavigator`, and `JournalNavigator`.
- **Overlays:** Features like the `ChatInterface` are implemented as animated overlays managed by the `AppContext`, appearing on top of the main tab navigator.

### State Management

- **Authentication:** User session and profile data are managed globally via `AuthContext`.
- **App State:** Global UI state (like modal visibility or the currently selected exercise) is managed in `AppContext`.
- **Local State:** Component-level state is managed with `useState` and `useReducer` hooks.
