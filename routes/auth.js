import { comparePasswords, generateToken, hashPassword } from '../utils/auth.js';
import { getAllUsers } from '../services/userService.js';

import express from 'express'
const router = express.Router()

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const users = await getAllUsers();

  const userValid = users.find(u => u.username === username);
  const passwordValid = await comparePasswords(password, user.password);

  if (!userValid || !passwordValid) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }
 
  const token = generateToken(user);
  res.json({ token });
});

export default router