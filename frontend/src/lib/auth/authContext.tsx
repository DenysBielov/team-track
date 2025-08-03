'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthResponse, login as apiLogin, refreshToken as apiRefreshToken, logout as apiLogout, getCurrentUser } from '../requests/auth';
import { User } from 'next-auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_STORAGE_KEY = 'accessToken';
const REFRESH_TOKEN_STORAGE_KEY = 'refreshToken';
const TOKEN_EXPIRY_STORAGE_KEY = 'accessTokenExpiry';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Token management utilities
  const saveTokens = (authResponse: AuthResponse) => {
    console.log('Saving tokens:', { accessToken: authResponse.accessToken.substring(0, 20) + '...', expiry: authResponse.accessTokenExpiry });
    localStorage.setItem(TOKEN_STORAGE_KEY, authResponse.accessToken);
    localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, authResponse.refreshToken);
    localStorage.setItem(TOKEN_EXPIRY_STORAGE_KEY, authResponse.accessTokenExpiry);
    
    // Also set in cookie for SSR
    const cookieValue = `token=${authResponse.accessToken}; path=/; max-age=${15 * 60}; SameSite=Lax`;
    document.cookie = cookieValue;
    console.log('Cookie set:', cookieValue.substring(0, 50) + '...');
  };

  const clearTokens = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_STORAGE_KEY);
    
    // Clear cookie
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  };

  const getStoredAccessToken = (): string | null => {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  };

  const getStoredRefreshToken = (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
  };

  const isTokenExpired = (): boolean => {
    const expiry = localStorage.getItem(TOKEN_EXPIRY_STORAGE_KEY);
    if (!expiry) return true;
    
    return new Date() >= new Date(expiry);
  };

  // Auto-refresh token before expiry
  const scheduleTokenRefresh = (expiryDate: string) => {
    const expiryTime = new Date(expiryDate).getTime();
    const currentTime = Date.now();
    const timeUntilExpiry = expiryTime - currentTime;
    
    // Refresh 2 minutes before expiry
    const refreshTime = Math.max(timeUntilExpiry - (2 * 60 * 1000), 1000);
    
    setTimeout(() => {
      refreshAuth();
    }, refreshTime);
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      console.log('Starting login process...');
      const authResponse = await apiLogin(email, password);
      console.log('Login API successful:', { user: authResponse.user });
      
      saveTokens(authResponse);
      setUser(authResponse.user as User);
      scheduleTokenRefresh(authResponse.accessTokenExpiry);
      
      console.log('Login process completed, user set:', authResponse.user);
    } catch (error) {
      console.error('Login failed:', error);
      clearTokens();
      setUser(null);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const refreshTokenValue = getStoredRefreshToken();
      if (refreshTokenValue) {
        await apiLogout(refreshTokenValue);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearTokens();
      setUser(null);
    }
  };

  const refreshAuth = async (): Promise<void> => {
    try {
      const refreshTokenValue = getStoredRefreshToken();
      
      if (!refreshTokenValue) {
        throw new Error('No refresh token available');
      }

      const authResponse = await apiRefreshToken(refreshTokenValue);
      
      saveTokens(authResponse);
      setUser(authResponse.user as User);
      scheduleTokenRefresh(authResponse.accessTokenExpiry);
      
    } catch (error) {
      console.error('Token refresh failed:', error);
      clearTokens();
      setUser(null);
      
      // Redirect to login on refresh failure
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  };

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const accessToken = getStoredAccessToken();
        const refreshTokenValue = getStoredRefreshToken();
        
        if (!accessToken || !refreshTokenValue) {
          setIsLoading(false);
          return;
        }

        // Check if token is expired
        if (isTokenExpired()) {
          // Try to refresh
          await refreshAuth();
        } else {
          // Token is valid, get current user
          try {
            const currentUser = await getCurrentUser();
            setUser(currentUser);
            
            // Schedule refresh
            const expiry = localStorage.getItem(TOKEN_EXPIRY_STORAGE_KEY);
            if (expiry) {
              scheduleTokenRefresh(expiry);
            }
          } catch (error) {
            // If getting user fails, try refresh
            await refreshAuth();
          }
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        clearTokens();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    refreshAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Utility hook for getting access token
export function useAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}