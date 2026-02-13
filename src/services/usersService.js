import { getDb, readAll } from './usersRepository.js'

async function getUserById(userId) {
  const users = await readAll()
  return users.find(u => String(u.id) === String(userId)) || null
}

async function getAllUsers() {
  const users = await readAll()
  return users
}

async function updateUser(userUpdated) {
  const db = await getDb()

  const index = db.data.users.findIndex(u => String(u.id) === String(userUpdated.id))
  if (index === -1) {
    throw new Error(`Usuário ${userUpdated.id} não encontrado`)
  }

  db.data.users[index] = {
    ...db.data.users[index],
    ...userUpdated,
  }
  await db.write()

  return db.data.users[index]
}

export { getAllUsers, updateUser, getUserById }
