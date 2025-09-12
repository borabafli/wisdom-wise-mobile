# WisdomWise Authentication Implementation TODO

## 🎯 Simple & Clean Authentication System
Traditional email/password signup with email verification + Google OAuth integration.

---

## 📋 Implementation Checklist

### Phase 1: Setup & Dependencies
- [x] **Install Required Packages**
  - [x] `@supabase/supabase-js` - Supabase client
  - [x] `expo-auth-session` - OAuth flows
  - [x] `expo-crypto` - Cryptographic functions
  - [x] `expo-web-browser` - In-app browser for OAuth

- [x] **Environment Setup**
  - [x] Add Supabase URL and anon key to .env
  - [x] Configure OAuth redirect URLs in app.json (Added scheme: "wisdomwise")

### Phase 2: Supabase Configuration
- [ ] **Email Authentication** (Dashboard Setup Needed)
  - [ ] Enable email authentication
  - [ ] Enable email confirmations
  - [ ] Set up custom email verification templates
  
- [ ] **Google OAuth Setup** (Dashboard Setup Needed)
  - [ ] Enable Google provider
  - [ ] Add Google client ID and secret
  - [ ] Configure redirect URLs

- [x] **Database Schema**
  ```sql
  -- User profiles table (Created in migrations/001_user_profiles.sql)
  create table user_profiles (
    id uuid references auth.users on delete cascade,
    first_name text not null,
    last_name text not null,
    email text not null,
    privacy_accepted boolean not null default false,
    privacy_accepted_at timestamp with time zone,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    primary key (id)
  );
  ```
  - [x] Set up Row Level Security policies
  - [x] Create trigger for auto-profile creation

### Phase 3: Authentication Service
- [x] **Create `src/services/authService.ts`**
  - [x] Initialize Supabase client
  - [x] `signUp(email, password, firstName, lastName)` with redirect URL
  - [x] `signIn(email, password)`
  - [ ] `signInWithGoogle()`
  - [x] `verifyEmail(token)`
  - [x] `resendVerification(email)`
  - [x] `resetPassword(email)`
  - [x] `signOut()`
  - [x] `getCurrentUser()`

- [x] **Create `src/contexts/AuthContext.tsx`**
  - [x] Manage authentication state
  - [x] Handle session persistence with AsyncStorage
  - [x] Loading states and error handling
  - [x] User profile data management

### Phase 4: Authentication Screens
- [ ] **Welcome Screen** (`src/screens/auth/WelcomeScreen.tsx`)
  - [ ] App logo and welcoming message
  - [ ] "Sign Up" button
  - [ ] "Sign In" button
  - [ ] "Continue with Google" button

- [x] **Sign Up Screen** (`src/screens/auth/SignUpScreen.tsx`)
  - [x] First Name input
  - [x] Last Name input
  - [x] Email input
  - [x] Password input (with strength indicator)
  - [x] Confirm Password input
  - [x] Privacy Policy checkbox: "I trust WisdomWise to keep my information private and safe as outlined in Privacy Policy"
  - [x] "Create Account" button
  - [x] "Already have account? Sign In" link
  - [x] Form validation
  - [x] Navigate to verification after signup

- [x] **Sign In Screen** (`src/screens/auth/SignInScreen.tsx`)
  - [x] Email input
  - [x] Password input
  - [x] "Sign In" button
  - [ ] "Forgot Password?" link
  - [x] "Don't have account? Sign Up" link
  - [ ] "Continue with Google" option

- [x] **Email Verification Screen** (`src/screens/auth/VerificationScreen.tsx`)
  - [x] Email confirmation instructions
  - [x] "I've Verified" button to check verification status
  - [x] "Resend Email" button with timer
  - [x] Clear instructions and feedback
  - [x] Back to sign in navigation

- [ ] **Forgot Password Screen** (`src/screens/auth/ForgotPasswordScreen.tsx`)
  - [ ] Email input
  - [ ] "Send Reset Email" button
  - [ ] Success feedback
  - [ ] Back to sign in link

### Phase 5: App Integration
- [x] **Update App.tsx**
  - [x] Wrap app with AuthContext
  - [x] Handle initial auth state loading

- [x] **Update AppContent.tsx**
  - [x] Check authentication state
  - [x] Show auth screens vs main app conditionally
  - [x] Handle session loading states

- [ ] **Update Profile Screen** (`src/screens/ProfileScreen.tsx`)
  - [ ] **Display user's full name** (first + last name)
  - [ ] Show user email
  - [ ] **Add "Log Out" button** with confirmation dialog
  - [ ] Show account creation date
  - [ ] Add "Edit Profile" option

