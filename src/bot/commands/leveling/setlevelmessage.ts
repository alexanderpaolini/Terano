import { CommandOptions } from 'discord-rose'

export default {
  command: 'setlevelmessage',
  category: 'leveling',
  aliases: ['slm'],
  userPerms: ['manageMessages'],
  locale: 'SETLEVELMESSAGE',
  exec: async (ctx) => {
    // Get the new message
    const message = ctx.args.join(' ')

    // Make sure they aren't dumb
    if (message.length < 1) return await ctx.respond('CMD_SETLEVELMESSAGE_CURRENT', { error: true }, await ctx.worker.db.guildDB.getLevelMessage(ctx.getID))
    if (message.length >= 100) return await ctx.respond('CMD_SETLEVELMESSAGE_SHORT', { error: true })

    // Update the settings
    await ctx.worker.db.guildDB.setLevelMessage(ctx.getID, message)

    // Respond with success
    await ctx.respond('CMD_SETLEVELMESSAGE_SET', {}, message)
  }
} as CommandOptions
