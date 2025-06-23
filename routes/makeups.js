import express from 'express'
import db from '../db.js'

const router = express.Router()

router.get('/', async (req, res) => {
  await db.read()
  res.json(db.data.reposicoes || [])
})

router.post('/', async (req, res) => {
  const requiredFields = {
    studentId: 'Estudante',
    dateOld: 'Data Antiga',
    dateReposition: 'Data Nova',
  }

  for (const field in requiredFields) {
    if (!req.body[field]) {
      return res.status(400).json({ error: `${requiredFields[field]} é obrigatório` })
    }
  }
  await db.read()
  const students = db.data.alunos

  const { studentId, dateOld, dateReposition } = req.body

  // Search student by id
  const student = students.find(s => String(s.id) === String(studentId))

  if (!student) {
    return res.status(404).json({ error: 'Aluno não encontrado' })
  }

  const newMakeup = {
    id: Date.now(),
    studentId,
    studentName: student.name,
    dateOld,
    dateReposition
  }

  db.data.reposicoes = db.data.reposicoes || []
  db.data.reposicoes.push(newMakeup)
  await db.write()

  res.status(201).json(newMakeup)
})

router.delete('/:id', async (req, res) => {
  const makeupId = Number(req.params.id)
  await db.read()

  db.data.reposicoes = db.data.reposicoes || []

  const index = db.data.reposicoes.findIndex(makeup => makeup.id === makeupId)
  if (index === -1) {
    return res.status(404).json({ error: 'Reposição não encontrada' })
  }

  db.data.reposicoes.splice(index, 1)
  await db.write()

  res.status(200).json({ message: 'Reposição removida com sucesso' })
})

export default router