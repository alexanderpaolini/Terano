import CommandContext from '../../structures/CommandContext';

export default {
  command: 'tag',
  aliases: [''],
  userPerms: [''],
  botPerms: [''],
  exec: async (ctx: CommandContext) => {
    let tag = ctx.args.join(' ');
    const avatarURL = `https://cdn.discordapp.com/avatars/${ctx.message.author.id}/${ctx.message.author.avatar}.png?size=128`
    if (tag.length) {
      if (tag.length < 21) {
        let userSettingsDoc = await ctx.worker.db.userDB.getSettings(ctx.message.author.id);
        if (!userSettingsDoc) userSettingsDoc = await ctx.worker.db.userDB.setSettings(ctx.message.author.id, {
          id: ctx.message.author.id,
          level: { color: '', picture: '', tag: '' }
        })
        userSettingsDoc.level.tag = tag;
        await ctx.worker.db.userDB.updateSettings(ctx.message.author.id, userSettingsDoc);
        ctx.embed
          .author(ctx.message.author.username + ' | Tag', avatarURL)
          .description(`Set card tag to: **${tag}**`)
          .footer('Developed by MILLION#1321')
          .color(ctx.worker.colors.GREEN)
          .timestamp()
          .send();
        return;
      } else {
        ctx.embed
          .author(ctx.message.author.username + ' | Tag', avatarURL)
          .description(`Tag is too long, it must be at most 20 characters.`)
          .footer('Developed by MILLION#1321')
          .color(ctx.worker.colors.RED)
          .timestamp()
          .send();
        return;
      }
    } else {
      ctx.embed
        .author(ctx.message.author.username + ' | Tag', avatarURL)
        .description(`No tag was included.`)
        .footer('Developed by MILLION#1321')
        .color(ctx.worker.colors.RED)
        .timestamp()
        .send();
      return;
    }
  }
}
