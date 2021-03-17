import TeranoWorker from '../lib/TeranoWorker'

import { readdir } from 'fs'
import { resolve } from 'path'

export default function initFunction (worker: TeranoWorker): void {
  function loadEvents (dir: string): void {
    readdir(dir, { withFileTypes: true }, (err, files) => {
      if (err != null) return worker.log(err.message)
      for (const file of files) {
        if (file.isDirectory()) {
          loadEvents(`${dir}/${file.name}`)
          continue
        }
        if (file.isFile() && file.name.endsWith('.js')) {
          const event = require(`${dir}/${file.name}`).default // eslint-disable-line @typescript-eslint/no-var-requires
          event(worker)
        }
      }
    })
  }
  loadEvents(resolve(__dirname, '../', './events'))
  worker.log('Loaded Events')
}
