import type { MasterDataEntity } from '@vtex/clients'
import type { EventRegistry } from 'vtex.spreadsheet-event-broadcaster'

import { MASTER_DATA_NO_CHANGES_RESPONSE_STATUS } from '../utils/constants'

export class EventRegistryService {
  private client: MasterDataEntity<EventRegistry>
  constructor(client: MasterDataEntity<EventRegistry>) {
    this.client = client
  }

  public async isEventUnique(eventId: string) {
    try {
      await this.client.saveOrUpdate({
        id: eventId,
        hasBeenProcessed: true,
      })
    } catch (error) {
      if (error?.response?.status === MASTER_DATA_NO_CHANGES_RESPONSE_STATUS) {
        return false
      }
    }

    return true
  }
}
