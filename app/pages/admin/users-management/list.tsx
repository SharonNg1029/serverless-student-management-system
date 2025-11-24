import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

interface User {
  id: string
  email: string
  fullName: string
  role: string
  createdAt: string
}

export default function UsersListRoute() {
  const navigate = useNavigate()
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [filterRole])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      // TODO: Fetch users from API/Lambda
      // const response = await fetch('/api/admin/users')
      // setUsers(response.data)
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    // TODO: Implement search logic
  }

  const handleDelete = async (userId: string) => {
    if (!confirm('Bạn có chắc muốn xóa người dùng này?')) return
    
    try {
      // TODO: Delete user via API/Lambda
      console.log('Deleting user:', userId)
      fetchUsers()
    } catch (error) {
      console.error('Failed to delete user:', error)
    }
  }

  const handleAssignLecturer = async (userId: string) => {
    // TODO: Implement assign lecturer logic
    console.log('Assign lecturer to user:', userId)
  }

  return (
    <div className="users-list-container">
      <div className="page-header">
        <h1>Quản lý người dùng</h1>
        <button 
          className="btn-primary"
          onClick={() => navigate('/admin/users-management/create')}
        >
          Thêm người dùng
        </button>
      </div>

      <div className="filters-section">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên, email..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="search-input"
        />
        
        <select 
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="filter-select"
        >
          <option value="all">Tất cả vai trò</option>
          <option value="Student">Sinh viên</option>
          <option value="Lecturer">Giảng viên</option>
          <option value="Admin">Quản trị viên</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">Đang tải...</div>
      ) : (
        <div className="users-table">
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Họ tên</th>
                <th>Vai trò</th>
                <th>Ngày tạo</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.email}</td>
                  <td>{user.fullName}</td>
                  <td>{user.role}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <button 
                      onClick={() => navigate(`/admin/users-management/edit/${user.id}`)}
                      className="btn-edit"
                    >
                      Sửa
                    </button>
                    <button 
                      onClick={() => handleDelete(user.id)}
                      className="btn-delete"
                    >
                      Xóa
                    </button>
                    {user.role === 'Lecturer' && (
                      <button 
                        onClick={() => handleAssignLecturer(user.id)}
                        className="btn-assign"
                      >
                        Phân công
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {users.length === 0 && (
            <div className="no-data">Không có dữ liệu</div>
          )}
        </div>
      )}
    </div>
  )
}
