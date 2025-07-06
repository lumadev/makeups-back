import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

const adapterDb = new JSONFile('db.json')
const db = new Low(adapterDb, { alunos: [], reposicoes: [] })

export default db