import { google } from 'googleapis'
import { Low } from 'lowdb'

import GoogleDriveAdapter from '../../src/db/googleDriveAdapter.js'

async function initDB() {
  const keyBuffer = Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_KEY, 'base64')
  const keyJson = JSON.parse(keyBuffer.toString('utf-8'))

  const auth = new google.auth.GoogleAuth({
    credentials: keyJson,
    scopes: ['https://www.googleapis.com/auth/drive'],
  })
  const authClient = await auth.getClient()

  // db file from google drive
  const fileId = '15cf_lJNK569Nq0LGPyHhp-61Og2iVrNtT8MnRwhjyMs'

  const adapter = new GoogleDriveAdapter(authClient, fileId)
  const rawData = await adapter.read()

  const db = new Low(adapter, rawData)

  await db.read()

  return db
}

export { initDB }