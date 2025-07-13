// index.js
import express from 'express'
import cors from 'cors'
import db from './db.js'
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js'
import cookieParser from 'cookie-parser';
import studentsRoutes from './routes/students.js'
import makeupsRoutes from './routes/makeups.js'

dotenv.config({
  path: `.env.${process.env.NODE_ENV}`
});

const app = express()
const port = 3000

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))

app.use(express.json())
app.use(cookieParser());

await db.read()
if (!db.data) {
  db.data = { alunos: [], reposicoes: [] }
  await db.write()
}

// Usa os arquivos de rota
app.use('/students', studentsRoutes)
app.use('/makeups', makeupsRoutes)
app.use('/auth', authRoutes)

app.listen(port)