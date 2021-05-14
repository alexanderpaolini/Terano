import { CommandOptions } from 'discord-rose'

export default {
  command: 'embeds',
  category: 'moderation',
  userPerms: ['manageGuild'],
  locale: 'EMBEDS',
  exec: async (ctx) => {
    // Get and update the shit
    const guildEmbed = !(await ctx.worker.db.guildDB.getEmbeds(ctx.id))

    await ctx.worker.db.guildDB.setEmbeds(ctx.id, guildEmbed)

    if (guildEmbed && !ctx.myPerms('embed')) {
      await ctx.respond('CMD_EMBEDS_ENABLED_NOPERMS', { color: ctx.worker.colors.YELLOW })
      return false
    }

    guildEmbed
      ? await ctx.respond('CMD_EMBEDS_ENABLED')
      : await ctx.respond('CMD_EMBEDS_DISABLED')
    return true
  }
} as CommandOptions<boolean>
