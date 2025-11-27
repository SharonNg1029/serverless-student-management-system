import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Library } from 'lucide-react';
import type { Subject } from '../../../types';

const SubjectForm: React.FC = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const isEdit = !!subjectId;

  const [formData, setFormData] = useState<Partial<Subject>>({
    codeSubject: '',
    name: '',
    credits: 3,
    department: '',
    description: '',
    status: 1
  });

  useEffect(() => {
    if (isEdit) {
      // Mock fetch
      setFormData({
        codeSubject: 'INT3306',
        name: 'Phát triển ứng dụng Web',
        credits: 3,
        department: 'CNTT',
        description: 'Môn học về React, Nodejs, Serverless...',
        status: 1
      });
    }
  }, [isEdit, subjectId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(isEdit ? 'Đã cập nhật học phần!' : 'Đã thêm học phần mới!');
    navigate('/admin/subjects-management/list');
  };

  return (
    <div className="max-w-2xl mx-auto pb-10">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-slate-500 hover:text-[#dd7323] mb-4 transition-colors">
        <ArrowLeft size={16} /> Quay lại
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
          <div className="bg-[#dd7323]/10 p-2 rounded-lg text-[#dd7323]">
             <Library size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">{isEdit ? 'Chỉnh sửa Học phần' : 'Thêm Học phần mới'}</h1>
            <p className="text-slate-500 text-sm">{isEdit ? `Mã: ${formData.codeSubject}` : 'Nhập thông tin môn học tổng quát.'}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Mã học phần (Unique)</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#dd7323]/20 focus:border-[#dd7323] outline-none transition-all uppercase font-mono"
                value={formData.codeSubject}
                onChange={e => setFormData({...formData, codeSubject: e.target.value})}
                placeholder="VD: MATH101"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Số tín chỉ</label>
              <input 
                type="number" 
                min="1"
                max="20"
                required
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#dd7323]/20 focus:border-[#dd7323] outline-none transition-all"
                value={formData.credits}
                onChange={e => setFormData({...formData, credits: parseInt(e.target.value)})}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Tên học phần</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#dd7323]/20 focus:border-[#dd7323] outline-none transition-all"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Khoa / Phòng ban</label>
              <input 
                type="text" 
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#dd7323]/20 focus:border-[#dd7323] outline-none transition-all"
                value={formData.department}
                onChange={e => setFormData({...formData, department: e.target.value})}
                placeholder="VD: CNTT"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Trạng thái</label>
              <select 
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#dd7323]/20 focus:border-[#dd7323] outline-none transition-all"
                value={formData.status}
                onChange={e => setFormData({...formData, status: parseInt(e.target.value) as 1 | 0})}
              >
                <option value={1}>Hoạt động</option>
                <option value={0}>Ngưng hoạt động</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Mô tả</label>
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
              onClick={() => navigate('/admin/subjects-management/list')}
              className="px-6 py-2.5 text-slate-600 font-medium hover:bg-slate-50 rounded-xl transition-colors"
            >
              Hủy bỏ
            </button>
            <button 
              type="submit" 
              className="flex items-center gap-2 px-6 py-2.5 bg-[#dd7323] text-white font-bold rounded-xl hover:bg-[#c2621a] transition-all shadow-lg shadow-orange-200"
            >
              <Save size={18} />
              <span>{isEdit ? 'Lưu thay đổi' : 'Tạo mới'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubjectForm;
