import { CommandOptions } from 'discord-rose'

export default {
  name: 'Throw',
  usage: 'throw',
  description: 'throw',
  category: 'owner',
  command: 'throw',
  owner: true,
  exec: async (ctx) => {
    const err = ctx.args.join(' ') || 'ERROR'
    if (ctx.flags.respond) return await ctx.respond('ERROR', { error: true }, err)
    if (ctx.flags.safe) return await ctx.error(err)
    throw new Error(err)
  }
} as CommandOptions
