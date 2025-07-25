import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

const adapterDb = new JSONFile('db.json')
const db = new Low(adapterDb, { alunos: [], reposicoes: [] })

async function initDB() {
  await db.read()

  db.data ||= { alunos: [], reposicoes: [] }

  await db.write()

  return db
}

export { initDB }