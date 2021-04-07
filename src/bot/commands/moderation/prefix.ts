import { CommandOptions } from 'discord-rose'

export default {
  name: 'Prefix',
  usage: 'prefix <new prefix>',
  description: 'Change the server-specific prefix.',
  category: 'moderation',
  command: 'prefix',
  aliases: [],
  permissions: ['manageMessages'],
  botPermissions: [],
  exec: async (ctx) => {
    const prefix = ctx.args[0]

    // Bruh my man is stupid
    if (!prefix) return ctx.error(await ctx.lang('CMD_PREFIX_CURRENT', ctx.prefix))
    if (prefix.length > 21) return ctx.error(await ctx.lang('CMD_PREFIX_LONG'))

    // Get and change the prefix
    const oldPrefix = await ctx.worker.db.guildDB.getPrefix(ctx.getID)
    await ctx.worker.db.guildDB.setPrefix(ctx.getID, prefix)

    // Return success!
    await ctx.normalResponse(ctx.worker.colors.GREEN, await ctx.lang('CMD_PREFIX_UPDATED', oldPrefix, prefix))
  }
} as CommandOptions
