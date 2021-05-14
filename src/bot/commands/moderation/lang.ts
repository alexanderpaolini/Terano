import { CommandOptions } from 'discord-rose'

export default {
  command: 'lang',
  category: 'moderation',
  aliases: ['language'],
  userPerms: ['manageGuild'],
  locale: 'LANG',
  exec: async (ctx) => {
    if (!ctx.args[0]) {
      await ctx.respond('CURRENT_LANGUAGE')
      return true
    }

    const lang = ctx.args[0]
    if (!ctx.worker.langs.langs.get(lang)) {
      await ctx.respond('NO_LANGUAGE', { error: true }, lang, Array.from(ctx.worker.langs.langs.keys()) as any as string)
      return false
    }

    await ctx.worker.db.guildDB.setLang(ctx.id, lang)
    await ctx.respond('LANGUAGE_UPDATED')
    return true
  }
} as CommandOptions<boolean>
