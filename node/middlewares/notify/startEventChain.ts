import { v4 as uuid } from 'uuid'

import { APP_ID as thisAppId } from '../../utils/constants'

export async function startEventChain(ctx: Context) {
  const {
    state: { payload, appId: clientAppId },
    clients: { events },
  } = ctx

  const eventId = uuid()

  events.sendEvent(thisAppId, 'spreadsheet.event.broadcast', {
    eventId,
    payload,
    clientAppId,
  })

  ctx.status = 200
  ctx.message = 'The spreadsheet is being processed'
}
