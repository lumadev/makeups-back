import { initDB } from '../db/db.js'
import { DB_TYPE_EVENT_DATES } from '../db/dbTypeConsts.js'

async function getAllEventDates() {
  const db = await initDB(DB_TYPE_EVENT_DATES)

  await db.read()
  return db.data.eventDates || []
}

async function createEventDate(body, user) {
  const db = await initDB(DB_TYPE_EVENT_DATES)
  const { description, initialDate, finalDate, observations } = body

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

  return newEventDate
}

async function updateEventDate(eventId, body){
  const db = await initDB(DB_TYPE_EVENT_DATES) 

  const { description, initialDate, finalDate, observations } = body

  await db.read()
  db.data.eventDates = db.data.eventDates || []

  const index = db.data.eventDates.findIndex(s => s.id === eventId)
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

  return eventDateUpdated
}

async function getEventDateById(id) {
  const dates = await getAllEventDates()
  return dates.find(r => String(r.id) === String(id)) || null
}

export { 
  getAllEventDates, 
  createEventDate,
  updateEventDate,
  getEventDateById
}