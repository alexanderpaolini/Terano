import path from 'path'

import TeranoMaster from './bot/structures/TeranoMaster'

const master = new TeranoMaster(path.resolve(__dirname, './bot/index.js'))

master.spawnProcess('API', path.resolve(__dirname, './api/index.js'))
master.spawnProcess('Influx', path.resolve(__dirname, './influx/index.js'))

master.start()
  .catch(master.log)
