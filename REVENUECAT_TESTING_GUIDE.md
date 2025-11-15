# RevenueCat Testing Guide for WisdomWise

## Current Issue: Plans Not Showing with `npx expo start`

The reason your subscription plans are not appearing with `npx expo start` is that **RevenueCat requires a native iOS/Android build** - it doesn't work in Expo Go or web mode. The RevenueCat SDK needs to communicate with Apple's StoreKit (iOS) or Google Play Billing (Android) which requires native code.

## Prerequisites

### 1. App Store Connect Setup
Before testing, ensure you have:
- [ ] Created your app in App Store Connect
- [ ] Configured In-App Purchases (Subscriptions)
- [ ] Created two subscription products matching your Product IDs:
  - `com.wisdomwise.app.Monthly`
  - `com.wisdomwise.app.Annual`
- [ ] Set up pricing and trial period (3 days free trial)
- [ ] Submitted IAPs for review (they can be tested before approval)

### 2. RevenueCat Dashboard Setup
- [ ] Created a RevenueCat project
- [ ] Connected App Store Connect to RevenueCat
- [ ] Created an "Offering" named `default`
- [ ] Created an "Entitlement" named `Pro`
- [ ] Added two packages to the offering:
  - `$rc_monthly` → `com.wisdomwise.app.Monthly`
  - `$rc_annual` → `com.wisdomwise.app.Annual`
- [ ] Linked both packages to the `Pro` entitlement

---

## Testing Options

You have **THREE OPTIONS** for testing your RevenueCat integration:

### Option 1: TestFlight (Recommended for Pre-Production Testing)
**Best for:** Final testing before App Store submission

**Pros:**
- Most realistic production environment
- Tests with real App Store infrastructure
- Can test with multiple external testers
- No certificate headaches

**Cons:**
- Requires EAS Build (takes 15-30 minutes)
- Requires TestFlight review for external testers (internal is instant)

### Option 2: Physical Device with Development Build (Best for Active Development)
**Best for:** Rapid iteration and debugging

**Pros:**
- Instant reload with Expo Dev Client
- Full debugging capabilities
- Fast iteration cycle
- StoreKit Sandbox mode enabled

**Cons:**
- Requires Xcode and Apple Developer account
- Initial setup takes time
- Need to configure provisioning profiles

### Option 3: iOS Simulator with StoreKit Configuration File (Fastest Setup)
**Best for:** Quick UI testing without real purchases

**Pros:**
- No physical device needed
- No App Store Connect setup required (for initial testing)
- Fast setup
- Perfect for UI/UX testing

**Cons:**
- Limited testing capabilities
- Doesn't test real RevenueCat integration fully
- May have quirks with StoreKit behavior

---

## OPTION 1: TestFlight Testing (Recommended)

### Step 1: Build for TestFlight
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to your Expo account
eas login

# Configure EAS Build (if not already done)
eas build:configure

# Build for iOS
eas build --platform ios --profile preview
```

### Step 2: Upload to TestFlight
EAS will automatically upload to TestFlight when the build completes.

### Step 3: Add Test Users
1. Go to App Store Connect → TestFlight
2. Add yourself as an internal tester
3. Install TestFlight app on your iPhone
4. Accept the invite and install WisdomWise

### Step 4: Create Sandbox Test Account
1. Go to App Store Connect → Users and Access → Sandbox Testers
2. Create a new sandbox tester with a **fake email** (don't use your real Apple ID)
3. **IMPORTANT:** Use a different country/region than your actual Apple ID

### Step 5: Test Purchases
1. Open WisdomWise on TestFlight
2. Go to Settings → Sign Out of App Store (if signed in)
3. Trigger the paywall
4. When prompted, sign in with your sandbox test account
5. Complete the purchase (sandbox purchases are free)
6. Verify premium features are unlocked

### Step 6: Test Scenarios
- [ ] Purchase monthly subscription
- [ ] Verify 3-day trial starts
- [ ] Restore purchases (reinstall app, tap "Restore Purchases")
- [ ] Cancel subscription and verify expiration
- [ ] Purchase annual subscription
- [ ] Test upgrade from monthly to annual

---

## OPTION 2: Physical Device with Development Build

### Step 1: Install Prerequisites
```bash
# Install Xcode from App Store (if not installed)
# Install Xcode Command Line Tools
xcode-select --install

# Install CocoaPods
sudo gem install cocoapods
```

### Step 2: Create Development Build
```bash
# Create iOS development build
npx expo prebuild --platform ios

