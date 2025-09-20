import axios from 'axios'
import { getAllUsers, updateUser } from '../../services/usersService.js'

export async function assignSpotifyToken(userId) {
  const users = await getAllUsers()

  const user = users.find(u => u.id === userId)
  if (!user) {
    throw new Error(`Usuário ${userId} não encontrado`)
  }

  if (user.spotifyToken && user.spotifyTokenExpiration) {
    const expiration = new Date(user.spotifyTokenExpiration)
    if (expiration > new Date()) {
      // token is not expired yet
      return user.spotifyToken
    }
  }

  const token = await getSpotifyToken()

  user.spotifyToken = token
  user.spotifyTokenExpiration = new Date(Date.now() + 60 * 60 * 1000) // 1h

  await updateUser(user)

  return token
}

export async function getSpotifyToken() {
  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error('SPOTIFY_CLIENT_ID ou SPOTIFY_CLIENT_SECRET não configurados')
  }

  const body = new URLSearchParams({ grant_type: 'client_credentials' })

  const response = await axios.post(
    'https://accounts.spotify.com/api/token',
    body.toString(),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
      },
    }
  )

  return response.data.access_token
}
