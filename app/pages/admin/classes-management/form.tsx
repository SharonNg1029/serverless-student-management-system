import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'

export default function ClassFormRoute() {
  const navigate = useNavigate()
  const { classId } = useParams()
  const [loading, setLoading] = useState(false)
  const [subjects, setSubjects] = useState([])
  const [lecturers, setLecturers] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    subjectId: '',
    lecturerId: '',
    capacity: 40,
    schedule: ''
  })

  const isEditMode = !!classId

  useEffect(() => {
    fetchSubjects()
    fetchLecturers()
    if (classId) {
      fetchClass(classId)
    }
  }, [classId])

  const fetchSubjects = async () => {
    try {
      // TODO: Fetch subjects from API/Lambda
    } catch (error) {
      console.error('Failed to fetch subjects:', error)
    }
  }

  const fetchLecturers = async () => {
    try {
      // TODO: Fetch lecturers from API/Lambda
    } catch (error) {
      console.error('Failed to fetch lecturers:', error)
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
    setLoading(true)

    try {
      if (isEditMode) {
        // TODO: Update class via API/Lambda
        console.log('Updating class:', classId, formData)
        alert('Cập nhật lớp học thành công!')
      } else {
        // TODO: Create class via API/Lambda
        console.log('Creating class:', formData)
        alert('Tạo lớp học thành công!')
      }
      
      navigate('/admin/classes-management/list')
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
        <h1>{isEditMode ? 'Chỉnh sửa lớp học' : 'Thêm lớp học mới'}</h1>
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
            {subjects.map((subject: any) => (
              <option key={subject.id} value={subject.id}>
                {subject.name} ({subject.code})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="lecturerId">Giảng viên *</label>
          <select
            id="lecturerId"
            value={formData.lecturerId}
            onChange={(e) => setFormData({ ...formData, lecturerId: e.target.value })}
            required
          >
            <option value="">Chọn giảng viên</option>
            {lecturers.map((lecturer: any) => (
              <option key={lecturer.id} value={lecturer.id}>
                {lecturer.fullName}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="capacity">Sĩ số tối đa *</label>
          <input
            id="capacity"
            type="number"
            min="1"
            max="100"
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
            onClick={() => navigate('/admin/classes-management/list')}
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
