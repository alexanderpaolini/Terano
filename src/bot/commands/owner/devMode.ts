import { CommandOptions } from 'discord-rose'

export default {
  command: 'devmode',
  category: 'owner',
  locale: 'DEVMODE',
  owner: true,
  exec: async (ctx) => {
    ctx.worker.devmode = !ctx.worker.devmode
    if (ctx.worker.devmode) await ctx.respond('CMD_DEVMODE_ENABLED')
    else await ctx.respond('CMD_DEVMODE_DISABLED')
    return true
  }
} as CommandOptions<boolean>
