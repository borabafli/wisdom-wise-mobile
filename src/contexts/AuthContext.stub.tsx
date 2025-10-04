import React, { createContext, useContext, ReactNode, useState } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any;
  profile: any;
  isAnonymous: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  signOut: () => Promise<void>;
  skipAuth: () => void;
  requestLogin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// STUB AuthProvider - bypasses all complex auth logic
// Everyone is authenticated as anonymous with no Supabase calls
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated] = useState(true);
  const [isLoading] = useState(false);
  const [user] = useState(null);
  const [profile] = useState({
    first_name: 'Friend',
    last_name: '',
    created_at: new Date().toISOString()
  });
  const [isAnonymous] = useState(true);

  // All auth methods are no-ops
  const signIn = async (email: string, password: string) => {
    console.log('[STUB AuthProvider] signIn called - no-op');
  };

  const signInWithGoogle = async () => {
    console.log('[STUB AuthProvider] signInWithGoogle called - no-op');
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    console.log('[STUB AuthProvider] signUp called - no-op');
  };

  const signOut = async () => {
    console.log('[STUB AuthProvider] signOut called - no-op');
  };

  const skipAuth = () => {
    console.log('[STUB AuthProvider] skipAuth called - no-op');
  };

  const requestLogin = () => {
    console.log('[STUB AuthProvider] requestLogin called - no-op');
  };

  const value = {
    isAuthenticated,
    isLoading,
    user,
    profile,
    isAnonymous,
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
    skipAuth,
    requestLogin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
