import { CommandOptions } from 'discord-rose'

export default {
  name: 'Vote',
  usage: 'vote',
  description: 'Get the link to vote for the bot.',
  category: 'misc',
  command: 'vote',
  aliases: [],
  userPerms: [],
  myPerms: [],
  owner: false,
  exec: async (ctx) => {
    await ctx.reply('https://top.gg/bot/647256366280474626/vote')
  }
} as CommandOptions
