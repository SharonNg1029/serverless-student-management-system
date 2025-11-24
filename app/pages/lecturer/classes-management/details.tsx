import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'

interface Student {
  id: string
  email: string
  fullName: string
  enrolledAt: string
}

export default function ClassDetailsRoute() {
  const navigate = useNavigate()
  const { classId } = useParams()
  const [classInfo, setClassInfo] = useState<any>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [ranking, setRanking] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (classId) {
      fetchClassDetails()
      fetchStudents()
      fetchRanking()
    }
  }, [classId])

  const fetchClassDetails = async () => {
    try {
      // TODO: Fetch class details from API/Lambda
    } catch (error) {
      console.error('Failed to fetch class details:', error)
    }
  }

  const fetchStudents = async () => {
    try {
      // TODO: Fetch students enrolled in this class
    } catch (error) {
      console.error('Failed to fetch students:', error)
    }
  }

  const fetchRanking = async () => {
    try {
      // TODO: Fetch class ranking from Personalize
    } catch (error) {
      console.error('Failed to fetch ranking:', error)
    }
  }

  const sendNotification = () => {
    navigate(`/lecturer/notifications-send?classId=${classId}`)
  }

  return (
    <div className="class-details-container">
      <div className="page-header">
        <h1>{classInfo?.name || 'Chi tiết lớp học'}</h1>
        <button onClick={sendNotification} className="btn-notification">
          Gửi thông báo
        </button>
      </div>

      {classInfo && (
        <div className="class-info-section">
          <h2>Thông tin lớp học</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Mã lớp:</label>
              <span>{classInfo.code}</span>
            </div>
            <div className="info-item">
              <label>Môn học:</label>
              <span>{classInfo.subjectName}</span>
            </div>
            <div className="info-item">
              <label>Sĩ số:</label>
              <span>{classInfo.enrolled}/{classInfo.capacity}</span>
            </div>
            <div className="info-item">
              <label>Lịch học:</label>
              <span>{classInfo.schedule}</span>
            </div>
          </div>
        </div>
      )}

      <div className="students-section">
        <h2>Danh sách sinh viên</h2>
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Họ tên</th>
              <th>Ngày đăng ký</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.email}</td>
                <td>{student.fullName}</td>
                <td>{new Date(student.enrolledAt).toLocaleDateString('vi-VN')}</td>
                <td>
                  <button 
                    onClick={() => navigate(`/lecturer/students-management/edit/${student.id}?classId=${classId}`)}
                    className="btn-edit"
                  >
                    Chỉnh sửa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {students.length === 0 && (
          <div className="no-data">Chưa có sinh viên nào đăng ký</div>
        )}
      </div>

      <div className="ranking-section">
        <h2>Xếp hạng lớp học</h2>
        {/* TODO: Display ranking chart using RankingChart component */}
        <div className="chart-placeholder">Biểu đồ xếp hạng</div>
      </div>
    </div>
  )
}
