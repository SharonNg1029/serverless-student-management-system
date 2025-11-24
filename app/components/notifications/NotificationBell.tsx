import { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'

interface Notification {
  id: string
  title: string
  message: string
  timestamp: string
  read: boolean
  type: 'info' | 'warning' | 'success' | 'error'
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    fetchNotifications()
    // TODO: Setup AppSync subscription for real-time notifications
  }, [])

  useEffect(() => {
    const count = notifications.filter(n => !n.read).length
    setUnreadCount(count)
  }, [notifications])

  const fetchNotifications = async () => {
    try {
      // TODO: Fetch notifications from AppSync/Lambda
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      // TODO: Mark notification as read via API
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      ))
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      // TODO: Mark all notifications as read via API
      setNotifications(notifications.map(n => ({ ...n, read: true })))
    } catch (error) {
      console.error('Failed to mark all as read:', error)
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
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
          transition: 'all 0.3s ease',
          position: 'relative'
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
        <Bell size={20} />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '2px',
            right: '2px',
            backgroundColor: '#e53e3e',
            color: '#fff',
            borderRadius: '50%',
            width: '18px',
            height: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            fontWeight: 'bold'
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          marginTop: '0.5rem',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          minWidth: '320px',
          maxWidth: '400px',
          zIndex: 9999,
          maxHeight: '400px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            padding: '1rem',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Thông báo</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#e38214',
                  fontSize: '14px',
                  cursor: 'pointer',
                  padding: '0.25rem 0.5rem'
                }}
              >
                Đánh dấu đã đọc
              </button>
            )}
          </div>

          <div style={{
            overflowY: 'auto',
            maxHeight: '350px'
          }}>
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                style={{
                  padding: '1rem',
                  borderBottom: '1px solid #f0f0f0',
                  cursor: 'pointer',
                  backgroundColor: notification.read ? '#fff' : '#f7fafc',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f0f0f0';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = notification.read ? '#fff' : '#f7fafc';
                }}
              >
                <div style={{ fontWeight: '600', marginBottom: '0.25rem', color: '#2d3748' }}>
                  {notification.title}
                </div>
                <div style={{ fontSize: '14px', color: '#4a5568', marginBottom: '0.5rem' }}>
                  {notification.message}
                </div>
                <div style={{ fontSize: '12px', color: '#a0aec0' }}>
                  {new Date(notification.timestamp).toLocaleString('vi-VN')}
                </div>
              </div>
            ))}
            
            {notifications.length === 0 && (
              <div style={{
                padding: '2rem',
                textAlign: 'center',
                color: '#a0aec0',
                fontSize: '14px'
              }}>
                Không có thông báo mới
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
