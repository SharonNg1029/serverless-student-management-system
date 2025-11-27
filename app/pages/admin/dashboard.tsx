import React from 'react';
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  TrendingDown, 
  ClipboardCheck, 
  Plus, 
  FileText,
  AlertTriangle,
  Clock,
  Calendar as CalendarIcon,
  Bell as BellIcon,
  MoreHorizontal,
  GraduationCap
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// --- Types ---
interface StatCardProps {
  title: string;
  value: string;
  trend: number;
  trendLabel: string;
  icon: React.ReactNode;
  variant: 'orange' | 'blue' | 'amber' | 'emerald';
}

// --- Data Constants (University Context) ---
const FACULTY_PERFORMANCE_DATA = [
  { name: 'CNTT', score: 3.25 }, // GPA / 4.0
  { name: 'Kinh tế', score: 3.42 },
  { name: 'Ngoại ngữ', score: 3.15 },
  { name: 'Điện tử', score: 2.95 },
  { name: 'Cơ khí', score: 2.88 },
];

// Updated colors based on request
const STUDENT_CLASSIFICATION_DATA = [
  { name: 'Xuất sắc', value: 150, color: '#10b981' },    // Emerald - Requested
  { name: 'Giỏi', value: 450, color: '#3b82f6' },        // Blue - Requested
  { name: 'Khá', value: 500, color: '#dd7323' },         // Brand Orange - Requested
  { name: 'Trung bình', value: 100, color: '#f59e0b' },  // Amber - Requested
  { name: 'Yếu/Kém', value: 50, color: '#ef4444' },      // Red - Requested
];

const NOTIFICATIONS = [
  {
    id: 1,
    title: 'Công bố lịch thi kết thúc học phần HK1',
    time: '2 giờ trước',
    icon: <BellIcon size={16} className="text-[#dd7323]" />,
    bg: 'bg-orange-50',
    type: 'Academic'
  },
  {
    id: 2,
    title: 'Hạn cuối đăng ký tín chỉ đợt 2',
    time: '1 ngày trước',
    icon: <CalendarIcon size={16} className="text-[#293548]" />,
    bg: 'bg-slate-100',
    type: 'System'
  },
  {
    id: 3,
    title: 'Thông báo nghỉ lễ 30/4 - 1/5',
    time: '3 ngày trước',
    icon: <FileText size={16} className="text-emerald-600" />,
    bg: 'bg-emerald-50',
    type: 'General'
  },
];

const RISK_STUDENTS = [
  {
    id: 'SV2021001',
    name: 'Nguyễn Văn Hùng',
    faculty: 'CNTT - K15',
    reason: 'Vắng 30% số buổi',
    riskLevel: 85,
    avatar: 'https://ui-avatars.com/api/?name=Nguyen+Hung&background=random'
  },
  {
    id: 'SV2022045',
    name: 'Trần Thị Mai',
    faculty: 'Kinh tế - K16',
    reason: 'Cảnh báo học vụ mức 2',
    riskLevel: 72,
    avatar: 'https://ui-avatars.com/api/?name=Tran+Mai&background=random'
  },
  {
    id: 'SV2022099',
    name: 'Lê Minh Tú',
    faculty: 'Điện tử - K16',
    reason: 'GPA kỳ trước < 1.0',
    riskLevel: 90,
    avatar: 'https://ui-avatars.com/api/?name=Le+Tu&background=random'
  }
];

// --- Components ---

const StatCard: React.FC<StatCardProps> = ({ title, value, trend, trendLabel, icon, variant }) => {
  // Define styles map
  const styles = {
    orange: { iconBg: 'bg-orange-50', iconText: 'text-[#dd7323]', trendPos: 'text-emerald-600 bg-emerald-50', trendNeg: 'text-rose-600 bg-rose-50' },
    blue: { iconBg: 'bg-[#293548]/10', iconText: 'text-[#293548]', trendPos: 'text-emerald-600 bg-emerald-50', trendNeg: 'text-rose-600 bg-rose-50' },
    amber: { iconBg: 'bg-amber-50', iconText: 'text-amber-600', trendPos: 'text-emerald-600 bg-emerald-50', trendNeg: 'text-rose-600 bg-rose-50' },
    emerald: { iconBg: 'bg-emerald-50', iconText: 'text-emerald-600', trendPos: 'text-emerald-600 bg-emerald-50', trendNeg: 'text-rose-600 bg-rose-50' },
  };

  const currentStyle = styles[variant];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-slate-800 tracking-tight">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl transition-colors ${currentStyle.iconBg} ${currentStyle.iconText}`}>
          {icon}
        </div>
      </div>
      <div className="flex items-center text-sm">
        {trend > 0 ? (
          <span className={`flex items-center font-bold px-2 py-0.5 rounded-md ${currentStyle.trendPos}`}>
            <TrendingUp size={14} className="mr-1" /> +{trend}%
          </span>
        ) : (
          <span className={`flex items-center font-bold px-2 py-0.5 rounded-md ${currentStyle.trendNeg}`}>
            <TrendingDown size={14} className="mr-1" /> {trend}%
          </span>
        )}
        <span className="text-slate-400 ml-2 font-medium">{trendLabel}</span>
      </div>
    </div>
  );
};

