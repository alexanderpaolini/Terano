import { CommandContext } from 'discord-rose/dist/typings/lib'

export default () => {
  return async (ctx: CommandContext) => {
    return !await ctx.worker.db.userDB.getBlacklist(ctx.message.author.id)
  }
}
