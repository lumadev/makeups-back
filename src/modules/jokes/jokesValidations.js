import { getJokeById } from './jokesService.js'
import { errorFieldsRequired } from '../../utils/validations.js'

const requiredFields = {
  description: 'Descrição',
  type: 'Tipo da Piada'
}

async function validatePost(req, res, next) {
  const errorRequired = errorFieldsRequired(req.body, requiredFields)
  if (errorRequired) {
    return res.status(400).json({ error: errorRequired })
  }

  if (req.body.description.length > 300) {
    return res.status(400).json({ error: 'Descrição não pode ter mais de 300 caracteres' })
  }
  next()
}

async function validateDelete(req, res, next) {
  const jokeId = Number(req.params.id)

  const joke = await getJokeById(jokeId)
  if (!joke) {
    return res.status(404).json({ error: 'Piada não encontrada' })
  }

  next()
}

export { 
  validatePost,
  validateDelete
}
