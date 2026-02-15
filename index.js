import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import hpp from 'hpp'

import { router } from './src/routes.js'
import { validateEnv } from './src/config/env.js'

dotenv.config({ 
  path: `.env.${process.env.NODE_ENV}`
})

validateEnv()

const app = express()
const port = process.env.PORT || 3000

const corsOrigin = process.env.NODE_ENV === 'development'
  ? ['http://localhost:5173', 'http://localhost:5174']
  : process.env.FRONTEND_URL

app.use(cors({
  origin: corsOrigin,
  credentials: true, 
}))

app.use(express.json({ limit: '10kb' }))
app.use(hpp())
app.use(cookieParser())
app.use(helmet())

app.set('trust proxy', 1)

app.use('/', router)

app.listen(port)