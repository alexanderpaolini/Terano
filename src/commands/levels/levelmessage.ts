import { CommandOptions } from 'discord-rose/dist/typings/lib';

export default {
  name: 'Level-Up Message',
  usage: 'levelmessage',
  description: 'Toggle the Level-Up messages',
  category: 'leveling',
  command: 'levelmessage',
  aliases: ['lm'],
  permissions: ['manageMessages'],
  botPermissions: [],
  exec: async (ctx) => {
    const sendMesasge = !(await ctx.worker.db.guildDB.getGuild(ctx.guild.id));
    await ctx.worker.db.guildDB.updateSendLevelMessage(ctx.guild.id, sendMesasge);
    ctx.worker.responses.normal(ctx, ctx.worker.colors.GREEN, `Level-up messages ${sendMesasge ? 'Enabled' : 'Disabled'}`);
    return;
  }
} as CommandOptions;
