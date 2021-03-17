import TeranoWorker from '../lib/TeranoWorker'

import { readdir } from 'fs'
import { resolve } from 'path'

export default function initFunction (worker: TeranoWorker): void {
  function loadMiddleware (dir: string): void {
    readdir(dir, { withFileTypes: true }, (err, files) => {
      if (err != null) return worker.log(err.message)
      for (const file of files) {
        if (file.isDirectory()) return loadMiddleware(`${dir}/${file.name}`)
        if (file.isFile() && file.name.endsWith('.js')) {
          const middlewareFunc = require(`${dir}/${file.name}`).default // eslint-disable-line @typescript-eslint/no-var-requires
          worker.commands.middleware(middlewareFunc())
        }
      }
    })
  }
  loadMiddleware(resolve(__dirname, '../', './middlewares'))
  worker.log('Loaded Moddlewares')
}
