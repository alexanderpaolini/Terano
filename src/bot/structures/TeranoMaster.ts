import { Config } from '../../config'

import { Master } from 'discord-rose'
import autoPoster from 'topgg-autoposter'

import { log } from '../../utils'

export default class TeranoMaster extends Master {
  config = Config

  get processAmount (): number {
    return this.processes.reduce((a, c) => c.id.length > a ? c.id.length : a, 1)
  }

  constructor (fileName: string) {
    super(fileName, {
      token: Config.discord.token,
      shards: Number(Config.discord.shards) || 'auto',
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
        log(cluster, this.processAmount, msg)
      }
    })

    if (this.config.prod) {
      autoPoster(this.config.topgg.token, this)
        .on('posted', (stats) => {
          this.log(`Posted stats to Top.gg: ${stats.serverCount as number || '0'} Guilds | ${stats.shardCount as number || '0'} Shards`)
        })
    }
  }
}
