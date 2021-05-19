import { CommandOptions } from '../../structures/CommandHandler'

export default {
  command: 'levelmessage',
  category: 'leveling',
  aliases: ['lm'],
  userPerms: ['manageMessages'],
  locale: 'LEVELMESSAGE',
  exec: async (ctx) => {
    // Get and reverse the current setting
    const sendMesasge = !(await ctx.worker.db.guildDB.getSendLevelMessage(ctx.id))
    await ctx.worker.db.guildDB.setSendLevelMessage(ctx.id, sendMesasge)

    // Respond with success
    if (sendMesasge) {
      await ctx.respond('CMD_LEVELMESSAGE_ENABLED')
      return false
    } else await ctx.respond('CMD_LEVELMESSAGE_DISABLED')
    return true
  }
} as CommandOptions<boolean>
