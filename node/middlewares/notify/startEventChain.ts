import { v4 as uuid } from 'uuid'

export async function startEventChain(ctx: Context) {
  const {
    state: { payload, appId: clientAppId },
    clients: { events },
  } = ctx

  const eventId = uuid()

  const thisAppId = process.env.VTEX_APP_ID ?? ''

  events.sendEvent(thisAppId, 'spreadsheet.event.broadcast', {
    eventId,
    payload,
    clientAppId,
  })

  ctx.status = 200
  ctx.message = 'The spreadsheet is being processed'
}
