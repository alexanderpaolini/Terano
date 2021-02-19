import { CommandOptions } from 'discord-rose/dist/typings/lib';

export default {
  name: 'Level-Up Message',
  usage: 'setlevelmessage <string>',
  description: 'Configure the Level-Up messages',
  category: 'leveling',
  command: 'setlevelmessage',
  aliases: ['slm'],
  permissions: ['manageMessages'],
  botPermissions: [],
  exec: async (ctx) => {
    // Get the new message
    const message = ctx.args.join(' ');

    // Make sure they aren't dumb
    if (message.length >= 100) return ctx.worker.responses.normal(ctx, ctx.worker.colors.GREEN, `Level-Up message must be shorter than 100 characters.`);

    // Update the settings
    await ctx.worker.db.guildDB.setLevelMessage(ctx.guild.id, message);

    // Respond with success
    ctx.worker.responses.normal(ctx, ctx.worker.colors.GREEN, `Level-up message set to "${message}"`);
    return;
  }
} as CommandOptions;
