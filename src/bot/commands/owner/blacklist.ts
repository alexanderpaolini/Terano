import { CommandOptions } from 'discord-rose'

export default {
  name: 'Blacklist',
  usage: 'blacklist <mention | ID>',
  description: 'Blacklist a user from using the bot.',
  category: 'owner',
  command: 'blacklist',
  aliases: ['bl'],
  userPerms: [],
  myPerms: [],
  owner: true,
  exec: async (ctx) => {
    const userID = (ctx.args[0] || '').replace(/[<@!>]/g, '')

    if (!userID) return await ctx.respond('CMD_BLACKLIST_NOUSER', { error: true })
    if (userID === ctx.message.author.id) return await ctx.respond('CMD_BLACKLIST_NOSELF', { error: true })

    const isBlacklisted = await ctx.worker.db.userDB.getBlacklist(userID)
    await ctx.worker.db.userDB.setBlacklist(userID, !isBlacklisted)

    if (!isBlacklisted) {
      await ctx.respond('CMD_BLOACKLIST_ADDED', { color: ctx.worker.colors.ORANGE }, userID)
    } else {
      await ctx.respond('CMD_BLOACKLIST_REMOVED', { color: ctx.worker.colors.ORANGE }, userID)
    }
  }
} as CommandOptions
