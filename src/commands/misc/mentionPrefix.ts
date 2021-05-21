import { CommandOptions } from '../../structures/CommandHandler'

export default {
  command: '',
  category: 'misc',
  aliases: ['lib'],
  locale: 'PREFIX',
  exec: async (ctx) => {
    if (!ctx.prefix.match(/[<@!>]/) || ctx.args.join('').replace(/ /g, '')) return false

    const prefix = await ctx.worker.db.guildDB.getPrefix(ctx.id)

    await ctx.respond('PREFIX_CURRENT', {}, prefix)
    return false
  }
} as CommandOptions<boolean>
