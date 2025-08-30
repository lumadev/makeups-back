import { getAllEventDates, createEventDate, updateEventDate } from '../services/datesService.js'
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
  res.status(200).json(userDates)
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
