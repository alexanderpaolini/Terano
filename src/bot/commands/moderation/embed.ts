import { CommandOptions } from 'discord-rose/dist/typings/lib'

export default {
  name: 'Embeds',
  usage: 'embed',
  description: 'Toggle embed responses.',
  category: 'moderation',
  command: 'embeds',
  aliases: [],
  permissions: ['manageGuild'],
  botPermissions: [],
  exec: async (ctx) => {
    // Get and update the shit
    let guildEmbed = await ctx.worker.db.guildDB.getEmbeds(ctx.guild.id)
    guildEmbed = !guildEmbed
    await ctx.worker.db.guildDB.setEmbeds(ctx.guild.id, guildEmbed)

    // Return success?
    await ctx.worker.responses.normal(ctx, ctx.worker.colors.GREEN, `${guildEmbed ? 'Enabled' : 'Disabled'} embed messages`)
  }
} as CommandOptions
