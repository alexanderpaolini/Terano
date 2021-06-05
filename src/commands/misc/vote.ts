import { CommandOptions } from '../../structures/CommandHandler'

export default {
  command: 'vote',
  category: 'misc',
  locale: 'VOTE',
  exec: async (ctx) => {
    await ctx.reply(`https://top.gg/bot/${ctx.worker.user.id}/vote`)
    return true
  }
} as CommandOptions<boolean>
