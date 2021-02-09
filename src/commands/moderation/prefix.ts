import CommandContext from '../../structures/CommandContext';

export default {
  command: 'prefix',
  userPerms: ['manageMessages'],
  botPerms: [''],
  exec: async (ctx: CommandContext) => {
    const guildData = await ctx.worker.db.guildDB.getGuild(ctx.guild.id);
    const prefix = ctx.args[0];
    if (prefix) {
      if (prefix.length < 10) {
        const oldPrefx = guildData.prefix;
        guildData.prefix = prefix;
        await ctx.worker.db.guildDB.updateGuild(ctx.guild.id, guildData);
        ctx.embed
          .author(ctx.message.author.username + ' | Prefix', `https://cdn.discordapp.com/avatars/${ctx.message.author.id}/${ctx.message.author.avatar}.png?size=128`)
          .description(`Changed prefix from ${oldPrefx} to \`${guildData.prefix}\``)
          .footer('Developed by MILLION#1321')
          .color(ctx.worker.colors.GREEN)
          .timestamp()
          .send();
        return;
      } else {
        ctx.embed
          .author(ctx.message.author.username + ' | Prefix', `https://cdn.discordapp.com/avatars/${ctx.message.author.id}/${ctx.message.author.avatar}.png?size=128`)
          .description(`Prefix must be less than 10 characters.`)
          .footer('Developed by MILLION#1321')
          .color(ctx.worker.colors.RED)
          .timestamp()
          .send();
        return;
      }
    } else {
      ctx.embed
        .author(ctx.message.author.username + ' | Prefix', `https://cdn.discordapp.com/avatars/${ctx.message.author.id}/${ctx.message.author.avatar}.png?size=128`)
        .description(`You must include a new prefix.`)
        .footer('Developed by MILLION#1321')
        .color(ctx.worker.colors.RED)
        .timestamp()
        .send();
      return;
    }
  }
}
