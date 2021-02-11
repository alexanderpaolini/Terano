import CommandOptions from '../../structures/CommandOptions';

export default {
  name: 'XP-Cooldown',
  command: 'xpcooldown',
  aliases: ['cooldown'],
  permissions: ['manageMessages'],
  botPermissions: [],
  exec: async (ctx) => {
    const newCooldown = Number(ctx.args[0]);
    if (newCooldown !== NaN) {
      if (newCooldown > 0) {
        if (newCooldown < 3600) {
          const oldCooldown = await ctx.worker.db.guildDB.getMsgCooldown(ctx.guild.id);
          await ctx.worker.db.guildDB.updateMsgCooldown(ctx.guild.id, newCooldown);
          ctx.worker.responses.normal(ctx, ctx.worker.colors.GREEN, `Changed XP-cooldown from ${oldCooldown} to **${newCooldown}**.`)
          return;
        } else ctx.worker.responses.normal(ctx, ctx.worker.colors.GREEN, `The XP-cooldown must be less than 1 hour.`)
      } else ctx.worker.responses.normal(ctx, ctx.worker.colors.GREEN, `The XP-cooldown must be greater than 0.`)
    } else ctx.worker.responses.normal(ctx, ctx.worker.colors.GREEN, `No XP-cooldown was given.`)
    return;
  }
} as CommandOptions
