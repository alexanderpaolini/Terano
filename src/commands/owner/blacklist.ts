import CommandOptions from '../../structures/CommandOptions';

export default {
  name: 'Blacklist',
  command: 'blacklist',
  aliases: ['bl'],
  permissions: [],
  botPermissions: [],
  owner: true,
  exec: async (ctx) => {
    const userID = (ctx.args[0] || '').replace(/[<@!>]/g, '');
    if (userID) {
      if (userID !== ctx.message.author.id) {
        const isBlacklisted = await ctx.worker.db.userDB.getBlacklist(userID);
        await ctx.worker.db.userDB.setBlacklist(userID, !isBlacklisted);
        if (!isBlacklisted)
          ctx.worker.responses.normal(ctx, ctx.worker.colors.ORANGE, `<@${userID}> added to blacklisted.`);
        else
          ctx.worker.responses.normal(ctx, ctx.worker.colors.ORANGE, `<@${userID}> removed from blacklist.`);
      } else ctx.worker.responses.normal(ctx, ctx.worker.colors.RED, `You cannot blacklist yourself.`);
    } else ctx.worker.responses.normal(ctx, ctx.worker.colors.RED, 'No user was given, please mention a user.');
    return;
  }
} as CommandOptions;
