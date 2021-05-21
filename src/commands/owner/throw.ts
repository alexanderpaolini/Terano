import { CommandOptions } from '../../structures/CommandHandler'

export default {
  command: 'throw',
  category: 'owner',
  locale: 'THROW',
  owner: true,
  exec: async (ctx) => {
    const err = ctx.args.join(' ') || 'ERROR'
    if (ctx.flags.respond) {
      await ctx.respond('ERROR', { error: true }, err)
      return true
    }
    if (ctx.flags.safe) {
      await ctx.error(err)
      return true
    }
    throw new Error(err)
  }
} as CommandOptions<boolean>
