import { EventRegistryService } from '../../services/eventRegistry'

export async function verifyUniqueness(
  ctx: BroadcasterEventContext,
  next: () => Promise<unknown>
) {
  const {
    clients: { eventRegistry },
    body: { eventId },
  } = ctx

  const registryService = new EventRegistryService(eventRegistry)

  const isUnique = await registryService.isEventUnique(eventId)

  if (!isUnique) return

  await next()
}
