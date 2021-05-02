import { CommandOptions } from 'discord-rose'

export default {
  name: 'Level-Up Message',
  usage: 'setlevelmessage <string>',
  description: 'Configure the Level-Up messages',
  category: 'leveling',
  command: 'setlevelmessage',
  aliases: ['slm'],
  permissions: ['manageMessages'],
  botPermissions: [],
  exec: async (ctx) => {
    // Get the new message
    const message = ctx.args.join(' ')

    // Make sure they aren't dumb
    if (message.length < 1) return await ctx.respond('CMD_LEVELMESSAGE_CURRENT', {}, await ctx.worker.db.guildDB.getLevelMessage(ctx.getID))
    if (message.length >= 100) return await ctx.respond('CMD_LEVELMESSAGE_SHORT', { error: true })

    // Update the settings
    await ctx.worker.db.guildDB.setLevelMessage(ctx.getID, message)

    // Respond with success
    await ctx.respond('CMD_LEVELMESSAGE_SET', {}, message)
  }
} as CommandOptions
