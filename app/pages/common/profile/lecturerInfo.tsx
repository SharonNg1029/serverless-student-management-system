import { useEffect, useState } from 'react'

export default function LecturerInfo() {
  const [assignedSubjects, setAssignedSubjects] = useState([])
  const [assignedClasses, setAssignedClasses] = useState([])
  const [schedule, setSchedule] = useState([])

  useEffect(() => {
    // TODO: Fetch assigned subjects from API/Lambda
    // TODO: Fetch assigned classes
    // TODO: Fetch teaching schedule
  }, [])

  return (
    <div className="lecturer-info">
      <h2>Thông tin giảng viên</h2>
      
      <div className="assigned-subjects">
        <h3>Môn học được phân công</h3>
        {/* TODO: Display assigned subjects */}
        <p>Chưa có dữ liệu</p>
      </div>

      <div className="assigned-classes">
        <h3>Lớp học phụ trách</h3>
        {/* TODO: Display classes list */}
        <p>Chưa có dữ liệu</p>
      </div>

      <div className="teaching-schedule">
        <h3>Lịch giảng dạy</h3>
        {/* TODO: Display schedule calendar */}
        <p>Chưa có dữ liệu</p>
      </div>
    </div>
  )
}
