import { CommandOptions } from 'discord-rose'

export default {
  command: 'prefix',
  category: 'moderation',
  userPerms: ['manageMessages'],
  locale: 'PREFIX',
  exec: async (ctx) => {
    const prefix = ctx.args[0]

    // Bruh my man is stupid
    if (!prefix) {
      await ctx.respond('PREFIX_CURRENT', {}, ctx.prefix)
      return true
    }
    if (prefix.length > 21) {
      await ctx.respond('CMD_PREFIX_LONG', { error: true })
      return false
    }

    // Get and change the prefix
    const oldPrefix = await ctx.worker.db.guildDB.getPrefix(ctx.id)
    await ctx.worker.db.guildDB.setPrefix(ctx.id, prefix)

    // Return success!
    await ctx.respond('CMD_PREFIX_UPDATED', {}, oldPrefix, prefix)
    return true
  }
} as CommandOptions<boolean>
