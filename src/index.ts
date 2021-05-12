import { Config } from './config'

import { Master } from 'discord-rose'
import autoPoster from 'topgg-autoposter'
import path from 'path'

import { log } from './utils'

const master = new Master(path.resolve(__dirname, './bot/index.js'), {
  token: Config.discord.token,
  shards: 'auto',
  // I don't actually have access to these
  // Therfore I need to apply for them
  intents: Config.prod ? ['GUILD_MESSAGES', 'GUILDS'] : 32767,
  cache: {
    users: true,
    members: true
  },
  cacheControl: {
    guilds: ['name', 'description', 'preferred_locale', 'unavailable', 'icon', 'owner_id', 'preferred_locale'],
    members: ['nick', 'user'],
    channels: ['nsfw', 'permission_overwrites'],
    roles: ['permissions']
  },
  log: (msg, cluster) => {
    log(cluster, master.processes.reduce((a, c) => c.id.length > a ? c.id.length : a, 1), msg)
  }
})

master.spawnProcess('API', path.resolve(__dirname, './api/index.js'))
master.spawnProcess('Influx', path.resolve(__dirname, './influx/index.js'))

if (Config.prod) {
  autoPoster(Config.topgg.token, master)
    .on('posted', (stats) => {
      master.log(`Posted stats to Top.gg: ${stats.serverCount as number || '0'} Guilds | ${stats.shardCount as number || '0'} Shards`)
    })
}

void master.start()
