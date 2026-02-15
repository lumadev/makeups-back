import * as makeupsDoneRepository from './makeupsDoneRepository.js'

async function getAllMakeupsDone() {
  return await makeupsDoneRepository.readAll()
}

async function getMakeupDoneById(id) {
  const makeups = await makeupsDoneRepository.readAll()
  return makeups.find(r => String(r.id) === String(id)) || null
}

async function createMakeupDone(makeup) {
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

  const allMakeups = await makeupsDoneRepository.readAll()
  allMakeups.unshift(newMakeup)
  
  await makeupsDoneRepository.writeAll(allMakeups)

  return newMakeup
}

async function deleteMakeupDone(idMakeup) {
  const allMakeups = await makeupsDoneRepository.readAll()
  const filtered = allMakeups.filter(m => String(m.id) !== String(idMakeup))
  
  await makeupsDoneRepository.writeAll(filtered)
}


export { 
  getAllMakeupsDone, 
  getMakeupDoneById,
  createMakeupDone,
  deleteMakeupDone
}