import dbUsers from '../dbUsers.js'

async function getAllUsers() {
  await dbUsers.read();
  return dbUsers.data || [];
}

export { getAllUsers }