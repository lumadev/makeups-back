import * as studentRepository from './studentRepository.js'

async function getAllStudents() {
  return await studentRepository.readAll()
}

async function getStudentById(studentId) {
  const students = await studentRepository.readAll()
  return students.find(r => String(r.id) === String(studentId)) || null
}

async function createStudent(body) {
  const { name, phone, email } = body
  const students = await studentRepository.readAll()

  const newStudent = {
    id: Date.now(),
    name,
    phone,
    email,
    dateRegister: new Date()
  }

  students.unshift(newStudent)
  await studentRepository.writeAll(students)

  return newStudent
}

async function updateStudent(studentId, body) {
  const { name, phone, email } = body
  const students = await studentRepository.readAll()

  const index = students.findIndex(res => res.id === studentId)
  
  if (index === -1) return null

  students[index] = {
    ...students[index],
    name,
    phone,
    email
  }

  await studentRepository.writeAll(students)
  return students[index]
}

async function deleteStudent(studentId) {
  const students = await studentRepository.readAll()
  const filteredStudents = students.filter(student => student.id !== studentId)
  
  await studentRepository.writeAll(filteredStudents)
}

export { 
  getAllStudents, 
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentById
}