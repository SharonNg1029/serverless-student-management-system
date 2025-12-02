// ============================================
// USER & AUTHENTICATION TYPES
// ============================================

export type UserRole = 'Student' | 'Lecturer' | 'Admin'

export interface User {
  id: string
  username: string
  email: string
  fullName: string
  role: UserRole
  token: string
  avatar?: string
  phone?: string
  isEmailVerified: boolean
  lastLogin: string
  loginMethod: 'normal' | 'google' | 'cognito'
  createdAt: string
  updatedAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  id?: string
  userId?: string
  username?: string
  email?: string
  fullName?: string
  fullname?: string
  role?: UserRole | string
  token?: string
  accessToken?: string
  avatar?: string
  phone?: string
  enabled?: boolean
  isEmailVerified?: boolean
  createAt?: string
  createdAt?: string
  updatedAt?: string
}

// Register API types
export interface RegisterRequest {
  email: string;
  password: string;
  role_id: number; // 1=Admin, 2=Lecturer, 3=Student
  codeUser: string; // Mã giáo viên hoặc sinh viên
  date_of_birth: string; // Format: YYYY-MM-DD
  name?: string; // Họ tên (optional)
  status?: number; // 0=Inactive, 1=Active (optional)
}

export interface RegisterResponse {
  message: string;
  userId: number;
}

// ============================================
// DATABASE ENTITY TYPES
// ============================================

// User Management (Admin CRUD)
export interface UserEntity {
  id: number
  codeUser: string
  name: string
  email: string
  role_id: number
  date_of_birth?: string
  status: number // 0: Inactive, 1: Active
  createdAt?: string
  updatedAt?: string
}

export interface Subject {
  id: number;
  codeSubject: string;
  name: string;
  credits: number;
  department: string;
  description?: string;
  status: number; // 0: Đóng, 1: Đang mở
  created_at?: string;
  updated_at?: string;
}

// Subject API types
export interface CreateSubjectRequest {
  codeSubject: string; // required, unique
  name: string; // required
  credits: number; // required
  description?: string; // optional
  department?: string; // optional
  status?: number; // default 1
}

