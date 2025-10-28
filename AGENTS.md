# Repository Guidelines

## Project Structure & Module Organization
- `App.tsx` bootstraps the Expo client and wires global providers; experimental entry points such as `App.minimal.tsx` live at the repo root.
- Core features sit in `src/`: `components/`, `screens/`, and `navigation/` drive UI flow; `services/` handles Supabase, storage, and analytics; `contexts/` centralizes shared state.
- Shared helpers live in `src/constants/`, `src/hooks/`, `src/types/`, and `src/utils/`; UI tokens stay in `src/constants/theme.ts` and styling helpers in `src/styles/`.
- Assets stay in `assets/`; Supabase migrations and seed data are under `supabase/`; Android overrides reside in `android/`.

## Build, Test, and Development Commands
- `npm start` or `npx expo start` runs the Expo dev server with Metro bundler.
- `npm run android` / `npm run ios` produce platform builds; append `--device` to target connected hardware.
- `npm run build:web` exports a static bundle for web smoke tests.
- `npx expo prebuild` regenerates native projects after adding modules; commit resulting `android/` changes.

## Coding Style & Naming Conventions
- TypeScript + React 19 with functional components and hooks; avoid class components.
- Follow 2-space indentation, trailing commas, and descriptive PascalCase for components, camelCase for hooks/utilities, SCREAMING_SNAKE_CASE for constants.
- Styling uses NativeWind; co-locate helpers in `src/styles/` and keep tokens centralized in `src/constants/theme.ts`.
- Run `npx expo lint` before opening a PR.

## Testing Guidelines
- UI smoke tests live alongside screens (e.g., `src/screens/ProfileScreen.test.tsx`); prototype variants use the `.minimal-test.tsx` suffix.
- Integration helpers reside in `src/utils/`; use deterministic fixtures from `src/data/`.
- Manual regression passes must cover onboarding, journal flows, audio capture, and Supabase sync. Document any gaps in the PR.

## Commit & Pull Request Guidelines
- Write concise, imperative commit messages (e.g., `Add guided breathing overlay`); group related changes.
- Pull requests need an objective summary, linked Linear/Jira issue, screenshots or recordings for UI updates, and a test checklist (`expo start`, device builds, manual flows).
- Keep secrets in `.env.local` and communicate environment changes in the PR body.
