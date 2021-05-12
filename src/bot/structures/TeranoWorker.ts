import { Config } from '../../config'

import fs from 'fs'
import path from 'path'
import { Api } from '@top-gg/sdk'

import { Embed, Worker } from 'discord-rose'

import flagsMiddleware from '@discord-rose/flags-middleware'
import permissionsMiddleware, { humanReadable } from '@discord-rose/permissions-middleware'

import Monitor from './Monitor'
import colors from './colors'
import LanguageHandler from './LanguageHandler'
import CommandContext from './CommandContext'

import { getAvatar } from '../../utils'
import { Database } from '../../database'
import { LanguageString } from '../lang'

export default class TeranoWorker extends Worker {
  config = Config
  prod: boolean
  colors = colors
  devmode = false
  monitors: Monitor[] = []
  statsInterval: NodeJS.Timeout | null = null
  topgg = new Api(this.config.topgg.token)
  status = { type: 'playing', name: 'Minecraft', status: 'online', url: undefined }
  commandCooldowns: { [key: string]: number } = {}
  db = new Database()
  langs = new LanguageHandler(this)

  /**
   * Create the bot
   */
  constructor () {
    super()

    this.prod = this.config.prod

    this.loadInit()

    this.commands.CommandContext = CommandContext

    this.commands.middleware(flagsMiddleware())
    this.commands.middleware(permissionsMiddleware({
      my: async (ctx, p) => await ctx.lang('NO_PERMS_BOT', p.map(x => humanReadable[x] ?? x) as any as string),
      user: async (ctx, p) => await ctx.lang('NO_PERMS_USER', p.map(x => humanReadable[x] ?? x) as any as string)
    }))

    this.commands.options({
      bots: true,
      caseInsensitiveCommand: true,
      caseInsensitivePrefix: true,
      mentionPrefix: true
    })

    this.commands.prefix(async (msg: any) => {
      const id = msg.guild_id ?? 'dm'
      return await this.db.guildDB.getPrefix(id)
    })

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.commands.error(async (ctx, err) => {
      const embed = ctx.embed

      if (err.nonFatal) {
        embed
          .author((ctx.message.member?.nick ?? ctx.message.author.username) + ` | ${String(await ctx.lang(`CMD_${ctx.command.locale}_NAME` as LanguageString) ?? ctx.command.command)}`,
            getAvatar(ctx.message.author))
          .description(err.message)
      } else {
        embed
          .author('Error: ' + err.message, getAvatar(ctx.message.author))
      }

      embed
        .color(ctx.worker.colors.RED)
        .send(true)
        .then(() => { })
        .catch(() => { })
    })
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
