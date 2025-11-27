import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TableList from '../../../components/common/TableList';
import type { Column } from '../../../components/common/TableList';
import { Mail, UserCheck, UserX, Edit, Hash, Search, X, Loader2 } from 'lucide-react';
import type { UserEntity } from '../../../types';
import api from '../../../utils/axios';
import { toaster } from '../../../components/ui/toaster';

// Extended type for display with additional fields
type UserDisplay = UserEntity & {
  role_name: string;
  created_at: string;
  avatar?: string | null;
};

// UserDTO from backend
interface UserDTO {
  id: number;
  codeUser: string;
  name: string;
  email: string;
  role_id: number;
  date_of_birth?: string;
  status: number;
  createdAt?: string;
  updatedAt?: string;
}

const UsersList: React.FC = () => {
  const navigate = useNavigate();
  
  // States for data and loading
  const [users, setUsers] = useState<UserDisplay[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // States for filters
  const [keyword, setKeyword] = useState<string>('');
  const [roleId, setRoleId] = useState<string>('');
  
  // Debounced keyword for API calls
  const [debouncedKeyword, setDebouncedKeyword] = useState<string>('');
  
  // Role mapping
  const roleMap: Record<number, string> = {
    1: 'Admin',
    2: 'Lecturer',
    3: 'Student'
  };

  // Debounce keyword input (wait 500ms after user stops typing)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 500);

    return () => clearTimeout(timer);
  }, [keyword]);

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Build query params
      const params: Record<string, string> = {};
      if (debouncedKeyword.trim()) params.keyword = debouncedKeyword.trim();
      if (roleId) params.role_id = roleId;
      
      const response = await api.get<{ results: UserDTO[] }>('/admin/users', { params });
      
      // Transform UserDTO to UserDisplay format
      const transformedUsers: UserDisplay[] = response.data.results.map((dto) => ({
        id: dto.id,
        codeUser: dto.codeUser,
        name: dto.name,
        email: dto.email,
        role_id: dto.role_id,
        role_name: roleMap[dto.role_id] || 'student',
        date_of_birth: dto.date_of_birth,
        status: dto.status,
        created_at: dto.createdAt || new Date().toISOString(),
        createdAt: dto.createdAt,
        updatedAt: dto.updatedAt,
        avatar: null
      }));
      
      setUsers(transformedUsers);
      
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toaster.create({
        title: 'Lỗi tải dữ liệu',
        description: error.response?.data?.message || 'Không thể tải danh sách người dùng',
        type: 'error'
      });
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount and when filters change
  useEffect(() => {
    fetchUsers();
  }, [debouncedKeyword, roleId]);

  // Handle clear filters
  const handleClearFilters = () => {
    setKeyword('');
    setRoleId('');
  };

  // Check if any filter is active
  const hasActiveFilters = keyword || roleId !== '';


  const columns: Column<UserDisplay>[] = [
    {
      header: 'Thông tin cá nhân',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <img 
            src={row.avatar || `https://ui-avatars.com/api/?name=${row.name}&background=random`} 
            alt={row.name}
            className="w-10 h-10 rounded-full object-cover border border-slate-200"
          />
          <div>
            <div className="font-bold text-slate-800 text-sm">{row.name}</div>
            <div className="text-xs text-slate-500 flex items-center gap-1">
               <Mail size={10} /> {row.email}
            </div>
          </div>
        </div>
      )
    },
    {
      header: 'Mã định danh',
      accessor: 'codeUser',
      render: (row) => (
        <div className="flex items-center gap-1.5 text-slate-600 font-mono text-xs bg-slate-100 px-2 py-1 rounded w-fit">
          <Hash size={10} />
          {row.codeUser}
        </div>
      )
    },
    {
      header: 'Vai trò',
      accessor: 'role_name',
      render: (row) => {
        const roles: Record<string, { label: string; bg: string; text: string }> = {
          student: { label: 'Sinh viên', bg: 'bg-blue-50', text: 'text-blue-600' },
          lecturer: { label: 'Giảng viên', bg: 'bg-purple-50', text: 'text-purple-600' },
          admin: { label: 'Quản trị', bg: 'bg-red-50', text: 'text-red-600' },
        };
        const conf = roles[row.role_name || 'student'];
        return (
          <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase ${conf.bg} ${conf.text}`}>
            {conf.label}
          </span>
        );
      }
    },
    {
      header: 'Trạng thái',
      accessor: 'status',
      render: (row) => (
        <div className="flex items-center gap-2">
           {row.status === 1 ? (
             <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
               <UserCheck size={12} /> Hoạt động
             </span>
           ) : (
             <span className="flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-full">
               <UserX size={12} /> Đã khóa (Ban)
             </span>
           )}
        </div>
      )
    },
    {
      header: 'Thao tác',
      accessor: 'id',
      render: (row) => (
         <button 
           onClick={() => navigate(`/admin/users-management/edit/${row.id}`)}
           className="p-2 text-slate-400 hover:text-[#dd7323] hover:bg-orange-50 rounded-lg transition-colors"
           title="Chỉnh sửa"
         >
            <Edit size={16} />
         </button>
      )
    }
  ];

  const handleImport = () => {
    alert("Tính năng Import Excel sẽ xử lý các trường: codeUser, name, email, role_id");
  };

  return (
    <div className="space-y-4">
      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
        <div className="flex flex-wrap gap-3 items-end">
          {/* Search Keyword */}
          <div className="flex-1 min-w-[300px]">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              <Search size={14} className="inline mr-1" />
              Tìm kiếm
            </label>
            <input
              type="text"
              placeholder="Nhập tên, email hoặc mã người dùng..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#dd7323] focus:border-transparent"
            />
          </div>

          {/* Role Filter */}
          <div className="w-48">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Vai trò
            </label>
            <select
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#dd7323] focus:border-transparent"
            >
              <option value="">Tất cả</option>
              <option value="1">Quản trị viên</option>
              <option value="2">Giảng viên</option>
              <option value="3">Sinh viên</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-2"
            >
              <X size={16} />
              Xóa bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* Table with Loading State */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 flex flex-col items-center justify-center">
          <Loader2 size={40} className="text-[#dd7323] animate-spin mb-3" />
          <p className="text-slate-600">Đang tải danh sách người dùng...</p>
        </div>
      ) : (
        <TableList 
          title="Quản lý Người dùng"
          subtitle="Danh sách tài khoản (Student, Lecturer, Admin) trong hệ thống."
          data={users}
          columns={columns}
          onAdd={() => navigate('/admin/users-management/create')}
          onImport={handleImport}
        />
      )}
    </div>
  );
};

export default UsersList;
