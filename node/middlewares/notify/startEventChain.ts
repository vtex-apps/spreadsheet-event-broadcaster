import { v4 as uuid } from 'uuid'

import {
  APP_ID as thisAppId,
  EVENT_CHAIN_KEY as eventKey,
} from '../../utils/constants'

export async function startEventChain(ctx: Context) {
  const {
    state: { payload, senderAppId, clientAppId },
    clients: { events },
  } = ctx

  const eventId = uuid()

  events.sendEvent(thisAppId, eventKey, {
    eventId,
    payload,
    senderAppId,
    clientAppId,
  })

  ctx.status = 200
  ctx.message = 'The spreadsheet is being processed'
}
