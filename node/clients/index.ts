import { IOClients } from '@vtex/api'
import { masterDataFor } from '@vtex/clients'
import type { EventRegistry } from 'vtex.spreadsheet-event-broadcaster'

export class Clients extends IOClients {
  public get eventRegistry() {
    return this.getOrSet(
      'eventRegistry',
      masterDataFor<EventRegistry>('eventRegistry')
    )
  }
}
