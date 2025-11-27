import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, Legend
} from 'recharts';
import { Download, Calendar, Filter } from 'lucide-react';

// --- Data ---
const ENROLLMENT_DATA = [
  { month: 'T1', students: 1200, online: 800 },
  { month: 'T2', students: 1350, online: 950 },
  { month: 'T3', students: 1400, online: 1100 },
  { month: 'T4', students: 1380, online: 1050 },
  { month: 'T5', students: 1500, online: 1250 },
  { month: 'T6', students: 1650, online: 1400 },
];

const GRADE_DISTRIBUTION = [
  { name: 'A (8.5-10)', value: 15, color: '#10b981' }, // Emerald
  { name: 'B (7.0-8.4)', value: 35, color: '#3b82f6' }, // Blue
  { name: 'C (5.5-6.9)', value: 30, color: '#dd7323' }, // Orange (Brand)
  { name: 'D (4.0-5.4)', value: 15, color: '#f59e0b' }, // Amber
  { name: 'F (<4.0)', value: 5, color: '#ef4444' },    // Red
];

const SYSTEM_LOAD = [
  { time: '08:00', load: 45 },
  { time: '10:00', load: 80 },
  { time: '12:00', load: 30 },
  { time: '14:00', load: 75 },
  { time: '16:00', load: 60 },
  { time: '18:00', load: 20 },
];

const AnalyticsPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Thống kê & Báo cáo</h1>
          <p className="text-slate-500 mt-1">Phân tích dữ liệu học tập và hoạt động hệ thống.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-medium transition-colors shadow-sm text-sm">
            <Calendar size={16} />
            <span>Học kỳ I (2024-2025)</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#dd7323] text-white rounded-xl hover:bg-[#c2621a] font-medium transition-all shadow-lg shadow-orange-200 text-sm">
            <Download size={16} />
            <span>Xuất Báo cáo PDF</span>
          </button>
        </div>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-semibold text-slate-500 uppercase">Tổng lượt truy cập</h3>
          <p className="text-3xl font-bold text-slate-800 mt-2">1.2M</p>
          <div className="mt-4 h-16">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SYSTEM_LOAD}>
                <defs>
                  <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dd7323" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#dd7323" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="load" stroke="#dd7323" strokeWidth={2} fillOpacity={1} fill="url(#colorLoad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-semibold text-slate-500 uppercase">Tỷ lệ hoàn thành môn</h3>
          <p className="text-3xl font-bold text-slate-800 mt-2">89.4%</p>
          <p className="text-emerald-600 text-sm font-medium mt-1 flex items-center">
             +2.1% so với kỳ trước
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-semibold text-slate-500 uppercase">User Active (Realtime)</h3>
          <p className="text-3xl font-bold text-slate-800 mt-2">452</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-xs text-slate-500">Hệ thống hoạt động bình thường</span>
          </div>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrollment Trends */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800">Xu hướng tham gia học tập</h3>
            <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400">
              <Filter size={18} />
            </button>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ENROLLMENT_DATA}>
                <defs>
                  <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dd7323" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#dd7323" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOnline" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#293548" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#293548" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                <Legend iconType="circle" />
                <Area type="monotone" dataKey="students" name="Tổng tham gia" stroke="#dd7323" fillOpacity={1} fill="url(#colorStudents)" />
                <Area type="monotone" dataKey="online" name="Học Online" stroke="#293548" fillOpacity={1} fill="url(#colorOnline)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Grade Distribution */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800">Phân phối điểm số</h3>
            <select className="text-sm border-none bg-slate-50 rounded-lg px-2 py-1 text-slate-600 outline-none">
              <option>Tất cả khoa</option>
              <option>CNTT</option>
              <option>Kinh tế</option>
            </select>
          </div>
          <div className="h-80 flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={GRADE_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {GRADE_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="vertical" verticalAlign="middle" align="right" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;