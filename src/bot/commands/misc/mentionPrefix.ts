import { CommandOptions } from 'discord-rose'

export default {
  command: '',
  category: 'misc',
  aliases: ['lib'],
  locale: 'PREFIX',
  exec: async (ctx) => {
    if (!ctx.prefix.match(/[<@!>]/) || ctx.args.join('').replace(/ /g, '')) return

    const prefix = await ctx.worker.db.guildDB.getPrefix(ctx.getID)

    await ctx.respond('PREFIX_CURRENT', {}, prefix)
  }
} as CommandOptions
