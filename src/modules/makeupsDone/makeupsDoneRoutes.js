import { getAllMakeupsDone, deleteMakeupDone } from './makeupsDoneService.js'
import { verifyToken, requireRole } from '../../middlewares/authMiddleware.js'

import { validateDelete } from './makeupsDoneValidations.js'

import express from 'express'

const router = express.Router()

router.use(verifyToken)
router.use(requireRole(['full']))

router.get('/', async (req, res) => {
  const makeups = await getAllMakeupsDone()
  res.json(makeups)
})

router.delete('/:id', validateDelete, async (req, res) => {
  const makeupId = Number(req.params.id)
  await deleteMakeupDone(makeupId)
  
  res.status(200).json({ message: 'Reposição removida com sucesso' })
})

export default router