export interface SubjectDTO {
  id: number;
  codeSubject: string;
  name: string;
  credits: number;
  description?: string;
  department?: string;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface Class {
  id: number;
  classCode: string;
  subjectId: number;
  subject_id?: number;
  subjectName?: string;
  lecturerId?: number;
  teacher_id?: number;
  lecturerName?: string;
  semester: string;
  year?: number;
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
  id: number
  classId: number
  title: string
  description?: string
  dueDate: string
  totalPoints: number
  status: number // 0: Draft, 1: Published
}

export interface Grade {
  id: number
  studentId: number
  assignmentId: number
  score: number
  feedback?: string
  gradedAt?: string
}

export interface Notification {
  id: number
  title: string
  content: string
  type: 'info' | 'warning' | 'success' | 'error'
  senderId: number
  recipientType: 'all' | 'student' | 'lecturer' | 'admin'
  recipientIds?: number[]
  createdAt: string
  isRead?: boolean
}

// ============================================
// LECTURER API TYPES
// ============================================

// Class Management
export interface ClassDTO {
  id: number
  subject_id: number
  name: string
  password?: string
  semester: string
  academic_year: string
  description?: string
  teacher_id: number
  student_count: number
  created_at: string
  updated_at: string
  status: number // 0: Inactive, 1: Active
  subject_name?: string
  teacher_name?: string
}

export interface CreateClassRequest {
  subject_id: number
  name: string
  password?: string
  semester: string
  academic_year: string
  description?: string
}

export interface UpdateClassRequest {
  name?: string
  password?: string
  semester?: string
  academic_year?: string
  description?: string
}

// Student in Class
export interface StudentDTO {
  id: number
  name: string
  email: string
  codeUser: string
  status: string // 'enrolled' | 'waitlist'
  avatar?: string
  date_of_birth?: string
  enrolled_at?: string
}

// Material/Assignment
export interface MaterialDTO {
  id: number
  class_id: number
  title: string
  file_url?: string
  file_type?: string
  uploaded_by: number
  uploaded_at: string
  description?: string
}

export interface CreateMaterialRequest {
  class_id: number
  title: string
  file?: File
  description?: string
}

// Grade Column
export interface GradeColumnDTO {
  id: number
  class_id: number
  name: string
  percentage: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreateGradeColumnRequest {
  class_id: number
  name: string
  percentage: number
  is_active?: boolean
}

export interface UpdateGradeColumnRequest {
  name?: string
  percentage?: number
  is_active?: boolean
}

// Grade
export interface GradeDTO {
  id: number
  class_id: number
  student_id: number
  column_id: number
  value: number
  created_at: string
  updated_at: string
  student_name?: string
  column_name?: string
}

export interface CreateGradeRequest {
  class_id: number
  student_id: number
  column_id: number
  value: number
}

export interface UpdateGradeRequest {
  value: number
}

// Chat Message
export interface MessageDTO {
  id: number
  class_id: number
  sender_id: number
  sender_name?: string
  sender_avatar?: string
  sender_role?: string
  parent_id: number | null
  content: string
  type: 'text' | 'attachment'
  attachment_url?: string
  reactions: Record<string, string> // { user_id: 'like' | 'tim' }
  timestamp: string
  replies?: MessageDTO[]
}

export interface CreateMessageRequest {
  class_id: number
  content?: string
  parent_id?: number | null
  type: 'text' | 'attachment'
  attachment?: File
}

export interface UpdateReactionRequest {
  action: 'add' | 'remove'
  type: 'like' | 'tim'
}

// Ranking
export interface RankingDTO {
  student_id: number
  student_name?: string
  student_code?: string
  avatar?: string
  rank: number
  score: number
  recommendations?: string
  grades?: GradeDTO[]
}

// Notification
export interface SendNotificationRequest {
  class_id: number
  title: string
  content: string
}

export interface NotificationDTO {
  id: number
  class_id?: number
  class_name?: string
  title: string
  content: string
  sender_id: number
  sender_name?: string
  created_at: string
  type: 'sent' | 'received'
  is_read?: boolean
}

// Profile
export interface ProfileDTO {
  id: number
  name: string
  email: string
  date_of_birth?: string
  role_id: number
  codeUser: string
  avatar?: string
  phone?: string
  status: number
  created_at?: string
  updated_at?: string
}

export interface UpdateProfileRequest {
  name?: string
  date_of_birth?: string
  phone?: string
  avatar?: File
}

export interface ChangePasswordRequest {
  old_password: string
  new_password: string
  confirm_password: string
}

// Subject Assignment (for lecturer)
export interface SubjectAssignment {
  id: number
  subject_id: number
  lecturer_id: number
  subject_name: string
  subject_code: string
  assigned_at: string
}

export interface ClassReport {}
export interface LecturerClass {}
export interface ClassStudent {}
export interface NotificationHistory {}
export interface NotificationRequest {}

// ============================================
// NEW SCHEMA TYPES (Refactored)
// ============================================

// Assignment Types (replaces old materials and grade_columns)
export type AssignmentType = 'homework' | 'project' | 'midterm' | 'final'

export interface AssignmentDTO {
  id: number
  class_id: number
  title: string
  description: string
  type: AssignmentType
  weight: number // decimal: homework=0.20, project=0.30, midterm=0.25, final=0.25
  deadline: string // datetime
  max_score: number // default 10.00
  is_published: boolean
  submission_count?: number // computed from assignment_submissions
  created_at: string
  updated_at: string
}

export interface CreateAssignmentRequest {
  class_id: number
  title: string
  description?: string
  type: AssignmentType
  deadline: string
  max_score?: number // default 10
  is_published?: boolean
  files?: File[] // for assignment_materials
}

export interface UpdateAssignmentRequest {
  title?: string
  description?: string
  type?: AssignmentType
  deadline?: string
  max_score?: number
  is_published?: boolean
}

// Assignment Materials
export interface AssignmentMaterialDTO {
  id: number
  assignment_id: number
  file_url: string
  file_name: string
  file_type: string
  uploaded_by: number
  uploaded_at: string
}

// Assignment Submissions (Student grades)
export type SubmissionStatus = 'on_time' | 'late' | 'missing'

export interface AssignmentSubmissionDTO {
  id: number
  assignment_id: number
  student_id: number
  student_name?: string
  student_code?: string
  file_url?: string
  file_name?: string
  submitted_at: string
  score?: number
  feedback?: string
  status: SubmissionStatus
  graded_at?: string
  created_at: string
  updated_at: string
}

export interface GradeSubmissionRequest {
  score: number
  feedback?: string
}

// Post Types (Discussion posts - only lecturer creates)
export interface PostDTO {
  id: number
  class_id: number
  lecturer_id: number
  lecturer_name?: string
  lecturer_avatar?: string
  title: string
  content: string // supports markdown
  attachment_url?: string
  attachment_name?: string
  is_pinned: boolean
  like_count: number
  comment_count: number
  is_liked?: boolean // for current user
  created_at: string
  updated_at: string
}

export interface CreatePostRequest {
  class_id: number
  title: string
  content: string // markdown
  attachment?: File
  is_pinned?: boolean
}

export interface UpdatePostRequest {
  title?: string
  content?: string
  is_pinned?: boolean
}

// Post Comments (nested comments/replies)
export interface PostCommentDTO {
  id: number
  post_id: number
  sender_id: number
  sender_name?: string
  sender_avatar?: string
  sender_role?: string
  parent_id?: number
  content: string
  attachment_url?: string
  like_count: number
  is_liked?: boolean
  created_at: string
  replies?: PostCommentDTO[]
}

export interface CreateCommentRequest {
  post_id: number
  content: string
  parent_id?: number
  attachment?: File
}

// Chat Messages (quick chat in class)
export interface ChatMessageDTO {
  id: number
  class_id: number
  sender_id: number
  sender_name?: string
  sender_avatar?: string
  sender_role?: string
  content: string
  attachment_url?: string
  created_at: string
}

export interface CreateChatMessageRequest {
  class_id: number
  content: string
  attachment?: File
}

// Extended ClassDTO with subject info
export interface ClassDetailDTO extends ClassDTO {
  subject?: {
    id: number
    codeSubject: string
    name: string
    credits: number
    department?: string
  }
}

// Weight constants for auto-calculation
export const ASSIGNMENT_WEIGHTS: Record<AssignmentType, number> = {
  homework: 0.20,
  project: 0.30,
  midterm: 0.25,
  final: 0.25,
}
