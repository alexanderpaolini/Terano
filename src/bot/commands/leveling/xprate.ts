import { CommandOptions } from 'discord-rose'

export default {
  name: 'XP Multiplier',
  usage: 'xpmultiplier <multiplier>',
  description: 'Change the multiplier on receiving XP.',
  category: 'leveling',
  command: 'xpmultiplier',
  aliases: ['xprate'],
  permissions: ['manageMessages'],
  botPermissions: [],
  exec: async (ctx) => {
    // Get the new rate
    const newRate = Number(ctx.args[0])

    // Do the checks
    if (isNaN(newRate)) return ctx.error(await ctx.lang('CMD_RATE_NONE'))

    // Make sure people aren't stupid
    if (newRate <= 0) return ctx.error(await ctx.lang('CMD_RATE_HIGH'))
    if (newRate > 100) return ctx.error(await ctx.lang('CMD_RATE_LOW'))

    // Get and update the rate
    const oldRate = await ctx.worker.db.guildDB.getXPMultiplier(ctx.getID)
    await ctx.worker.db.guildDB.setXPMultiplier(ctx.getID, newRate)

    // Return success
    await ctx.normalResponse(ctx.worker.colors.GREEN, await ctx.lang('CMD_RATE_UPDATED', String(oldRate), String(newRate)))
  }
} as CommandOptions
