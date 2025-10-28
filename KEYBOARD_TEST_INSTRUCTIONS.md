# Keyboard Test Instructions

## Phase 2.1: Minimal Test Case

### What We Created
`src/screens/KeyboardTest.tsx` - A minimal screen that isolates keyboard behavior

### How to Test

#### Step 1: Add to Navigation (Temporary)

**Option A: Quick Test (Fastest)**
Open `App.tsx` or your main navigator and temporarily replace ChatInterface with KeyboardTest:

```tsx
// Temporarily change this:
import ChatInterface from './src/screens/ChatInterface';

// To this:
import { KeyboardTest } from './src/screens/KeyboardTest';

// Then use KeyboardTest instead of ChatInterface
```

**Option B: Add to Tab Navigator**
Add KeyboardTest as a new tab temporarily:
```tsx
import { KeyboardTest } from './src/screens/KeyboardTest';

// Add a new tab
<Tab.Screen name="KeyboardTest" component={KeyboardTest} />
```

#### Step 2: Navigate to Screen
1. Start your app: `npx expo start`
2. Open on your device/simulator
3. Navigate to KeyboardTest screen

#### Step 3: Perform Tests

**Test Sequence**:
1. ✅ **Tap the input field**
   - Watch carefully as keyboard appears
   - Note: Does it jump? How much?

2. ✅ **Type some text**
   - Does position stay stable?

3. ✅ **Tap outside to dismiss keyboard**
   - Does it animate smoothly?

4. ✅ **Tap input again**
   - Second time - does it still jump?

5. ✅ **Try multiline text** (press return several times)
   - Does input grow smoothly?

#### Step 4: Document Results

Fill out this checklist:

**iOS Results**:
- [ ] Keyboard appears smoothly (YES/NO)
- [ ] Any jumping? (YES/NO) - How much? ___________
- [ ] Final position correct? (YES/NO)
- [ ] Input fully visible? (YES/NO)
- [ ] Dismisses smoothly? (YES/NO)

**Android Results**:
- [ ] Keyboard appears smoothly (YES/NO)
- [ ] Any jumping? (YES/NO) - How much? ___________
- [ ] Final position correct? (YES/NO)
- [ ] Input fully visible? (YES/NO)
- [ ] Dismisses smoothly? (YES/NO)

### Interpretation

#### If Minimal Test WORKS ✅
**Conclusion**: Basic keyboard handling is fine!
**Next Step**: Problem is in ChatInterface complexity
**Action**: Phase 2.2 - Add back features one by one to find culprit

#### If Minimal Test ALSO JUMPS ❌
**Conclusion**: Problem is deeper - app config or platform issue
**Possible causes**:
1. app.json settings (softwareKeyboardLayoutMode)
2. React Native version issue
3. Expo SDK issue
4. Device-specific behavior

**Next Step**: Test variations of app.json settings

---

## Quick Variations to Test (If Minimal Jumps)

### Variation A: Try Different Behavior
In `KeyboardTest.tsx` line 74, change:
```tsx
// Try this:
behavior={Platform.OS === 'ios' ? 'padding' : undefined}
// Instead of:
behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
```

### Variation B: Try Different Offset
In `KeyboardTest.tsx` line 75, change:
```tsx
// Try different values:
keyboardVerticalOffset={10}  // or 20, or -10
```

### Variation C: Remove KeyboardAvoidingView Entirely (Android)
```tsx
{Platform.OS === 'ios' ? (
  <KeyboardAvoidingView behavior="padding" style={styles.keyboardView}>
    {/* content */}
  </KeyboardAvoidingView>
) : (
  <View style={styles.keyboardView}>
    {/* content */}
  </View>
)}
```

---

## What to Report Back

Please tell me:

1. **Does the minimal test jump?** (YES/NO)
2. **Platform tested** (iOS/Android)
3. **Device type** (iPhone 15 Pro, Pixel 7, etc.)
4. **If it jumps**: Describe the behavior (e.g., "jumps up 100px then settles 50px lower")

Then we'll know exactly what to fix next!

---

## Phase 2.2 Preview

Once you report results, we'll either:
- **Path A**: Add ChatInterface features back one by one (if minimal works)
- **Path B**: Fix app.json/platform config (if minimal also jumps)

Ready when you are! 🎯
