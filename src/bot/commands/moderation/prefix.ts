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
    if (!prefix) return ctx.normalResponse(ctx.worker.colors.RED, 'No prefix was given.')
    if (prefix.length > 21) return ctx.normalResponse(ctx.worker.colors.RED, 'Prefix length must be no greater than 20.')

    // Get and change the prefix
    const oldPrefix = await ctx.worker.db.guildDB.getPrefix(ctx.getID)
    await ctx.worker.db.guildDB.setPrefix(ctx.getID, prefix)

    // Return success!
    await ctx.normalResponse(ctx.worker.colors.GREEN, `Changed prefix from ${oldPrefix as string} to \`${prefix as string}\``)
  }
} as CommandOptions
