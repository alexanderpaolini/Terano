import { CommandOptions } from 'discord-rose/dist/typings/lib';

export default {
  name: 'Sweep',
  usage: 'sweep',
  description: 'Sweep the database cache.',
  category: 'owner',
  command: 'sweep',
  aliases: [],
  permissions: [],
  botPermissions: [],
  owner: true,
  exec: async (ctx) => {
    const time = Date.now();

    ctx.worker.db.guildDB.guilds.clear();
    // ctx.worker.db.guildDB.moderation.clear();
    ctx.worker.db.userDB.levels.clear();
    ctx.worker.db.userDB.infos.clear();
    // ctx.worker.db.userDB.settings.clear();

    ctx.worker.log('Swept Database cache');

    setImmediate(() => ctx.worker.responses.tiny(ctx, ctx.worker.colors.ORANGE, `Swept Cache\nTook: ${Date.now() - time}ms`));
    return;
  }
} as CommandOptions;
