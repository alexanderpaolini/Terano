import CommandContext from '../../structures/CommandContext';

export default {
  command: 'prefix',
  userPerms: ['manageMessages'],
  botPerms: [''],
  exec: async (ctx: CommandContext) => {
    const guildData = await ctx.worker.db.guildDB.getGuild(ctx.guild.id);
    const prefix = ctx.args[0];
    if (prefix) {
      if (prefix.length < 21) {
        const oldPrefx = guildData.prefix;
        guildData.prefix = prefix;
        await ctx.worker.db.guildDB.updateGuild(ctx.guild.id, guildData);
        ctx.worker.responses.normal(ctx, ctx.worker.colors.GREEN, `Changed prefix from ${oldPrefx} to \`${guildData.prefix}\``)
        return;
      } else ctx.worker.responses.normal(ctx, ctx.worker.colors.RED, 'Prefix length must be no greater than 20.')
    } else ctx.worker.responses.normal(ctx, ctx.worker.colors.RED, 'No prefix was given.')
    return;
  }
}
