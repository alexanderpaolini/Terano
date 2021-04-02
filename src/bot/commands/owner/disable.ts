import { CommandOptions } from 'discord-rose'

export default {
  name: 'Disable',
  usage: 'disable <command>',
  description: 'Disable a command globally',
  category: 'owner',
  command: 'disable',
  aliases: [],
  permissions: [],
  botPermissions: [],
  owner: true,
  exec: async (ctx) => {
    const command = ctx.args[0]
    if (!command) return await ctx.normalResponse(ctx.worker.colors.RED, 'No command was given, please include a command.')

    const cmd = ctx.worker.commands.commands?.find((c: CommandOptions) => c.command === command)
    if (cmd == null) return ctx.normalResponse(ctx.worker.colors.RED, 'Command not found.')

    if (cmd.disabled) cmd.disabled = false
    else cmd.disabled = true

    await ctx.normalResponse(ctx.worker.colors.ORANGE, `${cmd.disabled ? 'Disabled' : 'Enabled'} command **${cmd.name}**`)
  }
} as CommandOptions
