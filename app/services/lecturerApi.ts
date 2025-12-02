import api from "../utils/axios"
import type {
  ClassDTO,
  CreateClassRequest,
  UpdateClassRequest,
  StudentDTO,
  MaterialDTO,
  CreateMaterialRequest,
  GradeColumnDTO,
  CreateGradeColumnRequest,
  UpdateGradeColumnRequest,
  GradeDTO,
  CreateGradeRequest,
  UpdateGradeRequest,
  MessageDTO,
  CreateMessageRequest,
  UpdateReactionRequest,
  RankingDTO,
  SendNotificationRequest,
  NotificationDTO,
  SubjectAssignment,
  ProfileDTO,
  UpdateProfileRequest,
  // New types for refactored schema
  AssignmentDTO,
  CreateAssignmentRequest,
  UpdateAssignmentRequest,
  AssignmentSubmissionDTO,
  GradeSubmissionRequest,
  PostDTO,
  CreatePostRequest,
  UpdatePostRequest,
  PostCommentDTO,
  CreateCommentRequest,
  ClassDetailDTO,
  AssignmentType,
} from "../types"

// Weight constants for auto-calculation
const ASSIGNMENT_WEIGHTS: Record<AssignmentType, number> = {
  homework: 0.20,
  project: 0.30,
  midterm: 0.25,
  final: 0.25,
}

// ============================================
// CLASS MANAGEMENT
// ============================================

export const lecturerClassApi = {
  // List classes
  getClasses: async (params?: { subject_id?: number; keyword?: string; status?: number }) => {
    const response = await api.get<{ results: ClassDTO[] }>("/lecturer/classes", { params })
    return response.data
  },

  // Get class by ID
  getClassById: async (id: number) => {
    const response = await api.get<ClassDTO>(`/lecturer/classes/${id}`)
    return response.data
  },

  // Create class
  createClass: async (data: CreateClassRequest) => {
    const response = await api.post<ClassDTO>("/lecturer/classes", data)
    return response.data
  },

  // Update class
  updateClass: async (id: number, data: UpdateClassRequest) => {
    const response = await api.patch<ClassDTO>(`/lecturer/classes/${id}`, data)
    return response.data
  },

  // Deactivate class (soft delete)
  deactivateClass: async (id: number) => {
    const response = await api.patch<{ message: string }>(`/lecturer/classes/${id}/deactivate`)
    return response.data
  },

  // Get assigned subjects
  getAssignedSubjects: async () => {
    const response = await api.get<{ results: SubjectAssignment[] }>("/lecturer/subjects")
    return response.data
  },
}

// ============================================
// STUDENT MANAGEMENT
// ============================================

export const lecturerStudentApi = {
  // List students in class
  getStudentsInClass: async (classId: number, params?: { keyword?: string; status?: string }) => {
    const response = await api.get<{ results: StudentDTO[] }>(`/lecturer/students/${classId}`, { params })
    return response.data
  },

  // Get student details
  getStudentById: async (studentId: number) => {
    const response = await api.get<StudentDTO>(`/lecturer/students/detail/${studentId}`)
    return response.data
  },
}

// ============================================
// ASSIGNMENT/MATERIAL MANAGEMENT
// ============================================

