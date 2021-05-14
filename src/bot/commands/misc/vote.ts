import { CommandOptions } from 'discord-rose'

export default {
  command: 'vote',
  category: 'misc',
  locale: 'VOTE',
  exec: async (ctx) => {
    await ctx.reply('https://top.gg/bot/647256366280474626/vote')
    return true
  }
} as CommandOptions<boolean>
