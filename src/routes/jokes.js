import { getRandomJoke, getAllJokes, deleteJoke } from '../services/jokesService.js'
import { verifyToken } from '../middlewares/authMiddleware.js'

import { validateDelete } from '../utils/jokeValidations.js'

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

router.delete('/:id', validateDelete, async (req, res) => {
  const jokeId = req.params.id
  await deleteJoke(jokeId)
  
  res.status(200).json({ message: 'Piada removida com sucesso' })
})

export default router