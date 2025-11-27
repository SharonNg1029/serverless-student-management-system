import React from 'react';
import { useNavigate } from 'react-router-dom';
import TableList from '../../../components/common/TableList';
import type { Column } from '../../../components/common/TableList';
import { Mail, UserCheck, UserX, Edit, Hash } from 'lucide-react';
import type { UserEntity } from '../../../types';

// Extended type for display with additional fields
type UserDisplay = UserEntity & {
  role_name: string;
  created_at: string;
  avatar?: string | null;
};

const mockUsers: UserDisplay[] = [
  { id: 1, codeUser: 'SV2021001', name: 'Nguyễn Văn Hùng', email: 'hung.nv@student.edu.vn', role_id: 3, role_name: 'student', status: 1, created_at: '2023-09-01' },
  { id: 2, codeUser: 'GV0015', name: 'Trần Thị Mai', email: 'mai.tt@lecturer.edu.vn', role_id: 2, role_name: 'lecturer', status: 1, created_at: '2022-01-15' },
  { id: 3, codeUser: 'SV2021099', name: 'Lê Minh Tú', email: 'tu.lm@student.edu.vn', role_id: 3, role_name: 'student', status: 0, created_at: '2023-09-01' }, // Banned
  { id: 4, codeUser: 'AD001', name: 'Phạm Admin', email: 'admin@edu.vn', role_id: 1, role_name: 'admin', status: 1, created_at: '2021-01-01' },
];

const UsersList: React.FC = () => {
  const navigate = useNavigate();

  const columns: Column<UserDisplay>[] = [
    {
      header: 'Thông tin cá nhân',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <img 
            src={row.avatar || `https://ui-avatars.com/api/?name=${row.name}&background=random`} 
            alt={row.name}
            className="w-10 h-10 rounded-full object-cover border border-slate-200"
          />
          <div>
            <div className="font-bold text-slate-800 text-sm">{row.name}</div>
            <div className="text-xs text-slate-500 flex items-center gap-1">
               <Mail size={10} /> {row.email}
            </div>
          </div>
        </div>
      )
    },
    {
      header: 'Mã định danh',
      accessor: 'codeUser',
      render: (row) => (
        <div className="flex items-center gap-1.5 text-slate-600 font-mono text-xs bg-slate-100 px-2 py-1 rounded w-fit">
          <Hash size={10} />
          {row.codeUser}
        </div>
      )
    },
    {
      header: 'Vai trò',
      accessor: 'role_name',
      render: (row) => {
        const roles: Record<string, { label: string; bg: string; text: string }> = {
          student: { label: 'Sinh viên', bg: 'bg-blue-50', text: 'text-blue-600' },
          lecturer: { label: 'Giảng viên', bg: 'bg-purple-50', text: 'text-purple-600' },
          admin: { label: 'Quản trị', bg: 'bg-red-50', text: 'text-red-600' },
        };
        const conf = roles[row.role_name || 'student'];
        return (
          <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase ${conf.bg} ${conf.text}`}>
            {conf.label}
          </span>
        );
      }
    },
    {
      header: 'Trạng thái',
      accessor: 'status',
      render: (row) => (
        <div className="flex items-center gap-2">
           {row.status === 1 ? (
             <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
               <UserCheck size={12} /> Hoạt động
             </span>
           ) : (
             <span className="flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-full">
               <UserX size={12} /> Đã khóa (Ban)
             </span>
           )}
        </div>
      )
    },
    {
      header: 'Thao tác',
      accessor: 'id',
      render: (row) => (
         <button 
           onClick={() => navigate(`/admin/users-management/edit/${row.id}`)}
           className="p-2 text-slate-400 hover:text-[#dd7323] hover:bg-orange-50 rounded-lg transition-colors"
           title="Chỉnh sửa"
         >
            <Edit size={16} />
         </button>
      )
    }
  ];

  const handleImport = () => {
    alert("Tính năng Import Excel sẽ xử lý các trường: codeUser, name, email, role_id");
  };

  return (
    <TableList 
      title="Quản lý Người dùng"
      subtitle="Danh sách tài khoản (Student, Lecturer, Admin) trong hệ thống."
      data={mockUsers}
      columns={columns}
      onAdd={() => navigate('/admin/users-management/create')}
      onImport={handleImport}
    />
  );
};

export default UsersList;
