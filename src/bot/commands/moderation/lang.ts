import { CommandOptions } from 'discord-rose'

export default {
  name: 'Language',
  usage: 'language <language>',
  description: 'Language!',
  category: 'moderation',
  command: 'lang',
  aliases: ['language'],
  permissions: ['manageGuild'],
  botPermissions: [],
  exec: async (ctx) => {
    if (!ctx.args[0]) return await ctx.respond('CURRENT_LANGUAGE')
    const lang = ctx.args[0]
    if (!ctx.worker.langs.cache.get(lang)) return await ctx.respond('NO_LANGUAGE', { error: true }, lang)
    await ctx.worker.db.guildDB.setLang(ctx.getID, lang)
    await ctx.respond('LANGUAGE_UPDATED')
  }
} as CommandOptions
