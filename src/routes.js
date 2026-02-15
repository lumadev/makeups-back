import { Router } from 'express'

import authRoutes from './modules/auth/authRoutes.js'
import eventDatesRoutes from './modules/eventDates/eventDatesRoutes.js'
import jokesRoutes from './modules/jokes/jokesRoutes.js'
import makeupsDoneRoutes from './modules/makeupsDone/makeupsDoneRoutes.js'
import makeupsRoutes from './modules/makeups/makeupsRoutes.js'
import spotifyRoutes from './modules/spotify/spotifyRoutes.js'

import studentsRoutes from './modules/student/studentRoutes.js'
import studentSongsRoutes from './modules/studentSongs/studentSongsRoutes.js'

export const router = Router()

router.use('/auth', authRoutes)
router.use('/event-dates', eventDatesRoutes)
router.use('/jokes', jokesRoutes)
router.use('/makeups', makeupsRoutes)
router.use('/makeups-done', makeupsDoneRoutes)
router.use('/spotify', spotifyRoutes)
router.use('/students', studentsRoutes)
router.use('/student-songs', studentSongsRoutes)