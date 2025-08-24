import { getRandomJoke, getAllJokes } from '../services/jokesService.js'
import { verifyToken } from '../middlewares/authMiddleware.js'

import express from 'express'

const router = express.Router()

router.use(verifyToken)

router.get('/', async (req, res) => {
  const jokes = await getAllJokes()
  res.json(jokes)
})

router.get('/random/random-joke', async (req, res) => {
  const randomJoke = await getRandomJoke()
  res.json(randomJoke)
})

export default router