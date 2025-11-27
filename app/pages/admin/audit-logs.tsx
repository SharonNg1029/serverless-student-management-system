import React, { useEffect, useState } from 'react';
import { FileDown, Search, X, Loader2, Activity, User, Calendar, Filter, Shield } from 'lucide-react';
import api from '../../utils/axios';
import { toaster } from '../../components/ui/toaster';

// LogDTO from backend
interface LogDTO {
  id: number;
  user_id: number;
  class_id?: number;
  action_type: string;
  details: Record<string, any> | string;
  timestamp: string;
  userName?: string;
  userRole?: string;
  ipAddress?: string;
}

interface ActivityLog {
  id: string;
  userId: number;
  userName: string;
  userRole: string;
  action: string;
  resource: string;
  details: string;
  timestamp: string;
  ipAddress: string;
  classId?: number;
}

export default function AuditLogsRoute() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [userId, setUserId] = useState('');
  const [classId, setClassId] = useState('');
  const [actionType, setActionType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Debounced search
  const [debouncedUserId, setDebouncedUserId] = useState('');
  const [debouncedClassId, setDebouncedClassId] = useState('');

  // Debounce userId
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedUserId(userId);
    }, 500);
    return () => clearTimeout(timer);
  }, [userId]);

  // Debounce classId
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedClassId(classId);
    }, 500);
    return () => clearTimeout(timer);
  }, [classId]);

  // Fetch logs from API
  const fetchLogs = async () => {
    try {
      setLoading(true);
      
      // Build query params
      const params: Record<string, string> = {};
      if (debouncedUserId) params.user_id = debouncedUserId;
      if (debouncedClassId) params.class_id = debouncedClassId;
      if (actionType) params.action_type = actionType;
      
      // Date range handling
      if (startDate && endDate) {
        params.start_date = startDate;
        params.end_date = endDate;
      } else if (startDate) {
        params.timestamp = startDate;
      }
      
      const response = await api.get<{ results: LogDTO[] }>('/admin/audit-logs', { params });
      
      // Transform LogDTO to ActivityLog format
      const transformedLogs: ActivityLog[] = response.data.results.map((dto) => {
        let detailsStr = '';
        let resource = 'system';
        
        // Parse details if it's JSON
        if (typeof dto.details === 'object') {
          detailsStr = JSON.stringify(dto.details, null, 2);
          resource = dto.details.resource || dto.details.type || 'system';
        } else {
          detailsStr = dto.details;
        }
        
        return {
          id: dto.id.toString(),
          userId: dto.user_id,
          userName: dto.userName || `User ${dto.user_id}`,
          userRole: dto.userRole || 'N/A',
          action: dto.action_type,
          resource: resource,
          details: detailsStr,
          timestamp: dto.timestamp,
          ipAddress: dto.ipAddress || 'N/A',
          classId: dto.class_id
        };
      });
      
      setLogs(transformedLogs);
      
    } catch (error: any) {
      console.error('Error fetching audit logs:', error);
      toaster.create({
        title: 'Lỗi tải dữ liệu',
        description: error.response?.data?.message || 'Không thể tải nhật ký hoạt động',
        type: 'error'
      });
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  // Load data when filters change
  useEffect(() => {
    fetchLogs();
  }, [debouncedUserId, debouncedClassId, actionType, startDate, endDate]);

  // Handle clear filters
  const handleClearFilters = () => {
    setUserId('');
    setClassId('');
    setActionType('');
    setStartDate('');
    setEndDate('');
  };

  // Check if any filter is active
  const hasActiveFilters = userId || classId || actionType || startDate || endDate;

  // Export logs to CSV
  const exportLogs = () => {
    try {
      const headers = ['Thời gian', 'User ID', 'Tên người dùng', 'Vai trò', 'Hành động', 'Tài nguyên', 'Chi tiết', 'IP Address'];
      const csvContent = [
        headers.join(','),
        ...logs.map(log => [
          new Date(log.timestamp).toISOString(),
          log.userId,
          log.userName,
          log.userRole,
          log.action,
          log.resource,
          `"${log.details.replace(/"/g, '""')}"`,
          log.ipAddress
        ].join(','))
      ].join('\n');
      
      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      
      toaster.create({
        title: 'Thành công',
        description: 'Đã xuất file CSV thành công!',
        type: 'success'
      });
    } catch (error) {
      toaster.create({
        title: 'Lỗi',
        description: 'Không thể xuất file CSV',
        type: 'error'
      });
    }
  };

  // Get action badge color
  const getActionColor = (action: string) => {
    const actionLower = action.toLowerCase();
    if (actionLower.includes('create') || actionLower.includes('add')) return 'bg-green-50 text-green-700 border-green-200';
    if (actionLower.includes('update') || actionLower.includes('edit')) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (actionLower.includes('delete') || actionLower.includes('remove')) return 'bg-red-50 text-red-700 border-red-200';
    if (actionLower.includes('login')) return 'bg-purple-50 text-purple-700 border-purple-200';
    if (actionLower.includes('logout')) return 'bg-gray-50 text-gray-700 border-gray-200';
    return 'bg-slate-50 text-slate-700 border-slate-200';
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-[#dd7323]/10 p-3 rounded-lg">
            <Shield size={28} className="text-[#dd7323]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Nhật ký Hoạt động</h1>
            <p className="text-slate-600 text-sm">Theo dõi tất cả hoạt động trong hệ thống</p>
          </div>
        </div>
        <button
          onClick={exportLogs}
          disabled={logs.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-[#dd7323] text-white font-medium rounded-lg hover:bg-[#c2621a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FileDown size={18} />
          Xuất CSV
        </button>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter size={16} className="text-slate-600" />
          <h3 className="font-semibold text-slate-700">Bộ lọc</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* User ID Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              <User size={14} className="inline mr-1" />
              User ID
            </label>
            <input
              type="text"
              placeholder="Nhập User ID..."
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#dd7323] focus:border-transparent text-sm"
            />
          </div>

          {/* Class ID Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Class ID
            </label>
            <input
              type="text"
              placeholder="Nhập Class ID..."
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#dd7323] focus:border-transparent text-sm"
            />
          </div>

          {/* Action Type Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              <Activity size={14} className="inline mr-1" />
              Hành động
            </label>
            <select
              value={actionType}
              onChange={(e) => setActionType(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#dd7323] focus:border-transparent text-sm"
            >
              <option value="">Tất cả</option>
              <option value="CREATE">Tạo mới</option>
              <option value="UPDATE">Cập nhật</option>
              <option value="DELETE">Xóa</option>
              <option value="LOGIN">Đăng nhập</option>
              <option value="LOGOUT">Đăng xuất</option>
              <option value="ENROLL">Đăng ký</option>
              <option value="UNENROLL">Hủy đăng ký</option>
            </select>
          </div>

          {/* Start Date Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              <Calendar size={14} className="inline mr-1" />
              Từ ngày
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#dd7323] focus:border-transparent text-sm"
            />
          </div>

          {/* End Date Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Đến ngày
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#dd7323] focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <div className="mt-3 flex justify-end">
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-2 px-3 py-1.5 text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-sm"
            >
              <X size={14} />
              Xóa bộ lọc
            </button>
          </div>
        )}
      </div>

      {/* Logs Table */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 flex flex-col items-center justify-center">
          <Loader2 size={40} className="text-[#dd7323] animate-spin mb-3" />
          <p className="text-slate-600">Đang tải nhật ký hoạt động...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Thời gian
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Người dùng
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Hành động
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Tài nguyên
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Chi tiết
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    IP Address
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-slate-900 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString('vi-VN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-900">{log.userName}</span>
                        <span className="text-xs text-slate-500">
                          ID: {log.userId} • {log.userRole}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md border ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {log.resource}
                      {log.classId && (
                        <span className="ml-2 text-xs text-slate-500">
                          (Class: {log.classId})
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 max-w-md">
                      <div className="truncate" title={log.details}>
                        {log.details}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 font-mono">
                      {log.ipAddress}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {logs.length === 0 && (
            <div className="text-center py-12">
              <Activity size={48} className="mx-auto text-slate-300 mb-3" />
              <p className="text-slate-500 font-medium">Không có nhật ký hoạt động</p>
              <p className="text-slate-400 text-sm mt-1">Thử thay đổi bộ lọc để xem kết quả khác</p>
            </div>
          )}
          
          {/* Info footer */}
          {logs.length > 0 && (
            <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 text-sm text-slate-600">
              Hiển thị <span className="font-semibold text-slate-900">{logs.length}</span> nhật ký hoạt động
            </div>
          )}
        </div>
      )}
    </div>
  );
}
