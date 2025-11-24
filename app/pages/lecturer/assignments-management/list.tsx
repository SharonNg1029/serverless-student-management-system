import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

interface Assignment {
  id: string
  title: string
  classId: string
  className: string
  dueDate: string
  totalSubmissions: number
  gradedSubmissions: number
}

export default function AssignmentsListRoute() {
  const navigate = useNavigate()
  const { classId } = useParams()
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [selectedClass, setSelectedClass] = useState(classId || 'all')
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchMyClasses()
  }, [])

  useEffect(() => {
    fetchAssignments()
  }, [selectedClass])

  const fetchMyClasses = async () => {
    try {
      // TODO: Fetch classes assigned to lecturer
    } catch (error) {
      console.error('Failed to fetch classes:', error)
    }
  }

  const fetchAssignments = async () => {
    setLoading(true)
    try {
      // TODO: Fetch assignments from API/Lambda (filter by class if selected)
    } catch (error) {
      console.error('Failed to fetch assignments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (assignmentId: string) => {
    if (!confirm('Bạn có chắc muốn xóa bài tập này?')) return
    
    try {
      // TODO: Delete assignment via API/Lambda + S3 (delete files)
      console.log('Deleting assignment:', assignmentId)
      fetchAssignments()
    } catch (error) {
      console.error('Failed to delete assignment:', error)
    }
  }

  return (
    <div className="assignments-list-container">
      <div className="page-header">
        <h1>Quản lý bài tập</h1>
        <button 
          className="btn-primary"
          onClick={() => navigate('/lecturer/assignments-management/form')}
        >
          Tạo bài tập
        </button>
      </div>

      <div className="filters-section">
        <label>Lọc theo lớp:</label>
        <select 
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          <option value="all">Tất cả lớp</option>
          {classes.map((cls: any) => (
            <option key={cls.id} value={cls.id}>
              {cls.name} ({cls.code})
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="loading">Đang tải...</div>
      ) : (
        <div className="assignments-table">
          <table>
            <thead>
              <tr>
                <th>Tiêu đề</th>
                <th>Lớp học</th>
                <th>Hạn nộp</th>
                <th>Bài nộp</th>
                <th>Đã chấm</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((assignment) => (
                <tr key={assignment.id}>
                  <td>{assignment.title}</td>
                  <td>{assignment.className}</td>
                  <td>{new Date(assignment.dueDate).toLocaleDateString('vi-VN')}</td>
                  <td>{assignment.totalSubmissions}</td>
                  <td>{assignment.gradedSubmissions}</td>
                  <td>
                    <button 
                      onClick={() => navigate(`/lecturer/assignments-management/grade/${assignment.id}`)}
                      className="btn-grade"
                    >
                      Chấm điểm
                    </button>
                    <button 
                      onClick={() => navigate(`/lecturer/assignments-management/form/${assignment.id}`)}
                      className="btn-edit"
                    >
                      Sửa
                    </button>
                    <button 
                      onClick={() => handleDelete(assignment.id)}
                      className="btn-delete"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {assignments.length === 0 && (
            <div className="no-data">Chưa có bài tập nào</div>
          )}
        </div>
      )}
    </div>
  )
}
