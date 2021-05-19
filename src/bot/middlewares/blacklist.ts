import { CommandContext } from '../structures/CommandContext'

export default () => {
  return async (ctx: CommandContext) => {
    return !await ctx.worker.db.userDB.getBlacklist(ctx.message.author.id)
  }
}
