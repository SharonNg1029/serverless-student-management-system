import { useEffect, useState } from 'react'
import { useAuthStore } from '../../store/authStore'

export default function StudentDashboardRoute() {
  const { user } = useAuthStore()
  const [stats, setStats] = useState({
    enrolledClasses: 0,
    upcomingAssignments: 0,
    unreadNotifications: 0,
    averageScore: 0
  })
  const [recentActivities, setRecentActivities] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      // TODO: Fetch dashboard data from API/Lambda
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="student-dashboard-container">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Chào mừng, {user?.fullName}</p>
      </div>

      {loading ? (
        <div className="loading">Đang tải...</div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Lớp đã đăng ký</h3>
              <p className="stat-number">{stats.enrolledClasses}</p>
            </div>
            <div className="stat-card">
              <h3>Bài tập sắp tới</h3>
              <p className="stat-number">{stats.upcomingAssignments}</p>
            </div>
            <div className="stat-card">
              <h3>Thông báo mới</h3>
              <p className="stat-number">{stats.unreadNotifications}</p>
            </div>
            <div className="stat-card">
              <h3>Điểm trung bình</h3>
              <p className="stat-number">{stats.averageScore}</p>
            </div>
          </div>

          <div className="recent-section">
            <h3>Hoạt động gần đây</h3>
            <div className="activities-list">
              {recentActivities.length === 0 && (
                <p>Chưa có hoạt động nào</p>
              )}
            </div>
          </div>

          <div className="notifications-section">
            <h3>Thông báo</h3>
            {/* TODO: Display notifications from AppSync/SES */}
            <p>Chưa có thông báo mới</p>
          </div>
        </>
      )}
    </div>
  )
}
