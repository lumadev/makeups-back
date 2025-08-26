import { getJokeById } from '../services/jokesService.js'

async function validateDelete(req, res, next) {
  const jokeId = Number(req.params.id)

  const joke = await getJokeById(jokeId)
  if (!joke) {
    return res.status(404).json({ error: 'Piada não encontrada' })
  }

  next()
}

export { 
  validateDelete
}
