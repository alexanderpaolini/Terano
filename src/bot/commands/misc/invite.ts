import { CommandOptions } from 'discord-rose'

export default {
  command: 'invite',
  category: 'misc',
  aliases: ['inv'],
  locale: 'INVITE',
  exec: async (ctx) => {
    await ctx.reply('https://discord.com/oauth2/authorize?client_id=647256366280474626&permissions=8&scope=bot%20applications.commands')
    return true
  }
} as CommandOptions<boolean>
