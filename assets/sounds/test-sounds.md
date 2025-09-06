# Testing Sound Integration

## Quick Test Files (if you need placeholders):

You can create simple test MP3 files using:

### Online Method:
1. Go to: https://onlinetonegenerator.com/
2. Set frequency to **440Hz** for inhale, **220Hz** for exhale
3. Set duration to **1.5 seconds**
4. Download as MP3
5. Rename to `inhale.mp3` and `exhale.mp3`

### Audacity Method:
1. Open Audacity (free download)
2. Generate > Tone > Sine Wave
3. **Inhale**: 440Hz, 1.5 seconds, add fade in/out
4. **Exhale**: 220Hz, 1.5 seconds, add fade in/out
5. Export as MP3

### Test the Integration:
1. Place both files in this `assets/sounds/` directory
2. Start breathing exercise in the app
3. Enable sound cues in settings
4. Start breathing session - should hear tones for inhale/exhale

## File Requirements:
- **Format**: MP3 (recommended) or WAV
- **Duration**: 1-2 seconds max
- **Quality**: 22kHz, mono is sufficient
- **Volume**: Moderate (app sets to 30%)
- **Names**: Exactly `inhale.mp3` and `exhale.mp3`