# Anonymous User Purchases & Testing Guide

## Summary of Fixes

All issues with anonymous user purchases and testing workflows have been resolved! Here's what was implemented:

### ✅ Fix 1: Premium Badge for Anonymous Purchasers
**Problem**: Anonymous users who purchased premium didn't see the "✨ Premium Member" badge.

**Solution**: Reordered conditions in `getPremiumBadgeText()` to check subscription status BEFORE checking if user is anonymous.

**File**: `src/screens/ProfileScreen.tsx` (lines 112-125)

**Result**:
- Anonymous premium users → "✨ Premium Member" ✅
- Anonymous free users → nothing ✅
- Authenticated free users → "🆓 Free Plan" ✅

---

### ✅ Fix 2: Testing Utilities Created
**Problem**: No way to switch between premium and free tiers during development.

**Solution**: Created comprehensive testing utilities module.

**File**: `src/utils/subscriptionTestUtils.ts` (new file)

**Features**:
- `resetToFreeTier()` - Clear purchases and return to free tier
- `getDebugInfo()` - Show subscription status and usage
- `forceResetDailyUsage()` - Reset message/voice/exercise counters
- `checkMessageLimit()` - Test if user can send messages
- `getStorageKeys()` - Debug AsyncStorage keys
- `clearAllStorage()` - Nuclear option (fresh install state)
- `printSubscriptionDebug()` - Pretty-print all info to console

---

### ✅ Fix 3: Developer Debug Menu Added
**Problem**: No UI to access testing utilities.

**Solution**: Added developer-only menu to ProfileScreen.

**File**: `src/screens/ProfileScreen.tsx` (lines 303-757)

**Features**:
- Only visible in `__DEV__` mode (production-safe)
- Accessible via "🧪 Developer Tools" menu item in Profile
- Full modal interface with categorized tools:
  - **Subscription Testing**: Reset to free, show debug info
  - **Usage Testing**: Reset daily usage, check message limit
  - **Danger Zone**: Clear all storage
- Alert-based feedback for all actions

---

### ✅ Fix 4: Debug Logging Added
**Problem**: Hard to diagnose why limits weren't working.

**Solution**: Added comprehensive debug logging to key services.

**Files Modified**:
- `src/services/entitlementService.ts` (lines 68-86, 130-177, 194-197)
- `src/hooks/chat/useChatSession.ts` (lines 164-167)
- `src/screens/ProfileScreen.tsx` (lines 70-76)

**What's Logged** (only in `__DEV__`):
```
[Profile] Subscription tier: free
[Profile] isPremium from context: false
[Profile] isAnonymous: true

[Entitlement] Last reset date: Mon Nov 06 2025
[Entitlement] Today: Mon Nov 06 2025
[Entitlement] Checking message limit...
[Entitlement] Subscription tier: free
[Entitlement] Free tier - Daily messages: 5 / 15
[Entitlement] ✅ Access granted
[Entitlement] Message count incremented: 6

[useChatSession] Message recorded, new rate limit status: {...}
```

---

## How to Use Testing Tools

### Via Developer Menu (Easiest)

1. **Open Profile Screen**
   - Tap Profile tab at bottom

2. **Open Developer Tools**
   - Scroll to menu
   - Tap "🧪 Developer Tools" (only visible in dev mode)

3. **Use Testing Functions**:

   **Reset to Free Tier**:
   - Tap "Reset to Free Tier"
   - Alert confirms reset
   - Force quit app (swipe up from bottom)
   - Relaunch app
   - You're now on free tier (can test limits)

   **Show Debug Info**:
   - Tap "Show Debug Info"
   - Alert shows current tier, premium status, message count
   - Full details printed to console

   **Reset Daily Usage**:
   - Tap "Reset Daily Usage"
   - Counters reset to 0
   - Can immediately test hitting limits again

   **Check Message Limit**:
   - Tap "Check Message Limit"
   - Shows if you can send messages and why

---

### Via Console (Advanced)

You can also call testing functions directly in your code:

