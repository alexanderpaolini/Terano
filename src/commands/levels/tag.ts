import CommandContext from '../../structures/CommandContext';
import CommandOptions from '../../structures/CommandOptions';

export default {
  name: 'Tag',
  command: 'tag',
  aliases: [],
  permissions: [],
  botPermissions: [],
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
        ctx.worker.responses.normal(ctx, ctx.worker.colors.GREEN, `Set card tag to: **${tag}**`)
        return;
      } else ctx.worker.responses.normal(ctx, ctx.worker.colors.RED, 'Tag must be no longer than 20 characters.')
    } else ctx.worker.responses.normal(ctx, ctx.worker.colors.RED, 'No tag was given.')
    return;
  }
} as CommandOptions
