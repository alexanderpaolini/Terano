import { CommandOptions } from 'discord-rose'

export default <CommandOptions>{
  name: 'Leaderboard',
  command: 'leaderboard',
  category: 'Leveling',
  usage: '',
  interaction: {
    name: 'leaderboard',
    description: 'View the top ranks'
  },
  guildOnly: true,
  interactionOnly: true,
  exec: async (ctx) => {
    await ctx.typing()

    const allLevels = (await ctx.worker.db.users.getAllLevels(ctx.guild!.id))
      .sort((a, b) => {
        if (a.level !== b.level) return (b.level - a.level)
        else return (b.xp - a.xp)
      })

    const newDataArr = []

    if (allLevels.length > 8) allLevels.length = 8

    for (const levelData of allLevels) {
      const member = await ctx.worker.api.members.get(ctx.guild!.id, levelData.user_id)
      const user = member.user!

      newDataArr.push({
        tag: `${user.username}#${user.discriminator}`,
        pfp: ctx.worker.utils.getGuildAvatar(member, ctx.guild!.id),
        level: levelData.level,
        rank: Number(allLevels.indexOf(levelData)) + 1
      })
    }

    const buffer = await ctx.worker.imageAPI.leaderboard(newDataArr)
    await ctx.sendFile({ name: 'rank.png', buffer })
  }
}
