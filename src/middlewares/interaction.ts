import { CommandContext } from 'discord-rose'

import { MiddlewareFunc } from '.'

export default (): MiddlewareFunc => {
  return async (ctx: CommandContext) => {
    if (!ctx.command.interactionOnly) return true
    if (!ctx.isInteraction) {
      await ctx.error('This command can only be ran as a slash command')
      return false
    }
    return true
  }
}
