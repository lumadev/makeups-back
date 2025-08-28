import { getAllMakeupsDone } from '../services/makeupsDoneService.js'
import { verifyToken } from '../middlewares/authMiddleware.js'

import express from 'express'

const router = express.Router()

router.use(verifyToken)

router.get('/', async (req, res) => {
  const makeups = await getAllMakeupsDone()
  res.json(makeups)
})

export default router