import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Library, Loader2, AlertCircle } from 'lucide-react';
import type { Subject, SubjectDTO } from '../../../types';
import api from '../../../utils/axios';
import { toaster } from '../../../components/ui/toaster';

const EditSubject: React.FC = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [originalData, setOriginalData] = useState<Partial<Subject>>({});
  const [formData, setFormData] = useState<Partial<Subject>>({
    codeSubject: '',
    name: '',
    credits: 3,
    department: '',
    description: '',
    status: 1
  });

  useEffect(() => {
    if (subjectId) {
      fetchSubject();
    }
  }, [subjectId]);

  const fetchSubject = async () => {
    setIsFetching(true);
    setNotFound(false);
    try {
      const response = await api.get<SubjectDTO>(`/admin/subjects/${subjectId}`);
      
      const data = {
        id: response.data.id,
        codeSubject: response.data.codeSubject,
        name: response.data.name,
        credits: response.data.credits,
        department: response.data.department || '',
        description: response.data.description || '',
        status: response.data.status
      };
      
      setFormData(data);
      setOriginalData(data);
      
    } catch (error: any) {
      console.error('Error fetching subject:', error);
      
      if (error.response?.status === 404) {
        setNotFound(true);
        toaster.create({
          title: 'Không tìm thấy',
          description: 'Học phần không tồn tại hoặc đã bị xóa!',
          type: 'error'
        });
      } else {
        toaster.create({
          title: 'Lỗi tải dữ liệu',
          description: error.response?.data?.message || 'Không thể tải thông tin học phần!',
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
  const getChangedFields = (): Partial<Subject> => {
    const changes: Partial<Subject> = {};
    
    if (formData.codeSubject !== originalData.codeSubject) {
      changes.codeSubject = formData.codeSubject;
    }
    if (formData.name !== originalData.name) {
      changes.name = formData.name;
    }
    if (formData.credits !== originalData.credits) {
      changes.credits = formData.credits;
    }
    if (formData.department !== originalData.department) {
      changes.department = formData.department;
    }
    if (formData.description !== originalData.description) {
      changes.description = formData.description;
    }
    if (formData.status !== originalData.status) {
      changes.status = formData.status;
    }
    
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
    if (!formData.codeSubject || !formData.name || !formData.credits) {
      toaster.create({
        title: 'Lỗi',
        description: 'Vui lòng điền đầy đủ thông tin bắt buộc!',
        type: 'error'
      });
      return;
    }

    // Validate codeSubject format (uppercase, alphanumeric)
    const codeRegex = /^[A-Z0-9]+$/;
    if (!codeRegex.test(formData.codeSubject)) {
      toaster.create({
        title: 'Lỗi',
        description: 'Mã học phần phải là chữ in hoa và số!',
        type: 'error'
      });
      return;
    }

    // Validate credits range
    if (formData.credits < 1 || formData.credits > 20) {
      toaster.create({
        title: 'Lỗi',
        description: 'Số tín chỉ phải từ 1 đến 20!',
        type: 'error'
      });
      return;
    }

    setIsLoading(true);
    try {
      // Get only changed fields for atomic update
      const payload = getChangedFields();
      
      console.log('Updating subject with payload:', payload);
      
      // Call API PUT /admin/subjects/:id
      const response = await api.put<SubjectDTO>(`/admin/subjects/${subjectId}`, payload);
      
      console.log('Update response:', response.data);
      
      toaster.create({
        title: 'Thành công',
        description: 'Cập nhật học phần thành công!',
        type: 'success'
      });
      
      setTimeout(() => {
        navigate('/admin/subjects-management/list');
      }, 1500);
      
    } catch (error: any) {
      console.error('Error updating subject:', error);
      
      // Handle specific error cases
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error
        || error.message;
      
      if (error.response?.status === 404) {
        // Not found
        toaster.create({
          title: 'Lỗi',
          description: 'Học phần không tồn tại!',
          type: 'error'
        });
      } else if (error.response?.status === 409) {
        // Conflict - codeSubject already exists
        toaster.create({
          title: 'Lỗi',
          description: `Mã học phần "${formData.codeSubject}" đã được sử dụng bởi môn học khác!`,
          type: 'error'
        });
      } else if (error.response?.status === 403) {
        // Forbidden - not admin
        toaster.create({
          title: 'Lỗi',
          description: 'Bạn không có quyền chỉnh sửa học phần này!',
          type: 'error'
        });
      } else {
        toaster.create({
          title: 'Lỗi',
          description: errorMessage || 'Không thể cập nhật học phần. Vui lòng thử lại!',
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
    navigate('/admin/subjects-management/list');
  };

  // Loading state
  if (isFetching) {
    return (
      <div className="max-w-2xl mx-auto pb-10">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 flex flex-col items-center justify-center">
          <Loader2 size={40} className="text-[#dd7323] animate-spin mb-3" />
          <p className="text-slate-600">Đang tải thông tin học phần...</p>
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
          <h2 className="text-xl font-bold text-slate-800 mb-2">Không tìm thấy học phần</h2>
          <p className="text-slate-600 mb-4">Học phần không tồn tại hoặc đã bị xóa.</p>
          <button 
            onClick={() => navigate('/admin/subjects-management/list')}
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
             <Library size={24} />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-slate-800">Chỉnh sửa Học phần</h1>
            <p className="text-slate-500 text-sm">Mã: <span className="font-mono font-bold">{originalData.codeSubject}</span></p>
          </div>
          {hasChanges() && (
            <div className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
              Có thay đổi chưa lưu
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Mã học phần (Unique) <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#dd7323]/20 focus:border-[#dd7323] outline-none transition-all uppercase font-mono"
                value={formData.codeSubject}
                onChange={e => setFormData({...formData, codeSubject: e.target.value.toUpperCase()})}
                placeholder="VD: INT3306"
                maxLength={15}
              />
              <p className="text-xs text-slate-500 mt-1">
                Có thể thay đổi nếu chưa có lớp học nào sử dụng
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Số tín chỉ <span className="text-red-500">*</span>
              </label>
              <input 
                type="number" 
                min="1"
                max="20"
                required
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#dd7323]/20 focus:border-[#dd7323] outline-none transition-all"
                value={formData.credits}
                onChange={e => setFormData({...formData, credits: parseInt(e.target.value) || 1})}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Tên học phần <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#dd7323]/20 focus:border-[#dd7323] outline-none transition-all"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="VD: Phát triển ứng dụng Web"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Khoa / Bộ môn</label>
              <select 
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#dd7323]/20 focus:border-[#dd7323] outline-none transition-all"
                value={formData.department}
                onChange={e => setFormData({...formData, department: e.target.value})}
              >
                <option value="">-- Chọn khoa --</option>
                <option value="CNTT">CNTT</option>
                <option value="Toán - Cơ">Toán - Cơ</option>
                <option value="Lý luận chính trị">Lý luận chính trị</option>
                <option value="NN & VH Anh Mỹ">NN & VH Anh Mỹ</option>
                <option value="Vật lý">Vật lý</option>
                <option value="Hóa học">Hóa học</option>
                <option value="Sinh học">Sinh học</option>
              </select>
            </div>

            <div>
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
              <label className="block text-sm font-bold text-slate-700 mb-2">Mô tả</label>
              <textarea 
                rows={4}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#dd7323]/20 focus:border-[#dd7323] outline-none transition-all resize-none"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="Mô tả chi tiết về môn học..."
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

export default EditSubject;
