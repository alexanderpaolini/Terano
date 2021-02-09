import CommandContext from '../../structures/CommandContext';

export default {
  command: 'xpcooldown',
  aliases: ['cooldown'],
  userPerms: ['manageMessages'],
  botPerms: [''],
  exec: async (ctx: CommandContext) => {
    const newCooldown = Number(ctx.args[0]);
    if (newCooldown !== NaN) {
      if (newCooldown > 0) {
        if (newCooldown < 20) {
          const guildData = await ctx.worker.db.guildDB.getGuild(ctx.guild.id);
          const oldCooldown = guildData.options.level.cooldown;
          guildData.options.level.cooldown = newCooldown;
          await ctx.worker.db.guildDB.updateGuild(ctx.guild.id, guildData);
          ctx.embed
            .author(ctx.message.author.username + ' | XP Cooldown', `https://cdn.discordapp.com/avatars/${ctx.message.author.id}/${ctx.message.author.avatar}.png?size=128`)
            .description(`Changed XP-cooldown from ${oldCooldown} to **${newCooldown}**.`)
            .footer('Developed by MILLION#1321')
            .color(ctx.worker.colors.GREEN)
            .timestamp()
            .send();
          return;
        } else {
          ctx.embed
            .author(ctx.message.author.username + ' | XP Cooldown', `https://cdn.discordapp.com/avatars/${ctx.message.author.id}/${ctx.message.author.avatar}.png?size=128`)
            .description(`The XP-cooldown must be less than 20.`)
            .footer('Developed by MILLION#1321')
            .color(ctx.worker.colors.RED)
            .timestamp()
            .send();
          return;
        }
      } else {
        ctx.embed
          .author(ctx.message.author.username + ' | XP Cooldown', `https://cdn.discordapp.com/avatars/${ctx.message.author.id}/${ctx.message.author.avatar}.png?size=128`)
          .description(`The XP-cooldown must be greater than 0.`)
          .footer('Developed by MILLION#1321')
          .color(ctx.worker.colors.RED)
          .timestamp()
          .send();
        return;
      }
    } else {
      ctx.embed
        .author(ctx.message.author.username + ' | XP Cooldown', `https://cdn.discordapp.com/avatars/${ctx.message.author.id}/${ctx.message.author.avatar}.png?size=128`)
        .description(`No XP-multiplier was included.`)
        .footer('Developed by MILLION#1321')
        .color(ctx.worker.colors.RED)
        .timestamp()
        .send();
      return;
    }
  }
}
