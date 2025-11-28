import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TableList, { type Column } from '../../../components/common/TableList';
import { Edit, Book, Search, Filter, X, Loader2, Trash2 } from 'lucide-react';
import type { Subject, SubjectDTO } from '../../../types';
import api from '../../../utils/axios';
import { toaster } from '../../../components/ui/toaster';

const SubjectsList: React.FC = () => {
  const navigate = useNavigate();
  
  // States for data and loading
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // States for filters
  const [keyword, setKeyword] = useState<string>('');
  const [department, setDepartment] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  
  // Debounced keyword for API calls
  const [debouncedKeyword, setDebouncedKeyword] = useState<string>('');
  
  // Departments list for filter dropdown
  const departments = [
    'CNTT',
    'Toán - Cơ',
    'Lý luận chính trị',
    'NN & VH Anh Mỹ',
    'Vật lý',
    'Hóa học',
    'Sinh học'
  ];

  // Debounce keyword input (wait 500ms after user stops typing)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 500);

    return () => clearTimeout(timer);
  }, [keyword]);

  // Fetch subjects from API
  const fetchSubjects = async () => {
    try {
      setLoading(true);
      
      // Build query params
      const params: Record<string, string> = {};
      if (debouncedKeyword.trim()) params.keyword = debouncedKeyword.trim();
      if (department) params.department = department;
      if (status !== '') params.status = status;
      
      const response = await api.get<{ results: SubjectDTO[] }>('/admin/subjects', { params });
      
      // Transform SubjectDTO to Subject format
      const transformedSubjects: Subject[] = response.data.results.map((dto) => ({
        id: dto.id,
        codeSubject: dto.codeSubject,
        name: dto.name,
        credits: dto.credits,
        department: dto.department || '',
        description: dto.description,
        status: dto.status,
        created_at: dto.created_at,
        updated_at: dto.updated_at
      }));
      
      setSubjects(transformedSubjects);
      
    } catch (error: any) {
      console.error('Error fetching subjects:', error);
      toaster.create({
        title: 'Lỗi tải dữ liệu',
        description: error.response?.data?.message || 'Không thể tải danh sách học phần',
        type: 'error'
      });
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount and when filters change
  useEffect(() => {
    fetchSubjects();
  }, [debouncedKeyword, department, status]);

  // Handle clear filters
  const handleClearFilters = () => {
    setKeyword('');
    setDepartment('');
    setStatus('');
  };

  // Check if any filter is active
  const hasActiveFilters = keyword || department || status !== '';

  // Count active filters for display
  const activeFilterCount = [debouncedKeyword, department, status].filter(Boolean).length;

  // Handle delete subject (soft delete - change status to 0)
  const handleDeleteSubject = async (subject: Subject) => {
    // Confirmation dialog
    const confirmMessage = `Bạn có chắc muốn xóa môn học "${subject.codeSubject} - ${subject.name}"?\n\nLưu ý: Môn học sẽ được đánh dấu là "Đóng" (status = 0) và không còn hoạt động.`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      // Call DELETE API - soft delete by setting status = 0
      await api.delete(`/admin/subjects/${subject.id}`);
      
      toaster.create({
        title: 'Thành công',
        description: `Đã xóa môn học "${subject.codeSubject}" thành công!`,
        type: 'success'
      });

      // Refresh the list
      fetchSubjects();
      
    } catch (error: any) {
      console.error('Error deleting subject:', error);
      
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error
        || error.message;
      
      if (error.response?.status === 404) {
        toaster.create({
          title: 'Lỗi',
          description: 'Môn học không tồn tại!',
          type: 'error'
        });
      } else if (error.response?.status === 403) {
        toaster.create({
          title: 'Lỗi',
          description: 'Bạn không có quyền xóa môn học này!',
          type: 'error'
        });
      } else if (error.response?.status === 409) {
        toaster.create({
          title: 'Lỗi',
          description: 'Không thể xóa môn học đang có lớp học hoạt động!',
          type: 'error'
        });
      } else {
        toaster.create({
          title: 'Lỗi',
          description: errorMessage || 'Không thể xóa môn học. Vui lòng thử lại!',
          type: 'error'
        });
      }
    }
  };

  // Define table columns
  const columns: Column<Subject>[] = [
    {
      header: 'Mã HP',
      accessor: 'codeSubject',
      render: (row) => (
        <span className="font-mono font-bold text-[#293548] px-2 py-1 bg-slate-100 rounded text-xs border border-slate-200">
          {row.codeSubject}
        </span>
      )
    },
    {
      header: 'Tên học phần',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Book size={16} className="text-[#dd7323]" />
          <span className="font-medium text-slate-700">{row.name}</span>
        </div>
      )
    },
    {
      header: 'Số TC',
      accessor: 'credits',
      className: 'text-center',
      render: (row) => <div className="text-center font-bold text-slate-600">{row.credits}</div>
    },
    {
      header: 'Bộ môn / Khoa',
      accessor: 'department',
    },
    {
      header: 'Trạng thái',
      accessor: 'status',
      render: (row) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${row.status === 1 ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
          {row.status === 1 ? 'Đang mở' : 'Đóng'}
        </span>
      )
    },
    {
      header: 'Thao tác',
      accessor: 'id',
      render: (row) => (
        <div className="flex items-center gap-1">
          <button 
            onClick={() => navigate(`/admin/subjects-management/edit/${row.id}`)}
            className="p-2 text-slate-400 hover:text-[#dd7323] hover:bg-orange-50 rounded-lg transition-colors"
            title="Chỉnh sửa"
          >
            <Edit size={16} />
          </button>
          
          {row.status === 1 && (
            <button 
              onClick={() => handleDeleteSubject(row)}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Xóa (Đóng môn học)"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
        <div className="flex flex-wrap gap-3 items-end">
          {/* Search Keyword */}
          <div className="flex-1 min-w-[250px]">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              <Search size={14} className="inline mr-1" />
              Tìm kiếm
            </label>
            <input
              type="text"
              placeholder="Nhập mã HP hoặc tên môn học..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#dd7323] focus:border-transparent"
            />
          </div>

          {/* Department Filter */}
          <div className="w-48">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Bộ môn / Khoa
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#dd7323] focus:border-transparent"
            >
              <option value="">Tất cả</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="w-40">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Trạng thái
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#dd7323] focus:border-transparent"
            >
              <option value="">Tất cả</option>
              <option value="1">Đang mở</option>
              <option value="0">Đóng</option>
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
          <p className="text-slate-600">Đang tải danh sách học phần...</p>
        </div>
      ) : (
        <TableList 
          title="Quản lý Học phần"
          subtitle="Danh sách các môn học trong chương trình đào tạo (Tổng quát)."
          data={subjects}
          columns={columns}
          onAdd={() => navigate('/admin/subjects-management/create')}
          onImport={() => alert('Import học phần')}
        />
      )}
    </div>
  );
};

export default SubjectsList;
