import { CommandOptions } from 'discord-rose/dist/typings/lib';

export default {
  name: 'Prefix',
  usage: 'prefix <new prefix>',
  description: 'Change the server-specific prefix.',
  category: 'moderation',
  command: 'prefix',
  aliases: [],
  permissions: ['manageMessages'],
  botPermissions: [],
  exec: async (ctx) => {
    const prefix = ctx.args[0];

    // Bruh my man is stupid
    if (!prefix) return ctx.worker.responses.normal(ctx, ctx.worker.colors.RED, 'No prefix was given.');
    if (prefix.length > 21) return ctx.worker.responses.normal(ctx, ctx.worker.colors.RED, 'Prefix length must be no greater than 20.');
    
    // Get and change the prefix
    const oldPrefx = await ctx.worker.db.guildDB.getPrefix(ctx.guild.id);
    await ctx.worker.db.guildDB.setPrefix(ctx.guild.id, prefix);

    // Return success!
    ctx.worker.responses.normal(ctx, ctx.worker.colors.GREEN, `Changed prefix from ${oldPrefx} to \`${prefix}\``);
    return;
  }
} as CommandOptions;
