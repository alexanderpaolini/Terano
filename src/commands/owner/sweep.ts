import CommandOptions from '../../structures/CommandOptions';

export default {
  name: 'Sweep',
  command: 'sweep',
  aliases: [],
  permissions: [],
  botPermissions: [],
  owner: true,
  exec: async (ctx) => {
    const time = Date.now();

    ctx.worker.db.guildDB.guilds.sweep(() => true);
    ctx.worker.db.guildDB.moderation.sweep(() => true);
    ctx.worker.db.userDB.levels.sweep(() => true);
    ctx.worker.db.userDB.settings.sweep(() => true);
    ctx.worker.db.userDB.users.sweep(() => true);

    ctx.worker.logger.log('Swept Database cache');

    ctx.worker.responses.tiny(ctx, ctx.worker.colors.ORANGE, `Swept Cache\nTook: ${Date.now() - time}ms`);
    return;
  }
} as CommandOptions;
