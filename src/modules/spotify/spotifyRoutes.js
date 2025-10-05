import { assignSpotifyToken } from './spotifyAuthService.js'
import { searchTracks, getTrackDetails } from './spotifyService.js'
import { verifyToken, requireRole } from '../../middlewares/authMiddleware.js'
import { getUserFromToken } from '../../utils/auth.js' 

import express from 'express'
const router = express.Router()

router.use(verifyToken)
router.use(requireRole(['full']))

router.post('/credentials', async (req, res) => {
  const user = getUserFromToken(req.cookies?.token)
  try {
    const token = await assignSpotifyToken(user.id)
    res.json({ access_token: token })
  } catch {
    res.status(500).json({ error: 'Falha ao obter token do Spotify' })
  }
})

router.get('/search-song', async (req, res) => {
  const user = getUserFromToken(req.cookies?.token)

  const { songName, artist } = req.query

  if (!songName) {
    return res.status(400).json({ error: 'Parâmetro songName é obrigatório' })
  }

  try {
    const token = await assignSpotifyToken(user.id)
    const results = await searchTracks(token, songName, artist)

    res.json(results)
  } catch {
    res.status(500).json({ error: 'Erro ao buscar músicas no Spotify' })
  }
})

router.get('/track-details', async (req, res) => {
  const user = getUserFromToken(req.cookies?.token)

  const { spotifyId } = req.query

  if (!spotifyId) {
    return res.status(400).json({ error: 'spotifyId é obrigatório' })
  }

  try {
    const token = await assignSpotifyToken(user.id)
    const results = await getTrackDetails(token, spotifyId)

    res.json(results)
  } catch {
    res.status(500).json({ error: 'Erro ao buscar músicas no Spotify' })
  }
})


export default router
