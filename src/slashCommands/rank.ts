import { SlashCommand } from '../structures/SlashHandler'

import { Snowflake } from 'discord-api-types'

import { getAvatar } from '../utils'

export default {
  name: 'rank',
  description: 'View your rank',
  options: [
    {
      name: 'user',
      type: 6,
      description: 'The user',
      required: false
    }
  ],
  exec: async (ctx) => {
    const u = ctx.interaction.data?.options?.find(e => e.name === 'user')
    if (u && !('value' in u)) return
    const mentionId = u?.value as Snowflake

    const user = (ctx.worker.users.get(mentionId ?? '') ??
      ctx.worker.members.get(ctx.interaction.guild_id)?.get(mentionId ?? '')?.user ??
      ctx.interaction.member.user)

    await ctx.thinking()

    const levelData = await ctx.worker.db.userDB.getLevel(user.id, ctx.interaction.guild_id)
    const settings = await ctx.worker.db.userDB.getSettings(user.id) || {} as SettingsDoc

    const usertag = `${user.username}#${user.discriminator}`

    const level = levelData.level
    const xp = levelData.xp
    const maxxp = Math.floor(100 + 5 / 6 * level * (2 * level * level + 27 * level + 91))

    const tag = settings?.level.tag || '─────────────────'
    const picture = settings?.level.picture || getAvatar(user, 'png', 256)
    const color = settings?.level.color || await ctx.worker.db.guildDB.getLevelColor(ctx.interaction.guild_id)

    const body = { color, level, xp, maxxp, picture, tag, usertag }

    let buffer: Buffer
    try {
      buffer = await ctx.worker.imageAPI.card(body)
    } catch (err) {
      await ctx.send('Oops! An internal error occured.')
      console.error(err)
      return false
    }

    await ctx.sendFile({ buffer, name: 'rank.png' })
  }
} as SlashCommand
