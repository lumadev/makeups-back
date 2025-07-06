import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

const adapterUsers = new JSONFile('users.json')
const dbUsers = new Low(adapterUsers, [])

export default dbUsers