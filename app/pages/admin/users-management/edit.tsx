import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, UserCog, Calendar } from 'lucide-react';
import type { UserEntity } from '../../../types';

const UserEdit: React.FC = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<UserEntity>>({
    name: '',
    email: '',
    role_id: 3,
    codeUser: '',
    date_of_birth: '',
    status: 1
  });

  useEffect(() => {
    // Mock fetch data based on userId
    if (userId) {
      setFormData({
        id: parseInt(userId),
        name: 'Nguyễn Văn Hùng',
        email: 'hung.nv@student.edu.vn',
        role_id: 3,
        codeUser: 'SV2021001',
        date_of_birth: '2003-05-20',
        status: 1
      });
    }
  }, [userId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Update user payload:', formData);
    alert('Đã cập nhật thông tin thành công!');
    navigate('/admin/users-management/list');
  };

  return (
    <div className="max-w-2xl mx-auto pb-10">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-slate-500 hover:text-[#dd7323] mb-4 transition-colors">
        <ArrowLeft size={16} /> Quay lại
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
          <div className="bg-[#293548]/10 p-2 rounded-lg text-[#293548]">
             <UserCog size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Chỉnh sửa hồ sơ</h1>
            <p className="text-slate-500 text-sm">Cập nhật thông tin cho tài khoản <span className="font-mono font-bold text-[#dd7323]">{formData.codeUser}</span></p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Role Selection */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Vai trò (Role)</label>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: 3, label: 'Student' },
                  { id: 2, label: 'Lecturer' },
                  { id: 1, label: 'Admin' }
                ].map((role) => (
                  <label 
                    key={role.id}
                    className={`flex items-center justify-center p-3 rounded-xl border cursor-pointer transition-all ${
                      formData.role_id === role.id 
                      ? 'border-[#293548] bg-slate-100 text-[#293548] font-bold shadow-sm' 
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="role_id"
                      className="hidden"
                      checked={formData.role_id === role.id}
                      onChange={() => setFormData({...formData, role_id: role.id})}
                    />
                    {role.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Họ và Tên</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#dd7323]/20 focus:border-[#dd7323] outline-none transition-all"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Mã định danh (codeUser)</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#dd7323]/20 focus:border-[#dd7323] outline-none transition-all font-mono uppercase"
                value={formData.codeUser}
                onChange={e => setFormData({...formData, codeUser: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Ngày sinh</label>
              <div className="relative">
                <input 
                  type="date" 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#dd7323]/20 focus:border-[#dd7323] outline-none transition-all text-slate-700"
                  value={formData.date_of_birth}
                  onChange={e => setFormData({...formData, date_of_birth: e.target.value})}
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
              <input 
                type="email" 
                required
                disabled
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-500 cursor-not-allowed"
                value={formData.email}
              />
              <p className="text-xs text-slate-400 mt-1">Không thể thay đổi email đã đăng ký.</p>
            </div>
            
            <div className="md:col-span-2">
               <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={formData.status === 1}
                      onChange={(e) => setFormData({...formData, status: e.target.checked ? 1 : 0})}
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700 block">Trạng thái hoạt động</span>
                    <span className="text-xs text-slate-500">Gạt sang trái để Ban (Khóa) tài khoản này.</span>
                  </div>
               </label>
            </div>

          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={() => navigate('/admin/users-management/list')}
              className="px-6 py-2.5 text-slate-600 font-medium hover:bg-slate-50 rounded-xl transition-colors"
            >
              Hủy bỏ
            </button>
            <button 
              type="submit" 
              className="flex items-center gap-2 px-6 py-2.5 bg-[#293548] text-white font-bold rounded-xl hover:bg-[#1e2736] transition-all shadow-sm"
            >
              <Save size={18} />
              <span>Lưu thay đổi</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserEdit;
