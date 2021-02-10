import CommandContext from '../../structures/CommandContext';

export default {
  command: 'sweep',
  userPerms: [''],
  botPerms: ['owner'],
  exec: async (ctx: CommandContext) => {
    const userDoc = await ctx.worker.dbModels.userModel.findOne({ id: ctx.message.author.id })
    if (!userDoc || !userDoc.owner) return await ctx.embed
      .title('Owner Only Command')
      .description(`\`\`\`You can't run this command, silly.\`\`\``)
      .color(ctx.worker.colors.RED)
      .send()

    const time = Date.now();

    ctx.worker.db.guildDB.guilds.sweep(() => true);
    ctx.worker.db.guildDB.moderation.sweep(() => true);
    ctx.worker.db.userDB.levels.sweep(() => true);
    ctx.worker.db.userDB.settings.sweep(() => true);
    ctx.worker.db.userDB.users.sweep(() => true);

    ctx.worker.logger.log('Swept Database cache')

    await ctx.embed
      .title('Swept Database Cache')
      .description(`\`\`\`Took: ${Date.now() - time}ms\`\`\``)
      .color(ctx.worker.colors.ORANGE)
      .send()
    return;
  }
};
