import { initDB } from '../db/db.js'
import { DB_TYPE_JOKES } from '../db/dbTypeConsts.js'

async function getAllJokes() {
  const db = await initDB(DB_TYPE_JOKES)

  await db.read()
  const jokes = db.data.jokes || []

  return jokes
}

async function getRandomJoke() {
  const db = await initDB(DB_TYPE_JOKES)

  await db.read()
  const jokes = db.data.jokes || []
  const totalJokes = jokes.length

  if (totalJokes === 0) {
    return null
  }

  const randomIndex = Math.floor(Math.random() * jokes.length)
  return jokes[randomIndex]
}

async function deleteJoke(jokeIdParam) {
  const db = await initDB(DB_TYPE_JOKES)
  const jokeId = Number(jokeIdParam)

  await db.read()
  db.data.jokes = db.data.jokes || []

  const index = db.data.jokes.findIndex(makeup => makeup.id === jokeId)
  db.data.jokes.splice(index, 1)

  await db.write()
}

async function getJokeById(id) {
  const jokes = await getAllJokes()
  return jokes.find(r => String(r.id) === String(id)) || null
}

export { 
  getRandomJoke,
  getAllJokes,
  deleteJoke,
  getJokeById
}