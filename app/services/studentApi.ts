import api from '../utils/axios'
import type { CalendarAssignment } from '../types'

// ============================================
// STUDENT API FUNCTIONS
// ============================================

/**
 * GET /student/assignments/calendar
 * Lấy danh sách bài tập của các lớp mà student đang enrolled
 * @param month - Tháng (1-12)
 * @param year - Năm
 */
export const fetchCalendarAssignments = async (
  month?: number,
  year?: number
): Promise<CalendarAssignment[]> => {
  const params: Record<string, number> = {}
  if (month) params.month = month
  if (year) params.year = year
  
  const { data } = await api.get('/student/assignments/calendar', { params })
  return data.assignments || data || []
}
