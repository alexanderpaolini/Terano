import { CommandContext } from 'discord-rose'

import { MiddlewareFunc } from '.'

export default (): MiddlewareFunc => {
  return async (ctx: CommandContext) => !ctx.command.disabled
}
