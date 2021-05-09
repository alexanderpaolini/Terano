import { CommandOptions } from 'discord-rose'

export default {
  name: 'Blacklist',
  usage: 'blacklist <mention | ID>',
  description: 'Blacklist a user from using the bot.',
  category: 'owner',
  command: 'blacklist',
  aliases: ['bl'],
  permissions: [],
  botPermissions: [],
  owner: true,
  exec: async (ctx) => {
    const userID = (ctx.args[0] || '').replace(/[<@!>]/g, '')

    if (!userID) return await ctx.error('No user was given, please mention a user.')
    if (userID === ctx.message.author.id) return await ctx.error('You cannot blacklist yourself.')

    const isBlacklisted = await ctx.worker.db.userDB.getBlacklist(userID)
    await ctx.worker.db.userDB.setBlacklist(userID, !isBlacklisted)

    if (!isBlacklisted) {
      await ctx.normalResponse(ctx.worker.colors.ORANGE, `<@${userID}> added to blacklisted.`)
    } else {
      await ctx.normalResponse(ctx.worker.colors.ORANGE, `<@${userID}> removed from blacklist.`)
    }
  }
} as CommandOptions
