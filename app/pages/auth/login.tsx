import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useNavigate } from 'react-router'
import { useAuthStore } from '../../store/authStore'
import '../../style/login.css'

export default function LoginRoute() {
  const navigate = useNavigate()
  const { loginWithCognito, setLoading, isLoading } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [localError, setLocalError] = useState<string | null>(null)

  const handleNormalLogin = async (values: { email: string; password: string }) => {
    try {
      setLoading(true);
      setLocalError(null);
      
      // Login với Cognito
      await loginWithCognito(values.email, values.password);
      
      console.log("Login successful with Cognito");
      
      // Redirect về home page sau khi đăng nhập thành công
      navigate("/home", { replace: true });
    } catch (error: any) {
      console.error("Login failed:", error);
      const errorMessage = error.message || "Đăng nhập thất bại. Vui lòng kiểm tra email và mật khẩu.";
      setLocalError(errorMessage);
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

            {/* Google Sign In có thể tích hợp sau với Cognito Federated Identity */}
            {/* <div className="google-signin-wrapper" style={{ marginTop: '16px', display: 'flex', justifyContent: 'center' }}>
              <GoogleSignInButton 
                onSuccess={handleGoogleSuccess}
                onError={() => {
                  setLocalError('Đăng nhập Google thất bại. Vui lòng thử lại.');
                }}
                showOneTap={true}
              />
            </div> */}
          </form>
        </div>
      </div>
    </div>
  )
}
