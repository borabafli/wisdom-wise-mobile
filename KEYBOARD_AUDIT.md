# Phase 1.2: Complete Keyboard Handler Audit

## Date: Current Session
## Status: DOCUMENTATION COMPLETE

---

## LOCATION 1: ChatInterface.tsx (Lines 402-406)

### KeyboardAvoidingView Configuration

```tsx
<KeyboardAvoidingView
  style={styles.keyboardView}
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
>
```

**Analysis**:
- ✅ Platform-specific behavior (iOS: padding, Android: height)
- ⚠️ keyboardVerticalOffset is 0 for both platforms (might need adjustment)
- ❓ Is 'height' correct for Android with 'resize' mode?

**Questions**:
1. Should Android use 'height' or 'undefined' when app.json has 'resize'?
2. Is offset=0 correct or do we need to account for header?

---

## LOCATION 2: ChatInterface.tsx (Line 379)

### SafeAreaWrapper Configuration

```tsx
<SafeAreaWrapper style={styles.container} edges={['top', 'left', 'right']}>
```

**Analysis**:
- ✅ Correctly excludes 'bottom' edge
- ✅ This prevents double safe area on bottom
- ✅ Matches best practices

**Questions**: None - this looks correct

---

## LOCATION 3: ChatInterface.tsx (Lines 471-479)

### ScrollView Configuration

```tsx
<ScrollView
  ref={scrollViewRef}
  style={styles.messagesArea}
  contentContainerStyle={styles.messagesContent}
  showsVerticalScrollIndicator={false}
  onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
  keyboardShouldPersistTaps="handled"
  keyboardDismissMode="interactive"
>
```

**Analysis**:
- ✅ keyboardShouldPersistTaps="handled" - correct
- ✅ keyboardDismissMode="interactive" - allows swipe to dismiss
- ❓ No automaticallyAdjustKeyboardInsets (might be needed on iOS?)
- ❓ No contentInsetAdjustmentBehavior setting

**Questions**:
1. Should we add automaticallyAdjustKeyboardInsets={false}?
2. Does contentInsetAdjustmentBehavior="never" help?

---

## LOCATION 4: ChatInput.tsx (Lines 37-39)

### Safe Area Insets Usage

```tsx
const { t } = useTranslation();
const [isFullscreenInput, setIsFullscreenInput] = useState(false);
const insets = useSafeAreaInsets();
```

**Analysis**:
- ⚠️ Getting insets but NOT using them currently
- ✅ Good - we removed the dynamic padding calculation
- ✅ Static padding is in styles instead

**Questions**: None - insets might be used for fullscreen modal?

---

## LOCATION 5: ChatInput.tsx (Line 56)

### Input Container Rendering

```tsx
<View style={styles.inputContainer}>
```

**Analysis**:
- ✅ No dynamic padding calculations
- ✅ Uses only static styles
- ✅ Clean and simple

**Questions**: None - this looks correct

---

## LOCATION 6: ChatInterface.styles.ts (Lines 525-532)

### Static Input Container Padding

```tsx
inputContainer: {
  paddingHorizontal: spacing.layout.screenPadding - 4, // Keep original width
  paddingTop: 8, // Standard top padding
  paddingBottom: Platform.OS === 'ios' ? 34 : 8, // iOS safe area built-in, Android base padding
  backgroundColor: '#FFFFFF', // Clean white background
  borderTopWidth: 0.5,
  borderTopColor: 'rgba(0, 0, 0, 0.08)', // Subtle separator like WhatsApp
},
```

**Analysis**:
- ✅ Platform-specific static padding
- ✅ iOS: 34px (standard notch size)
- ✅ Android: 8px (minimal)
- ❓ Is 34px enough for ALL iOS devices? (iPhone 14/15 Pro Max?)

**Questions**:
1. Should we use useSafeAreaInsets().bottom for iOS instead of hardcoded 34?
2. Does hardcoded 34 work on all notch devices?

---

## LOCATION 7: ChatInterface.styles.ts (Lines 39-42)

### KeyboardView Style

```tsx
keyboardView: {
  flex: 1,
  zIndex: 2,
},
```

**Analysis**:
- ✅ Simple flex: 1
- ⚠️ zIndex might not be needed
- ✅ No positioning conflicts

**Questions**: Can we remove zIndex?

---

## LOCATION 8: app.json (Line 36)

### Android Keyboard Mode

```json
"softwareKeyboardLayoutMode": "resize",
```

**Analysis**:
- ✅ "resize" is correct for chat apps
- ✅ This tells Android to resize window when keyboard appears
- ✅ Works with KeyboardAvoidingView or standalone

**Questions**: None - this is standard

---

## LOCATION 9: ChatInterface.styles.ts (Lines 540-544)

### Input Row Configuration

```tsx
inputRow: {
  flexDirection: 'row',
  alignItems: 'flex-end', // Align to bottom like standard chat apps
  gap: 8, // Standard gap between elements
},
```

**Analysis**:
- ✅ alignItems: 'flex-end' positions items at bottom
- ✅ Standard gap
- ✅ No height constraints

**Questions**: None - looks correct

---

## SUMMARY: All Keyboard Handlers Found

### Total Locations: 9

**Active Handlers**:
1. ✅ KeyboardAvoidingView (ChatInterface.tsx:402)
2. ✅ SafeAreaWrapper edges (ChatInterface.tsx:379)
3. ✅ ScrollView keyboard props (ChatInterface.tsx:471)
4. ✅ Static paddingBottom (ChatInterface.styles.ts:528)
5. ✅ Android keyboard mode (app.json:36)

**Passive (No Action Needed)**:
1. ✅ keyboardView style (just flex:1)
2. ✅ inputRow alignment
3. ✅ insets import (not used for padding)

---

## POTENTIAL CONFLICTS

### Conflict #1: Android KeyboardAvoidingView + resize mode
**Issue**: Using BOTH 'resize' mode AND KeyboardAvoidingView behavior='height'
**Why it matters**: 'resize' mode already adjusts window - KeyboardAvoidingView might double-adjust
**Test needed**: Try behavior={Platform.OS === 'ios' ? 'padding' : undefined} on Android

### Conflict #2: iOS hardcoded 34px
**Issue**: Not all iOS devices have same notch size
**Why it matters**: iPhone SE has 0px, newer devices vary
**Test needed**: Use useSafeAreaInsets().bottom instead of 34

### Conflict #3: ScrollView automatic insets
**Issue**: ScrollView might auto-adjust content insets
**Why it matters**: Could conflict with KeyboardAvoidingView
**Test needed**: Add automaticallyAdjustKeyboardInsets={false}

---

## NEXT STEP: Phase 2.1

Create minimal test case to verify basic keyboard handling works.

**File to create**: `src/screens/KeyboardTest.tsx`

Ready to proceed? ✓
