import { getAllStudents } from '../services/studentService.js'
import { validatePost, validatePut, validateDelete } from '../utils/studentValidations.js'
import { verifyToken } from '../middlewares/authMiddleware.js'

import { DB_TYPE_STUDENTS } from '../db/dbTypeConsts.js'
import { initDB } from '../db/db.js'

import express from 'express'

const router = express.Router()

router.use(verifyToken)

router.get('/', async (req, res) => {
  const students = await getAllStudents()
  res.json(students)
})

router.post('/', validatePost, async (req, res) => {
  const db = await initDB(DB_TYPE_STUDENTS)
  const { name, phone, email } = req.body

  const newStudent = {
    id: Date.now(),
    name,
    phone,
    email,
    dateRegister: new Date()
  }

  await db.read()

  const students = await getAllStudents()

  db.data.alunos = students
  db.data.alunos.unshift(newStudent)

  await db.write()

  res.status(201).json(newStudent)
})

router.put('/:id', validatePut, async (req, res) => {
  const db = await initDB(DB_TYPE_STUDENTS) 
  const studentId = Number(req.params.id)

  const { name, phone, email } = req.body

  await db.read()
  db.data.alunos = db.data.alunos || []

  const index = db.data.alunos.findIndex(s => s.id === studentId)

  db.data.alunos[index] = {
    ...db.data.alunos[index],
    name,
    phone,
    email
  }
  const studentUpdated = db.data.alunos[index]

  await db.write()
  res.json(studentUpdated)
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