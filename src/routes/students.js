import { getAllStudents, createStudent, updateStudent } from '../services/studentService.js'
import { validatePost, validatePut, validateDelete } from '../utils/studentValidations.js'
import { verifyToken, requireRole } from '../middlewares/authMiddleware.js'

import { DB_TYPE_STUDENTS } from '../db/dbTypeConsts.js'
import { initDB } from '../db/db.js'

import express from 'express'

const router = express.Router()

router.use(verifyToken)
router.use(requireRole(['full']))

router.get('/', async (req, res) => {
  const students = await getAllStudents()
  res.json(students)
})

router.post('/', validatePost, async (req, res) => {
  const newStudent = await createStudent(req.body)
  res.status(201).json(newStudent)
})

router.put('/:id', validatePut, async (req, res) => {
  const idStudent = Number(req.params.id)
  const studentUpdated = await updateStudent(idStudent, req.body)

  res.status(200).json(studentUpdated)
})

router.delete('/:id', validateDelete, async (req, res) => {
  const db = await initDB(DB_TYPE_STUDENTS)
  const studentId = Number(req.params.id)

  await db.read()
  db.data.alunos = db.data.alunos || []

  const index = db.data.alunos.findIndex(student => student.id === studentId)
  db.data.alunos.splice(index, 1)

  await db.write()

  res.status(200).json({ message: 'Aluno removido com sucesso' })
})

export default router