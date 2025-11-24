import { Link, useLocation } from 'react-router'
import '../../style/footer.css'

export default function Footer() {
  const location = useLocation()

  // Don't show footer on authentication pages
  const hideFooterPaths = ['/login', '/auth/reset-password']
  if (hideFooterPaths.includes(location.pathname)) {
    return null
  }

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>LMS FCJ</h3>
          <p>Hệ thống quản lý học sinh hiện đại và hiệu quả</p>
        </div>

        <div className="footer-section">
          <h4>Liên kết</h4>
          <ul>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/students">Học sinh</Link></li>
            <li><Link to="/courses">Khóa học</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Hỗ trợ</h4>
          <ul>
            <li><a href="#help">Trợ giúp</a></li>
            <li><a href="#contact">Liên hệ</a></li>
            <li><a href="#privacy">Chính sách riêng tư</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Liên hệ</h4>
          <p>Email: support@lms.edu</p>
          <p>Điện thoại: +84 (0) 123 456 789</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 LMS FCJ. Bảo lưu mọi quyền.</p>
      </div>
    </footer>
  )
}
