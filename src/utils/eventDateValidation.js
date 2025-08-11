import { errorFieldsRequired, validateDate, errorsDate } from '../utils/validations.js'
import { getEventDateById } from '../services/datesService.js'

const eventDateFields = {
  initialDate: 'Data inicial',
  finalDate: 'Data final',
}

async function validatePost(req, res, next) {
  const errorRequired = errorFieldsRequired(req.body, eventDateFields)
  if (errorRequired) {
    return res.status(400).json({ error: errorRequired })
  }

  const errorDate = errorsDate(req.body, eventDateFields)
  if (errorDate) {
    return res.status(400).json({ error: errorDate })
  }
  next()
}

async function validatePut(req, res, next) {
  const eventDateId = Number(req.params.id)

  const eventDate = await getEventDateById(eventDateId)
  if (!eventDate) {
    return res.status(404).json({ error: 'Data de evento não encontrada' })
  }
  req.eventDate = eventDate

  const { initialDate, finalDate, observation } = req.body

  if (initialDate && !validateDate(initialDate)) {
    return res.status(400).json({ error: 'Data inicial inválida' })
  }

  if (finalDate && !validateDate(finalDate)) {
    return res.status(400).json({ error: 'Data final inválida' })
  }

  if (observation.length > 450) {
    return res.status(400).json({ error: 'O máximo de caracteres da observação é 450' })
  }
  next()
}

async function validateDelete(req, res, next) {
  const eventDateId = Number(req.params.id)

  const makeup = await getEventDateById(eventDateId)
  if (!makeup) {
    return res.status(404).json({ error: 'Data de evento não encontrado' })
  }

  next()
}

export { validatePost, validatePut, validateDelete }