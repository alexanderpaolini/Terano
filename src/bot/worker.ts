import config from '../config.json';
import TeranoWorker from './lib/TeranoWorker';

const worker = new TeranoWorker(config);

worker.commands.setPrefix((msg: any) => {
  const id = msg.guild_id || 'dm'
  return worker.db.guildDB.getPrefix(id);
})
