import { initDB } from '../../db/db.js'
import { DB_TYPE_MAKEUPS_DONE } from '../../db/dbTypeConsts.js'

async function getAllMakeupsDone() {
  const db = await initDB(DB_TYPE_MAKEUPS_DONE)
  
  await db.read()
  return db.data.reposicoes || []
}

/**
 * @param {object} body body from request
 * @param {string} studentName student name from makeupValidations
 * 
 * @returns {object} newMakeup
 */
async function createMakeupDone(makeup) {
  const db = await initDB(DB_TYPE_MAKEUPS_DONE)

  const { studentId, dateOld, dateReplacement, isOpenDate, studentName } = makeup

  const now = new Date()

  const newMakeup = {
    id: Date.now(),
    studentId,
    studentName,
    dateOld,
    dateReplacement,
    isOpenDate: isOpenDate ?? false,
    updated: now.toLocaleString('pt-BR')
  }

  await db.read()

  db.data.reposicoes = db.data.reposicoes || []
  db.data.reposicoes.unshift(newMakeup)

  await db.write()

  return newMakeup
}

export { getAllMakeupsDone, createMakeupDone }