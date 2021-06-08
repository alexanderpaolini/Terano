import { Config } from '../config'

import fs from 'fs'
import path from 'path'

import { Api } from '@top-gg/sdk'
import { Embed, Worker } from 'discord-rose'

import flagsMiddleware from '@discord-rose/flags-middleware'
import permissionsMiddleware, { humanReadable } from '@discord-rose/permissions-middleware'

import { CommandHandler, MiddlewareFunction } from './CommandHandler'
import { LevelingHandler } from './LevelingHandler'
import { LanguageHandler } from './LanguageHandler'
import { SlashHandler } from './SlashHandler'
import { colors } from './colors'

import { Database } from '../database'
import { ImageAPI } from './ImageAPI'

export default class TeranoWorker extends Worker {
  /**
   * Whether or not the bot is on production
   */
  prod: boolean
  /**
   * The bot's configuration
   */
  config = Config
  /**
   * Fancy colors
   */
  colors = colors
  /**
   * Whether or not to accept command responses
   */
  devmode = false
  /**
   * Bot status
   */
  status = { type: 'playing', name: 'Minecraft', status: 'online', url: undefined }
  /**
   * Top.gg API (for posting stats)
   */
  topgg = new Api(this.config.topgg.token)
  /**
   * Language handler
   */
  langs = new LanguageHandler(this)
  /**
   * Level handler
   */
  levels = new LevelingHandler(this)
  /**
   * The bot's database
   */
  db = new Database()
  /**
   * The command handler
   */
  // @ts-expect-error
  commands: CommandHandler = new CommandHandler(this)
  /**
   * The slash command handler
   */
  slashCommands: SlashHandler = new SlashHandler(this)
  /**
   * The image api wrapper:tm:
   */
  imageAPI = new ImageAPI(this)

  /**
   * Create the bot
   */
  constructor () {
    super()

    this.prod = this.config.prod

    this.loadInit()

    this.commands.middleware(flagsMiddleware() as any as MiddlewareFunction)

    this.commands.middleware(permissionsMiddleware({
      my: async (ctx, p) => await ctx.lang('NO_PERMS_BOT', p.map(x => humanReadable[x] ?? x) as any as string),
      user: async (ctx, p) => await ctx.lang('NO_PERMS_USER', p.map(x => humanReadable[x] ?? x) as any as string)
    }) as any as MiddlewareFunction)

    this.commands.load(path.resolve(__dirname, '../commands'))
  }

  /**
   * Load init function
   */
  loadInit (): void {
    const dir = path.resolve(__dirname, '../', './init/')
    fs.readdir(dir, { withFileTypes: true }, (err, files) => {
      if (err != null) return this.log(err.message)
      else {
        for (const file of files) {
          if (!file.isFile()) continue
          if (!file.name.endsWith('.js')) continue
          const f = require(`${dir}/${file.name}`).default // eslint-disable-line @typescript-eslint/no-var-requires
          f(this)
        }
      }
    })
  }

  /**
   * Get an embed which sends directly to a webhook
   * @param wh Webhook name
   */
  webhook (wh: keyof typeof Config.discord.webhooks): Embed {
    const webhook = this.config.discord.webhooks[wh]
    return new Embed(async (embed) => {
      return await this.comms.sendWebhook(webhook.id, webhook.token, embed)
    })
  }

  /**
   * A nicely formatted stats
   */
  get shardStats (): ShardObject {
    return this.shards.reduce<ShardObject>((a, shard) => {
      a[shard.id] = this.guilds.reduce<ShardStat>((b, guild) => {
        if (Number((BigInt(guild.id) >> BigInt(22)) % BigInt(this.options.shards)) !== shard.id) return b
        return {
          ping: (this.shards.get(shard.id)?.ping ?? '?').toString(),
          guilds: b.guilds + 1,
          channels: b.channels + this.channels.filter(ch => ch.guild_id === guild.id).size,
          roles: b.roles + (this.guildRoles.get(guild.id)?.size ?? 0)
        }
      }, { guilds: 0, channels: 0, roles: 0, ping: '' })
      return a
    }, {})
  }

  /**
   * An object Key: shard number, Value: Guilds
   */
  get shardGuildCounts (): ShardGuildObject {
    return this.guilds.reduce<ShardGuildObject>((a, b) => {
      const shard = Number((BigInt(b.id) >> BigInt(22)) % BigInt(this.options.shards))
      if (!a[shard]) a[shard] = 0
      a[shard]++
      return a
    }, {})
  }

  /**
   * A nicely formatted memory stats
   */
  get mem (): NodeJS.MemoryUsage {
    return Object.entries(process.memoryUsage()).reduce<any>(function reduce (T, [K, V]) { T[K] = (V / (1024 ** 2)).toFixed(1) + 'MB'; return T }, {})
  }
}
