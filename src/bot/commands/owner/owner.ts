import { CommandOptions } from 'discord-rose/dist/typings/lib';

export default {
  name: 'Owner',
  usage: 'owner <mention | id>',
  description: 'Add or remove someone from bot owner.',
  category: 'owner',
  command: 'owner',
  aliases: ['owo'],
  permissions: [],
  botPermissions: [],
  owner: true,
  exec: async (ctx) => {
    const userID = (ctx.args[0] || '').replace(/[<@!>]/g, '');

    if (!userID) return ctx.worker.responses.normal(ctx, ctx.worker.colors.RED, 'No user was given, please mention a user.');
    if (userID == ctx.message.author.id) return; ctx.worker.responses.normal(ctx, ctx.worker.colors.RED, `You cannot remove yourself from owner.`);

    const isOwner = await ctx.worker.db.userDB.getOwner(userID);
    await ctx.worker.db.userDB.setOwner(userID, !isOwner)

    ctx.worker.responses.normal(ctx, ctx.worker.colors.ORANGE, `<@${userID}> is ${!isOwner ? 'no longer bot owner' : 'now bot owner'}.`);
    return;
  }
} as CommandOptions;
