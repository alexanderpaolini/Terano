import { CommandOptions } from 'discord-rose/dist/typings/lib'

export default {
  name: 'Berry',
  usage: 'stinky',
  description: 'Berry is stinky.',
  category: 'misc',
  command: 'stinky',
  aliases: ['jpbbitch'],
  permissions: [],
  botPermissions: [],
  owner: false,
  cooldown: 5e3,
  exec: async (ctx) => {
    await ctx.reply('<@142408079177285632>')
    ctx.invokeCooldown()
  }
} as CommandOptions
