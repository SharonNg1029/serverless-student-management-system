import { useEffect, useState } from 'react'

export default function AdminInfo() {
  const [systemStats, setSystemStats] = useState(null)

  useEffect(() => {
    // TODO: Fetch system-wide statistics from API/Lambda
  }, [])

  return (
    <div className="admin-info">
      <h2>Thông tin quản trị viên</h2>
      
      <div className="system-stats">
        <h3>Thống kê hệ thống</h3>
        {/* TODO: Display system statistics */}
        <div className="stats-grid">
          <div className="stat-card">
            <h4>Tổng người dùng</h4>
            <p>--</p>
          </div>
          <div className="stat-card">
            <h4>Tổng lớp học</h4>
            <p>--</p>
          </div>
          <div className="stat-card">
            <h4>Tổng môn học</h4>
            <p>--</p>
          </div>
        </div>
      </div>

      <div className="recent-activities">
        <h3>Hoạt động gần đây</h3>
        {/* TODO: Display recent activities */}
        <p>Chưa có dữ liệu</p>
      </div>
    </div>
  )
}
