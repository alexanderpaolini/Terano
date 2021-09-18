import * as Jadl from 'jadl'

import path from 'path'

import { Config } from '../Config'

export class Master extends Jadl.Master {
  config = Config

  constructor () {
    super(
      path.resolve(__dirname, '..', '..', 'worker.js'),
      {
        token: Config.discord.token,
        shards: Number(Config.discord.shards) || 'auto',
        intents: ['GUILDS', 'GUILD_MESSAGES'],
        cacheControl: {
          guilds: ['name', 'description', 'preferred_locale', 'unavailable', 'icon', 'owner_id', 'preferred_locale'],
          channels: ['nsfw', 'permission_overwrites'],
          roles: ['permissions']
        }
      }
    )

    this
      .on('DEBUG', (msg) => {
        if (process.env.NODE_ENV === 'development') console.log(msg)
      })
  }
}
