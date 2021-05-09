import { CommandOptions } from 'discord-rose'

export default {
  name: 'Language',
  usage: 'language <language>',
  description: 'Language!',
  category: 'moderation',
  command: 'lang',
  aliases: ['language'],
  userPerms: ['manageGuild'],
  myPerms: [],
  exec: async (ctx) => {
    if (!ctx.args[0]) return await ctx.respond('CURRENT_LANGUAGE')
    const lang = ctx.args[0]
    if (!ctx.worker.langs.langs.get(lang)) return await ctx.respond('NO_LANGUAGE', { error: true }, lang, Array.from(ctx.worker.langs.langs.keys()) as any as string)
    await ctx.worker.db.guildDB.setLang(ctx.getID, lang)
    await ctx.respond('LANGUAGE_UPDATED')
  }
} as CommandOptions
