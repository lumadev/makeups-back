import { initDB } from '../../db/db.js'
import { DB_TYPE_MAKEUPS_DONE } from '../../db/dbTypeConsts.js'

async function getDb() {
  const db = await initDB(DB_TYPE_MAKEUPS_DONE)
  await db.read()
  
  db.data.reposicoes = db.data.reposicoes || []
  return db
}

async function readAll() {
  const db = await getDb()
  return db.data.reposicoes
}

async function writeAll(makeups) {
  const db = await getDb()
  db.data.reposicoes = Array.isArray(makeups) ? makeups : []
  await db.write()
  return db.data.reposicoes
}

export { readAll, writeAll }