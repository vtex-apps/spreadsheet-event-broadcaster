import type { ClientsConfig, ServiceContext, RecorderState } from '@vtex/api'
import { method, Service } from '@vtex/api'

import { Clients } from './clients'
import { parseFile } from './middlewares/notify/parseFile'
import { startEventChain } from './middlewares/notify/startEventChain'

const TIMEOUT_MS = 800

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
    appId: string
  }
}

export default new Service({
  clients,
  routes: {
    notify: method({
      POST: [parseFile, startEventChain],
    }),
  },
})
