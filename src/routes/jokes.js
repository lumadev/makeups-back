import { getRandomJoke } from '../services/jokesService.js'
import { verifyToken } from '../middlewares/authMiddleware.js'

import express from 'express'

const router = express.Router()

router.use(verifyToken)

router.get('/random-joke', async (req, res) => {
  const randomJoke = await getRandomJoke()
  res.json(randomJoke)
})

export default router