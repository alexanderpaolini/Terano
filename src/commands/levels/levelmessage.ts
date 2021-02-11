import CommandOptions from '../../structures/CommandOptions';

export default {
  name: 'Level-Up Message',
  command: 'levelmessage',
  aliases: ['lm'],
  permissions: ['manageMessages'],
  botPermissions: [],
  exec: async (ctx) => {
    const sendMesasge = !(await ctx.worker.db.guildDB.getGuild(ctx.guild.id));
    await ctx.worker.db.guildDB.updateSendLevelMessage(ctx.guild.id, sendMesasge);
    ctx.worker.responses.normal(ctx, ctx.worker.colors.GREEN, `Level-up messages ${sendMesasge ? 'Enabled' : 'Disabled'}`)
    return;
  }
} as CommandOptions
