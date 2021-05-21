import { APIUser, Snowflake } from 'discord-api-types'
import { CommandOptions } from '../../structures/CommandHandler'

import fetch from 'node-fetch'
import { getAvatar } from '../../utils'

export default {
  command: 'leaderboard',
  category: 'leveling',
  aliases: ['lb'],
  locale: 'LEADERBOARD',
  myPerms: ['embed'],
  cooldown: 15e3,
  exec: async (ctx) => {
    // Send the loading message
    const msg = await ctx.respond('LOADING')
    if (!msg) return
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
      // Fetch the user, if none just continue
      const user_ = ctx.worker.users.get(user.userID as Snowflake) ??
        ctx.worker.members.get(ctx.id)?.get(user.userID as Snowflake)?.user ??
        await ctx.worker.api.users.get(user.userID as Snowflake).catch(() => null as unknown as APIUser)
      if (!user_) continue

      // Push the user to the array
      newDataArr.push({
        tag: `${user_.username}#${user_.discriminator}`,
        pfp: getAvatar(user_),
        level: user.level,
        rank: Number(data.indexOf(user)) + 1
      })
    }

    // Fetch the canvas
    const response = await fetch(`http://localhost:${String(ctx.worker.config.api.port)}/leaderboard`, {
      method: 'POST',
      body: JSON.stringify({ data: newDataArr }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).catch(() => null)

    // Respond with an error kekw
    if (!response || !response.ok) {
      await ctx.respond('SERVER_ERROR', { error: true })
      const text = response ? await response.text() : 'No response from POST /leaderboard'
      ctx.worker.log(text)
      return false
    }

    // Get the buffer
    const buffer = await response.buffer()

    // Delete the message and send the file
    await ctx.worker.api.messages.delete(msg.channel_id, msg.id).catch(() => null)
    await ctx.sendFile({ name: 'leaderboard.png', buffer })
    return true
  }
} as CommandOptions<boolean>
