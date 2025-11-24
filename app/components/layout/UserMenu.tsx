import { useNavigate } from 'react-router'
import { 
  Avatar, 
  MenuContent, 
  MenuItem, 
  MenuRoot, 
  MenuTrigger,
  MenuSeparator,
  createToaster,
  Toaster
} from '@chakra-ui/react'
import { User, Settings, LogOut } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

const toaster = createToaster({
  placement: 'top-end',
  pauseOnPageIdle: true,
})

export default function UserMenu() {
  const navigate = useNavigate()
  const { user, logoutFromCognito } = useAuthStore()

  const handleLogout = async () => {
    try {
      await logoutFromCognito()
      
      toaster.create({
        title: 'Đăng xuất thành công',
        description: 'Hẹn gặp lại bạn!',
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

  return (
    <>
      <Toaster toaster={toaster}>
        {(toast) => (
          <div>
            <strong>{toast.title}</strong>
            <p>{toast.description}</p>
          </div>
        )}
      </Toaster>
      
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
              gap: '0.5rem',
              borderRadius: '6px',
              transition: 'all 0.3s ease',
              height: '40px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(227, 130, 20, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            >
              <Avatar.Root size="sm">
                <Avatar.Fallback>{(user?.fullName || user?.username || 'U').substring(0, 2).toUpperCase()}</Avatar.Fallback>
                {user?.avatar && <Avatar.Image src={user.avatar} alt={user.fullName} />}
              </Avatar.Root>
              <span style={{ 
                color: '#fff', 
                fontSize: '14px',
                fontWeight: '500',
                whiteSpace: 'nowrap'
              }}>
                {user?.fullName || user?.username}
              </span>
            </button>
          </MenuTrigger>
          
          <MenuContent 
            style={{
              minWidth: '200px',
              padding: '0.5rem',
              backgroundColor: '#fff',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              borderRadius: '8px',
              zIndex: 9999,
              position: 'absolute',
              top: '100%',
              right: '-40px',
              marginTop: '0.5rem'
            }}
          >
            <MenuItem 
              value="profile"
              onClick={() => navigate('/profile')}
              style={{ 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem 1rem',
                borderRadius: '6px'
              }}
            >
              <User size={18} style={{ marginRight: '10px' }} />
              Hồ sơ cá nhân
            </MenuItem>
            
            <MenuItem 
              value="settings"
              onClick={() => navigate('/admin/settings')}
              style={{ 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem 1rem',
                borderRadius: '6px'
              }}
            >
              <Settings size={18} style={{ marginRight: '10px' }} />
              Cài đặt
            </MenuItem>
            
            <MenuSeparator style={{ margin: '0.5rem 0' }} />
            
            <MenuItem 
              value="logout"
              onClick={handleLogout}
              style={{ 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem 1rem',
                borderRadius: '6px',
                color: '#e53e3e'
              }}
            >
              <LogOut size={18} style={{ marginRight: '10px' }} />
              Đăng xuất
            </MenuItem>
          </MenuContent>
        </MenuRoot>
      </div>
    </>
  )
}
