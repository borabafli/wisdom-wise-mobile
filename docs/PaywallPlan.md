# WisdomWise Paywall Implementation Plan

## Executive Summary
Implementing RevenueCat paywall system for WisdomWise with a minimal & calm onboarding paywall, 3-day free trial, and phased feature gating starting with message limits.

---

## 1. RevenueCat Configuration

### Products Setup
- **Platform**: iOS (App Store) + Android (Google Play)
- **App**: ZenMind: AI Mental Wellness
- **Bundle ID (iOS)**: `com.wisdomwise.app`
- **Package (Android)**: `com.wisdomwise.app`

### Product IDs
| Product ID | Type | Price | Trial | Description |
|------------|------|-------|-------|-------------|
| `com.wisdomwise.app.Monthly` | Subscription | $9.99/month | 3 days | Monthly access to premium features |
| `com.wisdomwise.app.Annual` | Subscription | $49.99/year | 3 days | Annual access (save 50%) |

### Entitlements
- **Identifier**: `Pro`
- **Description**: Unlocks access to features in ZenMind: AI Mental Wellness
- **Products**: Monthly + Annual

### Offerings
- **Identifier**: `default`
- **Display Name**: The standard set of packages
- **Packages**:
  - Monthly package → `com.wisdomwise.app.Monthly`
  - Annual package → `com.wisdomwise.app.Annual`

### API Keys
- **iOS Public API Key**: `appl_zvNqvXCtuhNiWnLVMuvgZMmMNSZ`
- **Android Public API Key**: TBD (need to create Android app in RevenueCat)

---

## 2. Pricing Strategy

### Free Tier
**Limits**:
- **Messages**: 15 messages/day (PHASE 1 - IMPLEMENT FIRST)
- **Voice Journaling**: 5 min/day (PHASE 2)
- **CBT Exercises**: 4 unlocked, 1 exercise/day (PHASE 3)
- **Guided Journaling**: 1 prompt/day (PHASE 4)
- **Insights**: Basic summaries only (PHASE 5)

### Premium Tier
**Pricing**:
- **Monthly**: $9.99/month (3-day free trial)
- **Annual**: $49.99/year (3-day free trial, save 50% vs monthly)

**Value Proposition**:
- ✨ Unlimited AI conversations
- 🎙️ Unlimited voice journaling
- 🧘 Full CBT exercise library
- 📖 Unlimited guided journaling
- 🧠 Advanced insights & patterns
- 📊 Full chat history

**Annual Savings**: "Save 50% with annual plan - only $4.17/month"

---

## 3. Paywall Strategy

### Onboarding Paywall (Primary)
**Timing**: Right after signup/authentication flow
**Style**: Minimal & Calm
**User Flow**:
```
User completes signup/login
  ↓
[OnboardingPaywallScreen appears]
  ↓
"Begin Your Healing Journey"
  ↓
Two pricing cards: Monthly ($9.99) | Annual ($49.99) ← BEST VALUE
  ↓
Both show: "Start 3-day free trial"
  ↓
Small link at bottom: "Continue with Free" (skippable)
  ↓
If premium selected → RevenueCat purchase flow
If free selected → Navigate to app
```

---

## 4. Implementation Phases

### PHASE 1: Foundation & Message Limits (START HERE) ✅

#### Files to Create:
1. `src/config/revenueCat.ts` - Configuration
2. `src/types/subscription.ts` - TypeScript types
3. `src/services/subscriptionService.ts` - RevenueCat integration
4. `src/services/entitlementService.ts` - Feature access checks
5. `src/contexts/SubscriptionContext.tsx` - Global subscription state
6. `src/hooks/useSubscription.ts` - Subscription hook
7. `src/screens/OnboardingPaywallScreen.tsx` - Main paywall screen
8. `src/components/paywall/PricingCard.tsx` - Pricing card component
9. `src/components/paywall/FeatureList.tsx` - Feature bullets
10. `src/styles/components/OnboardingPaywallScreen.styles.ts` - Styling
11. `src/styles/components/PricingCard.styles.ts` - Card styling

