import { CommandContext } from '../structures/CommandContext'

export default () => {
  return async (ctx: CommandContext) => {
    if (ctx.command.disabled ?? ctx.worker.devmode) {
      const isOwner = !!await ctx.worker.db.userDB.getOwner(ctx.message.author.id)
      if (isOwner) return true
      await ctx.respond('CMD_DISABLED', { color: ctx.worker.colors.ORANGE })
      return false
    }
    return true
  }
}
