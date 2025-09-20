import axios from 'axios'

export async function searchTracks(token, songName, artist) {
  const tokenAuth = `Bearer ${token}`

  let query = ''
  if (songName) query += `track:${songName}`
  if (artist) query += songName ? ` artist:${artist}` : `artist:${artist}`
  
  try {
    const response = await axios.get('https://api.spotify.com/v1/search', {
      headers: {
        Authorization: tokenAuth,
      },
      params: {
        q: query,
        type: 'track',
        limit: 10,
      },
    })

    return response.data.tracks.items.map(track => ({
      id: track.id,
      name: track.name,
      artists: track.artists.map(artist => artist.name).join(', '),
      album: track.album.name,
      preview_url: track.preview_url,
      external_url: track.external_urls.spotify,
      image: track.album.images?.[0]?.url,
    }))
  } catch (error) {
    console.error('Erro ao buscar músicas no Spotify:', error.message)
    throw error
  }
}