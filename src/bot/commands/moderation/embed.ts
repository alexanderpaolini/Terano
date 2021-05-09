import { CommandOptions } from 'discord-rose'

export default {
  name: 'Embeds',
  usage: 'embed',
  description: 'Toggle embed responses.',
  category: 'moderation',
  command: 'embeds',
  aliases: [],
  userPerms: ['manageGuild'],
  myPerms: [],
  exec: async (ctx) => {
    // Get and update the shit
    let guildEmbed = await ctx.worker.db.guildDB.getEmbeds(ctx.getID)
    guildEmbed = !guildEmbed
    await ctx.worker.db.guildDB.setEmbeds(ctx.getID, guildEmbed)

    guildEmbed
      ? await ctx.respond('CMD_EMBEDS_ENABLED')
      : await ctx.respond('CMD_EMBEDS_DISABLED')
  }
} as CommandOptions
