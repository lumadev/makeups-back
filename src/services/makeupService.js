import { initDB } from '../db/db.js'
import { DB_TYPE_MAKEUPS } from '../db/dbTypeConsts.js'

async function getAllMakeups() {
  const db = await initDB(DB_TYPE_MAKEUPS)
  
  await db.read()
  return db.data.reposicoes || []
}

async function getMakeupById(id) {
  const makeups = await getAllMakeups()
  return makeups.find(r => String(r.id) === String(id)) || null
}

export { getAllMakeups, getMakeupById }