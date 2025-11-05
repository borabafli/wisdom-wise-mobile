# Paywall Setup Guide - Next Steps

## Current Status ✅

### Completed:
- ✅ RevenueCat SDK integrated and configured
- ✅ StoreKit configuration file created (WisdomWise.storekit)
- ✅ Subscription products defined:
  - Monthly: $9.99/month with 3-day free trial
  - Annual: $49.99/year with 3-day free trial
- ✅ Paywall screens implemented (OnboardingPaywallScreen, PaywallModal)
- ✅ Typography and analytics errors fixed
- ✅ Anonymous user ID issue resolved
- ✅ Paywall UI shows even without products (for development)
- ✅ Products created in App Store Connect:
  - com.wisdomwise.app.Monthly
  - com.wisdomwise.app.Annual

### In Progress:
- 🔄 App Store Connect subscription metadata (you're currently doing this)

---

## Step 1: Complete App Store Connect Configuration

You need to fill in the "Missing Metadata" for both subscriptions:

### For Monthly Subscription (com.wisdomwise.app.Monthly):

1. **Subscription Pricing**:
   - Click "Add Pricing"
   - Select territories (recommend starting with USA and your local market)
   - Set price: **$9.99** (Tier 10 in App Store pricing)
   - Click Save

2. **Introductory Offer** (3-day free trial):
   - Click "Create Introductory Offer"
   - Offer Type: **Free** (Pay Nothing)
   - Duration: **3 Days**
   - Territories: Same as subscription pricing
   - Click Save

3. **Localization**:
   - Click on "English (U.K.)" or "Add Localization"
   - Display Name: **WisdomWise Premium - Monthly**
   - Description: **Unlimited access to AI therapy, voice features, and premium exercises**
   - Click Save

4. **Link to App Version**:
   - In the left sidebar, go to your app version (1.0)
   - Under "Subscriptions", click "Add Subscriptions"
   - Select "Monthly" subscription
   - Click Done

### For Annual Subscription (com.wisdomwise.app.Annual):

Follow the same steps as Monthly, but with these values:

1. **Subscription Pricing**:
   - Price: **$49.99** (Tier 50 in App Store pricing)

2. **Introductory Offer**:
   - Same as Monthly: **3 Days Free**

3. **Localization**:
   - Display Name: **WisdomWise Premium - Annual**
   - Description: **Unlimited access to AI therapy, voice features, and premium exercises. Best value - save 58%!**

4. **Link to App Version 1.0** (same as Monthly)

### Expected Result:
After completing these steps, both subscriptions should show **"Ready to Submit"** instead of "Missing Metadata".

---

## Step 2: Add StoreKit Configuration to Xcode

**Important**: This step is required to test subscriptions in iOS Simulator. Without this, RevenueCat will keep showing "products not configured" errors.

### Instructions:

1. **Open Xcode**:
   ```bash
   open ios/wisdomwise.xcworkspace
   ```

2. **Add StoreKit file to Project**:
   - In Xcode, right-click on the project navigator (left sidebar)
   - Select "Add Files to 'wisdomwise'..."
   - Navigate to your project root
   - Select **WisdomWise.storekit** file
   - Make sure "Copy items if needed" is **checked**
   - Click "Add"

3. **Configure StoreKit in Scheme**:
   - In Xcode menu bar: **Product** → **Scheme** → **Edit Scheme...**
   - Select **Run** in the left sidebar
   - Click **Options** tab
   - Under "StoreKit Configuration", select **WisdomWise**
   - Click "Close"

4. **Rebuild and Restart**:
   - In Xcode: **Product** → **Clean Build Folder** (⇧⌘K)
   - Quit your running app in simulator
   - In terminal, restart Expo:
     ```bash
     npx expo start --clear
     ```
   - Press **i** to open in iOS simulator
   - Your simulator is now in "Sandbox" mode with test products!

### Expected Result:
After adding StoreKit configuration, when you open the paywall screen:
- You should see pricing cards with **$9.99** and **$49.99** displayed
- You should see **"3-day free trial"** badges
- The "Start Your 3-Day Free Trial" button should be enabled
- Products should load successfully in RevenueCat logs

---

## Step 3: Test Paywall Flow

### Test Scenarios:

1. **View Paywall in Onboarding**:
   - Restart your app (clear storage if needed)
   - Go through onboarding steps 1-8
   - Step 9 should show paywall with pricing

2. **Test Purchase Flow** (Simulator):
   - Select either Monthly or Annual plan
   - Tap "Start Your 3-Day Free Trial"
   - Simulator will show Apple's test purchase dialog
   - Confirm purchase
   - You should see "Welcome to Premium!" success message

3. **Verify Premium Access**:
   - After purchase, check ProfileScreen
   - Should show "Premium" badge
   - Usage limits should be removed (100 messages/day)

4. **Test Restore Purchases**:
   - In ProfileScreen, find "Restore Purchases" button
   - Tap it
   - Should show "Purchases Restored" message

5. **Test Paywall Modal** (after implementing trigger):
   - Send 15 free messages in chat
   - On 16th message, paywall modal should appear
   - Should show same pricing options

### Debugging Tips:

If products still don't load:
- Check Xcode console for StoreKit errors
- Verify StoreKit file is selected in scheme
- Restart simulator completely
- Clear Expo cache: `npx expo start --clear`

If purchase fails:
- Simulator must have internet connection
- StoreKit configuration must be active in scheme
- Check RevenueCat dashboard for API key issues

---

## Step 4: Configure RevenueCat Dashboard

After testing in simulator, configure RevenueCat production settings:

1. **Go to RevenueCat Dashboard**: https://app.revenuecat.com

2. **Configure Entitlements**:
   - Go to your project → Entitlements
   - Should see "premium" entitlement
   - Verify it's linked to both Monthly and Annual products

3. **Configure Offerings**:
   - Go to Offerings tab
   - Verify "default" offering exists
   - Should contain both Monthly and Annual packages
   - Set Annual as "Best Value" (if not already)

4. **Configure Webhooks** (Optional but recommended):
   - Go to Integrations → Webhooks
   - Add your backend webhook URL (if you have one)
   - Enables real-time subscription events

5. **Test Mode**:
   - Keep "Test Mode" ON during development
   - Switch to "Production" only when submitting to App Store

---

## Step 5: Add Android Support (Later)

When ready for Android:

1. **Google Play Console**:
   - Create subscriptions in Google Play Console
   - Same IDs: com.wisdomwise.app.Monthly and com.wisdomwise.app.Annual
   - Same pricing: $9.99 and $49.99
   - Same trial: 3 days free

2. **RevenueCat Config**:
   - In `src/config/revenueCat.ts`, add Android API key:
     ```typescript
     const REVENUECAT_API_KEY_ANDROID = 'goog_XXXXXXXXXXXXXXXX';
     ```

3. **Update getRevenueCatApiKey()**:
   ```typescript
   export const getRevenueCatApiKey = (): string => {
     return Platform.select({
       ios: REVENUECAT_API_KEY_IOS,
       android: REVENUECAT_API_KEY_ANDROID,
     }) || '';
   };
   ```

---

## Step 6: Add Translations (Deferred)

Paywall is currently English-only. To add translations:

1. **Update translation files**:
   - `locales/de.json` - German
   - `locales/fr.json` - French
   - `locales/tr.json` - Turkish
   - `locales/es.json` - Spanish
   - `locales/pt.json` - Portuguese

2. **Keys to translate** in `paywall` section:
   - `title`, `subtitle`, `features_title`
   - `cta_primary`, `cta_secondary`, `legal`
   - `limit_reached.*` - All limit reached messages
   - `loading`, `processing`

3. **App Store Connect**:
   - Add localizations for each subscription
   - Translate display names and descriptions

---

## Troubleshooting

### "Products not configured yet" message:
- **Cause**: StoreKit configuration not added to Xcode
- **Fix**: Follow Step 2 above

### "Missing Metadata" in App Store Connect:
- **Cause**: Subscription pricing, trial, or localization not complete
- **Fix**: Follow Step 1 above

### RevenueCat "anonymous" user blocked error:
- **Status**: Already fixed ✅
- **Solution**: App now lets RevenueCat auto-generate anonymous IDs

### Typography import errors:
- **Status**: Already fixed ✅
- **Solution**: Changed to correct typography token structure

### Analytics service errors:
- **Status**: Already fixed ✅
- **Solution**: Changed from analyticsService to usePostHog() hook

---

## Support Resources

- **RevenueCat Docs**: https://www.revenuecat.com/docs
- **Apple In-App Purchase**: https://developer.apple.com/in-app-purchase/
- **StoreKit Testing**: https://developer.apple.com/documentation/xcode/setting-up-storekit-testing-in-xcode
- **React Native Purchases**: https://github.com/RevenueCat/react-native-purchases

---

## What to Expect After Completing These Steps

Once you complete Step 1 (App Store Connect) and Step 2 (Xcode StoreKit):

1. **Paywall will display real pricing**: $9.99/month and $49.99/year
2. **Trial badge will appear**: "3-day free trial" on both plans
3. **Purchase button will work**: You can test purchases in simulator
4. **Premium features unlock**: After purchase, usage limits removed
5. **Analytics tracking**: PostHog captures all paywall events
6. **Ready for App Review**: App Store submission can include subscriptions

---

**Current Priority**: Complete Step 1 (App Store Connect metadata configuration). Once you see "Ready to Submit" status, move to Step 2 (Xcode StoreKit configuration).

**Expected Timeline**:
- Step 1: 10-15 minutes (filling in metadata)
- Step 2: 5 minutes (adding StoreKit to Xcode)
- Step 3: 5 minutes (testing in simulator)

Total: ~20-25 minutes to fully functional paywall! 🎉
