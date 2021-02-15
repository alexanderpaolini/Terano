import { APIMessage } from 'discord-api-types';
import { CommandOptions } from 'discord-rose/dist/typings/lib';

export default {
  name: 'Reason',
  usage: 'reason <num> <reason>',
  description: 'Set the moderation log channel.',
  category: 'moderation',
  command: 'reason',
  aliases: [],
  permissions: ['manageMessages'],
  botPermissions: [],
  exec: async (ctx) => {
    const num = Number(ctx.args[0]);
    if (!isNaN(num)) {
      const reason = ctx.args.slice(1).join(' ').split('\\n').join('\n');
      const modDoc = await ctx.worker.db.guildDB.getModeration(ctx.guild.id, num);

      if (modDoc) {
        await ctx.worker.db.guildDB.setModerationReason(ctx.guild.id, num, reason);

        const logChannelID = await ctx.worker.db.guildDB.getLogChannel(ctx.guild.id);

        let message = await ctx.worker.api.messages.get(logChannelID as any, modDoc.log_message as any).catch(() => null as APIMessage);

        if (message) {
          if (message.embeds[0].fields[1].value === 'User#0000')
            message.embeds[0].fields[1].value = `${ctx.message.author.username}#${ctx.message.author.discriminator} (<@${ctx.message.author.id}>)`;

          message.embeds[0].fields[2] = {
            name: 'Reason',
            value: reason,
            inline: false
          };

          const edited = await ctx.worker.api.messages.edit(logChannelID as any, modDoc.log_message as any, {
            embed: message.embeds[0]
          })
            .then(x => true)
            .catch(x => false);

          if (edited) ctx.worker.responses.tiny(ctx, ctx.worker.colors.GREEN, `Case reason updated to "${reason.replace(/```/g, '').split('\\n').join('\n')}"`);
          else ctx.worker.responses.tiny(ctx, ctx.worker.colors.RED, 'Error occured while editing message.');
        } else ctx.worker.responses.tiny(ctx, ctx.worker.colors.RED, 'Error occured while fetching message.');
      } else ctx.worker.responses.tiny(ctx, ctx.worker.colors.RED, `Case ${num} not found.`);
    } else ctx.worker.responses.tiny(ctx, ctx.worker.colors.RED, 'Case number is required.');
    return;
  }
} as CommandOptions;
