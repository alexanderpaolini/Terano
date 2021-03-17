import { CommandOptions } from 'discord-rose/dist/typings/lib'

export default {
  name: 'Level-Up Message',
  usage: 'levelmessage',
  description: 'Toggle the Level-Up messages',
  category: 'leveling',
  command: 'levelmessage',
  aliases: ['lm'],
  permissions: ['manageMessages'],
  botPermissions: [],
  exec: async (ctx) => {
    // Get and reverse the current setting
    const sendMesasge = !(await ctx.worker.db.guildDB.getSendLevelMessage(ctx.guild.id))
    await ctx.worker.db.guildDB.setSendLevelMessage(ctx.guild.id, sendMesasge)

    // Respond with success
    await ctx.worker.responses.normal(ctx, ctx.worker.colors.GREEN, `Level-up messages ${sendMesasge ? 'Enabled' : 'Disabled'}`)
  }
} as CommandOptions
