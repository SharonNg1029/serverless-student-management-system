import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'

export default function EditUserRoute() {
  const navigate = useNavigate()
  const { userId } = useParams()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    role: 'Student',
    phone: ''
  })

  useEffect(() => {
    if (userId) {
      fetchUser(userId)
    }
  }, [userId])

  const fetchUser = async (id: string) => {
    try {
      // TODO: Fetch user from API/Lambda
      console.log('Fetching user:', id)
      // const user = await fetchUserById(id)
      // setFormData(user)
    } catch (error) {
      console.error('Failed to fetch user:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // TODO: Update user via API/Lambda
      console.log('Updating user:', userId, formData)
      
      alert('Cập nhật người dùng thành công!')
      navigate('/admin/users-management/list')
    } catch (error) {
      console.error('Failed to update user:', error)
      alert('Cập nhật người dùng thất bại!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="edit-user-container">
      <div className="page-header">
        <h1>Chỉnh sửa người dùng</h1>
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
            disabled
          />
          <small>Email không thể thay đổi</small>
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
            {loading ? 'Đang cập nhật...' : 'Cập nhật'}
          </button>
        </div>
      </form>
    </div>
  )
}
