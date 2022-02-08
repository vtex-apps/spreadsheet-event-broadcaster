import type { FileReadStream } from 'async-busboy'

export type NotifyInputParameters = {
  fields: {
    appId?: string
  }
  files: [FileReadStream]
}
