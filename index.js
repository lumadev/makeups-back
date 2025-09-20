import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import authRoutes from './src/routes/auth.js'
import cookieParser from 'cookie-parser'
import eventDatesRoutes from './src/modules/eventDates/eventDatesRoutes.js'
import jokesRoutes from './src/modules/jokes/jokesRoutes.js'
import makeupsDoneRoutes from './src/routes/makeupsDone.js'
import makeupsRoutes from './src/routes/makeups.js'
import spotifyRoutes from './src/modules/spotify/spotifyRoutes.js'

import studentsRoutes from './src/routes/students.js'
import studentSongsRoutes from './src/routes/studentSongs.js'

dotenv.config({
  path: `.env.${process.env.NODE_ENV}`
})

const app = express()
const port = process.env.PORT || 3000

const corsOrigin = process.env.NODE_ENV === 'development'
  ? 'http://localhost:5173'
  : process.env.FRONTEND_URL

app.use(cors({
  origin: corsOrigin,
  credentials: true, 
}))

app.use(express.json())
app.use(cookieParser())

app.set('trust proxy', 1)

// Usa os arquivos de rota
app.use('/auth', authRoutes)
app.use('/event-dates', eventDatesRoutes)
app.use('/jokes', jokesRoutes)
app.use('/makeups', makeupsRoutes)
app.use('/makeups-done', makeupsDoneRoutes)
app.use('/spotify', spotifyRoutes)
app.use('/students', studentsRoutes)
app.use('/student-songs', studentSongsRoutes)

app.listen(port)