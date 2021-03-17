import TeranoWorker from '../lib/TeranoWorker'

import { readdir } from 'fs'
import { resolve } from 'path'

export default function initFunction (worker: TeranoWorker): void {
  function loadCommands (dir: string): void {
    readdir(dir, { withFileTypes: true }, (err, files) => {
      if (err != null) return worker.log(err.message)
      for (const file of files) {
        if (file.isDirectory()) {
          loadCommands(`${dir}/${file.name}`)
          continue
        }
        if (file.isFile() && file.name.endsWith('.js')) {
          const cmd = require(`${dir}/${file.name}`).default // eslint-disable-line @typescript-eslint/no-var-requires
          if (!cmd) continue
          worker.commands.add(cmd)
        }
      }
    })
  }
  loadCommands(resolve(__dirname, '../', './commands'))
  worker.log('Loaded Commands')
}
