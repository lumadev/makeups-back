import { comparePasswords, generateToken } from '../utils/auth.js';
import { getAllUsers } from '../services/userService.js';

import express from 'express'

const router = express.Router()

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const users = await getAllUsers();

  const user = users.find(u => u.username === username);
  let passwordValid = false

  if (user) {
    passwordValid = await comparePasswords(password, user.password)
  }

  if (!user || !passwordValid) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }
    
  const token = generateToken(user);

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 3600000 // 1 hour
  });
 
  res.json({ token });
});

export default router