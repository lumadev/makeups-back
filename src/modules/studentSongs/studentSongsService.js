import * as repository from './studentSongsRepository.js'

async function getAllStudentSongs(userType) {
  const songs = await repository.readAll()

  if (userType === 'admin') return songs
  
  // Regra de negócio: usuários comuns não veem músicas da "Luma"
  return songs.filter(res => !res.studentName.includes("Luma"))
}

async function getStudentSongsByStudent(studentId) {
  const songs = await repository.readAll()
  return songs.filter(res => res.studentId === studentId)
}

async function getStudentSongsDone(studentId) {
  const songs = await getStudentSongsByStudent(studentId)
  return songs.filter(res => res.done === true)
}

async function getStudentSongsNotDone(studentId) {
  const songs = await getStudentSongsByStudent(studentId)
  return songs.filter(res => res.done === false)
}

async function createStudentSong(student, userType, body) {
  const songs = await repository.readAll()
  
  const newSong = {
    id: Date.now(),
    songName: body.songName,
    artist: body.artist,
    spotifyId: '',
    studentId: student.id,
    studentName: student.name,
    versionLink: body.versionLink,
    isRecital: Boolean(body.isRecital),
    isMusicAudition: Boolean(body.isMusicAudition),
    done: false,
    dateRegister: new Date()
  }

  songs.unshift(newSong)
  await repository.writeAll(songs)

  return newSong
}

async function updateStudentSong(studentId, songId, body) {
  const songs = await repository.readAll()
  const index = songs.findIndex(s => s.id === songId)

  if (index === -1) return null

  songs[index] = {
    ...songs[index],
    songName: body.songName,
    artist: body.artist,
    spotifyId: body.spotifyId,
    studentId,
    versionLink: body.versionLink,
    isRecital: Boolean(body.isRecital),
    isMusicAudition: Boolean(body.isMusicAudition),
    done: Boolean(body.done)
  }

  await repository.writeAll(songs)
  return songs[index]
}

async function deleteStudentSong(songId) {
  const songs = await repository.readAll()
  const filteredSongs = songs.filter(s => s.id !== songId)
  await repository.writeAll(filteredSongs)
}

async function getStudentSongById(songId, userType) {
  const songs = await getAllStudentSongs(userType)
  return songs.find(r => String(r.id) === String(songId)) || null
}

export { 
  getAllStudentSongs,
  getStudentSongsByStudent,
  getStudentSongsDone,
  getStudentSongsNotDone,
  createStudentSong,
  updateStudentSong,
  deleteStudentSong,
  getStudentSongById
}