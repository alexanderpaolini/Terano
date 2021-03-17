import { CommandOptions } from 'discord-rose/dist/typings/lib'

export default {
  name: 'Dev Mode',
  usage: 'devmode',
  description: 'Toggle Developer-Only mode for the bot.',
  category: 'owner',
  command: 'devmode',
  aliases: [],
  permissions: [],
  botPermissions: [],
  owner: true,
  exec: async (ctx) => {
    if (ctx.worker.devmode) ctx.worker.devmode = false
    else ctx.worker.devmode = true
    await ctx.worker.responses.tiny(ctx, ctx.worker.colors.ORANGE, `${ctx.worker.devmode ? 'Enabled' : 'Disabled'} developer mode`)
  }
} as CommandOptions
