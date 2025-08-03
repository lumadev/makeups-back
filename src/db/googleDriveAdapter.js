import { google } from 'googleapis'
import stream from 'stream'

class GoogleDriveAdapter {
  constructor(authClient, fileId) {
    this.drive = google.drive({ version: 'v3', auth: authClient })
    this.fileId = fileId
  }

  async read() {
    try {
      const res = await this.drive.files.export({
        fileId: this.fileId,
        mimeType: 'text/plain'
      }, { responseType: 'stream' })

      // Buffer para armazenar os dados
      const chunks = []

      // O response.body é um stream; vamos ler ele
      await new Promise((resolve, reject) => {
        res.data
          .on('data', chunk => chunks.push(chunk))
          .on('end', resolve)
          .on('error', reject)
      })

      const fileText = Buffer.concat(chunks).toString('utf8')

      const rawDataTrimmed = fileText ? fileText.trimStart() : {}

      if (typeof rawDataTrimmed === 'string') {
        return JSON.parse(rawDataTrimmed)
      }
      return rawDataTrimmed
    } catch (error) {
      if (error.code === 404) return null
      throw error
    }
  }

  async write(data) {
    try {
      const bufferStream = new stream.PassThrough()

      const dataStringify = JSON.stringify(data, null, 2) 
      const dataString = typeof data === 'string' ? data : dataStringify

      bufferStream.end(Buffer.from(dataString, 'utf-8'))

      await this.drive.files.update({
        fileId: this.fileId,
        media: {
          mimeType: 'application/json',
          body: bufferStream,
        },
      })
    } catch (error) {
      console.error('Erro ao gravar arquivo no Google Drive:', error)
      throw error
    }
  }
}

export default GoogleDriveAdapter
