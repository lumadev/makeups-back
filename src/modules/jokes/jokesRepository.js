import { initDB } from '../../db/db.js'
import { DB_TYPE_JOKES } from '../../db/dbTypeConsts.js'

async function getDb() {
  const db = await initDB(DB_TYPE_JOKES)
  await db.read()
  db.data.jokes = db.data.jokes || []
  return db
}

async function readAll() {
  const db = await getDb()
  return db.data.jokes || []
}

async function writeAll(jokes) {
  const db = await getDb()
  db.data.jokes = Array.isArray(jokes) ? jokes : []
  await db.write()
  return db.data.jokes
}

export { getDb, readAll, writeAll }