# Install CocoaPods dependencies
cd ios && pod install && cd ..

# Run on your physical device (connect via USB)
npx expo run:ios --device
```

### Step 3: Configure Xcode
1. Open `ios/wisdomwise.xcworkspace` in Xcode
2. Select your project → Signing & Capabilities
3. Select your Team (Apple Developer account)
4. Ensure "Automatically manage signing" is checked
5. Xcode will create a provisioning profile

### Step 4: Enable StoreKit Testing in Xcode
1. In Xcode, select **Product → Scheme → Edit Scheme**
2. Select **Run → Options**
3. Under "StoreKit Configuration", select "Configuration File" (if you have one, or leave blank for sandbox)
4. Ensure device is connected and selected in Xcode
5. Click **Run** (▶️) to build and install on your device

### Step 5: Test with Sandbox Account
1. On your iPhone, go to Settings → App Store
2. Scroll down to "Sandbox Account"
3. Sign in with your sandbox tester account created in App Store Connect
4. Open WisdomWise app
5. Test purchases (they'll be free in sandbox mode)

### Step 6: Debugging
With development build, you can:
- Use React Native Debugger
- See console logs for RevenueCat SDK
- Test feature gating logic
- Use your dev menu utilities (Profile → Developer Menu)

**Dev Menu Features:**
- Reset to Free Tier
- Force Reset Daily Usage
- Print Subscription Debug Info
- Check Message Limits

---

## OPTION 3: iOS Simulator with StoreKit Configuration

### Step 1: Create StoreKit Configuration File
This allows testing IAPs without App Store Connect setup.

1. Create file: `ios/wisdomwise.storekit`

```json
{
  "identifier" : "wisdomwise",
  "nonRenewingSubscriptions" : [],
  "products" : [],
  "settings" : {
    "_applicationInternalID" : "6740859336",
    "_developerTeamID" : "YOUR_TEAM_ID",
    "_failTransactionsEnabled" : false,
    "_lastAutoRenewableSubscriptionGroupID" : "21636866",
    "_locale" : "en_US",
    "_storefront" : "USA",
    "_storeKitErrors" : [
      {
        "current" : null,
        "enabled" : false,
        "name" : "Load Products"
      }
    ]
  },
  "subscriptionGroups" : [
    {
      "id" : "21636866",
      "localizations" : [],
      "name" : "Premium",
      "subscriptions" : [
        {
          "adHocOffers" : [],
          "codeOffers" : [],
          "displayPrice" : "9.99",
          "familyShareable" : false,
          "groupNumber" : 1,
          "internalID" : "6740860047",
          "introductoryOffer" : {
            "internalID" : "70531158",
            "numberOfPeriods" : 1,
            "paymentMode" : "free",
            "subscriptionPeriod" : "P3D"
          },
          "localizations" : [
            {
              "description" : "Monthly premium subscription",
              "displayName" : "Monthly Premium",
              "locale" : "en_US"
            }
          ],
          "productID" : "com.wisdomwise.app.Monthly",
          "recurringSubscriptionPeriod" : "P1M",
          "referenceName" : "Monthly Premium",
          "subscriptionGroupID" : "21636866",
          "type" : "RecurringSubscription"
        },
        {
          "adHocOffers" : [],
          "codeOffers" : [],
          "displayPrice" : "49.99",
          "familyShareable" : false,
          "groupNumber" : 2,
          "internalID" : "6740860130",
          "introductoryOffer" : {
            "internalID" : "70531159",
            "numberOfPeriods" : 1,
            "paymentMode" : "free",
            "subscriptionPeriod" : "P3D"
          },
          "localizations" : [
            {
              "description" : "Annual premium subscription",
              "displayName" : "Annual Premium",
              "locale" : "en_US"
            }
          ],
          "productID" : "com.wisdomwise.app.Annual",
          "recurringSubscriptionPeriod" : "P1Y",
          "referenceName" : "Annual Premium",
          "subscriptionGroupID" : "21636866",
          "type" : "RecurringSubscription"
        }
      ]
    }
  ],
  "version" : {
    "major" : 4,
    "minor" : 0
  }
}
```

**NOTE:** Replace `YOUR_TEAM_ID` with your Apple Developer Team ID.

### Step 2: Add to Xcode
1. Open `ios/wisdomwise.xcworkspace` in Xcode
2. Right-click on project root → Add Files to "wisdomwise"
3. Select `wisdomwise.storekit`
4. Select **Product → Scheme → Edit Scheme**
5. Select **Run → Options**
6. Under "StoreKit Configuration", select `wisdomwise.storekit`

### Step 3: Build and Run
```bash
# Prebuild iOS
npx expo prebuild --platform ios

