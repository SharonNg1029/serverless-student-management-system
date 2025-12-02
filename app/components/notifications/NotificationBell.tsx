import { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

interface Notification {
  id: string
  title: string
  message: string
  timestamp: string
  read: boolean
  type: 'info' | 'warning' | 'success' | 'error'
}

interface NotificationBellProps {
  variant?: 'light' | 'dark'
}

export default function NotificationBell({ variant }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const { user } = useAuthStore()

  // Auto-detect variant based on user role if not specified
  const effectiveVariant = variant ?? (user?.role === 'Admin' ? 'light' : 'dark')
  const isDark = effectiveVariant === 'dark'

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
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2.5 rounded-full cursor-pointer transition-colors group ${
          isDark 
            ? 'hover:bg-[rgba(227,130,20,0.1)]' 
            : 'hover:bg-slate-100'
        }`}
      >
        <Bell 
          size={20} 
          className={`transition-colors ${
            isDark 
              ? 'text-white group-hover:text-[#e38214]' 
              : 'text-slate-600 group-hover:text-[#dd7323]'
          }`} 
        />
        {unreadCount > 0 && (
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg min-w-[320px] max-w-[400px] z-[9999] max-h-[400px] overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center">
            <h3 className="m-0 text-base font-semibold">Thông báo</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="bg-transparent border-none text-[#dd7323] text-sm cursor-pointer py-1 px-2 hover:text-[#c46420] transition-colors"
              >
                Đánh dấu đã đọc
              </button>
            )}
          </div>

          <div className="overflow-y-auto max-h-[350px]">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={`p-4 border-b border-slate-100 cursor-pointer transition-colors hover:bg-slate-100 ${
                  notification.read ? 'bg-white' : 'bg-slate-50'
                }`}
              >
                <div className="font-semibold mb-1 text-slate-800">
                  {notification.title}
                </div>
                <div className="text-sm text-slate-600 mb-2">
                  {notification.message}
                </div>
                <div className="text-xs text-slate-400">
                  {new Date(notification.timestamp).toLocaleString('vi-VN')}
                </div>
              </div>
            ))}
            
            {notifications.length === 0 && (
              <div className="p-8 text-center text-slate-400 text-sm">
                Không có thông báo mới
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
