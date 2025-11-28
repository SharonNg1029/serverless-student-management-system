import { useNavigate } from 'react-router'
import { 
  Avatar, 
  MenuContent, 
  MenuItem, 
  MenuRoot, 
  MenuTrigger,
  MenuSeparator
} from '@chakra-ui/react'
import { User, Settings, LogOut } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { toaster } from '../ui/toaster'

export default function UserMenu() {
  const navigate = useNavigate()
  const { user, logoutFromCognito } = useAuthStore()

  const handleLogout = async () => {
    try {
      await logoutFromCognito()
      
      toaster.create({
        title: 'Đăng xuất thành công',
        type: 'success',
        duration: 2000,
      })
      
      // Redirect to login page
      setTimeout(() => {
        navigate('/login', { replace: true })
      }, 500)
    } catch (error: any) {
      toaster.create({
        title: 'Đăng xuất thất bại',
        description: error.message || 'Có lỗi xảy ra',
        type: 'error',
        duration: 3000,
      })
    }
  }

  const handleProfileClick = () => {
    navigate('/profile')
  }

  const handleSettingsClick = () => {
    navigate('/admin/settings')
  }

  return (
    <div style={{ position: 'relative' }}>
      <MenuRoot>
        <MenuTrigger asChild>
            <button style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              padding: '0.25rem 0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              borderRadius: '8px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(241, 245, 249, 0.8)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            >
              <div style={{ 
                textAlign: 'right',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end'
              }} className="hidden sm:block">
                <div style={{ 
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#1e293b',
                  lineHeight: '1.2'
                }}>
                  {user?.fullName || user?.username || 'Admin'}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#64748b',
                  marginTop: '2px'
                }}>
                  {user?.role === 'Admin' ? 'Quản trị viên hệ thống' : user?.role === 'Lecturer' ? 'Giảng viên' : 'Sinh viên'}
                </div>
              </div>
              <Avatar.Root size="sm" style={{ flexShrink: 0 }}>
                <Avatar.Fallback style={{ 
                  backgroundColor: '#dd7323',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}>
                  {(user?.fullName || user?.username || 'A').substring(0, 2).toUpperCase()}
                </Avatar.Fallback>
                {user?.avatar && <Avatar.Image src={user.avatar} alt={user.fullName} />}
              </Avatar.Root>
            </button>
          </MenuTrigger>
          
          <MenuContent 
            style={{
              minWidth: '220px',
              padding: '0.5rem',
              backgroundColor: '#fff',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              zIndex: 9999,
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: '0',
            }}
          >
            <MenuItem 
              value="profile"
              onClick={handleProfileClick}
              style={{ 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                transition: 'background-color 0.2s'
              }}
            >
              <User size={18} style={{ marginRight: '10px', color: '#64748b' }} />
              <span style={{ fontSize: '14px', fontWeight: '500', color: '#334155' }}>Hồ sơ cá nhân</span>
            </MenuItem>
            
            <MenuItem 
              value="settings"
              onClick={handleSettingsClick}
              style={{ 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                transition: 'background-color 0.2s'
              }}
            >
              <Settings size={18} style={{ marginRight: '10px', color: '#64748b' }} />
              <span style={{ fontSize: '14px', fontWeight: '500', color: '#334155' }}>Cài đặt</span>
            </MenuItem>
            
            <MenuSeparator style={{ margin: '0.5rem 0', borderColor: '#e2e8f0' }} />
            
            <MenuItem 
              value="logout"
              onClick={handleLogout}
              style={{ 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                transition: 'background-color 0.2s'
              }}
            >
              <LogOut size={18} style={{ marginRight: '10px', color: '#ef4444' }} />
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#ef4444' }}>Đăng xuất</span>
            </MenuItem>
          </MenuContent>
        </MenuRoot>
      </div>
  )
}
