import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

interface Course {
  id: string
  name: string
  code: string
  subjectName: string
  lecturerName: string
  schedule: string
  enrolledAt: string
}

export default function MyCoursesRoute() {
  const navigate = useNavigate()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchMyCourses()
  }, [])

  const fetchMyCourses = async () => {
    setLoading(true)
    try {
      // TODO: Fetch enrolled courses from API/Lambda
    } catch (error) {
      console.error('Failed to fetch courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUnenroll = async (courseId: string) => {
    if (!confirm('Bạn có chắc muốn hủy đăng ký lớp này?')) return
    
    try {
      // TODO: Unenroll via API/Lambda
      console.log('Unenrolling from course:', courseId)
      fetchMyCourses()
    } catch (error) {
      console.error('Failed to unenroll:', error)
    }
  }

  return (
    <div className="my-courses-container">
      <div className="page-header">
        <h1>Lớp học của tôi</h1>
        <button 
          className="btn-primary"
          onClick={() => navigate('/student/all-courses')}
        >
          Đăng ký thêm lớp
        </button>
      </div>

      {loading ? (
        <div className="loading">Đang tải...</div>
      ) : (
        <div className="courses-grid">
          {courses.map((course) => (
            <div key={course.id} className="course-card">
              <h3>{course.name}</h3>
              <p className="course-code">{course.code}</p>
              <p className="subject-name">{course.subjectName}</p>
              <p className="lecturer">Giảng viên: {course.lecturerName}</p>
              <p className="schedule">{course.schedule}</p>
              <p className="enrolled-date">
                Đăng ký: {new Date(course.enrolledAt).toLocaleDateString('vi-VN')}
              </p>
              <div className="card-actions">
                <button 
                  onClick={() => navigate(`/student/course-details/${course.id}`)}
                  className="btn-view"
                >
                  Xem chi tiết
                </button>
                <button 
                  onClick={() => handleUnenroll(course.id)}
                  className="btn-danger"
                >
                  Hủy đăng ký
                </button>
              </div>
            </div>
          ))}
          
          {courses.length === 0 && (
            <div className="no-data">
              <p>Bạn chưa đăng ký lớp học nào</p>
              <button 
                onClick={() => navigate('/student/all-courses')}
                className="btn-primary"
              >
                Đăng ký ngay
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
