// index.js
import express from 'express'
import cors from 'cors'
import db from './db.js'
import 'dotenv/config';

import authRoutes from './routes/auth.js'
import studentsRoutes from './routes/students.js'
import makeupsRoutes from './routes/makeups.js'

const app = express()
const port = 3000

app.use(cors({
  origin: 'http://localhost:5173',
}))

app.use(express.json())

await db.read()
if (!db.data) {
  db.data = { alunos: [], reposicoes: [] }
  await db.write()
}

// Usa os arquivos de rota
app.use('/students', studentsRoutes)
app.use('/makeups', makeupsRoutes)
app.use('/auth', authRoutes)

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`)
})