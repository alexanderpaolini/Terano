import { CommandOptions } from 'discord-rose/dist/typings/lib';

export default {
  name: 'Tag',
  usage: 'tag <new tag>',
  description: 'Set your tag for the rank card.',
  category: 'leveling',
  command: 'tag',
  aliases: [],
  permissions: [],
  botPermissions: [],
  exec: async (ctx) => {
    // Get the tag
    let tag = ctx.args.join(' ');

    // Do the checks
    if (!tag.length) return ctx.worker.responses.normal(ctx, ctx.worker.colors.RED, 'No tag was given.');

    // Make sure people aren't stuid
    if (tag.length > 30) return ctx.worker.responses.normal(ctx, ctx.worker.colors.RED, 'Tag must be no longer than 20 characters.');

    // Get the user settings
    await ctx.worker.db.userDB.setTag(ctx.message.author.id, tag);

    // Return success
    ctx.worker.responses.normal(ctx, ctx.worker.colors.GREEN, `Set card tag to: **${tag}**`);
    return;
  }
} as CommandOptions;
