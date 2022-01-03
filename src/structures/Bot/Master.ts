import * as Jadl from 'jadl'

import path from 'path'

import { createLogger, transports, format } from 'winston'

import { Config } from '../Config'

export class Master extends Jadl.Master {
  config = Config

  logger = createLogger({
    level: 'debug',
    format: format.combine(
      format.colorize({ colors: { info: 'blue', debug: 'magenta', warn: 'yellow', error: 'red', silly: 'rainbow' }, level: true }),
      format.label({ label: 'BOT' }),
      format.errors({ stack: true }),
      format.splat(),
      format.printf((info) => `[${info.label as string}] [${info.level}]: ${info.message}`)
    ),
    transports: [
      new transports.Console()
    ]
  })

  constructor () {
    super(
      path.resolve(__dirname, '..', '..', 'worker.js'),
      {
        token: Config.discord.token,
        shards: Number(Config.discord.shards) || 'auto',
        intents: 513,
        cacheControl: {
          guilds: ['name', 'description', 'preferred_locale', 'unavailable', 'icon', 'owner_id', 'preferred_locale'],
          channels: ['nsfw', 'permission_overwrites'],
          roles: ['permissions']
        }
      }
    )

    this.log = (msg: string, c?: Jadl.Cluster) => this.logger.info(c ? `Cluster ${c.id} | ${msg}` : msg)

    this
      .on('DEBUG', (msg) => {
        if (process.env.NODE_ENV === 'development') this.logger.debug(msg)
      })
  }
}
