import React, { useState } from 'react';
import { Send, Users, User, Clock, AlertCircle } from 'lucide-react';

const SendNotificationPage: React.FC = () => {
  const [recipientGroup, setRecipientGroup] = useState('all');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState('normal');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Đã gửi thông báo: "${title}" đến nhóm: ${recipientGroup}`);
    // API call logic here
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Gửi thông báo hệ thống</h1>
        <p className="text-slate-500 mt-1">Tạo và gửi thông báo đến sinh viên, giảng viên hoặc toàn trường.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
            
            {/* Recipient Selection */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Người nhận</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setRecipientGroup('all')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                    recipientGroup === 'all' 
                    ? 'border-[#dd7323] bg-orange-50 text-[#dd7323]' 
                    : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <Users size={20} className="mb-2" />
                  <span className="text-xs font-semibold">Toàn trường</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRecipientGroup('student')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                    recipientGroup === 'student' 
                    ? 'border-[#dd7323] bg-orange-50 text-[#dd7323]' 
                    : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <User size={20} className="mb-2" />
                  <span className="text-xs font-semibold">Sinh viên</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRecipientGroup('lecturer')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                    recipientGroup === 'lecturer' 
                    ? 'border-[#dd7323] bg-orange-50 text-[#dd7323]' 
                    : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <GraduationCapIcon />
                  <span className="text-xs font-semibold">Giảng viên</span>
                </button>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Tiêu đề thông báo</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ví dụ: Lịch nghỉ lễ..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#dd7323]/20 focus:border-[#dd7323] outline-none transition-all text-slate-700"
                required
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Nội dung chi tiết</label>
              <textarea
                rows={6}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Nhập nội dung thông báo..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#dd7323]/20 focus:border-[#dd7323] outline-none transition-all text-slate-700 resize-none"
                required
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Mức độ ưu tiên</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="priority" 
                    value="normal" 
                    checked={priority === 'normal'} 
                    onChange={() => setPriority('normal')}
                    className="accent-[#dd7323]"
                  />
                  <span className="text-sm text-slate-600">Bình thường</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="priority" 
                    value="high" 
                    checked={priority === 'high'} 
                    onChange={() => setPriority('high')}
                    className="accent-red-500"
                  />
                  <span className="text-sm text-slate-600">Cao (Gửi kèm Email)</span>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
              <button type="button" className="px-6 py-2.5 text-slate-600 font-medium hover:bg-slate-50 rounded-xl transition-colors">
                Hủy bỏ
              </button>
              <button 
                type="submit" 
                className="flex items-center gap-2 px-6 py-2.5 bg-[#dd7323] text-white font-bold rounded-xl hover:bg-[#c2621a] transition-all shadow-lg shadow-orange-200"
              >
                <Send size={18} />
                <span>Gửi ngay</span>
              </button>
            </div>
          </form>
        </div>

        {/* Preview Section */}
        <div>
           <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Xem trước</h3>
           <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-full bg-[#dd7323]"></div>
             <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2 text-[#dd7323] text-xs font-bold uppercase tracking-wide">
                  <AlertCircle size={14} />
                  <span>Thông báo mới</span>
                </div>
                <span className="text-xs text-slate-400">Vừa xong</span>
             </div>
             <h4 className="font-bold text-slate-800 text-lg mb-2">
               {title || 'Tiêu đề thông báo...'}
             </h4>
             <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
               {content || 'Nội dung thông báo sẽ hiển thị ở đây...'}
             </p>
             <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2">
               <div className="w-6 h-6 rounded-full bg-[#293548] flex items-center justify-center text-white text-[10px] font-bold">A</div>
               <span className="text-xs text-slate-500 font-medium">Gửi bởi Ban Đào tạo</span>
             </div>
           </div>

           <div className="mt-6 bg-blue-50 p-4 rounded-xl border border-blue-100">
              <h4 className="flex items-center gap-2 text-sm font-bold text-blue-700 mb-2">
                <Clock size={16} />
                Lưu ý
              </h4>
              <p className="text-xs text-blue-600/80 leading-relaxed">
                Hệ thống sẽ gửi thông báo đẩy (push notification) đến thiết bị di động của người dùng ngay lập tức. Nếu chọn ưu tiên Cao, một bản sao sẽ được gửi qua Email.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

// Helper icon
const GraduationCapIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
)

export default SendNotificationPage;