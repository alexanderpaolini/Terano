import config from '../config.json'
import { getAvatar } from '../utils'
import TeranoWorker from './lib/TeranoWorker'

const worker = new TeranoWorker(config)

worker.commands.prefix(async (msg: any) => {
  const id = msg.guild_id ?? 'dm'
  return await worker.db.guildDB.getPrefix(id)
})

// eslint-disable-next-line @typescript-eslint/no-misused-promises
worker.commands.error(async (ctx, err) => {
  const embed = ctx.embed

  if (err.nonFatal) {
    embed
      .author(ctx.message.member?.nick ?? `${ctx.message.author.username} | ${String(ctx.command.command)}`)
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
})
