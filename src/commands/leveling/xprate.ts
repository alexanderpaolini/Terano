import { CommandOptions } from '../../structures/CommandHandler'

export default {
  command: 'xpmultiplier',
  category: 'leveling',
  aliases: ['xprate'],
  userPerms: ['manageMessages'],
  locale: 'RATE',
  exec: async (ctx) => {
    // Get the new rate
    const newRate = Number(ctx.args[0])

    // Do the checks
    if (isNaN(newRate)) {
      await ctx.respond('CMD_RATE_NONE', { error: true })
      return false
    }

    // Make sure people aren't stupid
    if (newRate <= 0) {
      await ctx.respond('CMD_RATE_HIGH', { error: true })
      return false
    }
    if (newRate > 100) {
      await ctx.respond('CMD_RATE_LOW', { error: true })
      return false
    }

    // Get and update the rate
    const oldRate = await ctx.worker.db.guildDB.getXPMultiplier(ctx.id)
    await ctx.worker.db.guildDB.setXPMultiplier(ctx.id, newRate)

    // Return success
    await ctx.respond('CMD_RATE_UPDATED', {}, String(oldRate), String(newRate))
    return true
  }
} as CommandOptions<boolean>
