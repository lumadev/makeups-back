import { comparePasswords, generateToken } from '../utils/auth.js'
import express from 'express'
import dotenv from 'dotenv'

dotenv.config({
  path: `.env.${process.env.NODE_ENV}`
})

const router = express.Router()

const USERNAME = String(process.env.USERNAME_MAKEUPS)
const PASSWORD_HASH = String(process.env.PASSWORD_MAKEUPS)

router.post('/login', async (req, res) => {
  const { username, password } = req.body

  let passwordValid = false

  if (username === USERNAME) {
    passwordValid = await comparePasswords(password, PASSWORD_HASH)
  }

  if (username !== USERNAME || !passwordValid) {
    return res.status(401).json({ error: 'Credenciais inválidas' })
  }

  const user = { username: USERNAME }

  const token = generateToken(user)

  res.cookie('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    maxAge: 8 * 60 * 60 * 1000, // 8 horas
  })

  res.json({ token })
})

export default router
