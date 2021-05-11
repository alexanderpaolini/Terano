import { CommandOptions } from 'discord-rose'

export default {
  command: 'library',
  category: 'misc',
  aliases: ['lib'],
  owner: false,
  locale: 'LIBRARY',
  exec: async (ctx) => {
    await ctx.reply('https://npm.im/discord-rose')
  }
} as CommandOptions
