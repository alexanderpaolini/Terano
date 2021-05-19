import { CommandOptions } from '../../structures/CommandHandler'

export default {
  command: 'support',
  category: 'misc',
  locale: 'SUPPORT',
  exec: async (ctx) => {
    await ctx.reply('https://discord.gg/YzWsDrs2kw')
    return true
  }
} as CommandOptions<boolean>
