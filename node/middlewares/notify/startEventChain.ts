import { v4 as uuid } from 'uuid'

import {
  APP_ID as thisAppId,
  EVENT_CHAIN_KEY as eventKey,
  ARRAY_SIZE_PAYLOAD,
} from '../../utils/constants'

export async function startEventChain(ctx: Context) {
  const {
    state: { payload, senderAppId, clientAppId },
    clients: { events },
  } = ctx

  if (payload.length > ARRAY_SIZE_PAYLOAD) {
    const chunkSize = ARRAY_SIZE_PAYLOAD
    for (let i = 0; i < payload.length; i += chunkSize) {
      const eventId = uuid()
      const chunk = payload.slice(i, i + chunkSize)

      events.sendEvent(thisAppId, eventKey, {
        eventId,
        payload: chunk,
        senderAppId,
        clientAppId,
      })
    }
  } else {
    const eventId = uuid()
    events.sendEvent(thisAppId, eventKey, {
      eventId,
      payload,
      senderAppId,
      clientAppId,
    })
  }

  ctx.status = 200
  ctx.message = 'The spreadsheet is being processed'
}
