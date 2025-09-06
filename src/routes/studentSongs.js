import {
  getStudentSongsByStudent,
  getStudentSongsDone,
  getStudentSongsNotDone,
  createStudentSong,
  updateStudentSong,
  deleteStudentSong
} from '../services/studentSongsService.js'
import { 
  validateGet,
  validatePost,
  validatePut,
  validateDelete
} from '../utils/studentSongsValidations.js'
import { verifyToken, requireRole } from '../middlewares/authMiddleware.js'

import express from 'express'

const router = express.Router()

router.use(verifyToken)
router.use(requireRole(['full']))

router.get('/:studentId/songs', validateGet, async (req, res) => {
  const studentId = Number(req.params.studentId)
  const studentSongs = await getStudentSongsByStudent(studentId)

  res.status(200).json(studentSongs)
})

router.get('/:studentId/songs-done', validateGet, async (req, res) => {
  const studentId = Number(req.params.studentId)
  const studentSongs = await getStudentSongsDone(studentId)

  res.status(200).json(studentSongs)
})

router.get('/:studentId/songs-not-done', validateGet, async (req, res) => {
  const studentId = Number(req.params.studentId)
  const studentSongs = await getStudentSongsNotDone(studentId)

  res.status(200).json(studentSongs)
})

router.post('/:studentId/songs', validatePost, async (req, res) => {
  const studentId = Number(req.params.studentId)
  const newSong = await createStudentSong(studentId, req.body)

  res.status(201).json(newSong)
})

router.put('/:studentId/songs/:id', validatePut, async (req, res) => {
  const songId = Number(req.params.id)
  const studentId = Number(req.params.studentId)

  const updatedSong = await updateStudentSong(studentId, songId, req.body)

  res.status(200).json(updatedSong)
})

router.delete('/:studentId/songs/:id', validateDelete, async (req, res) => {
  const studentSongId = Number(req.params.id)
  await deleteStudentSong(studentSongId)

  res.status(200).json({ message: 'Música removida com sucesso' })
})

export default router
