import React from 'react';
import { useNavigate } from 'react-router-dom';
import TableList, { type Column } from '../../../components/common/TableList';
import { Edit, Book } from 'lucide-react';
import type { Subject } from '../../../types';

const mockSubjects: Subject[] = [
  { id: 1, codeSubject: 'INT3306', name: 'Phát triển ứng dụng Web', credits: 3, department: 'CNTT', status: 1 },
  { id: 2, codeSubject: 'INT3401', name: 'Trí tuệ nhân tạo', credits: 3, department: 'CNTT', status: 1 },
  { id: 3, codeSubject: 'MAT1093', name: 'Đại số tuyến tính', credits: 4, department: 'Toán - Cơ', status: 1 },
  { id: 4, codeSubject: 'PHI1006', name: 'Triết học Mác - Lênin', credits: 3, department: 'Lý luận chính trị', status: 0 },
  { id: 5, codeSubject: 'FLF1107', name: 'Tiếng Anh B1', credits: 5, department: 'NN & VH Anh Mỹ', status: 1 },
];

const SubjectsList: React.FC = () => {
  const navigate = useNavigate();

  const columns: Column<Subject>[] = [
    {
      header: 'Mã HP',
      accessor: 'codeSubject',
      render: (row) => (
        <span className="font-mono font-bold text-[#293548] px-2 py-1 bg-slate-100 rounded text-xs border border-slate-200">
          {row.codeSubject}
        </span>
      )
    },
    {
      header: 'Tên học phần',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Book size={16} className="text-[#dd7323]" />
          <span className="font-medium text-slate-700">{row.name}</span>
        </div>
      )
    },
    {
      header: 'Số TC',
      accessor: 'credits',
      className: 'text-center',
      render: (row) => <div className="text-center font-bold text-slate-600">{row.credits}</div>
    },
    {
      header: 'Bộ môn / Khoa',
      accessor: 'department',
    },
    {
      header: 'Trạng thái',
      accessor: 'status',
      render: (row) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${row.status === 1 ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
          {row.status === 1 ? 'Đang mở' : 'Đóng'}
        </span>
      )
    },
    {
      header: 'Thao tác',
      accessor: 'id',
      render: (row) => (
         <button 
           onClick={() => navigate(`/admin/subjects-management/edit/${row.id}`)}
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
      title="Quản lý Học phần"
      subtitle="Danh sách các môn học trong chương trình đào tạo (Tổng quát)."
      data={mockSubjects}
      columns={columns}
      onAdd={() => navigate('/admin/subjects-management/form')}
      onImport={() => alert('Import học phần')}
    />
  );
};

export default SubjectsList;
