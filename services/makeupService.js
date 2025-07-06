import db from '../db.js'

async function getAllMakeups() {
  await db.read();
  return db.data.reposicoes || [];
}

async function getMakeupById(id) {
  await db.read();
  const makeups = db.data.reposicoes || [];
  return makeups.find(r => String(r.id) === String(id)) || null;
}

export { getAllMakeups, getMakeupById }