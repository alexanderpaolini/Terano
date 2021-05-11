import { CommandContext } from 'discord-rose/dist/typings/lib'

export default () => {
  return async (ctx: CommandContext) => {
    if (ctx.command.owner) {
      const isOwner = !!await ctx.worker.db.userDB.getOwner(ctx.message.author.id)
      if (!isOwner) {
        await ctx.respond('NOT_OWNER', { error: true })
        return false
      }
    }
    return true
  }
}
