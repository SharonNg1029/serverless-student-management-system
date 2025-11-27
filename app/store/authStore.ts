import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { signIn, signOut, fetchAuthSession, getCurrentUser, fetchUserAttributes, confirmSignIn, type ConfirmSignInOutput } from '@aws-amplify/auth';
import type { User } from '../types';


interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  idToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  pendingSignIn: boolean;
  
  // Actions
  loginWithCognito: (email: string, password: string) => Promise<{ requireNewPassword?: boolean }>;
  confirmNewPassword: (newPassword: string) => Promise<void>;
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
      pendingSignIn: false,

      // Login with Cognito
      loginWithCognito: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          
          // Sign in với Cognito
          const signInResult = await signIn({
            username: email,
            password: password,
          });

          // Kiểm tra xem có cần bước bổ sung không
          if (!signInResult.isSignedIn && signInResult.nextStep) {
            const nextStep = signInResult.nextStep.signInStep;
            
            // Xử lý các trường hợp đặc biệt
            switch (nextStep) {
              case 'CONFIRM_SIGN_UP':
                throw new Error('Tài khoản chưa được xác nhận. Vui lòng kiểm tra email để xác nhận tài khoản.');
              case 'RESET_PASSWORD':
                throw new Error('Bạn cần reset mật khẩu. Vui lòng sử dụng chức năng quên mật khẩu.');
              case 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED':
                // Trả về flag để UI biết cần đổi mật khẩu
                set({ pendingSignIn: true, isLoading: false });
                return { requireNewPassword: true };
              case 'CONFIRM_SIGN_IN_WITH_SMS_CODE':
              case 'CONFIRM_SIGN_IN_WITH_TOTP_CODE':
                throw new Error('Tài khoản yêu cầu xác thực 2 lớp (MFA). Chức năng này chưa được hỗ trợ.');
              case 'CONTINUE_SIGN_IN_WITH_MFA_SELECTION':
                throw new Error('Vui lòng chọn phương thức xác thực MFA.');
              case 'CONFIRM_SIGN_IN_WITH_CUSTOM_CHALLENGE':
                throw new Error('Tài khoản yêu cầu xác thực đặc biệt.');
              default:
                throw new Error(`Yêu cầu bước xác thực: ${nextStep}. Vui lòng liên hệ quản trị viên.`);
            }
          }

          if (signInResult.isSignedIn) {
            // Đợi một chút để đảm bảo session được tạo
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Lấy tokens từ session
            const session = await fetchAuthSession({ forceRefresh: true });
            const tokens = session.tokens;
            
            if (!tokens || !tokens.accessToken) {
              throw new Error('Không nhận được token từ Cognito. Vui lòng thử lại.');
            }

            // Lấy thông tin user
            const currentUser = await getCurrentUser();
            const userAttributes = await fetchUserAttributes();

            // Debug: Log để kiểm tra
            console.log('=== DEBUG LOGIN ===');
            console.log('User Attributes:', JSON.stringify(userAttributes, null, 2));
            console.log('ID Token Payload:', JSON.stringify(tokens.idToken?.payload, null, 2));
            console.log('All ID Token:', tokens.idToken);
            
            // Lấy role từ nhiều nguồn có thể:
            // 1. ID Token payload (custom:role)
            // 2. User attributes (custom:role hoặc custom:Role)
            // 3. User attributes (role)
            const idTokenRole = tokens.idToken?.payload['custom:role'];
            const attrRole = userAttributes['custom:role'] || userAttributes['custom:Role'] || userAttributes.role;
            let finalRole = idTokenRole || attrRole;
            
            console.log('ID Token Role:', idTokenRole);
            console.log('Attributes Role:', attrRole);
            console.log('Final Role:', finalRole);
            
            // If no role found in Cognito, try to fetch from DynamoDB
            if (!finalRole) {
              console.log('⚠️ No role in Cognito, fetching from DynamoDB...');
              try {
                const dynamoRole = await fetchUserRoleFromDynamoDB(
                  currentUser.userId,
                  tokens.accessToken.toString()
                );
                if (dynamoRole) {
                  finalRole = dynamoRole;
                  console.log('✅ Role from DynamoDB:', dynamoRole);
                } else {
                  console.log('⚠️ No role in DynamoDB either, using default');
                }
              } catch (error) {
                console.error('Failed to fetch role from DynamoDB:', error);
              }
            }
            
            console.log('Final Role will be:', finalRole || 'Student (DEFAULT)');
            
            const roleValue = (finalRole as 'Student' | 'Lecturer' | 'Admin') || 'Student';
            console.log('=== END DEBUG ===');
            
            const userData: User = {
              id: currentUser.userId,
              username: currentUser.username,
              email: userAttributes.email || email,
              fullName: userAttributes.name || userAttributes.email || '',
              role: roleValue,
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
              refreshToken: null, // AWS Amplify v6 manages refresh token internally
              idToken: tokens.idToken?.toString() || null,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });

            return {};
          } else {
            throw new Error('Đăng nhập thất bại. Vui lòng kiểm tra thông tin đăng nhập.');
          }
        } catch (error: any) {
          const errorMessage = error.message || 'Đăng nhập thất bại';
          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
            pendingSignIn: false,
          });
          throw error;
        }
      },

      // Confirm new password when required
      confirmNewPassword: async (newPassword: string) => {
        try {
          set({ isLoading: true, error: null });
          
          // Confirm sign in với mật khẩu mới
          const confirmResult = await confirmSignIn({
            challengeResponse: newPassword,
          });
          
          if (confirmResult.isSignedIn) {
            
            // Đợi một chút để đảm bảo session được tạo
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Lấy tokens từ session
            const session = await fetchAuthSession({ forceRefresh: true });
            const tokens = session.tokens;
            
            if (!tokens || !tokens.accessToken) {
              throw new Error('Không nhận được token sau khi đổi mật khẩu.');
            }
            
            // Lấy thông tin user
            const currentUser = await getCurrentUser();
            const userAttributes = await fetchUserAttributes();
            
            // Debug: Log
            console.log('=== DEBUG CONFIRM PASSWORD ===');
            console.log('User Attributes:', userAttributes);
            console.log('ID Token Payload:', tokens.idToken?.payload);
            
            // Lấy role từ ID Token hoặc attributes
            const idTokenRole = tokens.idToken?.payload['custom:role'];
            const attrRole = userAttributes['custom:role'] || userAttributes['custom:Role'] || userAttributes.role;
            const finalRole = idTokenRole || attrRole;
            
            const roleValue = (finalRole as 'Student' | 'Lecturer' | 'Admin') || 'Student';
            console.log('Final Role:', roleValue);
            console.log('=== END DEBUG ===');
            
            const userData: User = {
              id: currentUser.userId,
              username: currentUser.username,
              email: userAttributes.email || '',
              fullName: userAttributes.name || userAttributes.email || '',
              role: roleValue,
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
              refreshToken: null, // AWS Amplify v6 manages refresh token internally
              idToken: tokens.idToken?.toString() || null,
              isAuthenticated: true,
              isLoading: false,
              error: null,
              pendingSignIn: false,
            });
          } else {
            throw new Error('Xác nhận mật khẩu thất bại.');
          }
        } catch (error: any) {
          const errorMessage = error.message || 'Đổi mật khẩu thất bại';
          set({
            error: errorMessage,
            isLoading: false,
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
            pendingSignIn: false,
          });
        } catch (error: any) {
          set({ isLoading: false, error: error.message });
          throw error;
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
              refreshToken: null, // AWS Amplify v6 manages refresh token internally
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
            
            // Debug: Log
            console.log('=== DEBUG CHECK AUTH ===');
            console.log('User Attributes:', userAttributes);
            console.log('ID Token Payload:', tokens.idToken?.payload);
            
            // Lấy role từ ID Token hoặc attributes
            const idTokenRole = tokens.idToken?.payload['custom:role'];
            const attrRole = userAttributes['custom:role'] || userAttributes['custom:Role'] || userAttributes.role;
            const finalRole = idTokenRole || attrRole;
            
            const roleValue = (finalRole as 'Student' | 'Lecturer' | 'Admin') || 'Student';
            console.log('Final Role:', roleValue);
            console.log('=== END DEBUG ===');
            
            const userData: User = {
              id: currentUser.userId,
              username: currentUser.username,
              email: userAttributes.email || '',
              fullName: userAttributes.name || userAttributes.email || '',
              role: roleValue,
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
              refreshToken: null, // AWS Amplify v6 manages refresh token internally
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
