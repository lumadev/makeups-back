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
 * student-songs
 * event-dates
 * jokes
 * users
 * 
 * @param {string} dbType 
 * @returns google drive's file id
 */
function getFileIdByType(dbType) {
  // mapping between dbTypes and file IDs
  const fileIdMap = {
    [dbTypes.DB_TYPE_MAKEUPS]: '15cf_lJNK569Nq0LGPyHhp-61Og2iVrNtT8MnRwhjyMs',
    [dbTypes.DB_TYPE_MAKEUPS_DONE]: '1uufJ-0BVJSBTlJFCGb8eNie32vRlC8buEc11jcDXpGY',
    [dbTypes.DB_TYPE_STUDENTS]: '1G4Qv_hBakFICCUmLs7wLc2h5i1t_ki2t_-gsqVGzmrs',
    [dbTypes.DB_TYPE_STUDENT_SONGS]: '1Rqcqt0PSZiHhjMWmo6hIaUgiJKtnzNPs9rhJf8mTkp8',
    [dbTypes.DB_TYPE_EVENT_DATES]: '11YGauy7RjGEAXgolvL7xFMqMP18Bii-_DbefZRhEaqQ',
    [dbTypes.DB_TYPE_JOKES]: '1kNSPddGEZEPzezUwpz6l0Y8Ou-RFK0ma198yHRrTVN8',
    [dbTypes.DB_TYPE_USERS]: '1lxYz7ge-Ro0P6j1iU_UJHeRF91ih-J41jDcyvwZsnRs'
  }

  return fileIdMap[dbType] || null
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