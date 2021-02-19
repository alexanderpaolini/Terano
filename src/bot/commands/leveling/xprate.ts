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
    // Get the new rate
    const newRate = Number(ctx.args[0]);

    // Do the checks
    if (isNaN(newRate)) return ctx.worker.responses.normal(ctx, ctx.worker.colors.RED, `No XP-Multiplier was given.`);

    // Make sure people aren't stupid
    if (newRate <= 0) return ctx.worker.responses.normal(ctx, ctx.worker.colors.RED, `The XP-Multiplier must be greater than 0.`);
    if (newRate > 20) return ctx.worker.responses.normal(ctx, ctx.worker.colors.RED, 'The XP-Multiplier must be no greater than 20');

    // Get and update the rate
    const oldRate = await ctx.worker.db.guildDB.getXPMultiplier(ctx.guild.id);
    await ctx.worker.db.guildDB.setXPMultiplier(ctx.guild.id, newRate);

    // Return success
    ctx.worker.responses.normal(ctx, ctx.worker.colors.GREEN, `Changed XP-Multplier from ${oldRate} to **${newRate}**.`);
    return;
  }
} as CommandOptions;
