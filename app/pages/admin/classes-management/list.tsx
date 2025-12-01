import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import TableList, { type Column } from '../../../components/common/TableList';
import { Calendar, User, CheckCircle, Clock, Edit, Key, Search, X, Loader2, Trash2 } from 'lucide-react';
import type { Class } from '../../../types';
import api from '../../../utils/axios';
import { toaster } from '../../../components/ui/toaster';
import { createListCollection, Select as ChakraSelect } from '@chakra-ui/react';
import { SelectRoot, SelectTrigger, SelectValueText, SelectContent, SelectItem } from '../../../components/ui/select';

// ClassDTO from backend
interface ClassDTO {
  id: number;
  subject_id: number;
  teacher_id?: number;
  name: string;
  password: string;
  semester: string;
  academic_year?: string;
  year?: number;
  student_count?: number;
  status: number;
  description?: string;
  subjectName?: string;
  lecturerName?: string;
  createdAt?: string;
  updatedAt?: string;
}

const ClassesList: React.FC = () => {
  const navigate = useNavigate();
  
  // States for data and loading
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // States for filters
  const [keyword, setKeyword] = useState<string>('');
  const [subjectId, setSubjectId] = useState<string>('');
  const [teacherId, setTeacherId] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  
  // Debounced keyword for API calls
  const [debouncedKeyword, setDebouncedKeyword] = useState<string>('');

  // Debounce keyword input (wait 500ms after user stops typing)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 500);

    return () => clearTimeout(timer);
  }, [keyword]);

  // Fetch classes from API
  const fetchClasses = async () => {
    try {
      setLoading(true);
      
      // Build query params
      const params: Record<string, string> = {};
      if (subjectId) params.subject_id = subjectId;
      if (teacherId) params.teacher_id = teacherId;
      if (debouncedKeyword.trim()) params.keyword = debouncedKeyword.trim();
      if (status !== '') params.status = status;
      
      const response = await api.get<{ results: ClassDTO[] }>('/admin/classes', { params });
      
      // Transform ClassDTO to Class format
      const transformedClasses: Class[] = response.data.results.map((dto) => ({
        id: dto.id,
        subject_id: dto.subject_id,
        subjectId: dto.subject_id,
        teacher_id: dto.teacher_id,
        lecturerId: dto.teacher_id,
        name: dto.name,
        password: dto.password,
        semester: dto.semester,
        academic_year: dto.academic_year || dto.year?.toString() || '',
        year: dto.year,
        student_count: dto.student_count || 0,
        status: dto.status,
        description: dto.description,
        subjectName: dto.subjectName || 'N/A',
        lecturerName: dto.lecturerName || 'N/A',
        classCode: `CLS${dto.id.toString().padStart(3, '0')}`
      }));
      
      setClasses(transformedClasses);
      
    } catch (error: any) {
      console.error('Error fetching classes:', error);
      toaster.create({
        title: 'Lỗi tải dữ liệu',
        description: error.response?.data?.message || 'Không thể tải danh sách lớp học',
        type: 'error'
      });
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount and when filters change
  useEffect(() => {
    fetchClasses();
  }, [debouncedKeyword, subjectId, teacherId, status]);

  // Handle clear filters
  const handleClearFilters = () => {
    setKeyword('');
    setSubjectId('');
    setTeacherId('');
    setStatus('');
  };

  // Check if any filter is active
  const hasActiveFilters = keyword || subjectId || teacherId || status !== '';

  // Handle delete class (soft delete - change status to 0)
  const handleDeleteClass = async (classItem: Class) => {
    // Confirmation dialog
    const confirmMessage = `Bạn có chắc muốn đóng lớp học "${classItem.name}" - ${classItem.subjectName}?\n\nLưu ý: Lớp học sẽ được đánh dấu là "Đã đóng" (status = 0) và không còn hoạt động.`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      // Call DELETE API - soft delete by setting status = 0
      await api.delete(`/admin/classes/${classItem.id}`);
      
      toaster.create({
        title: 'Thành công',
        description: `Đã đóng lớp học "${classItem.name}" thành công!`,
        type: 'success'
      });

      // Refresh the list
      fetchClasses();
      
    } catch (error: any) {
      console.error('Error deleting class:', error);
      
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error
        || error.message;
      
      if (error.response?.status === 404) {
        toaster.create({
          title: 'Lỗi',
          description: 'Lớp học không tồn tại!',
          type: 'error'
        });
      } else if (error.response?.status === 403) {
        toaster.create({
          title: 'Lỗi',
          description: 'Bạn không có quyền đóng lớp học này!',
          type: 'error'
        });
      } else if (error.response?.status === 409) {
        toaster.create({
          title: 'Lỗi',
          description: 'Không thể đóng lớp học đang có sinh viên tham gia!',
          type: 'error'
        });
      } else {
        toaster.create({
          title: 'Lỗi',
          description: errorMessage || 'Không thể đóng lớp học. Vui lòng thử lại!',
          type: 'error'
        });
      }
    }
  };


  const columns: Column<Class>[] = [
    {
      header: 'Tên lớp',
      accessor: 'name',
      render: (row) => (
        <div className="font-bold text-[#293548] flex items-center gap-2">
          {row.name}
          {row.password && (
            <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 flex items-center gap-0.5" title="Mã tham gia">
              <Key size={8} /> {row.password}
            </span>
          )}
        </div>
      )
    },
    {
      header: 'Học phần',
      accessor: 'subjectName',
      render: (row) => (
        <span className="text-sm text-slate-700 font-medium">{row.subjectName}</span>
      )
    },
    {
      header: 'Giảng viên',
      accessor: 'lecturerName',
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
            <User size={12} />
          </div>
          <span className="text-slate-700 text-sm">{row.lecturerName}</span>
        </div>
      )
    },
    {
      header: 'Học kỳ',
      accessor: 'semester',
      render: (row) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
          <Calendar size={12} className="text-[#d97b2a]" />
          HK{row.semester} / {row.academic_year}
        </div>
      )
    },
    {
      header: 'Sĩ số',
      accessor: 'student_count',
      render: (row) => (
        <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${(row.student_count ?? 0) >= 40 ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
          {row.student_count ?? 0} / 40
        </span>
      )
    },
    {
      header: 'Trạng thái',
      accessor: 'status',
      render: (row) => (
        row.status === 1 ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold text-emerald-600 bg-emerald-50">
            <Clock size={12} /> Đang hoạt động
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold text-slate-500 bg-slate-100">
            <CheckCircle size={12} /> Đã đóng
          </span>
        )
      )
    },
    {
      header: 'Thao tác',
      accessor: 'id',
      render: (row) => (
        <div className="flex items-center gap-1">
          <button 
            onClick={() => navigate(`/admin/classes-management/edit/${row.id}`)}
            className="p-2 text-slate-400 hover:text-[#dd7323] hover:bg-orange-50 rounded-lg transition-colors"
            title="Chỉnh sửa"
          >
            <Edit size={16} />
          </button>
          
          {row.status === 1 && (
            <button 
              onClick={() => handleDeleteClass(row)}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Đóng lớp học"
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
              placeholder="Nhập tên lớp học..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#dd7323] focus:border-transparent"
            />
          </div>

          {/* Subject Filter */}
          <div className="w-56">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Học phần
            </label>
            <SelectRoot
              collection={createListCollection({
                items: [
                  { label: 'Tất cả học phần', value: '' },
                  { label: 'INT3306 - Web Development', value: '1' },
                  { label: 'INT3401 - AI', value: '2' }
                ]
              })}
              value={subjectId ? [subjectId] : []}
              onValueChange={(e: any) => setSubjectId(e.value[0] || '')}
              size="sm"
              variant="outline"
              positioning={{ sameWidth: true }}
            >
              <SelectTrigger clearable>
                <SelectValueText placeholder="Tất cả học phần" />
              </SelectTrigger>
              <SelectContent>
                {[
                  { label: 'Tất cả học phần', value: '' },
                  { label: 'INT3306 - Web Development', value: '1' },
                  { label: 'INT3401 - AI', value: '2' }
                ].map((item) => (
                  <SelectItem key={item.value} item={item}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </SelectRoot>
          </div>

          {/* Teacher Filter */}
          <div className="w-56">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Giảng viên
            </label>
            <SelectRoot
              collection={createListCollection({
                items: [
                  { label: 'Tất cả giảng viên', value: '' },
                  { label: 'GV001 - Nguyễn Văn An', value: '1' },
                  { label: 'GV002 - Trần Thị B', value: '2' }
                ]
              })}
              value={teacherId ? [teacherId] : []}
              onValueChange={(e: any) => setTeacherId(e.value[0] || '')}
              size="sm"
              variant="outline"
              positioning={{ sameWidth: true }}
            >
              <SelectTrigger clearable>
                <SelectValueText placeholder="Tất cả giảng viên" />
              </SelectTrigger>
              <SelectContent>
                {[
                  { label: 'Tất cả giảng viên', value: '' },
                  { label: 'GV001 - Nguyễn Văn An', value: '1' },
                  { label: 'GV002 - Trần Thị B', value: '2' }
                ].map((item) => (
                  <SelectItem key={item.value} item={item}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </SelectRoot>
          </div>

          {/* Status Filter */}
          <div className="w-40">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Trạng thái
            </label>
            <SelectRoot
              collection={createListCollection({
                items: [
                  { label: 'Tất cả', value: '' },
                  { label: 'Đang hoạt động', value: '1' },
                  { label: 'Đã đóng', value: '0' }
                ]
              })}
              value={status ? [status] : []}
              onValueChange={(e: any) => setStatus(e.value[0] || '')}
              size="sm"
              variant="outline"
              positioning={{ sameWidth: true }}
            >
              <SelectTrigger clearable>
                <SelectValueText placeholder="Tất cả" />
              </SelectTrigger>
              <SelectContent>
                {[
                  { label: 'Tất cả', value: '' },
                  { label: 'Đang hoạt động', value: '1' },
                  { label: 'Đã đóng', value: '0' }
                ].map((item) => (
                  <SelectItem key={item.value} item={item}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </SelectRoot>
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
          <p className="text-slate-600">Đang tải danh sách lớp học...</p>
        </div>
      ) : (
        <TableList 
          title="Quản lý Lớp học"
          subtitle="Danh sách và thông tin các lớp học."
          data={classes}
          columns={columns}
          onAdd={() => navigate('/admin/classes-management/create')}
        />
      )}
    </div>
  );
};

export default ClassesList;
