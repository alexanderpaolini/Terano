import { CommandOptions } from 'discord-rose'

export default {
  command: 'throw',
  category: 'owner',
  locale: 'THROW',
  owner: true,
  exec: async (ctx) => {
    const err = ctx.args.join(' ') || 'ERROR'
    if (ctx.flags.respond) return await ctx.respond('ERROR', { error: true }, err)
    if (ctx.flags.safe) return await ctx.error(err)
    throw new Error(err)
  }
} as CommandOptions
