// Config
import config from './config.json'

// Required shit
import { Master } from 'discord-rose'
import path from 'path'

const master = new Master(path.resolve(__dirname, './bot/worker.js'), {
  token: config.discord.token,
  shards: 'auto',
  intents: ['GUILDS', 'GUILD_MESSAGES'],
  cacheControl: {
    guilds: ['name', 'description', 'preferred_locale', 'unavailable', 'icon', 'owner_id'],
    members: ['nick', 'user'],
    channels: ['nsfw', 'permission_overwrites'],
    roles: ['permissions']
  },
  log: (msg, cluster) => {
    console.log(new Date().toLocaleString(), `${cluster ? `Cluster ${cluster.id}${' '.repeat(master.processes.reduce((a, c) => c.id.length > a ? c.id.length : a, 1) - cluster.id.length)}` : `Master ${' '.repeat(master.processes.reduce((a, c) => c.id.length > a ? c.id.length : a, 1) + 1)}`} | ${msg}`)
  }
})

// Spawn the API
master.spawnProcess('API', path.resolve(__dirname, './api/index.js'))
master.spawnProcess('Influx', path.resolve(__dirname, './influx/index.js'))

// Add the fetch user for custom threads
master.handlers.on('FETCH_USER', (_cluster, data, resolve) => {
  master.rest.users.get(data).catch(() => false as any)
    .then(resolve)
    .catch(e => { throw e })
})

void master.start()
