import type { IncomingMessage } from 'http'

import Busboy from 'busboy'

export async function busboyWrapper<T>(req: IncomingMessage): Promise<T> {
  let result
  let clientAppId

  try {
    const parsedData = await parseForm(req)
    result = parsedData.files
    clientAppId = parsedData.fields.appId
  } catch (e) {
    throw new Error(e)
  }

  return {
    fields: { appId: clientAppId },
    files: [result],
  } as unknown as T
}

async function parseForm(req: IncomingMessage): Promise<{ fields: any, files: any }> {
  try {
    return new Promise((resolve, reject) => {
      const bb = new Busboy({ headers: req.headers as { 'content-type': string } })
      const fields: any = {}
      const files: any = []

      bb.on('file', (_, file) => {
        const fileData: Buffer[] = []

        file.on('data', (data) => {
          fileData.push(data)
        })

        file.on('end', () => {
          files.push(Buffer.concat(fileData))
        })
      })

      bb.on('field', (fieldname, val) => {
        fields[fieldname] = val
      })

      bb.on('finish', () => {
        resolve({ fields, files })
      })

      bb.on('error', (err: any) => {
        reject(err)
      })

      req.pipe(bb)
    })
  } catch (error) {
    throw new Error(error)
  }
}

export function senderAppIdFromHeaders(headers: IncomingMessage['headers']) {
  const appIdWithVersion = headers['x-vtex-caller'] as string

  return appIdWithVersion.split('@')[0]
}
