import { initDB } from '../../db/db.js'
import { DB_TYPE_EVENT_DATES } from '../../db/dbTypeConsts.js'

async function getDb() {
  const db = await initDB(DB_TYPE_EVENT_DATES)
  await db.read()
  db.data.eventDates = db.data.eventDates || []
  return db
}

async function readAll() {
  const db = await getDb()
  return db.data.eventDates
}

async function writeAll(eventDates) {
  const db = await getDb()
  db.data.eventDates = Array.isArray(eventDates) ? eventDates : []
  await db.write()
  return db.data.eventDates
}

export { readAll, writeAll }