export const validateEnv = () => {
  const required = [
    'NODE_ENV', 
    'FRONTEND_URL', 
    'GOOGLE_SERVICE_ACCOUNT_KEY', 
    'SECRET',
    'SPOTIFY_CLIENT_ID',
    'SPOTIFY_CLIENT_SECRET'
  ]
  required.forEach(name => {
    if (!process.env[name]) {
      throw new Error(`Environment variable ${name} is missing!`)
    }
  })
}