import { getAllMakeups, deleteMakeup, createMakeup, updateMakeup } from '../services/makeupService.js'
import { createMakeupDone } from '../services/makeupsDoneService.js'

import { validatePost, validatePut, validateDelete, validateMarkAsDone } from '../utils/makeupValidations.js'
import { getUserFromToken } from '../middlewares/authMiddleware.js'

import express from 'express'

const router = express.Router()

router.use(getUserFromToken)

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

router.put('/:id/mark-as-done', validateMarkAsDone, async (req, res) => {
  const makeup = req.makeup
  const makeupId = makeup.id

  // create a makeup in makeups-done database
  await createMakeupDone(makeup)

  // delete the makeup in makeups database
  await deleteMakeup(makeupId)

  res.status(200).json({ message: 'Reposição marcada como concluída' })
})

router.delete('/:id', validateDelete, async (req, res) => {
  const makeupId = req.params.id
  await deleteMakeup(makeupId)
  
  res.status(200).json({ message: 'Reposição removida com sucesso' })
})

export default router