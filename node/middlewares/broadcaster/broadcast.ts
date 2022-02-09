import { OUTPUT_EVENT_KEY as eventKey } from '../../utils/constants'

export async function broadcast(
  ctx: BroadcasterEventContext,
  next: () => Promise<unknown>
) {
  const {
    clients: { events },
    body: { payload, clientAppId },
  } = ctx

  payload.forEach((row) => {
    events.sendEvent(clientAppId, eventKey, {
      data: row,
    })
  })

  await next()
}
