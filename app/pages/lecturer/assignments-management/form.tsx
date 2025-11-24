import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'

export default function AssignmentFormRoute() {
  const navigate = useNavigate()
  const { assignmentId } = useParams()
  const [loading, setLoading] = useState(false)
  const [classes, setClasses] = useState([])
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    classId: '',
    dueDate: '',
    maxScore: 100
  })

  const isEditMode = !!assignmentId

  useEffect(() => {
    fetchMyClasses()
    if (assignmentId) {
      fetchAssignment(assignmentId)
    }
  }, [assignmentId])

  const fetchMyClasses = async () => {
    try {
      // TODO: Fetch classes assigned to lecturer
    } catch (error) {
      console.error('Failed to fetch classes:', error)
    }
  }

  const fetchAssignment = async (id: string) => {
    try {
      // TODO: Fetch assignment from API/Lambda
      console.log('Fetching assignment:', id)
    } catch (error) {
      console.error('Failed to fetch assignment:', error)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles(Array.from(e.target.files))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // TODO: Upload files to S3 first
      const fileUrls: string[] = []
      for (const file of uploadedFiles) {
        // TODO: Upload to S3 and get URL
        console.log('Uploading file:', file.name)
        // fileUrls.push(uploadedUrl)
      }

      const dataToSend = {
        ...formData,
        fileUrls
      }

      if (isEditMode) {
        // TODO: Update assignment via API/Lambda
        console.log('Updating assignment:', assignmentId, dataToSend)
        alert('Cập nhật bài tập thành công!')
      } else {
        // TODO: Create assignment via API/Lambda
        console.log('Creating assignment:', dataToSend)
        alert('Tạo bài tập thành công!')
      }
      
      navigate('/lecturer/assignments-management/list')
    } catch (error) {
      console.error('Failed to save assignment:', error)
      alert('Lưu bài tập thất bại!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="assignment-form-container">
      <div className="page-header">
        <h1>{isEditMode ? 'Chỉnh sửa bài tập' : 'Tạo bài tập mới'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="assignment-form">
        <div className="form-group">
          <label htmlFor="classId">Lớp học *</label>
          <select
            id="classId"
            value={formData.classId}
            onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
            required
            disabled={isEditMode}
          >
            <option value="">Chọn lớp học</option>
            {classes.map((cls: any) => (
              <option key={cls.id} value={cls.id}>
                {cls.name} ({cls.code})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="title">Tiêu đề *</label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Mô tả</label>
          <textarea
            id="description"
            rows={6}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label htmlFor="dueDate">Hạn nộp *</label>
          <input
            id="dueDate"
            type="datetime-local"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="maxScore">Điểm tối đa *</label>
          <input
            id="maxScore"
            type="number"
            min="0"
            value={formData.maxScore}
            onChange={(e) => setFormData({ ...formData, maxScore: parseInt(e.target.value) })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="files">Tài liệu đính kèm (Upload to S3)</label>
          <input
            id="files"
            type="file"
            multiple
            onChange={handleFileChange}
          />
          {uploadedFiles.length > 0 && (
            <div className="file-list">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="file-item">
                  {file.name}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => navigate('/lecturer/assignments-management/list')}
            className="btn-cancel"
          >
            Hủy
          </button>
          <button 
            type="submit" 
            className="btn-submit"
            disabled={loading}
          >
            {loading ? 'Đang lưu...' : (isEditMode ? 'Cập nhật' : 'Tạo bài tập')}
          </button>
        </div>
      </form>
    </div>
  )
}
