import { CommandOptions } from 'discord-rose/dist/typings/lib';

import ms from 'ms';

export default {
  name: 'Un-Mute',
  usage: 'unmute <mention | user ID>',
  description: 'Un-Mute a member.',
  category: 'moderation',
  command: 'unmute',
  aliases: ['um'],
  permissions: ['roles'],
  botPermissions: ['roles'],
  exec: async (ctx) => {
    const userID = (ctx.args[0] || '').replace(/[<@!>]/g, '');
    if (userID) {
      const mutes = await ctx.worker.db.guildDB.getMuteDocs(ctx.guild.id, userID);
      const mute = mutes[0];
      if (mute) {
        ctx.worker.moderation.unmute(userID as any, ctx.guild.id, mute.timestamp)();
        ctx.worker.responses.tiny(ctx, ctx.worker.colors.GREEN, `Unmuted ${userID}`);
      } else ctx.worker.responses.tiny(ctx, ctx.worker.colors.RED, 'Mute not found.');
    } else ctx.worker.responses.tiny(ctx, ctx.worker.colors.RED, 'No user given.');
    return;
  }
} as CommandOptions;
