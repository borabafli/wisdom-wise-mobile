# Breathing Exercise Sound Files

This directory contains sound files for the breathing exercises:

## Required Files:
✅ `breathe-in.mp3` - Played at the start of inhale phases
✅ `hold.mp3` - Played at the start of hold phases (both types)
✅ `breathe-out.mp3` - Played at the start of exhale phases

## How It Works:
- Each sound plays once at the **beginning** of each breathing phase
- Sounds provide audio cues to guide the user through the breathing pattern
- App automatically sets volume to 80% for clear audio guidance
- Graceful fallback to haptic feedback if sound files are missing

## Sound Guidelines:
- Use calm, non-jarring tones (bell sounds, chimes, or gentle voice cues)
- Keep volume moderate (the app sets volume to 80% for clear guidance)
- Short duration (1-3 seconds max)
- Fade in/out to avoid harsh starts/stops

## Phase Mapping:
- **Inhale phases** → `breathe-in.mp3`
- **Hold phases** (both regular hold and hold after exhale) → `hold.mp3`
- **Exhale phases** → `breathe-out.mp3`

The BreathingScreen component will gracefully handle missing sound files by catching errors and continuing with haptic feedback only.