import type {
  ClientsConfig,
  ServiceContext,
  RecorderState,
  EventContext,
} from '@vtex/api'
import { method, Service } from '@vtex/api'

import { Clients } from './clients'
import { broadcast } from './middlewares/broadcaster/broadcast'
import { splitPayload } from './middlewares/broadcaster/splitPayload'
import { verifyUniqueness } from './middlewares/broadcaster/verifyUniqueness'
import { parseFile } from './middlewares/notify/parseFile'
import { startEventChain } from './middlewares/notify/startEventChain'

const TIMEOUT_MS = 6000

const clients: ClientsConfig<Clients> = {
  implementation: Clients,
  options: {
    default: {
      retries: 2,
      timeout: TIMEOUT_MS,
    },
  },
}

declare global {
  type Context = ServiceContext<Clients, State>

  interface State extends RecorderState {
    payload: unknown[]
    senderAppId: string
    clientAppId: string
  }

  interface BroadcasterEventContext extends EventContext<Clients> {
    body: {
      eventId: string
      payload: unknown[]
      senderAppId: string
      clientAppId: string
    }
  }
}

export default new Service({
  clients,
  routes: {
    notify: method({
      POST: [parseFile, startEventChain],
    }),
  },
  events: {
    eventBroadcaster: [verifyUniqueness, splitPayload, broadcast],
  },
})
