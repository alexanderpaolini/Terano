import { CommandOptions } from '../../structures/CommandHandler'

import { APIUser, Snowflake } from 'discord-api-types'
import { getGuildAvatar } from '../../utils'

export default {
  command: 'rank',
  category: 'leveling',
  aliases: ['card', 'level'],
  locale: 'RANK',
  myPerms: ['embed'],
  cooldown: {
    time: 9e3,
    before: true
  },
  exec: async (ctx) => {
    await ctx.typing()

    const userId = (ctx.args[0] || '').replace(/[<@!>]/g, '') as Snowflake
    const member = ctx.worker.members.get(ctx.id)?.get(userId) ??
      await ctx.worker.api.members.get(ctx.id, userId).catch(() => null) ??
      ctx.member

    const user = member.user as APIUser

    const data = await ctx.worker.db.userDB.getLevel(user.id, ctx.id)
    const settings = await ctx.worker.db.userDB.getSettings(user.id)

    const usertag = `${user.username}#${user.discriminator}`

    const level = data.level
    const xp = data.xp
    const maxxp = Math.floor(100 + 5 / 6 * level * (2 * level * level + 27 * level + 91))

    const tag = settings.level.tag || '─────────────────'
    const picture = settings.level.picture || getGuildAvatar(member, ctx.id, 'png', 256)
    const color = settings.level.color || await ctx.worker.db.guildDB.getLevelColor(ctx.id)

    const body = { color, level, xp, maxxp, picture, tag, usertag }

    let buffer: Buffer
    try {
      buffer = await ctx.worker.imageAPI.card(body)
    } catch (err) {
      await ctx.respond('SERVER_ERROR', { error: true })
      console.error(err)
      return false
    }

    await ctx.sendFile({ name: 'rank.png', buffer: Buffer.from(buffer) })
    return true
  }
} as CommandOptions<boolean>
