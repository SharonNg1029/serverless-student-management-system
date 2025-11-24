import { useState } from 'react'
import { useNavigate } from 'react-router'

export default function CreateUserRoute() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    password: '',
    role: 'Student',
    phone: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // TODO: Create user via API/Lambda + Cognito
      console.log('Creating user:', formData)
      
      alert('Tạo người dùng thành công!')
      navigate('/admin/users-management/list')
    } catch (error) {
      console.error('Failed to create user:', error)
      alert('Tạo người dùng thất bại!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="create-user-container">
      <div className="page-header">
        <h1>Thêm người dùng mới</h1>
      </div>

      <form onSubmit={handleSubmit} className="user-form">
        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="fullName">Họ tên *</label>
          <input
            id="fullName"
            type="text"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Mật khẩu *</label>
          <input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            minLength={8}
          />
          <small>Mật khẩu phải có ít nhất 8 ký tự</small>
        </div>

        <div className="form-group">
          <label htmlFor="role">Vai trò *</label>
          <select
            id="role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            required
          >
            <option value="Student">Sinh viên</option>
            <option value="Lecturer">Giảng viên</option>
            <option value="Admin">Quản trị viên</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="phone">Số điện thoại</label>
          <input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => navigate('/admin/users-management/list')}
            className="btn-cancel"
          >
            Hủy
          </button>
          <button 
            type="submit" 
            className="btn-submit"
            disabled={loading}
          >
            {loading ? 'Đang tạo...' : 'Tạo người dùng'}
          </button>
        </div>
      </form>
    </div>
  )
}