const RiskItem: React.FC<{ student: typeof RISK_STUDENTS[0] }> = ({ student }) => (
  <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-white hover:border-orange-100 hover:shadow-sm transition-all group">
    <div className="flex items-center gap-4">
      <div className="relative">
        <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm" />
        <span className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white rounded-full flex items-center justify-center text-[8px] font-bold text-white ${student.riskLevel > 80 ? 'bg-red-500' : 'bg-amber-500'}`}>!</span>
      </div>
      <div>
        <h4 className="font-bold text-slate-800 text-sm">{student.name}</h4>
        <p className="text-xs text-slate-500">{student.id} • {student.faculty}</p>
      </div>
    </div>
    <div className="text-right">
       <span className="text-xs font-semibold text-slate-500 block mb-1">{student.reason}</span>
       <div className="flex items-center gap-2 justify-end">
        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full ${student.riskLevel > 80 ? 'bg-red-500' : 'bg-amber-500'}`}
            style={{ width: `${student.riskLevel}%` }} 
          />
        </div>
      </div>
    </div>
  </div>
);

const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-8 pb-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tổng quan Hệ thống</h1>
          <p className="text-slate-500 mt-1">Chào mừng quay trở lại, Admin. Dưới đây là báo cáo ngày hôm nay.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-medium transition-colors shadow-sm text-sm">
            <FileText size={16} />
            <span className="hidden sm:inline">Xuất báo cáo</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#dd7323] text-white rounded-xl hover:bg-[#c2621a] font-medium transition-all shadow-lg shadow-orange-200 text-sm">
            <Plus size={16} />
            <span>Thêm Sinh viên</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Tổng sinh viên" 
          value="12,450" 
          trend={3.2} 
          trendLabel="Kỳ này"
          icon={<Users size={24} />}
          variant="orange"
        />
        <StatCard 
          title="Lớp tín chỉ hoạt động" 
          value="845" 
          trend={5.4} 
          trendLabel="Đang mở"
          icon={<BookOpen size={24} />}
          variant="blue"
        />
        <StatCard 
          title="GPA trung bình toàn trường" 
          value="3.12" 
          trend={-0.8} 
          trendLabel="So với kỳ trước"
          icon={<GraduationCap size={24} />}
          variant="amber"
        />
        <StatCard 
          title="Tỷ lệ chuyên cần" 
          value="94.5%" 
          trend={1.2} 
          trendLabel="Tuần này"
          icon={<ClipboardCheck size={24} />}
          variant="emerald"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <div>
               <h3 className="text-lg font-bold text-slate-800">Hiệu suất học tập theo Khoa</h3>
               <p className="text-xs text-slate-400">Điểm trung bình (GPA) tính trên thang 4.0</p>
            </div>
            <select className="text-sm border-none bg-slate-50 rounded-lg px-3 py-2 text-slate-600 outline-none focus:ring-2 focus:ring-orange-100 cursor-pointer font-medium hover:bg-slate-100 transition-colors">
              <option>Học kỳ 1 - 2024</option>
              <option>Học kỳ 2 - 2023</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={FACULTY_PERFORMANCE_DATA} barSize={48}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }} 
                  domain={[0, 4]}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ color: '#1e293b', fontWeight: 600 }}
                  formatter={(value) => [value, 'GPA']}
                />
                <Bar 
                  dataKey="score" 
                  fill="#f59e0b" 
                  radius={[8, 8, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-800">Phân loại học lực</h3>
             <p className="text-xs text-slate-400">Tỷ lệ sinh viên theo xếp loại</p>
          </div>
          <div className="flex-1 min-h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={STUDENT_CLASSIFICATION_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                  cornerRadius={6}
                  stroke="none"
                >
                  {STUDENT_CLASSIFICATION_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-bold text-slate-800">12.5K</span>
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">Tổng SV</span>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            {STUDENT_CLASSIFICATION_DATA.slice(0, 3).map((item) => (
              <div key={item.name} className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                <span className="text-xs text-slate-600 font-medium">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Prediction */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-red-50 p-2.5 rounded-xl text-red-500">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Cảnh báo nguy cơ nghỉ học</h3>
                <p className="text-xs text-slate-500">AI Analysis • Dựa trên chuyên cần & GPA</p>
              </div>
            </div>
            <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-[#dd7323] transition-colors">
              <MoreHorizontal size={20} />
            </button>
          </div>
          <div className="p-4 space-y-3">
            {RISK_STUDENTS.map(student => (
              <RiskItem key={student.id} student={student} />
            ))}
            <button className="w-full py-3 mt-2 text-sm font-medium text-[#dd7323] hover:bg-orange-50 rounded-xl transition-colors border border-dashed border-orange-200">
              Xem toàn bộ danh sách cảnh báo
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800">Thông báo mới</h3>
            <span className="bg-[#dd7323] text-white text-xs font-bold px-2 py-1 rounded-md">3 mới</span>
          </div>
          <div className="p-6 space-y-6 flex-1">
            {NOTIFICATIONS.map(notif => (
              <div key={notif.id} className="flex gap-4 group cursor-pointer">
                <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${notif.bg} group-hover:scale-110 duration-200`}>
                  {notif.icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 leading-snug mb-1 group-hover:text-[#dd7323] transition-colors">{notif.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Clock size={12} />
                    <span>{notif.time}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span>{notif.type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
            <button className="text-sm font-semibold text-slate-500 hover:text-[#dd7323] transition-colors">
              Xem tất cả thông báo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;