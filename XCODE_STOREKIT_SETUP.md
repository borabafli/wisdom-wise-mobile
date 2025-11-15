# Quick Guide: Testing RevenueCat with Xcode StoreKit

## What I Created

I've created a **StoreKit Configuration File** at:
```
ios/WisdomWise.storekit
```

This file simulates your In-App Purchases so you can test subscriptions **without needing App Store Connect setup** initially.

---

## Step-by-Step: Add StoreKit File to Xcode

### Step 1: Open Your Project in Xcode

```bash
# Navigate to your project
cd /Users/borabafli/Desktop/HelloWorld/StartUps/wisdomwise

# Open the Xcode workspace (NOT the .xcodeproj!)
open ios/ZenMind.xcworkspace
```

### Step 2: Add the StoreKit File to Xcode

1. **In Xcode's left sidebar (Project Navigator)**:
   - Right-click on the **"ZenMind"** folder (the blue icon at the top)
   - Select **"Add Files to ZenMind..."**

2. **In the file picker dialog**:
   - Navigate to: `ios/WisdomWise.storekit`
   - **IMPORTANT:** Make sure these checkboxes are set:
     - ✅ **"Copy items if needed"** (UNCHECKED - file is already in ios folder)
     - ✅ **"Create groups"** (SELECTED, not "Create folder references")
     - ✅ **Add to targets:** "ZenMind" (CHECKED)
   - Click **"Add"**

3. **Verify the file was added**:
   - You should see `WisdomWise.storekit` in your project navigator
   - Click on it to preview the subscription products

### Step 3: Configure Xcode Scheme to Use StoreKit

1. **At the top of Xcode**, click on the scheme selector:
   - It should show "ZenMind" with a device/simulator name
   - Click on it and select **"Edit Scheme..."**

2. **In the Scheme Editor**:
   - Select **"Run"** from the left sidebar
   - Click the **"Options"** tab at the top

3. **Under "StoreKit Configuration"**:
   - Click the dropdown that says "None"
   - Select **"WisdomWise.storekit"**
   - ✅ This tells Xcode to use your local StoreKit file for testing

4. **Click "Close"**

### Step 4: Build and Run

1. **Select a simulator** (e.g., iPhone 15 Pro)
   - Click the device selector at the top
   - Choose any iOS simulator

2. **Click the Play button (▶️)** or press `Cmd + R`
   - Xcode will build your app
   - The simulator will launch
   - Your app will open

### Step 5: Test Your Subscriptions

1. **In the running app**:
   - Navigate to where your paywall appears
   - You should now see:
     - ✅ Monthly Premium: $9.99/month
     - ✅ Annual Premium: $49.99/year
     - ✅ Both with 3-day free trial

2. **Make a test purchase**:
   - Tap on a subscription plan
   - Tap "Subscribe" or "Start Free Trial"
   - **No Apple ID needed!** StoreKit will simulate the purchase
   - A confirmation dialog will appear
   - Tap "Buy" or "Subscribe"

3. **Verify premium features unlock**:
   - Check that your premium badge appears
   - Test unlimited messages
   - Verify all features work

### Step 6: Manage Test Subscriptions

**In the iOS Simulator**:
1. Go to **Settings** → **App Store**
2. Scroll down to **"StoreKit Testing"**
3. Here you can:
   - View your active subscriptions
   - Renew subscriptions manually
   - Cancel subscriptions
   - Expire subscriptions immediately (to test expiration flow)
   - Clear all purchase history

---

## What This StoreKit File Contains

Your `WisdomWise.storekit` includes:

### Monthly Subscription
- **Product ID**: `com.wisdomwise.app.Monthly`
- **Price**: $9.99/month
- **Free Trial**: 3 days
- **Auto-renewable**: Every month

### Annual Subscription
- **Product ID**: `com.wisdomwise.app.Annual`
- **Price**: $49.99/year
- **Free Trial**: 3 days
- **Auto-renewable**: Every year
- **Savings**: 50% vs monthly ($4.17/month equivalent)

---

## Testing Scenarios

Once it's working, test these scenarios:

### Scenario 1: Purchase Monthly Subscription
1. Open app → Trigger paywall
2. Select Monthly plan ($9.99)
3. Complete purchase
4. ✅ Verify premium badge appears
5. ✅ Test unlimited messaging

### Scenario 2: Purchase Annual Subscription
1. Reset app (or use Developer Menu → "Reset to Free Tier")
2. Trigger paywall
3. Select Annual plan ($49.99)
4. Complete purchase
5. ✅ Verify "Best Value" badge was shown
6. ✅ Verify all premium features unlock

### Scenario 3: Restore Purchases
1. Settings (in simulator) → App Store → StoreKit Testing
2. Note your active subscription
3. Delete the app from simulator
4. Reinstall and open app
5. Tap "Restore Purchases" on paywall
6. ✅ Subscription should restore
7. ✅ Premium features should unlock

