import { initDB } from '../db/db.js'
import { DB_TYPE_EVENT_DATES } from '../db/dbTypeConsts.js'

async function getAllEventDates() {
  const db = await initDB(DB_TYPE_EVENT_DATES)

  await db.read()
  return db.data.eventDate || []
}

async function getEventDateById(id) {
  const dates = await getAllEventDates()
  return dates.find(r => String(r.id) === String(id)) || null
}

export { getAllEventDates, getEventDateById }