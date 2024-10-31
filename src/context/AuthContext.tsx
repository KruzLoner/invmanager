import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
} | null;

type AuthContextType = {
  user: User;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
  }) => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const AUTH_KEY = 'auth_data';
const TOKEN_KEY = 'token';

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

function useProtectedRoute(user: User) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      router.replace('/auth');
    } else if (user && inAuthGroup) {
      router.replace('/');
    }
  }, [user, segments]);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);

  useProtectedRoute(user);

  // Load saved authentication state
  useEffect(() => {
    loadAuthState();
  }, []);

  async function loadAuthState() {
    try {
      const authData = await AsyncStorage.getItem(AUTH_KEY);
      if (authData) {
        const { user: savedUser, token } = JSON.parse(authData);
        if (savedUser && token) {
          setUser(savedUser);
          // You might want to validate the token here
        }
      }
    } catch (error) {
      console.error('Error loading auth state:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function saveAuthState(userData: any, token: string) {
    try {
      console.log('Saving auth state:', { userData, token: token.substring(0, 20) + '...' });
      await AsyncStorage.setItem(AUTH_KEY, JSON.stringify({ user: userData, token }));
      await AsyncStorage.setItem(TOKEN_KEY, token);
      console.log('Auth state saved successfully');
    } catch (error) {
      console.error('Error saving auth state:', error);
    }
  }

  async function signIn(email: string, password: string) {
    try {
      setIsLoading(true);
      const API_URL = Platform.OS === 'ios' 
        ? 'http://localhost:5001/api'
        : 'http://10.0.2.2:5001/api';

      console.log('Making login request to:', `${API_URL}/auth/login`);
      console.log('With data:', { email, password: '***' });

      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to sign in');
      }

      const { token, user: userData } = data.data;
      await saveAuthState(userData, token);
      setUser(userData);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  async function signUp(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
  }) {
    try {
      console.log('=== AuthContext: Starting Sign Up ===');
      setIsLoading(true);
      const API_URL = Platform.OS === 'ios' 
        ? 'http://localhost:5001/api'
        : 'http://10.0.2.2:5001/api';

      console.log('Making request to:', `${API_URL}/auth/register`);
      console.log('Request data:', { ...data, password: '***' });

      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(data),
      });

      console.log('Response status:', response.status);
      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to sign up');
      }

      const { token, user: userData } = responseData.data;
      await saveAuthState(userData, token);
      setUser(userData);
      
      console.log('Sign up successful, user data saved');
    } catch (error) {
      console.log('AuthContext error:', error);
      throw error;
    } finally {
      setIsLoading(false);
      console.log('=== AuthContext: Sign Up Complete ===');
    }
  }

  async function signOut() {
    try {
      setIsLoading(true);
      await AsyncStorage.removeItem(AUTH_KEY);
      await AsyncStorage.removeItem(TOKEN_KEY);
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signUp,
        signOut,
        isLoading,
      }}>
      {children}
    </AuthContext.Provider>
  );
} 