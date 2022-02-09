import { v4 as uuid } from 'uuid'

import {
  APP_ID as thisAppId,
  EVENT_CHAIN_KEY as eventKey,
  ARRAY_SIZE_TARGET,
  ARRAY_SPLIT_FACTOR,
} from '../../utils/constants'

export async function splitPayload(
  ctx: BroadcasterEventContext,
  next: () => Promise<unknown>
) {
  const {
    clients: { events },
    body: { payload, clientAppId },
  } = ctx

  if (payload.length > ARRAY_SIZE_TARGET) {
    const chunkSize = Math.ceil(payload.length / ARRAY_SPLIT_FACTOR)

    for (let i = 0; i < payload.length; i += chunkSize) {
      const eventId = uuid()

      const chunk = payload.slice(i, i + chunkSize)

      events.sendEvent(thisAppId, eventKey, {
        eventId,
        payload: chunk,
        clientAppId,
      })
    }

    return
  }

  await next()
}
