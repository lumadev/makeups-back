import { errorFieldsRequired, checkMaxLengths } from '../../utils/validations.js'
import { getStudentSongById } from './studentSongsService.js'
import { getStudentById } from '../student/studentService.js'

const requiredFields = {
  songName: 'Nome da música',
  artist: 'Artista',
}

const maxLengths = {
  songName: 150,
  artist: 100,
  versionLink: 300
}

async function validateGet(req, res, next) {
  const studentId = Number(req.params.studentId)

  const student = await getStudentById(studentId)
  if (!student) {
    return res.status(404).json({ error: 'Aluno não encontrado' })
  }

  next()
}

async function validatePost(req, res, next) {
  const error = errorFieldsRequired(req.body, requiredFields)
  if (error) {
    return res.status(400).json({ error })
  }

  const lengthError = checkMaxLengths(req.body, maxLengths)
  if (lengthError) {
    return res.status(400).json({ error: lengthError })
  }

  const studentId = Number(req.params.studentId)

  const student = await getStudentById(studentId)
  if (!student) {
    return res.status(404).json({ error: 'Aluno não encontrado' })
  }
  req.student = student

  next()
}

async function validatePut(req, res, next) {
  const error = errorFieldsRequired(req.body, requiredFields)
  if (error) {
    return res.status(400).json({ error })
  }

  const lengthError = checkMaxLengths(req.body, maxLengths)
  if (lengthError) {
    return res.status(400).json({ error: lengthError })
  }

  const songId = Number(req.params.id)
  const song = await getStudentSongById(songId)
  if (!song) {
    return res.status(404).json({ error: 'Música não encontrada' })
  }

  const studentId = Number(req.params.studentId)

  const student = await getStudentById(studentId)
  if (!student) {
    return res.status(404).json({ error: 'Aluno não encontrado' })
  }

  next()
}

async function validateDelete(req, res, next) {
  const songId = Number(req.params.id)

  const song = await getStudentSongById(songId)
  if (!song) {
    return res.status(404).json({ error: 'Música não encontrada' })
  }

  next()
}

export { 
  validateGet,
  validatePost,
  validatePut,
  validateDelete
}
