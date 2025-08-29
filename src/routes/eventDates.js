import { getAllEventDates } from '../services/datesService.js'
import { validatePost, validatePut, validateDelete } from '../utils/eventDateValidation.js'
import { verifyToken, requireRole } from '../middlewares/authMiddleware.js'

import { DB_TYPE_EVENT_DATES } from '../db/dbTypeConsts.js'
import { initDB } from '../db/db.js'

import { getUserFromToken } from '../utils/auth.js' 

import express from 'express'

const router = express.Router()

router.use(verifyToken)
router.use(requireRole(['full']))

router.get('/', async (req, res) => {
  const token = req.cookies?.token
  const user = getUserFromToken(token)

  const eventDates = await getAllEventDates()

  if (user.type === 'admin') {
    return res.json(eventDates)
  }

  const userDates = eventDates.filter(event => event.userIds?.includes(user.id))
  res.json(userDates)
})

router.post('/', validatePost, async (req, res) => {
  const token = req.cookies?.token
  const user = getUserFromToken(token)

  const db = await initDB(DB_TYPE_EVENT_DATES)
  const { description, initialDate, finalDate, observations } = req.body

  const newEventDate = {
    id: Date.now(),
    description,
    initialDate,
    finalDate,
    observations,
    userIds: [user.id]
  }

  await db.read()
  const eventDates = await getAllEventDates()

  db.data.eventDates = eventDates
  db.data.eventDates.unshift(newEventDate)

  await db.write()

  res.status(201).json(newEventDate)
})

router.put('/:id', validatePut, async (req, res) => {
  const db = await initDB(DB_TYPE_EVENT_DATES) 
  const eventId = Number(req.params.id)

  const { description, initialDate, finalDate, observations } = req.body

  await db.read()
  db.data.eventDates = db.data.eventDates || []

  const index = db.data.eventDates.findIndex(s => s.id === eventId)

  if (index === -1) {
    return res.status(404).json({ error: 'Evento não encontrado' })
  }

  const existingEvent = db.data.eventDates[index]

  db.data.eventDates[index] = {
    ...existingEvent,
    description,
    initialDate,
    finalDate,
    observations,
    userIds: existingEvent.userIds
  }
  const eventDateUpdated = db.data.eventDates[index]

  await db.write()
  res.json(eventDateUpdated)
})

router.delete('/:id', validateDelete, async (req, res) => {
  const db = await initDB(DB_TYPE_EVENT_DATES)
  const eventDateId = Number(req.params.id)

  await db.read()
  db.data.eventDates = db.data.eventDates || []

  const index = db.data.eventDates.findIndex(eventDate => eventDate.id === eventDateId)
  db.data.eventDates.splice(index, 1)

  await db.write()

  res.status(200).json({ message: 'Data de evento removida com sucesso' })
})

export default router
