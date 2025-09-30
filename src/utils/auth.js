import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const comparePasswords = async (plain, hashed) => {
  return await bcrypt.compare(plain, hashed)
}

const generateToken = (user) => {
  const SECRET = process.env.SECRET

  const { id, username, name, type } = user
  const payload = { id, username, name, type }

  return jwt.sign(payload, SECRET, {
    expiresIn: '8h',
  })
}

const getUserFromToken = (token) => {
  return jwt.verify(token, process.env.SECRET)
}

const passwordHelper = (password) => {
  if (!password || password.length === 0) return password
  return password[0] === 'w' ? 'W' + password.slice(1) : password
}

export {
  comparePasswords,
  generateToken,
  getUserFromToken,
  passwordHelper
}