import db from '../db.js'

async function getAllMakeups() {
  await db.read();
  return db.data.reposicoes || [];
}

export { getAllMakeups }