import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

const adapterUsers = new JSONFile('src/db/users.json')
const dbUsers = new Low(adapterUsers, [])

export default dbUsers