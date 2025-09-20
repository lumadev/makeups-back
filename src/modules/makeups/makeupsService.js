import { initDB } from '../../db/db.js'
import { DB_TYPE_MAKEUPS } from '../../db/dbTypeConsts.js'

async function getAllMakeups() {
  const db = await initDB(DB_TYPE_MAKEUPS)
  
  await db.read()
  return db.data.reposicoes || []
}

/**
 * @param {object} body body from request
 * @param {string} studentName student name from makeupValidations
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

/**
 * @param {string} idMakeup id param from request
 * @param {object} body from request
 * @param {object} makeup from makeupValidations
 * @param {string} studentName from makeupValidations
 * 
 * @returns {object} updatedMakeup
 */
async function updateMakeup(idMakeup, body, makeup, studentName) {
  const db = await initDB(DB_TYPE_MAKEUPS)

  const { studentId, dateOld, dateReplacement, isOpenDate } = body

  // student name from old makeup object
  let updatedStudentName = makeup.studentName

  if (studentId) {
    // if student change, get studentUpdated name from makeupValidations
    updatedStudentName = studentName
  }

  const updatedMakeup = {
    ...makeup,
    studentId: studentId ?? makeup.studentId,
    studentName: updatedStudentName,
    dateOld: dateOld ?? makeup.dateOld,
    dateReplacement: dateReplacement === undefined ? makeup.dateReplacement : dateReplacement,
    isOpenDate: isOpenDate === undefined ? makeup.isOpenDate : isOpenDate,
  }

  await db.read()

  const makeupIndex = db.data.reposicoes.findIndex(r => String(r.id) === String(idMakeup))
  db.data.reposicoes[makeupIndex] = updatedMakeup
  
  await db.write()

  return updatedMakeup
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
  updateMakeup,
  getMakeupById
}