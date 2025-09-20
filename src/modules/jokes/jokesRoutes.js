import { getRandomJoke, getAllJokes, deleteJoke, createJoke } from './jokesService.js'
import { verifyToken } from '../../middlewares/authMiddleware.js'
import { getUserFromToken } from '../../utils/auth.js'
import { validateDelete, validatePost } from './jokesValidations.js'

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

router.post('/', validatePost, async (req, res) => {
  try {
    const token = req.cookies?.token
    const user = getUserFromToken(token)
    
    const newJoke = await createJoke(req.body, user.id)

    res.status(201).json(newJoke)
  } catch {
    res.status(500).json({ message: 'Erro ao criar a piada' })
  }
})

router.delete('/:id', validateDelete, async (req, res) => {
  const jokeId = Number(req.params.id)
  await deleteJoke(jokeId)
  
  res.status(200).json({ message: 'Piada removida com sucesso' })
})

export default router
