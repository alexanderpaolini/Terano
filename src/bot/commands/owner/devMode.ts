import { CommandOptions } from 'discord-rose'

export default {
  name: 'Dev Mode',
  usage: 'devmode',
  description: 'Toggle Developer-Only mode for the bot.',
  category: 'owner',
  command: 'devmode',
  aliases: [],
  userPerms: [],
  myPerms: [],
  owner: true,
  exec: async (ctx) => {
    ctx.worker.devmode = !ctx.worker.devmode
    if (ctx.worker.devmode) return await ctx.respond('CMD_DEVMODE_ENABLED')
    else await ctx.respond('CMD_DEVMODE_DISABLED')
  }
} as CommandOptions
