import { Config } from '../../config'

import { InfluxDB, FieldType } from 'influx'

import { Thread } from 'discord-rose'

const thread = new Thread()

const influx = new InfluxDB({
  host: Config.influx.host,
  database: Config.influx.database,
  schema: [
    {
      measurement: 'memory',
      fields: {
        rss: FieldType.INTEGER,
        heapUsed: FieldType.INTEGER,
        heapTotal: FieldType.INTEGER,
        external: FieldType.INTEGER,
        arrayBuffers: FieldType.INTEGER
      },
      tags: ['cluster']
    },
    {
      measurement: 'bot-stats',
      fields: {
        guilds: FieldType.INTEGER,
        channels: FieldType.INTEGER,
        roles: FieldType.INTEGER,
        ping: FieldType.INTEGER
      },
      tags: []
    },
    {
      measurement: 'ping',
      fields: { ping: FieldType.INTEGER },
      tags: []
    }
  ]
})

if (Config.prod) {
  setInterval(() => {
    void thread.broadcastEval(`
    (() => ({
      id: worker.comms.id,
      shards: worker.shardStats,
      guilds: worker.guilds.size,
      channels: worker.channels.size,
      roles: worker.guildRoles.reduce((a, b) => a + b.size, 0)
    }))()
      `)
      .then((data) => {
        const guilds = data.reduce((a, d) => d.guilds, 0)
        const channels = data.reduce((a, d) => d.channels, 0)
        const roles = data.reduce((a, d) => d.roles, 0)
        const ping = data.map(d => Object.entries(d.shards).map(([id, s]: [string, any]) => s.ping)).flat().map(e => isNaN(parseInt(e)) ? null : parseInt(e)).filter(e => e)

        void influx.writePoints([
          {
            measurement: 'memory',
            fields: process.memoryUsage()
          },
          {
            measurement: 'bot-stats',
            fields: { guilds, channels, roles }
          },
          ...ping.map(p => {
            return {
              measurement: 'bot-stats',
              fields: { ping: p }
            }
          })
        ])
          .then()
          .catch(e => { throw e })
      })
      .catch()
  }, 500)
}
