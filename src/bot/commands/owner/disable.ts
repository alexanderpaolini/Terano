import { CommandOptions } from 'discord-rose/dist/typings/lib'

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
    if (!command) {
      await ctx.worker.responses.normal(ctx, ctx.worker.colors.RED, 'No command was given, please include a command.')
      return
    }

    const cmd = ctx.worker.commands.commands.find((c: CommandOptions) => c.command === command)
    if (cmd == null) return ctx.worker.responses.normal(ctx, ctx.worker.colors.RED, 'Command not found.')

    if (cmd.disabled) cmd.disabled = false
    else cmd.disabled = true

    await ctx.worker.responses.normal(ctx, ctx.worker.colors.ORANGE, `${cmd.disabled ? 'Disabled' : 'Enabled'} command **${cmd.name}**`)
  }
} as CommandOptions