# Run on iOS simulator
npx expo run:ios
```

### Step 4: Test Purchases
1. Trigger paywall in app
2. Select a subscription
3. StoreKit will simulate the purchase (no Apple ID needed)
4. Verify premium features unlock

### Step 5: Manage Subscriptions in Simulator
1. In iOS Simulator, go to **Settings → App Store**
2. Scroll to **StoreKit Testing**
3. Here you can:
   - View active subscriptions
   - Renew subscriptions
   - Cancel subscriptions
   - Expire subscriptions
   - Clear purchase history

---

## Testing Checklist

Use this checklist regardless of which option you choose:

### Purchase Flow
- [ ] App displays correct pricing from RevenueCat
- [ ] Monthly plan shows "$9.99/month" with "3-day free trial"
- [ ] Annual plan shows "$49.99/year", "Save 50%", "$4.17/month" with "3-day free trial"
- [ ] "Best Value" badge appears on annual plan
- [ ] Purchase initiates when tapping "Start Free Trial"
- [ ] Purchase completes successfully
- [ ] Premium badge appears immediately after purchase
- [ ] All premium features unlock immediately

### Free Trial
- [ ] Trial starts immediately after purchase
- [ ] No charge during trial period (sandbox shows $0.00)
- [ ] User can access all premium features during trial
- [ ] Trial expiration is shown correctly in Profile

### Restore Purchases
- [ ] "Restore Purchases" button is visible on paywall
- [ ] Uninstall app and reinstall
- [ ] Tap "Restore Purchases"
- [ ] Previous subscription is restored
- [ ] Premium features unlock after restore

### Feature Gating (Free Tier)
- [ ] New anonymous user starts as free tier
- [ ] Can send 15 messages per day
- [ ] Paywall appears on 16th message
- [ ] Voice journaling limited to 5 minutes/day
- [ ] Exercise library shows locked exercises
- [ ] Insights show "Upgrade to unlock" message

### Feature Gating (Premium Tier)
- [ ] Premium user sees "Premium" badge in Profile
- [ ] Unlimited messages (no daily limit paywall)
- [ ] Unlimited voice journaling
- [ ] All exercises unlocked
- [ ] Full insights and analytics
- [ ] Full chat history (no 7-day limit)

### Subscription Management
- [ ] User can view subscription status in Profile
- [ ] Expiration date shown correctly
- [ ] Cancel subscription (should still work until expiration)
- [ ] After expiration, user reverts to free tier
- [ ] Paywall appears again after reversion

### Error Handling
- [ ] Purchase cancellation shows appropriate message
- [ ] Network error during purchase shows retry option
- [ ] Invalid product ID shows error (test by breaking config)
- [ ] Missing offerings shows fallback message

### Analytics (PostHog)
- [ ] Paywall view events tracked
- [ ] Purchase initiated events tracked
- [ ] Purchase completed events tracked
- [ ] Purchase failed events tracked
- [ ] Feature limit reached events tracked

---

## Debugging Common Issues

### Issue: "No offerings available"
**Causes:**
- RevenueCat dashboard not configured
- Products not created in App Store Connect
- Network error
- Wrong API key

**Solutions:**
1. Check RevenueCat dashboard has `default` offering with packages
2. Verify products exist in App Store Connect
3. Check network connectivity
4. Verify API key in [revenueCat.ts](src/config/revenueCat.ts:16)

### Issue: "Purchase failed immediately"
**Causes:**
- Wrong product IDs
- Not signed into sandbox account
- StoreKit not configured
- App Store region mismatch

**Solutions:**
1. Verify product IDs match exactly: `com.wisdomwise.app.Monthly`, `com.wisdomwise.app.Annual`
2. Sign in with sandbox account (Settings → App Store → Sandbox Account)
3. Ensure StoreKit config is loaded in Xcode scheme
4. Check sandbox account region matches store region

### Issue: "Purchases not restoring"
**Causes:**
- Different Apple ID than original purchase
- Sandbox account issue
- RevenueCat user ID mismatch

**Solutions:**
1. Use same sandbox account that made original purchase
2. Check RevenueCat dashboard for customer purchases
3. Clear app data and retry
4. Use developer menu: "Reset to Free Tier" then restore

### Issue: "Premium features not unlocking after purchase"
**Causes:**
- Entitlement not configured in RevenueCat
- Entitlement check logic error
- Cache not refreshing

**Solutions:**
1. Verify `Pro` entitlement exists in RevenueCat dashboard
2. Check packages are linked to `Pro` entitlement
3. Use developer menu: "Print Subscription Debug Info"
4. Force refresh: `subscriptionService.refreshCustomerInfo()`

---

## Recommended Testing Workflow

### Phase 1: Local Development (Simulator with StoreKit)
**Goal:** Test UI/UX and basic purchase flow
**Time:** 1-2 hours

1. Create StoreKit configuration file
2. Build for simulator
3. Test paywall UI and pricing display
4. Test purchase flow (simulated)
5. Verify feature unlocking

### Phase 2: Device Testing (Physical Device)
**Goal:** Test real StoreKit integration
**Time:** 2-3 hours

1. Create development build
2. Install on your iPhone
3. Test with sandbox account
4. Test all purchase scenarios
5. Test restore purchases
6. Test subscription cancellation
7. Test feature limits

### Phase 3: TestFlight Testing
**Goal:** Pre-production validation
**Time:** 1 day (includes build time)

1. Build with EAS for TestFlight
2. Add internal testers
3. Test complete user journey
4. Test on multiple iOS versions
5. Collect feedback from testers
6. Fix any issues and rebuild

### Phase 4: Production Launch
**Goal:** Launch to App Store
**Time:** 1-2 weeks (Apple review)

1. Submit to App Store
2. Enable production mode in RevenueCat (disable sandbox)
3. Monitor real purchases
4. Monitor analytics for conversion rates
5. Provide customer support for purchase issues

---

## Quick Reference Commands

### Development Build
```bash
# iOS Simulator
npx expo prebuild --platform ios
npx expo run:ios

