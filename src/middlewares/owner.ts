import { CommandContext } from 'discord-rose'

import { MiddlewareFunc } from '.'

export default (): MiddlewareFunc => {
  return async (ctx: CommandContext) => {
    if (!ctx.command.ownerOnly) return true
    const isOwner = await ctx.worker.db.users.getOwner(ctx.author.id)
    if (!isOwner) return false
    return true
  }
}
