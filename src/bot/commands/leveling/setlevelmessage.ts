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
    if (message.length >= 100) return ctx.normalResponse(ctx.worker.colors.GREEN, 'Level-Up message must be shorter than 100 characters.')

    // Update the settings
    await ctx.worker.db.guildDB.setLevelMessage(ctx.getID, message)

    // Respond with success
    await ctx.normalResponse(ctx.worker.colors.GREEN, `Level-up message set to "${message as string}"`)
  }
} as CommandOptions
