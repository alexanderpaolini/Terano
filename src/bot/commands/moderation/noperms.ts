import { CommandOptions } from 'discord-rose/dist/typings/lib';

export default {
  name: 'No Permissions',
  usage: 'noperms',
  description: 'Toggle the No Permissions message',
  category: 'moderation',
  command: 'noperms',
  aliases: [],
  permissions: ['manageMessages'],
  botPermissions: [],
  exec: async (ctx) => {
    // Get and reverse the current setting
    const sendMesasge = !(await ctx.worker.db.guildDB.getNoPermsMessage(ctx.guild.id));
    await ctx.worker.db.guildDB.setNoPermsMessage(ctx.guild.id, sendMesasge);

    // Respond with success
    ctx.worker.responses.normal(ctx, ctx.worker.colors.GREEN, `No Permissions message ${sendMesasge ? 'Enabled' : 'Disabled'}`);
    return;
  }
} as CommandOptions;
