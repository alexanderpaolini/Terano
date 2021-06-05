import { CommandOptions } from '../../structures/CommandHandler'

export default {
  command: 'support',
  category: 'misc',
  locale: 'SUPPORT',
  exec: async (ctx) => {
    await ctx.reply(`https://discord.gg/${ctx.worker.config.discord.invite}`)
    return true
  }
} as CommandOptions<boolean>
