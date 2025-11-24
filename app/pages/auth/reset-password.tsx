import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuthStore } from '../../store/authStore'
import '../../style/login.css'

export default function ResetPasswordRoute() {
  const navigate = useNavigate()
  const { setLoading, isLoading } = useAuthStore()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [step, setStep] = useState<'request' | 'confirm'>('request')
  const [localError, setLocalError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      setLocalError(null)
      
      // TODO: Implement Cognito forgot password request
      // await Auth.forgotPassword(email)
      
      setSuccessMessage('Mã xác nhận đã được gửi đến email của bạn!')
      setStep('confirm')
    } catch (error: any) {
      console.error("Reset password request failed:", error)
      setLocalError(error.message || "Không thể gửi mã xác nhận. Vui lòng thử lại.")
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      setLocalError(null)
      
      // TODO: Implement Cognito forgot password confirm
      // await Auth.forgotPasswordSubmit(email, code, newPassword)
      
      setSuccessMessage('Đặt lại mật khẩu thành công! Đang chuyển đến trang đăng nhập...')
      setTimeout(() => {
        navigate('/auth/login')
      }, 2000)
    } catch (error: any) {
      console.error("Reset password confirmation failed:", error)
      setLocalError(error.message || "Không thể đặt lại mật khẩu. Vui lòng kiểm tra mã xác nhận.")
    } finally {
      setLoading(false)
    }
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
          {step === 'request' ? (
            <form onSubmit={handleRequestReset} className="login-form">
              <h2>Quên mật khẩu?</h2>
              <p className="form-subtitle">Nhập email của bạn để nhận mã xác nhận</p>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
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

              {successMessage && (
                <div className="success-message" style={{ 
                  color: '#10b981', 
                  fontSize: '14px', 
                  marginBottom: '12px',
                  padding: '8px',
                  backgroundColor: '#d1fae5',
                  borderRadius: '4px'
                }}>
                  {successMessage}
                </div>
              )}

              <button 
                type="submit" 
                className="btn-submit"
                disabled={isLoading}
              >
                {isLoading ? 'Đang gửi...' : 'Gửi mã xác nhận'}
              </button>

              <button 
                type="button"
                className="btn-back"
                onClick={() => navigate('/auth/login')}
              >
                Quay lại đăng nhập
              </button>
            </form>
          ) : (
            <form onSubmit={handleConfirmReset} className="login-form">
              <h2>Đặt lại mật khẩu</h2>
              <p className="form-subtitle">Nhập mã xác nhận và mật khẩu mới</p>

              <div className="form-group">
                <label htmlFor="code">Mã xác nhận</label>
                <input
                  id="code"
                  type="text"
                  placeholder="Nhập mã từ email"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">Mật khẩu mới</label>
                <input
                  id="newPassword"
                  type="password"
                  placeholder="••••••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <small style={{ color: '#6b7280', fontSize: '12px' }}>
                  Mật khẩu phải có ít nhất 8 ký tự
                </small>
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

              {successMessage && (
                <div className="success-message" style={{ 
                  color: '#10b981', 
                  fontSize: '14px', 
                  marginBottom: '12px',
                  padding: '8px',
                  backgroundColor: '#d1fae5',
                  borderRadius: '4px'
                }}>
                  {successMessage}
                </div>
              )}

              <button 
                type="submit" 
                className="btn-submit"
                disabled={isLoading}
              >
                {isLoading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
              </button>

              <button 
                type="button"
                className="btn-back"
                onClick={() => setStep('request')}
              >
                Gửi lại mã
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
