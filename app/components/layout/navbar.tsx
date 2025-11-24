import { Link, useLocation } from 'react-router'
import { useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import ChatSidebar from '../chat/ChatSidebar'
import NotificationBell from '../notifications/NotificationBell'
import '../../style/navbar.css'

export default function Navbar() {
  const location = useLocation()
  const { user } = useAuthStore()
  const [isChatOpen, setIsChatOpen] = useState(false)

  // Don't show navbar on authentication pages
  const hideNavbarPaths = ['/login', '/auth/reset-password']
  if (hideNavbarPaths.includes(location.pathname)) {
    return null
  }

  // Role-based navigation items
  const getNavItems = () => {
    if (!user) return []

    switch (user.role) {
      case 'Admin':
        return [
          { label: 'Dashboard', href: '/admin/dashboard' },
          { label: 'Người dùng', href: '/admin/users-management/list' },
          { label: 'Môn học', href: '/admin/subjects-management/list' },
          { label: 'Lớp học', href: '/admin/classes-management/list' },
          { label: 'Cấu hình', href: '/admin/settings' },
          { label: 'Nhật ký', href: '/admin/audit-logs' },
        ]
      
      case 'Lecturer':
        return [
          { label: 'Lớp học', href: '/lecturer/classes-management/list' },
          { label: 'Bài tập', href: '/lecturer/assignments-management/list' },
          { label: 'Sinh viên', href: '/lecturer/students-management/list' },
          { label: 'Xếp hạng', href: '/lecturer/ranking-analyst' },
          { label: 'Báo cáo', href: '/lecturer/reports' },
        ]
      
      case 'Student':
        return [
          { label: 'Dashboard', href: '/student/dashboard' },
          { label: 'Lớp của tôi', href: '/student/my-courses' },
          { label: 'Tất cả khóa học', href: '/student/all-courses' },
          { label: 'Xếp hạng', href: '/student/ranking' },
        ]
      
      default:
        return []
    }
  }

  const navItems = getNavItems()

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/home" className="navbar-logo">
            <img src="/Logo_AWS_FCJ.png" alt="LMS FCJ" style={{ height: '40px' }} />
          </Link>
          
          <div className="navbar-menu">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`navbar-item ${location.pathname === item.href ? 'active' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="navbar-actions">
            {/* Chat icon */}
            <button 
              className="navbar-icon-btn"
              onClick={() => setIsChatOpen(!isChatOpen)}
              title="Chat"
            >
              💬
            </button>

            {/* Notification bell */}
            <NotificationBell />

            {/* Profile link */}
            <Link to="/profile" className="navbar-profile">
              {user?.fullName || user?.username}
            </Link>
          </div>
        </div>
      </nav>

      {/* Chat Sidebar */}
      <ChatSidebar 
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </>
  )
}

