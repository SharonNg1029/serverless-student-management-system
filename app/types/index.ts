// ============================================
// USER & AUTHENTICATION TYPES
// ============================================

export type UserRole = 'Student' | 'Lecturer' | 'Admin';

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  token: string;
  avatar?: string;
  phone?: string;
  isEmailVerified: boolean;
  lastLogin: string;
  loginMethod: 'normal' | 'google' | 'cognito';
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  id?: string;
  userId?: string;
  username?: string;
  email?: string;
  fullName?: string;
  fullname?: string;
  role?: UserRole | string;
  token?: string;
  accessToken?: string;
  avatar?: string;
  phone?: string;
  enabled?: boolean;
  isEmailVerified?: boolean;
  createAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ============================================
// DATABASE ENTITY TYPES
// ============================================

// User Management (Admin CRUD)
export interface UserEntity {
  id: number;
  codeUser: string;
  name: string;
  email: string;
  role_id: number;
  date_of_birth?: string;
  status: number; // 0: Inactive, 1: Active
  createdAt?: string;
  updatedAt?: string;
}

export interface Subject {
  id: number;
  codeSubject: string;
  name: string;
  credits: number;
  department: string;
  description?: string;
  status: number; // 0: Đóng, 1: Đang mở
}

export interface Class {
  id: number;
  classCode: string;
  subjectId: number;
  subject_id?: number;
  subjectName?: string;
  lecturerId: number;
  teacher_id?: number;
  lecturerName?: string;
  semester: string;
  year: number;
  academic_year?: string;
  name?: string;
  password?: string;
  student_count?: number;
  schedule?: string;
  room?: string;
  capacity?: number;
  enrolled?: number;
  description?: string;
  status: number; // 0: Đóng, 1: Đang mở
}

export interface Assignment {
  id: number;
  classId: number;
  title: string;
  description?: string;
  dueDate: string;
  totalPoints: number;
  status: number; // 0: Draft, 1: Published
}

export interface Grade {
  id: number;
  studentId: number;
  assignmentId: number;
  score: number;
  feedback?: string;
  gradedAt?: string;
}

export interface Notification {
  id: number;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'error';
  senderId: number;
  recipientType: 'all' | 'student' | 'lecturer' | 'admin';
  recipientIds?: number[];
  createdAt: string;
  isRead?: boolean;
}
