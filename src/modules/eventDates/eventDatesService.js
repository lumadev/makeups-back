import * as eventDatesRepository from './eventDatesRepository.js'

async function getAllEventDates() {
  return await eventDatesRepository.readAll()
}

async function getEventDatesDone() {
  const eventDates = await eventDatesRepository.readAll()
  return eventDates.filter(res => res.done === true)
}

async function getEventDatesNotDone() {
  const eventDates = await eventDatesRepository.readAll()
  return eventDates.filter(res => res.done === false)
}

async function getEventDateById(eventId) {
  const dates = await eventDatesRepository.readAll()
  return dates.find(r => String(r.id) === String(eventId)) || null
}

async function createEventDate(body, user) {
  const { description, eventDate, observations, done, link } = body
  const allEvents = await eventDatesRepository.readAll()

  const newEventDate = {
    id: Date.now(),
    description,
    eventDate,
    observations,
    done,
    confirmed: false,
    link,
    userIds: [user.id]
  }

  allEvents.unshift(newEventDate)
  await eventDatesRepository.writeAll(allEvents)

  return newEventDate
}

async function updateEventDate(eventId, body) {
  const { description, eventDate, observations, done, link } = body
  const allEvents = await eventDatesRepository.readAll()

  const index = allEvents.findIndex(s => s.id === eventId)
  if (index === -1) return null

  const existingEvent = allEvents[index]

  allEvents[index] = {
    ...existingEvent,
    description,
    eventDate,
    observations,
    done,
    link,
    userIds: existingEvent.userIds
  }

  await eventDatesRepository.writeAll(allEvents)
  return allEvents[index]
}

async function deleteEventDate(eventId) {
  const allEvents = await eventDatesRepository.readAll()
  const filteredEvents = allEvents.filter(event => event.id !== eventId)
  
  await eventDatesRepository.writeAll(filteredEvents)
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