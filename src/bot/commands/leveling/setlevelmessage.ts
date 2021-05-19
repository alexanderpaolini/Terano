import { CommandOptions } from '../../structures/CommandHandler'

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
    if (message.length < 1) {
      await ctx.respond('CMD_SETLEVELMESSAGE_CURRENT', { error: true }, await ctx.worker.db.guildDB.getLevelMessage(ctx.id))
      return false
    }
    if (message.length >= 100) {
      await ctx.respond('CMD_SETLEVELMESSAGE_SHORT', { error: true })
      return false
    }

    // Update the settings
    await ctx.worker.db.guildDB.setLevelMessage(ctx.id, message)

    // Respond with success
    await ctx.respond('CMD_SETLEVELMESSAGE_SET', {}, message)
    return true
  }
} as CommandOptions<boolean>
