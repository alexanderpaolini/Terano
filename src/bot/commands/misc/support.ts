import { CommandOptions } from 'discord-rose'

export default {
  name: 'Support',
  usage: 'support',
  description: 'Get the link to the bot\'s support server.',
  category: 'misc',
  command: 'support',
  aliases: [],
  permissions: [],
  botPermissions: [],
  owner: false,
  exec: async (ctx) => {
    await ctx.reply('https://discord.gg/YzWsDrs2kw')
  }
} as CommandOptions
