import express from 'express'
import db from '../db.js'

const router = express.Router()

router.get('/', async (req, res) => {
  await db.read()
  res.json(db.data.alunos || [])
})

router.post('/', async (req, res) => {
  const requiredFields = {
    name: 'Nome',
    phone: 'Telefone',
    email: 'Email',
  }

  for (const field in requiredFields) {
    if (!req.body[field]) {
      return res.status(400).json({ error: `${requiredFields[field]} é obrigatório` })
    }
  }
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
  const studentId = Number(req.params.id)

  if (!req.body) {
    return res.status(400).json({ error: 'Nome, Telefone e Email são obrigatórios' })
  }
  const { name, phone, email } = req.body

  // Validação básica
  if (!name || !phone || !email) {
    return res.status(400).json({ error: 'Nome, Telefone e Email são obrigatórios' })
  }

  await db.read()
  db.data.alunos = db.data.alunos || []

  const index = db.data.alunos.findIndex(student => student.id === studentId)

  if (index === -1) {
    return res.status(404).json({ error: 'Aluno não encontrado' })
  }


  db.data.alunos[index] = {
    ...db.data.alunos[index],
    name,
    phone,
    email
  }

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