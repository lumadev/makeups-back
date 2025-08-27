import { initDB } from '../db/db.js'
import { DB_TYPE_USERS } from '../db/dbTypeConsts.js'

async function getAllUsers() {
  const db = await initDB(DB_TYPE_USERS)

  await db.read()
  const jokes = db.data.users || []

  return jokes
}

export { getAllUsers }