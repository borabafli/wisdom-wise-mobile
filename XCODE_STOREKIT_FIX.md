# Fix: Onboarding Paywall Shows "Products not configured"

## Problem
When running the app from Xcode directly, the onboarding paywall shows "Products not configured yet" even though WisdomWise.storekit file exists.

## Root Cause
The StoreKit configuration file is not selected in your Xcode scheme's Run options.

## Solution

### Step 1: Verify StoreKit File is in Xcode Project

1. Open Xcode workspace:
   ```bash
   open ios/wisdomwise.xcworkspace
   ```

2. In the Project Navigator (left sidebar), look for **WisdomWise.storekit**
   - If you see it: Good, proceed to Step 2
   - If missing: Add it to project:
     - Right-click project navigator
     - Select "Add Files to 'wisdomwise'..."
     - Navigate to project root
     - Select WisdomWise.storekit
     - Check "Copy items if needed"
     - Click "Add"

### Step 2: Configure Xcode Scheme

1. In Xcode menu bar: **Product** → **Scheme** → **Edit Scheme...**

2. Select **Run** in the left sidebar

3. Click the **Options** tab at the top

4. Under "StoreKit Configuration" dropdown:
   - You should see **WisdomWise** as an option
   - Select it (change from "None" to "WisdomWise")

5. Click **Close**

### Step 3: Clean Build and Test

1. Clean build folder: **Product** → **Clean Build Folder** (or press ⇧⌘K)

2. Quit your running app in simulator (if any)

3. Build and run from Xcode: **Product** → **Run** (or press ⌘R)

4. Navigate to onboarding paywall (step 9)

5. **Expected Result**: You should now see:
   - Monthly plan: $9.99/month
   - Annual plan: $49.99/year
   - Both with "Start 3-day free trial" buttons
   - NO "Products not configured" message

## Testing the Fix

### Test 1: Onboarding Paywall
- Go through onboarding to step 9
- Verify pricing cards display with real prices
- Tap "Start Your 3-Day Free Trial" on Monthly plan
- Simulator should show Apple purchase sheet
- Complete test purchase
- Should see "Welcome to Premium!" alert

### Test 2: Verify Premium Status
- After purchase, go to Profile tab
- Should see "✨ Premium Member" badge
- Start a normal chat (not reflection)
- Send 20+ messages
- No paywall should appear

### Test 3: Message Limit (Free User)
- If you didn't complete purchase OR want to test free tier:
- Go to Settings app in simulator
- Scroll to your app name at bottom
- Toggle "Reset In-App Purchases"
- Restart your app
- Start normal chat
- Send 15 messages (should work)
- Try 16th message (PaywallModal should appear)

## Alternative: Run from Expo CLI

If Xcode continues having issues, you can run from Expo CLI which may have better StoreKit integration:

```bash
# Clear cache
npx expo start --clear

# Press 'i' to open iOS simulator
```

This uses Expo's managed workflow which may automatically handle StoreKit configuration.

## Verification Checklist

After applying the fix, verify:

- [ ] StoreKit configuration selected in Xcode scheme (Options tab shows "WisdomWise")
- [ ] Onboarding paywall shows real pricing ($9.99 and $49.99)
- [ ] "Start 3-day free trial" buttons enabled
- [ ] Test purchase flow works
- [ ] After purchase, profile shows premium badge
- [ ] After purchase, can send unlimited chat messages

## Still Not Working?

If products still don't load after these steps:

1. **Check Xcode Console** - Look for StoreKit errors while app is running
2. **Verify StoreKit file format** - Open WisdomWise.storekit and ensure JSON is valid
3. **Restart simulator** - Sometimes simulator needs full restart
4. **Try different simulator** - Create a new iOS simulator device

## Expected Logs When Working

When StoreKit is properly configured, you should see:

```
[RevenueCat] 🍎📦 Loaded 2 products from StoreKit
[RevenueCat] ✅ Offerings fetched successfully
[SubscriptionContext] Loaded offerings: 2
[SubscriptionContext] Status refreshed: free
```

No "Error fetching offerings" or "None of the products registered" errors.

---

**Time to fix**: 2-3 minutes
**Difficulty**: Easy - just a configuration setting

be water my friend, take care 🧘🏼‍♀️
