import { 
  getAllEventDates,
  getEventDatesDone,
  getEventDatesNotDone,
  createEventDate,
  updateEventDate,
  deleteEventDate
} from '../services/datesService.js'
import { validatePost, validatePut, validateDelete } from '../utils/eventDateValidation.js'
import { verifyToken, requireRole } from '../middlewares/authMiddleware.js'

import { getUserFromToken } from '../utils/auth.js' 

import express from 'express'

const router = express.Router()

router.use(verifyToken)
router.use(requireRole(['full']))

const filterByUser = (events, user) => {
  if (user.type === 'admin') return events
  return events.filter(event => event.userIds?.includes(user.id))
}

router.get('/', async (req, res) => {
  const user = getUserFromToken(req.cookies?.token)
  const eventDates = await getAllEventDates()

  res.json(filterByUser(eventDates, user))
})

router.get('/events-done', async (req, res) => {
  const user = getUserFromToken(req.cookies?.token)
  const eventDates = await getEventDatesDone()

  res.json(filterByUser(eventDates, user))
})

router.get('/events-not-done', async (req, res) => {
  const user = getUserFromToken(req.cookies?.token)
  const eventDates = await getEventDatesNotDone()

  res.json(filterByUser(eventDates, user))
})

router.post('/', validatePost, async (req, res) => {
  const token = req.cookies?.token
  const user = getUserFromToken(token)

  const newEventDate = await createEventDate(req.body, user)

  res.status(201).json(newEventDate)
})

router.put('/:id', validatePut, async (req, res) => {
  const eventId = Number(req.params.id)
  const eventDateUpdated = await updateEventDate(eventId, req.body)

  res.status(200).json(eventDateUpdated)
})

router.delete('/:id', validateDelete, async (req, res) => {
  const eventId = Number(req.params.id)
  await deleteEventDate(eventId)

  res.status(200).json({ message: 'Data de evento removida com sucesso' })
})

export default router
