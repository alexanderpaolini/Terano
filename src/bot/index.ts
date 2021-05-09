import config from '../config.json'
import TeranoWorker from './structures/TeranoWorker'

const worker = new TeranoWorker(config)

worker.commands.prefix(async (msg: any) => {
  const id = msg.guild_id ?? 'dm'
  return await worker.db.guildDB.getPrefix(id)
})
