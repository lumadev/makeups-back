import { initDB } from '../db/db.js'
import { DB_TYPE_USERS } from '../db/dbTypeConsts.js'

async function getDb() {
  const db = await initDB(DB_TYPE_USERS)
  await db.read()
  db.data.users = db.data.users || []
  return db
}

async function readAll() {
  const db = await getDb()
  return db.data.users || []
}

async function writeAll(users) {
  const db = await getDb()
  db.data.users = Array.isArray(users) ? users : []
  await db.write()
  return db.data.users
}

export { getDb, readAll, writeAll }
