import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useNavigate } from 'react-router'
import { useAuthStore } from '../../store/authStore'
import { toaster } from '../../components/ui/toaster'
import GoogleSignInButton from '../../components/common/GoogleSignInButton'
import '../../style/login.css'

export default function LoginRoute() {
  const navigate = useNavigate()
  const { loginWithCognito, loginWithGoogle, confirmNewPassword, setLoading, isLoading } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [newPasswordData, setNewPasswordData] = useState({ newPassword: '', confirmPassword: '' })
  const [localError, setLocalError] = useState<string | null>(null)
  const [requireNewPassword, setRequireNewPassword] = useState(false)

  const getRedirectPathByRole = (role: string): string => {
    switch (role) {
      case 'Admin':
        return '/admin/dashboard';
      case 'Lecturer':
        return '/lecturer/classes-management/list';
      case 'Student':
        return '/home';
      default:
        return '/home';
    }
  };

  const handleNormalLogin = async (values: { email: string; password: string }) => {
    try {
      setLoading(true);
      setLocalError(null);
      // Login với Cognito
      const result = await loginWithCognito(values.email, values.password);
      // Kiểm tra nếu cần đổi mật khẩu
      if (result?.requireNewPassword) {
        setRequireNewPassword(true);
        setLoading(false);
        toaster.create({
          title: 'Yêu cầu đổi mật khẩu',
          description: 'Bạn cần đổi mật khẩu để tiếp tục.',
          type: 'warning',
          duration: 4000,
          meta: { closable: true },
        });
        return;
      }
      // Đợi 100ms để Zustand persist lưu vào localStorage
      await new Promise(resolve => setTimeout(resolve, 100));    
      toaster.create({
        title: 'Đăng nhập thành công',
        type: 'success',
        duration: 3000,
        meta: { closable: true },
      });
      // Lấy thông tin user từ store để xác định role
      const { user } = useAuthStore.getState();
      const redirectPath = user?.role ? getRedirectPathByRole(user.role) : '/home';
      // Redirect dựa trên role
      navigate(redirectPath, { replace: true });
    } catch (error: any) {
      const errorMessage = error.message || "Đăng nhập thất bại. Vui lòng kiểm tra email và mật khẩu.";
      setLocalError(errorMessage);
      toaster.create({
        title: 'Đăng nhập thất bại',
        description: errorMessage,
        type: 'error',
        duration: 5000,
        meta: { closable: true },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNewPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPasswordData.newPassword !== newPasswordData.confirmPassword) {
      setLocalError('Mật khẩu xác nhận không khớp!');
      toaster.create({
        title: 'Lỗi xác nhận mật khẩu',
        description: 'Mật khẩu xác nhận không khớp!',
        type: 'error',
        duration: 4000,
        meta: { closable: true },
      });
      return;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!passwordRegex.test(newPasswordData.newPassword)) {
      const msg = 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và ký tự đặc biệt!';
      setLocalError(msg);
      toaster.create({
        title: 'Mật khẩu không đủ mạnh',
        description: msg,
        type: 'warning',
        duration: 4000,
        meta: { closable: true },
      });
      return;
    }
    try {
      setLoading(true);
      setLocalError(null);
      // Xác nhận mật khẩu mới
      await confirmNewPassword(newPasswordData.newPassword);
      // Đợi 100ms để Zustand persist lưu vào localStorage
      await new Promise(resolve => setTimeout(resolve, 100));
      // Lấy thông tin user từ store để xác định role
      const { user } = useAuthStore.getState();
      const redirectPath = user?.role ? getRedirectPathByRole(user.role) : '/home';
      toaster.create({
        title: 'Đổi mật khẩu thành công',
        description: 'Mật khẩu của bạn đã được cập nhật!',
        type: 'success',
        duration: 3000,
        meta: { closable: true },
      });
      // Redirect dựa trên role sau khi đổi mật khẩu thành công
      navigate(redirectPath, { replace: true });
    } catch (error: any) {
      const errorMessage = error.message || "Đổi mật khẩu thất bại. Vui lòng thử lại.";
      setLocalError(errorMessage);
      toaster.create({
        title: 'Đổi mật khẩu thất bại',
        description: errorMessage,
        type: 'error',
        duration: 5000,
        meta: { closable: true },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleNormalLogin(formData);
  }

  const handleForgotPassword = () => {
    navigate('/auth/reset-password')
  }

  const handleGoogleSuccess = async (credential: string) => {
    try {
      setLocalError(null);
      
      // Gọi loginWithGoogle từ authStore
      await loginWithGoogle(credential);
      
      // Lấy thông tin user từ store sau khi login
      const { user } = useAuthStore.getState();
      
      toaster.create({
        title: 'Đăng nhập Google thành công',
        description: `Xin chào, ${user?.fullName}!`,
        type: 'success',
        duration: 3000,
      });

      // Redirect dựa trên role
      const redirectPath = user?.role ? getRedirectPathByRole(user.role) : '/home';
      
      // Đợi một chút để toast hiển thị
      await new Promise(resolve => setTimeout(resolve, 500));
      navigate(redirectPath, { replace: true });
    } catch (error: any) {
      console.error('Google login error:', error);
      setLocalError(error.message || 'Đăng nhập Google thất bại');
      toaster.create({
        title: 'Đăng nhập Google thất bại',
        description: error.message || 'Có lỗi xảy ra khi đăng nhập',
        type: 'error',
        duration: 5000,
      });
    }
  };

  const handleGoogleError = () => {
    toaster.create({
      title: 'Đăng nhập Google thất bại',
      description: 'Không thể kết nối với Google',
      type: 'error',
      duration: 5000,
    });
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-header">
          <div className="login-brand">
          <img 
            src="/Logo_AWS_FCJ.png" 
            alt="LMS FCJ Logo" 
            className="login-logo"
          />
        </div>
      </div>

        <div className="login-body">
          {!requireNewPassword ? (
            <form onSubmit={handleSubmit} className="login-form">
              <h2>Đăng nhập</h2>
              <p className="form-subtitle">Đăng nhập vào tài khoản của bạn</p>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Mật khẩu</label>
                <div className="password-input">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="form-options">
                <button 
                  type="button" 
                  className="forgot-password"
                  onClick={handleForgotPassword}
                >
                  Quên mật khẩu?
                </button>
              </div>

              {localError && (
                <div className="error-message" style={{ 
                  color: '#ef4444', 
                  fontSize: '14px', 
                  marginBottom: '12px',
                  padding: '8px',
                  backgroundColor: '#fee2e2',
                  borderRadius: '4px'
                }}>
                  {localError}
                </div>
              )}

              <button 
                type="submit" 
                className="btn-submit"
                disabled={isLoading}
              >
                {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </button>

              <div className="divider">
                <span>Hoặc</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
                <GoogleSignInButton 
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                />
              </div>
            </form>
          ) : (
            <form onSubmit={handleNewPasswordSubmit} className="login-form">
              <h2>Đổi mật khẩu</h2>
              <p className="form-subtitle">Bạn cần đổi mật khẩu để tiếp tục</p>

              <div className="form-group">
                <label htmlFor="newPassword">Mật khẩu mới</label>
                <div className="password-input">
                  <input
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="Mật khẩu mới (8+ ký tự, hoa, thường, đặc biệt)"
                    value={newPasswordData.newPassword}
                    onChange={(e) => setNewPasswordData({ ...newPasswordData, newPassword: e.target.value })}
                    autoComplete="new-password"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                <div className="password-input">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Nhập lại mật khẩu mới"
                    value={newPasswordData.confirmPassword}
                    onChange={(e) => setNewPasswordData({ ...newPasswordData, confirmPassword: e.target.value })}
                    autoComplete="new-password"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {localError && (
                <div className="error-message" style={{ 
                  color: '#ef4444', 
                  fontSize: '14px', 
                  marginBottom: '12px',
                  padding: '8px',
                  backgroundColor: '#fee2e2',
                  borderRadius: '4px'
                }}>
                  {localError}
                </div>
              )}

              <button 
                type="submit" 
                className="btn-submit"
                disabled={isLoading}
              >
                {isLoading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
              </button>

              <button 
                type="button" 
                className="forgot-password"
                onClick={() => {
                  setRequireNewPassword(false);
                  setLocalError(null);
                  setNewPasswordData({ newPassword: '', confirmPassword: '' });
                }}
                style={{ marginTop: '12px', width: '100%', textAlign: 'center' }}
              >
                Quay lại đăng nhập
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
