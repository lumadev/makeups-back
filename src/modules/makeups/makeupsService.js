import * as makeupsRepository from './makeupsRepository.js'

async function getAllMakeups() {
  return await makeupsRepository.readAll()
}

async function getMakeupById(id) {
  const makeups = await makeupsRepository.readAll()
  return makeups.find(r => String(r.id) === String(id)) || null
}

async function createMakeup(body, studentName) {
  const { studentId, dateOld, dateReplacement, isOpenDate } = body
  const allMakeups = await makeupsRepository.readAll()

  const newMakeup = {
    id: Date.now(),
    studentId,
    studentName,
    dateOld,
    dateReplacement,
    isOpenDate: isOpenDate ?? false,
  }

  allMakeups.unshift(newMakeup)
  await makeupsRepository.writeAll(allMakeups)

  return newMakeup
}

async function updateMakeup(idMakeup, body, makeup, studentName) {
  const { studentId, dateOld, dateReplacement, isOpenDate } = body
  const allMakeups = await makeupsRepository.readAll()

  let updatedStudentName = makeup.studentName
  if (studentId) {
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

  const index = allMakeups.findIndex(r => String(r.id) === String(idMakeup))
  if (index !== -1) {
    allMakeups[index] = updatedMakeup
    await makeupsRepository.writeAll(allMakeups)
  }

  return updatedMakeup
}

async function deleteMakeup(idMakeup) {
  const allMakeups = await makeupsRepository.readAll()
  const filtered = allMakeups.filter(m => String(m.id) !== String(idMakeup))
  
  await makeupsRepository.writeAll(filtered)
}

export { 
  getAllMakeups, 
  deleteMakeup, 
  createMakeup,
  updateMakeup,
  getMakeupById
}