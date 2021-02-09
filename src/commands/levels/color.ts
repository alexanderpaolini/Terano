import CommandContext from '../../structures/CommandContext';
import colors from '../../utils/colors'

export default {
  command: 'color',
  aliases: ['colour'],
  userPerms: [''],
  botPerms: [''],
  exec: async (ctx: CommandContext) => {
    let color = ctx.args.join('').toLowerCase();
    const avatarURL = `https://cdn.discordapp.com/avatars/${ctx.message.author.id}/${ctx.message.author.avatar}.png?size=128`
    if (color) {
      if (colors[color]) {
        let userSettingsDoc = await ctx.worker.db.userDB.getSettings(ctx.message.author.id);
        if (!userSettingsDoc) userSettingsDoc = await ctx.worker.db.userDB.setSettings(ctx.message.author.id, {
          id: ctx.message.author.id,
          level: { color: '', picture: '', tag: '' }
        })
        userSettingsDoc.level.color = colors[color];
        await ctx.worker.db.userDB.updateSettings(ctx.message.author.id, userSettingsDoc);
        ctx.embed
          .author(ctx.message.author.username + ' | Color', avatarURL)
          .description(`Set card color to **${colors[color].toLowerCase()}**`)
          .footer('Developed by MILLION#1321')
          .color(Number('0x' + colors[color].slice(1)))
          .timestamp()
          .send();
        return;
      } else {
        ctx.embed
          .author(ctx.message.author.username + ' | Color', avatarURL)
          .description(`I don't know the color \`${ctx.args.join(' ')}\`.`)
          .footer('Developed by MILLION#1321')
          .color(ctx.worker.colors.RED)
          .timestamp()
          .send()
      }
    } else {
      ctx.embed
        .author(ctx.message.author.username + ' | Color', avatarURL)
        .description(`No color was included.`)
        .footer('Developed by MILLION#1321')
        .color(ctx.worker.colors.RED)
        .timestamp()
        .send()
    }
  }
}
