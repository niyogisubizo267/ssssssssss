import { useState } from 'react'

// Initial mock data
const initialStudents = [
  { id: '1', name: 'John Mwangi', email: 'john.mwangi@school.com', age: 16, grade: 'A' },
  { id: '2', name: 'Sarah Johnson', email: 'sarah.j@school.com', age: 15, grade: 'A+' },
  { id: '3', name: 'Mike Chen', email: 'mike.chen@school.com', age: 17, grade: 'B+' },
  { id: '4', name: 'Emily Davis', email: 'emily.d@school.com', age: 16, grade: 'A-' },
  { id: '5', name: 'David Kim', email: 'david.kim@school.com', age: 18, grade: 'B' },
]

function App() {
  const [students, setStudents] = useState(initialStudents)
  const [view, setView] = useState('list')
  const [editingStudent, setEditingStudent] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [toast, setToast] = useState(null)
  const [deleteModal, setDeleteModal] = useState(null)

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  // Add new student
  const handleAddStudent = (studentData) => {
    const newStudent = {
      ...studentData,
      id: Date.now().toString()
    }
    setStudents([...students, newStudent])
    setView('list')
    showToast('Student added successfully!')
  }

  // Update existing student
  const handleUpdateStudent = (studentData) => {
    setStudents(students.map(s => 
      s.id === editingStudent.id ? { ...studentData, id: editingStudent.id } : s
    ))
    setEditingStudent(null)
    setView('list')
    showToast('Student updated successfully!')
  }

  // Delete student
  const handleDeleteStudent = () => {
    if (deleteModal) {
      setStudents(students.filter(s => s.id !== deleteModal.id))
      setDeleteModal(null)
      showToast('Student deleted successfully!')
    }
  }

  // Filter students by search
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Navigation handlers
  const handleAddNew = () => {
    setEditingStudent(null)
    setView('form')
  }

  const handleEdit = (student) => {
    setEditingStudent(student)
    setView('form')
  }

  const handleCancel = () => {
    setEditingStudent(null)
    setView('list')
  }

  return (
    <>
      <header>
        <div className="app-container">
          <h1>Student Management System</h1>
        </div>
      </header>

      <main>
        <div className="app-container">
          {view === 'list' && (
            <>
              <div className="page-header">
                <h2 className="page-title">Students</h2>
                <button className="btn btn-primary" onClick={handleAddNew}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Add Student
                </button>
              </div>

              <div className="search-container">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search students by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {filteredStudents.length > 0 ? (
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Age</th>
                        <th>Grade</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((student) => (
                        <tr key={student.id}>
                          <td>{student.id}</td>
                          <td>{student.name}</td>
                          <td>{student.email}</td>
                          <td>{student.age}</td>
                          <td><span className="badge badge-primary">{student.grade}</span></td>
                          <td className="actions">
                            <button 
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleEdit(student)}
                            >
                              Edit
                            </button>
                            <button 
                              className="btn btn-danger btn-sm"
                              onClick={() => setDeleteModal(student)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  <h3>No students found</h3>
                  <p>Try adjusting your search or add a new student</p>
                </div>
              )}
            </>
          )}

          {view === 'form' && (
            <StudentForm 
              student={editingStudent}
              onSave={editingStudent ? handleUpdateStudent : handleAddStudent}
              onCancel={handleCancel}
            />
          )}
        </div>
      </main>

      <footer>
        <div className="app-container">
          <p>&copy; 2026 Student Management System. All rights reserved.</p>
        </div>
      </footer>

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="modal-overlay" onClick={() => setDeleteModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Delete Student</h2>
            <p>Are you sure you want to delete {deleteModal.name}? This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setDeleteModal(null)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDeleteStudent}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      )}
    </>
  )
}

// Student Form Component
function StudentForm({ student, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: student?.name || '',
    email: student?.email || '',
    age: student?.age || '',
    grade: student?.grade || ''
  })
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    if (!formData.age) {
      newErrors.age = 'Age is required'
    } else if (formData.age < 1 || formData.age > 120) {
      newErrors.age = 'Please enter a valid age'
    }
    
    if (!formData.grade.trim()) {
      newErrors.grade = 'Grade is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onSave({
        ...formData,
        age: parseInt(formData.age)
      })
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <div className="card">
      <h2 className="page-title" style={{ marginBottom: '24px' }}>
        {student ? 'Edit Student' : 'Add New Student'}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Name</label>
          <input
            type="text"
            name="name"
            className={`form-input ${errors.name ? 'error' : ''}`}
            placeholder="Enter student name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <p className="error-message">{errors.name}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className={`form-input ${errors.email ? 'error' : ''}`}
            placeholder="Enter email address"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="error-message">{errors.email}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">Age</label>
          <input
            type="number"
            name="age"
            className={`form-input ${errors.age ? 'error' : ''}`}
            placeholder="Enter age"
            value={formData.age}
            onChange={handleChange}
            min="1"
            max="120"
          />
          {errors.age && <p className="error-message">{errors.age}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">Grade</label>
          <input
            type="text"
            name="grade"
            className={`form-input ${errors.grade ? 'error' : ''}`}
            placeholder="Enter grade (e.g., A, B+, A-)"
            value={formData.grade}
            onChange={handleChange}
          />
          {errors.grade && <p className="error-message">{errors.grade}</p>}
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button type="submit" className="btn btn-primary">
            {student ? 'Update Student' : 'Add Student'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default App
