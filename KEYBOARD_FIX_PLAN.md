# Systematic Keyboard Jump Fix Plan

## Problem Statement
Keyboard "jumps" when appearing - goes too high, then settles to wrong position.

## Root Causes of Keyboard Jumping in React Native
1. **Multiple competing handlers** - KeyboardAvoidingView + manual padding + SafeArea all fighting
2. **Wrong KeyboardAvoidingView behavior** - 'padding' vs 'height' vs 'position'
3. **Platform inconsistencies** - iOS and Android handle keyboards differently
4. **Layout re-renders** - Multiple layout calculations causing visual jumps
5. **ScrollView contentInset** - Automatic adjustments conflicting with manual ones

---

## PHASE 1: COMPLETE AUDIT (Documentation)

### 1.1 Document Current Behavior
**Action**: Test and record exactly what happens
- [ ] iOS behavior: Does it jump? By how much? Final position?
- [ ] Android behavior: Same questions
- [ ] Record screen if possible

### 1.2 Identify ALL Keyboard Handlers
**Action**: Find every place we're handling keyboard

**Files to check**:
- [ ] `ChatInterface.tsx` - KeyboardAvoidingView settings
- [ ] `ChatInput.tsx` - Any keyboard listeners or padding
- [ ] `ChatInterface.styles.ts` - Static padding values
- [ ] `app.json` - Android softwareKeyboardLayoutMode
- [ ] `SafeAreaWrapper` - Bottom edge handling

**Document**:
```
Location 1: ChatInterface.tsx:402-406
  - KeyboardAvoidingView behavior
  - keyboardVerticalOffset value

Location 2: ChatInput.tsx:56
  - Dynamic padding calculations

Location 3: ChatInterface.styles.ts:528
  - Static paddingBottom value

Location 4: app.json:36
  - Android keyboard mode

Location 5: ChatInterface.tsx:379
  - SafeAreaWrapper edges
```

### 1.3 Research Official Recommendations
**Action**: Check React Native docs for current best practices

- [ ] Read: https://reactnative.dev/docs/keyboardavoidingview
- [ ] Check: iOS behavior recommendations
- [ ] Check: Android behavior recommendations
- [ ] Note: What does "resize" vs "pan" do?

---

## PHASE 2: SIMPLIFICATION (Strip to Minimum)

### 2.1 Create Minimal Test Case
**Action**: Create a separate test screen with ONLY:
- KeyboardAvoidingView
- TextInput
- NO SafeArea, NO custom padding, NO ScrollView

**File**: `src/screens/KeyboardTest.tsx`
```tsx
import React from 'react';
import { KeyboardAvoidingView, TextInput, Platform, View } from 'react-native';

export const KeyboardTest = () => {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={{ flex: 1 }} />
      <TextInput
        placeholder="Test input"
        style={{
          height: 44,
          backgroundColor: '#F0F0F0',
          paddingHorizontal: 12,
          margin: 8
        }}
      />
    </KeyboardAvoidingView>
  );
};
```

**Test**:
- [ ] Does minimal version jump? YES/NO
- [ ] If NO, keyboard handling works - issue is in our complexity
- [ ] If YES, problem is deeper - app.json or RN version

### 2.2 Identify the Culprit
**Action**: Add back ONE feature at a time

**Test sequence**:
1. Minimal (above) - works?
2. + SafeAreaView - still works?
3. + ScrollView - still works?
4. + Custom padding - still works?
5. + Full component structure - breaks?

**Document at which step it breaks**.

---

## PHASE 3: STANDARD PATTERN IMPLEMENTATION

### 3.1 iOS Standard Pattern
**Official iOS Pattern**:
```tsx
<SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
  <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior="padding"
  >
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="interactive"
    >
      {/* Messages */}
    </ScrollView>

    <View style={{ paddingBottom: 34 }}> {/* iOS notch */}
      <TextInput />
    </View>
  </KeyboardAvoidingView>
</SafeAreaView>
```

**Key points**:
- SafeArea excludes bottom
- KeyboardAvoidingView uses "padding"
- Input has static bottom padding (34px = notch)
- NO dynamic calculations

### 3.2 Android Standard Pattern
**Official Android Pattern**:

**app.json**:
```json
"softwareKeyboardLayoutMode": "resize"
```

