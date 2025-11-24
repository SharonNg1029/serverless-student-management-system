import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

interface Class {
  id: string
  name: string
  code: string
  subjectName: string
  enrolled: number
  capacity: number
  schedule: string
}

export default function LecturerClassesListRoute() {
  const navigate = useNavigate()
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchMyClasses()
  }, [])

  const fetchMyClasses = async () => {
    setLoading(true)
    try {
      // TODO: Fetch classes assigned to current lecturer from API/Lambda
    } catch (error) {
      console.error('Failed to fetch classes:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="lecturer-classes-container">
      <div className="page-header">
        <h1>Lớp học của tôi</h1>
        <button 
          className="btn-primary"
          onClick={() => navigate('/lecturer/classes-management/form')}
        >
          Tạo lớp học
        </button>
      </div>

      {loading ? (
        <div className="loading">Đang tải...</div>
      ) : (
        <div className="classes-grid">
          {classes.map((cls) => (
            <div key={cls.id} className="class-card">
              <h3>{cls.name}</h3>
              <p className="class-code">{cls.code}</p>
              <p className="subject-name">{cls.subjectName}</p>
              <p className="enrollment">{cls.enrolled}/{cls.capacity} sinh viên</p>
              <p className="schedule">{cls.schedule}</p>
              <div className="card-actions">
                <button 
                  onClick={() => navigate(`/lecturer/classes-management/details/${cls.id}`)}
                  className="btn-view"
                >
                  Xem chi tiết
                </button>
                <button 
                  onClick={() => navigate(`/lecturer/classes-management/form/${cls.id}`)}
                  className="btn-edit"
                >
                  Chỉnh sửa
                </button>
              </div>
            </div>
          ))}
          
          {classes.length === 0 && (
            <div className="no-data">Bạn chưa được phân công lớp học nào</div>
          )}
        </div>
      )}
    </div>
  )
}
