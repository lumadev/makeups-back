import { getAllMakeups, deleteMakeup, createMakeup, updateMakeup } from '../services/makeupService.js'
import { validatePost, validatePut, validateDelete } from '../utils/makeupValidations.js'
import { verifyToken } from '../middlewares/authMiddleware.js'

import express from 'express'

const router = express.Router()

router.use(verifyToken)

router.get('/', async (req, res) => {
  const makeups = await getAllMakeups()
  res.json(makeups)
})

router.post('/', validatePost, async (req, res) => {
  const newMakeup = await createMakeup(req.body, req.student.name)

  res.status(201).json(newMakeup)
})

router.put('/:id', validatePut, async (req, res) => {
  const idMakeup = req.params.id
  const body = req.body
  const makeup = req.makeup
  const studentName = makeup.studentName

  const updatedMakeup = updateMakeup(idMakeup, body, makeup, studentName)

  res.json(updatedMakeup)
})

router.delete('/:id', validateDelete, async (req, res) => {
  await deleteMakeup(req.params.id)
  
  res.status(200).json({ message: 'Reposição removida com sucesso' })
})

export default router