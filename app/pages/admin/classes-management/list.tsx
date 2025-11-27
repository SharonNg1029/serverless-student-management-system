import React from 'react';
import { useNavigate } from 'react-router-dom';
import TableList, { type Column } from '../../../components/common/TableList';
import { Calendar, User, CheckCircle, Clock, Edit, Key } from 'lucide-react';
import type { Class } from '../../../types';

// Mock data extended with DB fields
const mockData: Class[] = [
  {
    id: 1,
    subject_id: 1,
    name: 'Lớp 01',
    password: '123',
    semester: '1',
    academic_year: '2024-2025',
    student_count: 38,
    status: 1,
    subjectName: 'Phát triển ứng dụng Web',
    lecturerName: 'TS. Nguyễn Văn An',
    classCode: 'CLS001',
    subjectId: 1,
    lecturerId: 1,
    year: 2024
  },
  {
    id: 2,
    subject_id: 2,
    name: 'Lớp CLC',
    password: '456',
    semester: '1',
    academic_year: '2024-2025',
    student_count: 40,
    status: 1,
    subjectName: 'Trí tuệ nhân tạo',
    lecturerName: 'PGS. Trần Thị B',
    classCode: 'CLS002',
    subjectId: 2,
    lecturerId: 2,
    year: 2024
  },
  {
    id: 3,
    subject_id: 1,
    name: 'Lớp 02',
    password: '789',
    semester: '1',
    academic_year: '2024-2025',
    student_count: 15,
    status: 0, // Inactive
    subjectName: 'Phát triển ứng dụng Web',
    lecturerName: 'ThS. Lê Văn C',
    classCode: 'CLS003',
    subjectId: 1,
    lecturerId: 3,
    year: 2024
  },
];

const ClassesList: React.FC = () => {
  const navigate = useNavigate();

  const columns: Column<Class>[] = [
    {
      header: 'Tên lớp / Học phần',
      accessor: 'name',
      render: (row) => (
        <div>
          <div className="font-bold text-[#293548] flex items-center gap-2">
            {row.name}
            {row.password && (
               <span className="text-[10px] bg-slate-100 text-slate-500 px-1 rounded border border-slate-200 flex items-center gap-0.5" title="Passcode">
                 <Key size={8} /> {row.password}
               </span>
            )}
          </div>
          <div className="text-xs text-slate-500 font-semibold">{row.subjectName}</div>
        </div>
      )
    },
    {
      header: 'Giảng viên',
      accessor: 'lecturerName',
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
            <User size={12} />
          </div>
          <span className="text-slate-700 text-sm">{row.lecturerName}</span>
        </div>
      )
    },
    {
      header: 'Học kỳ',
      accessor: 'semester',
      render: (row) => (
        <div className="flex flex-col gap-1 text-xs">
          <div className="flex items-center gap-1.5 text-slate-600 font-medium">
            <Calendar size={12} className="text-[#d97b2a]" />
            HK{row.semester} / {row.academic_year}
          </div>
        </div>
      )
    },
    {
      header: 'Sĩ số',
      accessor: 'student_count',
      render: (row) => (
        <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${(row.student_count ?? 0) >= 40 ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
          {row.student_count ?? 0} / 40
        </span>
      )
    },
    {
      header: 'Trạng thái',
      accessor: 'status',
      render: (row) => (
        row.status === 1 ? (
           <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold text-emerald-600 bg-emerald-50">
             <Clock size={12} /> Đang hoạt động
           </span>
        ) : (
           <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold text-slate-500 bg-slate-100">
             <CheckCircle size={12} /> Đã đóng
           </span>
        )
      )
    },
    {
      header: 'Thao tác',
      accessor: 'id',
      render: (row) => (
         <button 
           onClick={() => navigate(`/admin/classes-management/edit/${row.id}`)}
           className="p-2 text-slate-400 hover:text-[#dd7323] hover:bg-orange-50 rounded-lg transition-colors"
           title="Chỉnh sửa"
         >
            <Edit size={16} />
         </button>
      )
    }
  ];

  return (
    <TableList 
      title="Quản lý Lớp học"
      subtitle="Danh sách các lớp học phần và mã tham gia (Passcode)."
      data={mockData}
      columns={columns}
      onAdd={() => navigate('/admin/classes-management/form')}
      onSearch={(term) => console.log('Searching:', term)}
    />
  );
};

export default ClassesList;
