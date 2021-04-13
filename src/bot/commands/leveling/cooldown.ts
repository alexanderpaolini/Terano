import { CommandOptions } from 'discord-rose'

export default {
  name: 'XP-Cooldown',
  usage: 'xpcooldown <seconds>',
  description: 'Change the cooldown for getting xp from messages.',
  category: 'leveling',
  command: 'xpcooldown',
  aliases: ['cooldown'],
  permissions: ['manageMessages'],
  botPermissions: [],
  exec: async (ctx) => {
    // Make sure its a number
    const oldCooldown = await ctx.worker.db.guildDB.getXPCooldown(ctx.getID)
    if (!ctx.args[0]) return await ctx.respond('CMD_COOLDOWN_CURRENT', {}, oldCooldown)

    // Get the cooldowns
    const newCooldown = Number(ctx.args[0])
    // Check To make sure people aren't stupid
    if (newCooldown < 0 || isNaN(newCooldown)) return await ctx.respond('CMD_COOLDOWN_LOW', { error: true })

    // Update the cooldown in the DB
    await ctx.worker.db.guildDB.setXPCooldown(ctx.getID, String(newCooldown))

    // Respond with success
    await ctx.respond('CMD_COOLDOWN_UPDATED', {}, oldCooldown, String(newCooldown))
  }
} as CommandOptions
