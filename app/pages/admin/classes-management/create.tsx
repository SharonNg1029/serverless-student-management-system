import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, BookOpen, Key, Calendar, Loader2, Users } from 'lucide-react';
import api from '../../../utils/axios';
import { toaster } from '../../../components/ui/toaster';

interface Subject {
  id: number;
  name: string;
  code: string;
  department?: string;
}

interface Lecturer {
  id: number;
  full_name: string;
  email: string;
}

const CreateClass: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [loadingLecturers, setLoadingLecturers] = useState(false);

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);

  const [formData, setFormData] = useState({
    subject_id: undefined as number | undefined,
    name: '', // VD: Lớp 01
    password: '', // Passcode join
    teacher_id: undefined as number | undefined,
    semester: '1',
    academic_year: '2025-2026',
    description: ''
  });

  // Load subjects
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoadingSubjects(true);
        const response = await api.get<{ results: any[] }>('/admin/subjects', {
          params: { status: 1 } // Only active subjects
        });
        
        const subjectsData: Subject[] = response.data.results.map(s => ({
          id: s.id,
          name: s.name,
          code: s.code,
          department: s.department
        }));
        
        setSubjects(subjectsData);
      } catch (error: any) {
        console.error('Error fetching subjects:', error);
        toaster.create({
          title: 'Lỗi',
          description: 'Không thể tải danh sách học phần',
          type: 'error'
        });
      } finally {
        setLoadingSubjects(false);
      }
    };

    fetchSubjects();
  }, []);

  // Load lecturers (role_id = 2)
  useEffect(() => {
    const fetchLecturers = async () => {
      try {
        setLoadingLecturers(true);
        const response = await api.get<{ results: any[] }>('/admin/users', {
          params: { role_id: 2 } // Only lecturers
        });
        
        const lecturersData: Lecturer[] = response.data.results.map(l => ({
          id: l.id,
          full_name: l.full_name,
          email: l.email
        }));
        
        setLecturers(lecturersData);
      } catch (error: any) {
        console.error('Error fetching lecturers:', error);
        toaster.create({
          title: 'Lỗi',
          description: 'Không thể tải danh sách giảng viên',
          type: 'error'
        });
      } finally {
        setLoadingLecturers(false);
      }
    };

    fetchLecturers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.subject_id || !formData.name) {
      toaster.create({
        title: 'Lỗi',
        description: 'Vui lòng điền đầy đủ Subject và Tên lớp!',
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

    // Check if subject exists
    const subjectExists = subjects.find(s => s.id === formData.subject_id);
    if (!subjectExists) {
      toaster.create({
        title: 'Lỗi',
        description: 'Học phần không tồn tại hoặc đã bị xóa!',
        type: 'error'
      });
      return;
    }

    // Check if teacher exists and is lecturer (optional)
    if (formData.teacher_id) {
      const teacherExists = lecturers.find(l => l.id === formData.teacher_id);
      if (!teacherExists) {
        toaster.create({
          title: 'Lỗi',
          description: 'Giảng viên không tồn tại hoặc không có vai trò Lecturer!',
          type: 'error'
        });
        return;
      }
    }

    setIsLoading(true);
    try {
      // Prepare payload according to API spec
      const payload = {
        subject_id: formData.subject_id,
        name: formData.name,
        password: formData.password,
        semester: formData.semester,
        academic_year: formData.academic_year,
        description: formData.description,
        ...(formData.teacher_id && { teacher_id: formData.teacher_id }) // Optional teacher_id
      };
      
      console.log('Creating class with payload:', payload);
      
      // Call API POST /admin/classes
      const response = await api.post('/admin/classes', payload);
      
      console.log('Create response:', response.data);
      
      toaster.create({
        title: 'Thành công',
        description: formData.teacher_id 
          ? `Đã mở lớp học mới và gửi email thông báo tới giảng viên!`
          : 'Đã mở lớp học mới thành công!',
        type: 'success',
        duration: 3000
      });
      
      setTimeout(() => {
        navigate('/admin/classes-management/list');
      }, 1500);
      
    } catch (error: any) {
      console.error('Error creating class:', error);
      
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error
        || error.message;
      
      toaster.create({
        title: 'Lỗi tạo lớp',
        description: errorMessage || 'Không thể tạo lớp học. Vui lòng thử lại!',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pb-10">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-slate-500 hover:text-[#dd7323] mb-4 transition-colors">
        <ArrowLeft size={16} /> Quay lại
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
          <div className="bg-[#dd7323]/10 p-2 rounded-lg text-[#dd7323]">
             <BookOpen size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Mở Lớp học mới</h1>
            <p className="text-slate-500 text-sm">Tạo lớp cụ thể từ học phần (Subject).</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Chọn Học phần (Subject) <span className="text-red-500">*</span>
              </label>
              <select 
                required
                disabled={loadingSubjects}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#dd7323]/20 focus:border-[#dd7323] outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                value={formData.subject_id || ''}
                onChange={e => setFormData({...formData, subject_id: parseInt(e.target.value)})}
              >
                <option value="">-- Chọn Học phần --</option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>
                    {subject.code} - {subject.name}
                    {subject.department && ` (${subject.department})`}
                  </option>
                ))}
              </select>
              {loadingSubjects && (
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <Loader2 size={12} className="animate-spin" />
                  Đang tải học phần...
                </p>
              )}
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
              <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-1">
                <Users size={14} />
                Sĩ số ban đầu
              </label>
              <div className="px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-600">
                0 sinh viên
              </div>
              <p className="text-xs text-slate-400 mt-1">Lớp mới sẽ bắt đầu với 0 sinh viên. Sinh viên tự đăng ký bằng mã tham gia.</p>
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
                Giảng viên phụ trách <span className="text-slate-400 text-xs font-normal">(Tùy chọn)</span>
              </label>
              <select 
                disabled={loadingLecturers}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#dd7323]/20 focus:border-[#dd7323] outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                value={formData.teacher_id || ''}
                onChange={e => setFormData({...formData, teacher_id: e.target.value ? parseInt(e.target.value) : undefined})}
              >
                <option value="">-- Chưa gán giảng viên --</option>
                {lecturers.map(lecturer => (
                  <option key={lecturer.id} value={lecturer.id}>
                    {lecturer.full_name} ({lecturer.email})
                  </option>
                ))}
              </select>
              {loadingLecturers && (
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <Loader2 size={12} className="animate-spin" />
                  Đang tải giảng viên...
                </p>
              )}
              <p className="text-xs text-slate-500 mt-1">
                {formData.teacher_id 
                  ? '⚡ Giảng viên sẽ nhận email thông báo về lớp học mới' 
                  : 'Có thể gán giảng viên sau khi tạo lớp'}
              </p>
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
              onClick={() => navigate('/admin/classes-management/list')}
              className="px-6 py-2.5 text-slate-600 font-medium hover:bg-slate-50 rounded-xl transition-colors"
            >
              Hủy bỏ
            </button>
            <button 
              type="submit" 
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#dd7323] text-white font-bold rounded-xl hover:bg-[#c2621a] transition-all shadow-lg shadow-orange-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Đang tạo...</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>Mở lớp</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateClass;
