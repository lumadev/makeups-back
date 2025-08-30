import { getAllStudents, createStudent, updateStudent, deleteStudent } from '../services/studentService.js'
import { validatePost, validatePut, validateDelete } from '../utils/studentValidations.js'
import { verifyToken, requireRole } from '../middlewares/authMiddleware.js'

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
  const studentId = Number(req.params.id)
  const studentUpdated = await updateStudent(studentId, req.body)

  res.status(200).json(studentUpdated)
})

router.delete('/:id', validateDelete, async (req, res) => {
  const studentId = Number(req.params.id)
  await deleteStudent(studentId)

  res.status(200).json({ message: 'Aluno removido com sucesso' })
})

export default router