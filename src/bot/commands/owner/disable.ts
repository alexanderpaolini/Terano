import { CommandOptions } from 'discord-rose'

export default {
  command: 'disable',
  category: 'owner',
  locale: 'DISABLE',
  owner: true,
  exec: async (ctx) => {
    const command = ctx.args[0]
    if (!command) {
      await ctx.respond('CMD_DISABLE_NONE', { error: true })
      return false
    }

    const cmd = ctx.worker.commands.commands.find((c) => c.command === command)
    if (cmd == null) {
      await ctx.respond('CMD_DISABLE_NOTFOUND', { error: true }, command)
      return false
    }

    cmd.disabled = !cmd.disabled

    if (cmd.disabled) await ctx.respond('CMD_DISABLE_DISABLED', {}, String(cmd.command))
    else await ctx.respond('CMD_DISABLE_ENABLED', {}, String(cmd.command))
    return true
  }
} as CommandOptions<boolean>
