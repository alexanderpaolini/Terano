import { CommandOptions } from 'discord-rose'

export default {
  command: 'levelmessage',
  category: 'leveling',
  aliases: ['lm'],
  userPerms: ['manageMessages'],
  locale: 'LEVELMESSAGE',
  exec: async (ctx) => {
    // Get and reverse the current setting
    const sendMesasge = !(await ctx.worker.db.guildDB.getSendLevelMessage(ctx.getID))
    await ctx.worker.db.guildDB.setSendLevelMessage(ctx.getID, sendMesasge)

    // Respond with success
    if (sendMesasge) return await ctx.respond('CMD_LEVELMESSAGE_ENABLED')
    else await ctx.respond('CMD_LEVELMESSAGE_DISABLED')
  }
} as CommandOptions
