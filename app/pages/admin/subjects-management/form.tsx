import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'

export default function SubjectFormRoute() {
  const navigate = useNavigate()
  const { subjectId } = useParams()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    credits: 3,
    description: ''
  })

  const isEditMode = !!subjectId

  useEffect(() => {
    if (subjectId) {
      fetchSubject(subjectId)
    }
  }, [subjectId])

  const fetchSubject = async (id: string) => {
    try {
      // TODO: Fetch subject from API/Lambda
      console.log('Fetching subject:', id)
    } catch (error) {
      console.error('Failed to fetch subject:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isEditMode) {
        // TODO: Update subject via API/Lambda
        console.log('Updating subject:', subjectId, formData)
        alert('Cập nhật môn học thành công!')
      } else {
        // TODO: Create subject via API/Lambda
        console.log('Creating subject:', formData)
        alert('Tạo môn học thành công!')
      }
      
      navigate('/admin/subjects-management/list')
    } catch (error) {
      console.error('Failed to save subject:', error)
      alert('Lưu môn học thất bại!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="subject-form-container">
      <div className="page-header">
        <h1>{isEditMode ? 'Chỉnh sửa môn học' : 'Thêm môn học mới'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="subject-form">
        <div className="form-group">
          <label htmlFor="code">Mã môn học *</label>
          <input
            id="code"
            type="text"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            required
            disabled={isEditMode}
          />
          {isEditMode && <small>Mã môn học không thể thay đổi</small>}
        </div>

        <div className="form-group">
          <label htmlFor="name">Tên môn học *</label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="credits">Số tín chỉ *</label>
          <input
            id="credits"
            type="number"
            min="1"
            max="10"
            value={formData.credits}
            onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Mô tả</label>
          <textarea
            id="description"
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => navigate('/admin/subjects-management/list')}
            className="btn-cancel"
          >
            Hủy
          </button>
          <button 
            type="submit" 
            className="btn-submit"
            disabled={loading}
          >
            {loading ? 'Đang lưu...' : (isEditMode ? 'Cập nhật' : 'Tạo môn học')}
          </button>
        </div>
      </form>
    </div>
  )
}
