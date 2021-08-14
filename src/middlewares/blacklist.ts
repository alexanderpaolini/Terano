import { CommandContext } from 'discord-rose'

import { MiddlewareFunc } from '.'

export default (): MiddlewareFunc => {
  return async (ctx: CommandContext) => !(await ctx.worker.db.users.getBlacklist(ctx.author.id))
}