#### Files to Modify:
1. `src/contexts/AuthContext.tsx` - Initialize RevenueCat
2. `src/services/rateLimitService.ts` - Check subscription tier
3. `src/hooks/useChatSession.ts` - Show paywall on limit
4. `src/screens/ProfileScreen.tsx` - Add subscription section
5. `App.tsx` - Add SubscriptionProvider
6. All locale files (en.json, tr.json, etc.) - Add translations

#### Tasks:
- [ ] Install RevenueCat SDK
- [ ] Create Android app in RevenueCat dashboard
- [ ] Set up environment variables
- [ ] Create core subscription files
- [ ] Build onboarding paywall UI
- [ ] Integrate with auth flow
- [ ] Update message limits (15/day free)
- [ ] Update profile with subscription status
- [ ] Add translations
- [ ] Test in sandbox

**Deliverables**:
- ✅ Working onboarding paywall with 3-day trial
- ✅ Message limits enforced (15/day free, unlimited premium)
- ✅ Subscription status visible in profile
- ✅ Purchase & restoration working on both platforms

---

### Future Phases (After Phase 1):
- **Phase 2**: Voice journaling limits
- **Phase 3**: Exercise library gating
- **Phase 4**: Insights & guided journaling gating
- **Phase 5**: Chat history & final polish

---

## 5. Paywall UI Design

### Color Palette (Therapeutic & Calm)
```typescript
colors: {
  background: '#F8F5FF',        // Soft lavender
  cardBackground: '#FFFFFF',     // Pure white cards
  primaryAccent: '#8B7FD9',      // Calming purple
  secondaryAccent: '#6EC1B8',    // Therapeutic teal
  textPrimary: '#2D2644',        // Deep purple-gray
  textSecondary: '#6B6B8A',      // Muted purple
  bestValueBadge: '#FFD700',     // Gold
}
```

### Layout Structure
```
[Top Section]
  - Illustration (turtle mascot Anu)
  - Title: "Begin Your Healing Journey"
  - Subtitle: "Start with a 3-day free trial"

[Pricing Cards]
  [Monthly]               [Annual] ← BEST VALUE
  $9.99/month            $49.99/year
  Start Free Trial       Start Free Trial
                         Save 50%

[Features]
  ✨ Unlimited conversations
  🎙️ Unlimited voice journaling
  🧘 Full exercise library
  🧠 Advanced insights

[Bottom]
  [Button: "Start 3-Day Free Trial"]
  [Link: "Continue with Free"]
```

---

## 6. Testing Checklist

### Sandbox Testing
- [ ] iOS purchase flow (monthly)
- [ ] iOS purchase flow (annual)
- [ ] Android purchase flow (monthly)
- [ ] Android purchase flow (annual)
- [ ] 3-day trial activation
- [ ] Features unlock during trial
- [ ] "Continue with Free" flow
- [ ] Subscription restoration
- [ ] Message limit enforcement (free: 15/day)
- [ ] No limit for premium users
- [ ] Paywall shows on limit reached

---

## 7. Next Immediate Steps

### 1. RevenueCat Dashboard Setup
- [ ] Create Android app in RevenueCat
- [ ] Get Android API key
- [ ] Configure 3-day trial in App Store Connect (iOS)
- [ ] Configure 3-day trial in Google Play Console (Android)

### 2. Development Environment
- [ ] Install RevenueCat SDK: `npm install react-native-purchases`
- [ ] Add API keys to `.env`
- [ ] Configure iOS project
- [ ] Configure Android project

### 3. Start Coding
- [ ] Create configuration files
- [ ] Create subscription service
- [ ] Build paywall UI
- [ ] Integrate with auth flow
- [ ] Test in sandbox

---

## Success Criteria for Phase 1

✅ User sees onboarding paywall after signup
✅ User can purchase monthly or annual with 3-day trial
✅ User can skip and continue with free
✅ Free users limited to 15 messages/day
✅ Premium users have unlimited messages
✅ Paywall shows when limit reached
✅ Profile shows subscription status
✅ Works on iOS and Android

---

**Timeline**: Phase 1 completion in 3-5 days
**MVP Launch**: After Phase 1 is complete and tested

---

*Document Version: 1.0*
*Last Updated: 2025-11-05*

be water my friend, take care 🧘🏼‍♀️
