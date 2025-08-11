import { getAllEventDates } from '../services/datesService.js'
import { validatePost, validatePut, validateDelete } from '../utils/eventDateValidation.js'
import { verifyToken } from '../middlewares/authMiddleware.js'

import { DB_TYPE_EVENT_DATES } from '../db/dbTypeConsts.js'
import { initDB } from '../db/db.js'

import express from 'express'

const router = express.Router()

router.use(verifyToken)

router.get('/', async (req, res) => {
  const dates = await getAllEventDates()
  res.json(dates)
})

router.post('/', validatePost, async (req, res) => {
  const db = await initDB(DB_TYPE_EVENT_DATES)
  const { initialDate, finalDate } = req.body

  const newEventDate = {
    id: Date.now(),
    initialDate,
    finalDate
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

  const { initialDate, finalDate } = req.body

  await db.read()
  db.data.eventDates = db.data.eventDates || []

  const index = db.data.eventDates.findIndex(s => s.id === eventId)

  db.data.eventDates[index] = {
    ...db.data.eventDates[index],
    initialDate,
    finalDate,
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