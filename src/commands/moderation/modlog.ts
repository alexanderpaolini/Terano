import { CommandOptions } from 'discord-rose/dist/typings/lib';

export default {
  name: 'Mod Log',
  usage: 'moglog <mention | channel ID>',
  description: 'Set the moderation log channel.',
  category: 'moderation',
  command: 'modlog',
  aliases: [],
  permissions: ['manageGuild'],
  botPermissions: [],
  exec: async (ctx) => {
    const channelID = (ctx.args[0] || '').replace(/[<#>]/g, '');
    const channel = ctx.worker.channels.get(channelID as any);

    if (channel) {
      if (channel.guild_id == ctx.guild.id) {
        await ctx.worker.db.guildDB.setLogChannel(ctx.guild.id, channel.id);

        ctx.worker.responses.normal(ctx, ctx.worker.colors.GREEN, `Moderation Log channel set to <#${channel.id}>`);
      } else ctx.worker.responses.tiny(ctx, ctx.worker.colors.RED, 'Channel is not in this guild.');
    } else ctx.worker.responses.tiny(ctx, ctx.worker.colors.RED, 'Channel was not given or I have no permissions to see it.');
    return;
  }
} as CommandOptions;
