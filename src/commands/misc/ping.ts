import { CommandOptions } from '../../structures/CommandHandler'
import { getAvatar } from '../../utils'

export default {
  command: 'ping',
  category: 'misc',
  aliases: ['pong'],
  locale: 'PING',
  exec: async (ctx) => {
    const time = Date.now()
    const url = getAvatar(ctx.message.author)

    await ctx.typing()

    await ctx.embed
      .author(`Pong! (${(Date.now() - time).toFixed(2)}ms)`, url)
      .color(ctx.worker.colors.PURPLE)
      .send(true)
    return true
  }
} as CommandOptions<boolean>
