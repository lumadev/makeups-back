import db from '../db.js'

async function getAllStudents() {
  await db.read();
  return db.data.alunos || [];
}

export { getAllStudents }