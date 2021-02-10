import CommandContext from '../../structures/CommandContext';
import CommandOptions from '../../structures/CommandOptions';

export default {
  name: 'XP Multiplier',
  command: 'xpmultiplier',
  aliases: ['xprate'],
  permissions: ['manageMessages'],
  botPermissions: [],
  exec: async (ctx: CommandContext) => {
    const newRate = Number(ctx.args[0]);
    if (newRate !== NaN) {
      if (newRate > 0) {
        if (newRate < 21) {
          const guildData = await ctx.worker.db.guildDB.getGuild(ctx.guild.id);
          const oldRate = guildData.options.level.xp_rate;
          guildData.options.level.xp_rate = newRate;
          await ctx.worker.db.guildDB.updateGuild(ctx.guild.id, guildData);
          ctx.worker.responses.normal(ctx, ctx.worker.colors.GREEN, `Changed XP-Multplier from ${oldRate} to **${newRate}**.`)
          return;
        } else ctx.worker.responses.normal(ctx, ctx.worker.colors.RED, 'The XP-Multiplier must be no greater than 20')
      } else ctx.worker.responses.normal(ctx, ctx.worker.colors.RED, `The XP-Multiplier must be greater than 0.`)
    } else ctx.worker.responses.normal(ctx, ctx.worker.colors.RED, `No XP-Multiplier was given.`)
    return;
  }
} as CommandOptions
