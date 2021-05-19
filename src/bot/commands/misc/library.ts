import { CommandOptions } from '../../structures/CommandHandler'

export default {
  command: 'library',
  category: 'misc',
  aliases: ['lib'],
  locale: 'LIBRARY',
  exec: async (ctx) => {
    await ctx.reply('https://npm.im/discord-rose')
    return true
  }
} as CommandOptions<boolean>
