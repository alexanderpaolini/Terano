// Config
import config from './config.json'

// Required shit
import { Master } from 'discord-rose'
import path from 'path'

import { log } from './utils'

const master = new Master(path.resolve(__dirname, './bot/index.js'), {
  token: config.discord.token,
  shards: 'auto',
  // I don't actually have access to these
  // Therfore I need to apply for them
  intents: config.prod ? ['GUILD_MESSAGES', 'GUILDS'] : 32767,
  cache: {
    users: true,
    members: true
  },
  cacheControl: {
    guilds: ['name', 'description', 'preferred_locale', 'unavailable', 'icon', 'owner_id'],
    members: ['nick', 'user'],
    channels: ['nsfw', 'permission_overwrites'],
    roles: ['permissions']
  },
  log: (msg, cluster) => {
    log(cluster, master.processes.reduce((a, c) => c.id.length > a ? c.id.length : a, 1), msg)
  }
})

// Spawn the API
master.spawnProcess('API', path.resolve(__dirname, './api/index.js'))
master.spawnProcess('Influx', path.resolve(__dirname, './influx/index.js'))

void master.start()