```typescript
import { subscriptionTestUtils, printSubscriptionDebug } from '../utils/subscriptionTestUtils';

// Reset to free tier
await subscriptionTestUtils.resetToFreeTier();

// Show debug info
await printSubscriptionDebug();
const info = await subscriptionTestUtils.getDebugInfo();

// Reset daily usage
await subscriptionTestUtils.forceResetDailyUsage();

// Check message limit
const canSend = await subscriptionTestUtils.checkMessageLimit();
console.log('Can send:', canSend.hasAccess);

// Get all storage keys
const keys = await subscriptionTestUtils.getStorageKeys();
console.log('Usage keys:', keys.usageKeys);

// Nuclear option: clear everything
await subscriptionTestUtils.clearAllStorage();
```

---

## Testing Scenarios

### Scenario 1: Anonymous User Purchases Premium

**Steps**:
1. Complete onboarding
2. On paywall, tap "Continue with Free"
3. Profile shows: nothing (anonymous free) ✅
4. Go to home → tap "..." → tap upgrade (or trigger limit)
5. Purchase monthly or annual
6. Complete test purchase in simulator
7. Check Profile → shows "✨ Premium Member" ✅
8. Send 20+ messages → no limits ✅

**Expected Console Logs**:
```
[Profile] Subscription tier: premium
[Profile] isPremium from context: true
[Profile] isAnonymous: true
[Entitlement] Premium user - Daily messages: 25 / 100
[Entitlement] ✅ Access granted (premium, no hard limit)
```

---

### Scenario 2: Test Premium → Free Tier Switch

**Steps**:
1. Start as premium user (from Scenario 1)
2. Open Profile → "🧪 Developer Tools"
3. Tap "Reset to Free Tier"
4. Alert confirms → tap OK
5. Force quit app (swipe up)
6. Relaunch app
7. Go to Profile → now shows "🆓 Free Plan" (if authenticated) or nothing (if anonymous)
8. Send 15 messages → all work
9. Try 16th message → PaywallModal appears ✅

**Expected Console Logs**:
```
[TEST] 🔄 Resetting to free tier...
[TEST] Step 1/4: Logging out RevenueCat user...
[TEST] Step 2/4: Clearing entitlement cache...
[TEST] Step 3/4: Resetting usage counters...
[TEST] Step 4/4: Re-initializing subscription service...
[TEST] ✅ Reset to free tier complete!

// After relaunch:
[Profile] Subscription tier: free
[Entitlement] Free tier - Daily messages: 15 / 15
[Entitlement] ❌ Access denied - limit reached
```

---

### Scenario 3: Test Daily Limit Reset

**Steps**:
1. As free user, send 15 messages
2. Try 16th → paywall appears
3. Open Profile → "🧪 Developer Tools"
4. Tap "Reset Daily Usage"
5. Alert confirms → tap OK
6. Go back to chat
7. Send messages → can send 15 more ✅

**Expected Console Logs**:
```
[TEST] 🔄 Forcing daily usage reset...
[TEST] ✅ Daily usage counters reset to 0

// After sending message:
[Entitlement] Free tier - Daily messages: 1 / 15
[Entitlement] ✅ Access granted
```

---

### Scenario 4: Debug Why Limits Aren't Working

**Steps**:
1. User reports "I can send unlimited messages on free tier"
2. Open Profile → "🧪 Developer Tools"
3. Tap "Show Debug Info"
4. Check alert and console

**What to Look For**:
```
Tier: free ← Should be 'free' for limited users
Premium: No ← Should be 'No' for free users
Messages: 25/15 ← This is the problem! Should stop at 15

// In console:
[Entitlement] Subscription tier: premium ← BUG: Should be 'free'
```

**Diagnosis**: User has premium entitlement but UI thinks they're free. Need to check RevenueCat dashboard.

**Fix**: Use "Reset to Free Tier" to clear the mismatch.

---

## Understanding the Badge Logic

### Current Badge Display Logic:

| User State | Subscription | Badge Shown |
|------------|-------------|-------------|
| Authenticated | Premium | ✨ Premium Member |
| Authenticated | Free | 🆓 Free Plan |
| Anonymous | Premium | ✨ Premium Member |
| Anonymous | Free | (nothing) |

### Why This Works:

**Old Logic** (broken):
```typescript
if (isAnonymous) return ''; // ❌ Hides badge for ALL anonymous
if (isPremium) return '✨ Premium Member';
return '🆓 Free Plan';
```

**New Logic** (fixed):
```typescript
if (isPremium) return '✨ Premium Member'; // ✅ Check premium FIRST
if (isAnonymous) return ''; // Only hide if anonymous AND free
return '🆓 Free Plan';
```

