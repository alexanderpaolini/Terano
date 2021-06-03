import { CommandOptions } from '../../structures/CommandHandler'

import fetch from 'node-fetch'

import { APIUser, Snowflake } from 'discord-api-types'
import { getAvatar } from '../../utils'

export default {
  command: 'rank',
  category: 'leveling',
  aliases: ['card', 'level'],
  locale: 'RANK',
  myPerms: ['embed'],
  cooldown: 9e3,
  exec: async (ctx) => {
    const user =
      (await ctx.worker.api.users.get((ctx.args[0] || '').replace(/[<@!>]/g, '') as Snowflake).catch(() => null as unknown as APIUser)) ||
      ctx.message.author
    const data = await ctx.worker.db.userDB.getLevel(user.id, ctx.id)
    const settings = await ctx.worker.db.userDB.getSettings(user.id) || {} as SettingsDoc

    const usertag = `${user.username}#${user.discriminator}`

    const level = data.level
    const xp = data.xp
    const maxxp = Math.floor(100 + 5 / 6 * level * (2 * level * level + 27 * level + 91))

    const tag = settings?.level.tag || '─────────────────'
    const picture = settings?.level.picture || getAvatar(user, 'png', 256)
    const color = settings?.level.color || await ctx.worker.db.guildDB.getLevelColor(ctx.id)

    const body = { color, level, xp, maxxp, picture, tag, usertag }

    const response = await fetch(`http://localhost:${String(ctx.worker.config.image_api.port)}/leveling/card`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    }).catch(() => null)

    // Respond with an error kekw
    if (!response || !response.ok) {
      await ctx.respond('SERVER_ERROR', { error: true })
      const text = response ? await response.text() : 'No response from POST /rank'
      ctx.worker.log(text)
      return false
    }

    const buffer = await response.buffer()

    await ctx.sendFile({ name: 'rank.png', buffer: Buffer.from(buffer) })
    return true
  }
} as CommandOptions<boolean>
