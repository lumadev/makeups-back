import { initDB } from '../db/db.js'
import { DB_TYPE_STUDENTS } from '../db/dbTypeConsts.js'

async function getAllStudents() {
  const db = await initDB(DB_TYPE_STUDENTS)

  await db.read()
  return db.data.alunos || []
}

async function createStudent(body) {
  const db = await initDB(DB_TYPE_STUDENTS)

  const { name, phone, email } = body

  const newStudent = {
    id: Date.now(),
    name,
    phone,
    email,
    dateRegister: new Date()
  }

  await db.read()

  const students = await getAllStudents()

  db.data.alunos = students || []
  db.data.alunos.unshift(newStudent)

  await db.write()

  return newStudent
}

async function updateStudent(studentId, body) {
  const db = await initDB(DB_TYPE_STUDENTS) 

  const { name, phone, email } = body

  await db.read()
  db.data.alunos = db.data.alunos || []

  const index = db.data.alunos.findIndex(res => res.id === studentId)

  db.data.alunos[index] = {
    ...db.data.alunos[index],
    name,
    phone,
    email
  }
  const studentUpdated = db.data.alunos[index]

  await db.write()

  return studentUpdated
}

async function deleteStudent(studentId) {
  const db = await initDB(DB_TYPE_STUDENTS)

  await db.read()
  db.data.alunos = db.data.alunos || []

  const index = db.data.alunos.findIndex(student => student.id === studentId)
  db.data.alunos.splice(index, 1)

  await db.write()
}

async function getStudentById(id) {
  const students = await getAllStudents()
  return students.find(r => String(r.id) === String(id)) || null
}

export { 
  getAllStudents, 
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentById
}