import { APIUser, Snowflake } from 'discord-api-types'
import { CommandOptions } from '../../structures/CommandHandler'

import { getGuildAvatar } from '../../utils'

export default {
  command: 'leaderboard',
  category: 'leveling',
  aliases: ['lb'],
  locale: 'LEADERBOARD',
  myPerms: ['embed'],
  cooldown: {
    time: 15e3,
    before: true
  },
  exec: async (ctx) => {
    await ctx.typing()

    // Get all of the level data and sort it
    const allLevels = await ctx.worker.db.userDB.getAllLevels(ctx.id)
    const data = allLevels.sort((a, b) => {
      if (a.level !== b.level) return (a.level - b.level)
      else return (Number(a.xp) - Number(b.xp))
    })
    data.reverse()

    // Intialize the array that will be posted
    const newDataArr = []

    if (data.length > 8) data.length = 8

    // Loop through all users, getting the data from each
    for (const user of data) {
      const member = ctx.worker.members.get(ctx.id)?.get(user.userID as Snowflake) ??
        await ctx.worker.api.members.get(ctx.id, user.userID as Snowflake)
      // Fetch the user, if none just continue
      const user_ = member.user as APIUser
      if (!user_) continue

      // Push the user to the array
      newDataArr.push({
        tag: `${user_.username}#${user_.discriminator}`,
        pfp: getGuildAvatar(member, ctx.id),
        level: user.level,
        rank: Number(data.indexOf(user)) + 1
      })
    }

    let buffer: Buffer
    try {
      buffer = await ctx.worker.imageAPI.leaderboard(newDataArr)
    } catch (err) {
      await ctx.respond('SERVER_ERROR', { error: true })
      console.error(err)
      return false
    }

    // Send the file
    await ctx.sendFile({ name: 'leaderboard.png', buffer })
    return true
  }
} as CommandOptions<boolean>
