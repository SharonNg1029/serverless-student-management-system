import { useEffect, useState } from 'react'

interface Course {
  id: string
  name: string
  code: string
  subjectName: string
  lecturerName: string
  schedule: string
  capacity: number
  enrolled: number
  isEnrolled: boolean
}

export default function AllCoursesRoute() {
  const [courses, setCourses] = useState<Course[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchAllCourses()
  }, [])

  const fetchAllCourses = async () => {
    setLoading(true)
    try {
      // TODO: Fetch all available courses from API/Lambda
    } catch (error) {
      console.error('Failed to fetch courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEnroll = async (courseId: string) => {
    try {
      // TODO: Enroll via API/Lambda (check capacity)
      console.log('Enrolling in course:', courseId)
      alert('Đăng ký thành công!')
      fetchAllCourses()
    } catch (error) {
      console.error('Failed to enroll:', error)
      alert('Đăng ký thất bại! Lớp có thể đã đầy.')
    }
  }

  const filteredCourses = courses.filter(course => 
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.subjectName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="all-courses-container">
      <div className="page-header">
        <h1>Tất cả khóa học</h1>
      </div>

      <div className="search-section">
        <input
          type="text"
          placeholder="Tìm kiếm khóa học..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {loading ? (
        <div className="loading">Đang tải...</div>
      ) : (
        <div className="courses-grid">
          {filteredCourses.map((course) => (
            <div key={course.id} className="course-card">
              <h3>{course.name}</h3>
              <p className="course-code">{course.code}</p>
              <p className="subject-name">{course.subjectName}</p>
              <p className="lecturer">Giảng viên: {course.lecturerName}</p>
              <p className="schedule">{course.schedule}</p>
              <p className="capacity">
                Sĩ số: {course.enrolled}/{course.capacity}
              </p>
              
              {course.isEnrolled ? (
                <button className="btn-enrolled" disabled>
                  Đã đăng ký
                </button>
              ) : course.enrolled >= course.capacity ? (
                <button className="btn-full" disabled>
                  Đã đầy
                </button>
              ) : (
                <button 
                  onClick={() => handleEnroll(course.id)}
                  className="btn-enroll"
                >
                  Đăng ký
                </button>
              )}
            </div>
          ))}
          
          {filteredCourses.length === 0 && (
            <div className="no-data">Không tìm thấy khóa học</div>
          )}
        </div>
      )}
    </div>
  )
}
