import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useAuthStore } from '../../../store/authStore'

export default function LecturerClassFormRoute() {
  const navigate = useNavigate()
  const { classId } = useParams()
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [assignedSubjects, setAssignedSubjects] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    subjectId: '',
    capacity: 40,
    schedule: ''
  })

  const isEditMode = !!classId

  useEffect(() => {
    fetchAssignedSubjects()
    if (classId) {
      fetchClass(classId)
    }
  }, [classId])

  const fetchAssignedSubjects = async () => {
    try {
      // TODO: Fetch subjects assigned to current lecturer from API/Lambda
      // Only lecturers can create classes for subjects they're assigned to
    } catch (error) {
      console.error('Failed to fetch assigned subjects:', error)
    }
  }

  const fetchClass = async (id: string) => {
    try {
      // TODO: Fetch class from API/Lambda
      console.log('Fetching class:', id)
    } catch (error) {
      console.error('Failed to fetch class:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate that subject is assigned to lecturer
    if (!assignedSubjects.find((s: any) => s.id === formData.subjectId)) {
      alert('Bạn chỉ có thể tạo lớp cho môn học được phân công!')
      return
    }

    // Check capacity limit (<=40)
    if (formData.capacity > 40) {
      alert('Sĩ số tối đa là 40 sinh viên!')
      return
    }

    setLoading(true)

    try {
      const dataToSend = {
        ...formData,
        lecturerId: user?.id
      }

      if (isEditMode) {
        // TODO: Update class via API/Lambda
        console.log('Updating class:', classId, dataToSend)
        alert('Cập nhật lớp học thành công!')
      } else {
        // TODO: Create class via API/Lambda
        console.log('Creating class:', dataToSend)
        alert('Tạo lớp học thành công!')
      }
      
      navigate('/lecturer/classes-management/list')
    } catch (error) {
      console.error('Failed to save class:', error)
      alert('Lưu lớp học thất bại!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="class-form-container">
      <div className="page-header">
        <h1>{isEditMode ? 'Chỉnh sửa lớp học' : 'Tạo lớp học mới'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="class-form">
        <div className="form-group">
          <label htmlFor="code">Mã lớp *</label>
          <input
            id="code"
            type="text"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            required
            disabled={isEditMode}
          />
          {isEditMode && <small>Mã lớp không thể thay đổi</small>}
        </div>

        <div className="form-group">
          <label htmlFor="name">Tên lớp *</label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="subjectId">Môn học *</label>
          <select
            id="subjectId"
            value={formData.subjectId}
            onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
            required
          >
            <option value="">Chọn môn học</option>
            {assignedSubjects.map((subject: any) => (
              <option key={subject.id} value={subject.id}>
                {subject.name} ({subject.code})
              </option>
            ))}
          </select>
          <small>Chỉ hiển thị môn học được phân công cho bạn</small>
        </div>

        <div className="form-group">
          <label htmlFor="capacity">Sĩ số tối đa * (Tối đa 40)</label>
          <input
            id="capacity"
            type="number"
            min="1"
            max="40"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="schedule">Lịch học *</label>
          <input
            id="schedule"
            type="text"
            placeholder="VD: T2,T4,T6 7:30-9:30"
            value={formData.schedule}
            onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
            required
          />
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => navigate('/lecturer/classes-management/list')}
            className="btn-cancel"
          >
            Hủy
          </button>
          <button 
            type="submit" 
            className="btn-submit"
            disabled={loading}
          >
            {loading ? 'Đang lưu...' : (isEditMode ? 'Cập nhật' : 'Tạo lớp học')}
          </button>
        </div>
      </form>
    </div>
  )
}
