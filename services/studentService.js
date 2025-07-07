import db from '../db.js'

async function getAllStudents() {
  await db.read();
  return db.data.alunos || [];
}

async function getStudentById(id) {
  const makeups = await getAllStudents();
  return makeups.find(r => String(r.id) === String(id)) || null;
}


export { getAllStudents, getStudentById }