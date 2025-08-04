import { initDB } from '../db/db.js'
import { DB_TYPE_STUDENTS } from '../db/dbTypeConsts.js'

async function getAllStudents() {
  const db = await initDB(DB_TYPE_STUDENTS)

  await db.read()
  return db.data.alunos || []
}

async function getStudentById(id) {
  const makeups = await getAllStudents()
  return makeups.find(r => String(r.id) === String(id)) || null
}


export { getAllStudents, getStudentById }