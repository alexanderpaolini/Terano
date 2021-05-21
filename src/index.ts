import path from 'path'

import TeranoMaster from './structures/TeranoMaster'

const master = new TeranoMaster(path.resolve(__dirname, './worker.js'))

master.spawnProcess('API', path.resolve(__dirname, './processes/api/index.js'))
master.spawnProcess('Influx', path.resolve(__dirname, './processes/influx/index.js'))

master.start()
  .catch(master.log)
