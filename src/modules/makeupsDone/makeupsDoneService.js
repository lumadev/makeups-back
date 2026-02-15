import * as makeupsDoneRepository from './makeupsDoneRepository.js'

async function getAllMakeupsDone() {
  return await makeupsDoneRepository.readAll()
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

export { getAllMakeupsDone, createMakeupDone }