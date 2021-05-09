import { CommandOptions } from 'discord-rose'

export default {
  name: 'XP Multiplier',
  usage: 'xpmultiplier <multiplier>',
  description: 'Change the multiplier on receiving XP.',
  category: 'leveling',
  command: 'xpmultiplier',
  aliases: ['xprate'],
  userPerms: ['manageMessages'],
  myPerms: [],
  exec: async (ctx) => {
    // Get the new rate
    const newRate = Number(ctx.args[0])

    // Do the checks
    if (isNaN(newRate)) return await ctx.respond('CMD_RATE_NONE', { error: true })

    // Make sure people aren't stupid
    if (newRate <= 0) return await ctx.respond('CMD_RATE_HIGH', { error: true })
    if (newRate > 100) return await ctx.respond('CMD_RATE_LOW', { error: true })

    // Get and update the rate
    const oldRate = await ctx.worker.db.guildDB.getXPMultiplier(ctx.getID)
    await ctx.worker.db.guildDB.setXPMultiplier(ctx.getID, newRate)

    // Return success
    await ctx.respond('CMD_RATE_UPDATED', {}, String(oldRate), String(newRate))
  }
} as CommandOptions
