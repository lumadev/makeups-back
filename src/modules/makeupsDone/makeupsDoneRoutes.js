import { getAllMakeupsDone } from './makeupsDoneService.js'
import { verifyToken, requireRole } from '../../middlewares/authMiddleware.js'

import express from 'express'

const router = express.Router()

router.use(verifyToken)
router.use(requireRole(['full']))

router.get('/', async (req, res) => {
  const makeups = await getAllMakeupsDone()
  res.json(makeups)
})

export default router