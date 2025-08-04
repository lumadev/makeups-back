import { initDB } from '../db/db.js'
import { DB_TYPE_MAKEUPS } from '../db/dbTypeConsts.js'

async function getAllMakeups() {
  const db = await initDB(DB_TYPE_MAKEUPS)
  
  await db.read()
  return db.data.reposicoes || []
}

/**
 * @param {object} body body from request
 * @param {string} studentName student name from request
 * 
 * @returns {object} newMakeup
 */
async function createMakeup(body, studentName) {
  const db = await initDB(DB_TYPE_MAKEUPS)
  
  const { studentId, dateOld, dateReplacement, isOpenDate } = body

  const newMakeup = {
    id: Date.now(),
    studentId,
    studentName, // get student from makeupValidations
    dateOld,
    dateReplacement,
    isOpenDate: isOpenDate ?? false,
  }

  await db.read()

  db.data.reposicoes = db.data.reposicoes || []
  db.data.reposicoes.unshift(newMakeup)

  await db.write()

  return newMakeup
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

export { 
  getAllMakeups, 
  deleteMakeup, 
  createMakeup,
  getMakeupById
}