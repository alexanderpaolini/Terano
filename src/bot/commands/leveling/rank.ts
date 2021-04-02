import { CommandOptions } from 'discord-rose'
import NonFatalError from '../../lib/NonFatalError'

import fetch from 'node-fetch'

import { APIUser, Snowflake } from 'discord-api-types'
import { getAvatar } from '../../../utils'

export default {
  name: 'Rank',
  usage: 'rank [mention]',
  description: 'View your rank in a card format.',
  category: 'leveling',
  command: 'rank',
  aliases: ['card', 'level'],
  permissions: [],
  botPermissions: [],
  cooldown: 9e3,
  exec: async (ctx) => {
    const user =
      (await ctx.worker.api.users.get((ctx.args[0] || '').replace(/[<@!>]/g, '') as Snowflake).catch(() => null as unknown as APIUser)) ||
      ctx.message.author
    const data = await ctx.worker.db.userDB.getLevel(user.id, ctx.getID)
    const settings = await ctx.worker.db.userDB.getSettings(user.id) || {} as SettingsDoc

    const usertag = `${user.username as string}#${user.discriminator as string}`

    const level = data.level
    const xp = data.xp
    const maxxp = Math.floor(100 + 5 / 6 * level * (2 * level * level + 27 * level + 91))

    const tag = settings?.level.tag || '─────────────────'
    const picture = settings?.level.picture || getAvatar(user, 'png', 256)
    const color = settings?.level.color || await ctx.worker.db.guildDB.getLevelColor(ctx.getID)

    const body = { color, level, xp, maxxp, picture, tag, usertag }

    const response = await fetch(`http://localhost:${String(ctx.worker.opts.api.port)}/card`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    // Respond with an error kekw
    if (!response || !response.ok) throw new NonFatalError('Internal Server Error')

    const buffer = await response.buffer()

    await ctx.sendFile({ name: 'rank.png', buffer: Buffer.from(buffer) })
    if (ctx.invokeCooldown) ctx.invokeCooldown()
  }
} as CommandOptions