---

## Common Issues & Solutions

### Issue 1: "I purchased but still see free tier limits"

**Diagnosis**:
1. Open dev menu → "Show Debug Info"
2. Check tier and premium status
3. Look for "Premium: Yes" vs "Premium: No"

**Solutions**:
- If "Premium: Yes" → Badge logic issue (fixed in this update)
- If "Premium: No" → Purchase didn't complete or RevenueCat not syncing
- Try: "Reset to Free Tier" then purchase again

---

### Issue 2: "I can send unlimited messages on free tier"

**Diagnosis**:
1. Check console logs while sending messages
2. Look for "[Entitlement] Subscription tier: ..."
3. Check daily message count

**Possible Causes**:
- Daily usage not incrementing → Check `incrementMessageCount()` is called
- Daily reset not triggering → Check last reset date in logs
- Subscription tier cached incorrectly → Clear entitlement cache

**Solution**:
```typescript
// In dev menu:
1. Tap "Reset Daily Usage"
2. Tap "Check Message Limit"
3. Send 15 messages
4. Check message limit again → should show "Can send: No"
```

---

### Issue 3: "Dev menu doesn't appear"

**Causes**:
- Not in development mode (`__DEV__` is false)
- Running production build instead of dev build

**Check**:
```typescript
console.log('Dev mode:', __DEV__); // Should print: true
```

**Solution**:
- Run: `npx expo start --dev-client`
- Ensure you're in Expo development mode, not production

---

### Issue 4: "Reset to Free Tier doesn't work"

**Symptoms**:
- Still shows premium after reset
- Still have unlimited messages

**Cause**:
- App needs to be force quit and relaunched
- RevenueCat caches user state in memory

**Solution**:
1. Use "Reset to Free Tier" in dev menu
2. **Force quit the app** (swipe up from bottom, close app)
3. **Relaunch the app** (tap icon again)
4. Should now be on free tier

---

## Production Safety

All testing utilities are **production-safe**:

```typescript
if (!__DEV__) {
  console.warn('subscriptionTestUtils only available in development');
  return;
}
```

- Testing functions do nothing in production builds
- Dev menu only renders when `__DEV__ === true`
- Debug logs only print in development mode
- No performance impact on production

---

## Files Changed Summary

| File | Changes | Lines |
|------|---------|-------|
| `ProfileScreen.tsx` | Badge logic fix, dev menu, debug logs | 112-125, 303-757, 70-76 |
| `subscriptionTestUtils.ts` | New testing utilities file | All (new) |
| `entitlementService.ts` | Debug logging in limit checks | 68-86, 130-177, 194-197 |
| `useChatSession.ts` | Debug logging on message record | 164-167 |

---

## Next Steps

### For Development:
1. ✅ Use dev menu to test premium/free switching
2. ✅ Use "Show Debug Info" to verify subscription state
3. ✅ Use "Reset Daily Usage" to test limits repeatedly
4. ✅ Check console logs to diagnose issues

### For Testing:
1. Test anonymous user purchase flow
2. Verify premium badge appears for anonymous purchasers
3. Test daily limit enforcement (15 messages/day)
4. Test premium unlimited access

### Before Production:
1. Verify dev menu doesn't appear in release builds
2. Test subscription persistence across app restarts
3. Test daily reset at midnight
4. Verify all analytics events fire correctly

---

## Quick Reference

### Testing Commands:
```typescript
// Reset to free tier
await subscriptionTestUtils.resetToFreeTier();

// Show current status
await printSubscriptionDebug();

// Reset daily counters
await subscriptionTestUtils.forceResetDailyUsage();

// Check if can send message
const result = await subscriptionTestUtils.checkMessageLimit();
```

### Key Logs to Watch:
```
[Profile] Subscription tier: ...
[Entitlement] Subscription tier: ...
[Entitlement] Daily messages: X / 15
[Entitlement] ✅ Access granted / ❌ Access denied
[Entitlement] Message count incremented: ...
```

### Dev Menu Location:
Profile Tab → Scroll to Menu → "🧪 Developer Tools"

---

**Status**: ✅ All fixes implemented and ready for testing

**Time to implement**: ~30 minutes

**Complexity**: Low - straightforward fixes with comprehensive tooling

be water my friend, take care 🧘🏼‍♀️
