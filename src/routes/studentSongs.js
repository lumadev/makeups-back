import {
  getAllStudentSongs,
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
  const studentSongs = await getAllStudentSongs()
  res.json(studentSongs)
})

router.post('/:studentId/songs', validatePost, async (req, res) => {
  const newSong = await createStudentSong(req.body)
  res.status(201).json(newSong)
})

router.put('/:studentId/songs/:id', validatePut, async (req, res) => {
  const songId = Number(req.params.id)
  const updatedSong = await updateStudentSong(songId, req.body)

  res.json(updatedSong)
})

router.delete('/:studentId/songs/:id', validateDelete, async (req, res) => {
  const studentSongId = req.params.id
  await deleteStudentSong(studentSongId)

  res.status(200).json({ message: 'Música removida com sucesso' })
})

export default router
