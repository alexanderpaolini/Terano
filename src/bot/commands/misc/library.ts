import { CommandOptions } from 'discord-rose'

export default {
  name: 'Library',
  usage: 'library',
  description: 'Get the library used.',
  category: 'misc',
  command: 'library',
  aliases: ['lib'],
  userPerms: [],
  myPerms: [],
  owner: false,
  exec: async (ctx) => {
    await ctx.reply('https://npm.im/discord-rose')
  }
} as CommandOptions
