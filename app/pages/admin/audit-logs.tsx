import { useEffect, useState } from 'react'

interface ActivityLog {
  id: string
  userId: string
  userName: string
  userRole: string
  action: string
  resource: string
  details: string
  timestamp: string
  ipAddress: string
}

export default function AuditLogsRoute() {
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    userId: '',
    action: 'all',
    resource: 'all',
    startDate: '',
    endDate: ''
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchLogs()
  }, [currentPage, filters])

  const fetchLogs = async () => {
    setLoading(true)
    try {
      // TODO: Fetch activity logs from DynamoDB activity_logs table
      // Query with filters and pagination
      console.log('Fetching logs with filters:', filters, 'page:', currentPage)
    } catch (error) {
      console.error('Failed to fetch logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value })
    setCurrentPage(1) // Reset to first page on filter change
  }

  const exportLogs = () => {
    // TODO: Export logs to CSV
    console.log('Exporting logs...')
  }

  return (
    <div className="audit-logs-container">
      <div className="page-header">
        <h1>Nhật ký hoạt động</h1>
        <button onClick={exportLogs} className="btn-export">
          Xuất CSV
        </button>
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <label>Người dùng:</label>
          <input
            type="text"
            placeholder="User ID hoặc tên..."
            value={filters.userId}
            onChange={(e) => handleFilterChange('userId', e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Hành động:</label>
          <select 
            value={filters.action}
            onChange={(e) => handleFilterChange('action', e.target.value)}
          >
            <option value="all">Tất cả</option>
            <option value="create">Tạo mới</option>
            <option value="update">Cập nhật</option>
            <option value="delete">Xóa</option>
            <option value="enroll">Đăng ký</option>
            <option value="unenroll">Hủy đăng ký</option>
            <option value="login">Đăng nhập</option>
            <option value="logout">Đăng xuất</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Tài nguyên:</label>
          <select 
            value={filters.resource}
            onChange={(e) => handleFilterChange('resource', e.target.value)}
          >
            <option value="all">Tất cả</option>
            <option value="user">Người dùng</option>
            <option value="class">Lớp học</option>
            <option value="subject">Môn học</option>
            <option value="assignment">Bài tập</option>
            <option value="enrollment">Đăng ký</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Từ ngày:</label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Đến ngày:</label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
          />
        </div>

        <button onClick={fetchLogs} className="btn-filter">
          Lọc
        </button>
      </div>

      {loading ? (
        <div className="loading">Đang tải...</div>
      ) : (
        <>
          <div className="logs-table">
            <table>
              <thead>
                <tr>
                  <th>Thời gian</th>
                  <th>Người dùng</th>
                  <th>Vai trò</th>
                  <th>Hành động</th>
                  <th>Tài nguyên</th>
                  <th>Chi tiết</th>
                  <th>IP Address</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td>{new Date(log.timestamp).toLocaleString('vi-VN')}</td>
                    <td>{log.userName}</td>
                    <td>{log.userRole}</td>
                    <td>
                      <span className={`action-badge action-${log.action}`}>
                        {log.action}
                      </span>
                    </td>
                    <td>{log.resource}</td>
                    <td>{log.details}</td>
                    <td>{log.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {logs.length === 0 && (
              <div className="no-data">Không có dữ liệu</div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Trước
              </button>
              <span>Trang {currentPage} / {totalPages}</span>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Sau
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
