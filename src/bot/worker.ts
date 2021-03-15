import config from '../config.json';
import TeranoWorker from './lib/TeranoWorker';

const worker = new TeranoWorker(config);

worker.commands.prefix(async (msg: any) => {
  const id = msg.guild_id || 'dm';
  return worker.db.guildDB.getPrefix(id);
});

worker.commands.error((ctx, err) => {
  ctx.embed
    .author(`Error: ${err.message}`, 'https://cdn.discordapp.com/attachments/813578636162367559/813578882774204441/error-handling.png')
    .color(ctx.worker.colors.RED)
    .send(true)
    .catch(() => { });

  if (err.nonFatal) return;

  ctx.worker.webhooks.error(err.message);
});
