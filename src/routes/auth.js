import { comparePasswords, generateToken } from '../utils/auth.js'
import { getAllUsers } from '../services/usersService.js'

import express from 'express'
import dotenv from 'dotenv'

dotenv.config({
  path: `.env.${process.env.NODE_ENV}`
})

const router = express.Router()

router.post('/login', async (req, res) => {
  const users = await getAllUsers()

  const { username, password } = req.body

  // check if username exists in database
  const user = users.find(u => u.username === username)
  if (!user) {
    return res.status(401).json({ error: 'Credenciais inválidas' })
  }

  // check if password is correct
  const passwordValid = await comparePasswords(password, user.pass)
  if (!passwordValid) {
    return res.status(401).json({ error: 'Credenciais inválidas' })
  }

  const token = generateToken(user)
  const { type, name } = user

  res.cookie('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    maxAge: 8 * 60 * 60 * 1000, // 8 horas
  })

  res.json({ token, name, type })
})

export default router
