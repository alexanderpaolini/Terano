import CommandContext from '../../structures/CommandContext';
import CommandOptions from '../../structures/CommandOptions';

import colors from '../../utils/colors'

export default {
  name: 'Color',
  command: 'color',
  aliases: ['colour'],
  permissions: [],
  botPermissions: [],
  exec: async (ctx: CommandContext) => {
    let color = ctx.args.join('').toLowerCase();
    if (color) {
      if (colors[color]) {
        let userSettingsDoc = await ctx.worker.db.userDB.getSettings(ctx.message.author.id);
        if (!userSettingsDoc) userSettingsDoc = await ctx.worker.db.userDB.setSettings(ctx.message.author.id, {
          id: ctx.message.author.id,
          level: { color: '', picture: '', tag: '' }
        })
        userSettingsDoc.level.color = colors[color];
        await ctx.worker.db.userDB.updateSettings(ctx.message.author.id, userSettingsDoc);
        ctx.worker.responses.normal(ctx, Number('0x' + colors[color].slice(1)), `Set card color to **${colors[color].toLowerCase()}**`)
        return;
      } else ctx.worker.responses.normal(ctx, ctx.worker.colors.RED, `I don't know the color \`${ctx.args.join(' ')}\`.`)
    } else ctx.worker.responses.normal(ctx, ctx.worker.colors.RED, `No color was given.`)
    return;
  }
} as CommandOptions
