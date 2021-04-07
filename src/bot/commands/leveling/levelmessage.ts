import { CommandOptions } from 'discord-rose'

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
    const sendMesasge = !(await ctx.worker.db.guildDB.getSendLevelMessage(ctx.getID))
    await ctx.worker.db.guildDB.setSendLevelMessage(ctx.getID, sendMesasge)

    // Respond with success
    await ctx.normalResponse(ctx.worker.colors.GREEN, await ctx.lang('CMD_LEVELMESSAGE_UPDATED', sendMesasge ? 'Enabled' : 'Disabled'))
  }
} as CommandOptions
