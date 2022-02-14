import { OUTPUT_EVENT_KEY as eventKey } from '../../utils/constants'

export async function broadcast(
  ctx: BroadcasterEventContext,
  next: () => Promise<unknown>
) {
  const {
    clients: { events },
    body: { payload, senderAppId, clientAppId },
  } = ctx

  payload.forEach((row) => {
    events.sendEvent(clientAppId, eventKey, {
      data: row,
      senderAppId,
    })
  })

  await next()
}
