import { CommandOptions } from '../../structures/CommandHandler'

export default {
  command: 'stinky',
  category: 'misc',
  locale: 'STINKY',
  cooldown: {
    time: 5e3
  },
  exec: async (ctx) => {
    await ctx.reply(`<@${ctx.worker.config.stinky}>`)
    return true
  }
} as CommandOptions<boolean>
