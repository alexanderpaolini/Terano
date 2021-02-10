import CommandContext from '../../structures/CommandContext';
import CommandOptions from '../../structures/CommandOptions';

export default {
  name: 'Level-Up Message',
  command: 'levelmessage',
  aliases: ['lm'],
  permissions: ['manageMessages'],
  botPermissions: [],
  exec: async (ctx: CommandContext) => {
    const guildData = await ctx.worker.db.guildDB.getGuild(ctx.guild.id);
    guildData.options.level.send_message = !guildData.options.level.send_message;
    await ctx.worker.db.guildDB.updateGuild(ctx.guild.id, guildData);
    ctx.worker.responses.normal(ctx, ctx.worker.colors.GREEN, `Level-up messages ${guildData.options.level.send_message ? 'Enabled' : 'Disabled'}`)
    return;
  }
} as CommandOptions
