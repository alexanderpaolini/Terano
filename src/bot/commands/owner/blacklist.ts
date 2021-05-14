import { CommandOptions } from 'discord-rose'

export default {
  command: 'blacklist',
  category: 'owner',
  aliases: ['bl'],
  locale: 'BLACKLIST',
  owner: true,
  exec: async (ctx) => {
    const userID = (ctx.args[0] || '').replace(/[<@!>]/g, '')

    if (!userID) {
      await ctx.respond('CMD_BLACKLIST_NOUSER', { error: true })
      return false
    }
    if (userID === ctx.message.author.id) {
      await ctx.respond('CMD_BLACKLIST_NOSELF', { error: true })
      return false
    }

    const isBlacklisted = await ctx.worker.db.userDB.getBlacklist(userID)
    await ctx.worker.db.userDB.setBlacklist(userID, !isBlacklisted)

    await ctx.worker.langs.getString('111', 'CUSTOM', '')

    if (!isBlacklisted) {
      await ctx.respond('CMD_BLACKLIST_ADDED', { color: ctx.worker.colors.ORANGE }, userID)
    } else {
      await ctx.respond('CMD_BLACKLIST_REMOVED', { color: ctx.worker.colors.ORANGE }, userID)
    }
    return true
  }
} as CommandOptions<boolean>
