import { initDB } from '../db/db.js'

async function getAllStudents() {
  const db = await initDB()

  await db.read();
  return db.data.alunos || [];
}

async function getStudentById(id) {
  const makeups = await getAllStudents();
  return makeups.find(r => String(r.id) === String(id)) || null;
}


export { getAllStudents, getStudentById }