**Component**:
```tsx
<SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
  <View style={{ flex: 1 }}>
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      {/* Messages */}
    </ScrollView>

    <View style={{ paddingBottom: 8 }}>
      <TextInput />
    </View>
  </View>
</SafeAreaView>
```

**Key points**:
- NO KeyboardAvoidingView (Android resize mode handles it)
- OR use KeyboardAvoidingView with behavior="height"
- Input has minimal padding (8px)
- app.json must have "resize" mode

### 3.3 Decision Point
**Question**: One codebase or platform-specific?

**Option A: Unified** (what we have now)
```tsx
<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
```

**Option B: Platform-specific** (more reliable)
```tsx
{Platform.OS === 'ios' ? (
  <KeyboardAvoidingView behavior="padding">
    {content}
  </KeyboardAvoidingView>
) : (
  <View>{content}</View>
)}
```

**Recommendation**: Start with Option A, move to B if needed.

---

## PHASE 4: STEP-BY-STEP IMPLEMENTATION

### 4.1 Remove ALL Current Keyboard Handling
**Action**: Clean slate
- [ ] Remove KeyboardAvoidingView temporarily
- [ ] Remove all dynamic padding calculations
- [ ] Remove keyboard listeners
- [ ] Set app.json to "resize"
- [ ] SafeAreaWrapper edges to ['top', 'left', 'right']

**Test**: Keyboard appears (wrong position, but no jump)

### 4.2 Add Back Standard KeyboardAvoidingView
**Action**: Add ONLY KeyboardAvoidingView
```tsx
<KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  style={{ flex: 1 }}
>
```

**Test**:
- [ ] iOS - does it position correctly?
- [ ] Android - does it position correctly?
- [ ] Any jumping?

### 4.3 Add Static Bottom Padding
**Action**: Add fixed padding (no calculations)
```tsx
inputContainer: {
  paddingBottom: Platform.OS === 'ios' ? 34 : 8,
}
```

**Test**:
- [ ] Position correct now?
- [ ] Any jumping?

### 4.4 Fine-tune if Needed
**Action**: ONLY if position is still wrong

**Adjustments**:
- iOS: Try keyboardVerticalOffset: 0, 10, 20
- Android: Try behavior: undefined instead of 'height'
- Check if ScrollView needs contentContainerStyle adjustments

---

## PHASE 5: VERIFICATION

### 5.1 Test Matrix
| Scenario | iOS | Android |
|----------|-----|---------|
| Keyboard appears | ✓/✗ | ✓/✗ |
| No jumping | ✓/✗ | ✓/✗ |
| Correct position | ✓/✗ | ✓/✗ |
| Keyboard dismisses | ✓/✗ | ✓/✗ |
| Input visible | ✓/✗ | ✓/✗ |
| Scrolling works | ✓/✗ | ✓/✗ |
| Recording mode | ✓/✗ | ✓/✗ |

### 5.2 Edge Cases
- [ ] Long message list (scrolled to bottom)
- [ ] Long message list (scrolled to top)
- [ ] Multiline input (1 line, 3 lines, 5 lines)
- [ ] Device with notch (iPhone X+)
- [ ] Device without notch (iPhone SE)
- [ ] Android with navigation bar
- [ ] Landscape orientation

---

## PHASE 6: DOCUMENTATION

### 6.1 Document Solution
**File**: `docs/keyboard-handling.md`

Document:
- What pattern we used
- Why it works
- Platform differences
- Future reference

### 6.2 Code Comments
Add clear comments explaining:
```tsx
// Standard iOS keyboard handling - uses 'padding' behavior
// with static bottom padding for notch devices
<KeyboardAvoidingView behavior="padding">
```

---

## SUCCESS CRITERIA

✅ **DONE WHEN**:
1. Keyboard appears smoothly (no jump)
2. Input bar positions correctly on iOS
3. Input bar positions correctly on Android
4. Keyboard dismisses smoothly
5. Works on notch and non-notch devices
6. Recording mode still works
7. All edge cases pass

---

## ROLLBACK PLAN

If we break things:
1. Git stash current changes
2. Return to last known working state
3. Try different approach from Phase 3

---

## NEXT STEP

**START HERE**: Phase 1.2 - Identify ALL keyboard handlers

Shall we begin with Phase 1.2?
