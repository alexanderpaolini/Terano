import { CommandOptions } from '../../structures/CommandHandler'

export default {
  command: 'xpcooldown',
  category: 'leveling',
  aliases: ['cooldown'],
  userPerms: ['manageMessages'],
  myPerms: [],
  locale: 'COOLDOWN',
  exec: async (ctx) => {
    // Make sure its a number
    const oldCooldown = await ctx.worker.db.guildDB.getXPCooldown(ctx.id)
    if (!ctx.args[0]) {
      await ctx.respond('CMD_COOLDOWN_CURRENT', {}, oldCooldown)
      return true
    }

    // Get the cooldowns
    const newCooldown = Number(ctx.args[0])
    // Check To make sure people aren't stupid
    if (newCooldown < 0 || isNaN(newCooldown)) {
      await ctx.respond('CMD_COOLDOWN_LOW', { error: true })
      return false
    }

    // Update the cooldown in the DB
    await ctx.worker.db.guildDB.setXPCooldown(ctx.id, String(newCooldown))

    // Respond with success
    await ctx.respond('CMD_COOLDOWN_UPDATED', {}, oldCooldown, String(newCooldown))
    return true
  }
} as CommandOptions<boolean>
