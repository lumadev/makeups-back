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

export { getRandomJoke, getAllJokes }