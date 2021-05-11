import { CommandOptions } from 'discord-rose'

export default {
  name: 'Disable',
  usage: 'disable <command>',
  description: 'Disable a command globally',
  category: 'owner',
  command: 'disable',
  aliases: [],
  userPerms: [],
  myPerms: [],
  owner: true,
  exec: async (ctx) => {
    const command = ctx.args[0]
    if (!command) return await ctx.respond('CMD_DISABLE_NONE', { error: true })

    const cmd = ctx.worker.commands.commands?.find((c: CommandOptions) => c.command === command)
    if (cmd == null) return await ctx.respond('CMD_DISABLE_NOTFOUND', { error: true }, command)

    cmd.disabled = !cmd.disabled

    if (cmd.disabled) return await ctx.respond('CMD_DISABLE_DISABLED', {}, cmd.name)
    else await ctx.respond('CMD_DISABLE_DISABLED', {}, cmd.name)
  }
} as CommandOptions
