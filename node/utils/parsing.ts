import type { IncomingMessage } from 'http'

import asyncBusboy from 'async-busboy'

export async function asyncBusboyWrapper<T>(req: IncomingMessage): Promise<T> {
  const result = await asyncBusboy(req)

  return (result as unknown) as T
}

export function senderAppIdFromHeaders(headers: IncomingMessage['headers']) {
  const appIdWithVersion = headers['x-vtex-caller'] as string

  return appIdWithVersion.split('@')[0]
}
