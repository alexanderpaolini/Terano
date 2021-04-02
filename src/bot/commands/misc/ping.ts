import { CommandOptions } from 'discord-rose'
import { getAvatar } from '../../../utils'

export default {
  name: 'Ping',
  usage: 'ping',
  description: 'Get the bot\'s ping',
  category: 'misc',
  command: 'ping',
  aliases: ['pong'],
  permissions: [],
  botPermissions: [],
  exec: async (ctx) => {
    const time = Date.now()
    const url = getAvatar(ctx.message.author)

    ctx.embed
      .author('Pong!', url)
      .color(ctx.worker.colors.PURPLE)
      .send(true)
      .then(async msg => {
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        ((msg.embeds[0] ?? {}).author ?? {}).name += ` (${(Date.now() - time).toFixed(2)}ms)`
        await ctx.worker.api.messages.edit(msg.channel_id, msg.id, { embed: msg.embeds[0] })
      })
      .catch(() => {})
  }
} as CommandOptions
