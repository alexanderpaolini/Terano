import { CommandOptions } from 'discord-rose'

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
    await ctx.reply('<@277183033344524288>')
    ctx.invokeCooldown?.()
  }
} as CommandOptions