### Scenario 4: Subscription Expiration
1. Purchase a subscription
2. In simulator: Settings → App Store → StoreKit Testing
3. Find your subscription
4. Tap "Expire Subscription"
5. Force close and reopen app
6. ✅ User should revert to free tier
7. ✅ Paywall should appear again when hitting limits

### Scenario 5: Free Trial Flow
1. Purchase subscription
2. Check expiration date (should be 3 days from now)
3. Settings → App Store → StoreKit Testing
4. Verify "Free Trial" status is shown
5. ✅ No charge during trial
6. ✅ All premium features accessible

### Scenario 6: Feature Limits (Free User)
1. Use Developer Menu → "Reset to Free Tier"
2. Send 15 messages
3. ✅ On 16th message, paywall should appear
4. ✅ Message should not be sent until upgraded

---

## Debugging Tips

### Issue: StoreKit file not appearing in dropdown
**Solution:**
- Make sure you added the file to the project (not just the filesystem)
- Verify the file has `.storekit` extension
- Try closing and reopening Xcode

### Issue: "No products available"
**Solution:**
- Check that StoreKit configuration is selected in scheme
- Verify product IDs match exactly:
  - `com.wisdomwise.app.Monthly`
  - `com.wisdomwise.app.Annual`
- Check console logs for RevenueCat errors

### Issue: Purchase doesn't complete
**Solution:**
- Check the StoreKit transaction log (Xcode → Debug → StoreKit → Transaction Manager)
- Look for error messages in Xcode console
- Verify your RevenueCat SDK is initialized correctly

### Issue: Premium features don't unlock after purchase
**Solution:**
- Check console logs for entitlement errors
- Use Developer Menu → "Print Subscription Debug Info"
- Verify `Pro` entitlement is configured in RevenueCat dashboard
- Check that packages are linked to entitlement

---

## Console Debugging

While running in Xcode, check the console (bottom panel) for RevenueCat logs:

**Good signs:**
```
✅ [Purchases] - DEBUG: Configuring Purchases SDK
✅ [Purchases] - DEBUG: Loaded offerings successfully
✅ [Purchases] - INFO: Purchase completed successfully
✅ [Purchases] - DEBUG: Customer info updated
```

**Bad signs:**
```
❌ [Purchases] - ERROR: No offerings available
❌ [Purchases] - ERROR: Product not found
❌ [Purchases] - ERROR: Entitlement not active
```

---

## Switching Between StoreKit and Real Sandbox

### For Local Testing (StoreKit Configuration)
- **Xcode Scheme Options**: Select `WisdomWise.storekit`
- **No Apple ID needed**
- **Instant transactions**
- **Perfect for UI testing**

### For Real Testing (Apple Sandbox)
- **Xcode Scheme Options**: Set to "None" (or leave blank)
- **Requires sandbox Apple ID** (Settings → App Store → Sandbox Account)
- **Tests real App Store integration**
- **Tests RevenueCat sync**

To switch:
1. Edit Scheme → Run → Options
2. Change "StoreKit Configuration" dropdown
3. Clean build folder (Cmd + Shift + K)
4. Rebuild and run

---

## Quick Reference

### Open Xcode Workspace
```bash
open ios/ZenMind.xcworkspace
```

### Clean Build
In Xcode: **Product** → **Clean Build Folder** (Cmd + Shift + K)

### View StoreKit Transactions
In Xcode while running: **Debug** → **StoreKit** → **Transaction Manager**

### View Console Logs
In Xcode: **View** → **Debug Area** → **Show Debug Area** (Cmd + Shift + Y)

### Reset Simulator
```bash
# Erase all simulators
xcrun simctl erase all

# Or reset specific simulator
xcrun simctl erase "iPhone 15 Pro"
```

---

## Next Steps After StoreKit Testing Works

Once you've verified everything works locally with StoreKit:

1. **Set up App Store Connect**:
   - Create the actual IAP products with the same IDs
   - Submit for review

2. **Test with Real Sandbox**:
   - Create sandbox test account
   - Switch Xcode scheme to "None" (disable StoreKit file)
   - Sign in with sandbox account on device/simulator
   - Test real App Store integration

3. **Build for TestFlight**:
   - Test in production-like environment
   - Share with beta testers

4. **Submit to App Store**:
   - Final review and launch

---

## Visual Guide

Here's what you'll see in Xcode:

### 1. Adding StoreKit File
```
Project Navigator (Left Sidebar)
├── ZenMind (Blue Folder Icon) ← Right-click here
│   ├── AppDelegate.mm
│   ├── Images.xcassets
│   ├── Info.plist
│   └── WisdomWise.storekit ← Should appear here after adding
```

### 2. Scheme Configuration
```
Top Bar: ZenMind > iPhone 15 Pro
         ↑ Click here → Edit Scheme... → Run → Options

StoreKit Configuration: [WisdomWise.storekit ▼]
                         ↑ Select this
```

### 3. StoreKit Testing in Simulator
```
Simulator → Settings
└── App Store
    └── STOREKIT TESTING
        ├── Sandbox Account: None
        └── Manage ← View subscriptions here
```

---

Need help with any of these steps? Just let me know!

be water my friend, take care 🧘🏼‍♀️
