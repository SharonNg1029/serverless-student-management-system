import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, BookOpen, Key, Calendar } from 'lucide-react';
import type { Class } from '../../../types';

const ClassForm: React.FC = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const isEdit = !!classId;

  const [formData, setFormData] = useState<Partial<Class>>({
    subject_id: undefined,
    name: '', // VD: Lớp 01
    password: '', // Passcode join
    teacher_id: undefined,
    student_count: 40,
    semester: '1',
    academic_year: '2025-2026',
    status: 1,
    description: ''
  });

  useEffect(() => {
    if (isEdit) {
      // Mock fetch
      setFormData({
        subject_id: 1,
        name: 'Lớp 01',
        password: '123',
        teacher_id: 2,
        student_count: 40,
        semester: '1',
        academic_year: '2024-2025',
        status: 1,
        description: 'Lớp học phần lý thuyết + thực hành'
      });
    }
  }, [isEdit, classId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Class payload:", formData);
    alert(isEdit ? 'Đã cập nhật lớp học!' : 'Đã mở lớp học mới!');
    navigate('/admin/classes-management/list');
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
            <h1 className="text-xl font-bold text-slate-800">{isEdit ? 'Chỉnh sửa Lớp học' : 'Mở Lớp học mới'}</h1>
            <p className="text-slate-500 text-sm">Tạo lớp cụ thể từ học phần (Subject).</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Chọn Học phần (Subject)</label>
              <select 
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#dd7323]/20 focus:border-[#dd7323] outline-none transition-all"
                value={formData.subject_id}
                onChange={e => setFormData({...formData, subject_id: parseInt(e.target.value)})}
              >
                <option value="">-- Chọn Học phần --</option>
                <option value="1">INT3306 - Phát triển ứng dụng Web</option>
                <option value="2">INT3401 - Trí tuệ nhân tạo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Tên lớp</label>
              <input 
                type="text" 
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
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#dd7323]/20 focus:border-[#dd7323] outline-none transition-all"
                value={formData.student_count}
                max={40}
                onChange={e => setFormData({...formData, student_count: parseInt(e.target.value)})}
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
                  placeholder="2024-2025"
                  onChange={e => setFormData({...formData, academic_year: e.target.value})}
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Giảng viên (Dựa trên Subject Assignment)</label>
              <select 
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#dd7323]/20 focus:border-[#dd7323] outline-none transition-all"
                value={formData.teacher_id}
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
                   Mã tham gia lớp (Passcode)
                </label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#dd7323]/20 focus:border-[#dd7323] outline-none transition-all font-mono tracking-widest"
                  value={formData.password}
                  placeholder="VD: 123456"
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
                <p className="text-xs text-slate-500 mt-2">Sinh viên cần nhập mã này để tham gia lớp (Join Class).</p>
            </div>
            
            <div className="md:col-span-2">
               <label className="block text-sm font-bold text-slate-700 mb-2">Mô tả lớp học</label>
               <textarea 
                  rows={3}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#dd7323]/20 focus:border-[#dd7323] outline-none transition-all"
                  value={formData.description}
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
              className="flex items-center gap-2 px-6 py-2.5 bg-[#dd7323] text-white font-bold rounded-xl hover:bg-[#c2621a] transition-all shadow-lg shadow-orange-200"
            >
              <Save size={18} />
              <span>{isEdit ? 'Lưu thay đổi' : 'Mở lớp'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClassForm;
