import { readAll, writeAll } from './jokesRepository.js'

async function getAllJokes() {
  const jokes = await readAll()
  return jokes
}

async function getRandomJoke() {
  const jokes = await readAll()
  const totalJokes = jokes.length

  if (totalJokes === 0) {
    return null
  }

  const randomIndex = Math.floor(Math.random() * jokes.length)
  return jokes[randomIndex]
}

async function createJoke(body, userId) {
  const { description, type } = body

  const jokes = await readAll()
  const maxId = jokes.length > 0 ? Math.max(...jokes.map(j => Number(j.id) || 0)) : 0
  const newIndex = maxId + 1

  const newJoke = {
    id: newIndex,
    description,
    type,
    userId
  }
  const updated = [newJoke, ...jokes]
  await writeAll(updated)

  return newJoke
}

async function deleteJoke(jokeIdParam) {
  const jokeId = Number(jokeIdParam)

  const jokes = await readAll()

  const index = jokes.findIndex(j => j.id === jokeId)
  if (index < 0) return

  jokes.splice(index, 1)
  await writeAll(jokes)
}

async function getJokeById(id) {
  const jokes = await readAll()
  return jokes.find(r => String(r.id) === String(id)) || null
}

export { 
  getRandomJoke,
  getAllJokes,
  createJoke,
  deleteJoke,
  getJokeById
}
