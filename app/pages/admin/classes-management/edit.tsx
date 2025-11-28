import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, BookOpen, Key, Calendar, Loader2, AlertCircle } from 'lucide-react';
import type { Class } from '../../../types';
import api from '../../../utils/axios';
import { toaster } from '../../../components/ui/toaster';

const EditClass: React.FC = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [originalData, setOriginalData] = useState<Partial<Class>>({});
  const [formData, setFormData] = useState<Partial<Class>>({
    subject_id: undefined,
    name: '',
    password: '',
    teacher_id: undefined,
    student_count: 40,
    semester: '1',
    academic_year: '2025-2026',
    status: 1,
    description: ''
  });

  useEffect(() => {
    if (classId) {
      fetchClass();
    }
  }, [classId]);

  const fetchClass = async () => {
    setIsFetching(true);
    setNotFound(false);
    try {
      const response = await api.get(`/admin/classes/${classId}`);
      
      const data = {
        id: response.data.id,
        subject_id: response.data.subject_id || response.data.subjectId,
        name: response.data.name,
        password: response.data.password,
        teacher_id: response.data.teacher_id || response.data.lecturerId,
        student_count: response.data.student_count || response.data.capacity || 40,
        semester: response.data.semester,
        academic_year: response.data.academic_year || response.data.year,
        status: response.data.status,
        description: response.data.description || ''
      };
      
      setFormData(data);
      setOriginalData(data);
      
    } catch (error: any) {
      console.error('Error fetching class:', error);
      
      if (error.response?.status === 404) {
        setNotFound(true);
        toaster.create({
          title: 'Không tìm thấy',
          description: 'Lớp học không tồn tại hoặc đã bị xóa!',
          type: 'error'
        });
      } else {
        toaster.create({
          title: 'Lỗi tải dữ liệu',
          description: error.response?.data?.message || 'Không thể tải thông tin lớp học!',
          type: 'error'
        });
      }
    } finally {
      setIsFetching(false);
    }
  };

  // Check if form has changes
  const hasChanges = (): boolean => {
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  };

  // Get only changed fields for update
  const getChangedFields = (): Partial<Class> => {
    const changes: Partial<Class> = {};
    
    if (formData.subject_id !== originalData.subject_id) changes.subject_id = formData.subject_id;
    if (formData.name !== originalData.name) changes.name = formData.name;
    if (formData.password !== originalData.password) changes.password = formData.password;
    if (formData.teacher_id !== originalData.teacher_id) changes.teacher_id = formData.teacher_id;
    if (formData.student_count !== originalData.student_count) changes.student_count = formData.student_count;
    if (formData.semester !== originalData.semester) changes.semester = formData.semester;
    if (formData.academic_year !== originalData.academic_year) changes.academic_year = formData.academic_year;
    if (formData.status !== originalData.status) changes.status = formData.status;
    if (formData.description !== originalData.description) changes.description = formData.description;
    
    return changes;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if there are any changes
    if (!hasChanges()) {
      toaster.create({
        title: 'Không có thay đổi',
        description: 'Bạn chưa thay đổi thông tin nào!',
        type: 'info'
      });
      return;
    }
    
    // Validation
    if (!formData.subject_id || !formData.name || !formData.teacher_id) {
      toaster.create({
        title: 'Lỗi',
        description: 'Vui lòng điền đầy đủ thông tin bắt buộc!',
        type: 'error'
      });
      return;
    }

    if (!formData.password || formData.password.length < 4) {
      toaster.create({
        title: 'Lỗi',
        description: 'Mã tham gia phải có ít nhất 4 ký tự!',
        type: 'error'
      });
      return;
    }

    setIsLoading(true);
    try {
      // Get only changed fields for atomic update
      const payload = getChangedFields();
      
      console.log('Updating class with payload:', payload);
      
      // Call API PUT /admin/classes/:id
      const response = await api.put(`/admin/classes/${classId}`, payload);
      
      console.log('Update response:', response.data);
      
      toaster.create({
        title: 'Thành công',
        description: 'Cập nhật lớp học thành công!',
        type: 'success'
      });
      
      setTimeout(() => {
        navigate('/admin/classes-management/list');
      }, 1500);
      
    } catch (error: any) {
      console.error('Error updating class:', error);
      
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
          description: 'Bạn không có quyền chỉnh sửa lớp học này!',
          type: 'error'
        });
      } else {
        toaster.create({
          title: 'Lỗi',
          description: errorMessage || 'Không thể cập nhật lớp học. Vui lòng thử lại!',
          type: 'error'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle cancel with unsaved changes warning
  const handleCancel = () => {
    if (hasChanges()) {
      const confirm = window.confirm('Bạn có thay đổi chưa lưu. Bạn có chắc muốn hủy?');
      if (!confirm) return;
    }
    navigate('/admin/classes-management/list');
  };

  // Loading state
  if (isFetching) {
    return (
      <div className="max-w-2xl mx-auto pb-10">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 flex flex-col items-center justify-center">
          <Loader2 size={40} className="text-[#dd7323] animate-spin mb-3" />
          <p className="text-slate-600">Đang tải thông tin lớp học...</p>
        </div>
      </div>
    );
  }

  // Not found state
  if (notFound) {
    return (
      <div className="max-w-2xl mx-auto pb-10">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 flex flex-col items-center justify-center">
          <AlertCircle size={48} className="text-red-500 mb-3" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Không tìm thấy lớp học</h2>
          <p className="text-slate-600 mb-4">Lớp học không tồn tại hoặc đã bị xóa.</p>
          <button 
            onClick={() => navigate('/admin/classes-management/list')}
            className="px-6 py-2.5 bg-[#dd7323] text-white font-bold rounded-xl hover:bg-[#c2621a] transition-all"
          >
            Quay về danh sách
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pb-10">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-1 text-slate-500 hover:text-[#dd7323] mb-4 transition-colors"
      >
        <ArrowLeft size={16} /> Quay lại
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
          <div className="bg-[#dd7323]/10 p-2 rounded-lg text-[#dd7323]">
             <BookOpen size={24} />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-slate-800">Chỉnh sửa Lớp học</h1>
            <p className="text-slate-500 text-sm">Lớp: <span className="font-medium">{originalData.name}</span></p>
          </div>
          {hasChanges() && (
            <div className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
              Có thay đổi chưa lưu
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Chọn Học phần (Subject) <span className="text-red-500">*</span>
              </label>
              <select 
                required
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#dd7323]/20 focus:border-[#dd7323] outline-none transition-all"
                value={formData.subject_id || ''}
                onChange={e => setFormData({...formData, subject_id: parseInt(e.target.value)})}
              >
                <option value="">-- Chọn Học phần --</option>
                <option value="1">INT3306 - Phát triển ứng dụng Web</option>
                <option value="2">INT3401 - Trí tuệ nhân tạo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Tên lớp <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#dd7323]/20 focus:border-[#dd7323] outline-none transition-all"
                value={formData.name}
                placeholder="VD: Lớp 01, CLC-02"
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>

             <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Sĩ số tối đa</label>
              <input 
                type="number" 
                min="1"
                max="40"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#dd7323]/20 focus:border-[#dd7323] outline-none transition-all"
                value={formData.student_count}
                onChange={e => setFormData({...formData, student_count: parseInt(e.target.value) || 40})}
              />
              <p className="text-xs text-slate-400 mt-1">Tối đa 40 sinh viên theo quy định.</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Học kỳ</label>
              <select 
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#dd7323]/20 focus:border-[#dd7323] outline-none transition-all"
                value={formData.semester}
                onChange={e => setFormData({...formData, semester: e.target.value})}
              >
                <option value="1">Học kỳ 1</option>
                <option value="2">Học kỳ 2</option>
                <option value="Hè">Học kỳ Hè</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Năm học</label>
              <div className="relative">
                 <input 
                  type="text" 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#dd7323]/20 focus:border-[#dd7323] outline-none transition-all"
                  value={formData.academic_year}
                  placeholder="2025-2026"
                  onChange={e => setFormData({...formData, academic_year: e.target.value})}
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Giảng viên phụ trách lớp <span className="text-red-500">*</span>
              </label>
              <select 
                required
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#dd7323]/20 focus:border-[#dd7323] outline-none transition-all"
                value={formData.teacher_id || ''}
                onChange={e => setFormData({...formData, teacher_id: parseInt(e.target.value)})}
              >
                <option value="">-- Chọn Giảng viên đã được gán --</option>
                <option value="2">GV0015 - Trần Thị Mai (Assignment ID: 101)</option>
                <option value="99">GV0020 - Lê Văn C (Assignment ID: 102)</option>
              </select>
            </div>

            <div className="md:col-span-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                   <Key size={16} className="text-[#dd7323]" />
                   Mã tham gia lớp (Passcode) <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  required
                  minLength={4}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#dd7323]/20 focus:border-[#dd7323] outline-none transition-all font-mono tracking-widest"
                  value={formData.password}
                  placeholder="VD: 123456"
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
                <p className="text-xs text-slate-500 mt-2">Sinh viên cần nhập mã này để tham gia lớp (Join Class). Tối thiểu 4 ký tự.</p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Trạng thái</label>
              <select 
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#dd7323]/20 focus:border-[#dd7323] outline-none transition-all"
                value={formData.status}
                onChange={e => setFormData({...formData, status: parseInt(e.target.value) as 1 | 0})}
              >
                <option value={1}>Đang mở</option>
                <option value={0}>Đóng</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
               <label className="block text-sm font-bold text-slate-700 mb-2">Mô tả lớp học</label>
               <textarea 
                  rows={3}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#dd7323]/20 focus:border-[#dd7323] outline-none transition-all resize-none"
                  value={formData.description}
                  placeholder="Mô tả về lớp học, lịch học, yêu cầu..."
                  onChange={e => setFormData({...formData, description: e.target.value})}
               />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
             <button 
              type="button" 
              onClick={handleCancel}
              className="px-6 py-2.5 text-slate-600 font-medium hover:bg-slate-50 rounded-xl transition-colors"
            >
              Hủy bỏ
            </button>
            <button 
              type="submit" 
              disabled={isLoading || !hasChanges()}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#dd7323] text-white font-bold rounded-xl hover:bg-[#c2621a] transition-all shadow-lg shadow-orange-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>Lưu thay đổi</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditClass;