### Phase 6: UI Components & Styling
- [ ] **Create Reusable Components**
  - [ ] `AuthInput.tsx` - Styled input with validation
  - [ ] `AuthButton.tsx` - Loading states and styling
  - [ ] `ErrorMessage.tsx` - Consistent error display
  - [ ] `GoogleSignInButton.tsx` - Branded Google button

- [ ] **Styling** (Follow existing `/src/styles` pattern)
  - [ ] Create auth screen styles in `/src/styles/components/`
  - [ ] Ensure therapeutic, calming design
  - [ ] Mobile-first responsive design
  - [ ] Proper keyboard handling

### Phase 7: Navigation Setup
- [x] **Auth Stack Navigator**
  - [x] Create auth navigation stack (AuthNavigator.tsx)
  - [x] Handle transitions between auth screens
  - [x] Deep linking for email verification (scheme: "wisdomwise")

- [x] **Keep Existing Tab Navigation**
  - [x] No changes to current tab structure
  - [x] Home, Exercises, Insights, Profile tabs remain the same

### Phase 8: Error Handling & Security
- [ ] **Error Handling**
  - [ ] Network errors
  - [ ] Invalid credentials
  - [ ] Email already exists
  - [ ] Verification failures
  - [ ] Rate limiting feedback

- [ ] **Security**
  - [ ] Secure token storage
  - [ ] Input validation and sanitization
  - [ ] No sensitive info in error messages
  - [ ] Proper session timeout handling

### Phase 9: Testing
- [ ] **Core Flows**
  - [ ] Email signup → verification → login
  - [ ] Google OAuth signup/signin
  - [ ] Password reset flow
  - [ ] Logout functionality
  - [ ] Profile name display
  - [ ] Privacy policy acceptance tracking

- [ ] **Error Scenarios**
  - [ ] Invalid email formats
  - [ ] Weak passwords
  - [ ] Network failures
  - [ ] Already registered emails
  - [ ] Invalid verification codes

---

## 🔧 Dashboard Configuration Tasks

### Supabase Dashboard Setup (Requires Manual Configuration)
1. **Authentication Settings**
   - Enable email authentication
   - Enable email confirmations
   - Configure email templates

2. **Google OAuth Setup**
   - Enable Google provider
   - Add OAuth credentials
   - Set redirect URLs

3. **Database Setup**
   - Create user_profiles table with privacy_accepted field
   - Set up RLS policies
   - Create auto-profile creation trigger

---

## 📝 Key Design Decisions
- **No Edge Functions** - Keep it simple with built-in Supabase auth
- **Privacy Tracking** - Store privacy policy acceptance in user_profiles
- **Current Navigation** - No changes to existing tab structure
- **Simple Profile** - Just show name, email, and logout option
- **Therapeutic UX** - Calm, reassuring authentication experience

---

## 🚨 Important Notes
- Use environment variables for all Supabase configuration
- Test email deliverability thoroughly
- Ensure privacy policy is accessible and up-to-date
- Follow existing app design patterns and styling
- Keep authentication flows simple and intuitive

---

## 🔧 Recent Fixes Applied

### ✅ Issues Resolved:
1. **Email Verification Flow**
   - ✅ Added proper redirect URL: `wisdomwise://auth/verify`
   - ✅ Created VerificationScreen.tsx with resend functionality
   - ✅ Updated signup flow to navigate to verification screen
   - ✅ Added app scheme configuration in app.json

2. **Database Structure**
   - ✅ Created migrations/001_user_profiles.sql with complete schema
   - ✅ Added RLS policies and auto-profile creation trigger
   - ✅ Privacy acceptance tracking included

3. **Supabase Configuration Security**
   - ✅ Added environment variable validation
   - ✅ Improved error handling for missing credentials

### 🔄 Next Manual Steps Required:

1. **Run Database Migration** (Execute in Supabase Dashboard > SQL Editor):
   ```sql
   -- Copy contents from migrations/001_user_profiles.sql and execute
   ```

2. **Update Supabase Auth Settings**:
   - Set redirect URL: `wisdomwise://auth/verify`
   - Ensure email confirmations are enabled
   - Test email delivery

3. **Test the Flow**:
   - Sign up with new email → receive verification email
   - Click verification link → redirects to app
   - Return to app → tap "I've Verified" → should login successfully

### 🎯 Known Issues Still Present:
- **Duplicate signup**: Supabase allows re-signup if first attempt unverified (this is normal behavior)
- **Invalid credentials**: Users must verify email before they can login (this is correct behavior)

**be water my friend, take care 🧘🏼‍♀️**