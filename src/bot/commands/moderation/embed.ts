import { CommandOptions } from 'discord-rose/dist/typings/lib';

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
    let guildEmbed = await ctx.worker.db.guildDB.getEmbed(ctx.guild.id);
    guildEmbed = !guildEmbed;

    await ctx.worker.db.guildDB.setEmbed(ctx.guild.id, guildEmbed);

    ctx.worker.responses.normal(ctx, ctx.worker.colors.GREEN, `${guildEmbed ? 'Enabled' : 'Disabled'} embed messages`);
  }
} as CommandOptions;
