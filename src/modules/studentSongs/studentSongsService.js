import { initDB } from '../../db/db.js'
import { DB_TYPE_STUDENT_SONGS } from '../../db/dbTypeConsts.js'

async function getAllStudentSongs(userType) {
  const db = await initDB(DB_TYPE_STUDENT_SONGS)

  await db.read()
  const studentSongs = db.data.studentSongs

  if (userType === 'admin') return studentSongs
  
  return db.data.studentSongs.filter(res => !res.studentName.includes("Luma"))
}

async function getStudentSongsByStudent(studentId) {
  const db = await initDB(DB_TYPE_STUDENT_SONGS)

  await db.read()
  return db.data.studentSongs.filter(res => res.studentId === studentId)
}

async function getStudentSongsDone(studentId) {
  const db = await initDB(DB_TYPE_STUDENT_SONGS)

  await db.read()

  const studentSongs = db.data.studentSongs

  return studentSongs.filter(res => {
    return res.studentId === studentId && res.done === true
  })
}

async function getStudentSongsNotDone(studentId) {
  const db = await initDB(DB_TYPE_STUDENT_SONGS)

  await db.read()

  const studentSongs = db.data.studentSongs

  return studentSongs.filter(res => {
    return res.studentId === studentId && res.done === false
  })
}

async function createStudentSong(student, body) {
  const db = await initDB(DB_TYPE_STUDENT_SONGS)
  const { songName, artist, versionLink, isRecital, isMusicAudition } = body

  const newSong = {
    id: Date.now(),
    songName,
    artist,
    studentId: student.id,
    studentName: student.name,
    versionLink,
    isRecital: Boolean(isRecital),
    isMusicAudition: Boolean(isMusicAudition),
    done: false,
    dateRegister: new Date()
  }

  await db.read()
  const songs = await getAllStudentSongs()

  db.data.studentSongs = songs
  db.data.studentSongs.unshift(newSong)

  await db.write()

  return newSong
}

async function updateStudentSong(studentId, songId, body) {
  const db = await initDB(DB_TYPE_STUDENT_SONGS)

  const { songName, artist, versionLink, isRecital, isMusicAudition, done } = body

  await db.read()
  db.data.studentSongs = db.data.studentSongs || []

  const index = db.data.studentSongs.findIndex(s => s.id === songId)

  db.data.studentSongs[index] = {
    ...db.data.studentSongs[index],
    songName,
    artist,
    studentId,
    versionLink,
    isRecital: Boolean(isRecital),
    isMusicAudition: Boolean(isMusicAudition),
    done: Boolean(done)
  }

  const updatedSong = db.data.studentSongs[index]

  await db.write()

  return updatedSong
}

async function deleteStudentSong(songId){
  const db = await initDB(DB_TYPE_STUDENT_SONGS)

  await db.read()
  db.data.studentSongs = db.data.studentSongs || []

  const index = db.data.studentSongs.findIndex(s => s.id === songId)
  db.data.studentSongs.splice(index, 1)

  await db.write()
}

async function getStudentSongById(songId) {
  const songs = await getAllStudentSongs()
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