import config from '../config.json'
import { getAvatar } from '../utils'
import TeranoWorker from './lib/TeranoWorker'

const worker = new TeranoWorker(config)

worker.commands.prefix(async (msg: any) => {
  const id = msg.guild_id ?? 'dm'
  return await worker.db.guildDB.getPrefix(id)
})

worker.commands.error(async (ctx, err) => {
  const embed = ctx.embed

  if (err.nonFatal) {
    embed
      .author(ctx.message.member?.nick ?? ctx.message.author.username + ' | ' + ctx.command.name, getAvatar(ctx.message.author))
      .title(err.message)
  } else {
    embed
      .author('Error: ' + err.message, getAvatar(ctx.message.author))
  }

  embed
    .color(ctx.worker.colors.RED)
    .send(true)
    .then(() => { })
    .catch(() => { })

  if (err.nonFatal) return

  ctx.worker.webhooks.error(err.message)?.catch(() => { })
})
