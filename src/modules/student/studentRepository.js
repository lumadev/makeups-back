import { initDB } from '../../db/db.js'
import { DB_TYPE_STUDENTS } from '../../db/dbTypeConsts.js'

async function getDb() {
  const db = await initDB(DB_TYPE_STUDENTS)
  await db.read()
  db.data.alunos = db.data.alunos || []
  return db
}

async function readAll() {
  const db = await getDb()
  return db.data.alunos
}

async function writeAll(students) {
  const db = await getDb()
  db.data.alunos = Array.isArray(students) ? students : []
  await db.write()
  return db.data.alunos
}

export { readAll, writeAll }