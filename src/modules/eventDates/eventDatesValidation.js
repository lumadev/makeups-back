import { errorFieldsRequired, validateDate, errorsDate, checkMaxLengths } from '../../utils/validations.js'
import { getEventDateById } from './eventDatesService.js'

const requiredFields = {
  description: "Descrição",
  eventDate: 'Data do evento',
}

const eventDateFields = {
  eventDate: 'Data do evento',
}

const maxLengths = {
  observations: 5000,
  link: 400
}

async function validatePost(req, res, next) {
  const body = req.body

  const errorRequired = errorFieldsRequired(body, requiredFields)
  if (errorRequired) {
    return res.status(400).json({ error: errorRequired })
  }

  const lengthError = checkMaxLengths(req.body, maxLengths)
  if (lengthError) {
    return res.status(400).json({ error: lengthError })
  }

  const errorDate = errorsDate(body, eventDateFields)
  if (errorDate) {
    return res.status(400).json({ error: errorDate })
  }
  next()
}

async function validatePut(req, res, next) {
  const eventDateId = Number(req.params.id)

  const eventDateObj = await getEventDateById(eventDateId)
  if (!eventDateObj) {
    return res.status(404).json({ error: 'Data de evento não encontrada' })
  }
  req.eventDate = eventDateObj

  const eventDateValue = req.body.eventDate

  if (eventDateObj && !validateDate(eventDateValue)) {
    return res.status(400).json({ error: 'Data do evento inválida' })
  }

  const lengthError = checkMaxLengths(req.body, maxLengths)
  if (lengthError) {
    return res.status(400).json({ error: lengthError })
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