# Physical Device (USB connected)
npx expo run:ios --device

# Specific device
npx expo run:ios --device "Your iPhone Name"
```

### TestFlight Build
```bash
# Build for TestFlight
eas build --platform ios --profile preview

# Check build status
eas build:list

# Submit to App Store (when ready)
eas submit --platform ios
```

### Debugging Tools
```bash
# Clear Metro cache
npx expo start --clear

# Clear iOS build
cd ios && pod deintegrate && pod install && cd ..

# Clear Xcode derived data
rm -rf ~/Library/Developer/Xcode/DerivedData/*
```

### Developer Menu in App
1. Open app
2. Go to Profile screen
3. Scroll to bottom
4. Tap "Developer Menu" (only visible in `__DEV__`)
5. Use testing utilities:
   - **Reset to Free Tier**: Clears all purchases
   - **Print Debug Info**: Shows subscription status
   - **Check Message Limit**: Test daily limits
   - **Reset Daily Usage**: Reset counters

---

## Support Resources

### RevenueCat Docs
- [iOS Setup](https://www.revenuecat.com/docs/getting-started/installation/ios)
- [Testing Guide](https://www.revenuecat.com/docs/test-and-launch/sandbox)
- [Debugging](https://www.revenuecat.com/docs/debugging)

### Apple Docs
- [Sandbox Testing](https://developer.apple.com/documentation/storekit/in-app_purchase/testing_in-app_purchases_in_sandbox)
- [StoreKit Testing](https://developer.apple.com/documentation/xcode/setting-up-storekit-testing-in-xcode)

### Your Implementation Files
- Configuration: [src/config/revenueCat.ts](src/config/revenueCat.ts)
- Subscription Service: [src/services/subscriptionService.ts](src/services/subscriptionService.ts)
- Subscription Context: [src/contexts/SubscriptionContext.tsx](src/contexts/SubscriptionContext.tsx)
- Paywall Screen: [src/screens/OnboardingPaywallScreen.tsx](src/screens/OnboardingPaywallScreen.tsx)
- Testing Utilities: [src/utils/subscriptionTestUtils.ts](src/utils/subscriptionTestUtils.ts)

---

## Next Steps

I recommend **Option 2 (Physical Device)** for your situation because:
1. You can iterate quickly with Expo Dev Client
2. Full debugging capabilities
3. Real StoreKit integration testing
4. You can use your actual phone

**Here's what to do:**

1. Connect your iPhone via USB
2. Run: `npx expo run:ios --device`
3. Wait for build to complete (15-20 minutes first time)
4. Create sandbox test account in App Store Connect
5. Sign in with sandbox account on your iPhone
6. Test purchases!

Would you like me to help you with any specific step?
