import { CommandOptions } from 'discord-rose/dist/typings/lib';

export default {
  name: 'XP Multiplier',
  usage: 'xpmultiplier <multiplier>',
  description: 'Change the multiplier on receiving XP.',
  category: 'leveling',
  command: 'xpmultiplier',
  aliases: ['xprate'],
  permissions: ['manageMessages'],
  botPermissions: [],
  exec: async (ctx) => {
    const newRate = Number(ctx.args[0]);
    if (!isNaN(newRate)) {
      if (newRate > 0) {
        if (newRate < 21) {
          const oldRate = await ctx.worker.db.guildDB.getXPMultplier(ctx.guild.id);
          await ctx.worker.db.guildDB.setXPMultplier(ctx.guild.id, newRate);
          ctx.worker.responses.normal(ctx, ctx.worker.colors.GREEN, `Changed XP-Multplier from ${oldRate} to **${newRate}**.`);
          return;
        } else ctx.worker.responses.normal(ctx, ctx.worker.colors.RED, 'The XP-Multiplier must be no greater than 20');
      } else ctx.worker.responses.normal(ctx, ctx.worker.colors.RED, `The XP-Multiplier must be greater than 0.`);
    } else ctx.worker.responses.normal(ctx, ctx.worker.colors.RED, `No XP-Multiplier was given.`);
    return;
  }
} as CommandOptions;
