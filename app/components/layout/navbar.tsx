import { Link, useLocation } from 'react-router'
import { useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import ChatSidebar from '../chat/ChatSidebar'
import NotificationBell from '../notifications/NotificationBell'
import UserMenu from './UserMenu'
import '../../style/navbar.css'

export default function Navbar() {
  const location = useLocation()
  const { user } = useAuthStore()
  const [isChatOpen, setIsChatOpen] = useState(false)

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
    <div className="navbar-wrapper">
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

          <div className="navbar-actions" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            {/* Chat icon */}
            <button 
              onClick={() => setIsChatOpen(!isChatOpen)}
              title="Chat"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.5rem',
                borderRadius: '6px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(227, 130, 20, 0.1)';
                e.currentTarget.style.color = '#e38214';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#fff';
              }}
            >
              <MessageCircle size={20} />
            </button>

            {/* Notification bell */}
            <NotificationBell />

            {/* User Menu with Avatar and Dropdown */}
            <UserMenu />
          </div>
        </div>
      </nav>

      {/* Chat Sidebar */}
      <ChatSidebar 
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  )
}

