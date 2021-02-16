import config from '../config.json';
import TeranoWorker from './lib/Worker';

const worker = new TeranoWorker(config);

worker.commands.setPrefix(async (msg) => {
  return (await worker.db.guildDB.getPrefix(msg.guild_id)) || 't!';
});
