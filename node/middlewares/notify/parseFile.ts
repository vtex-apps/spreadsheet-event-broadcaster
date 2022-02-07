import asyncBusboy from 'async-busboy'
import { buffer } from 'get-stream'
import { read, utils } from 'xlsx'

import {
  MAXIMUM_FILE_SIZE,
  MAXIMUM_FILE_SIZE_STRING,
} from '../../utils/constants'

export async function parseFile(ctx: Context, next: () => Promise<unknown>) {
  const {
    req,
    vtex: { logger },
  } = ctx

  const {
    fields: { appId },
    files: [file],
  } = await asyncBusboy(req)

  if (!file) {
    const errorMessage = 'No file was sent'

    logger.error(errorMessage)

    ctx.status = 400
    ctx.message = errorMessage

    return
  }

  const bufferedStream = await buffer(file, {
    maxBuffer: MAXIMUM_FILE_SIZE,
  }).catch(() => {
    const errorMessage = `Input file cannot be larger than ${MAXIMUM_FILE_SIZE_STRING}`

    logger.error(errorMessage)

    ctx.status = 413
    ctx.message = errorMessage
  })

  if (!bufferedStream) {
    return
  }

  try {
    const workbook = read(bufferedStream)

    const [sheetName] = workbook.SheetNames

    const sheet = workbook.Sheets[sheetName]

    const payload = utils.sheet_to_json(sheet)

    ctx.state.payload = payload
    ctx.state.appId = (appId as string) ?? ''
  } catch (error) {
    logger.error(error.message)

    ctx.status = 500
    ctx.message = error.message

    return
  }

  await next()
}
