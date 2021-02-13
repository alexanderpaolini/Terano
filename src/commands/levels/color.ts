// import CommandContext from '../../structures/CommandContext';
import CommandOptions from '../../structures/CommandOptions';

import colors from '../../utils/colors';

export default {
  name: 'Color',
  command: 'color',
  aliases: ['colour'],
  permissions: [],
  botPermissions: [],
  exec: async (ctx) => {
    let colorName = ctx.args.join('').toLowerCase();
    if (colorName) {
      const color = colors(colorName);
      if (color) {
        let userSettingsDoc = await ctx.worker.db.userDB.getSettings(ctx.message.author.id);
        if (!userSettingsDoc) userSettingsDoc = await ctx.worker.db.userDB.setSettings(ctx.message.author.id, {
          id: ctx.message.author.id,
          level: { color: '', picture: '', tag: '' }
        });
        userSettingsDoc.level.color = color.hexString;
        await ctx.worker.db.userDB.updateSettings(ctx.message.author.id, userSettingsDoc);
        ctx.worker.responses.normal(ctx, Number('0x' + color.hexString.slice(1)), `Set card color to **${color.hexString}**`);
        return;
      } else ctx.worker.responses.normal(ctx, ctx.worker.colors.RED, `I don't know the color \`${ctx.args.join(' ')}\`.`);
    } else ctx.worker.responses.normal(ctx, ctx.worker.colors.RED, `No color was given.`);
    return;
  }
} as CommandOptions;
