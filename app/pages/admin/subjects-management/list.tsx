import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

interface Subject {
  id: string
  name: string
  code: string
  credits: number
  description: string
  createdAt: string
}

export default function SubjectsListRoute() {
  const navigate = useNavigate()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchSubjects()
  }, [])

  const fetchSubjects = async () => {
    setLoading(true)
    try {
      // TODO: Fetch subjects from API/Lambda
    } catch (error) {
      console.error('Failed to fetch subjects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (subjectId: string) => {
    if (!confirm('Bạn có chắc muốn xóa môn học này?')) return
    
    try {
      // TODO: Delete subject via API/Lambda
      console.log('Deleting subject:', subjectId)
      fetchSubjects()
    } catch (error) {
      console.error('Failed to delete subject:', error)
    }
  }

  return (
    <div className="subjects-list-container">
      <div className="page-header">
        <h1>Quản lý môn học</h1>
        <button 
          className="btn-primary"
          onClick={() => navigate('/admin/subjects-management/form')}
        >
          Thêm môn học
        </button>
      </div>

      <div className="filters-section">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên, mã môn học..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {loading ? (
        <div className="loading">Đang tải...</div>
      ) : (
        <div className="subjects-table">
          <table>
            <thead>
              <tr>
                <th>Mã môn học</th>
                <th>Tên môn học</th>
                <th>Số tín chỉ</th>
                <th>Mô tả</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject) => (
                <tr key={subject.id}>
                  <td>{subject.code}</td>
                  <td>{subject.name}</td>
                  <td>{subject.credits}</td>
                  <td>{subject.description}</td>
                  <td>
                    <button 
                      onClick={() => navigate(`/admin/subjects-management/form/${subject.id}`)}
                      className="btn-edit"
                    >
                      Sửa
                    </button>
                    <button 
                      onClick={() => handleDelete(subject.id)}
                      className="btn-delete"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {subjects.length === 0 && (
            <div className="no-data">Không có dữ liệu</div>
          )}
        </div>
      )}
    </div>
  )
}
