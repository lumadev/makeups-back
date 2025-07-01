import { getAllStudents } from '../services/studentService.js';
import { validateFields } from '../utils/validation.js';

import express from 'express'
import db from '../db.js'

const router = express.Router()

router.get('/', async (req, res) => {
  const students = await getAllStudents();
  res.json(students)
})

router.post('/', async (req, res) => {
  const requiredFields = {
    name: 'Nome',
    phone: 'Telefone',
    email: 'Email',
  }

  const error = validateFields(req.body, requiredFields);
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

router.patch('/:id', async (req, res) => {
  const studentId = Number(req.params.id)

  await db.read()
  db.data.alunos = db.data.alunos || []

  const index = db.data.alunos.findIndex(student => student.id === studentId)
  if (index === -1) {
    return res.status(404).json({ error: 'Aluno não encontrado' })
  }

  const { name, phone, email } = req.body

  // Verifica se pelo menos um campo foi enviado
  if (name === undefined && phone === undefined && email === undefined) {
    return res.status(400).json({ error: 'É necessário enviar ao menos um campo para atualização' })
  }

  // Atualiza apenas os campos fornecidos
  if (name !== undefined) db.data.alunos[index].name = name
  if (phone !== undefined) db.data.alunos[index].phone = phone
  if (email !== undefined) db.data.alunos[index].email = email

  await db.write()
  res.json(db.data.alunos[index])
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