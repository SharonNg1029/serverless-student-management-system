import { useAuthStore } from '../../../store/authStore'
import StudentInfo from './studentInfo'
import LecturerInfo from './lecturerInfo'
import AdminInfo from './adminInfo'

export default function ProfileRoute() {
  const { user } = useAuthStore()

  // Main profile page - conditional render based on role
  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Thông tin cá nhân</h1>
        <div className="profile-avatar">
          {/* TODO: Display avatar from S3 */}
          <img 
            src={user?.avatar || '/default-avatar.png'} 
            alt="Avatar" 
            className="avatar-img"
          />
          <button className="btn-upload-avatar">Đổi ảnh đại diện</button>
        </div>
      </div>

      <div className="profile-basic-info">
        <h2>Thông tin chung</h2>
        <div className="info-group">
          <label>Email:</label>
          <input type="email" value={user?.email || ''} readOnly />
        </div>
        <div className="info-group">
          <label>Họ tên:</label>
          <input type="text" value={user?.fullName || ''} />
        </div>
        {/* TODO: Add preferences, notifications settings via Lambda/S3 */}
      </div>

      {/* Role-specific info */}
      {user?.role === 'Student' && <StudentInfo />}
      {user?.role === 'Lecturer' && <LecturerInfo />}
      {user?.role === 'Admin' && <AdminInfo />}
    </div>
  )
}
