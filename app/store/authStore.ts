import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { signIn, signOut, fetchAuthSession, getCurrentUser, fetchUserAttributes } from '@aws-amplify/auth';
import type { User } from '../types/user';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  idToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loginWithCognito: (email: string, password: string) => Promise<void>;
  logoutFromCognito: () => Promise<void>;
  refreshSession: () => Promise<string | null>;
  checkAuthStatus: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      accessToken: null,
      refreshToken: null,
      idToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Login with Cognito
      loginWithCognito: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          
          // Sign in với Cognito
          const { isSignedIn } = await signIn({
            username: email,
            password: password,
          });

          if (isSignedIn) {
            // Lấy tokens từ session
            const session = await fetchAuthSession();
            const tokens = session.tokens;
            
            if (!tokens) {
              throw new Error('No tokens received from Cognito');
            }

            // Lấy thông tin user
            const currentUser = await getCurrentUser();
            const userAttributes = await fetchUserAttributes();

            // Tạo User object
            const userData: User = {
              id: currentUser.userId,
              username: currentUser.username,
              email: userAttributes.email || email,
              fullName: userAttributes.name || userAttributes.email || '',
              role: (userAttributes['custom:role'] as 'Student' | 'Lecturer' | 'Admin') || 'Student',
              token: tokens.accessToken.toString(), // For backward compatibility
              avatar: userAttributes.picture || '',
              phone: userAttributes.phone_number || '',
              isEmailVerified: userAttributes.email_verified === 'true',
              lastLogin: new Date().toISOString(),
              loginMethod: 'cognito',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };

            // Store tokens và user info
            set({
              user: userData,
              accessToken: tokens.accessToken.toString(),
              refreshToken: tokens.refreshToken?.toString() || null,
              idToken: tokens.idToken?.toString() || null,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });

            console.log('Login successful with Cognito');
          }
        } catch (error: any) {
          console.error('Cognito login error:', error);
          const errorMessage = error.message || 'Đăng nhập thất bại';
          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      // Logout from Cognito
      logoutFromCognito: async () => {
        try {
          set({ isLoading: true });
          
          // Sign out từ Cognito
          await signOut();
          
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            idToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });

          console.log('Logout successful');
        } catch (error: any) {
          console.error('Logout error:', error);
          set({ isLoading: false, error: error.message });
        }
      },

      // Refresh session và lấy token mới
      refreshSession: async () => {
        try {
          const session = await fetchAuthSession({ forceRefresh: true });
          const tokens = session.tokens;
          
          if (tokens?.accessToken) {
            const accessToken = tokens.accessToken.toString();
            
            set({
              accessToken,
              refreshToken: tokens.refreshToken?.toString() || null,
              idToken: tokens.idToken?.toString() || null,
            });
            
            return accessToken;
          }
          
          return null;
        } catch (error) {
          console.error('Refresh session error:', error);
          return null;
        }
      },

      // Check auth status khi app khởi động
      checkAuthStatus: async () => {
        try {
          set({ isLoading: true });
          
          const currentUser = await getCurrentUser();
          const session = await fetchAuthSession();
          const tokens = session.tokens;
          
          if (currentUser && tokens?.accessToken) {
            const userAttributes = await fetchUserAttributes();
            
            const userData: User = {
              id: currentUser.userId,
              username: currentUser.username,
              email: userAttributes.email || '',
              fullName: userAttributes.name || userAttributes.email || '',
              role: (userAttributes['custom:role'] as 'Student' | 'Lecturer' | 'Admin') || 'Student',
              token: tokens.accessToken.toString(),
              avatar: userAttributes.picture || '',
              phone: userAttributes.phone_number || '',
              isEmailVerified: userAttributes.email_verified === 'true',
              lastLogin: new Date().toISOString(),
              loginMethod: 'cognito',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };

            set({
              user: userData,
              accessToken: tokens.accessToken.toString(),
              refreshToken: tokens.refreshToken?.toString() || null,
              idToken: tokens.idToken?.toString() || null,
              isAuthenticated: true,
            });
          } else {
            set({ isAuthenticated: false });
          }
        } catch (error) {
          console.log('Not authenticated');
          set({ isAuthenticated: false });
        } finally {
          set({ isLoading: false });
        }
      },

      // Update user action
      updateUser: (userData: Partial<User>) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),

      // Set loading state
      setLoading: (loading: boolean) =>
        set({ isLoading: loading }),

      // Set error
      setError: (error: string | null) =>
        set({ error }),

      // Clear error
      clearError: () =>
        set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        idToken: state.idToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
