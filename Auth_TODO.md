# WisdomWise Authentication Implementation TODO

## 🎯 Simple & Clean Authentication System
Traditional email/password signup with email verification + Google OAuth integration.

---

## 📋 Implementation Checklist

### Phase 1: Setup & Dependencies
- [ ] **Install Required Packages**
  - [ ] `@supabase/supabase-js` - Supabase client
  - [ ] `expo-auth-session` - OAuth flows
  - [ ] `expo-crypto` - Cryptographic functions
  - [ ] `expo-web-browser` - In-app browser for OAuth

- [ ] **Environment Setup**
  - [ ] Add Supabase URL and anon key to .env
  - [ ] Configure OAuth redirect URLs in app.json

### Phase 2: Supabase Configuration
- [ ] **Email Authentication** (Dashboard Setup Needed)
  - [ ] Enable email authentication
  - [ ] Enable email confirmations
  - [ ] Set up custom email verification templates
  
- [ ] **Google OAuth Setup** (Dashboard Setup Needed)
  - [ ] Enable Google provider
  - [ ] Add Google client ID and secret
  - [ ] Configure redirect URLs

- [ ] **Database Schema**
  ```sql
  -- User profiles table
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
  - [ ] Set up Row Level Security policies
  - [ ] Create trigger for auto-profile creation

### Phase 3: Authentication Service
- [ ] **Create `src/services/authService.ts`**
  - [ ] Initialize Supabase client
  - [ ] `signUp(email, password, firstName, lastName, privacyAccepted)`
  - [ ] `signIn(email, password)`
  - [ ] `signInWithGoogle()`
  - [ ] `verifyEmail(token)`
  - [ ] `resendVerification(email)`
  - [ ] `resetPassword(email)`
  - [ ] `signOut()`
  - [ ] `getCurrentUser()`

- [ ] **Create `src/contexts/AuthContext.tsx`**
  - [ ] Manage authentication state
  - [ ] Handle session persistence with AsyncStorage
  - [ ] Loading states and error handling
  - [ ] User profile data management

### Phase 4: Authentication Screens
- [ ] **Welcome Screen** (`src/screens/auth/WelcomeScreen.tsx`)
  - [ ] App logo and welcoming message
  - [ ] "Sign Up" button
  - [ ] "Sign In" button
  - [ ] "Continue with Google" button

- [ ] **Sign Up Screen** (`src/screens/auth/SignupScreen.tsx`)
  - [ ] First Name input
  - [ ] Last Name input
  - [ ] Email input
  - [ ] Password input (with strength indicator)
  - [ ] Confirm Password input
  - [ ] Privacy Policy checkbox: "I trust Mind Wise to keep my information private and safe as outlined in Privacy Policy"
  - [ ] "Create Account" button
  - [ ] "Already have account? Sign In" link
  - [ ] Form validation

- [ ] **Sign In Screen** (`src/screens/auth/SigninScreen.tsx`)
  - [ ] Email input
  - [ ] Password input
  - [ ] "Sign In" button
  - [ ] "Forgot Password?" link
  - [ ] "Don't have account? Sign Up" link
  - [ ] "Continue with Google" option

- [ ] **Email Verification Screen** (`src/screens/auth/VerificationScreen.tsx`)
  - [ ] 6-digit verification code input
  - [ ] "Verify Email" button
  - [ ] "Resend Code" button with timer
  - [ ] Clear instructions and feedback

- [ ] **Forgot Password Screen** (`src/screens/auth/ForgotPasswordScreen.tsx`)
  - [ ] Email input
  - [ ] "Send Reset Email" button
  - [ ] Success feedback
  - [ ] Back to sign in link

### Phase 5: App Integration
- [ ] **Update App.tsx**
  - [ ] Wrap app with AuthContext
  - [ ] Handle initial auth state loading

- [ ] **Update AppContent.tsx**
  - [ ] Check authentication state
  - [ ] Show auth screens vs main app conditionally
  - [ ] Handle session loading states

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
- [ ] **Auth Stack Navigator**
  - [ ] Create auth navigation stack
  - [ ] Handle transitions between auth screens
  - [ ] Deep linking for email verification

- [ ] **Keep Existing Tab Navigation**
  - [ ] No changes to current tab structure
  - [ ] Home, Exercises, Insights, Profile tabs remain the same

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

**be water my friend, take care 🧘🏼‍♀️**