import { google } from 'googleapis'
import { Low } from 'lowdb'
import { dbTypes } from './dbTypeConsts.js'

import GoogleDriveAdapter from '../../src/db/googleDriveAdapter.js'

/**
 * Databases in json (Google Drive):
 * 
 * makeups
 * makeups-done
 * students
 * 
 * @param {string} dbType 
 * @returns google drive's file id
 */
function getFileIdByType(dbType) {
  const idFileMakeups = '15cf_lJNK569Nq0LGPyHhp-61Og2iVrNtT8MnRwhjyMs'
  const idFileMakeupsDone = '1uufJ-0BVJSBTlJFCGb8eNie32vRlC8buEc11jcDXpGY'
  const idFileStudents = '1G4Qv_hBakFICCUmLs7wLc2h5i1t_ki2t_-gsqVGzmrs'

  if (dbType === dbTypes.DB_TYPE_MAKEUPS) {
    return idFileMakeups
  } else if (dbType === dbTypes.DB_TYPE_MAKEUPS_DONE) {
    return idFileMakeupsDone
  } else if (dbType === dbTypes.DB_TYPE_STUDENTS) {
    return idFileStudents
  }
}

/**
 * Init database in google drive
 */
async function initDB(dbType = dbTypes.DB_TYPE_MAKEUPS) {
  const keyBuffer = Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_KEY, 'base64')
  const keyJson = JSON.parse(keyBuffer.toString('utf-8'))

  const auth = new google.auth.GoogleAuth({
    credentials: keyJson,
    scopes: ['https://www.googleapis.com/auth/drive'],
  })
  const authClient = await auth.getClient()

  // db file from google drive
  const fileId = getFileIdByType(dbType)

  const adapter = new GoogleDriveAdapter(authClient, fileId)
  const rawData = await adapter.read()

  const db = new Low(adapter, rawData)

  await db.read()

  return db
}

export { initDB }