// index.js
import express from 'express'
import cors from 'cors'
import db from './db.js'
import dotenv from 'dotenv';

import authRoutes from './src/routes/auth.js'
import cookieParser from 'cookie-parser';
import studentsRoutes from './src/routes/students.js'
import makeupsRoutes from './src/routes/makeups.js'

dotenv.config({
  path: `.env.${process.env.NODE_ENV}`
});

const app = express()
const port = process.env.PORT || 3000;

const corsOrigin = process.env.NODE_ENV === 'development'
  ? 'http://localhost:5173'
  : process.env.FRONTEND_URL;

app.use(cors({
  origin: corsOrigin,
  credentials: true, 
}))

app.use(express.json())
app.use(cookieParser());

app.set('trust proxy', 1);

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