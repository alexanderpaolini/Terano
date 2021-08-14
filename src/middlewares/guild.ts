import { CommandContext } from 'discord-rose'

import { MiddlewareFunc } from '.'

export default (): MiddlewareFunc => {
  return async (ctx: CommandContext) => {
    if (!ctx.command.guildOnly) return true
    if (!ctx.guild) {
      await ctx.error('This command can only be ran in a server')
      return false
    }
    return true
  }
}
