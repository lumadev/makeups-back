import { 
  getAllStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentById
} from './studentService.js'
import { validatePost, validatePut, validateDelete } from './studentValidations.js'
import { verifyToken, requireRole } from '../../middlewares/authMiddleware.js'

import { getUserFromToken } from '../../utils/auth.js' 

import express from 'express'

const router = express.Router()

router.use(verifyToken)
router.use(requireRole(['full']))

const filterByUser = (students, user) => {
  if (user.type === 'admin') return students
  return students.filter(student => !student.name.includes("Luma"))
}

router.get('/', async (req, res) => {
  const user = getUserFromToken(req.cookies?.token)
  const students = await getAllStudents()

  res.json(filterByUser(students, user))
})

router.get('/:id', async (req, res) => {
  const studentId = Number(req.params.id)
  const student = await getStudentById(studentId)

  if (!student) {
    return res.status(404).json({ message: 'Aluno não encontrado' })
  }

  res.json(student)
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