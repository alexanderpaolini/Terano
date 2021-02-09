import CommandContext from '../../structures/CommandContext';

export default {
  command: 'xpmultiplier',
  aliases: ['xprate'],
  userPerms: ['manageMessages'],
  botPerms: [''],
  exec: async (ctx: CommandContext) => {
    const newRate = Number(ctx.args[0]);
    if (newRate !== NaN) {
      if (newRate > 0) {
        if (newRate < 20) {
          const guildData = await ctx.worker.db.guildDB.getGuild(ctx.guild.id);
          const oldRate = guildData.options.level.xp_rate;
          guildData.options.level.xp_rate = newRate;
          await ctx.worker.db.guildDB.updateGuild(ctx.guild.id, guildData);
          ctx.embed
            .author(ctx.message.author.username + ' | XP Rate', `https://cdn.discordapp.com/avatars/${ctx.message.author.id}/${ctx.message.author.avatar}.png?size=128`)
            .description(`Changed XP-multplier from ${oldRate} to **${newRate}**.`)
            .footer('Developed by MILLION#1321')
            .color(ctx.worker.colors.GREEN)
            .timestamp()
            .send();
          return;
        } else {
          ctx.embed
            .author(ctx.message.author.username + ' | XP Rate', `https://cdn.discordapp.com/avatars/${ctx.message.author.id}/${ctx.message.author.avatar}.png?size=128`)
            .description(`The XP-multiplier must be less than 20.`)
            .footer('Developed by MILLION#1321')
            .color(ctx.worker.colors.RED)
            .timestamp()
            .send();
          return;
        }
      } else {
        ctx.embed
          .author(ctx.message.author.username + ' | XP Rate', `https://cdn.discordapp.com/avatars/${ctx.message.author.id}/${ctx.message.author.avatar}.png?size=128`)
          .description(`The XP-multiplier must be greater than 0.`)
          .footer('Developed by MILLION#1321')
          .color(ctx.worker.colors.RED)
          .timestamp()
          .send();
        return;
      }
    } else {
      ctx.embed
        .author(ctx.message.author.username + ' | XP Rate', `https://cdn.discordapp.com/avatars/${ctx.message.author.id}/${ctx.message.author.avatar}.png?size=128`)
        .description(`No XP-multiplier was included.`)
        .footer('Developed by MILLION#1321')
        .color(ctx.worker.colors.RED)
        .timestamp()
        .send();
      return;
    }
  }
}
