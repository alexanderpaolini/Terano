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
    const user = ctx.message.mentions[0];
    if (user) {
      if (user.id !== ctx.message.author.id) {
        const isUserOwner = await ctx.worker.db.userDB.getOwner(ctx.message.mentions[0].id);
        await ctx.worker.db.userDB.setOwner(user.id, !isUserOwner);
        if (isUserOwner)
          ctx.worker.responses.normal(ctx, ctx.worker.colors.ORANGE, `${user.username}#${user.discriminator} is no longer bot owner.`);
        else
          ctx.worker.responses.normal(ctx, ctx.worker.colors.ORANGE, `${user.username}#${user.discriminator} is now bot owner!`);
      } else ctx.worker.responses.normal(ctx, ctx.worker.colors.RED, `You cannot remove yourself from owner.`);
    } else ctx.worker.responses.normal(ctx, ctx.worker.colors.RED, 'No user was given, please mention a user.');
    return;
  }
} as CommandOptions;
