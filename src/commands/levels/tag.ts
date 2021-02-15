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
    if (tag.length) {
      if (tag.length < 21) {
        // Get the user settings
        let userSettingsDoc = await ctx.worker.db.userDB.getSettings(ctx.message.author.id);
        if (!userSettingsDoc) userSettingsDoc = await ctx.worker.db.userDB.setSettings(ctx.message.author.id, {
          id: ctx.message.author.id,
          level: { color: '', picture: '', tag: '' }
        });

        // Update the settings
        userSettingsDoc.level.tag = tag;
        await ctx.worker.db.userDB.updateSettings(userSettingsDoc);

        // Return success
        ctx.worker.responses.normal(ctx, ctx.worker.colors.GREEN, `Set card tag to: **${tag}**`);
      } else ctx.worker.responses.normal(ctx, ctx.worker.colors.RED, 'Tag must be no longer than 20 characters.');
    } else ctx.worker.responses.normal(ctx, ctx.worker.colors.RED, 'No tag was given.');
    return;
  }
} as CommandOptions;