export const lecturerMaterialApi = {
  // List materials/assignments
  getMaterials: async (classId: number, params?: { keyword?: string }) => {
    const response = await api.get<{ results: MaterialDTO[] }>(`/lecturer/assignments/${classId}`, { params })
    return response.data
  },

  // Create material/assignment
  createMaterial: async (data: CreateMaterialRequest) => {
    const formData = new FormData()
    formData.append("class_id", data.class_id.toString())
    formData.append("title", data.title)
    if (data.description) formData.append("description", data.description)
    if (data.file) formData.append("file", data.file)

    const response = await api.post<MaterialDTO>("/lecturer/assignments", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return response.data
  },

  // Delete material
  deleteMaterial: async (id: number) => {
    const response = await api.delete<{ message: string }>(`/lecturer/assignments/${id}`)
    return response.data
  },
}

// ============================================
// GRADE COLUMN MANAGEMENT
// ============================================

export const lecturerGradeColumnApi = {
  // List grade columns
  getGradeColumns: async (classId: number, params?: { is_active?: boolean }) => {
    const response = await api.get<{ results: GradeColumnDTO[] }>(`/lecturer/grade-columns/${classId}`, { params })
    return response.data
  },

  // Create grade column
  createGradeColumn: async (data: CreateGradeColumnRequest) => {
    const response = await api.post<GradeColumnDTO>("/lecturer/grade-columns", data)
    return response.data
  },

  // Update grade column
  updateGradeColumn: async (id: number, data: UpdateGradeColumnRequest) => {
    const response = await api.put<GradeColumnDTO>(`/lecturer/grade-columns/${id}`, data)
    return response.data
  },

  // Delete grade column (soft delete)
  deleteGradeColumn: async (id: number) => {
    const response = await api.delete<{ message: string }>(`/lecturer/grade-columns/${id}`)
    return response.data
  },
}

// ============================================
// GRADE MANAGEMENT
// ============================================

export const lecturerGradeApi = {
  // Get grades for class
  getGrades: async (classId: number) => {
    const response = await api.get<{ results: GradeDTO[] }>(`/lecturer/grades/${classId}`)
    return response.data
  },

  // Create grade
  createGrade: async (data: CreateGradeRequest) => {
    const response = await api.post<GradeDTO>("/lecturer/grades", data)
    return response.data
  },

  // Update grade
  updateGrade: async (id: number, data: UpdateGradeRequest) => {
    const response = await api.put<GradeDTO>(`/lecturer/grades/${id}`, data)
    return response.data
  },

  // Bulk create/update grades
  bulkUpdateGrades: async (grades: CreateGradeRequest[]) => {
    const response = await api.post<{ results: GradeDTO[] }>("/lecturer/grades/bulk", { grades })
    return response.data
  },
}

// ============================================
// CHAT/MESSAGE MANAGEMENT
// ============================================

export const chatApi = {
  // Get messages for class
  getMessages: async (classId: number, params?: { parent_id?: number | null }) => {
    const response = await api.get<{ results: MessageDTO[] }>(`/chat/messages/${classId}`, { params })
    return response.data
  },

  // Create message/post
  createMessage: async (data: CreateMessageRequest) => {
    const formData = new FormData()
    formData.append("class_id", data.class_id.toString())
    formData.append("type", data.type)
    if (data.content) formData.append("content", data.content)
    if (data.parent_id !== undefined && data.parent_id !== null) {
      formData.append("parent_id", data.parent_id.toString())
    }
    if (data.attachment) formData.append("attachment", data.attachment)

    const response = await api.post<MessageDTO>("/chat/messages", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return response.data
  },

  // Delete message
  deleteMessage: async (id: number) => {
    const response = await api.delete<{ message: string }>(`/chat/messages/${id}`)
    return response.data
  },

  // Update reactions
  updateReaction: async (id: number, data: UpdateReactionRequest) => {
    const response = await api.put<{ message: string; updatedReactions: Record<string, string> }>(
      `/chat/messages/${id}/reactions`,
      data,
    )
    return response.data
  },
}

// ============================================
// RANKING
// ============================================

export const lecturerRankingApi = {
  // Get ranking for class
  getRanking: async (classId: number) => {
    const response = await api.get<{ results: RankingDTO[] }>(`/lecturer/ranking/${classId}`)
    return response.data
  },
}

// ============================================
// NOTIFICATIONS
// ============================================

export const lecturerNotificationApi = {
  // Send notification
  sendNotification: async (data: SendNotificationRequest) => {
    const response = await api.post<{ message: string }>("/lecturer/notifications/email", data)
    return response.data
  },

  // Get sent notifications
  getSentNotifications: async () => {
    const response = await api.get<{ results: NotificationDTO[] }>("/lecturer/notifications/sent")
    return response.data
  },

  // Get received notifications (system notifications)
  getReceivedNotifications: async () => {
    const response = await api.get<{ results: NotificationDTO[] }>("/notifications/received")
    return response.data
  },

  // Mark notification as read
  markAsRead: async (id: number) => {
    const response = await api.patch<{ message: string }>(`/notifications/${id}/read`)
    return response.data
  },
}

// ============================================
// ASSIGNMENT MANAGEMENT (New Schema)
// ============================================

export const lecturerAssignmentApi = {
  // List assignments for a class
  getAssignments: async (classId: number, params?: { keyword?: string; type?: string }) => {
    const response = await api.get<{ results: AssignmentDTO[] }>(`/lecturer/classes/${classId}/assignments`, { params })
    return response.data
  },

  // Get assignment by ID
  getAssignmentById: async (classId: number, assignmentId: number) => {
    const response = await api.get<AssignmentDTO>(`/lecturer/classes/${classId}/assignments/${assignmentId}`)
    return response.data
  },

  // Create assignment
  createAssignment: async (classId: number, data: CreateAssignmentRequest) => {
    const formData = new FormData()
    formData.append("title", data.title)
    if (data.description) formData.append("description", data.description)
    formData.append("type", data.type)
    formData.append("deadline", data.deadline)
    formData.append("max_score", (data.max_score || 10).toString())
    formData.append("is_published", (data.is_published ?? false).toString())
    // Auto-calculate weight based on type
    const weight = ASSIGNMENT_WEIGHTS[data.type]
    formData.append("weight", weight.toString())
    
    // Attach files
    if (data.files && data.files.length > 0) {
      data.files.forEach((file) => {
        formData.append("files", file)
      })
    }

    const response = await api.post<AssignmentDTO>(`/lecturer/classes/${classId}/assignments`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return response.data
  },

  // Update assignment
  updateAssignment: async (classId: number, assignmentId: number, data: UpdateAssignmentRequest) => {
    const response = await api.patch<AssignmentDTO>(`/lecturer/classes/${classId}/assignments/${assignmentId}`, data)
    return response.data
  },

  // Delete assignment
  deleteAssignment: async (classId: number, assignmentId: number) => {
    const response = await api.delete<{ message: string }>(`/lecturer/classes/${classId}/assignments/${assignmentId}`)
    return response.data
  },

  // Publish/unpublish assignment
  togglePublish: async (classId: number, assignmentId: number, is_published: boolean) => {
    const response = await api.patch<AssignmentDTO>(`/lecturer/classes/${classId}/assignments/${assignmentId}`, {
      is_published,
    })
    return response.data
  },

  // Get submissions for an assignment
  getSubmissions: async (classId: number, assignmentId: number) => {
    const response = await api.get<{ results: AssignmentSubmissionDTO[] }>(
      `/lecturer/classes/${classId}/assignments/${assignmentId}/submissions`
    )
    return response.data
  },

  // Grade a submission
  gradeSubmission: async (classId: number, assignmentId: number, submissionId: number, data: GradeSubmissionRequest) => {
    const response = await api.patch<AssignmentSubmissionDTO>(
      `/lecturer/classes/${classId}/assignments/${assignmentId}/submissions/${submissionId}/grade`,
      data
    )
    return response.data
  },
}

// ============================================
// POST MANAGEMENT (Discussion Posts)
// ============================================

export const lecturerPostApi = {
  // List posts for a class
  getPosts: async (classId: number, params?: { keyword?: string }) => {
    const response = await api.get<{ results: PostDTO[] }>(`/lecturer/classes/${classId}/posts`, { params })
    return response.data
  },

  // Get post by ID
  getPostById: async (classId: number, postId: number) => {
    const response = await api.get<PostDTO>(`/lecturer/classes/${classId}/posts/${postId}`)
    return response.data
  },

  // Create post
  createPost: async (classId: number, data: CreatePostRequest) => {
    const formData = new FormData()
    formData.append("title", data.title)
    formData.append("content", data.content)
    formData.append("is_pinned", (data.is_pinned ?? false).toString())
    
    if (data.attachment) {
      formData.append("attachment", data.attachment)
    }

    const response = await api.post<PostDTO>(`/lecturer/classes/${classId}/posts`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return response.data
  },

  // Update post
  updatePost: async (classId: number, postId: number, data: UpdatePostRequest) => {
    const response = await api.patch<PostDTO>(`/lecturer/classes/${classId}/posts/${postId}`, data)
    return response.data
  },

  // Delete post
  deletePost: async (classId: number, postId: number) => {
    const response = await api.delete<{ message: string }>(`/lecturer/classes/${classId}/posts/${postId}`)
    return response.data
  },

  // Toggle pin status
  togglePin: async (classId: number, postId: number, is_pinned: boolean) => {
    const response = await api.patch<PostDTO>(`/lecturer/classes/${classId}/posts/${postId}`, { is_pinned })
    return response.data
  },

  // Like/unlike post
  toggleLike: async (classId: number, postId: number) => {
    const response = await api.post<{ message: string; like_count: number }>(
      `/lecturer/classes/${classId}/posts/${postId}/like`
    )
    return response.data
  },

  // Get comments for a post
  getComments: async (classId: number, postId: number) => {
    const response = await api.get<{ results: PostCommentDTO[] }>(
      `/lecturer/classes/${classId}/posts/${postId}/comments`
    )
    return response.data
  },

  // Create comment
  createComment: async (classId: number, postId: number, data: CreateCommentRequest) => {
    const formData = new FormData()
    formData.append("content", data.content)
    if (data.parent_id) {
      formData.append("parent_id", data.parent_id.toString())
    }
    if (data.attachment) {
      formData.append("attachment", data.attachment)
    }

    const response = await api.post<PostCommentDTO>(
      `/lecturer/classes/${classId}/posts/${postId}/comments`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    )
    return response.data
  },

  // Delete comment
  deleteComment: async (classId: number, postId: number, commentId: number) => {
    const response = await api.delete<{ message: string }>(
      `/lecturer/classes/${classId}/posts/${postId}/comments/${commentId}`
    )
    return response.data
  },
}

// ============================================
// PROFILE
// ============================================

export const profileApi = {
  // Get profile
  getProfile: async () => {
    const response = await api.get<ProfileDTO>("/profile")
    return response.data
  },

  // Update profile
  updateProfile: async (data: UpdateProfileRequest) => {
    const formData = new FormData()
    if (data.name) formData.append("name", data.name)
    if (data.date_of_birth) formData.append("date_of_birth", data.date_of_birth)
    if (data.phone) formData.append("phone", data.phone)
    if (data.avatar) formData.append("avatar", data.avatar)

    const response = await api.patch<ProfileDTO>("/profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return response.data
  },

  // Change password
  changePassword: async (data: { old_password: string; new_password: string; confirm_password: string }) => {
    const response = await api.post<{ message: string }>("/auth/change-password", data)
    return response.data
  },
}

export default {
  classes: lecturerClassApi,
  students: lecturerStudentApi,
  materials: lecturerMaterialApi,
  gradeColumns: lecturerGradeColumnApi,
  grades: lecturerGradeApi,
  chat: chatApi,
  ranking: lecturerRankingApi,
  notifications: lecturerNotificationApi,
  profile: profileApi,
  assignments: lecturerAssignmentApi,
  posts: lecturerPostApi,
}
