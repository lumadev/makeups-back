import { errorFieldsRequired, validateDate, errorsDate } from '../../utils/validations.js'
import { getEventDateById } from './eventDatesService.js'

const requiredFields = {
  description: "Descrição",
  eventDate: 'Data do evento',
}

const eventDateFields = {
  eventDate: 'Data do evento',
}

async function validatePost(req, res, next) {
  const body = req.body

  const errorRequired = errorFieldsRequired(body, requiredFields)
  if (errorRequired) {
    return res.status(400).json({ error: errorRequired })
  }

  const errorDate = errorsDate(body, eventDateFields)
  if (errorDate) {
    return res.status(400).json({ error: errorDate })
  }
  const { observations } = body

  if (observations.length > 450) {
    return res.status(400).json({ error: 'O máximo de caracteres da observação é 450' })
  }

  next()
}

async function validatePut(req, res, next) {
  const eventDateId = Number(req.params.id)

  const eventDateObj = await getEventDateById(eventDateId)
  if (!eventDateObj) {
    return res.status(404).json({ error: 'Data de evento não encontrada' })
  }
  req.eventDate = eventDate

  const { eventDate, observations } = req.body

  if (eventDateObj && !validateDate(eventDate)) {
    return res.status(400).json({ error: 'Data do evento inválida' })
  }

  if (observations.length > 5000) {
    return res.status(400).json({ error: 'O máximo de caracteres da observação é 1000' })
  }
  next()
}

async function validateDelete(req, res, next) {
  const eventDateId = Number(req.params.id)

  const eventDate = await getEventDateById(eventDateId)
  if (!eventDate) {
    return res.status(404).json({ error: 'Data de evento não encontrado' })
  }

  next()
}

export { validatePost, validatePut, validateDelete }