import { CommandOptions } from 'discord-rose'

export default {
  command: 'stinky',
  category: 'misc',
  locale: 'STINKY',
  cooldown: 5e3,
  exec: async (ctx) => {
    await ctx.reply('<@277183033344524288>')
    ctx.invokeCooldown?.()
  }
} as CommandOptions
