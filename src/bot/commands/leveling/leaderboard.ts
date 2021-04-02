import { APIUser, Snowflake } from 'discord-api-types'
import { CommandOptions } from 'discord-rose'

import fetch from 'node-fetch'
import { getAvatar } from '../../../utils'
import NonFatalError from '../../lib/NonFatalError'

export default {
  name: 'Leaderboard',
  usage: 'leaderboard',
  description: 'View the guild leaderboard',
  category: 'leveling',
  command: 'leaderboard',
  aliases: ['lb'],
  permissions: [],
  botPermissions: [],
  cooldown: 15e3,
  exec: async (ctx) => {
    // Send the loading message
    const msg = await ctx.send('Loading...')
    // Get all of the level data and sort it
    const allLevels = await ctx.worker.db.userDB.getAllLevels(ctx.getID)
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
      const userFetch = await ctx.worker.api.users.get(user.userID as Snowflake).catch(() => null as unknown as APIUser)
      if (!userFetch || (userFetch == null)) continue

      // Push the user to the array
      newDataArr.push({
        tag: `${userFetch.username}#${userFetch.discriminator}`,
        pfp: getAvatar(userFetch),
        level: user.level,
        rank: Number(data.indexOf(user)) + 1
      })
    }

    // Fetch the canvas
    const response = await fetch(`http://localhost:${String(ctx.worker.opts.api.port)}/leaderboard`, {
      method: 'POST',
      body: JSON.stringify({ data: newDataArr }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).catch(() => null)

    // Respond with an error kekw
    if ((response == null) || !response.ok) throw new NonFatalError('Internal Server Error')

    // Get the buffer
    const buffer = await response.buffer()

    // Delete the message and send the file
    await ctx.worker.api.messages.delete(msg.channel_id, msg.id).catch(() => null)
    await ctx.sendFile({ name: 'leaderboard.png', buffer })
    if (ctx.invokeCooldown) ctx.invokeCooldown()
  }
} as CommandOptions
