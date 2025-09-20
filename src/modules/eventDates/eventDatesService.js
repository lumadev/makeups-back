import { initDB } from '../../db/db.js'
import { DB_TYPE_EVENT_DATES } from '../../db/dbTypeConsts.js'

async function getAllEventDates() {
  const db = await initDB(DB_TYPE_EVENT_DATES)

  await db.read()
  return db.data.eventDates || []
}

async function getEventDatesDone() {
  const db = await initDB(DB_TYPE_EVENT_DATES)

  await db.read()

  const eventDates = db.data.eventDates

  return eventDates.filter(res => res.done === true)
}

async function getEventDatesNotDone() {
  const db = await initDB(DB_TYPE_EVENT_DATES)

  await db.read()

  const eventDates = db.data.eventDates

  return eventDates.filter(res => res.done === false)
}

async function createEventDate(body, user) {
  const db = await initDB(DB_TYPE_EVENT_DATES)
  const { description, eventDate, observations, done } = body

  const newEventDate = {
    id: Date.now(),
    description,
    eventDate,
    observations,
    done,
    confirmed: false,
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

  const { description, eventDate, observations, done } = body

  await db.read()
  db.data.eventDates = db.data.eventDates || []

  const index = db.data.eventDates.findIndex(s => s.id === eventId)
  const existingEvent = db.data.eventDates[index]

  db.data.eventDates[index] = {
    ...existingEvent,
    description,
    eventDate,
    observations,
    done,
    userIds: existingEvent.userIds
  }
  const eventDateUpdated = db.data.eventDates[index]

  await db.write()

  return eventDateUpdated
}

async function deleteEventDate(eventId) {
  const db = await initDB(DB_TYPE_EVENT_DATES)

  await db.read()
  db.data.eventDates = db.data.eventDates || []

  const index = db.data.eventDates.findIndex(eventDate => eventDate.id === eventId)
  db.data.eventDates.splice(index, 1)

  await db.write()
}

async function getEventDateById(eventId) {
  const dates = await getAllEventDates()
  return dates.find(r => String(r.id) === String(eventId)) || null
}

export { 
  getAllEventDates, 
  getEventDatesDone,
  getEventDatesNotDone,
  createEventDate,
  updateEventDate,
  deleteEventDate,
  getEventDateById
}