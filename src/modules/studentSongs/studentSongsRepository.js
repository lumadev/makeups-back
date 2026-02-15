import { initDB } from '../../db/db.js'
import { DB_TYPE_STUDENT_SONGS } from '../../db/dbTypeConsts.js'

async function getDb() {
  const db = await initDB(DB_TYPE_STUDENT_SONGS)
  await db.read()
  db.data.studentSongs = db.data.studentSongs || []
  return db
}

async function readAll() {
  const db = await getDb()
  return db.data.studentSongs
}

async function writeAll(songs) {
  const db = await getDb()
  db.data.studentSongs = Array.isArray(songs) ? songs : []
  await db.write()
  return db.data.studentSongs
}

export { getDb, readAll, writeAll }