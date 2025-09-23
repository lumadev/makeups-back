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
        limit: 50,
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

export async function getTrackDetails(token, spotifyId) {
  const tokenAuth = `Bearer ${token}`

  try {
    const trackResponse = await axios.get(
      `https://api.spotify.com/v1/tracks/${spotifyId}`,
      {
        headers: { Authorization: tokenAuth },
      }
    )

    const track = trackResponse.data

    // const audioFeaturesResponse = await axios.get(
    //   `https://api.spotify.com/v1/audio-features/${spotifyId}`,
    //   {
    //     headers: { Authorization: tokenAuth },
    //   }
    // )
    // const audioFeatures = audioFeaturesResponse.data

    return {
      id: track.id,
      name: track.name,
      artists: track.artists.map((a) => a.name).join(", "),
      album: track.album.name,
      release_date: track.album.release_date,
      duration_ms: track.duration_ms,
      preview_url: track.preview_url,
      external_url: track.external_urls.spotify,
      image: track.album.images?.[0]?.url,

      // Audio features ot available
      // bpm: audioFeatures.tempo,
      // key: audioFeatures.key,
      // mode: audioFeatures.mode,
      // time_signature: audioFeatures.time_signature,
      // energy: audioFeatures.energy,
      // danceability: audioFeatures.danceability,
      // valence: audioFeatures.valence,
      // acousticness: audioFeatures.acousticness,
      // instrumentalness: audioFeatures.instrumentalness,
      // liveness: audioFeatures.liveness,
      // speechiness: audioFeatures.speechiness,
    }
  } catch (error) {
    console.error("Erro ao buscar detalhes da música no Spotify:", error.message)
    throw error
  }
}