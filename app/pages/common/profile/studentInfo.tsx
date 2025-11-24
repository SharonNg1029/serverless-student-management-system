import { useEffect, useState } from 'react'

export default function StudentInfo() {
  const [enrolledClasses, setEnrolledClasses] = useState([])
  const [progress, setProgress] = useState(null)
  const [ranking, setRanking] = useState(null)

  useEffect(() => {
    // TODO: Fetch enrolled classes from API/Lambda
    // TODO: Fetch progress data
    // TODO: Fetch personal ranking
  }, [])

  return (
    <div className="student-info">
      <h2>Thông tin sinh viên</h2>
      
      <div className="enrolled-classes">
        <h3>Lớp học đã đăng ký</h3>
        {/* TODO: Display enrolled classes list */}
        <p>Chưa có dữ liệu</p>
      </div>

      <div className="progress-section">
        <h3>Tiến độ học tập</h3>
        {/* TODO: Display progress chart */}
        <p>Chưa có dữ liệu</p>
      </div>

      <div className="ranking-section">
        <h3>Xếp hạng cá nhân</h3>
        {/* TODO: Display personal ranking */}
        <p>Chưa có dữ liệu</p>
      </div>
    </div>
  )
}
