import dbUsers from '../db/dbUsers.js'

async function getAllUsers() {
  await dbUsers.read();
  return dbUsers.data || [];
}

export { getAllUsers }