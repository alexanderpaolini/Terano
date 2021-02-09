import CommandContext from '../../structures/CommandContext';

export default {
  command: 'levelmessage',
  aliases: ['lm'],
  userPerms: ['manageMessages'],
  botPerms: [''],
  exec: async (ctx: CommandContext) => {
    const guildData = await ctx.worker.db.guildDB.getGuild(ctx.guild.id);
    guildData.options.level.send_message = !guildData.options.level.send_message;
    await ctx.worker.db.guildDB.updateGuild(ctx.guild.id, guildData);
    ctx.embed
      .author(ctx.message.author.username + ' | Level UP Message', `https://cdn.discordapp.com/avatars/${ctx.message.author.id}/${ctx.message.author.avatar}.png?size=128`)
      .description(`Level-up messages ${guildData.options.level.send_message ? 'Enabled' : 'Disabled'}`)
      .footer('Developed by MILLION#1321')
      .color(ctx.worker.colors.GREEN)
      .timestamp()
      .send();
    return;
  }
}
