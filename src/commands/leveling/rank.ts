import { ApplicationCommandOptionType } from 'discord-api-types'

import { CommandOptions } from 'discord-rose'

export default <CommandOptions>{
  name: 'Rank',
  command: 'rank',
  category: 'Leveling',
  usage: '<user: User>',
  interaction: {
    name: 'rank',
    description: 'View your or another person\'s rank',
    options: [
      {
        name: 'user',
        description: 'The user',
        type: ApplicationCommandOptionType.User
      }
    ]
  },
  guildOnly: true,
  interactionOnly: true,
  exec: async (ctx) => {
    await ctx.typing()

    const userId = ctx.options.user ?? ctx.author.id
    const member = await ctx.worker.api.members.get(ctx.guild!.id, userId).catch(() => null) ?? ctx.member

    const user = member.user!

    const userOptions = await ctx.worker.db.users.getSettings(user.id)
    const userData = await ctx.worker.db.users.getLevel(user.id, ctx.guild!.id)

    const buffer = await ctx.worker.imageAPI.card({
      color: userOptions.level.color || await ctx.worker.db.guilds.getLevelColor(ctx.guild!.id),
      level: userData.level,
      maxxp: Math.floor(100 + 5 / 6 * userData.level * (2 * userData.level * userData.level + 27 * userData.level + 91)),
      picture: userOptions.level.picture || ctx.worker.utils.getGuildAvatar(member, ctx.guild!.id, 'png', 256),
      tag: userOptions.level.tag,
      usertag: `${user.username}#${user.discriminator}`,
      xp: userData.xp
    })

    await ctx.sendFile({ name: 'rank.png', buffer })
  }
}
