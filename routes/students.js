import { getAllStudents } from '../services/studentService.js';
import { validateFields } from '../utils/validation.js';

import express from 'express'
import db from '../db.js'

const router = express.Router()

const requiredFields = {
  name: 'Nome',
  phone: 'Telefone',
  email: 'Email',
}

router.get('/', async (req, res) => {
  const students = await getAllStudents();
  res.json(students)
})

router.post('/', async (req, res) => {
  const error = validateFields(req.body, requiredFields)
  if (error) return res.status(400).json({ error });

  const { name, phone, email } = req.body

  const newStudent = {
    id: Date.now(),
    name,
    phone,
    email,
    dateRegister: new Date()
  }

  await db.read()

  db.data.alunos = db.data.alunos || []
  db.data.alunos.push(newStudent)
  await db.write()

  res.status(201).json(newStudent)
})

router.put('/:id', async (req, res) => {
  const error = validateFields(req.body, requiredFields )
  if (error) return res.status(400).json({ error })
    
  const studentId = Number(req.params.id)

  await db.read()
  db.data.alunos = db.data.alunos || []

  const index = db.data.alunos.findIndex(student => student.id === studentId)
  if (index === -1) {
    return res.status(404).json({ error: 'Aluno não encontrado' })
  }

  const { name, phone, email } = req.body

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

router.delete('/:id', async (req, res) => {
  const studentId = Number(req.params.id)
  await db.read()

  db.data.alunos = db.data.alunos || []

  const index = db.data.alunos.findIndex(student => student.id === studentId)
  if (index === -1) {
    return res.status(404).json({ error: 'Aluno não encontrado' })
  }

  db.data.alunos.splice(index, 1)
  await db.write()

  res.status(200).json({ message: 'Aluno removido com sucesso' })
})

export default router