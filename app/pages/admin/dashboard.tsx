import { useEffect, useState } from 'react'
import { useAuthStore } from '../../store/authStore'

export default function AdminDashboardRoute() {
  const { user } = useAuthStore()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalLecturers: 0,
    totalClasses: 0,
    totalSubjects: 0,
    activeUsers: 0
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    setLoading(true)
    try {
      // TODO: Fetch dashboard statistics from API/Lambda
      // const response = await fetch('/api/admin/dashboard')
      // setStats(response.data)
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-dashboard-container">
      <div className="page-header">
        <h1>Dashboard Quản trị</h1>
        <p>Chào mừng, {user?.fullName}</p>
      </div>

      {loading ? (
        <div className="loading">Đang tải...</div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Tổng người dùng</h3>
              <p className="stat-number">{stats.totalUsers}</p>
            </div>
            <div className="stat-card">
              <h3>Sinh viên</h3>
              <p className="stat-number">{stats.totalStudents}</p>
            </div>
            <div className="stat-card">
              <h3>Giảng viên</h3>
              <p className="stat-number">{stats.totalLecturers}</p>
            </div>
            <div className="stat-card">
              <h3>Lớp học</h3>
              <p className="stat-number">{stats.totalClasses}</p>
            </div>
            <div className="stat-card">
              <h3>Môn học</h3>
              <p className="stat-number">{stats.totalSubjects}</p>
            </div>
            <div className="stat-card">
              <h3>Người dùng hoạt động</h3>
              <p className="stat-number">{stats.activeUsers}</p>
            </div>
          </div>

          <div className="charts-section">
            <div className="chart-card">
              <h3>Thống kê người dùng theo thời gian</h3>
              {/* TODO: Add Chart.js chart for user growth */}
              <div className="chart-placeholder">Biểu đồ thống kê</div>
            </div>

            <div className="chart-card">
              <h3>Hoạt động hệ thống</h3>
              {/* TODO: Add Chart.js chart for system activity */}
              <div className="chart-placeholder">Biểu đồ hoạt động</div>
            </div>
          </div>

          <div className="recent-activities">
            <h3>Hoạt động gần đây</h3>
            {/* TODO: Display recent activities from activity_logs */}
            <div className="activities-list">
              <p>Chưa có dữ liệu</p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
