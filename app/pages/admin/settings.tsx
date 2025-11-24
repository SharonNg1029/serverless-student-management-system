import { useState, useEffect } from 'react'

export default function SettingsRoute() {
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState({
    siteName: 'LMS FCJ',
    emailNotifications: true,
    inAppNotifications: true,
    maintenanceMode: false,
    maxClassCapacity: 40,
    autoApproveEnrollment: false,
    emailTemplates: {
      welcome: '',
      enrollment: '',
      reminder: ''
    }
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      // TODO: Fetch settings from API/Lambda
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      // TODO: Save settings via API/Lambda
      console.log('Saving settings:', settings)
      alert('Lưu cấu hình thành công!')
    } catch (error) {
      console.error('Failed to save settings:', error)
      alert('Lưu cấu hình thất bại!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="settings-container">
      <div className="page-header">
        <h1>Cấu hình hệ thống</h1>
      </div>

      <div className="settings-form">
        <section className="settings-section">
          <h2>Thông tin chung</h2>
          
          <div className="form-group">
            <label htmlFor="siteName">Tên hệ thống</label>
            <input
              id="siteName"
              type="text"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="maxClassCapacity">Sĩ số tối đa mặc định</label>
            <input
              id="maxClassCapacity"
              type="number"
              min="1"
              value={settings.maxClassCapacity}
              onChange={(e) => setSettings({ ...settings, maxClassCapacity: parseInt(e.target.value) })}
            />
          </div>
        </section>

        <section className="settings-section">
          <h2>Thông báo</h2>
          
          <div className="form-group checkbox">
            <input
              id="emailNotifications"
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
            />
            <label htmlFor="emailNotifications">Bật thông báo qua Email (SES)</label>
          </div>

          <div className="form-group checkbox">
            <input
              id="inAppNotifications"
              type="checkbox"
              checked={settings.inAppNotifications}
              onChange={(e) => setSettings({ ...settings, inAppNotifications: e.target.checked })}
            />
            <label htmlFor="inAppNotifications">Bật thông báo trong ứng dụng</label>
          </div>
        </section>

        <section className="settings-section">
          <h2>Đăng ký lớp học</h2>
          
          <div className="form-group checkbox">
            <input
              id="autoApproveEnrollment"
              type="checkbox"
              checked={settings.autoApproveEnrollment}
              onChange={(e) => setSettings({ ...settings, autoApproveEnrollment: e.target.checked })}
            />
            <label htmlFor="autoApproveEnrollment">Tự động phê duyệt đăng ký</label>
          </div>
        </section>

        <section className="settings-section">
          <h2>Mẫu Email</h2>
          
          <div className="form-group">
            <label htmlFor="welcomeEmail">Mẫu email chào mừng</label>
            <textarea
              id="welcomeEmail"
              rows={4}
              value={settings.emailTemplates.welcome}
              onChange={(e) => setSettings({ 
                ...settings, 
                emailTemplates: { ...settings.emailTemplates, welcome: e.target.value }
              })}
              placeholder="Nội dung email chào mừng người dùng mới..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="enrollmentEmail">Mẫu email xác nhận đăng ký</label>
            <textarea
              id="enrollmentEmail"
              rows={4}
              value={settings.emailTemplates.enrollment}
              onChange={(e) => setSettings({ 
                ...settings, 
                emailTemplates: { ...settings.emailTemplates, enrollment: e.target.value }
              })}
              placeholder="Nội dung email xác nhận đăng ký lớp học..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="reminderEmail">Mẫu email nhắc nhở</label>
            <textarea
              id="reminderEmail"
              rows={4}
              value={settings.emailTemplates.reminder}
              onChange={(e) => setSettings({ 
                ...settings, 
                emailTemplates: { ...settings.emailTemplates, reminder: e.target.value }
              })}
              placeholder="Nội dung email nhắc nhở deadline..."
            />
          </div>
        </section>

        <section className="settings-section">
          <h2>Bảo trì</h2>
          
          <div className="form-group checkbox">
            <input
              id="maintenanceMode"
              type="checkbox"
              checked={settings.maintenanceMode}
              onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
            />
            <label htmlFor="maintenanceMode">Chế độ bảo trì</label>
          </div>
        </section>

        <div className="form-actions">
          <button 
            onClick={handleSave}
            className="btn-submit"
            disabled={loading}
          >
            {loading ? 'Đang lưu...' : 'Lưu cấu hình'}
          </button>
        </div>
      </div>
    </div>
  )
}
