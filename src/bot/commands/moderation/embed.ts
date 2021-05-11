import { CommandOptions } from 'discord-rose'

export default {
  command: 'embeds',
  category: 'moderation',
  userPerms: ['manageGuild'],
  locale: 'EMBEDS',
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
