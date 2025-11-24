import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

interface Class {
  id: string
  name: string
  code: string
  subjectId: string
  subjectName: string
  lecturerId: string
  lecturerName: string
  capacity: number
  enrolled: number
  schedule: string
  createdAt: string
}

export default function ClassesListRoute() {
  const navigate = useNavigate()
  const [classes, setClasses] = useState<Class[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchClasses()
  }, [])

  const fetchClasses = async () => {
    setLoading(true)
    try {
      // TODO: Fetch classes from API/Lambda
    } catch (error) {
      console.error('Failed to fetch classes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (classId: string) => {
    if (!confirm('Bạn có chắc muốn xóa lớp học này?')) return
    
    try {
      // TODO: Delete class via API/Lambda
      console.log('Deleting class:', classId)
      fetchClasses()
    } catch (error) {
      console.error('Failed to delete class:', error)
    }
  }

  return (
    <div className="classes-list-container">
      <div className="page-header">
        <h1>Quản lý lớp học</h1>
        <button 
          className="btn-primary"
          onClick={() => navigate('/admin/classes-management/form')}
        >
          Thêm lớp học
        </button>
      </div>

      <div className="filters-section">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên, mã lớp..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {loading ? (
        <div className="loading">Đang tải...</div>
      ) : (
        <div className="classes-table">
          <table>
            <thead>
              <tr>
                <th>Mã lớp</th>
                <th>Tên lớp</th>
                <th>Môn học</th>
                <th>Giảng viên</th>
                <th>Sĩ số</th>
                <th>Lịch học</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((cls) => (
                <tr key={cls.id}>
                  <td>{cls.code}</td>
                  <td>{cls.name}</td>
                  <td>{cls.subjectName}</td>
                  <td>{cls.lecturerName}</td>
                  <td>{cls.enrolled}/{cls.capacity}</td>
                  <td>{cls.schedule}</td>
                  <td>
                    <button 
                      onClick={() => navigate(`/admin/classes-management/form/${cls.id}`)}
                      className="btn-edit"
                    >
                      Sửa
                    </button>
                    <button 
                      onClick={() => handleDelete(cls.id)}
                      className="btn-delete"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {classes.length === 0 && (
            <div className="no-data">Không có dữ liệu</div>
          )}
        </div>
      )}
    </div>
  )
}
