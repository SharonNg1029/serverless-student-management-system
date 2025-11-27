import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, Legend
} from 'recharts';
import { Download, Calendar, Filter, Trophy, TrendingUp, Award, Search, Loader2, BookOpen } from 'lucide-react';
import api from '../../utils/axios';
import { toaster } from '../../components/ui/toaster';

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

// RankingDTO from backend
interface RankingDTO {
  student_id: number;
  rank: number;
  score: number;
  recommendations: string;
  student_name?: string;
  student_email?: string;
}

interface ClassInfo {
  id: number;
  name: string;
  subject_name?: string;
}

const AnalyticsPage: React.FC = () => {
  // Ranking states
  const [rankingData, setRankingData] = useState<RankingDTO[]>([]);
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [loadingRanking, setLoadingRanking] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(false);

  // Fetch classes for dropdown
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoadingClasses(true);
        const response = await api.get<{ results: any[] }>('/admin/classes', {
          params: { status: 1 } // Only active classes
        });
        
        const classesData: ClassInfo[] = response.data.results.map(c => ({
          id: c.id,
          name: c.name,
          subject_name: c.subject_name
        }));
        
        setClasses(classesData);
      } catch (error: any) {
        console.error('Error fetching classes:', error);
        toaster.create({
          title: 'Lỗi',
          description: 'Không thể tải danh sách lớp học',
          type: 'error'
        });
      } finally {
        setLoadingClasses(false);
      }
    };

    fetchClasses();
  }, []);

  // Fetch ranking data when class selected
  const fetchRanking = async () => {
    if (!selectedClassId) {
      toaster.create({
        title: 'Thiếu thông tin',
        description: 'Vui lòng chọn lớp học để xem ranking',
        type: 'warning'
      });
      return;
    }

    try {
      setLoadingRanking(true);
      const response = await api.get<RankingDTO[]>('/admin/ranking', {
        params: { class_id: selectedClassId }
      });
      
      setRankingData(response.data);
      
      if (response.data.length === 0) {
        toaster.create({
          title: 'Thông báo',
          description: 'Chưa có dữ liệu điểm cho lớp này',
          type: 'info'
        });
      }
    } catch (error: any) {
      console.error('Error fetching ranking:', error);
      toaster.create({
        title: 'Lỗi',
        description: error.response?.data?.message || 'Không thể tải ranking',
        type: 'error'
      });
      setRankingData([]);
    } finally {
      setLoadingRanking(false);
    }
  };

  // Auto-fetch ranking when class changes
  useEffect(() => {
    if (selectedClassId) {
      fetchRanking();
    } else {
      setRankingData([]);
    }
  }, [selectedClassId]);

  // Get medal icon for top 3
  const getMedalIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="text-yellow-500" size={20} />;
    if (rank === 2) return <Trophy className="text-gray-400" size={20} />;
    if (rank === 3) return <Trophy className="text-amber-600" size={20} />;
    return null;
  };

  // Get score color
  const getScoreColor = (score: number) => {
    if (score >= 8.5) return 'text-green-600 bg-green-50';
    if (score >= 7.0) return 'text-blue-600 bg-blue-50';
    if (score >= 5.5) return 'text-orange-600 bg-orange-50';
    if (score >= 4.0) return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
  };

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

      {/* Ranking Section - New Feature */}
      <div className="bg-gradient-to-br from-orange-50 to-white rounded-2xl shadow-sm border border-orange-100 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-[#dd7323] p-2 rounded-lg">
            <Trophy size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Xếp hạng theo Lớp</h2>
            <p className="text-sm text-slate-600">Xem ranking và gợi ý cải thiện cho học sinh trong lớp</p>
          </div>
        </div>

        {/* Class Selector */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <BookOpen size={14} className="inline mr-1" />
              Chọn lớp học (bắt buộc)
            </label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              disabled={loadingClasses}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#dd7323] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">-- Chọn lớp học --</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>
                  {cls.name} {cls.subject_name ? `(${cls.subject_name})` : ''}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={fetchRanking}
            disabled={!selectedClassId || loadingRanking}
            className="mt-7 flex items-center gap-2 px-6 py-2.5 bg-[#dd7323] text-white font-medium rounded-lg hover:bg-[#c2621a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingRanking ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Đang tải...
              </>
            ) : (
              <>
                <Search size={18} />
                Xem Ranking
              </>
            )}
          </button>
        </div>

        {/* Ranking Table */}
        {rankingData.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-4">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider w-20">
                      Hạng
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Sinh viên
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider w-32">
                      Điểm TB
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Gợi ý từ AI
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {rankingData.map((student) => (
                    <tr 
                      key={student.student_id} 
                      className={`hover:bg-slate-50 transition-colors ${student.rank <= 3 ? 'bg-orange-50/30' : ''}`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {getMedalIcon(student.rank)}
                          <span className={`font-bold ${student.rank <= 3 ? 'text-lg' : 'text-slate-700'}`}>
                            #{student.rank}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-slate-900">
                            {student.student_name || `Student ID: ${student.student_id}`}
                          </span>
                          {student.student_email && (
                            <span className="text-xs text-slate-500">{student.student_email}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center">
                          <span className={`inline-flex px-3 py-1.5 text-sm font-bold rounded-lg ${getScoreColor(student.score)}`}>
                            {student.score.toFixed(2)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-start gap-2">
                          <TrendingUp size={16} className="text-[#dd7323] mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-slate-700">{student.recommendations}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Stats Footer */}
            <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <div className="text-sm text-slate-600">
                Hiển thị <span className="font-semibold text-slate-900">{rankingData.length}</span> sinh viên
              </div>
              {rankingData.length > 0 && (
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span>Giỏi: {rankingData.filter(s => s.score >= 8.5).length}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span>Khá: {rankingData.filter(s => s.score >= 7.0 && s.score < 8.5).length}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span>TB: {rankingData.filter(s => s.score >= 5.5 && s.score < 7.0).length}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span>Yếu: {rankingData.filter(s => s.score < 5.5).length}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!selectedClassId && !loadingRanking && (
          <div className="bg-white rounded-xl border-2 border-dashed border-slate-300 p-12 text-center">
            <Award size={48} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500 font-medium">Chọn lớp học để xem ranking</p>
            <p className="text-slate-400 text-sm mt-1">Hệ thống sẽ tính toán điểm tổng kết và gợi ý cải thiện</p>
          </div>
        )}

        {selectedClassId && !loadingRanking && rankingData.length === 0 && (
          <div className="bg-white rounded-xl border-2 border-dashed border-slate-300 p-12 text-center">
            <Award size={48} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500 font-medium">Chưa có dữ liệu điểm</p>
            <p className="text-slate-400 text-sm mt-1">Lớp này chưa có sinh viên hoặc chưa có điểm</p>
          </div>
        )}
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