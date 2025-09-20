import { initDB } from '../db/db.js'
import { DB_TYPE_USERS } from '../db/dbTypeConsts.js'

async function getAllUsers() {
  const db = await initDB(DB_TYPE_USERS)

  await db.read()
  const jokes = db.data.users || []

  return jokes
}

async function updateUser(userUpdated) {
  const db = await initDB(DB_TYPE_USERS)
  await db.read()

  if (!db.data.users) {
    db.data.users = []
  }

  const userIndex = db.data.users.findIndex(u => u.id === userUpdated.id)
  if (userIndex === -1) {
    throw new Error(`Usuário ${userUpdated.id} não encontrado`)
  }

  db.data.users[userIndex] = {
    ...db.data.users[userIndex],
    ...userUpdated,
  }
  await db.write()

  return db.data.users[userIndex]
}

export { getAllUsers, updateUser }