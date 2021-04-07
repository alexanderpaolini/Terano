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
    // Get the cooldowns
    const newCooldown = Number(ctx.args[0])
    const oldCooldown = await ctx.worker.db.guildDB.getXPCooldown(ctx.getID)

    // Make sure its a number
    if (isNaN(newCooldown)) return ctx.error(await ctx.lang('CMD_COOLDOWN_CURRENT', oldCooldown))

    // Check To make sure people aren't stupid
    if (newCooldown < 0) return ctx.error(await ctx.lang('CMD_COOLDOWN_LOW'))

    // Update the cooldown in the DB
    await ctx.worker.db.guildDB.setXPCooldown(ctx.getID, String(newCooldown))

    // Respond with success
    await ctx.normalResponse(ctx.worker.colors.GREEN, await ctx.lang('CMD_COOLDOWN_UPDATED', oldCooldown, String(newCooldown)))
  }
} as CommandOptions
