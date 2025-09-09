import { colors, spacing, typography } from '../tokens';

export const authStyles = {
  // Container styles
  container: "flex-1 bg-blue-50 px-6",
  contentContainer: "flex-1 justify-center py-8",
  scrollContainer: "flex-1",
  keyboardView: "flex-1",
  
  // Header styles
  headerContainer: "items-center mb-8",
  logo: "w-20 h-20 mb-4",
  title: "text-2xl font-bold text-gray-900 text-center mb-2",
  subtitle: "text-gray-600 text-center leading-relaxed",
  
  // Form styles
  formContainer: "space-y-4",
  inputContainer: "space-y-2",
  label: "text-sm font-medium text-gray-700",
  input: "bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 text-base",
  inputFocused: "border-blue-500 bg-white shadow-sm",
  inputError: "border-red-500 bg-red-50",
  
  // Button styles
  primaryButton: "bg-blue-600 rounded-lg px-6 py-3 mb-4",
  primaryButtonText: "text-white text-base font-semibold text-center",
  primaryButtonDisabled: "bg-gray-300",
  primaryButtonLoading: "opacity-75",
  
  secondaryButton: "bg-white border border-gray-300 rounded-lg px-6 py-3 mb-4",
  secondaryButtonText: "text-gray-700 text-base font-semibold text-center",
  
  googleButton: "bg-white border border-gray-300 rounded-lg px-6 py-3 mb-6 flex-row items-center justify-center",
  googleButtonText: "text-gray-700 text-base font-semibold ml-3",
  googleIcon: "w-5 h-5",
  
  // Link styles
  linkContainer: "items-center mt-6",
  link: "text-blue-600 font-medium text-base",
  linkText: "text-gray-600 text-base text-center",
  
  // Error styles
  errorContainer: "bg-red-50 border border-red-200 rounded-lg p-3 mb-4",
  errorText: "text-red-700 text-sm text-center",
  
  // Success styles
  successContainer: "bg-green-50 border border-green-200 rounded-lg p-3 mb-4",
  successText: "text-green-700 text-sm text-center",
  
  // Privacy policy styles
  privacyContainer: "flex-row items-start space-x-3 mb-6",
  checkbox: "w-5 h-5 border-2 border-gray-300 rounded",
  checkboxChecked: "bg-blue-600 border-blue-600",
  checkboxText: "flex-1 text-sm text-gray-600 leading-relaxed",
  privacyLink: "text-blue-600 font-medium",
  
  // Loading styles
  loadingContainer: "absolute inset-0 bg-white bg-opacity-75 justify-center items-center",
  loadingText: "text-gray-600 mt-2 text-base",
  
  // Verification styles
  verificationContainer: "items-center space-y-4",
  verificationInput: "text-center text-2xl font-mono letter-spacing-wide bg-white border border-gray-300 rounded-lg px-4 py-3 w-48",
  
  // Forgot password styles
  forgotPasswordContainer: "items-center space-y-6",
  
  // Divider styles
  dividerContainer: "flex-row items-center my-6",
  dividerLine: "flex-1 h-px bg-gray-300",
  dividerText: "px-4 text-gray-500 text-sm",
  
  // Safe area styles
  safeArea: "flex-1 bg-blue-50",
} as const;