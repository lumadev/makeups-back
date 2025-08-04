import { initDB } from '../db/db.js'
import { DB_TYPE_MAKEUPS } from '../db/dbTypeConsts.js'

async function getAllMakeups() {
  const db = await initDB(DB_TYPE_MAKEUPS)
  
  await db.read()
  return db.data.reposicoes || []
}

async function deleteMakeup(idMakeup) {
  const db = await initDB(DB_TYPE_MAKEUPS)
  const makeupId = Number(idMakeup)

  await db.read()
  db.data.reposicoes = db.data.reposicoes || []

  const index = db.data.reposicoes.findIndex(makeup => makeup.id === makeupId)
  db.data.reposicoes.splice(index, 1)

  await db.write()
}

async function getMakeupById(id) {
  const makeups = await getAllMakeups()
  return makeups.find(r => String(r.id) === String(id)) || null
}

export { getAllMakeups, deleteMakeup, getMakeupById }