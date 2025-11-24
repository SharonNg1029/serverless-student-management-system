import { useEffect, useState } from 'react'
import { useParams } from 'react-router'

interface Submission {
  id: string
  studentId: string
  studentName: string
  submittedAt: string
  score: number | null
  feedback: string
  fileUrls: string[]
}

export default function GradeAssignmentRoute() {
  const { assignmentId } = useParams()
  const [assignment, setAssignment] = useState<any>(null)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [score, setScore] = useState<number>(0)
  const [feedback, setFeedback] = useState<string>('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (assignmentId) {
      fetchAssignment()
      fetchSubmissions()
    }
  }, [assignmentId])

  const fetchAssignment = async () => {
    try {
      // TODO: Fetch assignment details from API/Lambda
    } catch (error) {
      console.error('Failed to fetch assignment:', error)
    }
  }

  const fetchSubmissions = async () => {
    try {
      // TODO: Fetch submissions for this assignment from API/Lambda
    } catch (error) {
      console.error('Failed to fetch submissions:', error)
    }
  }

  const handleSelectSubmission = (submission: Submission) => {
    setSelectedSubmission(submission)
    setScore(submission.score || 0)
    setFeedback(submission.feedback || '')
  }

  const handleGrade = async () => {
    if (!selectedSubmission) return

    setLoading(true)
    try {
      // TODO: Update submission grade via API/Lambda
      console.log('Grading submission:', selectedSubmission.id, { score, feedback })
      
      alert('Chấm điểm thành công!')
      fetchSubmissions()
      setSelectedSubmission(null)
    } catch (error) {
      console.error('Failed to grade submission:', error)
      alert('Chấm điểm thất bại!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grade-assignment-container">
      <div className="page-header">
        <h1>Chấm điểm: {assignment?.title}</h1>
      </div>

      <div className="grade-layout">
        <div className="submissions-sidebar">
          <h3>Bài nộp ({submissions.length})</h3>
          <div className="submissions-list">
            {submissions.map((submission) => (
              <div 
                key={submission.id}
                className={`submission-item ${selectedSubmission?.id === submission.id ? 'active' : ''}`}
                onClick={() => handleSelectSubmission(submission)}
              >
                <div className="student-name">{submission.studentName}</div>
                <div className="submitted-at">
                  {new Date(submission.submittedAt).toLocaleString('vi-VN')}
                </div>
                <div className="score-badge">
                  {submission.score !== null ? `${submission.score}/${assignment?.maxScore}` : 'Chưa chấm'}
                </div>
              </div>
            ))}
            
            {submissions.length === 0 && (
              <div className="no-data">Chưa có bài nộp</div>
            )}
          </div>
        </div>

        <div className="grading-area">
          {selectedSubmission ? (
            <>
              <div className="submission-details">
                <h3>Bài nộp của {selectedSubmission.studentName}</h3>
                <p>Nộp lúc: {new Date(selectedSubmission.submittedAt).toLocaleString('vi-VN')}</p>
                
                <div className="submitted-files">
                  <h4>File đã nộp:</h4>
                  {selectedSubmission.fileUrls.map((url, index) => (
                    <div key={index} className="file-link">
                      <a href={url} target="_blank" rel="noopener noreferrer">
                        File {index + 1}
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grading-form">
                <div className="form-group">
                  <label htmlFor="score">Điểm (Tối đa: {assignment?.maxScore})</label>
                  <input
                    id="score"
                    type="number"
                    min="0"
                    max={assignment?.maxScore || 100}
                    value={score}
                    onChange={(e) => setScore(parseInt(e.target.value))}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="feedback">Nhận xét</label>
                  <textarea
                    id="feedback"
                    rows={6}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Nhập nhận xét cho sinh viên..."
                  />
                </div>

                <button 
                  onClick={handleGrade}
                  className="btn-submit"
                  disabled={loading}
                >
                  {loading ? 'Đang lưu...' : 'Lưu điểm'}
                </button>
              </div>
            </>
          ) : (
            <div className="no-selection">
              <p>Chọn một bài nộp để chấm điểm</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
